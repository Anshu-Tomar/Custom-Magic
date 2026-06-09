const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, featured, flashDeal, sort = '-createdAt', minPrice, maxPrice } = req.query;
    const query = { isActive: true };

    if (category) query.category = { $regex: category, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    if (flashDeal === 'true') query.isFlashDeal = true;
    if (search) query.$text = { $search: search };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = +minPrice;
      if (maxPrice) query.price.$lte = +maxPrice;
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(+limit),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: { products, total, page: +page, pages: Math.ceil(total / limit) }
    });
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, data: { product } });
  } catch (err) { next(err); }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({ success: true, data: { categories } });
  } catch (err) { next(err); }
};

exports.createProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.files?.length) data.images = req.files.map(f => `/uploads/products/${f.filename}`);
    if (data.images?.length) data.thumbnail = data.images[0];

    const product = await Product.create(data);
    res.status(201).json({ success: true, message: 'Product created', data: { product } });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.files?.length) {
      data.images = req.files.map(f => `/uploads/products/${f.filename}`);
      data.thumbnail = data.images[0];
    }
    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, message: 'Product updated', data: { product } });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
};
