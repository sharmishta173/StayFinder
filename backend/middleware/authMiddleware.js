const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes that require authentication
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Middleware to check if user is a host
const hostOnly = (req, res, next) => {
  if (req.user && req.user.role === 'host') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Host privileges required.' });
  }
};

// Middleware to check if user is a guest
const guestOnly = (req, res, next) => {
  if (req.user && req.user.role === 'guest') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Guest privileges required.' });
  }
};

module.exports = { protect, hostOnly, guestOnly };