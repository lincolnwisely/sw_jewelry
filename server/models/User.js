const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class User {
  constructor(userData) {
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'customer'; // 'customer' or 'admin'
    this.isActive = userData.isActive !== false; // Default to true
    this.createdAt = userData.createdAt || new Date();
    this.updatedAt = userData.updatedAt || new Date();
    this.lastLogin = userData.lastLogin || null;
    
    // Optional user profile fields
    this.phone = userData.phone || null;
    this.address = userData.address || {
      street: null,
      city: null,
      state: null,
      zipCode: null,
      country: 'US'
    };
    
    // Order history reference
    this.orders = userData.orders || [];
    
    // Wishlist
    this.wishlist = userData.wishlist || [];
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      const saltRounds = 12;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  // Compare password for login
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Convert to safe object (remove password)
  toSafeObject() {
    const { password, ...safeUser } = this;
    return safeUser;
  }

  // Validation
  validate() {
    const errors = [];

    if (!this.firstName || this.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!this.lastName || this.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }

    if (!this.email || this.email.trim().length === 0) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('Please provide a valid email address');
    }

    if (!this.password || this.password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!['customer', 'admin'].includes(this.role)) {
      errors.push('Role must be either customer or admin');
    }

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Update user data
  update(updateData) {
    // Fields that can be updated
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'address', 'isActive'];
    
    allowedUpdates.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        this[field] = updateData[field];
      }
    });
    
    this.updatedAt = new Date();
  }

  // Update last login
  updateLastLogin() {
    this.lastLogin = new Date();
    this.updatedAt = new Date();
  }

  // Static methods for database operations would go in a separate service layer
}

module.exports = User;