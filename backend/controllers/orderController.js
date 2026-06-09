const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

exports.createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, notes } = req.body;

    // Validate products & calculate
    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) return res.status(400).json({ message: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.thumbnail,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });

      // Deduct stock
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    // Coupon
    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.usedCount < coupon.usageLimit && subtotal >= coupon.minOrderAmount) {
        couponDiscount = coupon.discountType === 'percent'
          ? Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscountAmount || Infinity)
          : coupon.discountValue;
        await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
      }
    }

    const tax = subtotal * 0.05;
    const deliveryCharge = subtotal > 500 ? 0 : 30;
    const total = subtotal + tax + deliveryCharge - couponDiscount;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      couponDiscount,
      subtotal,
      tax,
      deliveryCharge,
      total,
      notes,
      statusHistory: [{ status: 'placed', note: 'Order placed successfully' }]
    });

    res.status(201).json({ success: true, message: 'Order placed!', data: { order } });
  } catch (err) { next(err); }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id }).sort('-createdAt').skip(skip).limit(+limit).populate('items.product', 'name thumbnail'),
      Order.countDocuments({ user: req.user._id })
    ]);
    res.json({ success: true, data: { orders, total, page: +page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ success: true, data: { order } });
  } catch (err) { next(err); }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['placed', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order at this stage' });
    }
    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Cancelled by user' });
    await order.save();
    res.json({ success: true, message: 'Order cancelled', data: { order } });
  } catch (err) { next(err); }
};
