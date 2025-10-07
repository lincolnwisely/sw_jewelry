const express = require('express');
const router = express.Router();
const {
  subscribe,
  getAllSubscribers,
  getSubscriberStats,
  unsubscribe
} = require('../controllers/subscriberController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllSubscribers);
router.get('/stats', authenticate, authorizeAdmin, getSubscriberStats);

module.exports = router;
