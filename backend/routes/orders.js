// routes/orders.js
const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders, getOrder, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
