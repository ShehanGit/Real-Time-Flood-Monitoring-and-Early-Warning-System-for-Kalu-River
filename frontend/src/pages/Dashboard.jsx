import { useState, useEffect } from 'react';
import { FaSync, FaDownload, FaExclamationTriangle, FaChartLine, FaWater, FaBell, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getWaterLevelData, deviceMappings, transformDataForChart, getFloodStatus } from '../services/riverDataService';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [selectedDevice, setSelectedDevice] = useState('I97'); // Default to Kalu Ganga (Ratnapura)
  const [deviceData, setDeviceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(24);
  
  // Transform device mappings for select dropdown
  const locationOptions = Object.entries(deviceMappings).map(([location, id]) => ({
    label: location,
    value: id
  }));
  
  // Fetch data on component mount and when selected device changes
  useEffect(() => {
    fetchWaterLevelData();
    // Set up interval to fetch data every 5 minutes
    const interval = setInterval(fetchWaterLevelData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedDevice]);
  
  // Fetch water level data from the API
  const fetchWaterLevelData = async () => {
    try {
      setRefreshing(true);
      const data = await getWaterLevelData(selectedDevice);
      setDeviceData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching water level data:', err);
      setError('Failed to fetch water level data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Handle device change
  const handleDeviceChange = (e) => {
    setSelectedDevice(e.target.value);
    setLoading(true);
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    setLoading(true);
    fetchWaterLevelData();
  };
  
  // Export data as CSV
  const handleExportCSV = () => {
    if (!deviceData || !deviceData.chartOptions || !deviceData.chartOptions.series) {
      return;
    }
    
    const series = deviceData.chartOptions.series[0];
    const locationName = series.name;
    const startTime = series.pointStart;
    const interval = series.pointInterval;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Timestamp,Water Level (m)\n';
    
    series.data.forEach((level, index) => {
      const timestamp = new Date(startTime + (index * interval));
      csvContent += `"${timestamp.toLocaleString()}",${level}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${locationName.replace(/\s+/g, '-')}-water-levels-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Get current flood status and info
  const getCurrentStatus = () => {
    if (!deviceData || !deviceData.latest) {
      return { level: 0, status: 'Unknown', color: '#gray' };
    }
    
    const currentLevel = deviceData.latest.level;
    const chartOptions = deviceData.chartOptions;
    
    if (!chartOptions || !chartOptions.yAxis || !chartOptions.yAxis.plotLines) {
      return { level: currentLevel, status: 'Unknown', color: '#gray' };
    }
    
    const thresholds = {};
    chartOptions.yAxis.plotLines.forEach(line => {
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
    
    // Determine status
    if (currentLevel >= thresholds['Critical Flood Level']?.value) {
      return { level: currentLevel, status: 'Critical', color: thresholds['Critical Flood Level'].color };
    } else if (currentLevel >= thresholds['Major Flood Level']?.value) {
      return { level: currentLevel, status: 'Major Flood', color: thresholds['Major Flood Level'].color };
    } else if (currentLevel >= thresholds['Minor Flood Level']?.value) {
      return { level: currentLevel, status: 'Minor Flood', color: thresholds['Minor Flood Level'].color };
    } else if (currentLevel >= thresholds['Alert Flood Level']?.value) {
      return { level: currentLevel, status: 'Alert', color: thresholds['Alert Flood Level'].color };
    } else {
      return { level: currentLevel, status: 'Normal', color: '#44518C' };
    }
  };
  
  // Extract and format latest time from data
  const getLatestTime = () => {
    if (!deviceData || !deviceData.latest || !deviceData.latest.time) {
      return 'N/A';
    }
    
    const timeStr = deviceData.latest.time;
    const date = new Date(timeStr);
    
    // Check if it's a valid date
    if (isNaN(date.getTime())) {
      // Try to parse in format "YYYY-MM-DD HH:MM:SS"
      const parts = timeStr.split(' ');
      if (parts.length === 2) {
        const [datePart, timePart] = parts;
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        
        return new Date(year, month - 1, day, hour, minute).toLocaleString();
      }
      return timeStr; // Return as is if we can't parse it
    }
    
    return date.toLocaleString();
  };
  
  // Calculate trend from change indicator
  const getTrend = () => {
    if (!deviceData || !deviceData.latest || deviceData.latest.change === undefined) {
      return { direction: 'stable', label: 'Stable' };
    }
    
    const change = deviceData.latest.change;
    
    if (change > 0) {
      return { direction: 'rising', label: 'Rising', icon: <FaArrowUp className="trend-icon rising" /> };
    } else if (change < 0) {
      return { direction: 'falling', label: 'Falling', icon: <FaArrowDown className="trend-icon falling" /> };
    } else {
      return { direction: 'stable', label: 'Stable', icon: null };
    }
  };
  
  // Get chart data for the selected location
  const getChartData = () => {
    if (!deviceData || !deviceData.chartOptions || !deviceData.chartOptions.series) {
      return { labels: [], datasets: [] };
    }
    
    const series = deviceData.chartOptions.series[0];
    const startTime = series.pointStart;
    const interval = series.pointInterval;
    
    // Create labels and data arrays
    const labels = series.data.map((_, index) => {
      const timestamp = new Date(startTime + (index * interval));
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
    
    const datasets = [{
      label: series.name || 'Water Level',
      data: series.data,
      borderColor: series.color || '#44518C',
      backgroundColor: 'rgba(106, 127, 219, 0.1)',
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }];
    
    return { labels, datasets };
  };

  // Get threshold lines for the chart
  const getThresholdLines = () => {
    if (!deviceData || !deviceData.chartOptions || !deviceData.chartOptions.yAxis || !deviceData.chartOptions.yAxis.plotLines) {
      return [];
    }
    
    return deviceData.chartOptions.yAxis.plotLines.map(line => ({
      y: line.value,
      borderColor: line.color,
      borderWidth: line.width,
      borderDash: line.dashStyle === 'solid' ? [] : [5, 5],
      label: {
        content: line.label?.text || '',
        position: 'left',
        enabled: true
      }
    }));
  };
  
  // Current status
  const currentStatus = getCurrentStatus();
  const trend = getTrend();
  const chartData = getChartData();
  
  // Helper function to calculate percentage for gauge
  const calculateGaugePercentage = () => {
    if (!deviceData || !deviceData.chartOptions || !deviceData.chartOptions.yAxis) {
      return 0;
    }
    
    const currentLevel = deviceData.latest?.level || 0;
    const maxLevel = deviceData.chartOptions.yAxis.max || 11;
    return (currentLevel / maxLevel) * 100;
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Water Level Dashboard</h1>
          
          <div className="dashboard-controls">
            <div className="location-selector">
              <label>Location:</label>
              <select 
                value={selectedDevice}
                onChange={handleDeviceChange}
                className="location-select"
              >
                {locationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="dashboard-actions">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="dashboard-btn refresh-btn"
                title="Refresh data"
              >
                <FaSync className={refreshing ? 'spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button
                onClick={handleExportCSV}
                className="dashboard-btn export-btn"
                title="Export data as CSV"
              >
                <FaDownload />
                Export
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading water level data...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <FaExclamationTriangle className="error-icon" />
            <p>{error}</p>
            <button className="dashboard-btn refresh-btn" onClick={handleRefresh}>
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="status-panel">
              <div className="current-status" style={{ borderColor: currentStatus.color }}>
                <div className="status-header" style={{ backgroundColor: currentStatus.color }}>
                  <h2>Current Status: {currentStatus.status}</h2>
                </div>
                <div className="status-body">
                  <div className="status-info">
                    <div className="status-row">
                      <div className="status-label">
                        <FaMapMarkerAlt /> Location:
                      </div>
                      <div className="status-value">{deviceData.latest?.name || 'Unknown'}</div>
                    </div>
                    <div className="status-row">
                      <div className="status-label">
                        <FaWater /> Current Level:
                      </div>
                      <div className="status-value">
                        <span className="level-value">{currentStatus.level.toFixed(2)}</span> meters
                        {trend.icon && <span className="trend-indicator">{trend.icon} {trend.label}</span>}
                      </div>
                    </div>
                    <div className="status-row">
                      <div className="status-label">
                        <FaClock /> Last Updated:
                      </div>
                      <div className="status-value">{getLatestTime()}</div>
                    </div>
                    <div className="status-row">
                      <div className="status-label">
                        <FaBell /> Status:
                      </div>
                      <div className="status-value">
                        <span className="status-badge" style={{ backgroundColor: currentStatus.color }}>
                          {currentStatus.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="level-gauge">
                    <div className="gauge-container">
                      <div className="gauge-fill" style={{ 
                        height: `${calculateGaugePercentage()}%`,
                        backgroundColor: currentStatus.color
                      }}></div>
                      <div className="gauge-markers">
                        {deviceData.chartOptions?.yAxis?.plotLines?.map((line, index) => (
                          <div 
                            key={index}
                            className="gauge-marker"
                            style={{ 
                              bottom: `${(line.value / (deviceData.chartOptions.yAxis.max || 11)) * 100}%`,
                              backgroundColor: line.color
                            }}
                            title={line.label?.text || ''}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div className="gauge-labels">
                      <div className="gauge-min">0m</div>
                      <div className="gauge-max">{deviceData.chartOptions?.yAxis?.max || 11}m</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="chart-section">
              <div className="chart-header">
                <h2 className="chart-title">
                  <FaChartLine /> Water Level History
                </h2>
                <div className="chart-controls">
                  <label>View:</label>
                  <select 
                    value={timeRange}
                    onChange={(e) => setTimeRange(Number(e.target.value))}
                  >
                    <option value={6}>Last 6 hours</option>
                    <option value={12}>Last 12 hours</option>
                    <option value={24}>Last 24 hours</option>
                  </select>
                </div>
              </div>
              
              <div className="chart-container">
                {/* This is a placeholder for the chart visualization */}
                {/* In a real implementation, we would use Chart.js or a similar library */}
                <div className="chart-visualization">
                  <img 
                    src={`https://rivernet.lk/_kaluganga-overview/server/chart-png?loc=${deviceData.latest?.name || 'Kalu%20Ganga%20(Ratnapura)'}&width=1000&height=500&timeframe=24h`} 
                    alt="Water level chart" 
                    className="chart-image"
                  />
                </div>
                
                <div className="chart-legend">
                  {deviceData.chartOptions?.yAxis?.plotLines?.map((line, index) => (
                    <div key={index} className="legend-item">
                      <div className="legend-color" style={{ backgroundColor: line.color }}></div>
                      <div className="legend-label">{line.label?.text || ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <h2 className="info-title">Flood Level Information</h2>
              <div className="info-grid">
                <div>
                  <h3 className="info-section-title">Alert Levels:</h3>
                  <ul className="info-list">
                    {deviceData.chartOptions?.yAxis?.plotLines?.map((line, index) => (
                      <li key={index} style={{ color: line.color }}>
                        <span className="info-list-item-bold">{line.label?.text || ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="info-section-title">Safety Tips:</h3>
                  <ul className="info-list">
                    <li>Monitor official news and weather updates</li>
                    <li>Keep emergency supplies ready</li>
                    <li>Move important belongings to higher ground</li>
                    <li>Follow evacuation orders promptly</li>
                    <li>Never walk or drive through flood waters</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;