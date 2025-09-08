require('dotenv').config({ path: '.env.local' });
const { MongoClient, ServerApiVersion } = require('mongodb');
const User = require('../models/User');

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

async function setupUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    
    const db = client.db(databaseName);
    const usersCollection = db.collection('users');
    
    // Check if users collection already has data
    const existingCount = await usersCollection.countDocuments();
    if (existingCount > 0) {
      console.log(`Users collection already contains ${existingCount} users.`);
      console.log('Skipping user setup. To reset, manually clear the users collection first.');
      return;
    }
    
    console.log('Setting up users collection...');
    
    // Create indexes for better performance
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ role: 1 });
    await usersCollection.createIndex({ isActive: 1 });
    
    console.log('Created database indexes for users collection');
    
    // Create demo/seed users
    const demoUsers = [
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'demo@admin.com',
        password: 'password123',
        role: 'admin'
      },
      {
        firstName: 'Demo',
        lastName: 'Customer',
        email: 'demo@customer.com',
        password: 'password123',
        role: 'customer'
      },
      {
        firstName: 'Sharon',
        lastName: 'Wisely',
        email: 'sharon@sharonwisely.com',
        password: 'securepassword123',
        role: 'admin'
      },
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'testpassword123',
        role: 'customer'
      }
    ];
    
    console.log('Creating demo users...');
    
    for (const userData of demoUsers) {
      const user = new User(userData);
      
      // Validate user data
      const validationErrors = user.validate();
      if (validationErrors.length > 0) {
        console.error(`Validation failed for ${userData.email}:`, validationErrors);
        continue;
      }
      
      // Hash password
      await user.hashPassword();
      
      // Insert user
      const result = await usersCollection.insertOne(user);
      console.log(`✓ Created ${user.role}: ${user.email} (ID: ${result.insertedId})`);
    }
    
    // Display collection statistics
    const totalUsers = await usersCollection.countDocuments();
    const adminCount = await usersCollection.countDocuments({ role: 'admin' });
    const customerCount = await usersCollection.countDocuments({ role: 'customer' });
    const activeCount = await usersCollection.countDocuments({ isActive: true });
    
    console.log('\n=== Users Collection Summary ===');
    console.log(`Total users: ${totalUsers}`);
    console.log(`Admins: ${adminCount}`);
    console.log(`Customers: ${customerCount}`);
    console.log(`Active users: ${activeCount}`);
    
    console.log('\n=== Demo Login Credentials ===');
    console.log('Admin: demo@admin.com / password123');
    console.log('Customer: demo@customer.com / password123');
    console.log('Owner: sharon@sharonwisely.com / securepassword123');
    
  } catch (error) {
    console.error('Error setting up users:', error);
    
    // If it's a duplicate key error, provide helpful message
    if (error.code === 11000) {
      console.error('Duplicate email detected. Each user must have a unique email address.');
    }
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the setup function
setupUsers().catch(console.error);