const express = require('express');
const router = express.Router();
const waterLevelController = require('../controllers/waterLevelController');
const User = require('../models/User');
const emailService = require('../services/emailService');
const auth = require('../middleware/auth');

// @route   GET api/water-levels/latest
// @desc    Get latest water levels for all locations
// @access  Public
router.get('/latest', waterLevelController.getLatestWaterLevels);

// @route   GET api/water-levels/history/:location
// @desc    Get water level history for a specific location
// @access  Public
router.get('/history/:location', waterLevelController.getWaterLevelHistory);

// @route   POST api/water-levels/fetch
// @desc    Fetch latest data from external APIs
// @access  Private/Admin
router.post('/fetch', auth, waterLevelController.fetchLatestData);

// @route   GET api/water-levels/chart-data/:location
// @desc    Get formatted chart data for a location
// @access  Public
router.get('/chart-data/:location', waterLevelController.getChartData);

// @route   POST api/water-levels/test-notifications
// @desc    Test notification system with simulated water levels
// @access  Private/Admin
router.post('/test-notifications', auth, async (req, res) => {
  try {
    // Ensure user is admin
    // if (!req.user.isAdmin) {
    //   return res.status(403).json({ msg: 'Not authorized as admin' });
    // }
    
    const { level = 9.6, location = 'Kalu Ganga (Ratnapura)' } = req.body;
    
    // Find users who would be notified based on threshold
    const users = await User.find({
      location: location,
      alertThreshold: { $lte: level }
    });
    
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'No users found matching the criteria. No emails sent.',
        criteria: { location, level }
      });
    }
    
    // Track results
    const results = [];
    
    // Send test emails
    for (const user of users) {
      // Determine if user should be notified (based on time)
      const now = new Date();
      const lastNotified = user.lastNotified;
      const hoursSinceLastNotification = lastNotified ? 
        (now - lastNotified) / (1000 * 60 * 60) : null;
      
      const shouldNotify = !lastNotified || hoursSinceLastNotification >= 4;
      
      if (shouldNotify) {
        // Send email
        await emailService.sendFloodAlert(user, level, location);
        
        // Update last notified time
        await User.findByIdAndUpdate(user._id, { lastNotified: now });
        
        results.push({
          user: user.email,
          notified: true,
          reason: 'Time criteria met'
        });
      } else {
        results.push({
          user: user.email,
          notified: false,
          reason: `Last notified ${hoursSinceLastNotification.toFixed(2)} hours ago (< 4 hours)`
        });
      }
    }
    
    res.json({
      success: true,
      message: `Test completed. ${results.filter(r => r.notified).length} of ${users.length} users were notified.`,
      results
    });
  } catch (err) {
    console.error('Test notification error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;