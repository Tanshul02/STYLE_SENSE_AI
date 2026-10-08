import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, UploadCloud, CheckCircle2, Shield } from 'lucide-react';
import { api } from '../services/api';

export const WardrobeUploadPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Shirts');
  const [color, setColor] = useState('White');
  const [style, setStyle] = useState('Casual');
  const [season, setSeason] = useState('All-Season');
  const [occasion, setOccasion] = useState('Daily Wear');
  const [formality, setFormality] = useState('Medium');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600');
  const [strategyMode, setStrategyMode] = useState<'manual' | 'vision'>('manual');
  const [loading, setLoading] = useState(false);

  // Preset sample photography options for instant realistic testing
  const sampleImages = [
    { label: 'White Shirt', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600' },
    { label: 'Black Blazer', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600' },
    { label: 'Denim Jeans', url: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600' },
    { label: 'Linen Trousers', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600' },
    { label: 'Silk Kurta', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600' },
    { label: 'White Sneakers', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addClothing({
        name,
        category,
        color,
        style,
        season,
        occasion,
        formality,
        description,
        image_url: imageUrl,
      });
      navigate('/wardrobe');
    } catch (err: any) {
      alert(err.message || 'Failed to upload item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex items-center space-x-4">
          <Link to="/wardrobe" className="p-2 rounded-full bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Wardrobe Ingestion</span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold tracking-tight text-white">Add Clothing Piece</h1>
          </div>
        </div>

        {/* Strategy Pattern Demonstrator Banner */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-violet-400" />
            <span className="font-semibold text-white">Strategy Pattern Ingestion:</span>
            <span className="text-zinc-400">Executing {strategyMode === 'manual' ? 'ManualClothingAnalyzer' : 'ComputerVisionClothingAnalyzer (simulated)'}</span>
          </div>
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setStrategyMode('manual')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${strategyMode === 'manual' ? 'bg-violet-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
            >
              Manual Strategy
            </button>
            <button
              type="button"
              onClick={() => setStrategyMode('vision')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${strategyMode === 'vision' ? 'bg-violet-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'}`}
            >
              Vision Strategy
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Image Preview & Presets */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-zinc-900/60 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 space-y-4 shadow-xl">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">Garment Image Preview</label>
              
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 relative">
                <img
                  src={imageUrl}
                  alt="Garment Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600';
                  }}
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                  placeholder="https://..."
                />
              </div>

              {/* Sample presets */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-semibold uppercase text-zinc-400">Quick Test Photography:</span>
                <div className="grid grid-cols-3 gap-2">
                  {sampleImages.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => {
                        setImageUrl(s.url);
                        if (!name) setName(s.label);
                      }}
                      className="text-[10px] p-2 rounded-xl border border-white/10 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white truncate text-center transition"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata Attributes */}
          <div className="md:col-span-7 space-y-4">
            <div className="bg-zinc-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
              
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Garment Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Classic Black Oversized Blazer"
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                  >
                    {['Shirts', 'T-Shirts', 'Tops', 'Bottoms', 'Jeans', 'Trousers', 'Dresses', 'Jackets', 'Sweaters', 'Traditional Wear', 'Footwear', 'Accessories'].map(c => (
                      <option key={c} value={c} className="bg-zinc-950 text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Color</label>
                  <input
                    type="text"
                    required
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Black, Ivory, Navy"
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Style</label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                  >
                    {['Casual', 'Formal', 'Elegant', 'Minimalist', 'Streetwear', 'Traditional'].map(s => (
                      <option key={s} value={s} className="bg-zinc-950 text-white">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Formality</label>
                  <select
                    value={formality}
                    onChange={(e) => setFormality(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                  >
                    {['High', 'Medium', 'Low'].map(f => (
                      <option key={f} value={f} className="bg-zinc-950 text-white">{f} Formality</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Season</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                  >
                    {['All-Season', 'Summer', 'Winter', 'Monsoon'].map(s => (
                      <option key={s} value={s} className="bg-zinc-950 text-white">{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Common Occasion</label>
                  <input
                    type="text"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder="e.g. College, Farewell, Office"
                    className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">Description / Styling Notes</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tailored silhouette, breathable fabric, horn buttons..."
                  className="w-full px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{loading ? 'Ingesting Garment...' : 'Save to Digital Wardrobe'}</span>
              </button>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
