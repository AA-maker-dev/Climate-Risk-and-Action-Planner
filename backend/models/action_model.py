import os
from typing import Dict, List, Any
import json
from datetime import datetime

class ActionPlannerAI:
    """AI model for generating climate action recommendations"""
    
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY", "")
        self.action_database = self._load_action_database()
    
    def generate_action_plan(
        self,
        risk_assessment: Dict[str, Any],
        user_profile: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Generate personalized action plan based on risk assessment"""
        
        location = risk_assessment.get("location", "Unknown")
        risk_level = risk_assessment.get("risk_level", "moderate")
        risk_breakdown = risk_assessment.get("risk_breakdown", {})
        top_risks = risk_assessment.get("top_risks", [])
        
        # Generate actions for top risks
        actions = []
        for risk in top_risks:
            risk_type = risk["type"]
            risk_score = risk["score"]
            
            risk_actions = self._get_actions_for_risk(risk_type, risk_score, user_profile)
            actions.extend(risk_actions)
        
        # Add general preparedness actions
        general_actions = self._get_general_preparedness_actions(risk_level)
        actions.extend(general_actions)
        
        # Prioritize actions
        prioritized_actions = self._prioritize_actions(actions, risk_level)
        
        # Calculate estimated impact and cost
        total_cost = sum(action.get("estimated_cost", 0) for action in prioritized_actions)
        avg_impact = sum(action.get("impact_score", 50) for action in prioritized_actions) / len(prioritized_actions) if prioritized_actions else 0
        
        return {
            "location": location,
            "risk_level": risk_level,
            "actions": prioritized_actions,
            "total_actions": len(prioritized_actions),
            "estimated_total_cost": round(total_cost, 2),
            "estimated_impact": round(avg_impact, 2),
            "timeline": self._generate_timeline(prioritized_actions),
            "generated_at": datetime.utcnow().isoformat()
        }
    
    def _load_action_database(self) -> Dict[str, List[Dict]]:
        """Load action recommendations database"""
        return {
            "flood": [
                {
                    "title": "Install Flood Barriers",
                    "description": "Install flood barriers or sandbags around vulnerable entry points",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 500,
                    "impact_score": 80,
                    "timeframe": "immediate"
                },
                {
                    "title": "Elevate Critical Systems",
                    "description": "Raise electrical panels, HVAC systems, and appliances above potential flood levels",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 2000,
                    "impact_score": 85,
                    "timeframe": "short-term"
                },
                {
                    "title": "Improve Drainage",
                    "description": "Clear gutters and improve yard drainage to redirect water away from structures",
                    "category": "maintenance",
                    "priority": "medium",
                    "estimated_cost": 300,
                    "impact_score": 60,
                    "timeframe": "immediate"
                },
                {
                    "title": "Purchase Flood Insurance",
                    "description": "Obtain flood insurance coverage for property protection",
                    "category": "financial",
                    "priority": "high",
                    "estimated_cost": 1000,
                    "impact_score": 90,
                    "timeframe": "immediate"
                }
            ],
            "wildfire": [
                {
                    "title": "Create Defensible Space",
                    "description": "Clear vegetation within 30 feet of structures to create a defensible space",
                    "category": "landscaping",
                    "priority": "critical",
                    "estimated_cost": 800,
                    "impact_score": 90,
                    "timeframe": "immediate"
                },
                {
                    "title": "Use Fire-Resistant Materials",
                    "description": "Replace roof and siding with fire-resistant materials",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 5000,
                    "impact_score": 85,
                    "timeframe": "medium-term"
                },
                {
                    "title": "Install Fire Detection Systems",
                    "description": "Install smoke detectors and fire suppression systems",
                    "category": "safety",
                    "priority": "high",
                    "estimated_cost": 1500,
                    "impact_score": 75,
                    "timeframe": "short-term"
                },
                {
                    "title": "Prepare Evacuation Kit",
                    "description": "Prepare emergency evacuation kit with essentials and important documents",
                    "category": "preparedness",
                    "priority": "critical",
                    "estimated_cost": 200,
                    "impact_score": 80,
                    "timeframe": "immediate"
                }
            ],
            "hurricane": [
                {
                    "title": "Install Storm Shutters",
                    "description": "Install hurricane shutters or impact-resistant windows",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 3000,
                    "impact_score": 85,
                    "timeframe": "short-term"
                },
                {
                    "title": "Reinforce Roof",
                    "description": "Strengthen roof structure and secure roof shingles",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 4000,
                    "impact_score": 80,
                    "timeframe": "medium-term"
                },
                {
                    "title": "Secure Outdoor Items",
                    "description": "Create plan to secure or store outdoor furniture and equipment",
                    "category": "preparedness",
                    "priority": "medium",
                    "estimated_cost": 100,
                    "impact_score": 60,
                    "timeframe": "immediate"
                },
                {
                    "title": "Stock Emergency Supplies",
                    "description": "Maintain 7-day supply of water, food, and medications",
                    "category": "preparedness",
                    "priority": "critical",
                    "estimated_cost": 300,
                    "impact_score": 90,
                    "timeframe": "immediate"
                }
            ],
            "drought": [
                {
                    "title": "Install Water-Efficient Fixtures",
                    "description": "Replace fixtures with low-flow toilets, faucets, and showerheads",
                    "category": "infrastructure",
                    "priority": "medium",
                    "estimated_cost": 600,
                    "impact_score": 70,
                    "timeframe": "short-term"
                },
                {
                    "title": "Implement Rainwater Harvesting",
                    "description": "Install rainwater collection system for irrigation",
                    "category": "infrastructure",
                    "priority": "medium",
                    "estimated_cost": 1500,
                    "impact_score": 75,
                    "timeframe": "medium-term"
                },
                {
                    "title": "Plant Drought-Resistant Vegetation",
                    "description": "Replace lawn with native, drought-tolerant plants",
                    "category": "landscaping",
                    "priority": "high",
                    "estimated_cost": 1000,
                    "impact_score": 80,
                    "timeframe": "short-term"
                },
                {
                    "title": "Optimize Irrigation",
                    "description": "Install smart irrigation controllers and drip irrigation systems",
                    "category": "infrastructure",
                    "priority": "medium",
                    "estimated_cost": 800,
                    "impact_score": 70,
                    "timeframe": "short-term"
                }
            ],
            "heatwave": [
                {
                    "title": "Improve Home Insulation",
                    "description": "Add insulation to attic and walls to maintain cool temperatures",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 2000,
                    "impact_score": 75,
                    "timeframe": "medium-term"
                },
                {
                    "title": "Install Reflective Roofing",
                    "description": "Use cool roof technology or reflective coating to reduce heat absorption",
                    "category": "infrastructure",
                    "priority": "medium",
                    "estimated_cost": 3500,
                    "impact_score": 70,
                    "timeframe": "medium-term"
                },
                {
                    "title": "Plant Shade Trees",
                    "description": "Plant trees strategically to provide natural cooling and shade",
                    "category": "landscaping",
                    "priority": "medium",
                    "estimated_cost": 400,
                    "impact_score": 65,
                    "timeframe": "long-term"
                },
                {
                    "title": "Upgrade HVAC System",
                    "description": "Install energy-efficient air conditioning with backup power",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 5000,
                    "impact_score": 85,
                    "timeframe": "medium-term"
                }
            ],
            "sea_level_rise": [
                {
                    "title": "Elevate Property",
                    "description": "Raise foundation or consider relocation for long-term protection",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 15000,
                    "impact_score": 90,
                    "timeframe": "long-term"
                },
                {
                    "title": "Install Coastal Barriers",
                    "description": "Build seawalls or living shorelines for erosion protection",
                    "category": "infrastructure",
                    "priority": "high",
                    "estimated_cost": 10000,
                    "impact_score": 80,
                    "timeframe": "medium-term"
                },
                {
                    "title": "Improve Drainage Systems",
                    "description": "Install pumps and enhanced drainage to manage water intrusion",
                    "category": "infrastructure",
                    "priority": "medium",
                    "estimated_cost": 3000,
                    "impact_score": 70,
                    "timeframe": "short-term"
                },
                {
                    "title": "Review Insurance Coverage",
                    "description": "Ensure adequate flood and coastal property insurance",
                    "category": "financial",
                    "priority": "critical",
                    "estimated_cost": 1500,
                    "impact_score": 85,
                    "timeframe": "immediate"
                }
            ]
        }
    
    def _get_actions_for_risk(
        self,
        risk_type: str,
        risk_score: float,
        user_profile: Dict = None
    ) -> List[Dict]:
        """Get actions for specific risk type"""
        actions = self.action_database.get(risk_type, [])
        
        # Filter actions based on risk score
        if risk_score > 70:
            # High risk - include all actions
            return actions.copy()
        elif risk_score > 40:
            # Moderate risk - prioritize critical and high priority
            return [a for a in actions if a["priority"] in ["critical", "high"]]
        else:
            # Low risk - only critical actions
            return [a for a in actions if a["priority"] == "critical"]
    
    def _get_general_preparedness_actions(self, risk_level: str) -> List[Dict]:
        """Get general preparedness actions"""
        general_actions = [
            {
                "title": "Create Emergency Plan",
                "description": "Develop a family emergency plan with evacuation routes and meeting points",
                "category": "preparedness",
                "priority": "critical",
                "estimated_cost": 0,
                "impact_score": 85,
                "timeframe": "immediate"
            },
            {
                "title": "Build Emergency Kit",
                "description": "Assemble emergency supplies: water, food, first aid, flashlight, radio",
                "category": "preparedness",
                "priority": "critical",
                "estimated_cost": 150,
                "impact_score": 90,
                "timeframe": "immediate"
            },
            {
                "title": "Document Property",
                "description": "Take photos/videos of property and belongings for insurance purposes",
                "category": "preparedness",
                "priority": "high",
                "estimated_cost": 0,
                "impact_score": 70,
                "timeframe": "immediate"
            }
        ]
        
        return general_actions
    
    def _prioritize_actions(self, actions: List[Dict], risk_level: str) -> List[Dict]:
        """Prioritize actions based on impact and urgency"""
        priority_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
        
        # Sort by priority and impact score
        sorted_actions = sorted(
            actions,
            key=lambda x: (priority_order.get(x["priority"], 0), x["impact_score"]),
            reverse=True
        )
        
        return sorted_actions
    
    def _generate_timeline(self, actions: List[Dict]) -> Dict[str, List[str]]:
        """Generate implementation timeline"""
        timeline = {
            "immediate": [],
            "short-term": [],
            "medium-term": [],
            "long-term": []
        }
        
        for action in actions:
            timeframe = action.get("timeframe", "short-term")
            timeline[timeframe].append(action["title"])
        
        return timeline

action_planner_ai = ActionPlannerAI()
