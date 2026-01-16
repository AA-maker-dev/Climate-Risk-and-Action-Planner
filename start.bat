@echo off
echo ========================================
echo AI Climate Risk and Action Planner
echo ========================================
echo.

echo Starting Backend...
cd backend
start cmd /k "D:/Hackathon/Hackathon#3/.venv/Scripts/python.exe -m uvicorn app:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak > nul

echo Starting Frontend...
cd ..\frontend
start cmd /k "npm run dev"

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
