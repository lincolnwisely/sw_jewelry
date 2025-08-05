## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Inventory Endpoints

#### GET /inventory
Get all inventory items with optional filtering.

**Query Parameters:**
- `category` - Filter by category (rings, bracelets, necklaces, earrings)
- `tag` - Filter by tag
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter items in stock (any value)

**Example:**
```bash
GET /api/inventory?category=rings&minPrice=100&maxPrice=1000
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "id": "ring-001",
      "title": "Diamond Solitaire Ring",
      "description": "Classic 14k white gold ring...",
      "price": 2499.99,
      "inStock": 3,
      "image": "https://images.unsplash.com/...",
      "tags": ["engagement", "diamond", "solitaire"],
      "category": "rings"
    }
  ]
}
```

#### GET /inventory/:id
Get a specific inventory item by ID.

**Example:**
```bash
GET /api/inventory/ring-001
```

#### POST /inventory
Create a new inventory item.

**Request Body:**
```json
{
  "id": "ring-005",
  "title": "New Ring Design",
  "description": "Beautiful new ring design",
  "price": 599.99,
  "inStock": 5,
  "image": "https://images.unsplash.com/...",
  "tags": ["new", "design", "gold"],
  "category": "rings"
}
```

#### PUT /inventory/:id
Update an existing inventory item.

**Example:**
```bash
PUT /api/inventory/ring-001
Content-Type: application/json

{
  "price": 2599.99,
  "inStock": 2
}
```

#### DELETE /inventory/:id
Delete an inventory item.

**Example:**
```bash
DELETE /api/inventory/ring-001
```

#### GET /inventory/stats
Get inventory statistics and analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalItems": 16,
    "totalValue": 15499.99,
    "avgPrice": 968.75,
    "priceRange": {
      "min": 89.99,
      "max": 3499.99
    },
    "categoryStats": [
      {
        "_id": "rings",
        "count": 4,
        "totalStock": 14,
        "avgPrice": 1374.99
      }
    ],
    "lowStockItems": 3
  }
}
```

## Data Schema

Each inventory item follows this schema:

```json
{
  "id": "string (unique identifier)",
  "title": "string (1-100 characters)",
  "description": "string (10-500 characters)",
  "price": "number (non-negative, 2 decimal places)",
  "inStock": "integer (non-negative)",
  "image": "string (valid URL)",
  "tags": "array of strings (1-10 tags)",
  "category": "string (rings|bracelets|necklaces|earrings)"
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## Development

### Project Structure
```
sw_jewelry/
├── controllers/
│   └── inventoryController.js
├── routes/
│   └── inventoryRoutes.js
├── middleware/
│   └── errorHandler.js
├── utils/
│   └── seedDatabase.js
├── example_jewelry.json
├── api/
|   └── index.js
├── package.json
└── README.md
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run seed` - Seed database with example data
- `npm start` - Start production server

## Testing the API

You can test the API using curl, Postman, or any HTTP client:

```bash
# Get all inventory
curl http://localhost:3000/api/inventory

# Get rings only
curl http://localhost:3000/api/inventory?category=rings

# Get inventory stats
curl http://localhost:3000/api/inventory/stats

# Create new item
curl -X POST http://localhost:3000/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-001",
    "title": "Test Ring",
    "description": "A test ring",
    "price": 100.00,
    "inStock": 1,
    "image": "https://example.com/image.jpg",
    "tags": ["test"],
    "category": "rings"
  }'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_PASSWORD` | MongoDB password | Required |
| `MONGODB_USERNAME` | MongoDB username | lincolnwisely |
| `MONGODB_CLUSTER` | MongoDB cluster | cluster0.9qqs7tb.mongodb.net |
| `MONGODB_DATABASE` | Database name | sw_jewelry_db |
| `PORT` | Server port | 3000 |

## License

ISC 