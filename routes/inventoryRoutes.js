const express = require('express');
const router = express.Router();
const {
  getAllInventory,
  getInventoryByCategory,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoryStats
} = require('../controllers/inventoryController');

// GET all inventory items with optional filtering
// Query parameters: category, tag, minPrice, maxPrice, inStock
router.get('/', getAllInventory);

// GET inventory statistics
router.get('/stats', getInventoryStats);

// GET all items in given category (must come before /:id to avoid conflicts)
router.get('/category/:category', getInventoryByCategory);

// GET single inventory item by ID
router.get('/:id', getInventoryById);

// POST create new inventory item
router.post('/', createInventoryItem);

// PUT update inventory item
router.put('/:id', updateInventoryItem);

// DELETE inventory item
router.delete('/:id', deleteInventoryItem);

module.exports = router; 