import request from 'supertest';
import app from '../server.js';

describe('API Endpoints', () => {
  let authToken;
  let productId;

  describe('Authentication', () => {
    test('POST /api/auth/register - should register a new user', async () => {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phone: '+1234567890'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('email', userData.email);
      expect(response.body.data).toHaveProperty('token');
    });

    test('POST /api/auth/login - should login user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      authToken = response.body.data.token;
    });
  });

  describe('Products', () => {
    test('GET /api/products - should get all products', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('GET /api/products/featured - should get featured products', async () => {
      const response = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
    });

    test('GET /api/products/categories - should get categories', async () => {
      const response = await request(app)
        .get('/api/products/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Orders', () => {
    test('POST /api/orders - should create order (requires auth)', async () => {
      // First get a product to use in the order
      const productsResponse = await request(app)
        .get('/api/products')
        .expect(200);

      if (productsResponse.body.data.length > 0) {
        productId = productsResponse.body.data[0]._id;

        const orderData = {
          items: [
            {
              product: productId,
              quantity: 1
            }
          ],
          shippingAddress: {
            firstName: 'Test',
            lastName: 'User',
            address: '123 Test St',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
            country: 'US',
            phone: '+1234567890'
          },
          paymentMethod: 'credit_card'
        };

        const response = await request(app)
          .post('/api/orders')
          .set('Authorization', `Bearer ${authToken}`)
          .send(orderData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('orderNumber');
      }
    });

    test('GET /api/orders/myorders - should get user orders', async () => {
      const response = await request(app)
        .get('/api/orders/myorders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('Health Check', () => {
    test('GET /health - should return server status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message', 'Server is running');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
    });
  });
}); 