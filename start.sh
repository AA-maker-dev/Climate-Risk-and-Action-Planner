#!/bin/bash

echo "========================================"
echo "AI Climate Risk and Action Planner"
echo "========================================"
echo ""

echo "Starting Backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

sleep 5

echo "Starting Frontend..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Services running..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "API Docs: http://localhost:8000/docs"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT

wait
