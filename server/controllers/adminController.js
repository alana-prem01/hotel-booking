import User from '../models/User.js';
import Owner from '../models/Owner.js';
import Hotel from '../models/Hotel.js';
import Booking from '../models/Booking.js';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getAdminDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({ role: 'user' });
    const ownersCount = await Owner.countDocuments();
    const hotelsCount = await Hotel.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    
    // Revenue from completed/confirmed bookings
    const bookings = await Booking.find({ status: { $in: ['confirmed', 'completed'] } });
    const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.adminCommission || 0), 0);

    const recentBookings = await Booking.find().sort({ createdAt: -1 }).limit(5)
      .populate('userId', 'name email')
      .populate('hotelId', 'name');

    res.json({
      usersCount,
      ownersCount,
      hotelsCount,
      bookingsCount,
      totalRevenue,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle Block Owner
// @route   PUT /api/admin/owners/:id/block
// @access  Private (Admin)
export const toggleBlockOwner = async (req, res) => {
  try {
    const owner = await Owner.findById(req.params.id);
    if (owner) {
      owner.isBlocked = !owner.isBlocked;
      const updatedOwner = await owner.save();
      res.json({ message: owner.isBlocked ? 'Owner Blocked' : 'Owner Unblocked', owner: updatedOwner });
    } else {
      res.status(404).json({ message: 'Owner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Block or Unblock User
// @route   PUT /api/admin/users/:id/block
// @access  Private (Admin)
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = !user.isBlocked;
      const updatedUser = await user.save();
      res.json({ message: user.isBlocked ? 'User Blocked' : 'User Unblocked', user: updatedUser });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all owners
// @route   GET /api/admin/owners
// @access  Private (Admin)
export const getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.find().select('-password');
    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve/Reject Owner
// @route   PUT /api/admin/owners/:id/status
// @access  Private (Admin)
export const updateOwnerStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const owner = await Owner.findById(req.params.id);
    if (owner) {
      owner.status = status;
      const updatedOwner = await owner.save();
      res.json(updatedOwner);
    } else {
      res.status(404).json({ message: 'Owner not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all hotels
// @route   GET /api/admin/hotels
// @access  Private (Admin)
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('ownerId', 'name companyName');
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('hotelId', 'name')
      .populate('roomId', 'type');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
