import express from 'express';
import {
  login,
  registerUser,
  registerOwner,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', registerUser);
router.post('/register-owner', registerOwner);
router.post('/logout', logout);

export default router;
