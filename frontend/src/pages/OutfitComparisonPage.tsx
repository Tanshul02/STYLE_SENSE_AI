import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Award, ArrowRight, RefreshCw, Shirt, CheckCircle2, Trophy 
} from 'lucide-react';
import { api } from '../services/api';
import { ClothingItem, LookComparisonResponse } from '../types';

export const OutfitComparisonPage: React.FC = () => {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [lookAItems, setLookAItems] = useState<ClothingItem[]>([]);
  const [lookBItems, setLookBItems] = useState<ClothingItem[]>([]);
  const [occasion, setOccasion] = useState<string>('Executive Corporate Dinner');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<LookComparisonResponse | null>(null);

  useEffect(() => {
    async function load() {
      const items = await api.getWardrobe();
      setWardrobe(items);
      if (items.length >= 4) {
        setLookAItems([items[0], items[1]]);
        setLookBItems([items[2], items[3]]);
      }
    }
    load();
  }, []);

  const handleCompare = async () => {
    setLoading(true);
    try {
      const res = await api.compareLooks({
        look_a_name: 'Look A (Tailored Monochromatic)',
        look_a_items: lookAItems,
        look_b_name: 'Look B (Contemporary Casual)',
        look_b_items: lookBItems,
        occasion
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Head-to-Head Comparison</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
          Compare Looks &bull; Look A vs Look B
        </h1>
        <p className="text-sm text-zinc-400 mt-2">
          Side-by-side aesthetic benchmarking with explainable 0–10 scoring breakdowns and definitive AI recommendation.
        </p>
      </div>

      <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
            Target Event
          </label>
          <input
            type="text"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            className="text-xs px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 w-full sm:w-72"
          />
        </div>

        <button
          onClick={handleCompare}
          disabled={loading || lookAItems.length === 0 || lookBItems.length === 0}
          className="w-full sm:w-auto py-2.5 px-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-medium text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
              <span>Analyzing Comparative Metrics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Run Head-to-Head Comparison</span>
            </>
          )}
        </button>
      </div>

      {result && (
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-violet-500/30 text-white rounded-2xl p-6 mb-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">Winner Declared</span>
              <h2 className="font-serif-luxury text-2xl font-bold text-white">
                {result.winner_name} 🏆
              </h2>
              <p className="text-xs text-zinc-300 mt-0.5 max-w-xl">{result.reasoning}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 block">Margin</span>
            <span className="font-serif-luxury text-2xl font-bold text-amber-400">
              {result.winner === 'Look A' ? result.score_a : result.score_b} / 10
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`bg-zinc-900/60 backdrop-blur-2xl border rounded-2xl p-6 shadow-md transition-all ${
          result?.winner === 'Look A' ? 'border-amber-400/60 ring-2 ring-amber-400/20' : 'border-white/10'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Option 1</span>
              <h3 className="font-serif-luxury text-xl font-bold text-white">Look A</h3>
            </div>
            {result && (
              <span className="font-serif-luxury text-2xl font-bold text-violet-400">
                {result.score_a.toFixed(1)} / 10
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {lookAItems.map(it => (
              <div key={it.id} className="bg-zinc-950/80 rounded-xl border border-white/10 p-2.5 text-center">
                <img src={it.image_url} alt={it.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
                <p className="text-xs font-semibold text-white truncate">{it.name}</p>
                <p className="text-[10px] text-zinc-400">{it.category}</p>
              </div>
            ))}
          </div>

          {result && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              {Object.entries(result.breakdown_a).map(([k, val]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="capitalize text-zinc-400">{k.replace('_', ' ')}</span>
                  <span className="font-bold text-white">{val} / 10</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`bg-zinc-900/60 backdrop-blur-2xl border rounded-2xl p-6 shadow-md transition-all ${
          result?.winner === 'Look B' ? 'border-amber-400/60 ring-2 ring-amber-400/20' : 'border-white/10'
        }`}>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Option 2</span>
              <h3 className="font-serif-luxury text-xl font-bold text-white">Look B</h3>
            </div>
            {result && (
              <span className="font-serif-luxury text-2xl font-bold text-violet-400">
                {result.score_b.toFixed(1)} / 10
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {lookBItems.map(it => (
              <div key={it.id} className="bg-zinc-950/80 rounded-xl border border-white/10 p-2.5 text-center">
                <img src={it.image_url} alt={it.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
                <p className="text-xs font-semibold text-white truncate">{it.name}</p>
                <p className="text-[10px] text-zinc-400">{it.category}</p>
              </div>
            ))}
          </div>

          {result && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              {Object.entries(result.breakdown_b).map(([k, val]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="capitalize text-zinc-400">{k.replace('_', ' ')}</span>
                  <span className="font-bold text-white">{val} / 10</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
