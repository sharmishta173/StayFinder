const express = require('express');
const router = express.Router();
const {
  updateUserProfile,
  updateUserPassword,
  toggleWishlist,
  getUserWishlist,
  checkWishlist,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Protect all routes in this router
router.use(protect);

// User profile routes
router.get('/me', (req, res) => {
  // User is already available in req.user from the protect middleware
  res.json(req.user);
});
router.put('/me', updateUserProfile);
router.put('/me/password', updateUserPassword);

// Wishlist routes
router.post('/me/wishlist/:listingId', toggleWishlist);
router.get('/me/wishlist', getUserWishlist);
router.get('/me/wishlist/:listingId/check', checkWishlist);

module.exports = router;