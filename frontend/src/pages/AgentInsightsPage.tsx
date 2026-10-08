import React, { useState, useEffect } from 'react';
import { 
  Bot, Terminal, Cpu, Play, CheckCircle2, Clock, 
  Workflow, Database, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { api } from '../services/api';
import { AgentChatResponse, AgentMemory } from '../types';

export const AgentInsightsPage: React.FC = () => {
  const [query, setQuery] = useState<string>('Style me for a high-stakes corporate presentation in rainy London.');
  const [running, setRunning] = useState<boolean>(false);
  const [agentResponse, setAgentResponse] = useState<AgentChatResponse | null>(null);
  const [memory, setMemory] = useState<AgentMemory | null>(null);
  const [tools, setTools] = useState<any[]>([]);

  const PRESETS = [
    'Style me for a high-stakes corporate presentation in rainy London.',
    'I need an authentic traditional guest look for a royal wedding ceremony.',
    'Recommend a casual minimalist weekend brunch outfit from my wardrobe.',
    'Suggest accessories and shoes to complete my charcoal navy tailored suit.'
  ];

  useEffect(() => {
    async function loadMeta() {
      try {
        const [memRes, toolsRes] = await Promise.all([
          api.getAgentMemory().catch(() => null),
          api.getAgentTools().catch(() => ({ tools: [] }))
        ]);
        if (memRes) setMemory(memRes);
        setTools(toolsRes.tools);
      } catch (err) {
        console.error(err);
      }
    }
    loadMeta();
  }, []);

  const handleRunAgent = async (promptText?: string) => {
    const q = promptText || query;
    setRunning(true);
    try {
      const res = await api.agentChat(q);
      setAgentResponse(res);
      const memRes = await api.getAgentMemory().catch(() => null);
      if (memRes) setMemory(memRes);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Autonomous Neural Agent</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
            Autonomous Agent Insights & Execution Trace
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Real-time inspection of the Agent Planning loop: Intent Analysis, Subgoal Decomposition, Command-Pattern Tool Invocations, Memory Recall, and Output Synthesis.
          </p>
        </div>

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono text-zinc-300">
          <Database className="w-4 h-4 text-violet-400" />
          <span>Active Tools: {tools.length || 14} Registered</span>
        </div>
      </div>

      <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 mt-8 shadow-sm">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
          Test Autonomous Agent Prompt
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs px-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
          />
          <button
            onClick={() => handleRunAgent()}
            disabled={running}
            className="py-3 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-medium text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            {running ? <Clock className="w-4 h-4 animate-spin text-amber-300" /> : <Play className="w-4 h-4 text-amber-300" />}
            <span>Execute Agent Trace</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => { setQuery(p); handleRunAgent(p); }}
              className="text-[11px] px-3 py-1.5 bg-zinc-950 border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:border-violet-500/50 transition-all"
            >
              Preset {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {agentResponse && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 block mb-1">
                Step 1: Intent Classification
              </span>
              <h3 className="font-serif-luxury text-xl font-bold text-white mb-3">
                {agentResponse.intent.replace('_', ' ').toUpperCase()}
              </h3>

              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                Step 2: Subgoal Decomposition Graph
              </span>
              <div className="space-y-2 bg-zinc-950/80 p-3.5 rounded-xl border border-white/10">
                {agentResponse.plan_summary.map((sub, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block mb-3">
                Step 4: Persistent Memory Recall
              </span>
              <div className="bg-zinc-950/80 p-4 rounded-xl border border-white/10 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Preferred Styles:</span>
                  <span className="font-medium text-white">
                    {memory?.preferred_styles.join(', ') || 'Smart Casual, Minimalist'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Color Affinities:</span>
                  <span className="font-medium text-emerald-400">
                    {memory?.preferred_colors.join(', ') || 'Black, Navy, Cream, Terracotta'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Avoided Tones:</span>
                  <span className="font-medium text-amber-400">
                    {memory?.avoided_colors.join(', ') || 'Neon Green'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                  Step 3: Tool Execution Traces ({agentResponse.traces.length})
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  Total Score: <span className="text-violet-400 font-bold">{agentResponse.final_score.toFixed(1)} / 10</span>
                </span>
              </div>

              <div className="space-y-3">
                {agentResponse.traces.map((trace) => (
                  <div key={trace.step_num} className="bg-zinc-950/80 p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] flex items-center justify-center font-bold">
                          {trace.step_num}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">{trace.tool_name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                        {trace.duration_ms} ms
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400">{trace.description}</p>
                    <div className="bg-zinc-900/90 border border-white/5 p-2 rounded-lg text-[11px] font-mono text-zinc-300 truncate">
                      Output: {trace.output_summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-violet-500/30 text-white p-6 rounded-2xl shadow-xl space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400 block">
                Step 5: Synthesized Agent Output
              </span>
              <p className="text-sm leading-relaxed text-zinc-200">
                {agentResponse.reply}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 mt-10 shadow-sm">
        <h3 className="font-serif-luxury text-xl font-bold text-white mb-4">
          Registered Agent Tools Directory (Command Pattern)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-400">
            <thead className="bg-zinc-950 text-white uppercase tracking-wider font-bold border-b border-white/10">
              <tr>
                <th className="p-3">Tool Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tools.map((t, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-violet-400">{t.name}</td>
                  <td className="p-3 uppercase text-[10px] text-amber-400 font-semibold">{t.category}</td>
                  <td className="p-3 text-zinc-300">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
