const jwt = require('jsonwebtoken');
const { User, Doctor } = require('../models');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const token = authHeader.substring(7);
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database with fresh data
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] },
      include: [{
        model: Doctor,
        as: 'doctorProfile',
        required: false
      }]
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }
    
    // Update last login
    await user.update({ lastLogin: new Date() });
    
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
};

// Check if user has required role
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

// Check if user is a doctor with verified profile
const requireVerifiedDoctor = async (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'doctor') {
      return res.status(403).json({ error: 'Doctor access required' });
    }
    
    if (!req.user.doctorProfile) {
      return res.status(403).json({ error: 'Doctor profile not found' });
    }
    
    if (!req.user.doctorProfile.isVerified) {
      return res.status(403).json({ error: 'Doctor profile not verified' });
    }
    
    next();
  } catch (error) {
    console.error('Verified doctor middleware error:', error);
    return res.status(500).json({ error: 'Authorization check failed' });
  }
};

// Check if user can access patient data
const canAccessPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    // Patients can access their own data
    if (req.user.role === 'patient' && req.user.id === patientId) {
      return next();
    }
    
    // Doctors can access assigned patients
    if (req.user.role === 'doctor') {
      // This would need to check if doctor has been assigned to this patient
      // For now, allowing all verified doctors
      if (req.user.doctorProfile && req.user.doctorProfile.isVerified) {
        return next();
      }
    }
    
    // Admins can access all patient data
    if (req.user.role === 'admin') {
      return next();
    }
    
    return res.status(403).json({ error: 'Cannot access this patient data' });
    
  } catch (error) {
    console.error('Patient access middleware error:', error);
    return res.status(500).json({ error: 'Access check failed' });
  }
};

// Rate limiting for specific routes
const createRateLimit = (windowMs, max, message) => {
  const rateLimit = require('express-rate-limit');
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific rate limits
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests
  'Too many API requests, please try again later'
);

module.exports = {
  verifyToken,
  requireRole,
  requireVerifiedDoctor,
  canAccessPatient,
  authRateLimit,
  apiRateLimit
};