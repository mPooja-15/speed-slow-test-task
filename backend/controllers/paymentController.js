import stripe from '../config/stripe.js';
import Order from '../models/Order.js';
import { asyncHandler } from '../middleware/error.js';

/**
 * @desc    Create payment intent
 * @route   POST /api/payments/create-payment-intent
 * @access  Private
 */
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  // Get order details
  const order = await Order.findById(orderId).populate('user', 'name email');
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Check if order belongs to user
  if (order.user._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to access this order');
  }

  // Check if order is already paid
  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  // Create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100), // Convert to cents (fixed field name)
    currency: 'usd',
    metadata: {
      orderId: order._id.toString(),
      userId: req.user.id,
    },
    description: `Payment for order ${order.orderNumber}`,
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    orderId: order._id,
    amount: order.totalAmount,
  });
});

/**
 * @desc    Get payment intent
 * @route   GET /api/payments/payment-intent/:id
 * @access  Private
 */
const getPaymentIntent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const paymentIntent = await stripe.paymentIntents.retrieve(id);

  res.json(paymentIntent);
});

/**
 * @desc    Handle Stripe webhook
 * @route   POST /api/payments/webhook
 * @access  Public
 */
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailure(event.data.object);
      break;
    case 'charge.succeeded':
      await handleChargeSuccess(event.data.object);
      break;
    case 'charge.failed':
      await handleChargeFailure(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * @desc    Handle successful payment
 * @param   {Object} paymentIntent - Stripe payment intent object
 */
const handlePaymentSuccess = async (paymentIntent) => {
  const orderId = paymentIntent.metadata.orderId;
  
  const order = await Order.findById(orderId);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = 'stripe';
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: paymentIntent.receipt_email,
    };
    order.status = 'processing';
    
    await order.save();
    console.log(`Order ${orderId} marked as paid`);
  }
};

/**
 * @desc    Handle failed payment
 * @param   {Object} paymentIntent - Stripe payment intent object
 */
const handlePaymentFailure = async (paymentIntent) => {
  const orderId = paymentIntent.metadata.orderId;
  
  const order = await Order.findById(orderId);
  if (order) {
    order.status = 'payment_failed';
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
    };
    
    await order.save();
    console.log(`Order ${orderId} payment failed`);
  }
};

/**
 * @desc    Handle successful charge
 * @param   {Object} charge - Stripe charge object
 */
const handleChargeSuccess = async (charge) => {
  console.log('Charge succeeded:', charge.id);
};

/**
 * @desc    Handle failed charge
 * @param   {Object} charge - Stripe charge object
 */
const handleChargeFailure = async (charge) => {
  console.log('Charge failed:', charge.id);
};

/**
 * @desc    Get payment methods for user
 * @route   GET /api/payments/payment-methods
 * @access  Private
 */
const getPaymentMethods = asyncHandler(async (req, res) => {
  // Get customer from Stripe or create one
  let customer;
  
  try {
    // Try to find existing customer
    const customers = await stripe.customers.list({
      email: req.user.email,
      limit: 1,
    });
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      // Create new customer
      customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        metadata: {
          userId: req.user.id,
        },
      });
    }
  } catch (error) {
    console.error('Error with customer:', error);
    res.status(500);
    throw new Error('Error processing payment methods');
  }

  // Get payment methods
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customer.id,
    type: 'card',
  });

  res.json({
    customer: customer.id,
    paymentMethods: paymentMethods.data,
  });
});

/**
 * @desc    Create setup intent for saving payment method
 * @route   POST /api/payments/setup-intent
 * @access  Private
 */
const createSetupIntent = asyncHandler(async (req, res) => {
  const { customerId } = req.body;

  const setupIntent = await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    usage: 'off_session',
  });

  res.json({
    clientSecret: setupIntent.client_secret,
  });
});

export {
  createPaymentIntent,
  getPaymentIntent,
  handleWebhook,
  getPaymentMethods,
  createSetupIntent,
}; 