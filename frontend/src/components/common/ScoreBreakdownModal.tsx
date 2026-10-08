import React from 'react';
import { X, Award, Info } from 'lucide-react';
import { ScoreBreakdown } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  breakdown: ScoreBreakdown;
  outfitTitle: string;
}

export const ScoreBreakdownModal: React.FC<Props> = ({ isOpen, onClose, breakdown, outfitTitle }) => {
  if (!isOpen) return null;

  const metrics = [
    { label: 'Occasion & Formality Match', weight: '30%', score: breakdown.occasion_match, color: 'bg-emerald-500' },
    { label: 'Style Compatibility', weight: '25%', score: breakdown.style_compatibility, color: 'bg-violet-500' },
    { label: 'Color Palette Harmony', weight: '20%', score: breakdown.color_compatibility, color: 'bg-amber-400' },
    { label: 'Weather & Temp Suitability', weight: '15%', score: breakdown.weather_compatibility, color: 'bg-sky-400' },
    { label: 'User Preferences Alignment', weight: '10%', score: breakdown.user_preference_match, color: 'bg-rose-400' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-900/90 backdrop-blur-2xl max-w-lg w-full rounded-2xl shadow-2xl border border-white/10 p-6 space-y-6 text-white">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-violet-400" />
            <h3 className="font-serif-luxury text-xl font-bold text-white">Hybrid AI Scoring Analysis</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-zinc-950/80 rounded-xl border border-white/10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Composite Compatibility</span>
            <h4 className="font-serif-luxury text-2xl font-bold text-white">{outfitTitle}</h4>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-violet-400">{breakdown.final_score}%</span>
            <span className="block text-[10px] text-zinc-500">Weighted Formula</span>
          </div>
        </div>

        <div className="p-3 bg-zinc-950/60 rounded-xl border border-white/5 text-xs font-mono text-zinc-300 leading-relaxed flex items-start space-x-2">
          <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <span>Formula: 0.30×Occasion + 0.25×Style + 0.20×Color + 0.15×Weather + 0.10×Preference</span>
        </div>

        <div className="space-y-4">
          {metrics.map((m) => (
            <div key={m.label} className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">{m.label} <span className="text-zinc-500">({m.weight})</span></span>
                <span className="font-bold text-white">{m.score}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${m.color} rounded-full transition-all duration-500`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl transition shadow-lg shadow-violet-500/20"
        >
          Close Analysis
        </button>
      </div>
    </div>
  );
};
