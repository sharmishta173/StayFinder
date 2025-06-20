import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiStar, FiHeart, FiShare2, FiMapPin, FiUser, FiCalendar, FiHome, FiCheck } from 'react-icons/fi';
import listingService, { Listing } from '../services/listingService';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [guests, setGuests] = useState(1);
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch listing details
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await listingService.getListingById(id);
        setListing(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch listing details. Please try again later.');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // Check if listing is in user's wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!id || !isAuthenticated) return;
      
      try {
        const { inWishlist } = await listingService.checkWishlist(id);
        setIsWishlisted(inWishlist);
      } catch (err) {
        console.error('Error checking wishlist status:', err);
      }
    };

    checkWishlistStatus();
  }, [id, isAuthenticated]);

  // Calculate total nights and price when dates change
  useEffect(() => {
    if (checkInDate && checkOutDate && listing) {
      const startDate = new Date(checkInDate);
      const endDate = new Date(checkOutDate);
      const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        setTotalNights(nights);
        setTotalPrice(nights * listing.pricePerNight);
      } else {
        setTotalNights(0);
        setTotalPrice(0);
      }
    } else {
      setTotalNights(0);
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, listing]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/listings/${id}` } });
      return;
    }

    if (!id) return;
    
    try {
      const { inWishlist } = await listingService.toggleWishlist(id);
      setIsWishlisted(inWishlist);
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const handleReserve = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/listings/${id}` } });
      return;
    }

    if (!checkInDate || !checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    navigate('/confirm-pay', {
      state: {
        listingId: id,
        checkInDate,
        checkOutDate,
        guests,
        totalPrice,
        listing
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div>
              <p className="text-sm text-red-700">{error || 'Listing not found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Listing Title and Actions */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center text-gray-700 mb-2 sm:mb-0">
            <div className="flex items-center mr-4">
              <FiStar className="text-yellow-500 mr-1" />
              <span className="font-medium">4.9</span>
              <span className="mx-1">·</span>
              <span className="underline">42 reviews</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="mr-1" />
              <span>{`${listing.location.city}, ${listing.location.state}, ${listing.location.country}`}</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <button 
              className="flex items-center text-gray-700 hover:text-gray-900"
              onClick={() => window.navigator.share({
                title: listing.title,
                text: `Check out this property on StayFinder: ${listing.title}`,
                url: window.location.href
              }).catch(err => console.log('Error sharing', err))}
            >
              <FiShare2 className="mr-1" />
              <span>Share</span>
            </button>
            <button 
              className="flex items-center text-gray-700 hover:text-gray-900"
              onClick={handleWishlistToggle}
            >
              <FiHeart className={`mr-1 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isWishlisted ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg overflow-hidden">
            <img 
              src={listing.images[activeImage] || 'https://via.placeholder.com/800x600?text=No+Image'} 
              alt={listing.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 hidden md:grid">
            {listing.images.slice(1, 5).map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img 
                  src={image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                  alt={`${listing.title} - ${index + 1}`}
                  className="w-full h-[195px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setActiveImage(index + 1)}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Thumbnail navigation for mobile */}
        <div className="flex space-x-2 mt-2 md:hidden overflow-x-auto py-2">
          {listing.images.map((image, index) => (
            <div 
              key={index} 
              className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 ${activeImage === index ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setActiveImage(index)}
            >
              <img 
                src={image || 'https://via.placeholder.com/100x100?text=No+Image'} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Listing Details */}
        <div className="lg:col-span-2">
          {/* Host Info */}
          <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {`Entire ${listing.propertyType} hosted by ${listing.host?.username || 'Host'}`}
              </h2>
              <p className="text-gray-700">
                {`${listing.numberOfGuests} guests · ${listing.bedrooms} bedrooms · ${listing.bathrooms} bathrooms`}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden">
                {listing.host?.profilePicture ? (
                  <img 
                    src={listing.host.profilePicture} 
                    alt={listing.host.username || 'Host'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100 text-primary-600">
                    <FiUser size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">About this place</h3>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>

          {/* Amenities */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What this place offers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center">
                  <FiCheck className="text-primary-600 mr-2" />
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Where you'll be</h3>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <div className="flex items-center text-gray-700 mb-2">
                <FiMapPin className="mr-2" />
                <span>{`${listing.location.streetAddress}, ${listing.location.city}, ${listing.location.state}, ${listing.location.country}`}</span>
              </div>
            </div>
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img 
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
                  `${listing.location.city},${listing.location.country}`
                )}&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(
                  `${listing.location.city},${listing.location.country}`
                )}&key=YOUR_GOOGLE_MAPS_API_KEY`} 
                alt="Map location"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(listing.pricePerNight)} <span className="text-base font-normal">night</span>
              </div>
              <div className="flex items-center">
                <FiStar className="text-yellow-500 mr-1" />
                <span className="font-medium">4.9</span>
                <span className="mx-1 text-gray-500">·</span>
                <span className="text-gray-500 underline">42 reviews</span>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg mb-4">
              <div className="grid grid-cols-2 divide-x divide-gray-300">
                <div className="p-3">
                  <label htmlFor="check-in" className="block text-xs font-medium text-gray-700 mb-1">CHECK-IN</label>
                  <input 
                    type="date" 
                    id="check-in"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-none p-0 focus:ring-0 text-gray-900"
                  />
                </div>
                <div className="p-3">
                  <label htmlFor="check-out" className="block text-xs font-medium text-gray-700 mb-1">CHECK-OUT</label>
                  <input 
                    type="date" 
                    id="check-out"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || new Date().toISOString().split('T')[0]}
                    className="w-full border-none p-0 focus:ring-0 text-gray-900"
                  />
                </div>
              </div>
              <div className="border-t border-gray-300 p-3">
                <label htmlFor="guests" className="block text-xs font-medium text-gray-700 mb-1">GUESTS</label>
                <select
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="w-full border-none p-0 focus:ring-0 text-gray-900"
                >
                  {[...Array(listing.numberOfGuests)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1} guest{i !== 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              className="btn-primary w-full py-3 mb-4"
              onClick={handleReserve}
              disabled={!checkInDate || !checkOutDate}
            >
              Reserve
            </button>

            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            <div className="text-center text-gray-500 text-sm mb-4">
              You won't be charged yet
            </div>

            {totalNights > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="text-gray-700 underline">
                    {formatCurrency(listing.pricePerNight)} x {totalNights} nights
                  </div>
                  <div className="text-gray-700">
                    {formatCurrency(listing.pricePerNight * totalNights)}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-700 underline">Cleaning fee</div>
                  <div className="text-gray-700">{formatCurrency(500)}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-700 underline">Service fee</div>
                  <div className="text-gray-700">{formatCurrency(Math.round(totalPrice * 0.1))}</div>
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <div>Total</div>
                    <div>{formatCurrency(totalPrice + 500 + Math.round(totalPrice * 0.1))}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailPage;