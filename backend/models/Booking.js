const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: [true, 'Listing is required'],
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guest is required'],
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Number of guests must be at least 1'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [1, 'Total price must be at least 1 INR'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'netbanking', 'other'],
    },
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      // This will store different payment details based on the payment method
      // For UPI: { upiId: string }
      // For Card: { cardNumberLast4: string, cardExpiry: string }
    },
    currency: {
      type: String,
      default: 'INR',
    },
    specialRequests: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create index for faster queries
BookingSchema.index({ listing: 1, guest: 1, checkInDate: 1, checkOutDate: 1 });

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;