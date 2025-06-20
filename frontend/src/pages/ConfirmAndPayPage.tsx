import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiCreditCard, FiSmartphone, FiAlertCircle, FiCheck } from 'react-icons/fi';
import bookingService from '../services/bookingService';
import { Listing } from '../services/listingService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate, calculateNights } from '../utils/formatDate';

interface LocationState {
  listingId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  listing: Listing;
}

const ConfirmAndPayPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth(); // Renamed but not used in this component yet
  
  const [bookingData, setBookingData] = useState<LocationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    // Get booking data from location state
    const state = location.state as LocationState;
    if (!state) {
      navigate('/');
      return;
    }
    setBookingData(state);
  }, [location, navigate]);

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentDetails = (): boolean => {
    if (paymentMethod === 'upi') {
      if (!upiId || !/[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}/.test(upiId)) {
        setError('Please enter a valid UPI ID');
        return false;
      }
    } else if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length !== 16) {
        setError('Please enter a valid 16-digit card number');
        return false;
      }
      if (!cardDetails.name) {
        setError('Please enter the cardholder name');
        return false;
      }
      if (!cardDetails.expiry || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardDetails.expiry)) {
        setError('Please enter a valid expiry date (MM/YY)');
        return false;
      }
      if (!cardDetails.cvv || !/^[0-9]{3,4}$/.test(cardDetails.cvv)) {
        setError('Please enter a valid CVV');
        return false;
      }
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!bookingData) return;
    if (!validatePaymentDetails()) return;

    try {
      setLoading(true);
      console.log('Starting booking process...');

      // Create booking
      const bookingResponse = await bookingService.createBooking({
        listingId: bookingData.listingId,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.guests,
        totalPrice: bookingData.totalPrice + 500 + Math.round(bookingData.totalPrice * 0.1), // Including fees
        paymentMethod // Ensure payment method is sent
      });

      console.log('Booking created successfully:', bookingResponse);

      // Process payment
      const paymentData = {
        paymentMethod,
        ...(paymentMethod === 'upi' ? { upiId } : {
          cardNumber: cardDetails.number.replace(/\s/g, ''),
          cardExpiry: cardDetails.expiry,
          cardCvv: cardDetails.cvv
        })
      };
      
      console.log('Processing payment for booking ID:', bookingResponse._id);
      
      try {
        const paymentResponse = await bookingService.processPayment(bookingResponse._id, paymentData);

        console.log('Payment response:', paymentResponse);

        if (paymentResponse.success) {
          setBookingId(bookingResponse._id);
          setBookingSuccess(true);
          // Show confirmation message
          alert('Confirmed reservation!');
        } else {
          // Handle payment failure from server
          setError(paymentResponse.message || 'Payment processing failed. Please try again.');
        }
      } catch (paymentError: any) {
        console.error('Payment processing error:', paymentError);
        // Show backend error message if available
        setError(
          paymentError.response?.data?.message ||
          paymentError.message ||
          'Payment processing failed. Please try again.'
        );
      }
    } catch (err: any) {
      // Handle different types of errors
      console.error('Booking error details:', err);
      // Show backend error message if available
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to complete booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheck className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">Booking Successful!</h3>
              <div className="mt-2 text-green-700">
                <p>Your booking has been confirmed. We've sent a confirmation email with all the details.</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => navigate(`/trips`)}
                >
                  View My Trips
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
          
          <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                <img 
                  src={bookingData.listing.images[0] || 'https://via.placeholder.com/100x100?text=No+Image'} 
                  alt={bookingData.listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{bookingData.listing.title}</h3>
                <p className="text-gray-600">{`${bookingData.listing.location.city}, ${bookingData.listing.location.state}, ${bookingData.listing.location.country}`}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Your trip</h3>
              <div className="space-y-3">
                <div className="flex">
                  <FiCalendar className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Dates</p>
                    <p className="text-gray-600">{formatDate(bookingData.checkInDate)} - {formatDate(bookingData.checkOutDate)}</p>
                  </div>
                </div>
                <div className="flex">
                  <FiUser className="mt-1 mr-3 text-gray-500" />
                  <div>
                    <p className="font-medium">Guests</p>
                    <p className="text-gray-600">{bookingData.guests} guest{bookingData.guests !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Price details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-600">{formatCurrency(bookingData.listing.pricePerNight)} x {calculateNights(bookingData.checkInDate, bookingData.checkOutDate)} nights</p>
                  <p className="text-gray-900">{formatCurrency(bookingData.totalPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Cleaning fee</p>
                  <p className="text-gray-900">{formatCurrency(500)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Service fee</p>
                  <p className="text-gray-900">{formatCurrency(Math.round(bookingData.totalPrice * 0.1))}</p>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <p>Total (INR)</p>
                    <p>{formatCurrency(bookingData.totalPrice + 500 + Math.round(bookingData.totalPrice * 0.1))}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirm and Pay</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Payment Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trip Details */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your trip</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Dates</h3>
                  <p className="text-gray-900">{formatDate(bookingData.checkInDate)} - {formatDate(bookingData.checkOutDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Guests</h3>
                  <p className="text-gray-900">{bookingData.guests} guest{bookingData.guests !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pay with</h2>
              
              <div className="mb-4">
                <div className="flex space-x-4 mb-6">
                  <div 
                    className={`flex-1 border rounded-lg p-4 cursor-pointer ${paymentMethod === 'upi' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="upi" 
                        name="paymentMethod" 
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="upi" className="ml-2 block text-sm font-medium text-gray-700">
                        UPI
                      </label>
                    </div>
                  </div>
                  <div 
                    className={`flex-1 border rounded-lg p-4 cursor-pointer ${paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="card" 
                        name="paymentMethod" 
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="card" className="ml-2 block text-sm font-medium text-gray-700">
                        Credit or Debit Card
                      </label>
                    </div>
                  </div>
                </div>

                {paymentMethod === 'upi' ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiSmartphone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="upiId"
                          name="upiId"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@upi"
                          className="input pl-10"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Enter your UPI ID (e.g., name@okaxis)</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-center mb-4">
                        <div className="w-40 h-40 bg-white p-2 rounded-lg shadow-sm flex items-center justify-center">
                          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="120" height="120" rx="12" fill="#F3F4F6"/>
                            <rect x="10" y="10" width="20" height="20" fill="#111827"/>
                            <rect x="90" y="10" width="20" height="20" fill="#111827"/>
                            <rect x="10" y="90" width="20" height="20" fill="#111827"/>
                            <rect x="90" y="90" width="20" height="20" fill="#111827"/>
                            <rect x="40" y="40" width="8" height="8" fill="#111827"/>
                            <rect x="60" y="40" width="8" height="8" fill="#111827"/>
                            <rect x="40" y="60" width="8" height="8" fill="#111827"/>
                            <rect x="60" y="60" width="8" height="8" fill="#111827"/>
                            <rect x="80" y="50" width="6" height="6" fill="#111827"/>
                            <rect x="50" y="80" width="6" height="6" fill="#111827"/>
                            <rect x="30" y="70" width="4" height="4" fill="#111827"/>
                            <rect x="70" y="30" width="4" height="4" fill="#111827"/>
                          </svg>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">Scan this QR code with any UPI app to pay</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="number"
                          name="number"
                          value={cardDetails.number}
                          onChange={handleCardDetailsChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="input pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={cardDetails.name}
                        onChange={handleCardDetailsChange}
                        placeholder="John Doe"
                        className="input"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleCardDetailsChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="input"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={cardDetails.cvv}
                          onChange={handleCardDetailsChange}
                          placeholder="123"
                          maxLength={4}
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancellation policy</h2>
              <p className="text-gray-700 mb-4">
                Free cancellation before {formatDate(bookingData.checkInDate, { addDays: -7 })}. Cancel before check-in on {formatDate(bookingData.checkInDate)} for a partial refund.
              </p>
              <p className="text-sm text-gray-500">
                Review the host's full cancellation policy which applies even if you cancel for illness or disruptions caused by COVID-19.
              </p>
            </div>

            {/* Ground Rules */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Ground rules</h2>
              <p className="text-gray-700 mb-4">
                We ask every guest to remember a few simple things about what makes a great guest.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Follow the house rules</li>
                <li>Treat the host's home like your own</li>
                <li>Communicate with your host</li>
              </ul>
            </div>

            {/* Terms Agreement */}
            <div className="mb-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-700">
                    I agree to the <span className="text-primary-600">Terms of Service</span>, <span className="text-primary-600">Payments Terms of Service</span>, and <span className="text-primary-600">Privacy Policy</span>. I acknowledge the cancellation policy.
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                `Confirm and Pay ${formatCurrency(bookingData.totalPrice + 500 + Math.round(bookingData.totalPrice * 0.1))}`
              )}
            </button>
          </form>
        </div>

        {/* Right Column - Booking Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-start mb-6">
              <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                <img 
                  src={bookingData.listing.images[0] || 'https://via.placeholder.com/100x100?text=No+Image'} 
                  alt={bookingData.listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{bookingData.listing.title}</h3>
                <p className="text-gray-600">{`${bookingData.listing.location.city}, ${bookingData.listing.location.state}, ${bookingData.listing.location.country}`}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Price details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-gray-600">{formatCurrency(bookingData.listing.pricePerNight)} x {calculateNights(bookingData.checkInDate, bookingData.checkOutDate)} nights</p>
                  <p className="text-gray-900">{formatCurrency(bookingData.totalPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Cleaning fee</p>
                  <p className="text-gray-900">{formatCurrency(500)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Service fee</p>
                  <p className="text-gray-900">{formatCurrency(Math.round(bookingData.totalPrice * 0.1))}</p>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <p>Total (INR)</p>
                    <p>{formatCurrency(bookingData.totalPrice + 500 + Math.round(bookingData.totalPrice * 0.1))}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAndPayPage;