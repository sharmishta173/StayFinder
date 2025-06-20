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

// Sample Darjeeling properties
const darjeelingProperties = [
  {
    title: 'Colonial Bungalow in Darjeeling',
    description: 'Historic Colonial Bungalow with Kanchenjunga Views',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'Mall Road',
      zipCode: '734101',
      coordinates: {
        lat: 27.0380,
        lng: 88.2663
      }
    },
    pricePerNight: 4000,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-36252197/original/a1515a06-4c8a-411b-a29b-834a931469aa.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-36252197/original/55577f30-12be-4c24-a9d2-e8fee769d60a.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-36252197/original/60d9826e-cbf9-4190-83d5-e527701c4559.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Fireplace', 'Garden', 'Mountain view', 'Breakfast', 'Library'],
    propertyType: 'House',
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
    title: 'Tea Garden Cottage in Darjeeling',
    description: 'Charming Cottage in Working Tea Estate',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'Happy Valley Tea Estate',
      zipCode: '734101',
      coordinates: {
        lat: 27.0486,
        lng: 88.2631
      }
    },
    pricePerNight: 3000,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1003150198910126211/original/5574d958-bb14-4da3-a305-84d3c11314a2.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTAwMzE1MDE5ODkxMDEyNjIxMQ%3D%3D/original/f3c4d983-5ab6-4017-b249-0b22bf1b8c63.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1003150198910126211/original/b34834e9-32fc-4827-aa10-5ca1bdb773ce.jpeg?im_w=720'
    ],
    amenities: ['Wifi', 'Tea estate tours', 'Breakfast', 'Garden', 'Mountain view'],
    propertyType: 'Cottage',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.8,
    reviewCount: 38
  },
  {
    title: 'Boutique Hotel in Darjeeling',
    description: 'Elegant Boutique Hotel with Himalayan Views',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'The Mall',
      zipCode: '734101',
      coordinates: {
        lat: 27.0410,
        lng: 88.2630
      }
    },
    pricePerNight: 6000,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1385760320281451296/original/79cf385a-467f-49fa-a331-2b9bfd81c0ca.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1385760320281451296/original/ef27936e-65a8-409f-8bdd-12de4e0f4a5c.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1385760320281451296/original/3a374e58-4c65-40ac-b6d1-d8777697f549.jpeg?im_w=1200'
    ],
    amenities: ['Wifi', 'Restaurant', 'Bar', 'Mountain view', 'Room service', 'Library'],
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
    title: 'Mountain View Apartment in Darjeeling',
    description: 'Modern Apartment with Panoramic Himalayan Views',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'Gandhi Road',
      zipCode: '734101',
      coordinates: {
        lat: 27.0356,
        lng: 88.2627
      }
    },
    pricePerNight: 3500,
    images: [
      'https://a0.muscache.com/im/pictures/a9d35d41-dd13-4ce9-b4f7-02cd63d9abab.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/94817ef9-15a1-4318-bc92-b6bbcb999c07.jpg?im_w=720',
      'https://a0.muscache.com/im/pictures/37d6661b-7a77-44dc-a160-41bf9dcffd1f.jpg?im_w=720',
    ],
    amenities: ['Wifi', 'Heating', 'Kitchen', 'Balcony', 'Mountain view'],
    propertyType: 'Apartment',
    numberOfGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: false,
    rating: 4.7,
    reviewCount: 32
  },
  {
    title: 'Heritage Homestay in Darjeeling',
    description: 'Traditional Homestay with Authentic Local Experience',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'Lebong',
      zipCode: '734105',
      coordinates: {
        lat: 27.0553,
        lng: 88.2698
      }
    },
    pricePerNight: 4500,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1073040032399906390/original/ae9e0b06-b54c-42a1-b268-4f072d289d6c.png?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1073040032399906390/original/ba759395-8577-4f68-ba7d-44a11e84cea9.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1073040032399906390/original/ba759395-8577-4f68-ba7d-44a11e84cea9.jpeg?im_w=720',
    ],
    amenities: ['Wifi', 'Home-cooked meals', 'Cultural experiences', 'Local tours', 'Mountain view'],
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
    title: 'Luxury Resort in Darjeeling',
    description: 'Premium Resort with Spa and Mountain Views',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'Tiger Hill Road',
      zipCode: '734101',
      coordinates: {
        lat: 27.0087,
        lng: 88.2634
      }
    },
    pricePerNight: 3000,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQzNDgyMzM3NzM5NDkxMjI4OA==/original/550481f1-1e31-4f4f-b0f1-bc7414797321.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTE3NDM5ODMzMDAzMjE2MjI4OA==/original/ebc3706d-a739-435f-b08e-ae05dd34a586.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTQzNDgyMzM3NzM5NDkxMjI4OA==/original/07d929e4-d5ab-4576-9325-0742dddfd84b.jpeg?im_w=720',
    ],
    amenities: ['Wifi', 'Spa', 'Restaurant', 'Bar', 'Mountain view', 'Room service', 'Gym'],
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
    title: 'Cozy Cottage near Tiger Hill',
    description: 'Peaceful Cottage with Sunrise Views of Kanchenjunga',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'Tiger Hill',
      zipCode: '734101',
      coordinates: {
        lat: 27.0075,
        lng: 88.2650
      }
    },
    pricePerNight: 3000,
    images: [
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1235087916669178915/original/61c2236f-5caf-4802-86ae-4d0dddbb7565.jpeg?im_w=1200',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1235087916669178915/original/5651cc2e-694b-4928-9bb6-2f9084d13f71.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/hosting/Hosting-1235087916669178915/original/15cd208a-cae8-4d69-9acd-706667cd9e2f.jpeg?im_w=720',
    ],
    amenities: ['Wifi', 'Fireplace', 'Breakfast', 'Garden', 'Mountain view', 'Sunrise tours'],
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
    title: 'Toy Train View Guesthouse',
    description: 'Charming Guesthouse with Views of the Darjeeling Himalayan Railway',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'Hill Cart Road',
      zipCode: '734101',
      coordinates: {
        lat: 27.0331,
        lng: 88.2618
      }
    },
    pricePerNight: 3500,
    images: [
     'https://a0.muscache.com/im/pictures/miso/Hosting-1364899477049833784/original/3e9ffb19-de7c-4e89-9099-4e0303b41025.jpeg?im_w=720',
     'https://a0.muscache.com/im/pictures/hosting/Hosting-1364899477049833784/original/d023a5a3-0e49-4179-857b-67396ef29be9.jpeg?im_w=720',
     'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTM2NDg5OTQ3NzA0OTgzMzc4NA==/original/77eee2cd-c4fe-498b-8c5e-f2894c2190b0.jpeg?im_w=720',
    ],
    amenities: ['Wifi', 'Breakfast', 'Garden', 'Railway view', 'Local tours'],
    propertyType: 'Other',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.7,
    reviewCount: 36
  },
  {
    title: 'Himalayan Retreat in Darjeeling',
    description: 'Secluded Mountain Retreat with Panoramic Views',
    location: {
      city: 'Darjeeling',
      state: 'West Bengal',
      country: 'India',
      streetAddress: 'Jalapahar',
      zipCode: '734101',
      coordinates: {
        lat: 27.0280,
        lng: 88.2570
      }
    },
    pricePerNight: 8500,
    images: [
      'https://a0.muscache.com/im/pictures/miso/Hosting-1268830022594877782/original/2da0fe6d-7c4d-4df9-b16e-f55c2db9d04b.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1268830022594877782/original/61b4be22-ad25-4324-a74c-79418c3c03dd.jpeg?im_w=720',
      'https://a0.muscache.com/im/pictures/miso/Hosting-1268830022594877782/original/e12bdc71-e6e5-4401-b04b-cf321ad7fcc1.jpeg?im_w=720',
    ],
    amenities: ['Wifi', 'Fireplace', 'Kitchen', 'Terrace', 'Mountain view', 'Hiking trails'],
    propertyType: 'Villa',
    numberOfGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    host: '60d0fe4f5311236168a109ca', // This should be a valid user ID in your database
    isGuestFavorite: true,
    rating: 4.9,
    reviewCount: 34
  },
  
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // First, delete any existing listings for Darjeeling
    const deleteResult = await Listing.deleteMany({
      'location.city': 'Darjeeling'
    });

    if (deleteResult.deletedCount > 0) {
      console.log(`Deleted ${deleteResult.deletedCount} existing listings for Darjeeling.`);
    }

    // Insert the sample properties one by one
    console.log(`Attempting to insert ${darjeelingProperties.length} Darjeeling properties...`);
    
    for (let i = 0; i < darjeelingProperties.length; i++) {
      try {
        const property = darjeelingProperties[i];
        property._id = new ObjectId(); // Add ObjectId to each property
        const newListing = new Listing(property);
        await newListing.save();
        console.log(`Successfully added property ${i+1}/${darjeelingProperties.length}: ${property.title}`);
      } catch (error) {
        console.error(`Error adding property ${i+1}/${darjeelingProperties.length}:`, error.message);
      }
    }
    
    console.log('Finished adding Darjeeling properties to the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();