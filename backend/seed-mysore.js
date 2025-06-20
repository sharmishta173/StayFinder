const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const { ObjectId } = mongoose.Types;
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err.message);
  process.exit(1);
});

// Sample Mysore properties
const mysoreProperties = [
  {
    title: 'Heritage Villa in Mysore',
    description: 'Elegant Heritage Villa near Mysore Palace',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'Sayyaji Rao Road',
      zipCode: '570001',
      coordinates: {
        lat: 12.3052,
        lng: 76.6552
      }
    },
    pricePerNight: 14500,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM2NDM5NzA4MTA4NjQ1MDgzMQ==/original/b11b37a7-739b-4735-a0e0-07231cd8f58c.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM2NDM5NzA4MTA4NjQ1MDgzMQ==/original/7f01cd99-ee31-4581-82e9-9d71aabd7c2c.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM2NDM5NzA4MTA4NjQ1MDgzMQ==/original/7f01cd99-ee31-4581-82e9-9d71aabd7c2c.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Garden', 'Palace view', 'Breakfast'],
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
    title: 'Boutique Hotel in Mysore',
    description: 'Luxury Boutique Hotel with Palace Views',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'Devaraja Mohalla',
      zipCode: '570001',
      coordinates: {
        lat: 12.3075,
        lng: 76.6539
      }
    },
    pricePerNight: 12000,
    images: [
      'https://image.wedmegood.com/resized/800X/uploads/member/178485/1500018865_1499768843_Hotel_Photo.jpg',
      'https://media-cdn.tripadvisor.com/media/photo-s/15/17/9c/a7/luxury-room.jpg',
      'https://th.bing.com/th/id/OIP.xXt5gvcRjnHDZtDlG3TX7AHaE9?w=265&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Restaurant', 'Bar', 'Spa', 'Room service'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 62
  },
  {
    title: 'Apartment in Mysore',
    description: 'Modern Apartment near Chamundi Hills',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'Chamundi Hill Road',
      zipCode: '570010',
      coordinates: {
        lat: 12.2724,
        lng: 76.6767
      }
    },
    pricePerNight: 8500,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1122447747037034371/original/65239234-728e-4104-a988-6462161ef162.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1122447747037034371/original/1e836eb2-e48f-4299-8a15-2f4a5f1bc483.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1122447747037034371/original/72edb9b9-d1a6-48f2-bbc1-51acee384664.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony', 'Parking'],
    propertyType: 'Apartment',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.6,
    reviewCount: 28
  },
  {
    title: 'Colonial Bungalow in Mysore',
    description: 'Historic Colonial Bungalow with Garden',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'Nazarbad',
      zipCode: '570010',
      coordinates: {
        lat: 12.2980,
        lng: 76.6580
      }
    },
    pricePerNight: 16000,
    images: [
      'https://a0.muscache.com/im/pictures/prohost-api/Hosting-1446093773320531980/original/248e4e1f-7506-491c-a70a-2e6120e7a735.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTMzMTE2MjEyMDczNjExMzc4NA%3D%3D/original/57ff3ab7-7f12-43fa-9ee7-dc46f15d2b9d.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1330507672940872048/original/86d17a1f-2eaf-49c6-ab86-1b900e8a13f7.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Garden', 'Veranda', 'Breakfast', 'Parking'],
    propertyType: 'House',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 37
  },
  {
    title: 'Homestay in Mysore',
    description: 'Traditional Mysore Homestay with Cultural Experience',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'Lakshmipuram',
      zipCode: '570004',
      coordinates: {
        lat: 12.3120,
        lng: 76.6500
      }
    },
    pricePerNight: 6500,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-878260738850217207/original/93f3407f-a989-44f7-83f5-7b7381a02391.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/8fd50c7d-42e3-4643-a4a6-49809a8e1f0f.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-53790595/original/3637a033-6776-4548-9be9-14ead1129f11.jpeg?im_w=1200'
    ],
    amenities: ['Wifi', 'Home-cooked meals', 'Cultural experiences', ],
    propertyType: 'Room',
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
    title: 'Resort in Mysore',
    description: 'Luxury Resort with Pool and Spa',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'Mysore-Bangalore Highway',
      zipCode: '570008',
      coordinates: {
        lat: 12.3350,
        lng: 76.6400
      }
    },
    pricePerNight: 18000,
    images: [
      'https://www.thegari.in/blog/wp-content/uploads/2024/12/Five-Star-Resorts-near-Bangalore.webp',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREjG3IGJdCb9qgi41joBCX3zRjWmW9wcqVzhqpnjx9uuPHp_hcM30-dR_pYN1_CxBK6oU&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzZJs3B_vL5LX2kGkXtNlBlmHMUScKr55prvNVgSQdmmQCyFKDfL9MRqyL0pD9HkzFhNQ&usqp=CAU'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Swimming pool', 'Spa', 'Restaurant', 'Bar', 'Gym'],
    propertyType: 'Hotel',
    numberOfGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 68
  },
  {
    title: 'Cottage near Brindavan Gardens, Mysore',
    description: 'Peaceful Cottage with Garden Views',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'KRS Road',
      zipCode: '571607',
      coordinates: {
        lat: 12.4242,
        lng: 76.5728
      }
    },
    pricePerNight: 9500,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1049878801069226446/original/bfdaa091-f3ff-46a5-9c48-20e2b4c68136.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTA0OTg3ODgwMTA2OTIyNjQ0Ng%3D%3D/original/7db63c58-5d1b-4fda-befa-8752f90ed351.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1049878801069226446/original/85faa87b-e998-484c-8313-ff1cd807c8af.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Garden', 'Breakfast'],
    propertyType: 'Cottage',
    numberOfGuests: 3,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 41
  },
  {
    title: 'View Apartment in Mysore',
    description: 'Modern Apartment with nature View',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'JLB Road',
      zipCode: '570005',
      coordinates: {
        lat: 12.3070,
        lng: 76.6560
      }
    },
    pricePerNight: 10500,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1282440396789583355/original/53930eab-dd2a-4c0c-9a18-0e0f6cf50d3c.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1282440396789583355/original/11b6d258-a717-46b3-8c8c-496247b1d0e4.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1282440396789583355/original/0ce2202a-332c-4df1-beeb-17d2ff883cb7.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Kitchen', 'Balcony'],
    propertyType: 'Apartment',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 33
  },
  {
    title: 'Dorm in Mysore',
    description: 'Peaceful Yoga Retreat with Ayurvedic Treatments',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'Gokulam',
      zipCode: '570002',
      coordinates: {
        lat: 12.3310,
        lng: 76.6360
      }
    },
    pricePerNight: 11000,
    images: [
      'https://images.unsplash.com/photo-1545389336-cf090694435e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1532798442725-41036acc7489?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Yoga studio', 'Ayurvedic treatments', 'Vegetarian meals', 'Garden', 'Meditation space'],
    propertyType: 'House',
    numberOfGuests: 5,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 47
  },
  {
    title: 'Heritage Haveli in Mysore',
    description: 'Restored Heritage Haveli with Traditional Decor',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      country: 'India',
      streetAddress: 'Agrahara',
      zipCode: '570004',
      coordinates: {
        lat: 12.3140,
        lng: 76.6520
      }
    },
    pricePerNight: 13500,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0'
    ],
    amenities: ['Wifi', 'Air conditioning', 'Courtyard', 'Traditional decor', 'Breakfast', 'Cultural experiences'],
    propertyType: 'House',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 39
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First, delete any existing listings for Mysore
    const deleteResult = await Listing.deleteMany({
      'location.city': 'Mysore'
    });
    
    console.log(`Deleted ${deleteResult.deletedCount} existing Mysore listings`);

    // Insert the sample properties one by one with generated _id
    let insertedCount = 0;
    for (const property of mysoreProperties) {
      // Add _id field with ObjectId
      property._id = new ObjectId();
      await Listing.create(property);
      insertedCount++;
    }

    console.log(`Successfully added ${insertedCount} Mysore properties to the database!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// The seedDatabase function is now called after successful MongoDB connection