require('dotenv').config({ path: '.env.local' });
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection configuration
const username = process.env.MONGODB_USERNAME || 'lincolnwisely';
const password = process.env.MONGODB_PASSWORD;


console.log(process.env.MONGODB_PASSWORD);
const cluster = process.env.MONGODB_CLUSTER || 'cluster0.9qqs7tb.mongodb.net';
const databaseName = process.env.MONGODB_DATABASE || 'sw_jewelry_db';

if (!password) {
  console.error('MONGODB_PASSWORD environment variable is required');
  process.exit(1);
}

const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(databaseName);
    const collection = db.collection('inventory');
    
    // Check if data already exists
    const existingCount = await collection.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already contains ${existingCount} items. Skipping seed.`);
      console.log('To reseed, first clear the collection or use --force flag');
      return;
    }
    
    // Read the example jewelry data
    const dataPath = path.join(__dirname, '..', 'example_jewelry.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const jewelryData = JSON.parse(rawData);
    
    console.log('Seeding database with jewelry inventory...');
    
    // Insert the inventory items
    const result = await collection.insertMany(jewelryData.inventory);
    
    console.log(`Successfully seeded database with ${result.insertedCount} items!`);
    
    // Display some statistics
    const stats = await collection.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$inStock' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]).toArray();
    
    console.log('\nInventory Summary:');
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} items, ${stat.totalStock} in stock, avg price: $${stat.avgPrice.toFixed(2)}`);
    });
    
    const totalItems = await collection.countDocuments();
    const totalValue = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$inStock'] } }
        }
      }
    ]).toArray();
    
    console.log(`\nTotal items: ${totalItems}`);
    console.log(`Total inventory value: $${totalValue[0]?.totalValue.toFixed(2) || '0.00'}`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
    console.log('Database connection closed.');
  }
}

// Run the seed function
seedDatabase().catch(console.error); 