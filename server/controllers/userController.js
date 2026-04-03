import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import argon2 from 'argon2';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user bookings
// @route   GET /api/users/bookings
// @access  Private
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId', 'name location images')
      .populate('roomId', 'type price');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/users/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking && booking.userId.toString() === req.user._id.toString()) {
      booking.status = 'cancelled';
      const updatedBooking = await booking.save();
      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new booking
// @route   POST /api/users/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { 
      hotelId, roomId, checkIn, checkOut, totalAmount, guests,
      paymentMethod, paymentId 
    } = req.body;
    
    if (!hotelId || !roomId || !checkIn || !checkOut || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch room to check quantity
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check for overlapping bookings count
    const overlappingBookingsCount = await Booking.countDocuments({
      roomId,
      status: { $ne: 'cancelled' },
      $or: [
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) },
        },
      ],
    });

    if (overlappingBookingsCount >= room.quantity) {
      return res.status(400).json({ message: 'Room is unavailable for these dates (capacity reached)' });
    }

    const adminCommission = totalAmount * 0.20;
    const ownerEarnings = totalAmount * 0.80;

    const booking = new Booking({
      userId: req.user._id,
      hotelId,
      roomId,
      checkIn,
      checkOut,
      totalAmount,
      guests,
      paymentMethod,
      paymentId,
      adminCommission,
      ownerEarnings,
      status: 'confirmed',
      paymentStatus: paymentMethod === 'pay_at_hotel' ? 'pending' : 'paid',
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

