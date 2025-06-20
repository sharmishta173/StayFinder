import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiCheck, FiX, FiClock, FiInfo } from 'react-icons/fi';
import bookingService, { Booking } from '../services/bookingService';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-toastify';

const HostBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [actionConfirmation, setActionConfirmation] = useState<{bookingId: string, action: 'confirm' | 'cancel'} | null>(null);

  useEffect(() => {
    const fetchHostBookings = async () => {
      try {
        setLoading(true);
        const hostBookings = await bookingService.getHostBookings();
        setBookings(hostBookings);
        setError(null);
      } catch (err) {
        console.error('Error fetching host bookings:', err);
        setError('Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHostBookings();
  }, []);

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'confirmed');
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'confirmed' } : booking
      ));
      setActionConfirmation(null);
      toast.success('Booking confirmed successfully');
    } catch (err) {
      console.error('Error confirming booking:', err);
      toast.error('Failed to confirm booking. Please try again.');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await bookingService.updateBookingStatus(bookingId, 'cancelled');
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
      ));
      setActionConfirmation(null);
      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking. Please try again.');
    }
  };

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeTab);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          All Bookings
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'pending' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab('confirmed')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'confirmed' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'completed' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`py-2 px-4 text-sm font-medium ${activeTab === 'cancelled' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Cancelled
        </button>
      </div>
      
      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiCalendar className="text-5xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Bookings Yet</h2>
          <p className="text-gray-600">You don't have any bookings for your properties yet.</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiInfo className="text-5xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No {activeTab} Bookings</h2>
          <p className="text-gray-600">You don't have any {activeTab} bookings at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {typeof booking.guest === 'object' ? booking.guest.username : 'Guest'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {typeof booking.guest === 'object' ? booking.guest.email : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        to={`/listings/${typeof booking.listing === 'object' ? booking.listing._id : booking.listing}`} 
                        className="text-sm text-primary-600 hover:underline"
                      >
                        {typeof booking.listing === 'object' ? booking.listing.title : 'Listing'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(booking.checkInDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">to {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">
                        {Math.ceil((new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} nights
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.numberOfGuests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(booking.totalPrice, booking.currency || 'INR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'}`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link to={`/host/bookings/${booking._id}`} className="text-gray-600 hover:text-gray-900" title="View Details">
                          <FiInfo />
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => setActionConfirmation({bookingId: booking._id, action: 'confirm'})} 
                              className="text-green-600 hover:text-green-900"
                              title="Confirm Booking"
                            >
                              <FiCheck />
                            </button>
                            <button 
                              onClick={() => setActionConfirmation({bookingId: booking._id, action: 'cancel'})} 
                              className="text-red-600 hover:text-red-900"
                              title="Cancel Booking"
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <button 
                            onClick={() => setActionConfirmation({bookingId: booking._id, action: 'cancel'})} 
                            className="text-red-600 hover:text-red-900"
                            title="Cancel Booking"
                          >
                            <FiX />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {actionConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {actionConfirmation.action === 'confirm' ? 'Confirm Booking' : 'Cancel Booking'}
            </h3>
            <p className="text-gray-600 mb-6">
              {actionConfirmation.action === 'confirm' 
                ? 'Are you sure you want to confirm this booking?' 
                : 'Are you sure you want to cancel this booking? This action cannot be undone.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setActionConfirmation(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                No, Go Back
              </button>
              <button
                onClick={() => 
                  actionConfirmation.action === 'confirm' 
                    ? handleConfirmBooking(actionConfirmation.bookingId)
                    : handleCancelBooking(actionConfirmation.bookingId)
                }
                className={`px-4 py-2 text-white rounded-md ${actionConfirmation.action === 'confirm' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Yes, {actionConfirmation.action === 'confirm' ? 'Confirm' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostBookingsPage;