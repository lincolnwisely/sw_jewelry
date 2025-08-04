# SW Jewelry 

## MERN-STACK Website for my mom's jewelry. Because etsy sucks
 - MongoDB (Atlas) for database
 - Express for routing and API development
 - Node JS for backend javascript
 - React for front-end

#### About 

Starting out with a simlpe RESTful API for managing jewelry inventory with full CRUD operations. If youre not me, this repo wont be very helpful because you need the mongo db pw. 
RESTful API for managing jewelry inventory with full CRUD operations.

## Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (and db password)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```bash
   # MongoDB Configuration
   MONGODB_PASSWORD=your_actual_mongodb_password_here
   MONGODB_USERNAME=lincolnwisely
   MONGODB_CLUSTER=cluster0.9qqs7tb.mongodb.net
   MONGODB_DATABASE=sw_jewelry_db

   # Server Configuration
   PORT=3000
   ```

4. Seed the database with example data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`