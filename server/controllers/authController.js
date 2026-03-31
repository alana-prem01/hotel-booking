import User from '../models/User.js';
import Owner from '../models/Owner.js';
import generateToken from '../utils/generateToken.js';
import argon2 from 'argon2';
import mongoose from 'mongoose';

// @desc    Auth user/admin & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;
    if (role === 'owner') {
      user = await Owner.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await argon2.verify(user.password, password);

    if (isMatch) {
      if (user.isBlocked) {
        return res.status(403).json({ message: 'Account blocked by owner' });
      }

      generateToken(res, user._id, user.role || role);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || role,
        ...(role === 'owner' && { status: user.status }),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await argon2.hash(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      console.log(`New user registered: ${user.email} in DB: ${mongoose.connection.db.databaseName}`);
      generateToken(res, user._id, user.role);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new owner
// @route   POST /api/auth/register-owner
// @access  Public
export const registerOwner = async (req, res) => {
  const { name, email, password, companyName, contactNumber } = req.body;

  try {
    const ownerExists = await Owner.findOne({ email });
    if (ownerExists) {
      return res.status(400).json({ message: 'Owner already exists' });
    }

    const hashedPassword = await argon2.hash(password);

    const owner = await Owner.create({
      name,
      email,
      password: hashedPassword,
      companyName,
      contactNumber,
      // status will default to 'pending'
    });

    if (owner) {
      generateToken(res, owner._id, 'owner');
      res.status(201).json({
        _id: owner._id,
        name: owner.name,
        email: owner.email,
        role: 'owner',
        status: owner.status,
      });
    } else {
      res.status(400).json({ message: 'Invalid owner data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Logout user/owner/admin
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
