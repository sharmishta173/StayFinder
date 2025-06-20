import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCalendar, FiDollarSign, FiUsers, FiPlus } from 'react-icons/fi';
import listingService, { Listing } from '../services/listingService';
import bookingService, { Booking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';

const HostDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dashboard stats
  const [stats, setStats] = useState({
    totalListings: 0,
    activeBookings: 0,
    totalEarnings: 0,
    averageRating: 0
  });

  useEffect(() => {
    const fetchHostData = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        
        // Fetch host listings
        const hostListings = await listingService.getListingsByHost(user._id);
        setListings(hostListings);
        
        // Fetch host bookings
        const hostBookings = await bookingService.getHostBookings();
        setBookings(hostBookings);
        
        // Calculate dashboard stats
        const activeBookingsCount = hostBookings.filter(booking => 
          booking.status === 'confirmed' || booking.status === 'pending'
        ).length;
        
        const totalEarnings = hostBookings
          .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
          .reduce((sum, booking) => sum + booking.totalPrice, 0);
        
        const listingsWithRatings = hostListings.filter((listing: Listing) => listing.rating !== undefined && listing.rating > 0);
        const avgRating = listingsWithRatings.length > 0 
          ? listingsWithRatings.reduce((sum: number, listing: Listing) => sum + (listing.rating || 0), 0) / listingsWithRatings.length 
          : 0;
        
        setStats({
          totalListings: hostListings.length,
          activeBookings: activeBookingsCount,
          totalEarnings: totalEarnings,
          averageRating: avgRating
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching host data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, [user]);

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Host Dashboard</h1>
        <Link 
          to="/host/listings/new" 
          className="flex items-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Add New Listing
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FiHome className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Listings</p>
              <h3 className="text-2xl font-bold">{stats.totalListings}</h3>
            </div>
          </div>
          <Link to="/host/listings" className="text-primary-600 text-sm hover:underline">View all listings</Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiCalendar className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Bookings</p>
              <h3 className="text-2xl font-bold">{stats.activeBookings}</h3>
            </div>
          </div>
          <Link to="/host/bookings" className="text-primary-600 text-sm hover:underline">View all bookings</Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FiDollarSign className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <h3 className="text-2xl font-bold">{formatCurrency(stats.totalEarnings, 'INR')}</h3>
            </div>
          </div>
          <Link to="/host/bookings" className="text-primary-600 text-sm hover:underline">View earnings details</Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FiUsers className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Average Rating</p>
              <h3 className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</h3>
            </div>
          </div>
          <Link to="/host/reviews" className="text-primary-600 text-sm hover:underline">View all reviews</Link>
        </div>
      </div>
      
      {/* Recent Listings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Listings</h2>
        
        {listings.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">You don't have any listings yet.</p>
            <Link 
              to="/host/listings/new" 
              className="inline-block bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {listings.slice(0, 5).map((listing) => (
                  <tr key={listing._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {listing.images && listing.images.length > 0 ? (
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={listing.images[0].startsWith('http') 
                                ? listing.images[0] 
                                : `${process.env.REACT_APP_API_URL}/${listing.images[0]}`} 
                              alt="" 
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                              <FiHome className="text-gray-500" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                          <div className="text-sm text-gray-500">{listing.propertyType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(listing.pricePerNight, listing.currency || 'INR')}</div>
                      <div className="text-sm text-gray-500">per night</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{listing.location.city}</div>
                      <div className="text-sm text-gray-500">{listing.location.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/host/listings/${listing._id}/edit`} className="text-primary-600 hover:text-primary-900 mr-4">Edit</Link>
                      <Link to={`/listings/${listing._id}`} className="text-gray-600 hover:text-gray-900">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {listings.length > 5 && (
              <div className="mt-4 text-center">
                <Link to="/host/listings" className="text-primary-600 hover:underline">View all listings</Link>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        
        {bookings.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">You don't have any bookings yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listing</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {typeof booking.guest === 'object' ? booking.guest.username : 'Guest'}
                      </div>
                      <div className="text-sm text-gray-500">{booking.numberOfGuests} guests</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {typeof booking.listing === 'object' ? booking.listing.title : 'Listing'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(booking.checkInDate).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">to {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(booking.totalPrice, booking.currency || 'INR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/host/bookings/${booking._id}`} className="text-primary-600 hover:text-primary-900">View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {bookings.length > 5 && (
              <div className="mt-4 text-center">
                <Link to="/host/bookings" className="text-primary-600 hover:underline">View all bookings</Link>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <Link to="/host/bookings" className="btn-primary">View All Bookings</Link>
      </div>
    </div>
  );
};

export default HostDashboardPage;