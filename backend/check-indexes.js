require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Get the listings collection
    const listingsCollection = mongoose.connection.collection('listings');
    
    // Get all indexes
    const indexes = await listingsCollection.indexes();
    console.log('Indexes on listings collection:', JSON.stringify(indexes, null, 2));
    
    // Check if there are any documents in the collection
    const count = await listingsCollection.countDocuments();
    console.log(`Total documents in listings collection: ${count}`);
    
    if (count > 0) {
      // Get a sample document
      const sampleDoc = await listingsCollection.findOne();
      console.log('Sample document:', JSON.stringify(sampleDoc, null, 2));
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