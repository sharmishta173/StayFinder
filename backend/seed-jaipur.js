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

// Sample Jaipur properties
const jaipurProperties = [
  {
    title: 'Heritage Haveli in Jaipur',
    description: 'Authentic Rajasthani Haveli with Traditional Architecture',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Amer Road',
      zipCode: '302001',
      coordinates: {
        lat: 26.9124,
        lng: 75.7873
      }
    },
    pricePerNight: 2000,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1415310954533011449/original/04e31e32-e00c-4b17-8e9a-481f9a58bced.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1043052304509851689/original/62419b15-cd73-48af-9101-02d928ea5e05.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1299221709580631223/original/28b2063d-40f9-4772-978c-16765ac73bbc.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Courtyard', 'Rooftop terrace', 'Traditional decor', 'Breakfast'],
    propertyType: 'House',
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
    title: 'Luxury Palace Hotel in Jaipur',
    description: 'Opulent Palace Hotel with Royal Rajasthani Experience',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Palace Road',
      zipCode: '302006',
      coordinates: {
        lat: 26.9154,
        lng: 75.8189
      }
    },
    pricePerNight: 2500,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1050998543545568139/original/d482f199-31c5-466d-b7ef-27e515b49517.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1050998543545568139/original/3faa3331-405b-47de-a3fc-6b48b4244998.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1050998543545568139/original/8c29905e-ec0d-4e7c-bcde-feefb0007185.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Swimming pool', 'Spa', 'Restaurant', 'Bar', 'Room service'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 65
  },
  {
    title: 'Modern Apartment in Jaipur',
    description: 'Contemporary Apartment in Central Jaipur',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'C-Scheme',
      zipCode: '302001',
      coordinates: {
        lat: 26.9115,
        lng: 75.7950
      }
    },
    pricePerNight: 2800,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1079575881480943075/original/2fe9385e-500b-4c51-ae39-24caba84f21c.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1079575881480943075/original/e78fbc9e-9ddb-4c1c-9481-f09d315f81ed.jpeg?im_w=1440',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1079575881480943075/original/1caaf036-523c-4a9b-a1ae-585fadee66ca.jpeg?im_w=1200'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony', 'City view'],
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
    title: 'Boutique Hotel in Old Jaipur',
    description: 'Charming Boutique Hotel in the Pink City',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Johari Bazaar',
      zipCode: '302003',
      coordinates: {
        lat: 26.9239,
        lng: 75.8267
      }
    },
    pricePerNight: 2900,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-948494886884911883/original/642c7f4e-3452-4b19-a6c7-1e87190fa6b3.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-948494886884911883/original/af972ee1-1e2f-494b-8f5f-3934d2a97e33.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-948494886884911883/original/b01f0404-bcf5-4773-92ec-88b5cb6e5906.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Restaurant', 'Rooftop cafe', 'City tours'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.7,
    reviewCount: 54
  },
  {
    title: 'Traditional Homestay in Jaipur',
    description: 'Authentic Rajasthani Family Homestay Experience',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Bani Park',
      zipCode: '302016',
      coordinates: {
        lat: 26.9334,
        lng: 75.7873
      }
    },
    pricePerNight: 2500,
    images: [
      'https://a0.muscache.com/im/pictures/66b2979c-ef6b-45e5-9f0f-148bafc77a79.jpg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTgyNTQ5NTk2ODU2NTI4ODIz/original/06d05760-46f9-41dc-b3cb-9c004b971538.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-982549596856528823/original/ec76a24b-3832-48fd-90d4-2199ba466d5d.jpeg?im_w=1200'
    ],
    amenities: ['Wifi', 'Home-cooked meals', 'Cultural experiences', 'Local tours', 'Traditional decor'],
    propertyType: 'Room',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 47
  },
  {
    title: 'Resort near Amber Fort, Jaipur',
    description: 'Luxury Resort with Fort Views and Pool',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Amber Fort Road',
      zipCode: '302028',
      coordinates: {
        lat: 26.9855,
        lng: 75.8513
      }
    },
    pricePerNight: 10000,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1006115069280827381/original/7901d325-41dc-4084-b78c-197ffbc62bce.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1006115069280827381/original/f2ea97ad-3e67-4b28-bc98-e8c9caa05fdb.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1006115069280827381/original/0c98d308-54e9-44be-b41e-be834f58fdf3.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Swimming pool', 'Spa', 'Restaurant', 'Bar', 'Fort view'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 58
  },
  {
    title: 'Heritage Villa in Jaipur',
    description: 'Elegant Heritage Villa with Garden and Pool',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Civil Lines',
      zipCode: '302006',
      coordinates: {
        lat: 26.9123,
        lng: 75.7872
      }
    },
    pricePerNight: 8900,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-824234994572159190/original/97a219c6-a10d-4c60-a084-cf2839b6bab7.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/ca978f47-8305-4e72-937a-520b676b3fec.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/e0052a31-4b7b-4f8e-bbdf-a86717f34648.jpg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Swimming pool', 'Garden', 'Breakfast', 'Parking'],
    propertyType: 'Villa',
    numberOfGuests: 8,
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 39
  },
  {
    title: 'Designer Apartment in Jaipur',
    description: 'Stylish Designer Apartment in Malviya Nagar',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Malviya Nagar',
      zipCode: '302017',
      coordinates: {
        lat: 26.8570,
        lng: 75.8099
      }
    },
    pricePerNight: 5500,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1019159129263553072/original/6b5c4805-fd0e-421a-8f9a-900f0ec5c3c2.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1019159129263553072/original/307fb153-3b9f-417c-a888-220516442856.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1019159129263553072/original/71ca04d2-ca8e-4995-8a1a-2400a5415868.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony', 'Designer furniture'],
    propertyType: 'Apartment',
    numberOfGuests: 3,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 28
  },
  {
    title: 'Rooftop Apartment with City Views',
    description: 'Modern Apartment with Stunning Views of Jaipur',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Vaishali Nagar',
      zipCode: '302021',
      coordinates: {
        lat: 26.9056,
        lng: 75.7372
      }
    },
    pricePerNight: 6500,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-690970571530063846/original/1197197f-882e-40a3-9510-3919c4245da5.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-690970571530063846/original/900ef6b7-74a2-4529-a091-2a132f8ab7d6.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-690970571530063846/original/165dfcf5-7419-431f-a152-4d8b6a8d4ca4.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Rooftop terrace', 'City view'],
    propertyType: 'Apartment',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 36
  },
  {
    title: 'Luxury Tent Resort in Jaipur',
    description: 'Royal Desert Tent Experience near Jaipur',
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      streetAddress: 'Delhi Highway',
      zipCode: '303101',
      coordinates: {
        lat: 27.0238,
        lng: 75.7765
      }
    },
    pricePerNight: 14000,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1369417970771169557/original/47dcc93f-3c4b-48a9-8294-d87cf1955534.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1369417970771169557/original/08f53426-4ea7-4ef4-93aa-696e1dbb897c.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1369417970771169557/original/0c627450-fba2-49aa-97c0-36deaef050a0.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Private bathroom', 'Desert views', 'Cultural performances', 'Restaurant'],
    propertyType: 'Other',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 42
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First, delete any existing listings for Jaipur
    const deleteResult = await Listing.deleteMany({
      'location.city': 'Jaipur'
    });

    if (deleteResult.deletedCount > 0) {
      console.log(`Deleted ${deleteResult.deletedCount} existing listings for Jaipur.`);
    }

    // Insert the sample properties one by one
    console.log(`Attempting to insert ${jaipurProperties.length} Jaipur properties...`);
    
    for (let i = 0; i < jaipurProperties.length; i++) {
      try {
        const property = jaipurProperties[i];
        property._id = new ObjectId(); // Add ObjectId to each property
        const newListing = new Listing(property);
        await newListing.save();
        console.log(`Successfully added property ${i+1}/${jaipurProperties.length}: ${property.title}`);
      } catch (error) {
        console.error(`Error adding property ${i+1}/${jaipurProperties.length}:`, error.message);
      }
    }
    
    console.log('Finished adding Jaipur properties to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();