import express from 'express';
import {
  getOwnerDashboardStats,
  createHotel,
  getOwnerHotels,
  addRoomToHotel,
  getOwnerBookings,
  uploadImage,
  updateHotel,
  deleteHotel,
  deleteRoom,
} from '../controllers/ownerController.js';
import { protect, owner } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, owner, getOwnerDashboardStats);
router.route('/hotels').get(protect, owner, getOwnerHotels).post(protect, owner, createHotel);
router.route('/hotels/:id').put(protect, owner, updateHotel).delete(protect, owner, deleteHotel);
router.post('/hotels/:id/rooms', protect, owner, addRoomToHotel);
router.post('/upload', protect, owner, upload.single('image'), uploadImage);
router.get('/bookings', protect, owner, getOwnerBookings);
router.delete('/rooms/:id', protect, owner, deleteRoom);

export default router;
