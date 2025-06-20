require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const { ObjectId } = mongoose.Types;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Sample Munnar properties
const munnarProperties = [
  {
    title: 'Tea Plantation Villa in Munnar',
    description: 'Luxury Villa Surrounded by Tea Plantations',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Pothamedu',
      zipCode: '685612',
      coordinates: {
        lat: 10.0889,
        lng: 77.0595
      }
    },
    pricePerNight: 6000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Fireplace', 'Garden', 'Tea plantation view', 'Breakfast', 'Terrace'],
    propertyType: 'Villa',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 45
  },
  {
    title: 'Treehouse in Munnar',
    description: 'Unique Treehouse Experience with Forest Views',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Devikulam',
      zipCode: '685613',
      coordinates: {
        lat: 10.0522,
        lng: 77.1006
      }
    },
    pricePerNight: 3000,
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1532798442725-41036acc7489?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Forest view', 'Breakfast', 'Nature walks', 'Balcony'],
    propertyType: 'Other',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 38
  },
  {
    title: 'Luxury Resort in Munnar',
    description: 'Premium Resort with Panoramic Mountain Views',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Chinnakanal',
      zipCode: '685618',
      coordinates: {
        lat: 10.0167,
        lng: 77.0667
      }
    },
    pricePerNight: 5000,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Spa', 'Restaurant', 'Bar', 'Mountain view', 'Room service', 'Infinity pool'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 56
  },
  {
    title: 'Tea Estate Cottage in Munnar',
    description: 'Authentic Cottage in Working Tea Estate',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Kanan Devan Hills',
      zipCode: '685612',
      coordinates: {
        lat: 10.0886,
        lng: 77.0600
      }
    },
    pricePerNight: 8000,
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Tea estate tours', 'Breakfast', 'Garden', 'Valley view'],
    propertyType: 'Cottage',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 41
  },
  {
    title: 'Cardamom Plantation Homestay',
    description: 'Traditional Kerala Homestay in Cardamom Plantation',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Anachal',
      zipCode: '685565',
      coordinates: {
        lat: 10.0025,
        lng: 77.0808
      }
    },
    pricePerNight: 8500,
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Home-cooked Kerala meals', 'Plantation tours', 'Cultural experiences', 'Nature walks'],
    propertyType: 'Room',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.7,
    reviewCount: 47
  },
  {
    title: 'Mountain View Apartment in Munnar',
    description: 'Modern Apartment with Stunning Valley Views',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Munnar Town',
      zipCode: '685612',
      coordinates: {
        lat: 10.0880,
        lng: 77.0590
      }
    },
    pricePerNight: 6500,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185127-f4f01f7f4a30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Kitchen', 'Balcony', 'Mountain view', 'Parking'],
    propertyType: 'Apartment',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.6,
    reviewCount: 32
  },
  {
    title: 'Eco-Friendly Cottage in Munnar',
    description: 'Sustainable Cottage with Organic Garden',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Mattupetty',
      zipCode: '685616',
      coordinates: {
        lat: 10.1119,
        lng: 77.1250
      }
    },
    pricePerNight: 4500,
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Organic garden', 'Solar power', 'Farm-to-table meals', 'Nature walks'],
    propertyType: 'Cottage',
    numberOfGuests: 3,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 39
  },
  {
    title: 'Lakeside Villa in Munnar',
    description: 'Elegant Villa with Views of Mattupetty Lake',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Mattupetty Dam Road',
      zipCode: '685616',
      coordinates: {
        lat: 10.1000,
        lng: 77.1200
      }
    },
    pricePerNight: 8000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Lake view', 'Garden', 'Terrace', 'Breakfast', 'Boating'],
    propertyType: 'Villa',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 36
  },
  {
    title: 'Ayurvedic Retreat in Munnar',
    description: 'Wellness Retreat with Traditional Ayurvedic Treatments',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Pallivasal',
      zipCode: '685612',
      coordinates: {
        lat: 10.0500,
        lng: 77.0500
      }
    },
    pricePerNight: 6000,
    images: [
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1532798442725-41036acc7489?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Ayurvedic treatments', 'Yoga studio', 'Vegetarian meals', 'Meditation space', 'Nature walks'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 43
  },
  {
    title: 'Heritage Bungalow in Munnar',
    description: 'Colonial Era Bungalow with Antique Furnishings',
    location: {
      city: 'Munnar',
      state: 'Kerala',
      country: 'India',
      streetAddress: 'Old Munnar',
      zipCode: '685612',
      coordinates: {
        lat: 10.0900,
        lng: 77.0600
      }
    },
    pricePerNight: 17000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Fireplace', 'Garden', 'Library', 'Antique furnishings', 'Breakfast'],
    propertyType: 'House',
    numberOfGuests: 5,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 44
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First, delete any existing listings for Munnar
    const deleteResult = await Listing.deleteMany({
      'location.city': 'Munnar'
    });

    if (deleteResult.deletedCount > 0) {
      console.log(`Deleted ${deleteResult.deletedCount} existing listings for Munnar.`);
    }

    // Insert the sample properties one by one
    console.log(`Attempting to insert ${munnarProperties.length} Munnar properties...`);
    
    for (let i = 0; i < munnarProperties.length; i++) {
      try {
        const property = munnarProperties[i];
        property._id = new ObjectId(); // Add ObjectId to each property
        const newListing = new Listing(property);
        await newListing.save();
        console.log(`Successfully added property ${i+1}/${munnarProperties.length}: ${property.title}`);
      } catch (error) {
        console.error(`Error adding property ${i+1}/${munnarProperties.length}:`, error.message);
      }
    }
    
    console.log('Finished adding Munnar properties to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();