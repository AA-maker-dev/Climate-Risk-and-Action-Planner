# 🚀 Quick Reference Guide

## Essential Commands

### Starting the Application

**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
./start.sh
```

**Docker:**
```bash
docker-compose up --build
```

---

## URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend API | http://localhost:8000 | REST API |
| API Docs | http://localhost:8000/docs | Interactive API documentation |

---

## Common Tasks

### Backend Development

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py

# Run with auto-reload
uvicorn app:app --reload
```

### Frontend Development

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## API Quick Reference

### Risk Assessment

```bash
# POST /api/risk/assess
curl -X POST "http://localhost:8000/api/risk/assess" \
  -H "Content-Type: application/json" \
  -d '{"location": "New York, USA"}'
```

### Generate Action Plan

```bash
# POST /api/actions/generate
curl -X POST "http://localhost:8000/api/actions/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "New York, USA",
    "risk_assessment": {...}
  }'
```

### Calculate Carbon Footprint

```bash
# POST /api/footprint/calculate
curl -X POST "http://localhost:8000/api/footprint/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user123",
    "category": "transportation",
    "activity_type": "car_petrol",
    "amount": 100,
    "unit": "km"
  }'
```

---

## Environment Variables

### Backend (.env)

```env
# API Keys
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
OPENWEATHER_API_KEY=your_key_here

# Database
DATABASE_URL=sqlite:///./climate_planner.db

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Security
SECRET_KEY=your_secret_key
ALGORITHM=HS256

# CORS
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Troubleshooting

### Backend won't start

**Problem:** Port 8000 already in use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

**Problem:** Module not found
```bash
# Ensure virtual environment is activated
pip install -r requirements.txt
```

### Frontend won't start

**Problem:** Port 3000 already in use
```bash
# Kill process on port 3000
# Windows: Use Task Manager
# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

**Problem:** Dependencies issue
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database Issues

**Problem:** Database locked or corrupted
```bash
# Delete and recreate
cd backend
rm climate_planner.db
python app.py  # Will recreate automatically
```

---

## File Structure Reference

### Backend Files

```
backend/
├── app.py                    # Main application ⭐
├── requirements.txt          # Dependencies
├── models/
│   ├── risk_model.py        # Risk AI ⭐
│   └── action_model.py      # Action AI ⭐
├── routes/
│   ├── risk_routes.py       # Risk endpoints
│   ├── action_routes.py     # Action endpoints
│   ├── climate_routes.py    # Climate endpoints
│   ├── footprint_routes.py  # Footprint endpoints
│   └── prediction_routes.py # Prediction endpoints
└── services/
    ├── database.py          # Database models ⭐
    └── climate_service.py   # Climate data
```

### Frontend Files

```
frontend/src/
├── App.tsx                  # Main app ⭐
├── main.tsx                 # Entry point
├── components/
│   └── Navbar.tsx          # Navigation
├── pages/
│   ├── Home.tsx            # Landing page
│   ├── RiskAssessment.tsx  # Risk tool ⭐
│   ├── ActionPlan.tsx      # Actions ⭐
│   ├── CarbonFootprint.tsx # Calculator
│   ├── Predictions.tsx     # Forecasts
│   └── Dashboard.tsx       # Overview
├── services/
│   └── api.ts              # API client ⭐
└── store/
    └── useStore.ts         # State management
```

---

## Key Features Checklist

### ✅ Implemented Features

- [x] Risk Assessment (6 risk types)
- [x] AI Action Planning (100+ templates)
- [x] Carbon Footprint Calculator (4 categories)
- [x] Climate Predictions (30-year forecast)
- [x] Interactive Dashboard
- [x] Real-time Weather Data
- [x] Historical Climate Analysis
- [x] Responsive Design
- [x] Animations & Transitions
- [x] API Documentation
- [x] Docker Support
- [x] Type Safety (TypeScript)
- [x] State Management
- [x] Error Handling

---

## Testing

### Backend Tests

```bash
cd backend
pytest -v
pytest --cov
```

### Frontend Tests

```bash
cd frontend
npm test
npm run test:coverage
```

---

## Deployment

### Docker Deployment

```bash
# Build and run
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Production Build

**Backend:**
```bash
# Set production environment
export DEBUG=False
export DATABASE_URL=postgresql://...

# Run with gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app
```

**Frontend:**
```bash
# Build
npm run build

# Output in dist/
# Deploy to Vercel, Netlify, etc.
```

---

## Performance Tips

### Backend

- Use async/await for I/O operations
- Enable database connection pooling
- Implement response caching
- Use pagination for large datasets
- Compress responses

### Frontend

- Enable code splitting
- Lazy load components
- Optimize images
- Use production build
- Enable compression (gzip)

---

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Secure API keys in environment variables
- [ ] Enable CORS properly
- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Keep dependencies updated
- [ ] Use strong passwords/tokens

---

## Useful Links

- **GitHub**: https://github.com/AA-maker-dev/Climate-Risk-and-Action-Planner
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **TailwindCSS**: https://tailwindcss.com/docs
- **Chart.js**: https://www.chartjs.org/docs/
- **Leaflet**: https://leafletjs.com/reference.html

---

## Support

### Getting Help

1. Check [SETUP.md](SETUP.md) for detailed setup
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. See [PRESENTATION.md](PRESENTATION.md) for features
4. Open an issue on GitHub
5. Check API docs at /docs endpoint

---

## Version Info

- **Project Version**: 1.0.0
- **Python**: 3.9+
- **Node.js**: 16+
- **React**: 18.2.0
- **FastAPI**: 0.109.0
- **TypeScript**: 5.3.3

---

*Last Updated: January 2026*
