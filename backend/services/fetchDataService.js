const axios = require('axios');
const WaterLevel = require('../models/WaterLevel');
const User = require('../models/User');
const emailService = require('./emailService');
require('dotenv').config();

// Determine water level status
const getWaterLevelStatus = (level) => {
  if (level >= process.env.CRITICAL_FLOOD_LEVEL) {
    return 'Critical';
  } else if (level >= process.env.MAJOR_FLOOD_LEVEL) {
    return 'Major Flood';
  } else if (level >= process.env.MINOR_FLOOD_LEVEL) {
    return 'Minor Flood';
  } else if (level >= process.env.ALERT_LEVEL) {
    return 'Alert';
  } else {
    return 'Normal';
  }
};

// Fetch water level data from external API
const fetchWaterLevelData = async (locationName, apiUrl) => {
  try {
    const response = await axios.get(apiUrl);
    
    if (response.data && response.data.results) {
      const { latest } = response.data.results;
      
      if (latest && latest.level !== undefined) {
        const currentLevel = latest.level;
        const status = getWaterLevelStatus(currentLevel);
        const timestamp = new Date();
        
        // Save to database
        const waterLevel = new WaterLevel({
          location: locationName,
          level: currentLevel,
          timestamp,
          status
        });
        
        await waterLevel.save();
        
        // If water level exceeds alert threshold, notify users
        if (currentLevel >= process.env.ALERT_LEVEL) {
          // Find users who need to be notified
          const users = await User.find({ 
            location: locationName,
            alertThreshold: { $lte: currentLevel }
          });
          
          // Send notifications
          for (const user of users) {
            await emailService.sendFloodAlert(user, currentLevel, locationName);
          }
        }
        
        return {
          success: true,
          data: {
            location: locationName,
            level: currentLevel,
            timestamp,
            status
          }
        };
      }
    }
    
    throw new Error('Invalid data format from API');
  } catch (error) {
    console.error(`Error fetching data for ${locationName}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// Fetch water level for all locations
const fetchAllLocations = async () => {
  const results = {};
  
  // Fetch Kalu Ganga (Ratnapura)
  results['Kalu Ganga (Ratnapura)'] = await fetchWaterLevelData(
    'Kalu Ganga (Ratnapura)',
    process.env.KALU_GANGA_RATNAPURA_API
  );
  
  // Fetch Kukule Ganga (Kalawana)
  results['Kukule Ganga (Kalawana)'] = await fetchWaterLevelData(
    'Kukule Ganga (Kalawana)',
    process.env.KUKULE_GANGA_KALAWANA_API
  );
  
  return results;
};

// Get recent water levels for a location
const getRecentWaterLevels = async (location, limit = 24) => {
  try {
    return await WaterLevel.find({ location })
      .sort({ timestamp: -1 })
      .limit(limit);
  } catch (error) {
    console.error('Error fetching recent water levels:', error);
    throw error;
  }
};

module.exports = {
  fetchWaterLevelData,
  fetchAllLocations,
  getRecentWaterLevels
};