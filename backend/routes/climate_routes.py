from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession

from services.database import get_session, ClimateData
from services.climate_service import climate_service

router = APIRouter()

class ClimateDataRequest(BaseModel):
    latitude: float
    longitude: float
    days: Optional[int] = 5

@router.get("/current/{latitude}/{longitude}")
async def get_current_climate(
    latitude: float,
    longitude: float,
    session: AsyncSession = Depends(get_session)
):
    """
    Get current climate data for coordinates
    
    - **latitude**: Latitude coordinate
    - **longitude**: Longitude coordinate
    """
    try:
        data = await climate_service.get_current_weather(latitude, longitude)
        
        # Save to database
        db_data = ClimateData(
            location=f"{latitude},{longitude}",
            latitude=latitude,
            longitude=longitude,
            temperature=data.get("temperature", 0),
            precipitation=data.get("humidity", 0),
            humidity=data.get("humidity", 0),
            wind_speed=data.get("wind_speed", 0),
            data_source="openweathermap",
            raw_data=data
        )
        session.add(db_data)
        await session.commit()
        
        return {
            "location": f"{latitude},{longitude}",
            "data": data,
            "timestamp": db_data.timestamp.isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching climate data: {str(e)}")

@router.post("/forecast")
async def get_forecast(request: ClimateDataRequest):
    """
    Get weather forecast for location
    
    - **latitude**: Latitude coordinate
    - **longitude**: Longitude coordinate
    - **days**: Number of days to forecast (default: 5)
    """
    try:
        data = await climate_service.get_forecast(
            request.latitude,
            request.longitude,
            request.days
        )
        
        return {
            "location": f"{request.latitude},{request.longitude}",
            "forecast_days": request.days,
            "forecasts": data["forecasts"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching forecast: {str(e)}")

@router.get("/historical/{latitude}/{longitude}")
async def get_historical_climate(
    latitude: float,
    longitude: float,
    months: int = 12
):
    """
    Get historical climate data
    
    - **latitude**: Latitude coordinate
    - **longitude**: Longitude coordinate
    - **months**: Number of months of history (default: 12)
    """
    try:
        data = await climate_service.get_historical_data(latitude, longitude, months)
        
        return {
            "location": f"{latitude},{longitude}",
            "months": months,
            "historical_data": data["historical_data"],
            "trends": data["trends"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching historical data: {str(e)}")
