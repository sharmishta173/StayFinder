const Listing = require('../models/Listing');
const User = require('../models/User');

// @desc    Get all listings with optional filtering
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
  try {
    const {
      location,
      minPrice,
      maxPrice,
      checkIn,
      checkOut,
      guests,
      bedrooms,
      propertyType,
      amenities,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query object
    const query = {};

    // Filter by location (city, state, or country)
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Filter by number of guests
    if (guests) {
      query.numberOfGuests = { $gte: Number(guests) };
    }

    // Filter by number of bedrooms
    if (bedrooms) {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    // Filter by property type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Filter by amenities
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    // Filter by availability if check-in and check-out dates are provided
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Ensure valid date range
      if (checkInDate >= checkOutDate) {
        return res.status(400).json({
          message: 'Check-out date must be after check-in date',
        });
      }

      // Find listings where all dates in the range are available
      query['availability.date'] = {
        $gte: checkInDate,
        $lte: checkOutDate,
      };
      query['availability.available'] = true;
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const listings = await Listing.find(query)
      .populate('host', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination info
    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single listing by ID
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'host',
      'username profilePicture phoneNumber'
    );

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Get listing by ID error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private/Host
const createListing = async (req, res) => {
  try {
    // Set the host to the current user
    req.body.host = req.user._id;

    // Ensure the user is a host
    if (req.user.role !== 'host') {
      return res.status(403).json({
        message: 'Only hosts can create listings',
      });
    }

    // Create the listing
    const listing = await Listing.create(req.body);

    res.status(201).json(listing);
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private/Host
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is the host of the listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to update this listing',
      });
    }

    // Update the listing
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedListing);
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private/Host
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if user is the host of the listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to delete this listing',
      });
    }

    await listing.deleteOne();

    res.json({ message: 'Listing removed' });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get featured listings
// @route   GET /api/listings/featured
// @access  Public
const getFeaturedListings = async (req, res) => {
  try {
    const featuredListings = await Listing.find({ isFeatured: true })
      .populate('host', 'username profilePicture')
      .limit(6);

    res.json(featuredListings);
  } catch (error) {
    console.error('Get featured listings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get listings by host
// @route   GET /api/listings/host/:hostId
// @access  Public
const getListingsByHost = async (req, res) => {
  try {
    const hostId = req.params.hostId;

    // Check if host exists
    const host = await User.findById(hostId);
    if (!host || host.role !== 'host') {
      return res.status(404).json({ message: 'Host not found' });
    }

    const listings = await Listing.find({ host: hostId });

    res.json(listings);
  } catch (error) {
    console.error('Get listings by host error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get listings by location
// @route   GET /api/listings/location/:location
// @access  Public
const getListingsByLocation = async (req, res) => {
  try {
    const location = req.params.location;

    const listings = await Listing.find({
      $or: [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } },
      ],
    }).populate('host', 'username profilePicture');

    res.json(listings);
  } catch (error) {
    console.error('Get listings by location error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getFeaturedListings,
  getListingsByHost,
  getListingsByLocation,
};