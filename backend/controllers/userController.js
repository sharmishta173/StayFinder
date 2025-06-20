const User = require('../models/User');
const Listing = require('../models/Listing');
const bcrypt = require('bcryptjs');

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.profilePicture) user.profilePicture = req.body.profilePicture;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    
    // Update address if provided
    if (req.body.address) {
      user.address = {
        ...user.address,
        ...req.body.address,
      };
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address,
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/me/password
// @access  Private
const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add/Remove listing to/from wishlist
// @route   POST /api/users/me/wishlist/:listingId
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const userId = req.user._id;

    // Check if listing exists
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if listing is already in wishlist
    const isInWishlist = user.wishlist.includes(listingId);

    if (isInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== listingId.toString()
      );
      await user.save();
      res.json({ message: 'Listing removed from wishlist', inWishlist: false });
    } else {
      // Add to wishlist
      user.wishlist.push(listingId);
      await user.save();
      res.json({ message: 'Listing added to wishlist', inWishlist: true });
    }
  } catch (error) {
    console.error('Toggle wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user wishlist
// @route   GET /api/users/me/wishlist
// @access  Private
const getUserWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Check if listing is in user's wishlist
// @route   GET /api/users/me/wishlist/:listingId/check
// @access  Private
const checkWishlist = async (req, res) => {
  try {
    const listingId = req.params.listingId;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isInWishlist = user.wishlist.includes(listingId);

    res.json({ inWishlist: isInWishlist });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  updateUserProfile,
  updateUserPassword,
  toggleWishlist,
  getUserWishlist,
  checkWishlist,
};