const express = require('express');
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser 
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

module.exports = router;