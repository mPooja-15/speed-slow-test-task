import express from 'express';
import {
  createPaymentIntent,
  getPaymentIntent,
  handleWebhook,
  getPaymentMethods,
  createSetupIntent,
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentIntent:
 *       type: object
 *       properties:
 *         clientSecret:
 *           type: string
 *           description: Client secret for Stripe payment intent
 *         orderId:
 *           type: string
 *           description: Order ID
 *         amount:
 *           type: number
 *           description: Payment amount
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Payment method ID
 *         type:
 *           type: string
 *           description: Payment method type
 *         card:
 *           type: object
 *           properties:
 *             brand:
 *               type: string
 *               description: Card brand
 *             last4:
 *               type: string
 *               description: Last 4 digits
 *             exp_month:
 *               type: number
 *               description: Expiration month
 *             exp_year:
 *               type: number
 *               description: Expiration year
 *     SetupIntent:
 *       type: object
 *       properties:
 *         clientSecret:
 *           type: string
 *           description: Client secret for setup intent
 */

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing endpoints
 */

/**
 * @swagger
 * /api/payments/create-payment-intent:
 *   post:
 *     summary: Create a payment intent for an order
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order to pay for
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntent'
 *       400:
 *         description: Bad request - Order already paid or invalid data
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Not authorized to access this order
 *       404:
 *         description: Order not found
 */
router.post('/create-payment-intent', protect, createPaymentIntent);

/**
 * @swagger
 * /api/payments/payment-intent/{id}:
 *   get:
 *     summary: Get payment intent details
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment intent ID
 *     responses:
 *       200:
 *         description: Payment intent details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Payment intent not found
 */
router.get('/payment-intent/:id', protect, getPaymentIntent);

/**
 * @swagger
 * /api/payments/payment-methods:
 *   get:
 *     summary: Get user's saved payment methods
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 customer:
 *                   type: string
 *                   description: Stripe customer ID
 *                 paymentMethods:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PaymentMethod'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.get('/payment-methods', protect, getPaymentMethods);

/**
 * @swagger
 * /api/payments/setup-intent:
 *   post:
 *     summary: Create setup intent for saving payment method
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: Stripe customer ID
 *     responses:
 *       200:
 *         description: Setup intent created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SetupIntent'
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/setup-intent', protect, createSetupIntent);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     summary: Handle Stripe webhook events
 *     tags: [Payments]
 *     description: Webhook endpoint for Stripe events (payment success, failure, etc.)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *       400:
 *         description: Webhook signature verification failed
 */
router.post('/webhook', handleWebhook);

export default router; 