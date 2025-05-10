# Real-Time Flood Monitoring and Early Warning System for Kalu River, Sri Lanka

![Kalu River Monitoring System](https://via.placeholder.com/800x400?text=Kalu+River+Monitoring+System)

## 📋 Overview

This project is a comprehensive real-time flood monitoring and early warning system designed specifically for the Kalu River in Sri Lanka. Using IoT sensors, real-time data processing, and advanced analytics, this system provides timely alerts to local communities and authorities to mitigate flood risks and enhance disaster preparedness.

## ⚠️ Problem Statement

The Kalu River basin in Sri Lanka is prone to frequent flooding during monsoon seasons, resulting in significant damage to properties, agriculture, and sometimes loss of lives. Traditional monitoring methods have proven inadequate for providing timely warnings to vulnerable communities. This system addresses these challenges by implementing a modern technology-driven solution.

## 🚀 Features

- **Real-time Water Level Monitoring**: Continuous tracking of water levels along various points of the Kalu River
- **Automated Alert System**: SMS, mobile app, and web-based notifications when critical thresholds are reached
- **Historical Data Analysis**: Track patterns and trends to improve prediction accuracy
- **User-friendly Dashboard**: Visualize current river conditions, forecasts, and alerts
- **Admin Management System**: Configure alert thresholds, manage sensor networks, and control system settings
- **API Integration**: Compatible with weather forecasting services and government disaster management systems
- **Multilingual Support**: Interface available in Sinhala, Tamil, and English

## 💻 Tech Stack

- **Frontend**: React.js with Vite, Redux for state management, Recharts for data visualization
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **Hosting**: AWS/Azure/Digital Ocean
- **DevOps**: Docker, GitHub Actions for CI/CD
- **Mobile App**: React Native (optional extension)

## 📊 System Architecture

```
┌─────────────────┐         ┌───────────────┐         ┌───────────────────┐
│                 │         │               │         │                   │
│  IoT Sensors &  │────────▶│  API Gateway  │────────▶│  Backend Services │
│  Data Sources   │         │               │         │                   │
│                 │         └───────────────┘         └─────────┬─────────┘
└─────────────────┘                                            │
                                                              │
                                                              ▼
                 ┌─────────────────────┐         ┌─────────────────────┐
                 │                     │         │                     │
                 │  Alert & Notification │◀────────│  Data Processing &  │
                 │       System        │         │     Analytics       │
                 │                     │         │                     │
                 └─────────┬───────────┘         └─────────▲───────────┘
                          │                               │
                          │                               │
                          ▼                               │
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────────┐
│                 │    │                 │    │                      │
│  Mobile App     │◀───│  Frontend       │────│  MongoDB Database    │
│  (React Native) │    │  (React + Vite) │    │                      │
│                 │    │                 │    │                      │
└─────────────────┘    └─────────────────┘    └──────────────────────┘
```

## 🔧 Installation

### Prerequisites
- Node.js (v16.x or higher)
- MongoDB
- npm or yarn

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/kalu-river-monitoring.git
cd kalu-river-monitoring

# Install backend dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other configurations

# Start the server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install frontend dependencies
npm install

# Start the development server
npm run dev
```

## 🌱 Environment Variables

Create a `.env` file in the backend directory with the following:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/flood-monitoring
JWT_SECRET=your_jwt_secret
SMS_API_KEY=your_sms_api_key
WEATHER_API_KEY=your_weather_api_key
NODE_ENV=development
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user

### Water Level Data
- `GET /api/water-levels` - Get all water level readings
- `GET /api/water-levels/latest` - Get latest water level readings
- `GET /api/water-levels/historical` - Get historical water level data

### Alerts
- `GET /api/alerts` - Get all alerts
- `POST /api/alerts/subscribe` - Subscribe to alerts
- `PUT /api/alerts/settings` - Update alert settings

## 🔍 Project Structure

```
kalu-river-monitoring/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
├── README.md
└── package.json
```

## 📊 Data Sources

This system integrates with multiple data sources:
- Water level sensors deployed along the Kalu River
- Weather forecast APIs
- Historical flooding data
- Topographical information
- Rainfall data from meteorological stations

## 🚨 Alert Thresholds

| Level | Description | Water Rise (cm/hr) | Actions |
|-------|-------------|-------------------|---------|
| 🟢 Normal | River within normal parameters | < 2 | Regular monitoring |
| 🟡 Advisory | Minor flooding possible | 2-5 | Notify officials |
| 🟠 Watch | Flooding expected | 5-10 | Alert communities |
| 🔴 Warning | Severe flooding imminent | > 10 | Immediate evacuation |

## 🌐 Future Enhancements

- Integration with government disaster management systems
- Machine learning models for improved prediction accuracy
- Expansion to other flood-prone rivers in Sri Lanka
- Community reporting features
- Multi-platform alert distribution
- Power backup systems for sensors

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Department of Meteorology, Sri Lanka
- Disaster Management Center of Sri Lanka
- Local communities along the Kalu River basin
- Open source community and all contributors

## 📞 Contact

For any queries regarding this project, please contact:

- Project Lead: [Your Name](mailto:your.email@example.com)
- GitHub: [Your GitHub Profile](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourusername)

---

*This project is dedicated to building resilience in communities affected by flooding along the Kalu River basin.*
