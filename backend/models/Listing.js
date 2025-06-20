const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true,
        default: 'India',
      },
      streetAddress: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [1, 'Price must be at least 1 INR'],
    },
    images: [
      {
        type: String,
        required: [true, 'At least one image is required'],
      },
    ],
    amenities: [
      {
        type: String,
        trim: true,
      },
    ],
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['Apartment', 'House', 'Room', 'Hotel', 'Villa', 'Cottage', 'Tiny home', 'Other'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Number of guests must be at least 1'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'Number of bedrooms is required'],
      min: [0, 'Number of bedrooms must be at least 0'],
    },
    beds: {
      type: Number,
      required: [true, 'Number of beds is required'],
      min: [1, 'Number of beds must be at least 1'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'Number of bathrooms is required'],
      min: [0, 'Number of bathrooms must be at least 0'],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host is required'],
    },
    availability: [
      {
        date: Date,
        available: {
          type: Boolean,
          default: true,
        },
      },
    ],
    currency: {
      type: String,
      default: 'INR',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isGuestFavorite: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create index for search functionality
ListingSchema.index({ 'location.city': 'text', 'location.state': 'text', 'location.country': 'text', title: 'text', description: 'text' });

const Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;