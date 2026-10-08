import React from 'react';
import { Shield, Cloud, Key, Bell, Database } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-8 pb-24 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">System Preferences</span>
          <h1 className="font-serif-luxury text-4xl font-bold text-white">Settings & Cloud Integrations</h1>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-xl space-y-6 text-xs text-zinc-400">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="space-y-1">
              <span className="font-bold text-sm text-white">Supabase Cloud Sync</span>
              <p>PostgreSQL DBaaS with Row Level Security (RLS) active</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold font-mono">Active</span>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="space-y-1">
              <span className="font-bold text-sm text-white">AI Provider Dynamic Fallback</span>
              <p>Factory Pattern fallback enabled (Google Gemini Flash / OpenAI / Hugging Face)</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold font-mono">Ready</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="font-bold text-sm text-white">Containerization Readiness</span>
              <p>Stateless FastAPI backend compliant with Docker / Kubernetes</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-zinc-800 border border-white/10 text-zinc-300 font-semibold font-mono">Docker Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
