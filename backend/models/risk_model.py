import numpy as np
from typing import Dict, List, Any
from datetime import datetime
import json

class RiskAssessmentAI:
    """AI model for climate risk assessment"""
    
    def __init__(self):
        self.risk_factors = {
            "flood": ["precipitation", "elevation", "proximity_to_water", "drainage"],
            "wildfire": ["temperature", "humidity", "vegetation", "wind_speed"],
            "hurricane": ["coastal_proximity", "wind_speed", "pressure", "temperature"],
            "drought": ["precipitation", "temperature", "soil_moisture", "historical_patterns"],
            "heatwave": ["temperature", "humidity", "urban_density", "historical_patterns"],
            "sea_level_rise": ["coastal_proximity", "elevation", "land_subsidence"]
        }
        
        # Risk thresholds
        self.risk_thresholds = {
            "low": (0, 30),
            "moderate": (30, 60),
            "high": (60, 80),
            "critical": (80, 100)
        }
    
    def assess_risk(
        self,
        location: str,
        lat: float,
        lon: float,
        climate_data: Dict[str, Any],
        historical_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Assess climate risks for a location"""
        
        # Calculate individual risk scores
        risk_scores = {}
        risk_scores["flood"] = self._assess_flood_risk(lat, lon, climate_data, historical_data)
        risk_scores["wildfire"] = self._assess_wildfire_risk(lat, lon, climate_data, historical_data)
        risk_scores["hurricane"] = self._assess_hurricane_risk(lat, lon, climate_data, historical_data)
        risk_scores["drought"] = self._assess_drought_risk(lat, lon, climate_data, historical_data)
        risk_scores["heatwave"] = self._assess_heatwave_risk(lat, lon, climate_data, historical_data)
        risk_scores["sea_level_rise"] = self._assess_sea_level_rise_risk(lat, lon, climate_data, historical_data)
        
        # Calculate overall risk score
        overall_score = np.mean(list(risk_scores.values()))
        
        # Determine risk level
        risk_level = self._get_risk_level(overall_score)
        
        # Identify top risks
        top_risks = sorted(risk_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return {
            "location": location,
            "latitude": lat,
            "longitude": lon,
            "overall_risk_score": round(overall_score, 2),
            "risk_level": risk_level,
            "risk_breakdown": {k: round(v, 2) for k, v in risk_scores.items()},
            "top_risks": [{"type": risk, "score": round(score, 2)} for risk, score in top_risks],
            "assessment_date": datetime.utcnow().isoformat(),
            "confidence": self._calculate_confidence(climate_data, historical_data)
        }
    
    def _assess_flood_risk(self, lat: float, lon: float, climate_data: Dict, historical_data: Dict) -> float:
        """Assess flood risk based on precipitation and location factors"""
        base_score = 20
        
        # Precipitation factor
        precipitation = climate_data.get("humidity", 50)
        if precipitation > 70:
            base_score += 30
        elif precipitation > 50:
            base_score += 15
        
        # Coastal proximity (simplified - based on latitude)
        if abs(lat) < 45:  # Temperate and tropical regions
            base_score += 10
        
        # Historical data
        if historical_data and "historical_data" in historical_data:
            recent_data = historical_data["historical_data"][:3]
            avg_precip = np.mean([d.get("total_precipitation", 0) for d in recent_data])
            if avg_precip > 150:
                base_score += 20
        
        return min(base_score, 100)
    
    def _assess_wildfire_risk(self, lat: float, lon: float, climate_data: Dict, historical_data: Dict) -> float:
        """Assess wildfire risk"""
        base_score = 15
        
        # Temperature and humidity
        temp = climate_data.get("temperature", 15)
        humidity = climate_data.get("humidity", 50)
        
        if temp > 30 and humidity < 30:
            base_score += 40
        elif temp > 25 and humidity < 40:
            base_score += 25
        elif temp > 20:
            base_score += 10
        
        # Wind speed
        wind_speed = climate_data.get("wind_speed", 0)
        if wind_speed > 10:
            base_score += 15
        elif wind_speed > 5:
            base_score += 8
        
        # Seasonal factor (Northern Hemisphere summer)
        current_month = datetime.utcnow().month
        if lat > 0 and 6 <= current_month <= 9:
            base_score += 10
        elif lat < 0 and (current_month <= 3 or current_month >= 11):
            base_score += 10
        
        return min(base_score, 100)
    
    def _assess_hurricane_risk(self, lat: float, lon: float, climate_data: Dict, historical_data: Dict) -> float:
        """Assess hurricane/cyclone risk"""
        base_score = 10
        
        # Latitude-based risk (hurricanes form in tropical regions)
        abs_lat = abs(lat)
        if 5 < abs_lat < 30:
            base_score += 30
        elif abs_lat < 5:
            base_score += 10  # Too close to equator
        else:
            base_score += 5
        
        # Temperature factor
        temp = climate_data.get("temperature", 15)
        if temp > 26:
            base_score += 20
        
        # Pressure factor
        pressure = climate_data.get("pressure", 1013)
        if pressure < 1000:
            base_score += 25
        
        # Wind speed
        wind_speed = climate_data.get("wind_speed", 0)
        if wind_speed > 15:
            base_score += 15
        
        return min(base_score, 100)
    
    def _assess_drought_risk(self, lat: float, lon: float, climate_data: Dict, historical_data: Dict) -> float:
        """Assess drought risk"""
        base_score = 20
        
        # Humidity and precipitation
        humidity = climate_data.get("humidity", 50)
        if humidity < 30:
            base_score += 30
        elif humidity < 50:
            base_score += 15
        
        # Historical precipitation trends
        if historical_data and "historical_data" in historical_data:
            recent_data = historical_data["historical_data"][:6]
            avg_precip = np.mean([d.get("total_precipitation", 0) for d in recent_data])
            if avg_precip < 50:
                base_score += 25
            elif avg_precip < 100:
                base_score += 10
        
        # Temperature factor
        temp = climate_data.get("temperature", 15)
        if temp > 30:
            base_score += 15
        
        return min(base_score, 100)
    
    def _assess_heatwave_risk(self, lat: float, lon: float, climate_data: Dict, historical_data: Dict) -> float:
        """Assess heatwave risk"""
        base_score = 15
        
        # Temperature
        temp = climate_data.get("temperature", 15)
        if temp > 35:
            base_score += 40
        elif temp > 30:
            base_score += 25
        elif temp > 25:
            base_score += 10
        
        # Humidity amplifies heat stress
        humidity = climate_data.get("humidity", 50)
        if temp > 28 and humidity > 60:
            base_score += 20
        
        # Historical trend
        if historical_data and "trends" in historical_data:
            if historical_data["trends"].get("temperature_trend") == "increasing":
                base_score += 15
        
        return min(base_score, 100)
    
    def _assess_sea_level_rise_risk(self, lat: float, lon: float, climate_data: Dict, historical_data: Dict) -> float:
        """Assess sea level rise risk"""
        base_score = 10
        
        # Coastal proximity (simplified estimation)
        # In a real system, we'd use actual elevation and distance to coast data
        abs_lat = abs(lat)
        
        # Higher risk for low-lying coastal areas
        if abs_lat < 60:  # Not in polar regions
            base_score += 25
        
        # Temperature trend (warming = more melting)
        if historical_data and "trends" in historical_data:
            if historical_data["trends"].get("temperature_trend") == "increasing":
                base_score += 20
        
        return min(base_score, 100)
    
    def _get_risk_level(self, score: float) -> str:
        """Convert risk score to risk level"""
        for level, (min_score, max_score) in self.risk_thresholds.items():
            if min_score <= score < max_score:
                return level
        return "critical"
    
    def _calculate_confidence(self, climate_data: Dict, historical_data: Dict) -> float:
        """Calculate confidence score for the assessment"""
        confidence = 70  # Base confidence
        
        # Increase confidence if we have complete data
        if climate_data:
            confidence += 10
        
        if historical_data and "historical_data" in historical_data:
            if len(historical_data["historical_data"]) >= 12:
                confidence += 15
            else:
                confidence += 5
        
        return min(confidence, 95)

risk_assessment_ai = RiskAssessmentAI()
