import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaExclamationTriangle, FaMapMarkerAlt, FaUserPlus, FaTachometerAlt, FaWater, FaClock } from 'react-icons/fa';
import { getWaterLevelData, deviceMappings, getFloodStatus, transformDataForChart } from '../services/riverDataService';
import AlertLevelIndicator from '../components/AlertLevelIndicator';
import '../styles/Home.css';

const Home = () => {
  const [waterLevels, setWaterLevels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWaterLevels = async () => {
      try {
        setLoading(true);
        const results = {};
        
        // Fetch data for each location
        for (const [location, deviceId] of Object.entries(deviceMappings)) {
          try {
            const data = await getWaterLevelData(deviceId);
            results[location] = data;
          } catch (e) {
            console.error(`Error fetching data for ${location}:`, e);
            results[location] = null;
          }
        }
        
        setWaterLevels(results);
        setError(null);
      } catch (err) {
        console.error('Error fetching water levels:', err);
        setError('Failed to load water level data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchWaterLevels();
    
    // Refresh data every 10 minutes
    const interval = setInterval(fetchWaterLevels, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to determine status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'Critical': return 'status-critical';
      case 'Major Flood': return 'status-major';
      case 'Minor Flood': return 'status-minor';
      case 'Alert': return 'status-alert';
      default: return 'status-normal';
    }
  };
  
  // Helper to get the current status
  const getCurrentStatus = (data) => {
    if (!data || !data.latest) {
      return { level: 0, status: 'Unknown', color: '#gray' };
    }
    
    const currentLevel = data.latest.level;
    const chartOptions = data.chartOptions;
    
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

  return (
    <div className="home">
      <section className="home-hero">
        <div className="container home-hero-content">
          <div className="home-hero-text">
            <h1 className="home-hero-title">Real-Time Flood Monitoring & Early Warning System</h1>
            <p className="home-hero-subtitle">
              Stay informed about the Kalu River water levels and receive timely alerts 
              to protect yourself and your community from potential flooding.
            </p>
            <div className="home-hero-buttons">
              <Link 
                to="/register" 
                className="home-hero-btn register-hero-btn"
              >
                <FaUserPlus /> Register for Alerts
              </Link>
              <Link 
                to="/dashboard" 
                className="home-hero-btn dashboard-hero-btn"
              >
                <FaTachometerAlt /> View Dashboard
              </Link>
            </div>
          </div>
          <div className="home-hero-levels">
            <h2>Current Water Levels</h2>
            {loading ? (
              <div className="levels-loading">
                <div className="spinner"></div>
                <p>Loading latest data...</p>
              </div>
            ) : error ? (
              <div className="levels-error">
                <FaExclamationTriangle className="error-icon" />
                <p>{error}</p>
              </div>
            ) : (
              <div className="levels-list">
                {Object.entries(waterLevels).map(([location, data]) => {
                  if (!data || !data.latest) return null;
                  
                  const status = getCurrentStatus(data);
                  
                  return (
                    <div key={location} className="location-item">
                      <div className="location-header">
                        <FaMapMarkerAlt className="location-icon" />
                        <h3 className="location-name">{location}</h3>
                      </div>
                      <div className="location-data">
                        <div className="location-details">
                          <div className="location-level">
                            <FaWater className="level-icon" />
                            <span className="level-value">{data.latest.level.toFixed(2)} m</span>
                          </div>
                          <div className="location-time">
                            <FaClock className="time-icon" />
                            <span className="time-value">{data.latest.time}</span>
                          </div>
                        </div>
                        <div className={`location-status ${getStatusClass(status.status)}`} style={{ backgroundColor: status.color }}>
                          {status.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaInfoCircle />
              </div>
              <h3 className="feature-title">Real-Time Monitoring</h3>
              <p className="feature-desc">
                Our system continuously monitors water levels at key locations along the Kalu River, 
                providing up-to-the-minute data on current conditions.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaExclamationTriangle />
              </div>
              <h3 className="feature-title">Early Warnings</h3>
              <p className="feature-desc">
                Receive timely alerts via email when water levels approach or exceed 
                dangerous thresholds, giving you critical time to prepare.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaUserPlus />
              </div>
              <h3 className="feature-title">Personalized Alerts</h3>
              <p className="feature-desc">
                Register to set your own alert preferences based on your location and 
                specific needs, ensuring you get information that matters to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="latest-status">
        <div className="container">
          <h2 className="section-title">Latest Status</h2>
          
          {loading ? (
            <div className="status-loading">
              <div className="spinner"></div>
              <p>Loading latest data...</p>
            </div>
          ) : error ? (
            <div className="status-error">
              <FaExclamationTriangle className="error-icon" />
              <p>{error}</p>
            </div>
          ) : (
            <div className="status-grid">
              {Object.entries(waterLevels).map(([location, data]) => {
                if (!data || !data.latest) return null;
                
                // Create custom AlertLevelIndicator data
                const currentLevel = data.latest.level;
                const thresholds = {};
                
                if (data.chartOptions?.yAxis?.plotLines) {
                  data.chartOptions.yAxis.plotLines.forEach(line => {
                    if (line.label?.text) {
                      const match = line.label.text.match(/(.*)\s+\((\d+\.\d+)m\)/);
                      if (match) {
                        const level = parseFloat(match[2]);
                        switch (match[1].trim()) {
                          case 'Alert Flood Level':
                            thresholds['ALERT_LEVEL'] = level;
                            break;
                          case 'Minor Flood Level':
                            thresholds['MINOR_FLOOD_LEVEL'] = level;
                            break;
                          case 'Major Flood Level':
                            thresholds['MAJOR_FLOOD_LEVEL'] = level;
                            break;
                          case 'Critical Flood Level':
                            thresholds['CRITICAL_FLOOD_LEVEL'] = level;
                            break;
                        }
                      }
                    }
                  });
                }
                
                return (
                  <div key={location} className="status-card">
                    <h3 className="status-title">{location}</h3>
                    <div className="status-indicator">
                      <AlertLevelIndicator level={currentLevel} thresholds={thresholds} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;