from app.agents.tool_registry import ToolRegistry
from app.agents.agent_planner import AgentPlanner
from app.agents.agent_memory import UserFashionMemory
from app.agents.fashion_agent import FashionAgent

def test_tool_registry_and_tools():
    ToolRegistry.initialize()
    tools = ToolRegistry.list_tools()
    assert len(tools) >= 11
    tool_names = [t["name"] for t in tools]
    assert "WardrobeTool" in tool_names
    assert "OutfitGeneratorTool" in tool_names
    assert "OutfitScoringTool" in tool_names
    assert "ColorHarmonyTool" in tool_names
    assert "ProductSearchTool" in tool_names
    assert "PreferenceLearningTool" in tool_names

def test_agent_planner_intent_classification():
    p1 = AgentPlanner.plan("I need an outfit for my best friend's traditional wedding ceremony", {})
    assert p1["intent"] == "traditional_event_styling"
    assert "OccasionTool" in p1["tools_sequence"]

    p2 = AgentPlanner.plan("What should I wear to a corporate executive interview?", {})
    assert p2["intent"] == "professional_styling"
    assert "OutfitScoringTool" in p2["tools_sequence"]

def test_agent_memory_and_feedback():
    memory = UserFashionMemory.get_memory("test_user_42")
    memory.record_feedback("outfit_123", rating=9.5, comments="Loved the navy blazer!")
    memory.learn_color_affinity("Terracotta", positive=True)
    memory.learn_color_affinity("Neon Yellow", positive=False)
    
    data = memory.to_dict()
    assert "Terracotta" in data["preferred_colors"]
    assert "Neon Yellow" in data["avoided_colors"]
    assert data["feedback_count"] >= 1
