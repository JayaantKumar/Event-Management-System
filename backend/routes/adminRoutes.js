const express = require('express');
const router = express.Router();
const { 
  addMembership, 
  updateMembership,
  getAllUsers,
  getAllVendors,
  getReports
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ALL routes in this file require the user to be logged in AND have the 'admin' role
router.use(protect);
router.use(authorize('admin'));

// Membership routes
router.post('/membership', addMembership);
router.put('/membership/:memNo', updateMembership);

// Dashboard data routes
router.get('/users', getAllUsers);
router.get('/vendors', getAllVendors);
router.get('/reports', getReports);

module.exports = router;