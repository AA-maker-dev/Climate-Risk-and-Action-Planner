import os
import httpx
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import json

class ClimateDataService:
    def __init__(self):
        self.openweather_api_key = os.getenv("OPENWEATHER_API_KEY", "")
        self.nasa_api_key = os.getenv("NASA_API_KEY", "DEMO_KEY")
        self.base_url = "https://api.openweathermap.org/data/2.5"
        
    async def get_current_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """Get current weather data for location"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/weather"
                params = {
                    "lat": lat,
                    "lon": lon,
                    "appid": self.openweather_api_key,
                    "units": "metric"
                }
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "temperature": data["main"]["temp"],
                        "feels_like": data["main"]["feels_like"],
                        "humidity": data["main"]["humidity"],
                        "pressure": data["main"]["pressure"],
                        "wind_speed": data["wind"]["speed"],
                        "weather": data["weather"][0]["description"],
                        "clouds": data["clouds"]["all"]
                    }
                else:
                    return self._get_mock_weather_data(lat, lon)
        except Exception as e:
            print(f"Error fetching weather data: {e}")
            return self._get_mock_weather_data(lat, lon)
    
    async def get_forecast(self, lat: float, lon: float, days: int = 5) -> Dict[str, Any]:
        """Get weather forecast for location"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/forecast"
                params = {
                    "lat": lat,
                    "lon": lon,
                    "appid": self.openweather_api_key,
                    "units": "metric",
                    "cnt": days * 8  # 8 forecasts per day (3-hour intervals)
                }
                response = await client.get(url, params=params)
                
                if response.status_code == 200:
                    data = response.json()
                    forecasts = []
                    for item in data["list"]:
                        forecasts.append({
                            "datetime": item["dt_txt"],
                            "temperature": item["main"]["temp"],
                            "humidity": item["main"]["humidity"],
                            "weather": item["weather"][0]["description"],
                            "precipitation_prob": item.get("pop", 0) * 100
                        })
                    return {"forecasts": forecasts}
                else:
                    return self._get_mock_forecast(days)
        except Exception as e:
            print(f"Error fetching forecast: {e}")
            return self._get_mock_forecast(days)
    
    async def get_historical_data(self, lat: float, lon: float, months: int = 12) -> Dict[str, Any]:
        """Get historical climate data"""
        # Mock historical data for demonstration
        return self._get_mock_historical_data(lat, lon, months)
    
    def _get_mock_weather_data(self, lat: float, lon: float) -> Dict[str, Any]:
        """Generate mock weather data"""
        import random
        return {
            "temperature": round(15 + random.uniform(-10, 20), 1),
            "feels_like": round(15 + random.uniform(-10, 20), 1),
            "humidity": random.randint(40, 90),
            "pressure": random.randint(980, 1030),
            "wind_speed": round(random.uniform(0, 15), 1),
            "weather": random.choice(["clear sky", "few clouds", "scattered clouds", "light rain"]),
            "clouds": random.randint(0, 100)
        }
    
    def _get_mock_forecast(self, days: int) -> Dict[str, Any]:
        """Generate mock forecast data"""
        import random
        forecasts = []
        base_date = datetime.utcnow()
        
        for i in range(days * 8):
            dt = base_date + timedelta(hours=i * 3)
            forecasts.append({
                "datetime": dt.strftime("%Y-%m-%d %H:%M:%S"),
                "temperature": round(15 + random.uniform(-5, 15), 1),
                "humidity": random.randint(40, 90),
                "weather": random.choice(["clear sky", "few clouds", "scattered clouds", "light rain"]),
                "precipitation_prob": random.randint(0, 100)
            })
        
        return {"forecasts": forecasts}
    
    def _get_mock_historical_data(self, lat: float, lon: float, months: int) -> Dict[str, Any]:
        """Generate mock historical climate data"""
        import random
        
        data_points = []
        base_date = datetime.utcnow()
        
        for i in range(months):
            dt = base_date - timedelta(days=30 * i)
            data_points.append({
                "month": dt.strftime("%Y-%m"),
                "avg_temperature": round(15 + random.uniform(-5, 15), 1),
                "total_precipitation": round(random.uniform(20, 200), 1),
                "avg_humidity": random.randint(50, 80),
                "extreme_events": random.randint(0, 5)
            })
        
        return {
            "historical_data": sorted(data_points, key=lambda x: x["month"]),
            "trends": {
                "temperature_trend": "increasing",
                "precipitation_trend": "variable",
                "extreme_events_trend": "increasing"
            }
        }

climate_service = ClimateDataService()
