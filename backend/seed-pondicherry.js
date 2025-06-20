const mongoose = require('mongoose');
const Listing = require('./models/Listing');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample Pondicherry properties
const pondicherryProperties = [
  {
    title: 'Room in Periyamudaliarchavady, Pondicherry',
    description: 'Stay with Elle - Anahata | Cozy Room in Auroville | 3 min to Beach',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Periyamudaliarchavady',
      zipCode: '605101',
      coordinates: {
        lat: 11.9416,
        lng: 79.8083
      }
    },
    pricePerNight: 12836,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Free parking', 'Pool'],
    propertyType: 'Room',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 5.0,
    reviewCount: 5
  },
  {
    title: 'Hotel in Pondicherry',
    description: '222 Heritage Room/ White Town/ Roc Forte',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'White Town',
      zipCode: '605001',
      coordinates: {
        lat: 11.9340,
        lng: 79.8328
      }
    },
    pricePerNight: 8326,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'TV', 'Free parking', 'Room service'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.7,
    reviewCount: 40
  },
  {
    title: 'Hotel in Pondicherry',
    description: 'Virsham\'s - Standard Room',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Auroville Main Road',
      zipCode: '605101',
      coordinates: {
        lat: 11.9469,
        lng: 79.7981
      }
    },
    pricePerNight: 8944,
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Free parking', 'Breakfast'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    rating: 4.9,
    reviewCount: 12,
    isGuestFavorite: false
  },
  {
    title: 'Guest House in Pondicherry',
    description: 'Seaside Villa with Garden View',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Promenade Beach Road',
      zipCode: '605001',
      coordinates: {
        lat: 11.9310,
        lng: 79.8358
      }
    },
    pricePerNight: 7878,
    images: [
      'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1566195992011-5f6b21e539aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Garden', 'Sea view'],
    propertyType: 'House',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    rating: 4.8,
    reviewCount: 25,
    isGuestFavorite: true
  },
  {
    title: 'Apartment in Pondicherry',
    description: 'Modern Apartment in French Quarter',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'French Quarter',
      zipCode: '605001',
      coordinates: {
        lat: 11.9335,
        lng: 79.8318
      }
    },
    pricePerNight: 9600,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony', 'City view'],
    propertyType: 'Apartment',
    numberOfGuests: 3,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    rating: 4.6,
    reviewCount: 18,
    isGuestFavorite: false
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First, check if there are already listings for Pondicherry
    const existingListings = await Listing.find({
      'location.city': 'Pondicherry'
    });

    console.log(`Found ${existingListings.length} existing listings for Pondicherry.`);
    
    // Insert the sample properties regardless of existing listings
    await Listing.insertMany(pondicherryProperties);
    console.log('Successfully added Pondicherry properties to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();