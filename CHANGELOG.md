# Changelog

All notable changes to this project will be documented in this file.

## [1.6.0] - 2025-10-14

### Added
- **Product Editing Interface**: Complete EditProduct component for updating existing inventory items
- **useEditProduct Mutation Hook**: TanStack Query mutation for PUT requests to inventory API
- **Type-Safe Edit Operations**: Full TypeScript support with proper type guards and validation

### Enhanced
- **EditProduct Component**: Pre-populated form fields with existing product data
- **Loading & Error States**: Spinner during data fetch and "Product Not Found" fallback
- **Form Validation**: Comprehensive validation matching AddProduct component
- **Type Safety Improvements**: Fixed Cart component inStock type checking (number | boolean)

### Fixed
- **AuthDebug Component**: Removed obsolete `state.token` reference after HttpOnly cookie migration
- **Cart Type Guards**: Added proper `typeof` checks for numeric inStock comparisons
- **Hook Declaration Order**: Fixed useState/useEffect ordering in EditProduct
- **Data Access Pattern**: Switched from `useInventory` to `useInventoryById` for single product fetch
- **TypeScript Type Errors**: Added guard clause for optional `id` parameter from useParams

### Technical
- **useInventoryById Hook**: Leverages existing hook for efficient single-product queries
- **Partial<Item> Type**: Edit mutation accepts partial product data for flexible updates
- **Cache Invalidation**: Automatic inventory query refresh on successful edit
- **Guard Clauses**: Type narrowing for `string | undefined` to `string`

### Phase 6 Completion
- Multi-image upload for products (Cloudinary integration)
- Product creation interface with full form validation
- Product editing interface for existing items
- Image management system with drag & drop upload
- Backward-compatible database schema
- TanStack Query mutations with cache invalidation

## [1.5.0] - 2025-10-04

### Security Enhancement: HttpOnly Cookie Authentication

### Changed
- **Migrated from localStorage to HttpOnly cookies**: JWT tokens now stored in secure HttpOnly cookies instead of localStorage
- **Enhanced XSS Protection**: Tokens are no longer accessible to JavaScript, preventing XSS-based token theft
- **Automatic Cookie Management**: Browser handles cookie lifecycle automatically
- **Simplified Client Code**: Removed all manual token storage, retrieval, and expiration checking

### Backend Updates
- **Cookie-Based Authentication**: JWT tokens set via HttpOnly cookies with `secure` and `sameSite` flags
- **Updated CORS Configuration**: Added `Access-Control-Allow-Credentials` with explicit origin whitelist
- **Removed Token from Response Body**: Login/register endpoints no longer send token in JSON response
- **Environment-Aware Cookie Settings**: `sameSite: 'lax'` in development, `'strict'` in production

### Frontend Updates
- **Credentials Include**: All API calls now use `credentials: 'include'` to send cookies automatically
- **Removed localStorage Dependencies**: Eliminated all localStorage token operations
- **Simplified Auth State**: Removed token from AuthContext state interface
- **Cleaned Up Components**: Removed `TokenExpirationHandler` component (no longer needed)
- **Updated API Hooks**: Removed manual Authorization headers from mutation hooks

### Security Improvements
- **XSS Protection**: HttpOnly cookies cannot be accessed by malicious JavaScript
- **CSRF Mitigation**: SameSite cookie attribute helps prevent cross-site request forgery
- **Automatic Security**: Browser enforces cookie security policies
- **No Token Exposure**: Tokens never touch client-side code

### Removed
- Token expiration checking on client (server handles this)
- localStorage token persistence
- Manual Authorization header management
- TokenExpirationHandler UI component

## [1.3.0] - 2025-09-25

### Major Feature: Multi-Image Product Management

