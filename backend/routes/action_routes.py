from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession

from services.database import get_session, ActionPlan
from models.action_model import action_planner_ai

router = APIRouter()

class ActionPlanRequest(BaseModel):
    location: str
    risk_assessment: Dict[str, Any]
    user_profile: Optional[Dict[str, Any]] = None

class ActionPlanResponse(BaseModel):
    location: str
    risk_level: str
    actions: List[Dict[str, Any]]
    total_actions: int
    estimated_total_cost: float
    estimated_impact: float
    timeline: Dict[str, List[str]]
    generated_at: str

@router.post("/generate", response_model=ActionPlanResponse)
async def generate_action_plan(
    request: ActionPlanRequest,
    session: AsyncSession = Depends(get_session)
):
    """
    Generate AI-powered action plan based on risk assessment
    
    - **location**: Location for action plan
    - **risk_assessment**: Risk assessment results
    - **user_profile**: Optional user preferences and constraints
    """
    try:
        # Generate action plan
        action_plan = action_planner_ai.generate_action_plan(
            risk_assessment=request.risk_assessment,
            user_profile=request.user_profile
        )
        
        # Save to database
        db_action_plan = ActionPlan(
            user_id=request.user_profile.get("user_id", "anonymous") if request.user_profile else "anonymous",
            location=request.location,
            risk_types=request.risk_assessment.get("risk_breakdown", {}),
            actions=action_plan["actions"],
            priority=request.risk_assessment.get("risk_level", "moderate"),
            estimated_cost=action_plan["estimated_total_cost"],
            estimated_impact=action_plan["estimated_impact"]
        )
        session.add(db_action_plan)
        await session.commit()
        
        return action_plan
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating action plan: {str(e)}")

@router.get("/templates")
async def get_action_templates():
    """Get available action templates by category"""
    try:
        templates = action_planner_ai.action_database
        
        # Organize by category
        categories = {}
        for risk_type, actions in templates.items():
            for action in actions:
                category = action["category"]
                if category not in categories:
                    categories[category] = []
                categories[category].append({
                    "risk_type": risk_type,
                    "title": action["title"],
                    "description": action["description"],
                    "estimated_cost": action["estimated_cost"],
                    "impact_score": action["impact_score"]
                })
        
        return {
            "total_templates": sum(len(actions) for actions in templates.values()),
            "risk_types": list(templates.keys()),
            "categories": categories
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching templates: {str(e)}")

@router.get("/user/{user_id}")
async def get_user_action_plans(
    user_id: str,
    limit: int = 10,
    session: AsyncSession = Depends(get_session)
):
    """Get action plans for a specific user"""
    try:
        from sqlalchemy import select
        
        query = select(ActionPlan).where(
            ActionPlan.user_id == user_id
        ).order_by(ActionPlan.created_at.desc()).limit(limit)
        
        result = await session.execute(query)
        plans = result.scalars().all()
        
        return {
            "user_id": user_id,
            "total_plans": len(plans),
            "plans": [
                {
                    "id": p.id,
                    "location": p.location,
                    "priority": p.priority,
                    "total_actions": len(p.actions),
                    "estimated_cost": p.estimated_cost,
                    "estimated_impact": p.estimated_impact,
                    "created_at": p.created_at.isoformat()
                }
                for p in plans
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching user plans: {str(e)}")
