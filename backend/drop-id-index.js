require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const listingsCollection = mongoose.connection.collection('listings');
    
    // Get all indexes
    const indexes = await listingsCollection.indexes();
    console.log('Current indexes:', JSON.stringify(indexes, null, 2));
    
    // Check if there's an index on 'id'
    const idIndex = indexes.find(index => index.key && index.key.id);
    
    if (idIndex) {
      console.log(`Found 'id' index: ${idIndex.name}. Attempting to drop...`);
      await listingsCollection.dropIndex(idIndex.name);
      console.log(`Successfully dropped index: ${idIndex.name}`);
    } else {
      console.log("No 'id' index found.");
    }
    
    // Verify indexes after drop
    const updatedIndexes = await listingsCollection.indexes();
    console.log('Updated indexes:', JSON.stringify(updatedIndexes, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});