### Added
- **Cloudinary Integration**: Professional image hosting with organized folder structure (`sw_jewelry/inventory/`)
- **Multi-Image Upload System**: Drag & drop interface supporting up to 5 images per product
- **Image Management Component**: Reusable `ImageUpload` component with preview, removal, and primary image indication
- **Add Product Interface**: Complete product creation form with comprehensive validation
- **Backward-Compatible Database Schema**: Support for both legacy `image` (string) and new `images` (array) formats
- **Enhanced Admin Routes**: New `/admin/inventory/new` route for product creation
- **TanStack Query Mutations**: `useCreateProduct` hook with automatic cache invalidation
- **Production-Safe Validation**: Server-side validation supporting both image formats

### Enhanced
- **Admin Inventory Display**: Updated to handle both single and multi-image products seamlessly
- **Type Safety**: Enhanced TypeScript interfaces for flexible image handling
- **Error Handling**: Comprehensive form validation with user-friendly error messages
- **Loading States**: Smooth loading indicators for image uploads and form submission
- **Mobile Responsive**: Fully responsive product creation interface

### Technical
- **Cloudinary React SDK**: Direct client-side uploads with unsigned presets
- **Smart Image Fallback**: `item.images?.[0] || item.image` logic for display consistency
- **Array Validation**: Backend validation ensuring either `image` or `images` array is provided
- **Cache Management**: Automatic inventory cache invalidation on product creation
- **Debug Logging**: Temporary debug logging for troubleshooting (removed in production)

### Database Compatibility
- **Zero Migration Required**: Existing products continue working without changes
- **Flexible Schema**: MongoDB's schema-less nature allows gradual transition to new format
- **Production Tested**: Verified with existing 14 products in production database

### Phase 6 Progress
- Multi-image upload for products (Cloudinary integration)
- Product creation interface with full form validation
- Image management system with drag & drop upload
- Backward-compatible database schema
- TanStack Query mutations with cache invalidation

### Next Up
- [ ] Product editing interface for existing items
- [ ] Bulk image operations
- [ ] Image optimization and transformations

## [1.2.0] - 2025-09-15

### Added
- **Complete Authentication System**: JWT-based user registration and login
- **Admin Dashboard**: Protected admin routes with role-based access control
- **Admin Inventory Management**: Full CRUD interface with search, filtering, and delete operations
- **TanStack Query Integration**: Replaced manual fetch patterns with optimized caching
- **Mobile Responsiveness**: Fully responsive navigation and admin interfaces

### Enhanced
- **Design System**: Updated from purple to black theme across all components
- **Environment Configuration**: Fixed .env.local setup for MongoDB connection
- **JWT Token Management**: Automatic token expiration handling and logout
- **Error Handling**: Improved error states and loading indicators

### Technical
- **Category-Specific Hooks**: `useInventoryByCategory` for optimized filtering
- **Delete Mutations**: `useDeleteProduct` with automatic cache invalidation
- **Authentication Context**: Centralized auth state management
- **Protected Routes**: Admin route protection with role verification

## [1.1.0] - 2025-01-04

### Added
- Complete shopping cart functionality with persistent storage
- Cart context with React state management
- Add to cart functionality on product detail pages
- Cart panel with quantity management and removal
- Mini cart button with item count indicator
- Local storage persistence for cart state
- Category filtering and product search
- Product detail pages with breadcrumb navigation
- Price formatting and stock status indicators

### Enhanced
- Improved product catalog layout and styling
- Better navigation with category dropdown
- Responsive design improvements
- Product card components with consistent styling

### Technical
- TypeScript integration for type safety
- React Router v7 for navigation
- Tailwind CSS for styling
- MongoDB Atlas integration
- Fly.io deployment configuration
- NPM workspaces for monorepo structure

### Phase 1 Progress
- Category filtering and search
- Price display and stock indicators  
- Add to cart functionality
- Cart persistence (localStorage/session)
- Cart management (update quantities, remove items)

### Next Up (Phase 1 Completion)
- [ ] Improved product grid with better styling
- [ ] Product detail pages with image galleries
- [ ] Mini cart component refinements