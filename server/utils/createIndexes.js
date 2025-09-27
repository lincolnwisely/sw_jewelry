require('dotenv').config({ path: '../.env.local' });
const dbManager = require('./database');

async function createIndexes() {
  try {
    console.log('🔄 Creating database indexes...');

    // Get collections
    const inventoryCollection = await dbManager.getCollection('inventory');
    const usersCollection = await dbManager.getCollection('users');

    console.log('📊 Creating inventory indexes...');

    // Inventory indexes for better query performance
    await inventoryCollection.createIndex({ category: 1 }, { name: 'category_1' });
    console.log('  ✅ Created index on category');

    await inventoryCollection.createIndex({ price: 1 }, { name: 'price_1' });
    console.log('  ✅ Created index on price');

    await inventoryCollection.createIndex({ tags: 1 }, { name: 'tags_1' });
    console.log('  ✅ Created index on tags');

    await inventoryCollection.createIndex({ inStock: 1 }, { name: 'inStock_1' });
    console.log('  ✅ Created index on inStock');

    // Unique index on custom id field
    await inventoryCollection.createIndex({ id: 1 }, { unique: true, name: 'id_unique' });
    console.log('  ✅ Created unique index on id');

    // Compound indexes for common query patterns
    await inventoryCollection.createIndex(
      { category: 1, price: 1 },
      { name: 'category_price_1' }
    );
    console.log('  ✅ Created compound index on category + price');

    await inventoryCollection.createIndex(
      { category: 1, inStock: 1 },
      { name: 'category_inStock_1' }
    );
    console.log('  ✅ Created compound index on category + inStock');

    // Text index for search functionality
    await inventoryCollection.createIndex(
      {
        title: 'text',
        description: 'text',
        tags: 'text'
      },
      {
        name: 'text_search',
        weights: {
          title: 10,
          tags: 5,
          description: 1
        }
      }
    );
    console.log('  ✅ Created text search index on title, description, tags');

    console.log('👤 Creating user indexes...');

    // User indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true, name: 'email_unique' });
    console.log('  ✅ Created unique index on email');

    await usersCollection.createIndex({ role: 1 }, { name: 'role_1' });
    console.log('  ✅ Created index on role');

    await usersCollection.createIndex({ isActive: 1 }, { name: 'isActive_1' });
    console.log('  ✅ Created index on isActive');

    await usersCollection.createIndex({ createdAt: 1 }, { name: 'createdAt_1' });
    console.log('  ✅ Created index on createdAt');

    await usersCollection.createIndex({ lastLogin: 1 }, { name: 'lastLogin_1' });
    console.log('  ✅ Created index on lastLogin');

    // Compound index for user queries
    await usersCollection.createIndex(
      { email: 1, isActive: 1 },
      { name: 'email_isActive_1' }
    );
    console.log('  ✅ Created compound index on email + isActive');

    console.log('✅ All database indexes created successfully!');

    // Display index information
    console.log('\n📋 Index Summary:');

    const inventoryIndexes = await inventoryCollection.indexes();
    console.log(`\n📦 Inventory Collection (${inventoryIndexes.length} indexes):`);
    inventoryIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    const userIndexes = await usersCollection.indexes();
    console.log(`\n👤 Users Collection (${userIndexes.length} indexes):`);
    userIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

  } catch (error) {
    console.error('❌ Error creating indexes:', error);

    // Handle specific index creation errors
    if (error.code === 11000) {
      console.error('💡 Duplicate key error - some indexes may already exist');
    } else if (error.codeName === 'IndexOptionsConflict') {
      console.error('💡 Index options conflict - index may already exist with different options');
    }

    throw error;
  } finally {
    // Close database connection
    await dbManager.close();
  }
}

// Run the script if called directly
if (require.main === module) {
  createIndexes()
    .then(() => {
      console.log('🎯 Index creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Index creation failed:', error);
      process.exit(1);
    });
}

module.exports = createIndexes;