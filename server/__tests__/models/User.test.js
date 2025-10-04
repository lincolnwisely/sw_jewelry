const User = require('../../models/User');
const bcrypt = require('bcryptjs');

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a user with valid data', () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer'
      };

      const user = new User(userData);

      expect(user.firstName).toBe('John');
      expect(user.lastName).toBe('Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.role).toBe('customer');
    });

    it('should set default values', () => {
      const user = new User({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123'
      });

      expect(user.role).toBe('customer');
      expect(user.isActive).toBe(true);
      expect(user.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Validation', () => {
    it('should validate required fields', () => {
      const user = new User({
        firstName: 'John'
        // Missing required fields
      });

      const errors = user.validate();

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('Last name'))).toBe(true);
      expect(errors.some(e => e.includes('Email'))).toBe(true);
      expect(errors.some(e => e.includes('Password'))).toBe(true);
    });

    it('should validate email format', () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'password123'
      });

      const errors = user.validate();

      expect(errors.some(e => e.includes('valid email'))).toBe(true);
    });

    it('should validate password length', () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: '12345' // Too short
      });

      const errors = user.validate();

      expect(errors.some(e => e.includes('at least 8 characters'))).toBe(true);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer'
      });

      const originalPassword = user.password;
      await user.hashPassword();

      expect(user.password).not.toBe(originalPassword);
      expect(user.password.length).toBeGreaterThan(20); // Hashed passwords are longer
    });

    it('should compare passwords correctly', async () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer'
      });

      await user.hashPassword();

      const isMatch = await user.comparePassword('password123');
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });
  });

  describe('toSafeObject', () => {
    it('should not include password in safe object', () => {
      const user = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'customer'
      });

      const safeUser = user.toSafeObject();

      expect(safeUser.password).toBeUndefined();
      expect(safeUser.firstName).toBe('John');
      expect(safeUser.email).toBe('john@example.com');
    });
  });
});
