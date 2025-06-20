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

// Sample Ooty properties
const ootyProperties = [
  {
    title: 'Cottage in Ooty',
    description: 'Charming Colonial Cottage with Garden View',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Fern Hill Road',
      zipCode: '643001',
      coordinates: {
        lat: 11.4102,
        lng: 76.6950
      }
    },
    pricePerNight: 9500,
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Fireplace', 'Garden', 'Mountain view', 'Breakfast'],
    propertyType: 'Cottage',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 42
  },
  {
    title: 'Villa in Ooty',
    description: 'Luxury Villa with Panoramic Mountain Views',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Doddabetta Peak Road',
      zipCode: '643002',
      coordinates: {
        lat: 11.4086,
        lng: 76.7259
      }
    },
    pricePerNight: 18000,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Fireplace', 'Kitchen', 'Terrace', 'BBQ', 'Parking'],
    propertyType: 'Villa',
    numberOfGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 35
  },
  {
    title: 'Heritage Bungalow in Ooty',
    description: 'Colonial Era Bungalow with Tea Garden Views',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Coonoor Road',
      zipCode: '643001',
      coordinates: {
        lat: 11.4120,
        lng: 76.6993
      }
    },
    pricePerNight: 14500,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Fireplace', 'Garden', 'Tea estate view', 'Breakfast', 'Library'],
    propertyType: 'House',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 48
  },
  {
    title: 'Cozy Apartment in Ooty',
    description: 'Modern Apartment near Ooty Lake',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Lake Road',
      zipCode: '643001',
      coordinates: {
        lat: 11.4041,
        lng: 76.6940
      }
    },
    pricePerNight: 3500,
    images: [
      'https://a0.muscache.com/im/pictures/12bb8cb2-079e-47f4-9830-85fb7ab2ab6b.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/684445e1-dfdd-4ac1-83eb-15cd1b1d63f2.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/44bdfe9f-a0a9-415f-a520-14ebbd305a0d.jpg?im_w=720'
    ],
    amenities: ['Wifi', 'Heating', 'Kitchen', 'Lake view', 'Parking'],
    propertyType: 'Apartment',
    numberOfGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.6,
    reviewCount: 29
  },
  {
    title: 'Resort Room in Ooty',
    description: 'Luxury Resort Room with Mountain View',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Elk Hill',
      zipCode: '643001',
      coordinates: {
        lat: 11.4065,
        lng: 76.7020
      }
    },
    pricePerNight: 2900,
    images: [
      'https://a0.muscache.com/im/pictures/96ea27cf-f721-4b7d-a45c-2195607e7e62.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/26339e1b-516a-4dde-b5f2-a2c966d08952.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/16f084fe-1bc8-4eb5-a59e-2a3996b8acf3.jpg?im_w=720'
    ],
    amenities: ['Wifi', 'Room service', 'Spa access', 'Restaurant', 'Mountain view'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.7,
    reviewCount: 56
  },
  {
    title: 'Wooden Cabin in Ooty',
    description: 'Rustic Wooden Cabin in Pine Forest',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Pine Forest Road',
      zipCode: '643002',
      coordinates: {
        lat: 11.4150,
        lng: 76.7100
      }
    },
    pricePerNight: 8500,
    images: [
      'https://a0.muscache.com/im/pictures/4f4b52e5-a001-4ead-9b33-abcaae8d6f74.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/d1a6a14b-d513-490d-a36d-be04262a129d.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/ca66711e-2024-4d38-b3a1-f429cdd19d8a.jpg?im_w=720'
    ],
    amenities: ['Wifi', 'Fireplace', 'BBQ', 'Forest view', 'Hiking trails'],
    propertyType: 'Cottage',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 37
  },
  {
    title: 'Tea Estate Cottage in Ooty',
    description: 'Authentic Cottage in Working Tea Estate',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Kotagiri Road',
      zipCode: '643001',
      coordinates: {
        lat: 11.4230,
        lng: 76.7380
      }
    },
    pricePerNight: 5000,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-775274477780256331/original/0ccc35b0-96a3-4ed0-84ca-2f22b6c81421.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-775274477780256331/original/4433190b-44d4-4cd4-9095-057a222079cf.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-775274477780256331/original/b139ef59-6991-4b92-ba72-d576f2ea6379.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Tea estate tours', 'Breakfast', 'Garden', 'Valley view'],
    propertyType: 'Cottage',
    numberOfGuests: 3,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 41
  },
  {
    title: 'Boutique Hotel in Ooty',
    description: 'Elegant Boutique Hotel in Colonial Building',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Charing Cross',
      zipCode: '643001',
      coordinates: {
        lat: 11.4130,
        lng: 76.7000
      }
    },
    pricePerNight: 6500,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE5NDYxNDg2NTE2MTExMjE4NQ%3D%3D/original/6557d156-6bb0-4c1a-93d9-836d8e23789d.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1194614865161112185/original/e490afbb-7eb3-45d7-8406-bf07d4e2dc67.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE5NDYxNDg2NTE2MTExMjE4NQ%3D%3D/original/3a060a9e-03a3-47f4-95d6-f3f551a82b05.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Restaurant', 'Bar', 'Garden', 'Library', 'Room service'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 62
  },
  {
    title: 'Homestay in Ooty',
    description: 'Authentic Family Homestay with Home-cooked Meals',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Kandal',
      zipCode: '643001',
      coordinates: {
        lat: 11.4095,
        lng: 76.6890
      }
    },
    pricePerNight: 6500,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1446956140914314420/original/ad2f26b2-3ac9-4f98-a4bb-6b8face68177.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1446956140914314420/original/0af72c0c-fba2-4a1f-bd20-746bdb81348c.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1446956140914314420/original/40851a77-8a1c-441a-a311-a536f96c8ca6.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Home-cooked meals', 'Garden', 'Local tours', 'Cultural experiences'],
    propertyType: 'Room',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    kitchen: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 49
  },
  {
    title: 'Hillside Villa in Ooty',
    description: 'Modern Villa with Stunning Valley Views',
    location: {
      city: 'Ooty',
      state: 'Tamil Nadu',
      country: 'India',
      streetAddress: 'Lovedale',
      zipCode: '643003',
      coordinates: {
        lat: 11.3890,
        lng: 76.7220
      }
    },
    pricePerNight: 7000,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-948057937603461683/original/f6d7338a-2099-4a07-9fe3-b391582a4b0d.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-948057937603461683/original/e6abfb95-b20b-40e5-a1ae-9d9e3b66753a.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-948057937603461683/original/924c4693-3128-4274-bc0f-1b6b0bc41e04.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Fireplace', 'Kitchen', 'Terrace', 'Valley view', 'BBQ'],
    propertyType: 'Villa',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 33
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First, delete any existing listings for Ooty
    const deleteResult = await Listing.deleteMany({
      'location.city': 'Ooty'
    });

    if (deleteResult.deletedCount > 0) {
      console.log(`Deleted ${deleteResult.deletedCount} existing listings for Ooty.`);
    }

    // Insert the sample properties one by one
    console.log(`Attempting to insert ${ootyProperties.length} Ooty properties...`);
    
    for (let i = 0; i < ootyProperties.length; i++) {
      try {
        const property = ootyProperties[i];
        property._id = new ObjectId(); // Add ObjectId to each property
        const newListing = new Listing(property);
        await newListing.save();
        console.log(`Successfully added property ${i+1}/${ootyProperties.length}: ${property.title}`);
      } catch (error) {
        console.error(`Error adding property ${i+1}/${ootyProperties.length}:`, error.message);
      }
    }
    
    console.log('Finished adding Ooty properties to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};