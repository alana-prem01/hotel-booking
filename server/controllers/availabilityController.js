import Booking from '../models/Booking.js';
import Room from '../models/Room.js';

// @desc    Check room availability for given dates
// @route   GET /api/public/rooms/:id/availability
// @access  Public
export const checkRoomAvailability = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    return res.status(400).json({ message: 'Check-In and Check-Out dates are required' });
  }

  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (endDate <= startDate) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    // Find overlapping bookings
    const overlappingBookings = await Booking.find({
      roomId: id,
      status: { $ne: 'cancelled' },
      $and: [
        { checkIn: { $lt: endDate } },
        { checkOut: { $gt: startDate } }
      ]
    });

    const activeBookingsCount = overlappingBookings.length;
    const available = activeBookingsCount < room.quantity;
    const remaining = room.quantity - activeBookingsCount;

    res.json({
      available,
      remaining,
      totalQuantity: room.quantity,
      activeBookingsCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
