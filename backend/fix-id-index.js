require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Check listings collection
    const listingsCollection = db.collection('listings');
    
    // Try to drop the id index directly
    try {
      await listingsCollection.dropIndex('id_1');
      console.log('Successfully dropped id_1 index');
    } catch (indexError) {
      console.log('Error dropping id_1 index:', indexError.message);
    }
    
    // Create a new North Goa listing with explicit _id
    const newListing = {
      _id: new mongoose.Types.ObjectId(),
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
      host: '60d0fe4f5311236168a109ca',
      isGuestFavorite: true,
      rating: 4.9,
      reviewCount: 45
    };
    
    try {
      const result = await listingsCollection.insertOne(newListing);
      console.log('Successfully added North Goa property:', result.insertedId);
    } catch (insertError) {
      console.error('Error inserting property:', insertError);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});