import React, { useState } from 'react';
import { Luggage, Cloud, CheckSquare, Square, Wand2, ArrowRight, Shield, Sparkles, MapPin, Check } from 'lucide-react';
import { api } from '../services/api';
import { TravelPlan } from '../types';

export const TravelAssistantPage: React.FC = () => {
  const [destination, setDestination] = useState('Manali');
  const [days, setDays] = useState(5);
  const [purpose, setPurpose] = useState('Vacation');
  const [expectedWeather, setExpectedWeather] = useState('Cold / Mountain Breeze');
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const data = await api.packWithAi({
        destination,
        days,
        purpose,
        expected_weather: expectedWeather
      });
      setPlan(data);
    } catch (err: any) {
      alert('Error generating travel capsule plan');
    } finally {
      setLoading(false);
    }
  };

  const togglePacked = (index: number) => {
    if (!plan) return;
    const updated = [...plan.packing_checklist];
    updated[index].packed = !updated[index].packed;
    setPlan({ ...plan, packing_checklist: updated });
  };

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">AI Capsule Optimizer</span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight text-white mt-1">Pack With AI</h1>
          <p className="text-xs text-zinc-400 mt-2">
            Weather-aware travel wardrobe curation. Prioritizes items in your wardrobe and identifies missing essentials.
          </p>
        </div>

        {/* Trip Configuration Card */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Destination</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Manali, Goa, Paris"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Trip Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Trip Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
              >
                {['Vacation', 'Business Conference', 'Weekend Getaway', 'Weddings & Celebrations'].map(p => (
                  <option key={p} value={p} className="bg-zinc-950 text-white">{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">Expected Weather</label>
              <input
                type="text"
                value={expectedWeather}
                onChange={(e) => setExpectedWeather(e.target.value)}
                placeholder="e.g. Cold, Sunny & Warm"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={handleGeneratePlan}
              disabled={loading}
              className="px-10 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25 flex items-center space-x-2 disabled:opacity-50"
            >
              <Luggage className="w-4 h-4 text-amber-300" />
              <span>{loading ? 'Packing your perfect capsule...' : 'Generate Travel Plan'}</span>
            </button>
          </div>
        </div>

        {/* Plan Results */}
        {plan && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Checklist Column */}
            <div className="lg:col-span-5 bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="font-serif-luxury text-xl font-bold text-white">Packing Checklist</h3>
                <span className="text-xs text-violet-300 font-mono">{plan.weather_notes}</span>
              </div>

              <div className="space-y-2.5">
                {plan.packing_checklist.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => togglePacked(idx)}
                    className="w-full flex items-start space-x-3 text-left p-3 rounded-xl hover:bg-zinc-800/60 border border-transparent hover:border-white/5 transition"
                  >
                    {item.packed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={`text-xs ${item.packed ? 'line-through text-zinc-500' : 'text-zinc-200 font-medium'}`}>
                        {item.item}
                      </span>
                      <span className="block text-[10px] text-zinc-500 uppercase">{item.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Outfits and Missing Items */}
            <div className="lg:col-span-7 space-y-6">
              {/* Recommended Outfit */}
              {plan.recommended_outfits.map((outfit) => (
                <div key={outfit.id} className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Wardrobe Transit Look</span>
                      <h3 className="font-serif-luxury text-2xl font-bold text-white">{outfit.title}</h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-violet-600/20 text-xs font-bold text-violet-300 border border-violet-500/30">
                      {outfit.compatibility_score}% Match
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {outfit.items.map((i) => (
                      <div key={i.id} className="space-y-1.5 text-center">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 border border-white/10">
                          <img src={i.image_url} alt={i.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="block text-[11px] font-semibold text-white truncate">{i.name}</span>
                        <span className="block text-[10px] text-zinc-400">{i.category}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-zinc-300 italic bg-zinc-950/70 p-3.5 rounded-xl border border-white/5 leading-relaxed">
                    "{outfit.explanation}"
                  </p>
                </div>
              ))}

              {/* Missing Wardrobe Recommendations */}
              <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
                <h4 className="font-serif-luxury text-lg font-bold text-white">Recommended Additions for {destination}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.missing_wardrobe_items.map((m, idx) => (
                    <div key={idx} className="p-3.5 bg-zinc-950/70 rounded-2xl border border-white/10 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{m.name}</span>
                        <span className="text-xs font-bold text-amber-300 font-mono">${m.suggested_price}</span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{m.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
