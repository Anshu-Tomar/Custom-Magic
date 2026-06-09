const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { protect, adminOnly } = require('../middleware/auth');

// Validate coupon (user)
router.post('/validate', protect, async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ message: 'Coupon expired' });
    if (coupon.usedCount >= coupon.usageLimit) return res.status(400).json({ message: 'Coupon usage limit reached' });
    if (orderAmount < coupon.minOrderAmount) return res.status(400).json({ message: `Min order ₹${coupon.minOrderAmount} required` });

    const discount = coupon.discountType === 'percent'
      ? Math.min((orderAmount * coupon.discountValue) / 100, coupon.maxDiscountAmount || Infinity)
      : coupon.discountValue;

    res.json({ success: true, data: { coupon, discount } });
  } catch (err) { next(err); }
});

// Admin CRUD
router.get('/', protect, adminOnly, async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt');
    res.json({ success: true, data: { coupons } });
  } catch (err) { next(err); }
});

router.post('/', protect, adminOnly, async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, data: { coupon } });
  } catch (err) { next(err); }
});

router.delete('/:id', protect, adminOnly, async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
