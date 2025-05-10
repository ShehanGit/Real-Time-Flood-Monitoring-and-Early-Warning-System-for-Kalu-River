const mongoose = require('mongoose');

const WaterLevelSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    enum: ['Kalu Ganga (Ratnapura)', 'Kukule Ganga (Kalawana)']
  },
  level: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Normal', 'Alert', 'Minor Flood', 'Major Flood', 'Critical'],
    required: true
  }
});

// Create compound index for efficient querying
WaterLevelSchema.index({ location: 1, timestamp: -1 });

module.exports = mongoose.model('WaterLevel', WaterLevelSchema);