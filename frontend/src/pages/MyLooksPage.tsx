import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, Wand2, ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { SavedOutfit } from '../types';

export const MyLooksPage: React.FC = () => {
  const [outfits, setOutfits] = useState<SavedOutfit[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      setLoading(true);
      const data = await api.getSavedOutfits();
      setOutfits(data);
    } catch (err) {
      console.warn('Failed to load saved outfits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    const res = await api.toggleFavorite(id);
    setOutfits(outfits.map(o => o.id === id ? { ...o, is_favorite: res.is_favorite } : o));
  };

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex justify-between items-center border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Curated Ensembles</span>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight text-white mt-1">Saved Looks</h1>
            <p className="text-xs text-zinc-400 mt-2">
              Your favorite outfit combinations curated and fitted by StyleSense AI.
            </p>
          </div>
          <Link
            to="/outfit-generator"
            className="px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25 flex items-center space-x-2"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>New Look</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400 mt-3">Loading saved looks...</p>
          </div>
        ) : outfits.length === 0 ? (
          <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-12 text-center border border-white/10 max-w-md mx-auto space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-white">No saved looks yet</h3>
            <p className="text-xs text-zinc-400">
              Generate outfits in the AI Outfit Generator and save your favorites here for rapid access.
            </p>
            <Link
              to="/outfit-generator"
              className="inline-flex px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-950 bg-white hover:bg-zinc-200 transition"
            >
              Generate an Outfit
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {outfits.map((outfit) => (
              <div key={outfit.id} className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">{outfit.occasion}</span>
                    <h3 className="font-serif-luxury text-2xl font-bold text-white">{outfit.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full bg-violet-600/20 text-xs font-bold text-violet-300 border border-violet-500/30">
                      {outfit.compatibility_score}%
                    </span>
                    <button
                      onClick={() => handleToggleFavorite(outfit.id)}
                      className="p-1.5 rounded-full hover:bg-zinc-800 transition"
                    >
                      <Heart className={`w-4 h-4 ${outfit.is_favorite ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'}`} />
                    </button>
                  </div>
                </div>

                {/* Outfit Items Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                  {outfit.items.map((item) => (
                    <div key={item.id} className="space-y-1 text-center">
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950 border border-white/10">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="block text-[10px] text-zinc-400 truncate">{item.name}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-zinc-300 italic bg-zinc-950/70 p-3 rounded-xl border border-white/5">
                  "{outfit.explanation}"
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
