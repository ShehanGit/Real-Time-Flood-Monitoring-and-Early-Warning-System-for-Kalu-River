# Real-Time Flood Monitoring and Early Warning System for Kalu River

![Flood Monitoring System Banner](https://via.placeholder.com/1200x300/3498db/ffffff?text=Kalu+River+Flood+Monitoring+System)

A comprehensive web-based system for monitoring water levels in the Kalu River, Sri Lanka, and sending automated alerts to registered users when flood conditions are detected. This system provides real-time data visualization and early warnings to help protect lives and property.

## Features

- **Real-time Water Level Monitoring**: Displays current water levels from multiple monitoring stations
- **Interactive Dashboard**: Visual representation of water level data with historical charts
- **Automated Alert System**: Send notifications when water levels exceed user-defined thresholds
- **User Registration System**: Allows users to register for alerts with customizable thresholds
- **Multiple Monitoring Locations**: Support for various monitoring stations along the Kalu River
- **Responsive Design**: Accessible on desktop and mobile devices

## Technologies Used

### Backend
- **Node.js + Express.js**: Server framework
- **MongoDB**: Database for user information and historical water level data
- **JWT**: Authentication and authorization
- **Nodemailer**: Email notification service
- **Node-cron**: Scheduled tasks for data fetching and alerts

### Frontend
- **React.js**: UI library
- **Vite**: Build tool
- **Chart.js**: Data visualization
- **React Router**: Navigation
- **Axios**: API requests

## Data Source

This system uses real-time data from the [RiverNet](https://rivernet.lk/) API, which provides water level readings from monitoring stations along the Kalu River in Sri Lanka.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB
- Email account for sending alerts (Gmail recommended)

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/yourusername/kalu-river-flood-monitoring.git
cd kalu-river-flood-monitoring
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   MONGO_URI=mongodb+srv://your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000

   # Email configuration
   EMAIL_USER=your.email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_SERVICE=gmail

   # Water level thresholds (in meters)
   ALERT_LEVEL=5.2
   MINOR_FLOOD_LEVEL=7.5
   MAJOR_FLOOD_LEVEL=9.5
   CRITICAL_FLOOD_LEVEL=10.5

   # API endpoints
   KALU_GANGA_RATNAPURA_API=https://rivernet.lk/_kaluganga-overview/server/api/preprocessed-24h?device=I97
   KUKULE_GANGA_KALAWANA_API=https://rivernet.lk/_kaluganga-overview/server/api/preprocessed-24h?device=ID6
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_ALERT_LEVEL=5.2
   VITE_MINOR_FLOOD_LEVEL=7.5
   VITE_MAJOR_FLOOD_LEVEL=9.5
   VITE_CRITICAL_FLOOD_LEVEL=10.5
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Access the application at: `http://localhost:3000`

## Application Structure

### Backend

```
backend/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── middleware/      # Authentication middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── .env             # Environment variables
└── server.js        # Entry point
```

### Frontend

```
frontend/
├── public/          # Static assets
├── src/
│   ├── assets/      # Images and resources
│   ├── components/  # Reusable UI components
│   ├── context/     # Context API (auth)
│   ├── pages/       # Application pages
│   ├── services/    # API integration
│   ├── styles/      # CSS stylesheets
│   ├── App.jsx      # Main component
│   └── main.jsx     # Entry point
└── .env             # Environment variables
```

## Key Components

### User Registration & Alerts

Users can register by providing:
- Name, email, and contact information
- Preferred location for monitoring
- Custom alert threshold (water level at which they want to be notified)

### Water Level Monitoring

The system monitors water levels and categorizes them into:
- **Normal**: Below alert level
- **Alert**: >= 5.2m (Be aware of rising water)
- **Minor Flood**: >= 7.5m (Some low-lying areas may be affected)
- **Major Flood**: >= 9.5m (Significant flooding, prepare to evacuate)
- **Critical**: >= 10.5m (Severe flooding, immediate evacuation advised)

### Alert System

- Notifications are sent when water levels exceed a user's set threshold
- The system implements a 4-hour cooldown period between alerts to prevent notification spam
- Initial alerts are sent on server startup if water levels are already high

## API Endpoints

### User Management

- `POST /api/users`: Register a new user
- `POST /api/users/login`: User login
- `GET /api/users/me`: Get current user profile
- `PUT /api/users/me`: Update user profile
- `GET /api/users`: Get all users (admin only)
- `DELETE /api/users/:id`: Delete a user (admin only)

### Water Level Data

- `GET /api/water-levels/latest`: Get latest water levels
- `GET /api/water-levels/history/:location`: Get water level history
- `POST /api/water-levels/fetch`: Manually fetch latest data (admin only)
- `GET /api/water-levels/chart-data/:location`: Get formatted chart data

## Future Enhancements

- Mobile app integration
- Predictive flood modeling using historical data
- Support for additional river systems and locations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

- Shehan Vinod (https://github.com/yourusername)

## Acknowledgments

- [RiverNet](https://rivernet.lk/) for providing the water level data API
- [Disaster Management Centre of Sri Lanka](https://www.dmc.gov.lk/) for flood level thresholds and guidelines
