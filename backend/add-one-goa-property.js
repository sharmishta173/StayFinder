require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  addProperty();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

const addProperty = async () => {
  try {
    // Create a simple property
    const property = {
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
    };

    // Create a new listing
    const newListing = new Listing(property);
    
    // Save to database
    const savedListing = await newListing.save();
    console.log('Successfully added property:', savedListing._id);
    process.exit(0);
  } catch (error) {
    console.error('Error adding property:', error);
    process.exit(1);
  }
};