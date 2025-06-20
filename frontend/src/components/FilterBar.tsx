import React, { useState, useEffect } from 'react';
import { FiHome, FiDollarSign, FiWifi, FiTv, FiWind, FiCoffee } from 'react-icons/fi';

export interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  bedrooms?: number;
  amenities?: string[];
}

interface FilterBarProps {
  className?: string;
  onFilterChange: (filters: FilterOptions) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ className = '', onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    minPrice: undefined,
    maxPrice: undefined,
    propertyType: undefined,
    bedrooms: undefined,
    amenities: [],
  });

  // Property types available for filtering
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: <FiHome /> },
    { value: 'house', label: 'House', icon: <FiHome /> },
    { value: 'villa', label: 'Villa', icon: <FiHome /> },
    { value: 'cottage', label: 'Cottage', icon: <FiHome /> },
    { value: 'guesthouse', label: 'Guesthouse', icon: <FiHome /> },
  ];

  // Bedroom options
  const bedroomOptions = [1, 2, 3, 4, 5];

  // Price range options
  const priceRanges = [
    { min: undefined, max: 2000, label: 'Under ₹2,000' },
    { min: 2000, max: 4000, label: '₹2,000 - ₹4,000' },
    { min: 4000, max: 6000, label: '₹4,000 - ₹6,000' },
    { min: 6000, max: 8000, label: '₹6,000 - ₹8,000' },
    { min: 8000, max: undefined, label: 'Over ₹8,000' },
  ];

  // Amenities options
  const amenitiesOptions = [
    { value: 'wifi', label: 'WiFi', icon: <FiWifi /> },
    { value: 'tv', label: 'TV', icon: <FiTv /> },
    { value: 'ac', label: 'AC', icon: <FiWind /> },
    { value: 'kitchen', label: 'Kitchen', icon: <FiCoffee /> },
    { value: 'parking', label: 'Parking', icon: <FiHome /> },
  ];

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle property type selection
  const handlePropertyTypeChange = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType === type ? undefined : type,
    }));
  };

  // Handle bedroom selection
  const handleBedroomChange = (bedrooms: number) => {
    setFilters(prev => ({
      ...prev,
      bedrooms: prev.bedrooms === bedrooms ? undefined : bedrooms,
    }));
  };

  // Handle price range selection
  const handlePriceRangeChange = (min?: number, max?: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  // Handle amenity toggle
  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => {
      const currentAmenities = prev.amenities || [];
      const newAmenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter(a => a !== amenity)
        : [...currentAmenities, amenity];
      
      return {
        ...prev,
        amenities: newAmenities,
      };
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      minPrice: undefined,
      maxPrice: undefined,
      propertyType: undefined,
      bedrooms: undefined,
      amenities: [],
    });
  };

  return (
    <div className={`filter-bar ${className}`}>
      <div className="flex flex-wrap items-center gap-4">
        {/* Property Type Filter */}
        <div className="filter-group">
          <div className="text-sm font-medium mb-2">Property Type</div>
          <div className="flex flex-wrap gap-2">
            {propertyTypes.map(type => (
              <button
                key={type.value}
                onClick={() => handlePropertyTypeChange(type.value)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${filters.propertyType === type.value ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-gray-100 text-gray-700 border border-transparent hover:border-gray-300'}`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms Filter */}
        <div className="filter-group">
          <div className="text-sm font-medium mb-2">Bedrooms</div>
          <div className="flex flex-wrap gap-2">
            {bedroomOptions.map(num => (
              <button
                key={num}
                onClick={() => handleBedroomChange(num)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${filters.bedrooms === num ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-gray-100 text-gray-700 border border-transparent hover:border-gray-300'}`}
              >
                <FiHome />
                {num}+
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-group">
          <div className="text-sm font-medium mb-2">Price Range</div>
          <div className="flex flex-wrap gap-2">
            {priceRanges.map((range, index) => (
              <button
                key={index}
                onClick={() => handlePriceRangeChange(range.min, range.max)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${filters.minPrice === range.min && filters.maxPrice === range.max ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-gray-100 text-gray-700 border border-transparent hover:border-gray-300'}`}
              >
                <FiDollarSign />
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="filter-group">
          <div className="text-sm font-medium mb-2">Amenities</div>
          <div className="flex flex-wrap gap-2">
            {amenitiesOptions.map(amenity => (
              <button
                key={amenity.value}
                onClick={() => handleAmenityToggle(amenity.value)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-colors ${filters.amenities?.includes(amenity.value) ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-gray-100 text-gray-700 border border-transparent hover:border-gray-300'}`}
              >
                {amenity.icon}
                {amenity.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        <div className="ml-auto">
          <button
            onClick={clearAllFilters}
            className="px-3 py-1.5 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;