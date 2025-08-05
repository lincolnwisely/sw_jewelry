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

// Helper function to get database connection
async function getDatabase() {
  try {
    await client.connect();
    return client.db(databaseName);
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}


const validCategories = ['rings', 'bracelets', 'necklaces', 'earrings', 'other'];


// GET all inventory items
const getAllInventory = async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('inventory');
    
    const { category, tag, minPrice, maxPrice, inStock } = req.query;
    let query = {};
    
    // Apply filters
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    if (inStock !== undefined) {
      query.inStock = { $gt: 0 };
    }
    
    const items = await collection.find(query).toArray();
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory items',
      error: error.message
    });
  }
};

// GET single inventory item by ID
const getInventoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    const collection = db.collection('inventory');
    
    const item = await collection.findOne({ id });
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory item',
      error: error.message
    });
  }
};

// GET all items in given category
const getInventoryByCategory = async (req, res) => {

  try {
    const { category } = req.params;
    const db = await getDatabase();
    const collection = db.collection('inventory');

    const items = await collection.find({ category }).toArray();
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching inventory items by category:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory items by category',
      error: error.message
    });
  }
};

// POST create new inventory item
const createInventoryItem = async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('inventory');
    
    const newItem = req.body;
    
    // Validate required fields
    const requiredFields = ['id', 'title', 'description', 'price', 'inStock', 'image', 'tags', 'category'];
    const missingFields = requiredFields.filter(field => !newItem[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Check if item with same ID already exists
    const existingItem = await collection.findOne({ id: newItem.id });
    if (existingItem) {
      return res.status(409).json({
        success: false,
        message: 'Item with this ID already exists'
      });
    }
    
    // Validate category
    if (!validCategories.includes(newItem.category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: rings, bracelets, necklaces, earrings'
      });
    }
    
    // Validate price and stock
    if (newItem.price < 0 || newItem.inStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price and stock must be non-negative numbers'
      });
    }
    
    const result = await collection.insertOne(newItem);
    
    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: newItem
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating inventory item',
      error: error.message
    });
  }
};

// PUT update inventory item
const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const db = await getDatabase();
    const collection = db.collection('inventory');
    
    // Check if item exists
    const existingItem = await collection.findOne({ id });
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    // Validate category if provided
    if (updateData.category) {
      if (!validCategories.includes(updateData.category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category. Must be one of: rings, bracelets, necklaces, earrings'
        });
      }
    }
    
    // Validate price and stock if provided
    if (updateData.price !== undefined && updateData.price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a non-negative number'
      });
    }
    
    if (updateData.inStock !== undefined && updateData.inStock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be a non-negative number'
      });
    }
    
    const result = await collection.updateOne(
      { id },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    // Get updated item
    const updatedItem = await collection.findOne({ id });
    
    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating inventory item',
      error: error.message
    });
  }
};

// DELETE inventory item
const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await getDatabase();
    const collection = db.collection('inventory');
    
    const result = await collection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting inventory item',
      error: error.message
    });
  }
};

// GET inventory statistics
const getInventoryStats = async (req, res) => {
  try {
    const db = await getDatabase();
    const collection = db.collection('inventory');
    
    const totalItems = await collection.countDocuments();
    const totalValue = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price', '$inStock'] } },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]).toArray();
    
    const categoryStats = await collection.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$inStock' },
          avgPrice: { $avg: '$price' }
        }
      }
    ]).toArray();
    
    const lowStockItems = await collection.find({ inStock: { $lt: 5 } }).toArray();
    
    res.json({
      success: true,
      data: {
        totalItems,
        totalValue: totalValue[0]?.totalValue || 0,
        avgPrice: totalValue[0]?.avgPrice || 0,
        priceRange: {
          min: totalValue[0]?.minPrice || 0,
          max: totalValue[0]?.maxPrice || 0
        },
        categoryStats,
        lowStockItems: lowStockItems.length
      }
    });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllInventory,
  getInventoryById,
  getInventoryByCategory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats
}; 