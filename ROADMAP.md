## Overall Architecture:

- Full-stack e-commerce monorepo with separate client/server workspaces

## Key Technologies

- Monorepo: PNPM workspaces with concurrently for dev workflow
- Frontend: React 19 with React Router, Tailwind CSS
- Backend: Express.js with JWT authentication
- Database: MongoDB Atlas with environment-based configuration
- CORS: Configured for cross-origin requests
- Deployment: Fly.io ready (Dockerfile included)

## Recent Updates (September 2025)

- [x] **Authentication System**: Complete user registration/login with JWT
- [x] **Design System**: Updated from purple to black theme across all components
- [x] **Environment Setup**: Fixed .env.local configuration for MongoDB connection
- [x] **API Testing**: Added curl examples for endpoint testing
- [x] **Mobile Responsiveness**: Fully responsive navigation and homepage design
- [x] **JWT Token Management**: Fixed token expiration handling and automatic logout
- [x] **Admin System**: Complete admin authentication, routing, and dashboard
- [x] **Admin Inventory Management**: Full CRUD interface for product management
- [x] **Multi-Image Product System**: Complete Cloudinary integration with drag & drop upload, backward-compatible database schema supporting both single `image` and multi-image `images` array format

## Latest Updates (v1.5.0) - October 7, 2025

- [x] **SECURITY: HttpOnly Cookie Authentication**: Migrated from localStorage to secure HttpOnly cookies for enhanced XSS protection
- [x] **Enhanced CORS**: Updated CORS configuration with credentials support and explicit origin whitelist
- [x] **Code Cleanup**: Removed client-side token management and simplified authentication flow
- [x] **CI/CD Pipeline**: Automated GitHub Actions deployment to Fly.io
- [x] **Database Optimization**: Centralized connection manager with connection pooling (min: 2, max: 10)
- [x] **Database Indexing**: Comprehensive indexing strategy with text search capabilities
- [x] **Enhanced Authentication**: Admin role-based routing with immediate user data access
- [x] **Health Monitoring**: Server health check endpoints for monitoring
- [x] **Performance**: Significant database performance improvements
- [x] **Waitlist System**: Email signup form for launch notifications with subscriber management

### Phase 1: Customer-Facing Store (2-3 weeks)

1. Enhanced Product Catalog
    - [ ] Improved product grid with better styling
    - [ ] Product detail pages with image galleries
    - [x] Category filtering and search
    - [x] Price display and stock indicators

2. Shopping Cart System
    - [x] Add to cart functionality
    - [x] Cart persistence (localStorage/session)
    - [x] Cart management (update quantities, remove items)
    - [ ] Mini cart component

3. Waitlist & Marketing
    - [x] Email signup form on homepage
    - [x] Subscriber database model and validation
    - [x] Public subscribe/unsubscribe endpoints
    - [x] Admin subscriber management (view all, stats)
    - [ ] Email notification system for launch
    - [ ] Welcome email automation

### Phase 2: E-commerce Core (2-3 weeks)

4. User Authentication
    - [x] Customer registration/login
    - [x] User profiles and account management
    - [x] Session management (HttpOnly cookies - secure, XSS-protected)
    - [x] Password hashing and validation
    - [x] Protected routes and middleware
    - [x] JWT token expiration handling and automatic logout
    - [x] Role-based access control (customer vs admin)
    - [x] Secure cookie-based authentication (no localStorage)
    - [ ] Password reset functionality

5. Payment Integration
    - [ ] Stripe payment processing
    - [ ] Checkout flow with order summary
    - [ ] Order confirmation and receipts
    - [ ] Tax calculation (if needed)

### Phase 3: Business Management (2-3 weeks)

6. Admin Dashboard
    - [x] Protected admin routes with role-based access control
    - [x] Admin layout with responsive sidebar navigation
    - [x] Admin dashboard with stats overview and quick actions
    - [x] Inventory management interface with search, filtering, and CRUD operations
    - [ ] Subscriber management interface
    - [ ] Order management and fulfillment
    - [ ] User management interface
    - [ ] Analytics and reporting

7. Content Management
    - [x] Multi-image upload for products (Cloudinary integration)
    - [x] Product creation interface with full form validation
    - [x] Image management system with drag & drop upload
    - [x] Backward-compatible database schema (supports both single image and images array)
    - [ ] Product editing interface
    - [ ] Bulk inventory operations

### Phase 4: Polish & Deployment (1-2 weeks)

8. UI/UX Improvements
    - [x] Mobile responsiveness (complete - responsive navigation and homepage)
    - [x] Loading states and error handling
    - [x] Authentication state management with secure cookies
    - [x] Security optimization (HttpOnly cookies, XSS protection)
    - [ ] SEO optimization
    - [ ] Performance optimization
    - [x] Dark theme implementation (black/gray color scheme)

### Next Priorities

9. Payment Integration
    - [ ] Stripe integration for checkout
    - [ ] Order confirmation system

10. Enhanced Features
    - [ ] Add Materials (copper, silver, leather, turquoise, beads / Swarovski)
    - [ ] Add ratings and reviews
    - [ ] Wishlist functionality
    - [ ] Password reset flow

11. Admin Dashboard (Mostly Complete)
    - [x] Product management interface
    - [ ] Subscriber management UI
    - [ ] Order tracking system
    - [ ] User management
    - [ ] Admin user creation tools
    - [ ] Analytics dashboard

### Phase 5: Python Integration & Analytics (1-2 weeks)

12. Business Intelligence & Analytics
    - [ ] Sales analytics script (scripts/analytics.py)
    - [ ] Customer insights and order pattern analysis
    - [ ] Inventory turnover reports
    - [ ] Seasonal trend analysis
    - [ ] Performance dashboards for Sharon

13. Data Processing & Automation
    - [ ] Image processing pipeline (scripts/image_processing.py)
    - [ ] Bulk product operations (scripts/bulk_operations.py)
    - [ ] Database backup automation (scripts/backup_restore.py)
    - [ ] SEO content generator (scripts/seo_generator.py)

14. External Integrations
    - [ ] Shipping API integration (FedEx, UPS)
    - [ ] Email marketing automation
    - [ ] Social media posting automation
    - [ ] Inventory sync with suppliers

15. Learning Projects
    - [ ] Python MongoDB connection setup (scripts/db_connection.py)
    - [ ] Data visualization with matplotlib/plotly
    - [ ] API clients for third-party services
    - [ ] Automated report generation

### Phase 6: Performance & Optimization (Recent Progress)

16. Data Caching & State Management
    - [x] TanStack Query integration for data caching
    - [x] Replace manual fetch patterns with useQuery hooks
    - [x] Automatic background refetching and error handling
    - [x] Category-specific query hooks for optimized filtering
    - [x] Mutation hooks for create/update/delete operations (create & delete implemented)
    - [x] Automatic cache invalidation on mutations
    - [ ] Update/edit product mutation hooks

### Technical Debt & Improvements

- [ ] Add comprehensive error boundaries
- [ ] Implement proper TypeScript throughout
- [ ] Add unit and integration tests
- [x] Set up CI/CD pipeline (GitHub Actions → Fly.io)
- [x] Performance monitoring and optimization (health checks, database indexing)
- [x] Database connection optimization (connection pooling)
- [x] Centralized database management
- [x] Security enhancement (HttpOnly cookies, XSS protection)
- [ ] API rate limiting implementation
- [ ] Enhanced error logging and monitoring
- [ ] CSRF token implementation for additional security
