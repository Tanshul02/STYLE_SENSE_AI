import React, { useState, useEffect } from 'react';
import { Activity, Server, Database, Cloud, Cpu, HardDrive, RefreshCw, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { CloudMetrics } from '../types';

export const CloudMonitorPage: React.FC = () => {
  const [metrics, setMetrics] = useState<CloudMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await api.getCloudMetrics();
      setMetrics(data);
    } catch (err) {
      console.warn('Error loading telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <div className="min-h-screen py-8 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-2">
              <Activity className="w-4 h-4" />
              <span>Cloud Computing Evaluation Dashboard</span>
            </div>
            <h1 className="font-serif-luxury text-4xl font-bold text-white">Cloud Architecture Telemetry</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Live telemetry tracking SaaS, PaaS, DBaaS, Cloud Storage, and AIaaS microservices.
            </p>
          </div>

          <button
            onClick={loadMetrics}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-xs font-semibold text-white flex items-center space-x-2 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-300' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* Telemetry Metric Cards */}
        {metrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-zinc-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-sm space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">API Throughput</span>
              <div className="text-3xl font-extrabold text-white">{metrics.total_api_requests}</div>
              <p className="text-[11px] text-emerald-400 font-medium">FastAPI HTTP Inferences</p>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-sm space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">AI Recommendation Queries</span>
              <div className="text-3xl font-extrabold text-violet-400">{metrics.ai_recommendation_requests}</div>
              <p className="text-[11px] text-zinc-400">Hybrid Scoring Engine</p>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-sm space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Storage Footprint</span>
              <div className="text-3xl font-extrabold text-amber-400">{metrics.storage_usage_mb} MB</div>
              <p className="text-[11px] text-zinc-400">Supabase Storage Buckets</p>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-sm space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Average Latency</span>
              <div className="text-3xl font-extrabold text-indigo-400">{metrics.average_response_time_ms} ms</div>
              <p className="text-[11px] text-emerald-400 font-medium">Stateless Container Execution</p>
            </div>
          </div>
        )}

        {/* Cloud Computing Concepts Mapping Table */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-sm space-y-4">
          <h3 className="font-serif-luxury text-xl font-bold text-white">Cloud Computing Service Map</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Cloud Concept</th>
                  <th className="pb-3 font-semibold">Architecture Implementation</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 font-bold text-white">SaaS</td>
                  <td className="py-3 text-zinc-300">StyleSense AI Web Application (React 19 / Vite / Tailwind)</td>
                  <td className="py-3 text-emerald-400 font-semibold font-mono">ONLINE</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white">PaaS</td>
                  <td className="py-3 text-zinc-300">FastAPI Stateless Container Backend</td>
                  <td className="py-3 text-emerald-400 font-semibold font-mono">HEALTHY</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white">DBaaS</td>
                  <td className="py-3 text-zinc-300">Supabase PostgreSQL / Resilient SQLAlchemy engine</td>
                  <td className="py-3 text-emerald-400 font-semibold font-mono">CONNECTED</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white">Cloud Storage</td>
                  <td className="py-3 text-zinc-300">Supabase Storage Buckets for Wardrobe & Try-On Photos</td>
                  <td className="py-3 text-emerald-400 font-semibold font-mono">READY</td>
                </tr>
                <tr>
                  <td className="py-3 font-bold text-white">AIaaS</td>
                  <td className="py-3 text-zinc-300">Hugging Face Inference API / Local Bestie Reasoning Engine</td>
                  <td className="py-3 text-emerald-400 font-semibold font-mono">ACTIVE</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Activity Log */}
        {metrics && (
          <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-sm space-y-4">
            <h3 className="font-serif-luxury text-xl font-bold text-white">Recent Cloud Activity Stream</h3>
            <div className="space-y-3">
              {metrics.recent_activities.map((act, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-zinc-950/70 border border-white/5 rounded-xl text-xs">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">{act.action}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-zinc-400">
                    <span className="font-mono text-zinc-300">{act.latency}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-semibold text-emerald-400 font-mono">{act.status}</span>
                    <span className="text-zinc-500">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
