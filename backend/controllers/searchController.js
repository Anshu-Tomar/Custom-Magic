const Product = require('../models/Product');
const SearchHistory = require('../models/SearchHistory');

exports.search = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;
    if (!q) return res.json({ success: true, data: { products: [] } });

    const products = await Product.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    }).limit(+limit).select('name price thumbnail category discountPercent stock');

    // Save to search history if user logged in
    if (req.user && q.trim()) {
      await SearchHistory.create({ user: req.user._id, query: q.trim(), resultCount: products.length });
    }

    res.json({ success: true, data: { products, total: products.length } });
  } catch (err) { next(err); }
};

exports.getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ user: req.user._id })
      .sort('-createdAt').limit(20).select('query resultCount createdAt');
    res.json({ success: true, data: { history } });
  } catch (err) { next(err); }
};

exports.clearSearchHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'Search history cleared' });
  } catch (err) { next(err); }
};

exports.deleteSearchItem = async (req, res, next) => {
  try {
    await SearchHistory.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Search item removed' });
  } catch (err) { next(err); }
};
