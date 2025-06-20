import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import listingService, { Listing } from '../services/listingService';

const HomePage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Popular destinations in India
  const popularDestinations = [
    { name: 'Pondicherry', image: 'https://images.unsplash.com/photo-1677951221673-09be408d2ddf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHBvbmRpY2hlcnJ5fGVufDB8fDB8fHww' },
    { name: 'North Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80' },
    { name: 'Ooty', image: 'https://images.unsplash.com/photo-1638886540342-240980f60d25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8b290eXxlbnwwfHwwfHx8MA%3D%3D' },
    { name: 'Mysore', image: 'https://plus.unsplash.com/premium_photo-1697729434815-40ab4970ebc1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bXlzb3JlfGVufDB8fDB8fHww' },
    { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SmFpcHVyfGVufDB8fDB8fHww'},
    { name: 'Darjeeling', image: 'https://images.unsplash.com/photo-1622308644420-b20142dc993c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGFyamVlbGluZ3xlbnwwfHwwfHx8MA%3D%3D'},
    { name: 'Munnar', image: 'https://plus.unsplash.com/premium_photo-1697730314165-2cd71dc3a6a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bXVubmFyfGVufDB8fDB8fHww' },
    { name: 'Andaman', image: 'https://images.unsplash.com/photo-1642498232612-a837df233825?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW5kYW1hbnxlbnwwfHwwfHx8MA%3D%3D'}
  ];

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await listingService.getFeaturedListings();
        setListings(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch listings. Please try again later.');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 text-white" style={{ backgroundImage: 'url("/images/india-collage.svg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {/* Black overlay for better text contrast */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">
            Find your perfect stay in India
          </h1>
          <p className="max-w-xl text-xl sm:text-2xl mb-12">
            Discover unique homes, experiences, and places across India
          </p>
          
          {/* Search Bar Component */}
          <div className="max-w-5xl mx-auto">
            <SearchBar className="transform transition-all duration-300 hover:shadow-xl" />
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular destinations in India</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {popularDestinations.map((destination, index) => (
            <Link 
              key={index} 
              to={`/search?location=${destination.name}`}
              className="group relative rounded-lg overflow-hidden bg-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div className="flex items-center text-white">
                  <FiMapPin className="mr-1" />
                  <span className="font-medium">{destination.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured stays</h2>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.length > 0 ? (
              listings.map((listing) => (
                <PropertyCard key={listing._id} listing={listing} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">No featured listings available at the moment.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Become a Host CTA */}
      <div className="bg-gray-100 py-16 px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Host</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Earn extra income by sharing your property with travelers from around the world.
          </p>
          <Link 
            to="/host/listings" 
            className="btn-primary inline-block px-8 py-3 text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;