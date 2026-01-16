@echo off
setlocal enabledelayedexpansion

REM ===============================================
REM Climate Risk and Action Planner - Perfect Start
REM ===============================================

cls
echo.
echo ========================================
echo AI Climate Risk and Action Planner
echo ========================================
echo.

REM Kill any existing processes
echo Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
timeout /T 2 /nobreak >nul

REM Check if X: drive is mapped
echo Checking drive mapping...
if not exist X:\ (
    echo Mapping drive X to project...
    subst X: "D:\Hackathon\Hackathon3"
)

REM Start backend in new window
echo.
echo Starting Backend...
start "Climate Risk Planner - Backend" cmd /k ^
    pushd X:\Climate-Risk-and-Action-Planner\backend ^
    && X:\..\..\.venv\Scripts\python.exe -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

REM Wait for backend to start
timeout /T 3 /nobreak >nul

REM Start frontend in new window
echo Starting Frontend...
start "Climate Risk Planner - Frontend" cmd /k ^
    pushd X:\Climate-Risk-and-Action-Planner\frontend ^
    && npm run dev -- --host localhost

REM Wait for frontend to start
timeout /T 3 /nobreak >nul

cls
echo.
echo ========================================
echo AI Climate Risk and Action Planner
echo ========================================
echo.
echo ✓ Backend running on:
echo   http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo.
echo ✓ Frontend running on:
echo   http://localhost:3000
echo.
echo ========================================
echo.
echo All services are ready to use!
echo Press any key to exit (servers will keep running)...
pause >nul

exit /b 0
