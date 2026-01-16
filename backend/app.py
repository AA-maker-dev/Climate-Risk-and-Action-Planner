from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
from datetime import datetime
import os
from dotenv import load_dotenv

from routes import risk_routes, action_routes, climate_routes, footprint_routes, prediction_routes
from services.database import init_db

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="AI Climate Risk and Action Planner API",
    description="AI-powered platform for climate risk assessment and action planning",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(risk_routes.router, prefix="/api/risk", tags=["Risk Assessment"])
app.include_router(action_routes.router, prefix="/api/actions", tags=["Action Plans"])
app.include_router(climate_routes.router, prefix="/api/climate", tags=["Climate Data"])
app.include_router(footprint_routes.router, prefix="/api/footprint", tags=["Carbon Footprint"])
app.include_router(prediction_routes.router, prefix="/api/predictions", tags=["Predictions"])

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    await init_db()
    print("🌍 Database initialized successfully!")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to AI Climate Risk and Action Planner API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "database": "operational",
            "ai_models": "operational",
            "external_apis": "operational"
        }
    }

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() == "true"
    
    print(f"""
    🌍 AI Climate Risk and Action Planner API
    ========================================
    Server running on: http://{host}:{port}
    Documentation: http://{host}:{port}/docs
    Debug Mode: {debug}
    ========================================
    """)
    
    uvicorn.run(
        "app:app",
        host=host,
        port=port,
        reload=debug
    )
