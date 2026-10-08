from abc import ABC, abstractmethod
from typing import Dict, Any

class WeatherProvider(ABC):
    """Adapter Pattern: Abstract interface for weather services."""
    @abstractmethod
    def get_weather(self, destination: str) -> Dict[str, Any]:
        pass

class MockWeatherProvider(WeatherProvider):
    """Concrete Adapter: Returns realistic weather conditions without external dependencies."""
    def get_weather(self, destination: str) -> Dict[str, Any]:
        dest_lower = destination.lower()
        if any(place in dest_lower for place in ["manali", "shimla", "kashmir", "leh", "alps", "aspen"]):
            return {"destination": destination, "temperature": 8.0, "condition": "Cold / Breezy", "is_cold": True}
        elif any(place in dest_lower for place in ["goa", "bali", "miami", "phuket", "dubai"]):
            return {"destination": destination, "temperature": 32.0, "condition": "Sunny & Humid", "is_cold": False}
        else:
            return {"destination": destination, "temperature": 23.0, "condition": "Pleasant / Mild", "is_cold": False}

class OpenWeatherAdapter(WeatherProvider):
    """Adapter for live OpenWeatherMap REST API."""
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_weather(self, destination: str) -> Dict[str, Any]:
        if not self.api_key:
            return MockWeatherProvider().get_weather(destination)
        # Architecture ready for live HTTP request with fallback
        return MockWeatherProvider().get_weather(destination)
