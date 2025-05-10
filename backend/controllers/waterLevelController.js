const WaterLevel = require('../models/WaterLevel');
const fetchDataService = require('../services/fetchDataService');

// @route   GET api/water-levels/latest
// @desc    Get latest water levels for all locations
// @access  Public
exports.getLatestWaterLevels = async (req, res) => {
  try {
    // Get latest records for each location
    const kaluGanga = await WaterLevel.findOne({ location: 'Kalu Ganga (Ratnapura)' })
      .sort({ timestamp: -1 });
    
    const kukuleGanga = await WaterLevel.findOne({ location: 'Kukule Ganga (Kalawana)' })
      .sort({ timestamp: -1 });
    
    const results = {
      'Kalu Ganga (Ratnapura)': kaluGanga,
      'Kukule Ganga (Kalawana)': kukuleGanga
    };
    
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/water-levels/history/:location
// @desc    Get water level history for a specific location
// @access  Public
exports.getWaterLevelHistory = async (req, res) => {
  try {
    const { location } = req.params;
    const { hours = 24 } = req.query;
    
    // Validate location
    if (!['Kalu Ganga (Ratnapura)', 'Kukule Ganga (Kalawana)'].includes(location)) {
      return res.status(400).json({ msg: 'Invalid location' });
    }
    
    // Get data for specified hours
    const waterLevels = await WaterLevel.find({ location })
      .sort({ timestamp: -1 })
      .limit(parseInt(hours));
    
    res.json(waterLevels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/water-levels/fetch
// @desc    Fetch latest data from external APIs
// @access  Private/Admin
exports.fetchLatestData = async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ msg: 'Not authorized as admin' });
    }
    
    const results = await fetchDataService.fetchAllLocations();
    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET api/water-levels/chart-data/:location
// @desc    Get formatted chart data for a location
// @access  Public
exports.getChartData = async (req, res) => {
  try {
    const { location } = req.params;
    const { hours = 24 } = req.query;
    
    // Validate location
    if (!['Kalu Ganga (Ratnapura)', 'Kukule Ganga (Kalawana)'].includes(location)) {
      return res.status(400).json({ msg: 'Invalid location' });
    }
    
    // Get water level data
    const waterLevels = await WaterLevel.find({ location })
      .sort({ timestamp: 1 })
      .limit(parseInt(hours));
    
    // Format data for chart
    const chartData = {
      timestamps: waterLevels.map(record => record.timestamp),
      levels: waterLevels.map(record => record.level),
      statuses: waterLevels.map(record => record.status)
    };
    
    res.json(chartData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};