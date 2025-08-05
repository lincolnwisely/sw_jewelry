require('dotenv').config({ path: '.env.local' });
const express = require('express');
const { errorHandler, notFound } = require('../middleware/errorHandler');

// Import routes
const inventoryRoutes = require('../routes/inventoryRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware - allow public access
app.use((req, res, next) => {
  // Allow all origins for public endpoints
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Sharon Wisely Jewelry API',
    version: '1.0.0',
    publicEndpoints: {
      'GET /api/inventory': 'Get all inventory items (public)',
      'GET /api/inventory/:id': 'Get single item by ID (public)',
      'GET /api/inventory/category/:category': 'Get items by category (public)',
      'GET /api/inventory/stats': 'Get inventory statistics (public)'
    },
    protectedEndpoints: {
      'POST /api/inventory': 'Create new item (admin only)',
      'PUT /api/inventory/:id': 'Update item (admin only)',
      'DELETE /api/inventory/:id': 'Delete item (admin only)'
    }
  });
});

// API routes
app.use('/api/inventory', inventoryRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Sharon Wisely Jewelry API server listening on port ${port}`);
  console.log(`API Documentation: http://localhost:${port}`);
});




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