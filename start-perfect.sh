#!/bin/bash
# Climate Risk and Action Planner - Perfect Start (Unix/Linux/Mac)

clear
echo "========================================"
echo "AI Climate Risk and Action Planner"
echo "========================================"
echo ""

# Kill any existing processes
echo "Cleaning up existing processes..."
pkill -f "uvicorn\|node" 2>/dev/null || true
sleep 2

# Start backend
echo "Starting Backend..."
cd "$(cd "$(dirname "$0")" && pwd)/backend"
source ../../.venv/bin/activate
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend
sleep 3

# Start frontend
echo "Starting Frontend..."
cd "$(cd "$(dirname "$0")" && pwd)/frontend"
npm run dev -- --host localhost &
FRONTEND_PID=$!

# Wait for frontend
sleep 3

clear
echo "========================================"
echo "AI Climate Risk and Action Planner"
echo "========================================"
echo ""
echo "✓ Backend running on:"
echo "  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "✓ Frontend running on:"
echo "  http://localhost:3000"
echo ""
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for user to press Ctrl+C
wait $BACKEND_PID $FRONTEND_PID

# Cleanup
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
