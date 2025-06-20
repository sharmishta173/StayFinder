import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import FilterBar, { FilterOptions } from '../components/FilterBar';
import listingService, { Listing } from '../services/listingService';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const locationParam = searchParams.get('location');
  const checkInParam = searchParams.get('checkIn');
  const checkOutParam = searchParams.get('checkOut');
  const guestsParam = searchParams.get('guests');

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalListings, setTotalListings] = useState(0);
  const [filters, setFilters] = useState<FilterOptions>({});

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        // If we have a location parameter, use getListingsByLocation
        if (locationParam) {
          // When using location-based search, we still want to apply other filters
          // But we need to handle this client-side since the backend API doesn't support
          // combining location search with other filters directly
          const data = await listingService.getListingsByLocation(locationParam);
          
          // Apply client-side filtering if any filters are set
          let filteredData = [...data];
          
          // Apply price filters
          if (filters.minPrice !== undefined) {
            filteredData = filteredData.filter(listing => listing.pricePerNight >= filters.minPrice!);
          }
          
          if (filters.maxPrice !== undefined) {
            filteredData = filteredData.filter(listing => listing.pricePerNight <= filters.maxPrice!);
          }
          
          // Apply property type filter
          if (filters.propertyType) {
            filteredData = filteredData.filter(listing => listing.propertyType === filters.propertyType);
          }
          
          // Apply bedrooms filter
          if (filters.bedrooms !== undefined) {
            filteredData = filteredData.filter(listing => listing.bedrooms >= filters.bedrooms!);
          }
          
          // Apply amenities filter
          if (filters.amenities && filters.amenities.length > 0) {
            filteredData = filteredData.filter(listing => 
              filters.amenities!.every(amenity => listing.amenities.includes(amenity))
            );
          }
          
          setListings(filteredData);
          setTotalListings(filteredData.length);
        } else {
          // Otherwise use the regular getListings with filters
          const apiFilters: any = {};
          
          // Add search params from URL
          if (checkInParam) apiFilters.checkIn = checkInParam;
          if (checkOutParam) apiFilters.checkOut = checkOutParam;
          if (guestsParam) apiFilters.guests = parseInt(guestsParam);
          
          // Add filters from FilterBar
          if (filters.minPrice !== undefined) apiFilters.minPrice = filters.minPrice;
          if (filters.maxPrice !== undefined) apiFilters.maxPrice = filters.maxPrice;
          if (filters.propertyType) apiFilters.propertyType = filters.propertyType;
          if (filters.bedrooms !== undefined) apiFilters.bedrooms = filters.bedrooms;
          if (filters.amenities && filters.amenities.length > 0) {
            apiFilters.amenities = filters.amenities.join(',');
          }
          
          const { listings, total } = await listingService.getListings(apiFilters);
          setListings(listings);
          setTotalListings(total);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch listings. Please try again later.');
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [locationParam, checkInParam, checkOutParam, guestsParam, filters]);

  // Remove duplicate listings by _id
  const uniqueListings = listings.filter((listing, index, self) =>
    index === self.findIndex(l => l._id === listing._id)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar Section */}
      <div className="border-b border-gray-200 sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar className="transform-none shadow-none" />
        </div>
      </div>
      
      {/* Filter Bar Section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FilterBar 
            className="py-2" 
            onFilterChange={(newFilters) => setFilters(newFilters)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location Header */}
        {locationParam && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FiMapPin className="mr-2" />
              Homes in {locationParam}
            </h1>
            <p className="text-gray-600 mt-1">
              {totalListings} {totalListings === 1 ? 'stay' : 'stays'} available
            </p>
          </div>
        )}

        {/* Listings */}
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
            {uniqueListings.length > 0 ? (
              uniqueListings.map((listing) => (
                <PropertyCard key={listing._id} listing={listing} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500 text-lg">
                  No properties found for {locationParam || 'your search criteria'}.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;