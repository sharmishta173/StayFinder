import api from './api';

export interface Location {
  city: string;
  state: string;
  country: string;
  streetAddress?: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  location: Location;
  pricePerNight: number;
  images: string[];
  amenities: string[];
  propertyType: string;
  numberOfGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  host: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  availability?: Array<{ date: string; available: boolean }>;
  currency: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isGuestFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  page?: number;
  limit?: number;
}

export interface CreateListingData {
  title: string;
  description: string;
  location: Location;
  pricePerNight: number;
  amenities: string[];
  propertyType: string;
  numberOfGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  images?: File[];
}

const listingService = {
  // Get all listings with optional filters
  getListings: async (filters?: ListingFilters): Promise<{ listings: Listing[]; total: number; pages: number }> => {
    let queryString = '';
    
    if (filters) {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      queryString = queryParams.toString();
    }
    
    const response = await api.get(`/listings${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  // Get featured listings
  getFeaturedListings: async (): Promise<Listing[]> => {
    const response = await api.get('/listings/featured');
    return response.data;
  },

  // Get listings by location
  getListingsByLocation: async (location: string): Promise<Listing[]> => {
    const response = await api.get(`/listings/location/${location}`);
    return response.data;
  },

  // Get listings by host
  getListingsByHost: async (hostId: string): Promise<Listing[]> => {
    const response = await api.get(`/listings/host/${hostId}`);
    return response.data;
  },

  // Get a single listing by ID
  getListingById: async (id: string): Promise<Listing> => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  // Create a new listing
  createListing: async (listingData: CreateListingData): Promise<Listing> => {
    // If there are images, we need to use FormData
    if (listingData.images && listingData.images.length > 0) {
      const formData = new FormData();
      
      // Append all non-file fields
      Object.entries(listingData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'location') {
          formData.append(key, value.toString());
        }
      });
      
      // Append location as JSON string
      formData.append('location', JSON.stringify(listingData.location));
      
      // Append each image
      listingData.images.forEach((image) => {
        formData.append('images', image);
      });
      
      const response = await api.post('/listings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } else {
      // No images, just send JSON
      const response = await api.post('/listings', listingData);
      return response.data;
    }
  },

  // Update an existing listing
  updateListing: async (id: string, listingData: Partial<CreateListingData>): Promise<Listing> => {
    // If there are images, we need to use FormData
    if (listingData.images && listingData.images.length > 0) {
      const formData = new FormData();
      
      // Append all non-file fields
      Object.entries(listingData).forEach(([key, value]) => {
        if (key !== 'images' && key !== 'location' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
      
      // Append location as JSON string if it exists
      if (listingData.location) {
        formData.append('location', JSON.stringify(listingData.location));
      }
      
      // Append each image
      listingData.images.forEach((image) => {
        formData.append('images', image);
      });
      
      const response = await api.put(`/listings/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } else {
      // No images, just send JSON
      const response = await api.put(`/listings/${id}`, listingData);
      return response.data;
    }
  },

  // Delete a listing
  deleteListing: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/listings/${id}`);
    return response.data;
  },

  // Toggle wishlist status for a listing
  toggleWishlist: async (listingId: string): Promise<{ message: string; inWishlist: boolean }> => {
    const response = await api.post(`/users/me/wishlist/${listingId}`);
    return response.data;
  },

  // Check if a listing is in user's wishlist
  checkWishlist: async (listingId: string): Promise<{ inWishlist: boolean }> => {
    const response = await api.get(`/users/me/wishlist/check/${listingId}`);
    return response.data;
  },

  // Get user's wishlist
  getWishlist: async (): Promise<Listing[]> => {
    const response = await api.get('/users/me/wishlist');
    return response.data;
  },
};

export default listingService;