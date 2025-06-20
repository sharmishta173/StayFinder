require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const db = mongoose.connection.db;
    const listingsCollection = db.collection('listings');
    
    // More North Goa properties
    const northGoaProperties = [
      {
        _id: new mongoose.Types.ObjectId(),
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
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: true,
        rating: 4.8,
        reviewCount: 32
      },
      {
        _id: new mongoose.Types.ObjectId(),
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
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: false,
        rating: 4.7,
        reviewCount: 28
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Beachfront Villa in Baga, North Goa',
        description: 'Stunning Beachfront Villa with Private Access to Baga Beach',
        location: {
          city: 'North Goa',
          state: 'Goa',
          country: 'India',
          streetAddress: 'Baga Beach Road',
          zipCode: '403516',
          coordinates: {
            lat: 15.5539,
            lng: 73.7894
          }
        },
        pricePerNight: 25000,
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        ],
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Private beach access', 'Infinity pool', 'BBQ area'],
        propertyType: 'Villa',
        numberOfGuests: 10,
        bedrooms: 5,
        beds: 7,
        bathrooms: 5,
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: true,
        rating: 4.9,
        reviewCount: 52
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Heritage House in Assagao, North Goa',
        description: 'Restored Portuguese Heritage House with Modern Amenities',
        location: {
          city: 'North Goa',
          state: 'Goa',
          country: 'India',
          streetAddress: 'Assagao Village',
          zipCode: '403507',
          coordinates: {
            lat: 15.5936,
            lng: 73.7542
          }
        },
        pricePerNight: 18000,
        images: [
          'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        ],
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Garden', 'Heritage architecture', 'Veranda'],
        propertyType: 'House',
        numberOfGuests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 3,
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: true,
        rating: 4.9,
        reviewCount: 36
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Boutique Hotel Room in Candolim, North Goa',
        description: 'Stylish Boutique Hotel Room with Sea View',
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
        pricePerNight: 8000,
        images: [
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        ],
        amenities: ['Wifi', 'Air conditioning', 'Room service', 'Sea view', 'Restaurant', 'Spa'],
        propertyType: 'Hotel',
        numberOfGuests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: false,
        rating: 4.6,
        reviewCount: 42
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Riverside Cottage in Siolim, North Goa',
        description: 'Peaceful Cottage by the Chapora River',
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
        pricePerNight: 9500,
        images: [
          'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        ],
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'River view', 'Garden', 'Fishing'],
        propertyType: 'Cottage',
        numberOfGuests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 2,
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: true,
        rating: 4.8,
        reviewCount: 24
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Modern Apartment in Arpora, North Goa',
        description: 'Contemporary Apartment with Pool and Hill View',
        location: {
          city: 'North Goa',
          state: 'Goa',
          country: 'India',
          streetAddress: 'Arpora Hill',
          zipCode: '403518',
          coordinates: {
            lat: 15.5712,
            lng: 73.7637
          }
        },
        pricePerNight: 7500,
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1560185127-f4f1c64d9e38?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        ],
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Pool', 'Gym', 'Balcony'],
        propertyType: 'Apartment',
        numberOfGuests: 3,
        bedrooms: 1,
        beds: 2,
        bathrooms: 1,
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: false,
        rating: 4.5,
        reviewCount: 18
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Luxury Villa in Morjim, North Goa',
        description: 'Exclusive Beachside Villa with Infinity Pool',
        location: {
          city: 'North Goa',
          state: 'Goa',
          country: 'India',
          streetAddress: 'Morjim Beach',
          zipCode: '403512',
          coordinates: {
            lat: 15.6297,
            lng: 73.7323
          }
        },
        pricePerNight: 30000,
        images: [
          'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        ],
        amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Infinity pool', 'Beach access', 'Home theater'],
        propertyType: 'Villa',
        numberOfGuests: 12,
        bedrooms: 6,
        beds: 8,
        bathrooms: 6,
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: true,
        rating: 5.0,
        reviewCount: 15
      },
      {
        _id: new mongoose.Types.ObjectId(),
        title: 'Tiny Home in Mandrem, North Goa',
        description: 'Eco-friendly Tiny Home near Mandrem Beach',
        location: {
          city: 'North Goa',
          state: 'Goa',
          country: 'India',
          streetAddress: 'Mandrem Village',
          zipCode: '403527',
          coordinates: {
            lat: 15.6605,
            lng: 73.7152
          }
        },
        pricePerNight: 5000,
        images: [
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
          'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
        ],
        amenities: ['Wifi', 'Eco-friendly', 'Kitchenette', 'Beach nearby', 'Yoga deck', 'Organic garden'],
        propertyType: 'Tiny home',
        numberOfGuests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        host: '60d0fe4f5311236168a109ca',
        isGuestFavorite: true,
        rating: 4.7,
        reviewCount: 22
      }
    ];
    
    console.log(`Attempting to insert ${northGoaProperties.length} more North Goa properties...`);
    
    // Insert properties one by one
    for (let i = 0; i < northGoaProperties.length; i++) {
      try {
        const property = northGoaProperties[i];
        const result = await listingsCollection.insertOne(property);
        console.log(`Successfully added property ${i+1}/${northGoaProperties.length}: ${property.title}`);
      } catch (error) {
        console.error(`Error adding property ${i+1}/${northGoaProperties.length}:`, error.message);
      }
    }
    
    // Check how many North Goa listings we have now
    const count = await listingsCollection.countDocuments({
      'location.city': 'North Goa'
    });
    console.log(`Total North Goa listings in database: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});