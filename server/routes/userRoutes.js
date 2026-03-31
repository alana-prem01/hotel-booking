import express from 'express';
import {
  getUserProfile,
  getUserBookings,
  cancelBooking,
  createBooking,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.route('/bookings').get(protect, getUserBookings).post(protect, createBooking);
router.put('/bookings/:id/cancel', protect, cancelBooking);

export default router;
