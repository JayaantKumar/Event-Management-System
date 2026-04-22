const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Example of a protected test route strictly for Admins
router.get('/admin-only', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome to the admin dashboard API' });
});

module.exports = router;