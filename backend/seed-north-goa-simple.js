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

// Sample North Goa properties with explicit IDs
const northGoaProperties = [
  {
    _id: new ObjectId(), // Generate a new ObjectId
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
    _id: new ObjectId(), // Generate a new ObjectId
    title: 'Beach Cottage in Vagator, North Goa',
    description: 'Authentic Beach Cottage with Ocean View',
    location: {
      city: 'North Goa',
      state: 'Goa',
      country: 'India',
      streetAddress: 'Vagator Beach Road',
      zipCode: '403509',
      coordinates: {
        lat: 15.5977,
        lng: 73.7441
      }
    },
    pricePerNight: 12000,
    images: [
      'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1501917125763-d5c4c03b3f89?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Beach access', 'Hammock', 'Outdoor shower', 'Restaurant nearby'],
    propertyType: 'Cottage',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 32
  },
  {
    _id: new ObjectId(), // Generate a new ObjectId
    title: 'Luxury Apartment in Calangute, North Goa',
    description: 'Modern Apartment with Pool Access near Calangute Beach',
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
    pricePerNight: 14000,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560448075-bb485b067938?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1560448204-61dc36dc98c8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Pool access', 'Beach nearby', 'Balcony'],
    propertyType: 'Apartment',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 28
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