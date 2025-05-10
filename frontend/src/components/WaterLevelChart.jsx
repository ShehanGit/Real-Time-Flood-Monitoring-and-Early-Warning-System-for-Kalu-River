import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { getChartData } from '../services/api';
import '../styles/WaterLevelChart.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WaterLevelChart = ({ location, hoursToShow = 24 }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ALERT_LEVEL = import.meta.env.VITE_ALERT_LEVEL;
  const MINOR_FLOOD_LEVEL = import.meta.env.VITE_MINOR_FLOOD_LEVEL;
  const MAJOR_FLOOD_LEVEL = import.meta.env.VITE_MAJOR_FLOOD_LEVEL;
  const CRITICAL_FLOOD_LEVEL = import.meta.env.VITE_CRITICAL_FLOOD_LEVEL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getChartData(location, hoursToShow);
        
        // Format data for chart
        const formattedData = {
          labels: data.timestamps.map(timestamp => {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }),
          datasets: [
            {
              label: location,
              data: data.levels,
              fill: true,
              backgroundColor: 'rgba(106, 127, 219, 0.2)',
              borderColor: 'rgba(68, 81, 140, 1)',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 2,
              pointHoverRadius: 5
            }
          ]
        };
        
        setChartData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching chart data:', err);
        setError('Failed to load chart data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [location, hoursToShow]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: 'rgba(106, 127, 219, 0.1)'
        },
        ticks: {
          color: '#333',
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        min: 0,
        max: 11,
        grid: {
          color: 'rgba(106, 127, 219, 0.1)'
        },
        ticks: {
          color: '#333',
          font: {
            weight: 'bold'
          }
        },
        title: {
          display: true,
          text: 'Water Level (m)',
          color: '#333',
          font: {
            weight: 'bold',
            size: 14
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          weight: 'bold'
        },
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2) + ' m';
            }
            return label;
          }
        }
      }
    },
    annotation: {
      annotations: {
        alertLevel: {
          type: 'line',
          yMin: ALERT_LEVEL,
          yMax: ALERT_LEVEL,
          borderColor: '#a9ff6e',
          borderWidth: 2,
          label: {
            content: `Alert Level (${ALERT_LEVEL}m)`,
            enabled: true,
            position: 'right'
          }
        },
        minorFloodLevel: {
          type: 'line',
          yMin: MINOR_FLOOD_LEVEL,
          yMax: MINOR_FLOOD_LEVEL,
          borderColor: '#F9E973',
          borderWidth: 2,
          label: {
            content: `Minor Flood Level (${MINOR_FLOOD_LEVEL}m)`,
            enabled: true,
            position: 'right'
          }
        },
        majorFloodLevel: {
          type: 'line',
          yMin: MAJOR_FLOOD_LEVEL,
          yMax: MAJOR_FLOOD_LEVEL,
          borderColor: '#ff9b2b',
          borderWidth: 2,
          label: {
            content: `Major Flood Level (${MAJOR_FLOOD_LEVEL}m)`,
            enabled: true,
            position: 'right'
          }
        },
        criticalLevel: {
          type: 'line',
          yMin: CRITICAL_FLOOD_LEVEL,
          yMax: CRITICAL_FLOOD_LEVEL,
          borderColor: '#ec3e40',
          borderWidth: 2,
          label: {
            content: `Critical Level (${CRITICAL_FLOOD_LEVEL}m)`,
            enabled: true,
            position: 'right'
          }
        }
      }
    }
  };

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">{location} - Water Level Chart</h3>
      <div className="chart-container">
        {loading ? (
          <div className="chart-loading">
            <div className="chart-loading-spinner"></div>
            <span>Loading chart data...</span>
          </div>
        ) : error ? (
          <div className="chart-error">{error}</div>
        ) : (
          chartData && <Line data={chartData} options={chartOptions} />
        )}
      </div>
      
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-color alert-color"></div>
          <span>Alert Level: {ALERT_LEVEL}m</span>
        </div>
        <div className="legend-item">
          <div className="legend-color minor-color"></div>
          <span>Minor Flood: {MINOR_FLOOD_LEVEL}m</span>
        </div>
        <div className="legend-item">
          <div className="legend-color major-color"></div>
          <span>Major Flood: {MAJOR_FLOOD_LEVEL}m</span>
        </div>
        <div className="legend-item">
          <div className="legend-color critical-color"></div>
          <span>Critical: {CRITICAL_FLOOD_LEVEL}m</span>
        </div>
      </div>
    </div>
  );
};

export default WaterLevelChart;