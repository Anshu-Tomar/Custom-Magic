const express = require('express');
const router = express.Router();
const { getDashboard, getAllOrders, updateOrderStatus, getAllUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/dashboard', getDashboard);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUserStatus);

module.exports = router;
