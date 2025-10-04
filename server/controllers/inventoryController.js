const { ObjectId } = require('mongodb');
const dbManager = require('../utils/database');
const Item = require('../models/Item');


// GET all inventory items
const getAllInventory = async (req, res) => {
  try {
    const collection = await dbManager.getCollection('inventory');
    
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
    const collection = await dbManager.getCollection('inventory');
    
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
    const collection = await dbManager.getCollection('inventory');

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
    const collection = await dbManager.getCollection('inventory');

    // Create Item instance
    const newItem = new Item(req.body);

    // Validate item data
    const validationErrors = newItem.validate();
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
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

    // Insert item
    const result = await collection.insertOne(newItem.toObject());

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: newItem.toObject()
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
    const collection = await dbManager.getCollection('inventory');

    // Check if item exists
    const existingItemData = await collection.findOne({ id });
    if (!existingItemData) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    // Create Item instance with existing data
    const item = new Item(existingItemData);

    // Apply updates
    item.update(req.body);

    // Validate updated item
    const validationErrors = item.validate();
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Update in database
    const result = await collection.updateOne(
      { id },
      { $set: item.toObject() }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: item.toObject()
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
    const collection = await dbManager.getCollection('inventory');

    // Try both _id (MongoDB) and id (custom) fields to be flexible
    let result;

    if (ObjectId.isValid(id)) {
      // If it's a valid ObjectId, search by _id
      console.log('Deleting by MongoDB _id:', id);
      result = await collection.deleteOne({ _id: new ObjectId(id) });
    } else {
      // Otherwise, search by custom id field
      console.log('Deleting by custom id:', id);
      result = await collection.deleteOne({ id });
    }

    console.log('Delete result:', result);
    
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
    const collection = await dbManager.getCollection('inventory');
    
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