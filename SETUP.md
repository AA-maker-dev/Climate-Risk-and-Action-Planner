# AI Climate Risk and Action Planner - Setup Guide

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

6. Edit `.env` and add your API keys (optional for basic functionality)

7. Run the backend:
```bash
python app.py
```

Backend will run on: http://localhost:8000
API Documentation: http://localhost:8000/docs

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will run on: http://localhost:3000

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. Make sure Docker and Docker Compose are installed

2. From the root directory:
```bash
docker-compose up --build
```

This will start both backend and frontend services:
- Backend: http://localhost:8000
- Frontend: http://localhost:3000

### Building Individual Containers

Backend:
```bash
cd backend
docker build -t climate-planner-backend .
docker run -p 8000:8000 climate-planner-backend
```

Frontend:
```bash
cd frontend
docker build -t climate-planner-frontend .
docker run -p 3000:80 climate-planner-frontend
```

## 🌐 Production Deployment

### Heroku Deployment

Backend:
```bash
cd backend
heroku create your-app-name-backend
git push heroku main
```

Frontend:
```bash
cd frontend
npm run build
# Deploy dist folder to your hosting service
```

### Vercel Deployment (Frontend)

```bash
cd frontend
npm install -g vercel
vercel
```

### AWS/Azure/GCP

Use the provided Dockerfiles to deploy containers to:
- AWS ECS/Fargate
- Azure Container Instances
- Google Cloud Run

## 🔑 API Keys Setup

### OpenWeather API (for real weather data)
1. Sign up at: https://openweathermap.org/api
2. Get your API key
3. Add to backend `.env`: `OPENWEATHER_API_KEY=your_key`

### OpenAI API (optional, for enhanced AI features)
1. Sign up at: https://platform.openai.com/
2. Get your API key
3. Add to backend `.env`: `OPENAI_API_KEY=your_key`

## 📱 Features Overview

1. **Risk Assessment**: Enter any location to get AI-powered climate risk analysis
2. **Action Plans**: Generate personalized recommendations based on risk assessment
3. **Carbon Footprint**: Track and calculate your environmental impact
4. **Predictions**: Forecast climate risks for up to 30 years
5. **Dashboard**: Monitor your climate action progress

## 🧪 Testing

Backend:
```bash
cd backend
pytest
```

Frontend:
```bash
cd frontend
npm test
```

## 🔧 Troubleshooting

### Backend won't start
- Check Python version: `python --version` (should be 3.9+)
- Ensure virtual environment is activated
- Check if port 8000 is available

### Frontend won't start
- Check Node.js version: `node --version` (should be 16+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check if port 3000 is available

### Database errors
- Delete `climate_planner.db` and restart backend
- Database will be recreated automatically

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact: your-email@example.com

## 📄 License

MIT License - feel free to use for your projects!
