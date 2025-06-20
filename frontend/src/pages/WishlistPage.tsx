import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';
import listingService, { Listing } from '../services/listingService';
import PropertyCard from '../components/PropertyCard';

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await listingService.getWishlist();
        setWishlist(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load your wishlist. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleWishlistToggle = async (listingId: string) => {
    try {
      await listingService.toggleWishlist(listingId);
      // Remove the listing from the wishlist
      setWishlist(prev => prev.filter(listing => listing._id !== listingId));
    } catch (err) {
      console.error('Error toggling wishlist:', err);
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
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-4">Save your favorite places by clicking the heart icon on any listing.</p>
          <Link 
            to="/" 
            className="inline-block bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
          >
            Explore Stays
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map(listing => (
            <PropertyCard 
              key={listing._id} 
              listing={listing} 
              onWishlistToggle={handleWishlistToggle}
              isInWishlist={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;