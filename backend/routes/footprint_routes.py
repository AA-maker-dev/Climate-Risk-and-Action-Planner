from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict
from sqlalchemy.ext.asyncio import AsyncSession

from services.database import get_session, CarbonFootprint

router = APIRouter()

class FootprintCalculationRequest(BaseModel):
    user_id: str
    category: str  # transportation, energy, food, goods
    activity_type: str
    amount: float
    unit: str

class FootprintResponse(BaseModel):
    category: str
    activity_type: str
    amount: float
    unit: str
    emissions_kg: float
    emissions_tons: float
    equivalent: str

# Emission factors (kg CO2 per unit)
EMISSION_FACTORS = {
    "transportation": {
        "car_petrol": 0.192,  # per km
        "car_diesel": 0.171,  # per km
        "car_electric": 0.053,  # per km
        "bus": 0.089,  # per km
        "train": 0.041,  # per km
        "flight_short": 0.255,  # per km
        "flight_long": 0.195,  # per km
        "motorcycle": 0.113,  # per km
    },
    "energy": {
        "electricity": 0.475,  # per kWh
        "natural_gas": 0.185,  # per kWh
        "heating_oil": 0.264,  # per kWh
        "coal": 0.340,  # per kWh
        "solar": 0.045,  # per kWh
        "wind": 0.011,  # per kWh
    },
    "food": {
        "beef": 27.0,  # per kg
        "pork": 12.1,  # per kg
        "chicken": 6.9,  # per kg
        "fish": 5.1,  # per kg
        "dairy": 1.9,  # per kg
        "vegetables": 0.4,  # per kg
        "fruits": 0.3,  # per kg
        "grains": 0.5,  # per kg
    },
    "goods": {
        "clothing": 6.5,  # per item
        "electronics": 85.0,  # per item
        "furniture": 150.0,  # per item
        "paper": 1.2,  # per kg
        "plastic": 6.0,  # per kg
    }
}

@router.post("/calculate", response_model=FootprintResponse)
async def calculate_footprint(
    request: FootprintCalculationRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Calculate carbon footprint for an activity
    
    - **user_id**: User identifier
    - **category**: Category (transportation, energy, food, goods)
    - **activity_type**: Specific activity within category
    - **amount**: Quantity of activity
    - **unit**: Unit of measurement
    """
    try:
        # Get emission factor
        if request.category not in EMISSION_FACTORS:
            raise HTTPException(status_code=400, detail=f"Invalid category: {request.category}")
        
        if request.activity_type not in EMISSION_FACTORS[request.category]:
            raise HTTPException(status_code=400, detail=f"Invalid activity type: {request.activity_type}")
        
        emission_factor = EMISSION_FACTORS[request.category][request.activity_type]
        
        # Calculate emissions
        emissions_kg = request.amount * emission_factor
        emissions_tons = emissions_kg / 1000
        
        # Create equivalent for context
        equivalent = _get_equivalent(emissions_kg)
        
        # Save to database
        db_footprint = CarbonFootprint(
            user_id=request.user_id,
            category=request.category,
            activity_type=request.activity_type,
            amount=request.amount,
            emissions_kg=emissions_kg,
            calculation_data={
                "emission_factor": emission_factor,
                "unit": request.unit,
                "equivalent": equivalent
            }
        )
        session.add(db_footprint)
        await session.commit()
        
        return {
            "category": request.category,
            "activity_type": request.activity_type,
            "amount": request.amount,
            "unit": request.unit,
            "emissions_kg": round(emissions_kg, 2),
            "emissions_tons": round(emissions_tons, 4),
            "equivalent": equivalent
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating footprint: {str(e)}")

@router.get("/user/{user_id}/summary")
async def get_user_footprint_summary(
    user_id: str,
    session: AsyncSession = Depends(get_session)
):
    """Get carbon footprint summary for user"""
    try:
        from sqlalchemy import select, func
        
        # Get all user footprints
        query = select(CarbonFootprint).where(CarbonFootprint.user_id == user_id)
        result = await session.execute(query)
        footprints = result.scalars().all()
        
        if not footprints:
            return {
                "user_id": user_id,
                "total_emissions_kg": 0,
                "total_emissions_tons": 0,
                "by_category": {},
                "total_entries": 0
            }
        
        # Calculate totals
        total_emissions = sum(f.emissions_kg for f in footprints)
        
        # Group by category
        by_category = {}
        for f in footprints:
            if f.category not in by_category:
                by_category[f.category] = 0
            by_category[f.category] += f.emissions_kg
        
        return {
            "user_id": user_id,
            "total_emissions_kg": round(total_emissions, 2),
            "total_emissions_tons": round(total_emissions / 1000, 4),
            "by_category": {k: round(v, 2) for k, v in by_category.items()},
            "total_entries": len(footprints),
            "average_per_entry": round(total_emissions / len(footprints), 2)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching summary: {str(e)}")

@router.get("/categories")
async def get_footprint_categories():
    """Get available categories and activity types"""
    return {
        "categories": list(EMISSION_FACTORS.keys()),
        "details": {
            category: list(activities.keys())
            for category, activities in EMISSION_FACTORS.items()
        }
    }

def _get_equivalent(emissions_kg: float) -> str:
    """Generate relatable equivalent for emissions"""
    # Trees needed to offset for a year (one tree absorbs ~21 kg CO2/year)
    trees = emissions_kg / 21
    
    # Equivalent car miles (average car emits 0.192 kg/km)
    km = emissions_kg / 0.192
    miles = km * 0.621371
    
    if trees < 1:
        return f"Equivalent to {round(miles, 1)} miles driven by car"
    else:
        return f"Requires {round(trees, 1)} trees for one year to offset"
