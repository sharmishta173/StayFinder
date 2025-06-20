const mongoose = require('mongoose');
const Listing = require('./models/Listing');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Sample North Goa properties
const northGoaProperties = [
  {
    title: 'Villa in Anjuna, North Goa',
    description: 'Luxury Villa with Private Pool near Anjuna Beach',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Anjuna Beach Road',
      zipCode: '403509',
      coordinates: {
        lat: 15.5752,
        lng: 73.7407
      }
    },
    pricePerNight: 18500,
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Private pool', 'Beach access', 'BBQ grill'],
    propertyType: 'Villa',
    numberOfGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 45
  },
  {
    title: 'Beach Hut in Vagator, North Goa',
    description: 'Authentic Beach Hut with Ocean View',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Vagator Beach',
      zipCode: '403509',
      coordinates: {
        lat: 15.5989,
        lng: 73.7444
      }
    },
    pricePerNight: 7500,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Beach access', 'Hammock', 'Outdoor shower', 'Restaurant nearby'],
    propertyType: 'Cottage',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.7,
    reviewCount: 38
  },
  {
    title: 'Apartment in Calangute, North Goa',
    description: 'Modern Apartment near Calangute Beach',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Calangute Beach Road',
      zipCode: '403516',
      coordinates: {
        lat: 15.5440,
        lng: 73.7527
      }
    },
    pricePerNight: 9800,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony', 'Swimming pool', 'Gym'],
    propertyType: 'Apartment',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.6,
    reviewCount: 29
  },
  {
    title: 'Villa in Baga, North Goa',
    description: 'Luxury Villa with Garden and Pool',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Baga Beach Road',
      zipCode: '403516',
      coordinates: {
        lat: 15.5553,
        lng: 73.7539
      }
    },
    pricePerNight: 16500,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Private pool', 'Garden', 'BBQ'],
    propertyType: 'Villa',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 52
  },
  {
    title: 'Cottage in Morjim, North Goa',
    description: 'Peaceful Cottage near Morjim Beach',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Morjim Beach Road',
      zipCode: '403512',
      coordinates: {
        lat: 15.6317,
        lng: 73.7344
      }
    },
    pricePerNight: 8500,
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Patio', 'Beach access'],
    propertyType: 'Cottage',
    numberOfGuests: 3,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 31
  },
  {
    title: 'Resort Room in Candolim, North Goa',
    description: 'Luxury Resort Room with Pool Access',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Candolim Beach Road',
      zipCode: '403515',
      coordinates: {
        lat: 15.5185,
        lng: 73.7626
      }
    },
    pricePerNight: 12000,
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Room service', 'Swimming pool', 'Spa', 'Restaurant'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 64
  },
  {
    title: 'Beachfront House in Arambol, North Goa',
    description: 'Stunning Beachfront House with Panoramic Views',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Arambol Beach',
      zipCode: '403524',
      coordinates: {
        lat: 15.6846,
        lng: 73.7033
      }
    },
    pricePerNight: 14500,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Beachfront', 'Terrace', 'Hammock'],
    propertyType: 'House',
    numberOfGuests: 5,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 47
  },
  {
    title: 'Boutique Hotel in Assagao, North Goa',
    description: 'Stylish Boutique Hotel in Trendy Assagao',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Assagao Village',
      zipCode: '403507',
      coordinates: {
        lat: 15.5936,
        lng: 73.7609
      }
    },
    pricePerNight: 11000,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Swimming pool', 'Restaurant', 'Bar', 'Garden'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 39
  },
  {
    title: 'Apartment in Siolim, North Goa',
    description: 'Modern Apartment with River View',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Siolim Village',
      zipCode: '403517',
      coordinates: {
        lat: 15.6294,
        lng: 73.7414
      }
    },
    pricePerNight: 8900,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185127-f4f01f7f4a30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony', 'River view'],
    propertyType: 'Apartment',
    numberOfGuests: 3,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.6,
    reviewCount: 28
  },
  {
    title: 'Heritage Villa in Saligao, North Goa',
    description: 'Portuguese-style Heritage Villa with Garden',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Saligao Village',
      zipCode: '403511',
      coordinates: {
        lat: 15.5539,
        lng: 73.7894
      }
    },
    pricePerNight: 15000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Garden', 'Heritage architecture', 'Veranda'],
    propertyType: 'Villa',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 36
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First, delete any existing listings for North Goa
    const deleteResult = await Listing.deleteMany({
      'location.city': 'North Goa'
    });

    if (deleteResult.deletedCount > 0) {
      console.log(`Deleted ${deleteResult.deletedCount} existing listings for North Goa.`);
    }

    // Insert the sample properties one by one
    console.log(`Attempting to insert ${northGoaProperties.length} North Goa properties...`);
    
    for (let i = 0; i < northGoaProperties.length; i++) {
      try {
        const property = northGoaProperties[i];
        const newListing = new Listing(property);
        await newListing.save();
        console.log(`Successfully added property ${i+1}/${northGoaProperties.length}: ${property.title}`);
      } catch (error) {
        console.error(`Error adding property ${i+1}/${northGoaProperties.length}:`, error.message);
      }
    }
    
    console.log('Finished adding North Goa properties to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();