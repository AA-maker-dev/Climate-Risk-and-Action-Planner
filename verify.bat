@echo off
setlocal enabledelayedexpansion

echo.
echo =============================================
echo Climate Risk and Action Planner - Verification
echo =============================================
echo.

REM Check Node.js
echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js !NODE_VERSION! found
) else (
    echo ✗ Node.js not found - please install from https://nodejs.org/
    exit /b 1
)

REM Check npm
echo [2/5] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✓ npm !NPM_VERSION! found
) else (
    echo ✗ npm not found
    exit /b 1
)

REM Check Python
echo [3/5] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo ✓ !PYTHON_VERSION! found
) else (
    echo ✗ Python not found - please install from https://www.python.org/
    exit /b 1
)

REM Check Git
echo [4/5] Checking Git installation...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
    echo ✓ !GIT_VERSION! found
) else (
    echo ✗ Git not found - please install from https://git-scm.com/
)

REM Check TypeScript
echo [5/5] Checking TypeScript installation...
cd frontend
npx tsc --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npx tsc --version') do set TS_VERSION=%%i
    echo ✓ TypeScript !TS_VERSION! found
) else (
    echo ✗ TypeScript not found
    exit /b 1
)
cd ..

echo.
echo ✅ All systems ready!
echo.
echo Next steps:
echo   1. Configure API keys in backend/.env
echo   2. Run: .\start.bat
echo   3. Visit: http://localhost:5173
echo.
