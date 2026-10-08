"""
StyleSense AI - Tool Registry
Registers all 11 Agent tools and exposes metadata, schemas, and execution dispatches.
"""
from typing import Dict, List, Any
from app.agent_tools.base import AgentTool
from app.agent_tools.tools import (
    WardrobeTool, OutfitGeneratorTool, OutfitScoringTool,
    OccasionTool, ColorHarmonyTool, StyleCompatibilityTool,
    AccessoryTool, ProductSearchTool, VirtualTryOnTool,
    WeatherTool, PreferenceLearningTool, OutfitPairingsTool, ShippingEtaTool,
    DestinationStylingTool, DeliveryExpediterTool, StylePairingTool
)

class ToolRegistry:
    _tools: Dict[str, AgentTool] = {}

    @classmethod
    def initialize(cls):
        if not cls._tools:
            instances = [
                WardrobeTool(), OutfitGeneratorTool(), OutfitScoringTool(),
                OccasionTool(), ColorHarmonyTool(), StyleCompatibilityTool(),
                AccessoryTool(), ProductSearchTool(), VirtualTryOnTool(),
                WeatherTool(), PreferenceLearningTool(), OutfitPairingsTool(), ShippingEtaTool(),
                DestinationStylingTool(), DeliveryExpediterTool(), StylePairingTool()
            ]
            for t in instances:
                cls._tools[t.name] = t

    @classmethod
    def get_tool(cls, name: str) -> AgentTool:
        cls.initialize()
        if name not in cls._tools:
            raise ValueError(f"Tool '{name}' is not registered.")
        return cls._tools[name]

    @classmethod
    def list_tools(cls) -> List[Dict[str, str]]:
        cls.initialize()
        return [
            {"name": t.name, "description": t.description, "category": t.category}
            for t in cls._tools.values()
        ]

    @classmethod
    def execute_tool(cls, name: str, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        tool = cls.get_tool(name)
        return tool.execute(params, context)
