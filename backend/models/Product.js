const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number },
  discountPercent: { type: Number, default: 0 },
  category: { type: String, required: true },
  subCategory: { type: String },
  brand: { type: String },
  images: [{ type: String }],
  thumbnail: { type: String },
  stock: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: 'piece' },
  weight: { type: String },
  tags: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isFlashDeal: { type: Boolean, default: false },
  flashDealEndsAt: { type: Date },
  isActive: { type: Boolean, default: true },
  deliveryTime: { type: String, default: '10 mins' },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
