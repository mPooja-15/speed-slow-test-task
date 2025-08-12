# CORS Troubleshooting Guide

## What is CORS?
CORS (Cross-Origin Resource Sharing) is a security feature that controls which domains can access your API. When your frontend (running on one port) tries to access your backend (running on another port), CORS policies may block the request.

## Common CORS Issues

### 1. Frontend and Backend on Different Ports
- **Frontend**: `http://localhost:5173` (Vite default)
- **Backend**: `http://localhost:5000` (Express default)

### 2. Missing CORS Headers
The backend must send proper CORS headers to allow cross-origin requests.

## Current CORS Configuration

The backend is configured with the following CORS settings:

```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:4173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4173'
    ];
    
    if (process.env.NODE_ENV === 'development') {
      // In development, allow all localhost origins
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key'
  ]
};
```

## Testing CORS

### 1. Test the CORS Test Endpoint
Visit: `http://localhost:5000/api/cors-test`

Expected response:
```json
{
  "success": true,
  "message": "CORS is working!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "origin": "http://localhost:5173",
  "method": "GET"
}
```

### 2. Test from Frontend
Add this to your frontend to test CORS:

```javascript
// Test CORS from frontend
fetch('http://localhost:5000/api/cors-test')
  .then(response => response.json())
  .then(data => console.log('CORS Test:', data))
  .catch(error => console.error('CORS Error:', error));
```

## Troubleshooting Steps

### Step 1: Check Backend is Running
```bash
cd backend
npm start
```

You should see:
```
🚀 Server running in development mode on port 5000
📚 API Documentation: http://localhost:5000/api-docs
🔗 API Base URL: http://localhost:5000/api
```

### Step 2: Check Frontend Environment
Make sure your frontend `.env` file has:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Check Browser Console
Open browser developer tools and check for CORS errors in the Console tab.

### Step 4: Test API Directly
Use curl or Postman to test the API directly:
```bash
curl http://localhost:5000/api/cors-test
```

### Step 5: Check Network Tab
In browser developer tools, go to Network tab and check:
1. Request headers (should include `Origin`)
2. Response headers (should include `Access-Control-Allow-Origin`)

## Common Solutions

### Solution 1: Restart Both Servers
```bash
# Backend
cd backend
npm start

# Frontend (in another terminal)
npm run dev
```

### Solution 2: Clear Browser Cache
- Hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- Clear browser cache and cookies

### Solution 3: Check Port Conflicts
Make sure no other services are using port 5000:
```bash
# Windows
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :5000
```

### Solution 4: Update CORS Configuration
If you're still having issues, you can temporarily allow all origins in development:

```javascript
// In backend/server.js (temporary for development only)
const corsOptions = {
  origin: true, // Allow all origins (NOT for production!)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['*']
};
```

### Solution 5: Check Helmet Configuration
The Helmet middleware might be blocking CORS. The current configuration includes:
```javascript
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
```

## Production CORS Configuration

For production, update the CORS configuration:

```javascript
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ]
};
```

## Debugging Commands

### Check Backend Logs
```bash
cd backend
npm start
```

### Check Frontend Network Requests
1. Open browser developer tools
2. Go to Network tab
3. Make a request from your app
4. Check the request/response headers

### Test with curl
```bash
# Test GET request
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:5000/api/cors-test

# Test POST request
curl -H "Origin: http://localhost:5173" \
     -H "Content-Type: application/json" \
     -X POST \
     -d '{"test": "data"}' \
     http://localhost:5000/api/auth/login
```

## Still Having Issues?

If you're still experiencing CORS issues:

1. **Check the exact error message** in browser console
2. **Verify both servers are running** on the correct ports
3. **Check if your frontend is making requests to the correct URL**
4. **Ensure the backend CORS configuration matches your frontend origin**

The current configuration should work for most development setups. If you continue to have issues, please share the exact error message from the browser console. 