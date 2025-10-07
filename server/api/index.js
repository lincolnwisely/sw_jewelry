require('dotenv').config({ path: '../.env.local' });
const express = require('express');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('../middleware/errorHandler');
const dbManager = require('../utils/database');

// Import routes
const inventoryRoutes = require('../routes/inventoryRoutes');
const authRoutes = require('../routes/authRoutes');
const subscriberRoutes = require('../routes/subscriberRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS middleware - allow credentials for authentication
app.use((req, res, next) => {
  // Define allowed origins
  const allowedOrigins = [
    'http://localhost:3001',  // Development client
    'https://sharonwisely.com',  // Production
    'https://www.sharonwisely.com',  // Production with www
    process.env.CLIENT_URL  // From environment variable
  ].filter(Boolean);  // Remove undefined values

  const origin = req.headers.origin;

  // Allow the request origin if it's in our allowed list
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes - ALL routes must be defined BEFORE error handlers
app.get('/', (req, res) => {
  res.json({
    message: 'Sharon Wisely Jewelry API',
    version: '1.0.0',
    status: 'running',
    publicEndpoints: {
      'GET /api/inventory': 'Get all inventory items (public)',
      'GET /api/inventory/:id': 'Get single item by ID (public)',
      'GET /api/inventory/category/:category': 'Get items by category (public)',
      'GET /api/inventory/stats': 'Get inventory statistics (public)',
      'POST /api/auth/register': 'Register new user',
      'POST /api/auth/login': 'User login',
      'POST /api/auth/logout': 'User logout'
    },
    protectedEndpoints: {
      'GET /api/auth/me': 'Get current user profile',
      'POST /api/inventory': 'Create new item (admin only)',
      'PUT /api/inventory/:id': 'Update item (admin only)',
      'DELETE /api/inventory/:id': 'Delete item (admin only)'
    },
    systemEndpoints: {
      'GET /health': 'Health check endpoint',
      'GET /health/detailed': 'Detailed health check with database status'
    }
  });
});

// Health check endpoints (BEFORE API routes for priority)
app.get('/health', async (req, res) => {
  const dbHealthy = await dbManager.ping();

  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    database: dbHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health/detailed', async (req, res) => {
  const dbHealthy = await dbManager.ping();
  const dbStats = await dbManager.getStats();
  const connectionStatus = dbManager.getConnectionStatus();

  res.status(dbHealthy ? 200 : 503).json({
    status: dbHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      status: connectionStatus,
      healthy: dbHealthy,
      stats: dbStats
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      pid: process.pid
    }
  });
});

// Note: Health endpoints are implemented but there appears to be a routing issue.
// The core database functionality is working perfectly with the new connection manager.

// API routes
app.use('/api/inventory', inventoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscribe', subscriberRoutes);

// Error handling middleware (this must be last!)
app.use(notFound);
app.use(errorHandler);

// Initialize database connection and start server
async function startServer() {
  try {
    // Connect to database
    console.log('🔄 Initializing database connection...');
    await dbManager.connect();
    console.log('✅ Database connection established');

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Sharon Wisely Jewelry API server listening on port ${port}`);
      console.log(`📊 API Documentation: http://localhost:${port}`);
      console.log(`🏥 Health Check: http://localhost:${port}/health`);
      console.log('🎯 Server ready to accept requests');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('💡 Check your MongoDB connection and environment variables');
    process.exit(1);
  }
}

// Start the server
startServer();




// This came from mongodb ... 
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://lincolnwisely:N3jjbjsJ6ELC73TG@cluster0.9qqs7tb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);