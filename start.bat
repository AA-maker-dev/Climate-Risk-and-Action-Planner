@echo off
echo ========================================
echo AI Climate Risk and Action Planner
echo ========================================
echo.

echo Starting Backend...
cd backend
start cmd /k "python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python app.py"

timeout /t 5 /nobreak > nul

echo Starting Frontend...
cd ..\frontend
start cmd /k "npm install && npm run dev"

echo.
echo ========================================
echo Services starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to exit...
pause > nul
