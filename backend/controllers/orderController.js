import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    taxPrice = 0,
    shippingPrice = 0
  } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No order items'
    });
  }

  // Validate and prepare order items
  const orderItems = [];
  let itemsPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${item.product}`
      });
    }

    if (!product.isInStock(item.quantity)) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.name}`
      });
    }

    const itemPrice = product.price;
    const totalItemPrice = itemPrice * item.quantity;
    itemsPrice += totalItemPrice;

    orderItems.push({
      product: item.product,
      name: product.name,
      price: itemPrice,
      quantity: item.quantity,
      image: product.image,
      sku: product.sku
    });

    // Update product stock
    await product.updateStock(-item.quantity);
  }

  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // User must be authenticated to create orders
  const userId = req.user.id;

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress: {
      ...shippingAddress,
      // Ensure required fields are present
      firstName: shippingAddress.firstName || 'Test',
      lastName: shippingAddress.lastName || 'User',
      phone: shippingAddress.phone || '123-456-7890'
    },
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const userId = req.user.id;
  
  // Debug logging
  console.log('🔍 /myorders endpoint called:');
  console.log('   User ID from token:', userId);
  console.log('   User object:', req.user);
  
  // Check if user exists
  const user = await User.findById(userId);
  console.log('   User found in DB:', user ? `${user.firstName} ${user.lastName} (${user.email})` : 'NOT FOUND');
  
  // Check total orders for this user
  const totalOrdersForUser = await Order.countDocuments({ user: userId });
  console.log('   Total orders for this user:', totalOrdersForUser);
  
  // Check all orders in database
  const allOrders = await Order.find({});
  console.log('   Total orders in database:', allOrders.length);
  
  if (allOrders.length > 0) {
    console.log('   Sample order user IDs:', allOrders.slice(0, 3).map(o => o.user));
  }

  const orders = await Order.getUserOrders(userId, page, limit);
  const total = await Order.countDocuments({ user: userId });

  console.log('   Orders returned:', orders.length);
  console.log('   Response total:', total);

  res.json({
    success: true,
    count: orders.length,
    total,
    data: orders
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name image price');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Make sure user owns order or is admin
  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this order'
    });
  }

  res.json({
    success: true,
    data: order
  });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer.email_address
  };

  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: 'Order marked as paid',
    data: updatedOrder
  });
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private (Admin)
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  order.status = 'delivered';

  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: 'Order marked as delivered',
    data: updatedOrder
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, notes } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  await order.updateStatus(status);

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (notes) {
    order.notes = notes;
  }

  await order.save();

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
export const getOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const status = req.query.status;

  let query = {};
  if (status) {
    query.status = status;
  }

  const orders = await Order.find(query)
    .populate('user', 'firstName lastName email')
    .populate('items.product', 'name image price')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    count: orders.length,
    total,
    data: orders
  });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user can cancel this order
  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to cancel this order'
    });
  }

  // Only allow cancellation of pending orders
  if (order.status !== 'pending') {
    return res.status(400).json({
      success: false,
      message: 'Order cannot be cancelled at this stage'
    });
  }

  // Restore product stock
  for (const item of order.items) {
    const product = await Product.findById(item.product);
    if (product) {
      await product.updateStock(item.quantity);
    }
  }

  order.status = 'cancelled';
  await order.save();

  res.json({
    success: true,
    message: 'Order cancelled successfully',
    data: order
  });
});

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/stats
// @access  Private (Admin)
export const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await Order.getStats();

  res.json({
    success: true,
    data: stats
  });
});

// @desc    Get orders by status (Admin)
// @route   GET /api/orders/status/:status
// @access  Private (Admin)
export const getOrdersByStatus = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const orders = await Order.getByStatus(req.params.status, page, limit);
  const total = await Order.countDocuments({ status: req.params.status });

  res.json({
    success: true,
    count: orders.length,
    total,
    data: orders
  });
}); 