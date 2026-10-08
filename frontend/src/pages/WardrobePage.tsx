import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Filter, Shirt, Sparkles, Tag, Eye } from 'lucide-react';
import { api } from '../services/api';
import { ClothingItem } from '../types';

export const WardrobePage: React.FC = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All', 'T-Shirts', 'Shirts', 'Bottoms', 'Jeans', 'Trousers', 
    'Dresses', 'Jackets', 'Sweaters', 'Traditional Wear', 'Footwear', 'Accessories'
  ];

  const loadWardrobe = async () => {
    try {
      setLoading(true);
      const data = await api.getWardrobe(selectedCategory);
      setItems(data);
    } catch (err) {
      console.warn('Failed to load wardrobe:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWardrobe();
  }, [selectedCategory]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from your wardrobe?`)) {
      await api.deleteClothing(id);
      setItems(items.filter(i => i.id !== id));
    }
  };

  const filteredItems = items.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.color.toLowerCase().includes(q) ||
      item.style.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Personal Fashion Inventory</span>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight text-white mt-1">
              Smart Wardrobe Vault
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              {items.length} digitized garments indexed with neural tags, color harmony weights, and seasonal warmth.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              to="/try-on"
              className="px-4 py-2.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 border border-violet-500/30 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Virtual Try-On</span>
            </Link>

            <Link
              to="/wardrobe/upload"
              className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 text-violet-600" />
              <span>Add Garment</span>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search wardrobe by title, category, color, or style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-zinc-950 font-bold border-white'
                    : 'bg-zinc-900/60 text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Garment Grid */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 text-xs">
            Loading your digitized wardrobe...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-12 text-center border border-white/10 max-w-md mx-auto space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto">
              <Shirt className="w-7 h-7" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">No items found</h3>
            <p className="text-xs text-zinc-400">Digitize a new piece or select a different category filter.</p>
            <Link
              to="/wardrobe/upload"
              className="inline-flex px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25"
            >
              Add First Garment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-3.5 shadow-xl flex flex-col justify-between group hover:border-violet-500/40 transition-all"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 mb-3.5">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      className="p-2 rounded-full bg-zinc-950/70 backdrop-blur-md text-zinc-400 hover:text-rose-400 border border-white/10 transition"
                      title="Remove from wardrobe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
                    {item.category}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-white truncate">{item.name}</h3>
                  <div className="flex items-center space-x-2 text-[10px] text-zinc-400 font-mono">
                    <span>Color: {item.color}</span>
                    <span>&bull;</span>
                    <span>Style: {item.style}</span>
                  </div>
                  <div className="pt-2">
                    <Link
                      to="/try-on"
                      className="w-full py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-medium transition flex items-center justify-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Try On In Atelier</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
