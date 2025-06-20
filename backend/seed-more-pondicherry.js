const mongoose = require('mongoose');
const Listing = require('./models/Listing');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Additional Pondicherry properties
const morePondicherryProperties = [
  {
    title: 'Villa in Pondicherry',
    description: 'Luxury Villa with Private Pool near Serenity Beach',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Serenity Beach Road',
      zipCode: '605104',
      coordinates: {
        lat: 11.9482,
        lng: 79.8538
      }
    },
    pricePerNight: 15200,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Private pool', 'Beach access', 'BBQ grill'],
    propertyType: 'Villa',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 32
  },
  {
    title: 'Cottage in Auroville, Pondicherry',
    description: 'Eco-friendly Cottage with Garden in Auroville',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Auroville Main Road',
      zipCode: '605101',
      coordinates: {
        lat: 11.9472,
        lng: 79.7986
      }
    },
    pricePerNight: 7500,
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Organic breakfast', 'Garden', 'Yoga space', 'Bicycle rental'],
    propertyType: 'Cottage',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 45
  },
  {
    title: 'Apartment in French Quarter, Pondicherry',
    description: 'Heritage Apartment with Colonial Architecture',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Rue Dumas, White Town',
      zipCode: '605001',
      coordinates: {
        lat: 11.9338,
        lng: 79.8361
      }
    },
    pricePerNight: 10500,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony', 'Heritage building', 'Walking tours'],
    propertyType: 'Apartment',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 28
  },
  {
    title: 'Tiny home in Pondicherry',
    description: 'Cozy Tiny Home with Ocean View',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Paradise Beach Road',
      zipCode: '605008',
      coordinates: {
        lat: 11.9120,
        lng: 79.8350
      }
    },
    pricePerNight: 6800,
    images: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Kitchenette', 'Ocean view', 'Hammock', 'Outdoor shower'],
    propertyType: 'Tiny home',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 15
  },
  {
    title: 'Room in Boutique Hotel, Pondicherry',
    description: 'Elegant Room in Boutique Hotel with Rooftop Restaurant',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Mission Street',
      zipCode: '605001',
      coordinates: {
        lat: 11.9345,
        lng: 79.8302
      }
    },
    pricePerNight: 9200,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Room service', 'Rooftop restaurant', 'Spa services'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.6,
    reviewCount: 52
  },
  {
    title: 'House in Pondicherry',
    description: 'Traditional Tamil House with Modern Amenities',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Heritage Town',
      zipCode: '605001',
      coordinates: {
        lat: 11.9330,
        lng: 79.8320
      }
    },
    pricePerNight: 11000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Courtyard', 'Traditional architecture'],
    propertyType: 'House',
    numberOfGuests: 5,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 36
  },
  {
    title: 'Villa in Auroville, Pondicherry',
    description: 'Sustainable Eco Villa with Organic Farm',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Auroville',
      zipCode: '605101',
      coordinates: {
        lat: 11.9465,
        lng: 79.7998
      }
    },
    pricePerNight: 13500,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600585154526-990dced4db3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Solar power', 'Organic farm', 'Yoga deck', 'Meditation space', 'Farm-to-table meals'],
    propertyType: 'Villa',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 42
  },
  {
    title: 'Apartment near Rock Beach, Pondicherry',
    description: 'Modern Apartment with Sea View Balcony',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Goubert Avenue',
      zipCode: '605001',
      coordinates: {
        lat: 11.9320,
        lng: 79.8365
      }
    },
    pricePerNight: 8900,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185127-f4f01f7f4a30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Sea view balcony', 'Beach access'],
    propertyType: 'Apartment',
    numberOfGuests: 3,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 23
  },
  {
    title: 'Room in Homestay, Pondicherry',
    description: 'Authentic Homestay Experience with Local Family',
    location: {
      city: 'Pondicherry',
      state: 'Puducherry',
      country: 'India',
      streetAddress: 'Tamil Quarter',
      zipCode: '605001',
      coordinates: {
        lat: 11.9350,
        lng: 79.8290
      }
    },
    pricePerNight: 5500,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Home-cooked meals', 'Cultural experiences', 'Local tours', 'Bicycle rental'],
    propertyType: 'Room',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 39
  }
];

// Function to seed the database
const seedMoreProperties = async () => {
  try {
    // First, check how many listings for Pondicherry exist
    const existingListings = await Listing.find({
      'location.city': 'Pondicherry'
    });

    console.log(`Found ${existingListings.length} existing listings for Pondicherry before adding more.`);
    
    // Insert the additional properties
    await Listing.insertMany(morePondicherryProperties);
    console.log('Successfully added 9 more Pondicherry properties to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedMoreProperties();