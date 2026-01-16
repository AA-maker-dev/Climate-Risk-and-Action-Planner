from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import numpy as np
from datetime import datetime, timedelta

router = APIRouter()

class PredictionRequest(BaseModel):
    latitude: float
    longitude: float
    years: Optional[int] = 10

class PredictionResponse(BaseModel):
    location: str
    prediction_years: int
    predictions: List[Dict[str, Any]]
    trends: Dict[str, Any]
    risk_progression: Dict[str, List[float]]

@router.post("/generate", response_model=PredictionResponse)
async def generate_predictions(request: PredictionRequest):
    """
    Generate climate predictions using AI models
    
    - **latitude**: Latitude coordinate
    - **longitude**: Longitude coordinate
    - **years**: Number of years to predict (default: 10)
    """
    try:
        predictions = []
        base_year = datetime.utcnow().year
        
        # Generate yearly predictions
        for year_offset in range(1, request.years + 1):
            year = base_year + year_offset
            prediction = _generate_year_prediction(
                request.latitude,
                request.longitude,
                year_offset
            )
            prediction["year"] = year
            predictions.append(prediction)
        
        # Analyze trends
        trends = _analyze_trends(predictions)
        
        # Calculate risk progression
        risk_progression = _calculate_risk_progression(predictions)
        
        return {
            "location": f"{request.latitude},{request.longitude}",
            "prediction_years": request.years,
            "predictions": predictions,
            "trends": trends,
            "risk_progression": risk_progression
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating predictions: {str(e)}")

def _generate_year_prediction(lat: float, lon: float, year_offset: int) -> Dict[str, Any]:
    """Generate prediction for a specific year"""
    import random
    
    # Base temperature increase (simplified climate model)
    base_temp_increase = 0.15 * year_offset  # ~1.5°C per decade
    
    # Add some variability
    temp_variance = random.uniform(-0.5, 0.5)
    temperature_change = base_temp_increase + temp_variance
    
    # Precipitation changes (more variable)
    precip_change = random.uniform(-10, 20)  # percentage
    
    # Extreme events probability
    extreme_events_probability = min(10 + (year_offset * 2), 40)  # increasing probability
    
    # Sea level rise (mm per year)
    sea_level_rise = 3.3 * year_offset  # ~3.3mm per year average
    
    # Risk scores
    risk_scores = {
        "flood": min(30 + (year_offset * 2.5) + random.uniform(-5, 5), 100),
        "wildfire": min(25 + (year_offset * 3) + random.uniform(-5, 5), 100),
        "hurricane": min(20 + (year_offset * 2) + random.uniform(-5, 5), 100),
        "drought": min(28 + (year_offset * 2.8) + random.uniform(-5, 5), 100),
        "heatwave": min(35 + (year_offset * 3.5) + random.uniform(-5, 5), 100),
        "sea_level_rise": min(15 + (year_offset * 1.5) + random.uniform(-3, 3), 100)
    }
    
    return {
        "temperature_change": round(temperature_change, 2),
        "precipitation_change_percent": round(precip_change, 1),
        "extreme_events_probability": round(extreme_events_probability, 1),
        "sea_level_rise_mm": round(sea_level_rise, 1),
        "risk_scores": {k: round(v, 1) for k, v in risk_scores.items()},
        "overall_risk": round(np.mean(list(risk_scores.values())), 1)
    }

def _analyze_trends(predictions: List[Dict]) -> Dict[str, Any]:
    """Analyze trends from predictions"""
    temp_changes = [p["temperature_change"] for p in predictions]
    overall_risks = [p["overall_risk"] for p in predictions]
    sea_levels = [p["sea_level_rise_mm"] for p in predictions]
    
    return {
        "temperature": {
            "average_increase": round(np.mean(temp_changes), 2),
            "total_increase": round(temp_changes[-1], 2),
            "trend": "increasing"
        },
        "overall_risk": {
            "current": round(overall_risks[0], 1),
            "future": round(overall_risks[-1], 1),
            "increase_percent": round(((overall_risks[-1] - overall_risks[0]) / overall_risks[0]) * 100, 1)
        },
        "sea_level": {
            "total_rise_mm": round(sea_levels[-1], 1),
            "annual_rate": round(np.mean(np.diff(sea_levels)), 2)
        },
        "extreme_events": {
            "probability_increase": round(predictions[-1]["extreme_events_probability"] - predictions[0]["extreme_events_probability"], 1),
            "trend": "increasing"
        }
    }

def _calculate_risk_progression(predictions: List[Dict]) -> Dict[str, List[float]]:
    """Calculate risk progression over time"""
    risk_types = ["flood", "wildfire", "hurricane", "drought", "heatwave", "sea_level_rise"]
    
    progression = {}
    for risk_type in risk_types:
        progression[risk_type] = [
            round(p["risk_scores"][risk_type], 1)
            for p in predictions
        ]
    
    return progression

@router.get("/scenarios/{latitude}/{longitude}")
async def get_climate_scenarios(
    latitude: float,
    longitude: float,
    scenario: str = "moderate"
):
    """
    Get climate scenarios (optimistic, moderate, pessimistic)
    
    - **latitude**: Latitude coordinate
    - **longitude**: Longitude coordinate
    - **scenario**: Scenario type (optimistic, moderate, pessimistic)
    """
    try:
        scenarios_data = {
            "optimistic": {
                "description": "Strong climate action, rapid transition to renewables",
                "temperature_increase_2050": 1.5,
                "sea_level_rise_2050_cm": 30,
                "extreme_events_increase": "20%"
            },
            "moderate": {
                "description": "Current policies continue, moderate climate action",
                "temperature_increase_2050": 2.5,
                "sea_level_rise_2050_cm": 50,
                "extreme_events_increase": "40%"
            },
            "pessimistic": {
                "description": "Limited climate action, high emissions continue",
                "temperature_increase_2050": 4.0,
                "sea_level_rise_2050_cm": 80,
                "extreme_events_increase": "70%"
            }
        }
        
        if scenario not in scenarios_data:
            raise HTTPException(status_code=400, detail="Invalid scenario")
        
        return {
            "location": f"{latitude},{longitude}",
            "scenario": scenario,
            "data": scenarios_data[scenario],
            "impacts": _get_scenario_impacts(scenario),
            "recommendations": _get_scenario_recommendations(scenario)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating scenarios: {str(e)}")

def _get_scenario_impacts(scenario: str) -> List[str]:
    """Get expected impacts for scenario"""
    impacts = {
        "optimistic": [
            "Manageable sea level rise",
            "Reduced frequency of extreme weather",
            "Stable agricultural productivity",
            "Lower economic costs"
        ],
        "moderate": [
            "Significant coastal flooding",
            "Increased droughts and heatwaves",
            "Agricultural challenges",
            "Moderate economic disruption"
        ],
        "pessimistic": [
            "Major coastal city flooding",
            "Severe water scarcity",
            "Widespread crop failures",
            "Significant economic losses",
            "Mass displacement of populations"
        ]
    }
    return impacts.get(scenario, [])

def _get_scenario_recommendations(scenario: str) -> List[str]:
    """Get recommendations based on scenario"""
    recommendations = {
        "optimistic": [
            "Continue supporting renewable energy",
            "Implement moderate adaptation measures",
            "Monitor climate trends closely"
        ],
        "moderate": [
            "Accelerate transition to renewables",
            "Invest in resilient infrastructure",
            "Develop comprehensive adaptation plans",
            "Reduce personal carbon footprint"
        ],
        "pessimistic": [
            "Urgent action on emissions reduction",
            "Major infrastructure upgrades needed",
            "Consider relocation from high-risk areas",
            "Develop emergency response capabilities"
        ]
    }
    return recommendations.get(scenario, [])
