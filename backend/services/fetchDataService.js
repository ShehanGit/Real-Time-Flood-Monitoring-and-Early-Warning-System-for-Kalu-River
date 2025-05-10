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

// Check if user should be notified (based on time since last notification)
const shouldNotifyUser = (user) => {
  // If user has never been notified, should notify
  if (!user.lastNotified) {
    return true;
  }
  
  // Calculate time difference in hours since last notification
  const now = new Date();
  const hoursSinceLastNotification = (now - user.lastNotified) / (1000 * 60 * 60);
  
  // Only notify if it's been at least 4 hours since last notification
  return hoursSinceLastNotification >= 4;
};

// Update user's last notified timestamp
const updateUserNotificationTime = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    lastNotified: new Date()
  });
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
        
        // If water level exceeds alert threshold, notify eligible users
        if (currentLevel >= process.env.ALERT_LEVEL) {
          // Find users who need to be notified based on location and threshold
          const users = await User.find({ 
            location: locationName,
            alertThreshold: { $lte: currentLevel }
          });
          
          // Send notifications to eligible users
          let notifiedUsers = 0;
          for (const user of users) {
            // Check if this user should be notified based on time restrictions
            if (shouldNotifyUser(user)) {
              await emailService.sendFloodAlert(user, currentLevel, locationName);
              await updateUserNotificationTime(user._id);
              notifiedUsers++;
            }
          }
          
          console.log(`${notifiedUsers} users notified about high water levels at ${locationName}`);
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