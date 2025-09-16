require('dotenv').config({ path: '../../.env.local' });
const { MongoClient, ServerApiVersion } = require('mongodb');

// MongoDB connection configuration
const username = process.env.MONGODB_USERNAME || 'lincolnwisely';
const password = process.env.MONGODB_PASSWORD;
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

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();

    const db = client.db(databaseName);
    const usersCollection = db.collection('users');

    // Get all users
    const users = await usersCollection.find({}).toArray();

    console.log('\n=== All Users in Database ===');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Name: ${user.firstName} ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Check specific admin users
    console.log('=== Admin Users ===');
    const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();
    console.log(`Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach(admin => {
      console.log(`- ${admin.email} (${admin.firstName} ${admin.lastName})`);
    });

  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

checkUsers().catch(console.error);