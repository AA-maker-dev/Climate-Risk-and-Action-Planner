# Developer Guide - Climate Risk and Action Planner

## 🚀 Windows Setup Guide

### Prerequisites
- **Node.js 18+**: Download from https://nodejs.org/
- **Python 3.8+**: Download from https://www.python.org/
- **Git**: Download from https://git-scm.com/
- **Docker** (optional): Download from https://www.docker.com/

### Step 1: Clone Repository
```powershell
git clone https://github.com/AA-maker-dev/Climate-Risk-and-Action-Planner.git
cd Climate-Risk-and-Action-Planner
```

### Step 2: Backend Setup
```powershell
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create .env file from example
Copy-Item .env.example -Destination .env

# Edit .env and add your API keys
# Important API Keys needed:
# - OPENAI_API_KEY (https://platform.openai.com/)
# - OPENWEATHER_API_KEY (https://openweathermap.org/api)
# - ANTHROPIC_API_KEY (optional, https://console.anthropic.com/)
```

### Step 3: Frontend Setup
```powershell
cd ..\frontend

# Install dependencies
npm install

# Create .env.local if needed for development
# VITE_API_URL=http://localhost:8000
```

### Step 4: Run Application

**Option A: Quick Start (Recommended)**
```powershell
# From project root
.\start.bat
```

**Option B: Manual Start**

Terminal 1 - Backend:
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 - Frontend:
```powershell
cd frontend
npm run dev
```

### Step 5: Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

---

## 📁 Project Structure

```
Climate-Risk-and-Action-Planner/
├── backend/
│   ├── models/           # AI/ML models
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── app.py            # FastAPI application
│   └── requirements.txt   # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API client
│   │   ├── store/        # Zustand state management
│   │   ├── types/        # TypeScript types
│   │   └── App.tsx       # Root component
│   ├── package.json      # Node dependencies
│   └── vite.config.ts    # Vite configuration
└── docker-compose.yml    # Docker setup
```

---

## 🔧 Development Workflow

### Running Tests

**Backend Tests:**
```powershell
cd backend
pytest --cov=. --cov-report=html
```

**Frontend Tests:**
```powershell
cd frontend
npm run test
```

### Code Quality

**Backend Linting:**
```powershell
cd backend
flake8 .
black --check .
isort --check-only .
```

**Format Python Code:**
```powershell
cd backend
black .
isort .
```

**Frontend Linting:**
```powershell
cd frontend
npm run lint
```

**Format Frontend Code:**
```powershell
cd frontend
npx prettier --write src/
```

### Building for Production

**Backend:**
```powershell
cd backend
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```powershell
cd frontend
npm run build
# Output in dist/ directory
```

---

## 🔐 Environment Variables

### Backend (.env)
```
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
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Climate Risk Planner
```

---

## 📦 API Endpoints

### Risk Assessment
- `GET /api/risks` - List all assessments
- `POST /api/risks/assess` - Perform risk assessment
- `GET /api/risks/{id}` - Get specific assessment

### Action Plans
- `GET /api/actions` - List action plans
- `POST /api/actions/generate` - Generate action plan
- `GET /api/actions/{id}` - Get specific action plan

### Carbon Footprint
- `POST /api/footprint/calculate` - Calculate emissions
- `GET /api/footprint/{id}` - Get footprint data

### Predictions
- `POST /api/predictions/forecast` - Generate forecast
- `GET /api/predictions/{id}` - Get predictions

### Full API Documentation
Visit: http://localhost:8000/docs (when backend is running)

---

## 🐛 Troubleshooting

### Python Import Errors
```powershell
# Ensure virtual environment is activated
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### Port Already in Use
```powershell
# Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port
python -m uvicorn app:app --port 8001
```

### Node Modules Issues
```powershell
cd frontend
rm -r node_modules package-lock.json
npm install
```

### CORS Issues
Ensure `CORS_ORIGINS` in backend .env includes your frontend URL:
```
CORS_ORIGINS=http://localhost:5173
```

---

## 🚢 Docker Deployment

### Build and Run with Docker Compose
```powershell
docker-compose up --build
```

### Access Services
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Clean Up
```powershell
docker-compose down
docker-compose down -v  # Also remove volumes
```

---

## 📊 Database

### Initialize Database
```powershell
cd backend
python -c "from services.database import init_db; init_db()"
```

### Database Migrations
```powershell
# Using Alembic (when set up)
alembic upgrade head
```

---

## 🔗 Git Workflow

### Create Feature Branch
```powershell
git checkout -b feature/your-feature-name
```

### Commit Changes
```powershell
git add .
git commit -m "feat: description of changes"
```

### Push to Remote
```powershell
git push origin feature/your-feature-name
```

### Create Pull Request
Visit GitHub and create PR with detailed description

---

## 🎯 Best Practices

1. **Code Quality**
   - Follow PEP 8 for Python
   - Follow Prettier/ESLint rules for TypeScript
   - Write meaningful commit messages

2. **Testing**
   - Write tests for new features
   - Maintain >80% code coverage
   - Run tests before committing

3. **Documentation**
   - Document complex functions
   - Keep README updated
   - Add docstrings to classes

4. **Performance**
   - Use async operations where applicable
   - Optimize database queries
   - Minimize bundle size

5. **Security**
   - Never commit API keys
   - Validate all user input
   - Use parameterized queries
   - Keep dependencies updated

---

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://zustand.surge.sh/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request
6. Ensure CI/CD checks pass

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details

---

## ❓ Need Help?

- Check [SETUP.md](SETUP.md) for installation issues
- Review [ARCHITECTURE.md](ARCHITECTURE.md) for project structure
- Check [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for quick commands
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines

---

**Last Updated**: January 16, 2026  
**Version**: 1.0.0
