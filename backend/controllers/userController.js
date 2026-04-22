const Product = require('../models/Product');
const Order = require('../models/Order');
const Guest = require('../models/Guest');

// --- SHOPPING & ORDERS ---

// @desc    Get all available items from all vendors
// @route   GET /api/user/items
exports.getAvailableItems = async (req, res) => {
  try {
    const items = await Product.find({ status: 'Available' });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Place a new order (Checkout)
// @route   POST /api/user/orders
exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount
    });
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's order history
// @route   GET /api/user/orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- GUEST LIST ---

exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find({ userId: req.user.id });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addGuest = async (req, res) => {
  try {
    const { name, email, rsvpStatus } = req.body;
    const guest = await Guest.create({ userId: req.user.id, name, email, rsvpStatus });
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteGuest = async (req, res) => {
  try {
    await Guest.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Guest removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};