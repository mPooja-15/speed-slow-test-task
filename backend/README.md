# Speedy Sell Flow Backend

A comprehensive Node.js backend API for the Speedy Sell Flow e-commerce application, built with Express.js and MongoDB.

## Features

- 🔐 **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password reset functionality
  - Profile management

- 📦 **Product Management**
  - CRUD operations for products
  - Advanced filtering and search
  - Category management
  - Stock management
  - Featured and sale products

- 🛒 **Order Processing**
  - Order creation and management
  - Payment processing integration
  - Order status tracking
  - Shipping information
  - Order cancellation

- 🛡️ **Security Features**
  - Rate limiting
  - Input validation
  - CORS protection
  - Helmet security headers
  - Password encryption

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Documentation**: swagger-jsdoc, swagger-ui-express
- **Payments**: Stripe

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd speedy-sell-flow/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/speedy_db
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   BCRYPT_ROUNDS=12
   ```

4. **Start MongoDB**
   - Local: Start your MongoDB service
   - Cloud: Use MongoDB Atlas or similar

5. **Seed the database (optional)**
   ```bash
   node scripts/seedData.js
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Documentation

### Swagger UI
The API documentation is available through Swagger UI at:
- **Development**: `http://localhost:5000/api-docs`
- **Production**: `https://your-domain.com/api-docs`

The Swagger documentation provides:
- Interactive API explorer
- Request/response examples
- Authentication requirements
- Schema definitions
- Try-it-out functionality

### API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| PUT | `/api/auth/change-password` | Change password | Private |
| POST | `/api/auth/forgot-password` | Forgot password | Public |
| PUT | `/api/auth/reset-password/:token` | Reset password | Public |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/products` | Get all products | Public |
| GET | `/api/products/:id` | Get single product | Public |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| GET | `/api/products/featured` | Get featured products | Public |
| GET | `/api/products/sale` | Get sale products | Public |
| GET | `/api/products/search/:query` | Search products | Public |
| GET | `/api/products/categories` | Get categories | Public |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/orders` | Create order | Private |
| GET | `/api/orders/myorders` | Get user orders | Private |
| GET | `/api/orders/:id` | Get order by ID | Private |
| PUT | `/api/orders/:id/pay` | Mark order as paid | Private |
| PUT | `/api/orders/:id/cancel` | Cancel order | Private |
| GET | `/api/orders` | Get all orders (Admin) | Admin |
| PUT | `/api/orders/:id/deliver` | Mark as delivered | Admin |
| PUT | `/api/orders/:id/status` | Update order status | Admin |

### Payments

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/payments/create-payment-intent` | Create payment intent | Private |
| GET | `/api/payments/payment-intent/:id` | Get payment intent | Private |
| POST | `/api/payments/webhook` | Stripe webhook handler | Public |
| GET | `/api/payments/payment-methods` | Get saved payment methods | Private |
| POST | `/api/payments/setup-intent` | Create setup intent | Private |

## Usage Examples

### Authentication

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Products

**Get all products with filtering:**
```bash
curl "http://localhost:5000/api/products?category=Electronics&minPrice=100&maxPrice=500&sort=price_asc"
```

**Create a product (Admin only):**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99,
    "category": "Electronics",
    "stock": 50
  }'
```

### Orders

**Create an order:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "US",
      "phone": "+1234567890"
    },
    "paymentMethod": "credit_card"
  }'
```

## Database Models

### User Model
- Basic info (name, email, phone)
- Address information
- Role-based access (user/admin)
- Password reset functionality
- Wishlist management

### Product Model
- Product details (name, description, price)
- Images and media
- Stock management
- Categories and tags
- Specifications and shipping info
- Rating and reviews

### Order Model
- Order items with quantities
- Shipping address
- Payment information
- Order status tracking
- Timestamps and metadata

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Error stack trace (development only)"
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Express-validator for data validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet for additional security headers

## Development

### Scripts

```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server
npm test            # Run tests
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 |

## Deployment

1. **Set environment variables** for production
2. **Install dependencies**: `npm install --production`
3. **Start the server**: `npm start`
4. **Use PM2 or similar** for process management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details 