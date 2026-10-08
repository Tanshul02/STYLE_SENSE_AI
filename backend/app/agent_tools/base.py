"""
StyleSense AI - Command Pattern Base Agent Tool
"""
from abc import ABC, abstractmethod
from typing import Dict, Any

class AgentTool(ABC):
    name: str = "base_tool"
    description: str = "Base tool description"
    category: str = "general"

    @abstractmethod
    def execute(self, params: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        pass
