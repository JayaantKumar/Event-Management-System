const Membership = require('../models/Membership');

// Generate a random membership number (e.g., MEM-8374)
const generateMemNo = () => 'MEM-' + Math.floor(1000 + Math.random() * 9000);

// Helper to calculate end date
const calculateEndDate = (duration, startDate = new Date()) => {
  const date = new Date(startDate);
  if (duration === '6 months') date.setMonth(date.getMonth() + 6);
  if (duration === '1 year') date.setFullYear(date.getFullYear() + 1);
  if (duration === '2 years') date.setFullYear(date.getFullYear() + 2);
  return date;
};

// @desc    Add a new membership
// @route   POST /api/admin/membership
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

// @desc    Update a membership (Extend or Cancel)
// @route   PUT /api/admin/membership/:memNo
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