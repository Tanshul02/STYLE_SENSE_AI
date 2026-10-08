import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Wand2, RefreshCw, Bookmark, Bot, 
  Award, Info, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { api } from '../services/api';
import { OutfitGenerateResponse, OutfitRecommendation } from '../types';
import { ScoreBreakdownModal } from '../components/common/ScoreBreakdownModal';

export const OutfitGeneratorPage: React.FC = () => {
  const navigate = useNavigate();

  // Inputs
  const [occasion, setOccasion] = useState('College Farewell');
  const [style, setStyle] = useState('Elegant');
  const [weather, setWeather] = useState('Warm');
  const [temperature, setTemperature] = useState(24);
  const [preferredColor, setPreferredColor] = useState('Black');
  const [formality, setFormality] = useState('High');

  // Response state
  const [result, setResult] = useState<OutfitGenerateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const data = await api.generateOutfit({
        occasion,
        style,
        weather,
        temperature,
        preferred_color: preferredColor,
        formality
      });
      setResult(data);
    } catch (err: any) {
      alert(err.message || 'Error generating outfit');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLook = async (outfit: OutfitRecommendation) => {
    try {
      await api.saveOutfit({
        name: outfit.title,
        occasion,
        style,
        compatibility_score: outfit.compatibility_score,
        explanation: outfit.explanation,
        clothing_item_ids: outfit.items.map(i => i.id)
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert('Failed to save look');
    }
  };

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">AI Hybrid Recommendation Engine</span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight text-white mt-1">Create My Outfit</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Multi-strategy compatibility scoring: Occasion (30%), Style (25%), Color (20%), Weather (15%), Preferences (10%).
          </p>
        </div>

        {/* Input Configuration Card */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Occasion</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                {['College Farewell', 'Office Meeting', 'Casual College Day', 'Evening Dinner', 'Festive Wedding', 'Airport Transit'].map(o => (
                  <option key={o} value={o} className="bg-zinc-950 text-white">{o}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Style Aesthetic</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                {['Elegant', 'Minimalist', 'Formal', 'Streetwear', 'Casual', 'Traditional'].map(s => (
                  <option key={s} value={s} className="bg-zinc-950 text-white">{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Preferred Color Theme</label>
              <select
                value={preferredColor}
                onChange={(e) => setPreferredColor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                {['Black', 'White', 'Ivory', 'Navy', 'Emerald', 'Beige', 'Charcoal'].map(c => (
                  <option key={c} value={c} className="bg-zinc-950 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Weather Condition</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                {['Warm', 'Pleasant', 'Cold / Winter', 'Rainy'].map(w => (
                  <option key={w} value={w} className="bg-zinc-950 text-white">{w}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Temperature ({temperature}°C)
              </label>
              <input
                type="range"
                min="5"
                max="38"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-3"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Formality Level</label>
              <select
                value={formality}
                onChange={(e) => setFormality(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                {['High', 'Medium', 'Low'].map(f => (
                  <option key={f} value={f} className="bg-zinc-950 text-white">{f} Formality</option>
                ))}
              </select>
            </div>

          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-10 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/25 flex items-center space-x-2 disabled:opacity-50"
            >
              <Wand2 className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Evaluating Combinations...' : '✨ Generate My Look'}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-16 text-center border border-white/10 shadow-xl space-y-4">
            <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">Your stylist is synthesizing looks...</h3>
              <p className="text-xs text-zinc-400">Calculating cosine similarities & multi-criteria compatibility scores.</p>
            </div>
          </div>
        )}

        {/* Generated Outfit Presentation */}
        {!loading && result && (
          <div className="space-y-8">
            
            {/* Success toast on save */}
            {savedSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center space-x-2 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Outfit saved to "Saved Looks" successfully!</span>
              </div>
            )}

            {/* Look 1 — Primary Best Match */}
            <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl space-y-8">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Primary Recommendation</span>
                  <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mt-1">
                    {result.primary_outfit.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center space-x-1.5 transition"
                  >
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>Score: {result.primary_outfit.compatibility_score}%</span>
                    <Info className="w-3.5 h-3.5 text-zinc-400" />
                  </button>

                  <button
                    onClick={() => handleSaveLook(result.primary_outfit)}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider text-zinc-950 transition flex items-center space-x-1.5 shadow"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-violet-600" />
                    <span>Save Look</span>
                  </button>
                </div>
              </div>

              {/* Garments Visual Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {result.primary_outfit.items.map((item) => (
                  <div key={item.id} className="space-y-3 group">
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 border border-white/10">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">{item.category}</span>
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-zinc-400">{item.color} &bull; {item.formality} Formality</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Explainable Reasoning Card ("Why it works") */}
              <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400">Why This Outfit Works:</span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                  "{result.primary_outfit.explanation}"
                </p>
              </div>

              {/* Styling Tips & Weather Context */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Stylist Notes</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    {result.styling_tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-violet-400">&bull;</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Environmental Context</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{result.weather_context}</p>
                </div>
              </div>

            </div>

            {/* Score Breakdown Modal */}
            <ScoreBreakdownModal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              breakdown={result.primary_outfit.score_breakdown}
              outfitTitle={result.primary_outfit.title}
            />

          </div>
        )}

      </div>
    </div>
  );
};
