# Testing Guide

This project uses different testing frameworks for backend and frontend code.

## Backend Testing (Jest)

**Framework:** Jest + Supertest
**Location:** `server/__tests__/`

### Running Backend Tests

```bash
cd server
npm test              # Run all tests
npm run test:watch    # Run in watch mode
npm run test:coverage # Generate coverage report
```

### Test Structure

```
server/
├── __tests__/
│   ├── setup.js                    # Global test configuration
│   ├── models/
│   │   └── User.test.js           # User model unit tests
│   └── routes/
│       └── auth.test.js           # Auth API integration tests
└── jest.config.js                  # Jest configuration
```

### What's Tested

✅ **Authentication Security (HttpOnly Cookies)**
- JWT tokens are set in HttpOnly cookies
- Tokens are NOT exposed in response body
- Secure flag set in production
- SameSite attribute configured
- Cookie cleared on logout

✅ **Authentication Middleware** (20 tests)
- JWT verification from cookies
- JWT verification from Authorization header
- Token expiration handling
- Invalid token rejection
- User validation (existence, active status)
- Admin authorization
- Resource ownership authorization
- Optional authentication
- Database error handling

✅ **User Model** (8 tests)
- User creation and validation
- Password hashing (bcrypt)
- Password comparison
- Safe object transformation (no password leaks)

✅ **Item Model** (19 tests)
- Item creation and validation
- Business logic (discounts, stock status)
- Image format compatibility (legacy + new)
- Safe updates
- Database serialization

### Writing New Tests

```javascript
// Example: Controller Test
const request = require('supertest');

describe('My Feature', () => {
  it('should do something', async () => {
    const res = await request(app)
      .post('/api/endpoint')
      .send({ data: 'test' });

    expect(res.status).toBe(200);
  });
});
```

## Frontend Testing (Vitest)

**Framework:** Vitest + React Testing Library
**Location:** `client/src/__tests__/`

### Running Frontend Tests

```bash
cd client
npm test              # Run all tests
npm run test:ui       # Open Vitest UI
npm run test:coverage # Generate coverage report
```

### Test Structure

```
client/src/
├── __tests__/
│   ├── setup.ts                    # Global test setup
│   ├── components/
│   │   └── Cart.test.tsx          # Component tests
│   ├── hooks/
│   │   └── useAuth.test.tsx       # Hook tests
│   └── config/
│       └── api.test.ts            # API utility tests
└── vitest.config.ts                # Vitest configuration
```

### What's Tested

✅ **API Configuration**
- `credentials: 'include'` in all requests (cookie-based auth)
- Proper headers set
- Error handling (401, 500, etc.)

✅ **Authentication Hook**
- Initial loading state
- Login/logout functionality
- Auth state management

✅ **Components**
- Cart rendering
- Item display
- User interactions

### Writing New Tests

```typescript
// Example: Component Test
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Security Test Coverage

### HttpOnly Cookie Security (Backend)

These tests verify the security migration from localStorage to HttpOnly cookies:

1. **Token Storage** (`auth.test.js`)
   - ✅ JWT in HttpOnly cookie
   - ✅ No token in response body
   - ✅ Secure flag in production
   - ✅ SameSite attribute set

2. **Cookie Lifecycle**
   - ✅ Set on login/register
   - ✅ Cleared on logout
   - ✅ Proper expiration

### Client-Side Security (Frontend)

1. **Automatic Cookie Handling** (`api.test.ts`)
   - ✅ `credentials: 'include'` in all requests
   - ✅ No manual token management
   - ✅ Proper error handling

## CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: cd server && pnpm install && pnpm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: cd client && pnpm install && pnpm test
```

## Test Coverage Goals

Current Coverage:
- Backend: Auth routes, User model
- Frontend: API config, Auth hook, Cart component

Suggested Additional Tests:
- [ ] Inventory CRUD operations
- [ ] Middleware authentication
- [ ] Protected routes (AdminRoute)
- [ ] Cart context full coverage
- [ ] Form validation components

## Tips

### Debugging Tests

**Backend (Jest):**
```bash
npm test -- --no-coverage --verbose
```

**Frontend (Vitest):**
```bash
npm run test:ui  # Visual debugging interface
```

### Mocking Database

Tests use mocked database collections. Example:
```javascript
const mockCollection = {
  findOne: jest.fn().mockResolvedValue(mockData),
  insertOne: jest.fn().mockResolvedValue({ insertedId: 'id' })
};
dbManager.getCollection = jest.fn().mockResolvedValue(mockCollection);
```

### Common Issues

1. **"Cannot find module"** → Install missing dependency
2. **Timeout errors** → Increase timeout in jest.config.js
3. **React warnings** → Mock missing providers (AuthProvider, CartProvider)
