# Stripe Payment Integration Setup Guide

This guide will help you set up Stripe payment processing for your Speedy Sell Flow application.

## Prerequisites

1. **Stripe Account**: Sign up for a free Stripe account at [stripe.com](https://stripe.com)
2. **Node.js Backend**: Ensure your backend is running
3. **React Frontend**: Ensure your frontend is running

## Backend Setup

### 1. Install Stripe Dependencies

Navigate to your backend directory and install Stripe:

```bash
cd backend
npm install stripe
```

### 2. Configure Environment Variables

Create a `.env` file in your backend directory with the following variables:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 3. Get Your Stripe Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
4. Replace the placeholder values in your `.env` file

### 4. Set Up Webhooks (Optional but Recommended)

1. In your Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-domain.com/api/payments/webhook`
4. Select the following events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `charge.failed`
5. Copy the webhook signing secret and add it to your `.env` file

## Frontend Setup

### 1. Install Stripe Dependencies

Navigate to your frontend directory and install Stripe:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Configure Environment Variables

Create a `.env` file in your frontend directory:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# API Configuration
VITE_API_URL=http://localhost:5000/api
```

### 3. Update API Base URL

Make sure your frontend is configured to make API calls to your backend server.

## Testing the Integration

### 1. Test Card Numbers

Use these test card numbers for testing:

- **Successful Payment**: `4242 4242 4242 4242`
- **Declined Payment**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

### 2. Test the Payment Flow

1. Start your backend server: `npm run dev`
2. Start your frontend: `npm run dev`
3. Add items to cart and proceed to checkout
4. Use a test card number to complete payment

## API Endpoints

### Payment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create-payment-intent` | Create a payment intent for an order |
| GET | `/api/payments/payment-intent/:id` | Get payment intent details |
| POST | `/api/payments/webhook` | Handle Stripe webhook events |
| GET | `/api/payments/payment-methods` | Get user's saved payment methods |
| POST | `/api/payments/setup-intent` | Create setup intent for saving payment method |

### Authentication

All payment endpoints (except webhooks) require authentication. Include your JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token_here
```

## Components Overview

### Frontend Components

1. **PaymentForm**: Main payment form with Stripe Elements
2. **PaymentModal**: Modal wrapper for the payment form
3. **CheckoutPage**: Complete checkout page with shipping and payment
4. **useStripePayment**: Custom hook for payment operations

### Backend Controllers

1. **paymentController.js**: Handles all payment-related operations
2. **paymentRoutes.js**: Defines payment API routes with Swagger documentation

## Security Features

- **PCI Compliance**: Stripe handles all sensitive card data
- **Webhook Verification**: Ensures webhook authenticity
- **JWT Authentication**: Protects payment endpoints
- **Input Validation**: Validates all payment data
- **Error Handling**: Comprehensive error handling and logging

## Production Considerations

### 1. Environment Variables

- Use production Stripe keys
- Set up proper webhook endpoints
- Configure CORS for your domain

### 2. SSL/HTTPS

- Ensure your site uses HTTPS in production
- Stripe requires HTTPS for live payments

### 3. Error Monitoring

- Set up error monitoring (e.g., Sentry)
- Monitor failed payments
- Set up alerts for payment issues

### 4. Testing

- Test with real cards in test mode
- Verify webhook handling
- Test error scenarios

## Troubleshooting

### Common Issues

1. **"Stripe has not loaded yet"**
   - Check your publishable key
   - Ensure Stripe.js is loading properly

2. **"Payment failed"**
   - Check your secret key
   - Verify webhook configuration
   - Check server logs

3. **"Webhook signature verification failed"**
   - Verify webhook secret
   - Check webhook endpoint URL
   - Ensure raw body parsing is enabled

### Debug Mode

Enable debug logging in your backend:

```javascript
// In your stripe config
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
```

## Support

- **Stripe Documentation**: [stripe.com/docs](https://stripe.com/docs)
- **Stripe Support**: [support.stripe.com](https://support.stripe.com)
- **API Reference**: [stripe.com/docs/api](https://stripe.com/docs/api)

## License

This payment integration is part of the Speedy Sell Flow project and follows the same license terms. 