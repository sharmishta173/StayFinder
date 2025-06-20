import api from './api';
import { Listing } from './listingService';
import { User } from './authService';

export interface Booking {
  _id: string;
  listing: Listing | string;
  guest: User | string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod?: 'upi' | 'card';
  paymentId?: string;
  currency: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  listingId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  paymentMethod?: 'upi' | 'card';
  specialRequests?: string;
}

export interface PaymentData {
  paymentMethod: 'upi' | 'card';
  paymentId?: string;
  // For card payments
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  // For UPI payments
  upiId?: string;
}

const bookingService = {
  // Create a new booking
  createBooking: async (bookingData: CreateBookingData): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings (as a guest)
  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/user/me');
    return response.data;
  },

  // Get host's bookings (for their listings)
  getHostBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/host/me');
    return response.data;
  },

  // Get a single booking by ID
  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  // Process payment for a booking
  processPayment: async (id: string, paymentData: PaymentData): Promise<{ success: boolean; message: string; booking?: Booking }> => {
    try {
      // Validate input parameters
      if (!id) {
        throw new Error('Booking ID is required for payment processing');
      }
      
      if (!paymentData || !paymentData.paymentMethod) {
        throw new Error('Payment method is required');
      }
      
      // Log payment request details (excluding sensitive data)
      console.log(`Sending payment request for booking ${id}:`, { 
        paymentMethod: paymentData.paymentMethod,
        // Only log masked versions of sensitive data
        ...(paymentData.upiId ? { upiIdMasked: `${paymentData.upiId.substring(0, 3)}...` } : {}),
        ...(paymentData.cardNumber ? { cardNumberMasked: `xxxx-xxxx-xxxx-${paymentData.cardNumber.slice(-4)}` } : {})
      });
      
      // Make the API request
      const response = await api.post(`/bookings/${id}/payment`, paymentData);
      
      // Log successful response
      console.log('Payment API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Payment processing error:', error);
      
      // If the server returned an error response
      if (error.response) {
        console.error('Server error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
        
        // Handle specific HTTP status codes with more detailed messages
        if (error.response.status === 404) {
          return {
            success: false,
            message: 'Booking not found. Please try again or contact support.'
          };
        } else if (error.response.status === 400) {
          // More specific error messages for validation failures
          const errorMsg = error.response.data.message || '';
          if (errorMsg.includes('UPI')) {
            return {
              success: false,
              message: 'Please enter a valid UPI ID in the format username@bank'
            };
          } else if (errorMsg.includes('card')) {
            return {
              success: false,
              message: 'Please check your card details and try again'
            };
          } else if (errorMsg.includes('already been paid')) {
            return {
              success: false,
              message: 'This booking has already been paid for. No need to pay again.'
            };
          } else {
            return {
              success: false,
              message: error.response.data.message || 'Invalid payment details. Please check and try again.'
            };
          }
        } else if (error.response.status === 403) {
          return {
            success: false,
            message: 'You are not authorized to make this payment. Please ensure you are logged in.'
          };
        } else if (error.response.status === 500) {
          return {
            success: false,
            message: 'The server encountered an error while processing your payment. Please try again later or contact support.'
          };
        } else {
          return {
            success: false,
            message: error.response.data.message || 'Payment failed. Please try again.'
          };
        }
      }
      
      // If the request was made but no response was received (network error)
      if (error.request) {
        console.error('Network error - no response received');
        return {
          success: false,
          message: 'Network error. Please check your internet connection and try again later.'
        };
      }
      
      // Something else happened while setting up the request
      return {
        success: false,
        message: error.message || 'An unexpected error occurred while processing your payment. Please try again.'
      };
    }
  },

  // Calculate total price for a booking
  calculatePrice: (pricePerNight: number, checkInDate: Date, checkOutDate: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((checkOutDate.getTime() - checkInDate.getTime()) / oneDay));
    return pricePerNight * diffDays;
  },
};

export default bookingService;