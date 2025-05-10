import { FaExclamationTriangle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import '../styles/AlertLevelIndicator.css';

const AlertLevelIndicator = ({ level, thresholds = {} }) => {
  // Default values if not provided in props
  const ALERT_LEVEL = thresholds.ALERT_LEVEL || parseFloat(import.meta.env.VITE_ALERT_LEVEL || '5.2');
  const MINOR_FLOOD_LEVEL = thresholds.MINOR_FLOOD_LEVEL || parseFloat(import.meta.env.VITE_MINOR_FLOOD_LEVEL || '7.5');
  const MAJOR_FLOOD_LEVEL = thresholds.MAJOR_FLOOD_LEVEL || parseFloat(import.meta.env.VITE_MAJOR_FLOOD_LEVEL || '9.5');
  const CRITICAL_FLOOD_LEVEL = thresholds.CRITICAL_FLOOD_LEVEL || parseFloat(import.meta.env.VITE_CRITICAL_FLOOD_LEVEL || '10.5');

  // Determine status based on water level
  let status = 'Normal';
  let statusClass = 'alert-normal';
  let iconClass = 'alert-icon-normal';
  let fillClass = 'gauge-fill-normal';
  let progressClass = 'progress-fill-normal';
  let icon = <FaCheckCircle className="alert-icon" />;
  let progress = (level / CRITICAL_FLOOD_LEVEL) * 100;
  
  // Set fill percentage for the gauge
  const fillPercent = `${progress > 100 ? 100 : progress}%`;
  const fillStyle = { '--fill-percent': fillPercent };

  if (level >= CRITICAL_FLOOD_LEVEL) {
    status = 'CRITICAL FLOOD';
    statusClass = 'alert-critical';
    iconClass = 'alert-icon-critical';
    fillClass = 'gauge-fill-critical';
    progressClass = 'progress-fill-critical';
    icon = <FaExclamationTriangle className="alert-icon" />;
  } else if (level >= MAJOR_FLOOD_LEVEL) {
    status = 'MAJOR FLOOD';
    statusClass = 'alert-major';
    iconClass = 'alert-icon-major';
    fillClass = 'gauge-fill-major';
    progressClass = 'progress-fill-major';
    icon = <FaExclamationTriangle className="alert-icon" />;
  } else if (level >= MINOR_FLOOD_LEVEL) {
    status = 'MINOR FLOOD';
    statusClass = 'alert-minor';
    iconClass = 'alert-icon-minor';
    fillClass = 'gauge-fill-minor';
    progressClass = 'progress-fill-minor';
    icon = <FaExclamationCircle className="alert-icon" />;
  } else if (level >= ALERT_LEVEL) {
    status = 'ALERT';
    statusClass = 'alert-alert';
    iconClass = 'alert-icon-alert';
    fillClass = 'gauge-fill-alert';
    progressClass = 'progress-fill-alert';
    icon = <FaExclamationCircle className="alert-icon" />;
  }

  return (
    <div className={`alert-indicator ${statusClass}`}>
      <div className="alert-content">
        <div className="alert-info">
          <div className={iconClass}>
            {icon}
          </div>
          <div className="alert-text">
            <h3>{status}</h3>
            <p>Current Level: <span className="alert-level">{level.toFixed(2)} meters</span></p>
          </div>
        </div>
        
        <div className="alert-gauge">
          <div className="gauge-circle">
            <div 
              className={`gauge-fill ${fillClass}`}
              style={fillStyle}
            ></div>
            <span className="gauge-value">{level.toFixed(1)}</span>
          </div>
          <span className="gauge-label">meters</span>
        </div>
      </div>
      
      <div className="alert-progress">
        <div className="progress-bar">
          <div 
            className={`progress-fill ${progressClass}`}
            style={{ width: `${progress > 100 ? 100 : progress}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>0m</span>
          <span>{ALERT_LEVEL}m</span>
          <span>{MINOR_FLOOD_LEVEL}m</span>
          <span>{MAJOR_FLOOD_LEVEL}m</span>
          <span>{CRITICAL_FLOOD_LEVEL}m</span>
        </div>
      </div>
    </div>
  );
};

export default AlertLevelIndicator;