import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';
import listingService, { Listing } from '../services/listingService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-toastify';

const HostListingsPage: React.FC = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHostListings = async () => {
      if (!user?._id) return;
      
      try {
        setLoading(true);
        const hostListings = await listingService.getListingsByHost(user._id);
        setListings(hostListings);
        setError(null);
      } catch (err) {
        console.error('Error fetching host listings:', err);
        setError('Failed to load your listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHostListings();
  }, [user]);

  const handleDeleteListing = async (listingId: string) => {
    try {
      await listingService.deleteListing(listingId);
      setListings(listings.filter(listing => listing._id !== listingId));
      setDeleteConfirmation(null);
      toast.success('Listing deleted successfully');
    } catch (err) {
      console.error('Error deleting listing:', err);
      toast.error('Failed to delete listing. Please try again.');
    }
  };

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
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link 
          to="/host/listings/new" 
          className="flex items-center bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
        >
          <FiPlus className="mr-2" /> Add New Listing
        </Link>
      </div>
      
      {listings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiHome className="text-5xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No Listings Yet</h2>
          <p className="text-gray-600 mb-6">You haven't created any listings yet. Start hosting by creating your first property listing.</p>
          <Link 
            to="/host/listings/new" 
            className="inline-block bg-primary-600 text-white py-2 px-6 rounded-md hover:bg-primary-700 transition-colors"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                {listings.map((listing) => (
                  <tr key={listing._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 mr-4">
                          {listing.images && listing.images.length > 0 ? (
                            <img 
                              className="h-16 w-16 rounded-md object-cover" 
                              src={listing.images[0].startsWith('http') 
                                ? listing.images[0] 
                                : `${process.env.REACT_APP_API_URL}/${listing.images[0]}`} 
                              alt="" 
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                              <FiHome className="text-gray-500 text-xl" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                          <div className="text-sm text-gray-500">{listing.propertyType} • {listing.bedrooms} bed{listing.bedrooms !== 1 ? 's' : ''} • {listing.bathrooms} bath{listing.bathrooms !== 1 ? 's' : ''}</div>
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
                      <div className="flex space-x-3">
                        <Link to={`/listings/${listing._id}`} className="text-gray-600 hover:text-gray-900" title="View">
                          <FiEye />
                        </Link>
                        <Link to={`/host/listings/${listing._id}/edit`} className="text-blue-600 hover:text-blue-900" title="Edit">
                          <FiEdit />
                        </Link>
                        <button 
                          onClick={() => setDeleteConfirmation(listing._id)} 
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      
                      {/* Delete Confirmation Modal */}
                      {deleteConfirmation === listing._id && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete "{listing.title}"? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-3">
                              <button
                                onClick={() => setDeleteConfirmation(null)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteListing(listing._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostListingsPage;