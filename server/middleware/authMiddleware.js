const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const dbManager = require('../utils/database');

// Verify JWT token and authenticate user
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const usersCollection = await dbManager.getCollection('users');
      
      const user = await usersCollection.findOne({ 
        _id: new ObjectId(decoded.userId) 
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is valid but user not found'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'User account has been deactivated'
        });
      }

      // Add user info to request
      req.user = {
        userId: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };

      next();
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      } else {
        throw jwtError;
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

// Authorize admin users only
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

// Authorize user to access their own resources or admin
const authorizeOwnerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.userId.toString() === req.params.userId)) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuthenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      // No token provided, continue without authentication
      req.user = null;
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const usersCollection = await dbManager.getCollection('users');
      
      const user = await usersCollection.findOne({ 
        _id: new ObjectId(decoded.userId) 
      });

      if (user && user.isActive) {
        req.user = {
          userId: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        };
      } else {
        req.user = null;
      }

      next();
    } catch (jwtError) {
      // Token invalid, continue without authentication
      req.user = null;
      next();
    }
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    req.user = null;
    next();
  }
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeOwnerOrAdmin,
  optionalAuthenticate
};