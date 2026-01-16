from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from geopy.geocoders import Nominatim

from services.database import get_session, RiskAssessment
from services.climate_service import climate_service
from models.risk_model import risk_assessment_ai

router = APIRouter()

class RiskAssessmentRequest(BaseModel):
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class RiskAssessmentResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    overall_risk_score: float
    risk_level: str
    risk_breakdown: Dict[str, float]
    top_risks: list
    assessment_date: str
    confidence: float

@router.post("/assess", response_model=RiskAssessmentResponse)
async def assess_risk(
    request: RiskAssessmentRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Assess climate risks for a given location
    
    - **location**: Address or place name
    - **latitude**: Optional latitude coordinate
    - **longitude**: Optional longitude coordinate
    """
    try:
        # Geocode location if coordinates not provided
        if request.latitude is None or request.longitude is None:
            geolocator = Nominatim(user_agent="climate_planner")
            location = geolocator.geocode(request.location)
            
            if location is None:
                raise HTTPException(status_code=404, detail="Location not found")
            
            lat, lon = location.latitude, location.longitude
        else:
            lat, lon = request.latitude, request.longitude
        
        # Fetch climate data
        current_weather = await climate_service.get_current_weather(lat, lon)
        historical_data = await climate_service.get_historical_data(lat, lon)
        
        # Perform risk assessment
        assessment = risk_assessment_ai.assess_risk(
            location=request.location,
            lat=lat,
            lon=lon,
            climate_data=current_weather,
            historical_data=historical_data
        )
        
        # Save to database
        db_assessment = RiskAssessment(
            location=request.location,
            latitude=lat,
            longitude=lon,
            risk_score=assessment["overall_risk_score"],
            risk_level=assessment["risk_level"],
            risk_types=assessment["risk_breakdown"],
            assessment_data=assessment
        )
        session.add(db_assessment)
        await session.commit()
        
        return assessment
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error assessing risk: {str(e)}")

@router.get("/history/{location}")
async def get_risk_history(
    location: str,
    limit: int = 10,
    session: AsyncSession = Depends(get_session)
):
    """Get historical risk assessments for a location"""
    try:
        from sqlalchemy import select
        
        query = select(RiskAssessment).where(
            RiskAssessment.location == location
        ).order_by(RiskAssessment.created_at.desc()).limit(limit)
        
        result = await session.execute(query)
        assessments = result.scalars().all()
        
        return {
            "location": location,
            "total_assessments": len(assessments),
            "assessments": [
                {
                    "id": a.id,
                    "risk_score": a.risk_score,
                    "risk_level": a.risk_level,
                    "date": a.created_at.isoformat()
                }
                for a in assessments
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")
