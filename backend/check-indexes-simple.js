require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const listingsCollection = mongoose.connection.collection('listings');
    const indexes = await listingsCollection.indexes();
    console.log(JSON.stringify(indexes, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});