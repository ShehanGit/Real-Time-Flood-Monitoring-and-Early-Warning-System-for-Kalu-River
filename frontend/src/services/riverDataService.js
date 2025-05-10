import axios from 'axios';

const RIVER_API_BASE_URL = 'https://rivernet.lk/_kaluganga-overview/server/api';

// Create an axios instance specifically for the river API
const riverApi = axios.create({
  baseURL: RIVER_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get the last 24 hours of water level data for a specific device
 * @param {string} deviceId - The device ID (e.g., 'I97' for Kalu Ganga Ratnapura)
 * @returns {Promise<Object>} The water level data
 */
export const getWaterLevelData = async (deviceId = 'I97') => {
  try {
    const response = await riverApi.get(`/preprocessed-24h?device=${deviceId}`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching water level data:', error);
    throw error;
  }
};

/**
 * Get the device mappings for locations
 */
export const deviceMappings = {
  'Kalu Ganga (Ratnapura)': 'I97',
  'Kukule Ganga (Kalawana)': 'ID6'
};

/**
 * Get the location name from device ID
 */
export const getLocationFromDeviceId = (deviceId) => {
  const entries = Object.entries(deviceMappings);
  for (const [location, id] of entries) {
    if (id === deviceId) {
      return location;
    }
  }
  return 'Unknown Location';
};

/**
 * Transform the API data into a format suitable for Chart.js
 */
export const transformDataForChart = (data) => {
  if (!data || !data.chartOptions || !data.chartOptions.series || data.chartOptions.series.length === 0) {
    return null;
  }

  const series = data.chartOptions.series[0];
  const startTime = series.pointStart;
  const interval = series.pointInterval || 60000; // Default to 1 minute in milliseconds
  
  const timestamps = series.data.map((_, index) => new Date(startTime + (index * interval)));
  const levels = series.data;

  // Get flood level thresholds from the chart options
  const plotLines = data.chartOptions.yAxis?.plotLines || [];
  const thresholds = {};
  
  plotLines.forEach(line => {
    if (line.label?.text) {
      const match = line.label.text.match(/(.*)\s+\((\d+\.\d+)m\)/);
      if (match) {
        const name = match[1].trim();
        thresholds[name] = {
          value: line.value,
          color: line.color
        };
      }
    }
  });

  return {
    timestamps,
    levels,
    thresholds
  };
};

/**
 * Determine the flood status based on current level and thresholds
 */
export const getFloodStatus = (currentLevel, thresholds) => {
  if (currentLevel >= thresholds['Critical Flood Level']?.value) {
    return { status: 'Critical', color: thresholds['Critical Flood Level'].color };
  } else if (currentLevel >= thresholds['Major Flood Level']?.value) {
    return { status: 'Major Flood', color: thresholds['Major Flood Level'].color };
  } else if (currentLevel >= thresholds['Minor Flood Level']?.value) {
    return { status: 'Minor Flood', color: thresholds['Minor Flood Level'].color };
  } else if (currentLevel >= thresholds['Alert Flood Level']?.value) {
    return { status: 'Alert', color: thresholds['Alert Flood Level'].color };
  } else {
    return { status: 'Normal', color: '#44518C' };
  }
};

export default {
  getWaterLevelData,
  deviceMappings,
  getLocationFromDeviceId,
  transformDataForChart,
  getFloodStatus
};