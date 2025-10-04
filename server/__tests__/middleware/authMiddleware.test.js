const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const {
  authenticate,
  authorizeAdmin,
  authorizeOwnerOrAdmin,
  optionalAuthenticate
} = require('../../middleware/authMiddleware');
const dbManager = require('../../utils/database');

// Mock database manager
jest.mock('../../utils/database');

describe('Authentication Middleware', () => {
  let req, res, next;
  const SECRET = process.env.JWT_SECRET || 'test-secret';
  const validUserId = new ObjectId();

  beforeEach(() => {
    // Reset mocks before each test
    req = {
      headers: {},
      cookies: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticate()', () => {
    it('should authenticate valid JWT from cookie', async () => {
      const token = jwt.sign({ userId: validUserId, role: 'customer' }, SECRET);
      const mockUser = {
        _id: validUserId,
        email: 'test@example.com',
        role: 'customer',
        firstName: 'Test',
        lastName: 'User',
        isActive: true
      };

      req.cookies.jwt = token;

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };
      dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);

      await authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.userId).toEqual(validUserId);
      expect(req.user.role).toBe('customer');
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should authenticate valid JWT from Authorization header', async () => {
      const token = jwt.sign({ userId: validUserId, role: 'admin' }, SECRET);
      const mockUser = {
        _id: validUserId,
        email: 'admin@example.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        isActive: true
      };

      req.headers.authorization = `Bearer ${token}`;

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };
      dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);

      await authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.role).toBe('admin');
      expect(next).toHaveBeenCalledWith();
    });

    it('should reject request with no token', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. No token provided.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: validUserId, role: 'customer' },
        SECRET,
        { expiresIn: '-1h' } // Already expired
      );

      req.cookies.jwt = expiredToken;

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token has expired'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      req.cookies.jwt = 'invalid.token.here';

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject token for non-existent user', async () => {
      const token = jwt.sign({ userId: validUserId, role: 'customer' }, SECRET);
      req.cookies.jwt = token;

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null) // User not found
      };
      dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token is valid but user not found'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject token for inactive user', async () => {
      const token = jwt.sign({ userId: validUserId, role: 'customer' }, SECRET);
      const inactiveUser = {
        _id: validUserId,
        email: 'inactive@example.com',
        role: 'customer',
        isActive: false
      };

      req.cookies.jwt = token;

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(inactiveUser)
      };
      dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User account has been deactivated'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should set user info from database on request', async () => {
      const token = jwt.sign({ userId: validUserId, role: 'admin' }, SECRET);
      const mockUser = {
        _id: validUserId,
        email: 'admin@example.com',
        role: 'admin',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true
      };

      req.cookies.jwt = token;

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };
      dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);

      await authenticate(req, res, next);

      expect(req.user).toEqual({
        userId: validUserId,
        email: 'admin@example.com',
        role: 'admin',
        firstName: 'John',
        lastName: 'Doe'
      });
    });

    it('should handle database errors gracefully', async () => {
      const token = jwt.sign({ userId: validUserId, role: 'customer' }, SECRET);
      req.cookies.jwt = token;

      dbManager.getCollection = jest.fn().mockRejectedValue(new Error('DB Error'));

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error during authentication'
      });
    });
  });

  describe('authorizeAdmin()', () => {
    it('should allow admin users', () => {
      req.user = {
        userId: validUserId,
        role: 'admin'
      };

      authorizeAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject non-admin users', () => {
      req.user = {
        userId: validUserId,
        role: 'customer'
      };

      authorizeAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject unauthenticated requests', () => {
      req.user = null;

      authorizeAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorizeOwnerOrAdmin()', () => {
    it('should allow admin users to access any resource', () => {
      req.user = {
        userId: validUserId,
        role: 'admin'
      };
      req.params = { userId: 'different-user-id' };

      authorizeOwnerOrAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow users to access their own resources', () => {
      const userId = new ObjectId();
      req.user = {
        userId: userId,
        role: 'customer'
      };
      req.params = { userId: userId.toString() };

      authorizeOwnerOrAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject users accessing other users resources', () => {
      req.user = {
        userId: validUserId,
        role: 'customer'
      };
      req.params = { userId: 'different-user-id' };

      authorizeOwnerOrAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuthenticate()', () => {
    it('should authenticate valid token', async () => {
      const token = jwt.sign({ userId: validUserId, role: 'customer' }, SECRET);
      const mockUser = {
        _id: validUserId,
        email: 'test@example.com',
        role: 'customer',
        firstName: 'Test',
        lastName: 'User',
        isActive: true
      };

      req.cookies.jwt = token;

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockUser)
      };
      dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);

      await optionalAuthenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user.userId).toEqual(validUserId);
      expect(next).toHaveBeenCalledWith();
    });

    it('should continue without authentication when no token', async () => {
      await optionalAuthenticate(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should continue without authentication on invalid token', async () => {
      req.cookies.jwt = 'invalid.token';

      await optionalAuthenticate(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledWith();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should set user to null for inactive users', async () => {
      const token = jwt.sign({ userId: validUserId, role: 'customer' }, SECRET);
      const inactiveUser = {
        _id: validUserId,
        isActive: false
      };

      req.cookies.jwt = token;

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(inactiveUser)
      };
      dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);

      await optionalAuthenticate(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('Cookie vs Header Priority', () => {
    it('should prefer Authorization header over cookie', async () => {
      const cookieToken = jwt.sign({ userId: validUserId, role: 'customer' }, SECRET);
      const headerToken = jwt.sign({ userId: new ObjectId(), role: 'admin' }, SECRET);

      const mockAdminUser = {
        _id: new ObjectId(),
        role: 'admin',
        isActive: true,
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User'
      };

      req.cookies.jwt = cookieToken;
      req.headers.authorization = `Bearer ${headerToken}`;

      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockAdminUser)
      };
      dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);

      await authenticate(req, res, next);

      expect(req.user.role).toBe('admin'); // Should use header token
    });
  });
});
