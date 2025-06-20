const express = require('express');
const router = express.Router();
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getFeaturedListings,
  getListingsByHost,
  getListingsByLocation,
} = require('../controllers/listingController');
const { protect, hostOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getListings);
router.get('/featured', getFeaturedListings);
router.get('/host/:hostId', getListingsByHost);
router.get('/location/:location', getListingsByLocation);
router.get('/:id', getListingById);

// Protected routes - Host only
router.post('/', protect, hostOnly, createListing);
router.put('/:id', protect, updateListing); // We check host ownership in the controller
router.delete('/:id', protect, deleteListing); // We check host ownership in the controller

module.exports = router;