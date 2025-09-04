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
   PORT=3000
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
