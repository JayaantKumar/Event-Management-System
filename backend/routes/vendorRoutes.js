const express = require('express');
const router = express.Router();
const { addItem, getItems, updateItemStatus, deleteItem } = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ALL routes require login AND the 'vendor' role
router.use(protect);
router.use(authorize('vendor'));

router.route('/items')
  .post(addItem)
  .get(getItems);

router.put('/items/:id/status', updateItemStatus);
router.delete('/items/:id', deleteItem);

module.exports = router;