const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Doctor } = require('../models');
const { authRateLimit, verifyToken } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register new user
router.post('/register', 
  authRateLimit,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
    body('phoneNumber').isMobilePhone().withMessage('Valid phone number is required'),
    body('role').isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
    body('dateOfBirth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role,
        dateOfBirth,
        gender,
        address,
        emergencyContact,
        preferredLanguage
      } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        where: { email }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists with this email'
        });
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        role,
        dateOfBirth,
        gender,
        address,
        emergencyContact,
        preferredLanguage: preferredLanguage || 'english'
      });

      // Generate token
      const token = generateToken(user.id);

      // Remove password from response
      const userResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        preferredLanguage: user.preferredLanguage,
        isActive: user.isActive,
        createdAt: user.createdAt
      };

      res.status(201).json({
        message: 'User registered successfully',
        user: userResponse,
        token,
        requiresProfile: role === 'doctor' // Indicate if doctor profile setup is needed
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        error: 'Failed to register user'
      });
    }
  }
);

// Login user
router.post('/login',
  authRateLimit,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 }).withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      // Find user with doctor profile if applicable
      const user = await User.findOne({
        where: { email },
        include: [{
          model: Doctor,
          as: 'doctorProfile',
          required: false
        }]
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          error: 'Account is deactivated. Please contact support.'
        });
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate token
      const token = generateToken(user.id);

      // Prepare user response
      const userResponse = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        preferredLanguage: user.preferredLanguage,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        doctorProfile: user.doctorProfile || null
      };

      res.json({
        message: 'Login successful',
        user: userResponse,
        token
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Failed to login'
      });
    }
  }
);

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userResponse = {
      id: req.user.id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
      dateOfBirth: req.user.dateOfBirth,
      gender: req.user.gender,
      address: req.user.address,
      emergencyContact: req.user.emergencyContact,
      preferredLanguage: req.user.preferredLanguage,
      profilePicture: req.user.profilePicture,
      isActive: req.user.isActive,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt,
      doctorProfile: req.user.doctorProfile || null
    };

    res.json({
      user: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile'
    });
  }
});

// Update user profile
router.put('/profile', 
  verifyToken,
  [
    body('firstName').optional().isLength({ min: 1 }),
    body('lastName').optional().isLength({ min: 1 }),
    body('phoneNumber').optional().isMobilePhone(),
    body('dateOfBirth').optional().isISO8601(),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('preferredLanguage').optional().isIn(['english', 'hindi'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const allowedFields = [
        'firstName', 'lastName', 'phoneNumber', 'dateOfBirth',
        'gender', 'address', 'emergencyContact', 'preferredLanguage'
      ];

      const updateData = {};
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      await req.user.update(updateData);

      const updatedUser = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Doctor,
          as: 'doctorProfile',
          required: false
        }]
      });

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });

    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({
        error: 'Failed to update profile'
      });
    }
  }
);

// Change password
router.put('/change-password',
  verifyToken,
  [
    body('currentPassword').isLength({ min: 1 }).withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password field
      const user = await User.findByPk(req.user.id);

      // Validate current password
      const isValidPassword = await user.validatePassword(currentPassword);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Current password is incorrect'
        });
      }

      // Update password
      await user.update({ password: newPassword });

      res.json({
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Password change error:', error);
      res.status(500).json({
        error: 'Failed to change password'
      });
    }
  }
);

// Logout (client should remove token)
router.post('/logout', verifyToken, (req, res) => {
  res.json({
    message: 'Logged out successfully'
  });
});

// Refresh token
router.post('/refresh', verifyToken, (req, res) => {
  try {
    const newToken = generateToken(req.user.id);
    
    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Failed to refresh token'
    });
  }
});

module.exports = router;