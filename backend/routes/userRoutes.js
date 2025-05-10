const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('phone', 'Phone number is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    check('location', 'Location is required').isIn(['Kalu Ganga (Ratnapura)', 'Kukule Ganga (Kalawana)'])
  ],
  userController.registerUser
);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  userController.loginUser
);

// @route   GET api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, userController.getCurrentUser);

// @route   PUT api/users/me
// @desc    Update user profile
// @access  Private
router.put(
  '/me',
  [
    auth,
    [
      check('name', 'Name is required').optional(),
      check('phone', 'Phone number is required').optional(),
      check('location', 'Location must be valid').optional().isIn(['Kalu Ganga (Ratnapura)', 'Kukule Ganga (Kalawana)']),
      check('alertThreshold', 'Alert threshold must be a positive number').optional().isFloat({ min: 0 })
    ]
  ],
  userController.updateUser
);

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', auth, userController.getAllUsers);

// @route   DELETE api/users/:id
// @desc    Delete a user (admin only)
// @access  Private/Admin
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;