# 🌍 AI Climate Risk and Action Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.0-green.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

An intelligent, full-stack platform that assesses climate risks and provides AI-powered action recommendations to help individuals, communities, and organizations prepare for and mitigate climate change impacts.

![Climate Risk Planner](https://img.shields.io/badge/Status-Production_Ready-green)

## 🌟 Features

### 🎯 Core Capabilities

- **🤖 AI-Powered Risk Assessment**: Advanced machine learning models analyze 6 types of climate risks (floods, wildfires, hurricanes, droughts, heatwaves, sea level rise)
- **📋 Personalized Action Plans**: Get customized recommendations with cost estimates and implementation timelines
- **🌡️ Real-time Climate Data**: Integration with OpenWeatherMap and climate databases
- **📊 Interactive Visualizations**: Beautiful charts, maps, and dashboards powered by Chart.js and Leaflet
- **🔮 Risk Predictions**: Forecast climate risks up to 30 years into the future
- **🌱 Carbon Footprint Calculator**: Track and reduce your environmental impact across 4 categories
- **📈 Trend Analysis**: Analyze historical climate patterns and future projections
- **🎨 Modern UI/UX**: Responsive design with smooth animations and intuitive navigation

## 🚀 Quick Start

### 🎬 Method 1: Automated Setup (Recommended)

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
chmod +x start.sh
./start.sh
```

### 🐳 Method 2: Docker (2 minutes)

```bash
docker-compose up --build
```

### 📝 Method 3: Manual Setup

**Prerequisites:**
- Python 3.9+
- Node.js 16+
- npm or yarn

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py        # FastAPI Backend
│   ├── app.py                   # Main application entry
│   ├── requirements.txt         # Python dependencies
│   ├── Dockerfile              # Docker configuration
│   ├── models/                 # AI/ML Models
│   │   ├── risk_model.py       # Risk assessment engine
│   │   └── action_model.py     # Action planning engine
│   ├── routes/                 # API Endpoints
│   │   ├── risk_routes.py      # Risk assessment
│   │   ├── action_routes.py    # Action planning
│   │   ├── climate_routes.py   # Climate data
│   │   ├── footprint_routes.py # Carbon calculator
│   │   └── prediction_routes.py # Predictions
│   └── services/               # Business Logic
│       ├── database.py         # Database models
│       └── climate_service.py  # Climate data service
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── pages/              # Route pages
│   │   │   ├── Home.tsx
│   │   │   ├── RiskAssessment.tsx
│   │   │   ├── ActionPlan.tsx
│   │   │   ├── CarbonFootprint.tsx
│   │   │   ├── Predictions.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/         # Reusable components
│   │   │   └── Navbar.tsx
│   │   ├── services/           # API integration
│   │   │   └── api.ts
│   │   └── store/             # State management
│   │       └── useStore.ts
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml          # Docker orchestration
├── README.md                   # This file
├── SETUP.md                   # Detailed setup guide
├── ARCHITECTURE.md            # System architecture
├── PRESENTATION.md            # Project presentation
└── PROJECT_SUMMARY.md         # Complete summaryPI**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📁 Project Structure
y Stack

### Backend
- **Framework**: FastAPI 0.109.0 (Python)
- **Server**: Uvicorn (ASGI)
- **Database**: SQLAlchemy with SQLite (upgradeable to PostgreSQL)
- **AI/ML**: Custom risk assessment & prediction models
- **APIs**: OpenWeatherMap, Geopy for geocoding
- **Validation**: Pydantic
### Risk Assessment
- `POST /api/risk/assess` - Analyze climate risk for any location
- `GET /api/risk/history/{location}` - Get historical assessments

### Action Planning
- `POST /api/actions/generate` - Generate personalized action plan
- `GET /api/actions/templates` - Get action templates
- `GET /api/actions/user/{user_id}` - Get user's action plans

### Climate Data
- `GET /api/climate/current/{lat}/{lon}` - Get current weather
- `POST /api/climate/forecast` - Get weather forecast
- `GET /api/climate/historical/{lat}/{lon}` - Get historical data

### Carbon Footprint
- `POST /api/footprint/calculate` - Calculate emissions
- `GET /api/footprint/user/{user_id}/summary` - Get user summary
- `GET /api/footprint/categories` - Get available categories

### Predictions
- `POST /api/predictions/generate` - Generate future predictions
- `GET /api/predictions/scenarios/{lat}/{lon}` - Get climate scenarios

**Full API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Animations**: Framer Motion
- **Charts**: Chart.js with React-Chartjs-2
- **Maps**: Leaflet with React-Leaflet
- **HTTP Client**: Axios
- **State**: Zustand
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

### DevOps
- *🎨 Screenshots & Demo

### Home Page
Beautiful landing page with feature overview and quick access to all tools.

### Risk Assessment
Enter any location to get AI-powered climate risk analysis with detailed breakdowns.

### Action Plan
Receive personalized, prioritized recommendations with cost estimates and timelines.

### Carbon Footprint
Track your environmental impact across transportation, energy, food, and goods.

### Predictions
Visualize future climate scenarios with interactive charts and trend analysis.

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions and deployment guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- **[PRESENTATION.md](PRESENTATION.md)** - Complete project presentation
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Comprehensive project overview
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## 🧪 Testing

**Backend:**
```bash
cd backend
pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- OpenWeatherMap for weather data API
- NASA Earth Data for climate information
- All contributors and supporters of climate action

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/AA-maker-dev/Climate-Risk-and-Action-Planner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/AA-maker-dev/Climate-Risk-and-Action-Planner/discussions)

