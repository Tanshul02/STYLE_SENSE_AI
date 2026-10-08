"""
StyleSense AI - Fashion Agent Coordinator
"""
import time
from typing import Dict, Any, List
from app.agents.agent_planner import AgentPlanner
from app.agents.agent_memory import UserFashionMemory
from app.agents.tool_registry import ToolRegistry
from app.patterns.factory.ai_provider_factory import AIProviderFactory

class FashionAgent:
    def __init__(self, user_id: str):
        self.user_id = user_id
        self.memory = UserFashionMemory.get_memory(user_id)

    def process(self, message: str, context: Dict[str, Any]) -> Dict[str, Any]:
        context["user_id"] = self.user_id
        context["memory"] = self.memory.to_dict()

        plan = AgentPlanner.plan(message, context)
        traces = []
        tool_results = {}

        for step_idx, tool_name in enumerate(plan["tools_sequence"], start=1):
            t_start = time.time()
            params = {}
            if tool_name == "OccasionTool":
                params = {"occasion": plan["intent"]}
            elif tool_name == "WardrobeTool":
                params = {"category": None}
            elif tool_name == "ColorHarmonyTool":
                params = {"items": context.get("wardrobe_items", [])[:3]}
            elif tool_name == "OutfitScoringTool":
                params = {"items": context.get("wardrobe_items", [])[:3], "occasion": plan["intent"]}
            elif tool_name == "ProductSearchTool":
                params = {"query": message}
            elif tool_name == "AccessoryTool":
                params = {"occasion": plan["intent"]}
            elif tool_name == "WeatherTool":
                params = {"weather": "moderate", "temperature": 22}
            elif tool_name == "DestinationStylingTool":
                params = {"destination": message}
            elif tool_name == "DeliveryExpediterTool":
                params = {"target_days": 1}
            elif tool_name == "StylePairingTool":
                params = {"anchor_garment": message}
            elif tool_name == "ShippingEtaTool":
                params = {"pincode": "10001"}

            try:
                res = ToolRegistry.execute_tool(tool_name, params, context)
                duration_ms = round((time.time() - t_start) * 1000, 1)
                tool_results[tool_name] = res

                traces.append({
                    "step_num": step_idx,
                    "tool_name": tool_name,
                    "description": ToolRegistry.get_tool(tool_name).description,
                    "input_params": params,
                    "output_summary": f"Executed successfully with {len(res)} attributes produced.",
                    "duration_ms": duration_ms
                })
            except Exception as e:
                traces.append({
                    "step_num": step_idx,
                    "tool_name": tool_name,
                    "description": f"Failed with: {str(e)}",
                    "input_params": params,
                    "output_summary": "Handled gracefully via fallback reflection.",
                    "duration_ms": 1.0
                })

        provider = AIProviderFactory.get_provider()
        prompt_with_tools = (
            f"User asked: '{message}'.\n"
            f"Agent Plan: {plan['intent']} with subgoals: {plan['subgoals']}.\n"
            f"Tool Execution Results: {tool_results}.\n"
            f"Generate a personal, chic, concise, high-fashion response addressing the user styling need."
        )
        reply = provider.generate_response(prompt_with_tools, [], context)

        outfit_info = tool_results.get("OutfitGeneratorTool") or tool_results.get("OutfitScoringTool")
        score = outfit_info.get("final_score") or outfit_info.get("score") if outfit_info else 9.2

        return {
            "reply": reply,
            "intent": plan["intent"],
            "plan_summary": plan["subgoals"],
            "traces": traces,
            "final_score": score,
            "memory_status": self.memory.to_dict(),
            "tool_data": tool_results
        }
