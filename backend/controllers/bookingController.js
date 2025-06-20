const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const {
      listingId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      paymentMethod,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (!listingId || !checkInDate || !checkOutDate || !numberOfGuests || !totalPrice) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if dates are valid
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn >= checkOut) {
      return res.status(400).json({
        message: 'Check-out date must be after check-in date',
      });
    }

    // Check if the listing is available for the requested dates
    const isAvailable = await checkAvailability(listingId, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(400).json({
        message: 'Listing is not available for the selected dates',
      });
    }

    // Create the booking
    const booking = await Booking.create({
      listing: listingId,
      guest: req.user._id,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      totalPrice,
      status: 'pending', // Initial status
      paymentMethod: paymentMethod || 'upi', // Default to UPI
      specialRequests,
      currency: 'INR', // Default currency
    });

    // Update listing availability
    await updateListingAvailability(listingId, checkIn, checkOut, false);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get bookings for the current user (guest)
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate({
        path: 'listing',
        select: 'title images location pricePerNight',
        populate: {
          path: 'host',
          select: 'username profilePicture',
        },
      })
      .sort({ checkInDate: 1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get bookings for the host's listings
// @route   GET /api/bookings/host
// @access  Private/Host
const getHostBookings = async (req, res) => {
  try {
    // First, get all listings owned by the host
    const hostListings = await Listing.find({ host: req.user._id }).select('_id');
    const listingIds = hostListings.map((listing) => listing._id);

    // Then, get all bookings for those listings
    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate({
        path: 'listing',
        select: 'title images location pricePerNight',
      })
      .populate('guest', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get host bookings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'listing',
        select: 'title images location pricePerNight host',
        populate: {
          path: 'host',
          select: 'username profilePicture phoneNumber',
        },
      })
      .populate('guest', 'username profilePicture phoneNumber');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to view this booking
    const isGuest = booking.guest._id.toString() === req.user._id.toString();
    const isHost = booking.listing.host._id.toString() === req.user._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({
        message: 'You are not authorized to view this booking',
      });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        message: 'Please provide a valid status',
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the user is authorized to update this booking
    const isGuest = booking.guest.toString() === req.user._id.toString();
    
    // Get the listing to check if the user is the host
    const listing = await Listing.findById(booking.listing);
    const isHost = listing && listing.host.toString() === req.user._id.toString();

    // Guests can only cancel their own bookings
    // Hosts can confirm, cancel, or mark as completed
    if (isGuest && status !== 'cancelled') {
      return res.status(403).json({
        message: 'Guests can only cancel bookings',
      });
    }

    if (!isGuest && !isHost) {
      return res.status(403).json({
        message: 'You are not authorized to update this booking',
      });
    }

    // If cancelling, update listing availability
    if (status === 'cancelled' && booking.status !== 'cancelled') {
      await updateListingAvailability(
        booking.listing,
        booking.checkInDate,
        booking.checkOutDate,
        true
      );
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Process payment for booking
// @route   POST /api/bookings/:id/payment
// @access  Private
const processPayment = async (req, res) => {
  try {
    // Validate booking ID
    if (!req.params.id) {
      console.log('Payment failed: Missing booking ID');
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
    }

    console.log('Payment request received:', { 
      bookingId: req.params.id,
      userId: req.user._id,
      paymentMethod: req.body.paymentMethod,
      // Log masked payment details for debugging
      ...(req.body.upiId ? { upiId: `${req.body.upiId.substring(0, 3)}...` } : {}),
      ...(req.body.cardNumber ? { cardNumberMasked: `xxxx-xxxx-xxxx-${req.body.cardNumber.slice(-4)}` } : {})
    });

    const { paymentMethod, paymentId, upiId, cardNumber, cardExpiry, cardCvv } = req.body;

    // Validate payment method
    if (!paymentMethod) {
      console.log('Payment validation failed: Missing payment method');
      return res.status(400).json({
        success: false,
        message: 'Please provide a payment method',
      });
    }

    // Validate payment details based on payment method
    if (paymentMethod === 'upi') {
      if (!upiId) {
        console.log('Payment validation failed: Missing UPI ID');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid UPI ID',
        });
      }
      
      // Validate UPI format (basic validation)
      if (!/[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}/.test(upiId)) {
        console.log('Payment validation failed: Invalid UPI ID format');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid UPI ID in the format username@bank',
        });
      }
    } else if (paymentMethod === 'card') {
      // Validate card details
      if (!cardNumber) {
        console.log('Payment validation failed: Missing card number');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid card number',
        });
      }
      
      if (!cardExpiry) {
        console.log('Payment validation failed: Missing card expiry');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid card expiry date',
        });
      }
      
      if (!cardCvv) {
        console.log('Payment validation failed: Missing card CVV');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid card CVV',
        });
      }
      
      // Validate card number format (basic validation)
      if (!/^[0-9]{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        console.log('Payment validation failed: Invalid card number format');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 16-digit card number',
        });
      }
      
      // Validate expiry date format (MM/YY)
      if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardExpiry)) {
        console.log('Payment validation failed: Invalid card expiry format');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid expiry date in MM/YY format',
        });
      }
      
      // Validate CVV format (3-4 digits)
      if (!/^[0-9]{3,4}$/.test(cardCvv)) {
        console.log('Payment validation failed: Invalid CVV format');
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid 3 or 4 digit CVV',
        });
      }
    }

    // Find booking
    let booking;
    try {
      booking = await Booking.findById(req.params.id);
    } catch (findError) {
      console.error('Error finding booking:', findError);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving booking information',
      });
    }

    if (!booking) {
      console.log(`Payment failed: Booking not found with ID ${req.params.id}`);
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found' 
      });
    }

    // Check if the user is the guest who made the booking
    if (booking.guest.toString() !== req.user._id.toString()) {
      console.log(`Payment authorization failed: User ${req.user._id} is not the booking guest ${booking.guest}`);
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to process payment for this booking',
      });
    }

    // Check if booking is already paid/confirmed
    if (booking.status === 'confirmed') {
      console.log(`Payment skipped: Booking ${req.params.id} is already confirmed`);
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid for',
      });
    }

    // Mock payment processing
    // In a real application, this would integrate with a payment gateway
    // Always succeed for testing purposes
    const paymentSuccess = true;
    console.log(`Payment processing result: ${paymentSuccess ? 'Success' : 'Failed'}`);

    if (paymentSuccess) {
      console.log('Updating booking with payment details...');
      booking.status = 'confirmed';
      booking.paymentMethod = paymentMethod;
      booking.paymentId = paymentId || `mock_payment_${Date.now()}`;
      
      // Store payment details based on payment method
      if (paymentMethod === 'upi') {
        booking.paymentDetails = { upiId };
      } else if (paymentMethod === 'card') {
        // Store only last 4 digits of card number for security
        booking.paymentDetails = { 
          cardNumberLast4: cardNumber.slice(-4),
          cardExpiry
        };
      }
      
      try {
        await booking.save();
        console.log(`Booking ${req.params.id} updated with payment details and confirmed status`);

        // Return success response with sanitized booking data
        const sanitizedBooking = { ...booking.toObject() };
        
        // Remove sensitive payment details before sending response
        if (sanitizedBooking.paymentDetails) {
          if (sanitizedBooking.paymentMethod === 'upi') {
            sanitizedBooking.paymentDetails.upiId = `${sanitizedBooking.paymentDetails.upiId?.substring(0, 3)}...`;
          }
          // Card details are already sanitized (only last 4 digits stored)
        }
        
        res.json({
          success: true,
          message: 'Payment processed successfully',
          booking: sanitizedBooking,
        });
      } catch (saveError) {
        console.error('Error saving booking after payment:', saveError);
        
        // Provide more specific error messages based on error type
        let errorMessage = 'Payment was processed but we encountered an error updating your booking. Please contact support.';
        
        if (saveError.name === 'ValidationError') {
          errorMessage = 'Invalid booking data. Please check your information and try again.';
          return res.status(400).json({
            success: false,
            message: errorMessage,
            error: saveError.message
          });
        } else if (saveError.name === 'CastError') {
          errorMessage = 'Invalid data format. Please check your information and try again.';
          return res.status(400).json({
            success: false,
            message: errorMessage,
            error: saveError.message
          });
        }
        
        return res.status(500).json({
          success: false,
          message: errorMessage,
          error: saveError.message
        });
      }
    } else {
      console.log(`Payment failed for booking ${req.params.id}`);
      res.status(400).json({
        success: false,
        message: 'Payment processing failed. Please try again.',
      });
    }
  } catch (error) {
    console.error('Process payment error:', error);
    // Provide more specific error messages based on error type
    let errorMessage = 'Server error while processing payment';
    
    if (error.name === 'ValidationError') {
      errorMessage = 'Invalid payment data provided';
    } else if (error.name === 'CastError') {
      errorMessage = 'Invalid booking ID format';
    } else if (error.code === 11000) {
      errorMessage = 'Duplicate payment detected';
    }
    
    res.status(500).json({ 
      success: false,
      message: errorMessage, 
      error: error.message 
    });
  }
};

