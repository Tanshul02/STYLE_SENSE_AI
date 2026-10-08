import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Cloud, GitBranch, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950/80 backdrop-blur-2xl text-zinc-400 border-t border-white/10 pt-16 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-serif-luxury font-bold text-white text-sm">
                S
              </div>
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-white">StyleSense</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 px-1.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">AI</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Autonomous personal luxury fashion agent & intelligent digital fitting studio. Neural vision draping, multi-dimensional styling algorithms, and real-time conversational styling.
            </p>
            <div className="pt-2 text-[11px] text-zinc-500 font-mono">
              Obsidian Glass Architecture &bull; 256-Bit Cryptographic Checkout
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Luxury Experience</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/shop" className="hover:text-white transition">Luxury Boutique</Link></li>
              <li><Link to="/try-on" className="hover:text-white transition">Virtual Try-On Studio</Link></li>
              <li><Link to="/wardrobe" className="hover:text-white transition">Smart Wardrobe</Link></li>
              <li><Link to="/ai-fit-studio" className="hover:text-white transition">AI Fit Canvas</Link></li>
              <li><Link to="/should-i-wear-this" className="hover:text-white transition">Context Evaluator</Link></li>
              <li><Link to="/travel-assistant" className="hover:text-white transition">Capsule Packing AI</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Autonomous Intelligence</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                <Link to="/ai-fit-studio" className="hover:text-white transition">Neural Drape Simulation</Link>
              </li>
              <li className="flex items-center space-x-2">
                <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                <Link to="/admin/cloud-monitor" className="hover:text-white transition">Cloud Telemetry & SLA</Link>
              </li>
              <li className="flex items-center space-x-2">
                <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                <Link to="/compare-looks" className="hover:text-white transition">Style Variant Scoring</Link>
              </li>
              <li className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <Link to="/agent-insights" className="hover:text-white transition">Agent Reasoning Engine</Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-violet-400 mb-4">Enterprise Engineering</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-full text-zinc-300">FastAPI</span>
              <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-full text-zinc-300">React 19</span>
              <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-full text-zinc-300">Tailwind v4</span>
              <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-full text-zinc-300">Docker</span>
              <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-full text-zinc-300">Pytest</span>
              <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-full text-zinc-300">HuggingFace VTON</span>
            </div>
            <p className="text-[11px] text-zinc-500 pt-2">
              Stateless high-throughput microservices architecture with client-side fallback canvas compositor.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500">
          <p>© 2026 StyleSense AI Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              99.98% System Uptime
            </span>
            <span>Zero-Trust API Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
