const { MongoClient, ServerApiVersion } = require('mongodb');

class DatabaseManager {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnecting = false;
  }

  async connect() {
    if (this.db && this.client?.topology?.isConnected()) {
      return this.db;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.db;
    }

    try {
      this.isConnecting = true;

      // MongoDB connection configuration
      const username = process.env.MONGODB_USERNAME || 'lincolnwisely';
      const password = process.env.MONGODB_PASSWORD;
      const cluster = process.env.MONGODB_CLUSTER || 'cluster0.9qqs7tb.mongodb.net';
      const databaseName = process.env.MONGODB_DATABASE || 'sw_jewelry_db';

      if (!password) {
        throw new Error('MONGODB_PASSWORD environment variable is required');
      }

      const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=Cluster0`;

      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: false, // Disable strict mode to allow text indexes
          deprecationErrors: true,
        },
        // Connection pool settings
        maxPoolSize: 10, // Maximum connections in pool
        minPoolSize: 2,  // Minimum connections to maintain
        maxIdleTimeMS: 30000, // Close connections after 30s idle
        serverSelectionTimeoutMS: 5000, // How long to try selecting server
        socketTimeoutMS: 45000, // Socket timeout
        // Retry settings
        retryWrites: true,
        retryReads: true
      });

      await this.client.connect();
      this.db = this.client.db(databaseName);

      console.log('✅ MongoDB connected with connection pool');
      console.log(`📊 Database: ${databaseName}`);
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      this.client = null;
      this.db = null;
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  async getDb() {
    if (!this.db || !this.client?.topology?.isConnected()) {
      return await this.connect();
    }
    return this.db;
  }

  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('📴 MongoDB connection closed');
    }
  }

  // Get collection with automatic connection
  async getCollection(name) {
    const db = await this.getDb();
    return db.collection(name);
  }

  // Health check
  async ping() {
    try {
      const db = await this.getDb();
      await db.admin().ping();
      return true;
    } catch (error) {
      console.error('Database ping failed:', error);
      return false;
    }
  }

  // Get connection status
  getConnectionStatus() {
    if (!this.client) {
      return 'disconnected';
    }

    if (this.isConnecting) {
      return 'connecting';
    }

    if (this.client.topology?.isConnected()) {
      return 'connected';
    }

    return 'disconnected';
  }

  // Get database statistics
  async getStats() {
    try {
      const db = await this.getDb();
      const stats = await db.stats();
      return {
        collections: stats.collections,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        storageSize: stats.storageSize
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return null;
    }
  }
}

// Singleton instance
const dbManager = new DatabaseManager();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database connection...');
  await dbManager.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database connection...');
  await dbManager.close();
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('Uncaught Exception:', error);
  await dbManager.close();
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await dbManager.close();
  process.exit(1);
});

module.exports = dbManager;