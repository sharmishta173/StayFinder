require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const count = await Listing.countDocuments({'location.city': 'North Goa'});
  console.log(`Found ${count} North Goa listings`);
  
  if (count > 0) {
    const listings = await Listing.find({'location.city': 'North Goa'}).limit(1);
    console.log('Sample listing:', JSON.stringify(listings[0], null, 2));
  }
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});