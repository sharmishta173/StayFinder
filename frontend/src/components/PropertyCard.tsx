import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiStar } from 'react-icons/fi';
import { Listing } from '../services/listingService';
import { formatCurrency } from '../utils/formatCurrency';

interface PropertyCardProps {
  listing: Listing;
  onWishlistToggle?: (listingId: string) => void;
  isInWishlist?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  listing, 
  onWishlistToggle,
  isInWishlist = false
}) => {
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWishlistToggle) {
      onWishlistToggle(listing._id);
    }
  };

  return (
    <Link to={`/listings/${listing._id}`} className="block">
      <div className="card h-full transition-transform hover:scale-[1.02] duration-200">
        {/* Image container with relative positioning for wishlist button */}
        <div className="relative overflow-hidden rounded-t-xl aspect-[4/3]">
          <img
            src={listing.images[0]?.startsWith('http') 
              ? listing.images[0] 
              : `${process.env.REACT_APP_API_URL}/${listing.images[0]}`}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          
          {/* Wishlist button */}
          {onWishlistToggle && (
            <button
              onClick={handleWishlistClick}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart 
                className={`text-lg ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} 
              />
            </button>
          )}
          
          {/* Guest favorite badge */}
          {listing.isGuestFavorite && (
            <div className="absolute top-3 left-3 bg-white/90 text-xs font-medium px-2 py-1 rounded-full">
              Guest favorite
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 truncate">
              {listing.location.city}, {listing.location.state}
            </h3>
            {listing.rating && (
              <div className="flex items-center">
                <FiStar className="text-yellow-500 fill-yellow-500 mr-1" />
                <span className="text-sm">{listing.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-500 text-sm mt-1 line-clamp-1">{listing.title}</p>
          
          <div className="mt-2">
            <p className="font-medium">
              {formatCurrency(listing.pricePerNight)} <span className="font-normal text-gray-500">night</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;