// Helper function to check if a listing is available for the given dates
const checkAvailability = async (listingId, checkIn, checkOut) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    return false;
  }

  // If the listing has specific availability dates
  if (listing.availability && listing.availability.length > 0) {
    // Check each date in the range
    for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const dateEntry = listing.availability.find(
        (a) => a.date.toISOString().split('T')[0] === dateStr
      );

      // If date is explicitly marked as unavailable
      if (dateEntry && !dateEntry.available) {
        return false;
      }
    }
  }

  // Check if there are any overlapping bookings
  const existingBookings = await Booking.find({
    listing: listingId,
    status: { $nin: ['cancelled'] },
    $or: [
      // Check-in date falls within an existing booking
      {
        checkInDate: { $lte: checkIn },
        checkOutDate: { $gt: checkIn },
      },
      // Check-out date falls within an existing booking
      {
        checkInDate: { $lt: checkOut },
        checkOutDate: { $gte: checkOut },
      },
      // Booking completely contains an existing booking
      {
        checkInDate: { $gte: checkIn },
        checkOutDate: { $lte: checkOut },
      },
    ],
  });

  return existingBookings.length === 0;
};

// Helper function to update listing availability
const updateListingAvailability = async (listingId, checkIn, checkOut, makeAvailable) => {
  const listing = await Listing.findById(listingId);

  if (!listing) {
    return;
  }

  // For each date in the range
  for (let d = new Date(checkIn); d <= checkOut; d.setDate(d.getDate() + 1)) {
    const currentDate = new Date(d);
    
    // Find if this date already exists in availability
    const existingIndex = listing.availability.findIndex(
      (a) => a.date.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]
    );

    if (existingIndex >= 0) {
      // Update existing date entry
      listing.availability[existingIndex].available = makeAvailable;
    } else if (!makeAvailable) {
      // Only add new entries if making unavailable
      listing.availability.push({
        date: currentDate,
        available: false,
      });
    }
  }

  await listing.save();
};

module.exports = {
  createBooking,
  getUserBookings,
  getHostBookings,
  getBookingById,
  updateBookingStatus,
  processPayment,
};