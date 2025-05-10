const express = require('express');
const router = express.Router();
const waterLevelController = require('../controllers/waterLevelController');
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

module.exports = router;