## 🌱 Future Enhancements

### Phase 2
- 📱 Mobile applications (iOS & Android)
- 🔔 Real-time alerts and notifications
- 👥 Community features and social sharing
- 🏠 Smart home device integration
- 🎮 Gamification elements

### Phase 3
- 🔌 IoT sensor integration
- ⛓️ Blockchain for carbon credits
- 🥽 AR/VR climate visualization
- 🌐 Multi-language support (20+ languages)
- 🏢 Enterprise features

### Phase 4
- 🏛️ Government policy tools
- 💼 Insurance integration
- 💰 Climate finance marketplace
- 🤖 AI chatbot assistant
- 📊 Research data API

## 💡 Use Cases

- **🏠 Homeowners**: Assess property risks and plan adaptations
- **🌾 Farmers**: Get crop-specific climate recommendations
- **🏙️ Urban Planners**: Evaluate city climate resilience
- **💼 Businesses**: Plan for supply chain disruptions
- **🌍 Individuals**: Reduce carbon footprint and prepare for climate events

## ⭐ Star History

If you find this project helpful, please consider giving it a star! ⭐

---

**Built with ❤️ for a sustainable future** 🌍

*Making climate action accessible to everyone*
- **Homeowners**: Assess flood, wildfire, and storm risks for your property
- **Farmers**: Get crop-specific climate recommendations
- **City Planners**: Evaluate urban climate resilience
- **Businesses**: Plan for climate-related supply chain disruptions
- **Individuals**: Reduce carbon footprint and prepare for climate events

## 🔧 Technologies

- **Backend**: Python, FastAPI, Scikit-learn, TensorFlow
- **Frontend**: React, TypeScript, TailwindCSS, Chart.js, Leaflet
- **AI/ML**: Climate prediction models, Natural Language Processing
- **APIs**: OpenWeatherMap, NASA Earth Data, Carbon Interface

## 📊 API Endpoints

- `POST /api/assess-risk` - Analyze climate risk for a location
- `POST /api/generate-actions` - Get AI-powered action recommendations
- `GET /api/climate-data/{location}` - Retrieve climate data
- `POST /api/calculate-footprint` - Calculate carbon footprint
- `GET /api/predictions/{location}` - Get future climate predictions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 🌱 Future Enhancements

- Mobile app (React Native)
- Integration with IoT sensors
- Blockchain for carbon credit tracking
- AR visualization of climate scenarios
- Multi-language support

---

Built with ❤️ for a sustainable future
