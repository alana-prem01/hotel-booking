import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Owner from '../models/Owner.js';

export const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role === 'owner') {
        req.user = await Owner.findById(decoded.id).select('-password');
        if (req.user) req.user.role = 'owner';
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (req.user && req.user.isBlocked) {
        res.cookie('jwt', '', {
          httpOnly: true,
          expires: new Date(0),
        });
        return res.status(403).json({ message: 'Account blocked by owner' });
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

export const owner = (req, res, next) => {
  if (req.user && req.user.role === 'owner') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an owner' });
  }
};
