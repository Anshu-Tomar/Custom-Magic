const express = require('express');
const router = express.Router();
const { search, getSearchHistory, clearSearchHistory, deleteSearchItem } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

router.get('/', protect, search);
router.get('/history', protect, getSearchHistory);
router.delete('/history', protect, clearSearchHistory);
router.delete('/history/:id', protect, deleteSearchItem);

module.exports = router;
