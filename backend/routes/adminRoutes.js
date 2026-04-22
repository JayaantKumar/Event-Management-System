const express = require('express');
const router = express.Router();
const { addMembership, updateMembership } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ALL routes in this file require the user to be logged in AND have the 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.post('/membership', addMembership);
router.put('/membership/:memNo', updateMembership);

module.exports = router;