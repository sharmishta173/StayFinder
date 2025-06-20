const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getHostBookings,
  getBookingById,
  updateBookingStatus,
  processPayment,
} = require('../controllers/bookingController');
const { protect, hostOnly } = require('../middleware/authMiddleware');

// All booking routes are protected
router.use(protect);

// Create a new booking
router.post('/', createBooking);

// Get booking by ID
router.get('/:id', getBookingById);

// Update booking status
router.put('/:id/status', updateBookingStatus);

// Process payment for a booking
router.post('/:id/payment', processPayment);

// Get bookings for the current user (guest)
router.get('/user/me', getUserBookings);

// Get bookings for the host's listings (host only)
router.get('/host/me', hostOnly, getHostBookings);

module.exports = router;