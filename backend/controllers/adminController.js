const Membership = require('../models/Membership');
const User = require('../models/User');
const Order = require('../models/Order');


const generateMemNo = () => 'MEM-' + Math.floor(1000 + Math.random() * 9000);

// Helper to calculate end date
const calculateEndDate = (duration, startDate = new Date()) => {
  const date = new Date(startDate);
  if (duration === '6 months') date.setMonth(date.getMonth() + 6);
  if (duration === '1 year') date.setFullYear(date.getFullYear() + 1);
  if (duration === '2 years') date.setFullYear(date.getFullYear() + 2);
  return date;
};


exports.addMembership = async (req, res) => {
  try {
    const { userId, duration } = req.body;
    
    const membershipNo = generateMemNo();
    const endDate = calculateEndDate(duration);

    const membership = await Membership.create({
      userId,
      membershipNo,
      duration,
      endDate
    });

    res.status(201).json({ message: 'Membership created!', membership });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.updateMembership = async (req, res) => {
  try {
    const { action } = req.body; // 'extend' or 'cancel'
    const { memNo } = req.params;

    const membership = await Membership.findOne({ membershipNo: memNo });
    if (!membership) return res.status(404).json({ message: 'Membership not found' });

    if (action === 'cancel') {
      membership.status = 'cancelled';
    } else if (action === 'extend') {
      membership.status = 'active';
      membership.endDate = calculateEndDate('6 months', membership.endDate);
    }

    await membership.save();
    res.json({ message: `Membership ${action}ed successfully!`, membership });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getReports = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};