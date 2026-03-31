import express from 'express';
import {
  getAdminDashboardStats,
  getAllUsers,
  toggleBlockUser,
  getAllOwners,
  updateOwnerStatus,
  toggleBlockOwner,
  getAllHotels,
  getAllBookings,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getAdminDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, toggleBlockUser);
router.get('/owners', protect, admin, getAllOwners);
router.put('/owners/:id/status', protect, admin, updateOwnerStatus);
router.put('/owners/:id/block', protect, admin, toggleBlockOwner);
router.get('/hotels', protect, admin, getAllHotels);
router.get('/bookings', protect, admin, getAllBookings);

export default router;
