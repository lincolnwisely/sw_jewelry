## Overall Architecture:

- Full-stack e-commerce monorepo with separate client/server workspaces

## Key Technologies

- Monorepo: NPM workspaces with concurrently for dev workflow
- Database: MongoDB Atlas with environment-based configuration
- CORS: Configured for cross-origin requests
- Deployment: Fly.io ready (Dockerfile included)

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

### Phase 2: E-commerce Core (2-3 weeks)

3. User Authentication


    - [ ] Customer registration/login
    - [ ] User profiles and account management
    - [ ] Session management
    - [ ] Password reset functionality

4. Payment Integration


    - [ ] Stripe payment processing
    - [ ] Checkout flow with order summary
    - [ ] Order confirmation and receipts
    - [ ] Tax calculation (if needed)

### Phase 3: Business Management (2-3 weeks)

5. Admin Dashboard


    - [ ] Protected admin routes
    - [ ] Inventory management interface
    - [ ] Order management and fulfillment
    - [ ] Analytics and reporting

6. Content Management


    - [ ] Image upload for products
    - [ ] Product creation/editing interface
    - [ ] Bulk inventory operations

### Phase 4: Polish & Deployment (1-2 weeks)

7. UI/UX Improvements


    - [ ] Mobile responsiveness
    - [ ] Loading states and error handling
    - [ ] SEO optimization
    - [ ] Performance optimization


    ### Misc TO-DO
    8. Add Materials (copper, silver, leather, turquoise, beads / Swarovski)
    9. Add ratings
