require('dotenv').config({ path: '../.env.local' });
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

async function updateUserRole() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();

    const db = client.db(databaseName);
    const usersCollection = db.collection('users');

    // List all users first
    console.log('\n=== Current Users ===');
    const users = await usersCollection.find({}, {
      projection: { email: 1, firstName: 1, lastName: 1, role: 1 }
    }).toArray();

    users.forEach(user => {
      console.log(`- ${user.email}: ${user.firstName} ${user.lastName} (role: ${user.role || 'undefined'})`);
    });

    // Get email from command line argument
    const emailToUpdate = process.argv[2];

    if (!emailToUpdate) {
      console.log('\nUsage: node updateUserRole.js <email>');
      console.log('Example: node updateUserRole.js your@email.com');
      return;
    }

    // Update the specified user to admin
    console.log(`\nUpdating ${emailToUpdate} to admin role...`);

    const result = await usersCollection.updateOne(
      { email: emailToUpdate },
      {
        $set: {
          role: 'admin',
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ User with email ${emailToUpdate} not found`);
    } else if (result.modifiedCount > 0) {
      console.log(`✅ Successfully updated ${emailToUpdate} to admin role`);

      // Verify the update
      const updatedUser = await usersCollection.findOne(
        { email: emailToUpdate },
        { projection: { email: 1, firstName: 1, lastName: 1, role: 1 } }
      );
      console.log(`✅ Verified: ${updatedUser.email} now has role: ${updatedUser.role}`);
    } else {
      console.log(`ℹ️  User ${emailToUpdate} already has admin role`);
    }

  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

// Run the update function
updateUserRole().catch(console.error);