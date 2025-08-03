require('dotenv').config({ path: '.env.local' });
const express = require('express');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Import routes
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware - configure for production
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://your-frontend-domain.com', // Add your deployed frontend URL
  process.env.FRONTEND_URL // Environment variable for frontend URL
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
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
    endpoints: {
      inventory: '/api/inventory',
      stats: '/api/inventory/stats'
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