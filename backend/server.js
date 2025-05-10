const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const connectDB = require('./config/db');
const fetchDataService = require('./services/fetchDataService');
require('dotenv').config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/water-levels', require('./routes/waterLevelRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Flood Monitoring API is running...');
});

// Set up cron job to fetch water level data every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  console.log('Running scheduled task: Fetching water level data...');
  try {
    const results = await fetchDataService.fetchAllLocations();
    console.log('Data fetch results:', results);
  } catch (error) {
    console.error('Scheduled task error:', error);
  }
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initial data fetch on server start
(async () => {
  try {
    console.log('Performing initial data fetch...');
    await fetchDataService.fetchAllLocations();
    console.log('Initial data fetch completed');
  } catch (error) {
    console.error('Initial data fetch failed:', error);
  }
})();