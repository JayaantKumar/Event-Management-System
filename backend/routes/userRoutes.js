const express = require('express');
const router = express.Router();
const { 
  getAvailableItems, placeOrder, getMyOrders, 
  getGuests, addGuest, deleteGuest 
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('user')); // ONLY Standard Users

router.get('/items', getAvailableItems);
router.route('/orders').post(placeOrder).get(getMyOrders);
router.route('/guests').get(getGuests).post(addGuest);
router.delete('/guests/:id', deleteGuest);

module.exports = router;