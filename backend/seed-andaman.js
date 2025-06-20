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

// Sample Andaman properties
const andamanProperties = [
  {
    title: 'Beachfront Villa in Havelock Island',
    description: 'Luxury Villa with Direct Beach Access on Radhanagar Beach',
    location: {
      city: 'Havelock Island',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Radhanagar Beach',
      zipCode: '744211',
      coordinates: {
        lat: 11.9833,
        lng: 92.9333
      }
    },
    pricePerNight: 18000,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1409362424190655678/original/f0613ee3-e3de-4082-bfa7-bd32749210d0.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1409362424190655678/original/561d0f13-78f7-4c11-99be-bc36335ccd0d.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1409362424190655678/original/3656a49c-5136-45af-83c3-9861b3322321.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Beach access', 'Ocean view', 'Breakfast', 'Water sports equipment'],
    propertyType: 'Villa',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 48
  },
  {
    title: 'Eco Resort in Neil Island',
    description: 'Sustainable Eco Resort with Private Beach Access',
    location: {
      city: 'Neil Island',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Bharatpur Beach',
      zipCode: '744104',
      coordinates: {
        lat: 11.8276,
        lng: 93.0530
      }
    },
    pricePerNight: 15000,
    images: [
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1540560933578-09901b4c8a43?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Eco-friendly', 'Beach access', 'Ocean view', 'Restaurant', 'Snorkeling equipment'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 52
  },
  {
    title: 'Water Villa in Port Blair',
    description: 'Overwater Villa with Panoramic Ocean Views',
    location: {
      city: 'Port Blair',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Marine Hill',
      zipCode: '744101',
      coordinates: {
        lat: 11.6683,
        lng: 92.7378
      }
    },
    pricePerNight: 22000,
    images: [
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1439066290691-510066268af5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Direct ocean access', 'Ocean view', 'Room service', 'Water sports'],
    propertyType: 'Villa',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 45
  },
  {
    title: 'Beach Cottage in Havelock Island',
    description: 'Charming Cottage Steps Away from Kalapathar Beach',
    location: {
      city: 'Havelock Island',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Kalapathar Beach',
      zipCode: '744211',
      coordinates: {
        lat: 11.9706,
        lng: 92.9810
      }
    },
    pricePerNight: 12000,
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Beach access', 'Garden', 'Breakfast', 'Snorkeling equipment'],
    propertyType: 'Cottage',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.7,
    reviewCount: 39
  },
  {
    title: 'Luxury Resort in Ross Island',
    description: 'Premium Resort with Colonial Heritage and Ocean Views',
    location: {
      city: 'Ross Island',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Ross Island',
      zipCode: '744101',
      coordinates: {
        lat: 11.6750,
        lng: 92.7583
      }
    },
    pricePerNight: 20000,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Swimming pool', 'Ocean view', 'Restaurant', 'Bar', 'Historical tours'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.8,
    reviewCount: 58
  },
  {
    title: 'Beachside Apartment in Port Blair',
    description: 'Modern Apartment with Sea View in Port Blair',
    location: {
      city: 'Port Blair',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Aberdeen Bazaar',
      zipCode: '744101',
      coordinates: {
        lat: 11.6700,
        lng: 92.7400
      }
    },
    pricePerNight: 9500,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560185127-f4f01f7f4a30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony', 'Sea view'],
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
    title: 'Island Glamping in Long Island',
    description: 'Luxury Tents with Beach Access and Adventure Activities',
    location: {
      city: 'Long Island',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Lalaji Bay Beach',
      zipCode: '744209',
      coordinates: {
        lat: 12.3600,
        lng: 92.9300
      }
    },
    pricePerNight: 11000,
    images: [
      'https://a0.muscache.com/im/pictures/a4531205-d6db-4e42-8041-2b708a52ae78.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/87bef7a6-54a6-43e0-ba7f-d01122e2bbe2.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/66d388b7-88d4-4530-9719-ce852ad1377d.jpg?im_w=720'
    ],
    amenities: ['Beach access', 'Adventure activities', 'Campfire', 'Guided tours', 'Eco-friendly'],
    propertyType: 'Other',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 41
  },
  {
    title: 'Dive Resort in Havelock Island',
    description: 'Specialized Resort for Diving Enthusiasts',
    location: {
      city: 'Havelock Island',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Beach No. 3',
      zipCode: '744211',
      coordinates: {
        lat: 11.9800,
        lng: 92.9500
      }
    },
    pricePerNight: 16000,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Diving equipment', 'Diving courses', 'Restaurant', 'Beach access'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 47
  },
  {
    title: 'Private Island Villa in Andaman',
    description: 'Exclusive Villa on a Private Island with Full Staff',
    location: {
      city: 'Smith Island',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Private Island',
      zipCode: '744105',
      coordinates: {
        lat: 12.0000,
        lng: 92.9800
      }
    },
    pricePerNight: 35000,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1520483601560-389dff434fdf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Private beach', 'Full staff', 'Boat transfers', 'Water sports', 'Chef'],
    propertyType: 'Villa',
    numberOfGuests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 5.0,
    reviewCount: 28
  },
  {
    title: 'Heritage Guesthouse in Port Blair',
    description: 'Colonial Era Guesthouse with Historical Significance',
    location: {
      city: 'Port Blair',
      state: 'Andaman and Nicobar Islands',
      country: 'India',
      streetAddress: 'Phoenix Bay',
      zipCode: '744102',
      coordinates: {
        lat: 11.6720,
        lng: 92.7450
      }
    },
    pricePerNight: 13000,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Garden', 'Historical tours', 'Breakfast', 'Library'],
    propertyType: 'Other',
    numberOfGuests: 5,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 36
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First, delete any existing listings for Andaman
    const deleteResult = await Listing.deleteMany({
      'location.state': 'Andaman and Nicobar Islands'
    });

    if (deleteResult.deletedCount > 0) {
      console.log(`Deleted ${deleteResult.deletedCount} existing listings for Andaman.`);
    }

    // Insert the sample properties one by one
    console.log(`Attempting to insert ${andamanProperties.length} Andaman properties...`);
    
    for (let i = 0; i < andamanProperties.length; i++) {
      try {
        const property = andamanProperties[i];
        property._id = new ObjectId(); // Add ObjectId to each property
        const newListing = new Listing(property);
        await newListing.save();
        console.log(`Successfully added property ${i+1}/${andamanProperties.length}: ${property.title}`);
      } catch (error) {
        console.error(`Error adding property ${i+1}/${andamanProperties.length}:`, error.message);
      }
    }
    
    console.log('Finished adding Andaman properties to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();