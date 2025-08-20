# SW Jewelry - Monorepo

A full-stack e-commerce application for SW Jewelry with React frontend and Express API backend.

## Project Structure

```
sw_jewelry/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   └── ...
│   └── package.json
├── server/                 # Express API backend
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── package.json
├── package.json            # Root workspace configuration
└── README.md
```

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sw_jewelry
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `.env.local` in the server directory:
   ```bash
   # MongoDB Configuration
   MONGODB_PASSWORD=your_actual_mongodb_password_here
   MONGODB_USERNAME=lincolnwisely
   MONGODB_CLUSTER=cluster0.9qqs7tb.mongodb.net
   MONGODB_DATABASE=sw_jewelry_db
   
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start both:
   - Frontend: `http://localhost:3001`
   - Backend: `http://localhost:3000`

## Available Scripts

### Root Level Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm run dev:server` | Start only the backend server |
| `npm run dev:client` | Start only the frontend development server |
| `npm run build` | Build the React frontend for production |
| `npm run start` | Start the production backend server |
| `npm run seed` | Seed the database with sample jewelry data |
| `npm run install:all` | Install dependencies for all workspaces |
| `npm run clean` | Clean all node_modules and package-lock files |

### Workspace-Specific Commands

**Server (`@sw_jewelry/server`)**
```bash
npm run dev --workspace=server
npm run seed --workspace=server
npm run start --workspace=server
```

**Client (`@sw_jewelry/client`)**
```bash
npm run start --workspace=client
npm run build --workspace=client
npm run test --workspace=client
```

## 🔧 Development Workflow

### Starting Development

1. **Start both servers simultaneously:**
   ```bash
   npm run dev
   ```

2. **Or start them individually:**
   ```bash
   # Terminal 1 - Backend
   npm run dev:server
   
   # Terminal 2 - Frontend
   npm run dev:client
   ```

### Making Changes

- **Frontend changes** are automatically hot-reloaded
- **Backend changes** require server restart (or use nodemon)
- **Database changes** can be seeded with `npm run seed`

### Adding Dependencies

**To a specific workspace:**
```bash
# Add to server
npm install express --workspace=server

# Add to client
npm install axios --workspace=client

# Add dev dependency to client
npm install --save-dev tailwindcss --workspace=client
```

**To root (shared dependencies):**
```bash
npm install concurrently --save-dev
```

## API Endpoints

The backend API is available at `http://localhost:3000/api`

### Inventory Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/inventory` | Get all items (with filtering) |
| `GET` | `/api/inventory/:id` | Get single item |
| `GET` | `/api/inventory/category/:category` | Get items by category |
| `GET` | `/api/inventory/stats` | Get inventory statistics |
| `POST` | `/api/inventory` | Create new item |
| `PUT` | `/api/inventory/:id` | Update item |
| `DELETE` | `/api/inventory/:id` | Delete item |

### Query Parameters

- `category` - Filter by category (rings, bracelets, necklaces, earrings)
- `tag` - Filter by tag
- `minPrice` / `maxPrice` - Price range filtering
- `inStock` - Filter items in stock

## Architecture

### Frontend (React)
- **Location**: `client/`
- **Port**: 3001 (development)
- **Build**: `client/build/`
- **Proxy**: Configured to forward `/api/*` to backend

### Backend (Express)
- **Location**: `server/`
- **Port**: 3000
- **Database**: MongoDB Atlas
- **Environment**: `.env.local` in server directory

### Workspace Benefits

**Unified dependency management**  
**Shared scripts and tooling**  
**Consistent development workflow**  
**Easier deployment coordination**  
**Reduced duplication**  

## Deployment

See `server/DEPLOYMENT.md` for detailed deployment instructions for both frontend and backend.

### Quick Deployment Commands

```bash
# Build frontend
npm run build

# Deploy backend (example with Heroku)
cd server
heroku create your-jewelry-api
heroku config:set MONGODB_PASSWORD=your_password
git push heroku main
```

## 🔍 Troubleshooting

### Common Issues

**Port conflicts:**
- Frontend: Change port in `client/package.json` scripts
- Backend: Change `PORT` in `.env.local`

**Dependency issues:**
```bash
npm run clean
npm run install:all
```

**Database connection:**
- Verify MongoDB Atlas IP whitelist
- Check environment variables in `server/.env.local`

**CORS errors:**
- Ensure backend CORS includes frontend URL
- Check proxy configuration in `client/package.json`

## 📝 Environment Variables

### Backend (server/.env.local)
```bash
MONGODB_PASSWORD=your_password
MONGODB_USERNAME=lincolnwisely
MONGODB_CLUSTER=cluster0.9qqs7tb.mongodb.net
MONGODB_DATABASE=sw_jewelry_db
PORT=3000
NODE_ENV=development
```

### Frontend (client/.env.development)
```bash
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development
```

## License

ISC