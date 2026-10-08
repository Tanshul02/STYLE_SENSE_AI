import React, { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, AlertCircle, Wand2, Star, 
  ArrowRight, ShieldCheck, Shirt, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import { ClothingItem, ShouldIWearResponse } from '../types';

export const ShouldIWearThisPage: React.FC = () => {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [occasion, setOccasion] = useState<string>('Corporate Executive Interview');
  const [destination, setDestination] = useState<string>('Downtown Office Headquarters');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ShouldIWearResponse | null>(null);

  const OCCASIONS = [
    'Corporate Executive Interview',
    'Black-Tie Gala Evening',
    'Summer Outdoor Wedding',
    'Casual Coffee & Brunch',
    'Campus Lecture & College Fest',
    'International Flight Transit'
  ];

  useEffect(() => {
    async function load() {
      const items = await api.getWardrobe();
      setWardrobe(items);
      if (items.length >= 2) {
        setSelectedItems(items.slice(0, 3));
      }
    }
    load();
  }, []);

  const handleEvaluate = async () => {
    if (selectedItems.length === 0) return;
    setLoading(true);
    try {
      const res = await api.reviewShouldIWear({
        items: selectedItems,
        occasion,
        destination,
        weather: 'moderate'
      });
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyElevated = () => {
    if (result?.elevated_variation?.items) {
      setSelectedItems(result.elevated_variation.items);
      handleEvaluate();
    }
  };

  return (
    <div className="min-h-screen text-white py-10 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Real-Time Outfit Review</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Should I Wear This?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2">
            Receive an objective 0–10 score, occasion dress code verdict, itemized strengths, and a 1-click elevated variation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                  1. Target Occasion & Protocol
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full text-xs font-medium px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 transition"
                >
                  {OCCASIONS.map(occ => (
                    <option key={occ} value={occ} className="bg-zinc-950 text-white">{occ}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 block mb-2">
                  2. Venue / Destination Context
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 transition"
                  placeholder="e.g. Downtown Office, Garden Resort"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    3. Selected Items ({selectedItems.length})
                  </label>
                  <span className="text-[11px] text-zinc-500">Tap to toggle</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {wardrobe.map(it => {
                    const isSelected = selectedItems.some(s => s.id === it.id);
                    return (
                      <div
                        key={it.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedItems(selectedItems.filter(s => s.id !== it.id));
                          } else {
                            setSelectedItems([...selectedItems, it]);
                          }
                        }}
                        className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-violet-500 bg-violet-600/20 ring-1 ring-violet-500/40' 
                            : 'border-white/10 bg-zinc-950/80 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={it.image_url} alt={it.name} className="w-full aspect-square object-cover rounded-lg mb-1" />
                        <p className="text-[10px] font-medium text-white truncate">{it.name}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleEvaluate}
                disabled={loading || selectedItems.length === 0}
                className="w-full py-4 px-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold tracking-wider text-xs uppercase flex items-center justify-center space-x-2 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Evaluating Harmony & Protocol...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Review This Outfit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="space-y-6">
                <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-widest text-violet-400">Stylist Verdict</span>
                      <h2 className="font-serif-luxury text-2xl font-bold text-white mt-0.5">
                        {result.verdict}
                      </h2>
                    </div>
                    <div className="text-right">
                      <span className="font-serif-luxury text-3xl font-bold text-amber-300">
                        {result.score.toFixed(1)} <span className="text-base text-zinc-500">/ 10</span>
                      </span>
                      <div className="flex items-center justify-end space-x-1 text-amber-300 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="text-xs text-zinc-400 ml-1">({result.stars} stars)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4">
                    {Object.entries(result.breakdown).map(([k, val]) => (
                      <div key={k} className="bg-zinc-950/80 p-3 rounded-xl border border-white/10">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize text-zinc-400 font-medium">{k.replace('_', ' ')}</span>
                          <span className="font-bold text-white">{val} / 10</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full" style={{ width: `${(val / 10) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-zinc-950/80 p-4 rounded-2xl border border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Key Strengths</span>
                      </span>
                      <ul className="space-y-1.5 text-xs text-zinc-300">
                        {result.strengths.map((s, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-emerald-400 font-bold">&bull;</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-zinc-950/80 p-4 rounded-2xl border border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>Improvement Areas</span>
                      </span>
                      <ul className="space-y-1.5 text-xs text-zinc-300">
                        {result.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start space-x-1.5">
                            <span className="text-amber-400 font-bold">&bull;</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {result.elevated_variation && (
                  <div className="bg-zinc-900/80 border border-violet-500/40 rounded-3xl p-6 shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-bold">
                        <Wand2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>1-Click Elevation Engine</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        +{result.elevated_variation.score_delta} pts upgrade &bull; {result.elevated_variation.projected_score} / 10
                      </span>
                    </div>

                    <h3 className="font-serif-luxury text-xl font-bold text-white">
                      {result.elevated_variation.title}
                    </h3>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {result.elevated_variation.description}
                    </p>

                    <button
                      onClick={handleApplyElevated}
                      className="w-full py-3.5 bg-white text-zinc-950 hover:bg-zinc-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md mt-2"
                    >
                      <span>Apply This Elevated Variation</span>
                      <ArrowRight className="w-3.5 h-3.5 text-violet-600" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-zinc-900/60 border border-dashed border-white/10 rounded-3xl p-12 text-center text-zinc-500">
                <Shirt className="w-10 h-10 mx-auto text-violet-400 opacity-60 mb-3" />
                <p className="font-serif-luxury text-lg text-white">Awaiting Your Outfit Selection</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Pick your occasion and wardrobe items on the left, then click &ldquo;Review This Outfit&rdquo; to receive the autonomous evaluation.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
