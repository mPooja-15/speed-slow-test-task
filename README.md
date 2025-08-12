# Speedy Sell Flow - E-commerce Application

A modern e-commerce application built with React (Frontend) and Node.js/Express (Backend), featuring Redux state management, Stripe payments, and MongoDB database.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn** or **bun**
- **MongoDB** (local or cloud instance)
- **Stripe Account** (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd speed-slow-test-task
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## 🔧 Environment Setup

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
VITE_APP_NAME=Speedy Sell Flow
VITE_APP_VERSION=1.0.0
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/speedy_db
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/speedy_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Password Hashing
BCRYPT_ROUNDS=12

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret_here

# CORS Configuration (optional)
CORS_ORIGIN=http://localhost:5173
```

## 🔑 Required API Keys

### 1. Stripe Keys

You'll need to get these from your [Stripe Dashboard](https://dashboard.stripe.com/):

- **Publishable Key** (`VITE_STRIPE_PUBLISHABLE_KEY`): Used in frontend for payment forms
- **Secret Key** (`STRIPE_SECRET_KEY`): Used in backend for payment processing
- **Webhook Secret** (`STRIPE_WEBHOOK_SECRET`): Used for webhook verification

#### How to get Stripe keys:

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers → API keys
3. Copy the publishable key (starts with `pk_test_` or `pk_live_`)
4. Copy the secret key (starts with `sk_test_` or `sk_live_`)
5. For webhooks: Go to Developers → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/payments/webhook`
   - Events: Select payment events you need

### 2. MongoDB Connection

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/speedy_db`

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [mongodb.com](https://mongodb.com)
2. Create a new cluster
3. Get connection string from "Connect" button
4. Replace username, password, and cluster details

### 3. JWT Secret

Generate a secure random string for JWT signing:
```bash
# Generate a random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🏃‍♂️ Running the Application

### 1. Start Backend Server

```bash
cd backend

# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The backend will be available at: `http://localhost:5000`

### 2. Start Frontend Development Server

```bash
# In a new terminal, from the root directory
npm run dev
# or
yarn dev
# or
bun dev
```

The frontend will be available at: `http://localhost:5173`

### 3. Seed Database (Optional)

```bash
cd backend
node scripts/seedData.js
```

## 📚 API Documentation

Once the backend is running, you can access the API documentation at:
- **Swagger UI**: `http://localhost:5000/api-docs`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
npm test
```

## 🏗️ Project Structure

```
speed-slow-test-task/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── store/             # Redux store and slices
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   └── types/             # TypeScript type definitions
├── backend/               # Backend source code
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── config/           # Configuration files
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Express-validator for data validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Security Headers**: Helmet for additional security headers

## 🛒 Features

### Frontend
- ✅ Modern React with TypeScript
- ✅ Redux Toolkit for state management
- ✅ Stripe payment integration
- ✅ Responsive design with Tailwind CSS
- ✅ Shopping cart functionality
- ✅ User authentication
- ✅ Product catalog with filtering
- ✅ Order management

### Backend
- ✅ RESTful API with Express.js
- ✅ MongoDB with Mongoose ODM
- ✅ JWT authentication
- ✅ Stripe payment processing
- ✅ Order management
- ✅ Product management
- ✅ User management
- ✅ API documentation with Swagger

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS_ORIGIN matches frontend URL
   - Check that both servers are running

2. **MongoDB Connection Issues**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure network access for cloud MongoDB

3. **Stripe Payment Issues**
   - Verify API keys are correct
   - Check webhook endpoint configuration
   - Ensure using test keys for development

4. **Port Already in Use**
   - Change PORT in backend .env file
   - Update VITE_API_URL in frontend .env file

### Development Tips

- Use Redux DevTools for state debugging
- Check browser console for frontend errors
- Monitor backend logs for API issues
- Use Swagger UI to test API endpoints

## 📝 Environment Variables Summary

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | ✅ | `http://localhost:5000/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | ✅ | `pk_test_...` |
| `PORT` | Backend server port | ❌ | `5000` |
| `MONGODB_URI` | MongoDB connection string | ✅ | `mongodb://localhost:27017/speedy_db` |
| `JWT_SECRET` | JWT signing secret | ✅ | `your-secret-key` |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | ✅ | `whsec_...` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details 