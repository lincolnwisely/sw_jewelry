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
├── .env.local              # ⚠️ Environment variables (ROOT directory)
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
   pnpm run install:all
   ```

3. **Set up environment variables**

   **IMPORTANT**: Create `.env.local` in the **ROOT directory** (not in server/):

   ```bash
   # Location: /sw_jewelry/.env.local (ROOT directory)

   # MongoDB Configuration
   MONGODB_PASSWORD=your_actual_mongodb_password_here
   MONGODB_USERNAME=lincolnwisely
   MONGODB_CLUSTER=cluster0.9qqs7tb.mongodb.net
   MONGODB_DATABASE=sw_jewelry_db
   MONGODB_URI=mongodb+srv://lincolnwisely:your_password@cluster0.9qqs7tb.mongodb.net/sw_jewelry_db?retryWrites=true&w=majority

   # Database Configuration
   DB_NAME=sw_jewelry_db

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

   ⚠️ **Critical**: The `.env.local` file MUST be in the root directory, NOT in the server/ subdirectory.

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
