require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const connectDB = require('../config/database');

const categories = ['Fruits & Veggies', 'Dairy & Eggs', 'Snacks', 'Beverages', 'Personal Care', 'Household', 'Meat & Fish', 'Bakery'];

const products = [
  { name: 'Fresh Bananas', description: 'Sweet and ripe bananas, rich in potassium', price: 49, originalPrice: 60, discountPercent: 18, category: 'Fruits & Veggies', tags: ['fruits', 'fresh'], stock: 100, unit: 'dozen', isFeatured: true, isFlashDeal: true, deliveryTime: '10 mins', rating: 4.5, reviewCount: 234 },
  { name: 'Organic Apples', description: 'Crisp and fresh organic apples from Himachal Pradesh', price: 149, originalPrice: 180, discountPercent: 17, category: 'Fruits & Veggies', tags: ['fruits', 'organic'], stock: 80, unit: 'kg', isFeatured: true, rating: 4.7, reviewCount: 189 },
  { name: 'Full Cream Milk', description: 'Fresh pasteurized full cream milk', price: 68, originalPrice: 70, discountPercent: 3, category: 'Dairy & Eggs', tags: ['dairy', 'milk'], stock: 150, unit: '1L', isFeatured: true, rating: 4.4, reviewCount: 567 },
  { name: 'Farm Fresh Eggs', description: '6 large brown eggs, protein-rich', price: 79, originalPrice: 90, discountPercent: 12, category: 'Dairy & Eggs', tags: ['eggs', 'protein'], stock: 200, unit: '6 pcs', isFeatured: true, isFlashDeal: true, rating: 4.6, reviewCount: 432 },
  { name: 'Lays Classic Chips', description: 'Original salted potato chips, always crispy', price: 30, category: 'Snacks', tags: ['chips', 'snacks'], stock: 300, unit: '73g', rating: 4.3, reviewCount: 890 },
  { name: 'Coca-Cola 750ml', description: 'Refreshing cola drink', price: 45, category: 'Beverages', tags: ['cold drinks', 'soda'], stock: 250, unit: '750ml', isFlashDeal: true, rating: 4.5, reviewCount: 1200 },
  { name: 'Dove Soap Bar', description: 'Moisturizing beauty cream bar', price: 56, originalPrice: 65, discountPercent: 14, category: 'Personal Care', tags: ['soap', 'bath'], stock: 120, unit: '100g', rating: 4.6, reviewCount: 345 },
  { name: 'Ariel Washing Powder', description: 'Removes tough stains easily', price: 210, originalPrice: 240, discountPercent: 13, category: 'Household', tags: ['detergent', 'laundry'], stock: 90, unit: '1kg', rating: 4.4, reviewCount: 678 },
  { name: 'Whole Wheat Bread', description: 'Freshly baked whole wheat bread', price: 45, category: 'Bakery', tags: ['bread', 'bakery'], stock: 60, unit: '400g', isFeatured: true, rating: 4.2, reviewCount: 234 },
  { name: 'Greek Yogurt', description: 'Thick and creamy protein-rich yogurt', price: 99, originalPrice: 120, discountPercent: 18, category: 'Dairy & Eggs', tags: ['yogurt', 'healthy'], stock: 70, unit: '400g', isFeatured: true, isFlashDeal: true, rating: 4.8, reviewCount: 567 },
  { name: 'Tomatoes', description: 'Fresh red tomatoes locally sourced', price: 39, category: 'Fruits & Veggies', tags: ['vegetables', 'fresh'], stock: 200, unit: '500g', rating: 4.1, reviewCount: 123 },
  { name: 'Amul Butter', description: 'Pasteurized table butter, rich and creamy', price: 56, category: 'Dairy & Eggs', tags: ['butter', 'dairy'], stock: 180, unit: '100g', isFeatured: true, rating: 4.7, reviewCount: 890 },
  { name: 'Red Bull Energy Drink', description: 'Gives you wings! Energy boost drink', price: 125, category: 'Beverages', tags: ['energy drink', 'caffeine'], stock: 80, unit: '250ml', isFlashDeal: true, rating: 4.3, reviewCount: 456 },
  { name: 'Chicken Breast', description: 'Boneless skinless chicken breast, fresh', price: 299, originalPrice: 350, discountPercent: 15, category: 'Meat & Fish', tags: ['chicken', 'protein'], stock: 40, unit: '500g', isFeatured: true, rating: 4.5, reviewCount: 234 },
  { name: 'Maggi Noodles', description: '2-minute instant noodles, masala flavor', price: 14, category: 'Snacks', tags: ['instant noodles', 'quick meal'], stock: 500, unit: '70g', rating: 4.6, reviewCount: 2300 },
  { name: 'Head & Shoulders Shampoo', description: 'Anti-dandruff shampoo for healthy scalp', price: 199, originalPrice: 230, discountPercent: 13, category: 'Personal Care', tags: ['shampoo', 'hair care'], stock: 110, unit: '340ml', rating: 4.4, reviewCount: 567 },
];

const coupons = [
  { code: 'GENZ10', description: '10% off on all orders', discountType: 'percent', discountValue: 10, minOrderAmount: 199, maxDiscountAmount: 100, usageLimit: 1000 },
  { code: 'NEWUSER', description: 'Flat ₹50 off for new users', discountType: 'flat', discountValue: 50, minOrderAmount: 299, usageLimit: 500 },
  { code: 'FLASH20', description: '20% off on flash deals', discountType: 'percent', discountValue: 20, minOrderAmount: 499, maxDiscountAmount: 200, usageLimit: 200 },
];

async function seed() {
  await connectDB();

  console.log('🗑️  Clearing existing data...');
  await Promise.all([User.deleteMany(), Product.deleteMany(), Coupon.deleteMany()]);

  console.log('👤 Creating admin user...');
  await User.create({ name: 'Admin', email: 'admin@blinkit.com', password: 'Admin@123', role: 'admin' });
  await User.create({ name: 'Test User', email: 'user@blinkit.com', password: 'User@123', role: 'user' });

  console.log('📦 Creating products...');
  await Product.insertMany(products);

  console.log('🎟️  Creating coupons...');
  await Coupon.insertMany(coupons);

  console.log('✅ Seed completed!');
  console.log('   Admin: admin@blinkit.com / Admin@123');
  console.log('   User:  user@blinkit.com / User@123');
  mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
