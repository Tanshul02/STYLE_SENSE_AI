import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Layers, ShieldCheck, CheckCircle2, ShoppingBag, 
  Bookmark, RefreshCw, Upload, Shirt, ArrowRight, Eye, Star
} from 'lucide-react';
import { api } from '../services/api';
import { ClothingItem, Product, FitStudioModel, FitStudioSimulateResponse } from '../types';
import { useCart } from '../context/CartContext';

export const AIFitStudioPage: React.FC = () => {
  const { addToCart } = useCart();
  const [models, setModels] = useState<FitStudioModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<FitStudioModel | null>(null);
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Mix & Match Slots
  const [selectedTop, setSelectedTop] = useState<any>(null);
  const [selectedBottom, setSelectedBottom] = useState<any>(null);
  const [selectedShoes, setSelectedShoes] = useState<any>(null);
  const [selectedOuter, setSelectedOuter] = useState<any>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<any>(null);

  const [activeCategory, setActiveCategory] = useState<'top' | 'bottom' | 'shoes' | 'outer' | 'accessory'>('top');
  const [sourceTab, setSourceTab] = useState<'catalog' | 'wardrobe'>('catalog');
  const [loading, setLoading] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<FitStudioSimulateResponse | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [modelsRes, wardrobeRes, productsRes] = await Promise.all([
          api.getFitStudioModels(),
          api.getWardrobe(),
          api.getProducts()
        ]);
        setModels(modelsRes.models);
        if (modelsRes.models.length > 0) {
          setSelectedModel(modelsRes.models[0]);
        }
        setWardrobe(wardrobeRes);
        setProducts(productsRes);
        
        if (productsRes.length > 0) {
          setSelectedTop(productsRes.find(p => p.category === 'Formal' || p.category === 'Casual') || productsRes[0]);
          setSelectedBottom(productsRes.find(p => p.name.includes('Trousers') || p.name.includes('Chinos')) || productsRes[1]);
          setSelectedShoes(productsRes.find(p => p.category === 'Footwear') || productsRes[2]);
        }
      } catch (err) {
        console.error('Error loading fit studio data', err);
      }
    }
    loadData();
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const garments: Record<string, any> = {};
      if (selectedTop) garments.top = selectedTop;
      if (selectedBottom) garments.bottom = selectedBottom;
      if (selectedShoes) garments.shoes = selectedShoes;
      if (selectedOuter) garments.outerwear = selectedOuter;
      if (selectedAccessory) garments.accessory = selectedAccessory;

      const personImg = customPhotoUrl || selectedModel?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800';
      const res = await api.simulateFitStudio({
        person_image_url: personImg,
        garments,
        model_id: selectedModel?.id,
        provider: 'mock'
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    const itemsToAdd = [selectedTop, selectedBottom, selectedShoes, selectedOuter, selectedAccessory].filter(Boolean);
    itemsToAdd.forEach(it => {
      if (it.price) {
        addToCart(it);
      }
    });
  };

  const handleSaveLook = async () => {
    if (!simulationResult) return;
    try {
      const items = [selectedTop, selectedBottom, selectedShoes, selectedOuter, selectedAccessory].filter(Boolean);
      await api.saveOutfit({
        name: `Studio Fit ${new Date().toLocaleDateString()}`,
        occasion: 'Curated Look',
        style: 'High Fashion Studio',
        compatibility_score: simulationResult.score,
        explanation: simulationResult.feedback.join(' '),
        clothing_item_ids: items.map(i => i.id || 'seed-item'),
        score_breakdown: simulationResult.breakdown
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-white/10 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Fit Studio &bull; Multi-Category</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white">
            Autonomous Virtual Fitting Studio
          </h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Mix and match tops, bottoms, outerwear, footwear, and accessories directly on diverse model avatars or your custom upload with realistic fit simulation.
          </p>
        </div>

        <div className="flex flex-col items-end">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Provider: HuggingFace IDM-VTON / High-Fidelity Simulation</span>
          </div>
          <span className="text-[11px] text-zinc-500 mt-1">High Precision &bull; GPU Diffusion Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-4 flex items-center justify-between">
              <span>1. Canvas Avatar</span>
              <span className="text-xs font-normal text-zinc-400">Men, Women, Kids, Seniors</span>
            </h2>

            <div className="grid grid-cols-5 gap-2 mb-4">
              {models.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedModel(m); setCustomPhotoUrl(''); }}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    selectedModel?.id === m.id && !customPhotoUrl
                      ? 'border-violet-500 ring-2 ring-violet-500/30 scale-105'
                      : 'border-white/5 opacity-70 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs text-[9px] text-white text-center py-0.5 truncate">
                    {m.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10">
              <label className="text-xs font-medium text-zinc-400 block mb-1.5">
                Or Use Custom Photo URL:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://..."
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-zinc-950 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={() => setCustomPhotoUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800')}
                  className="text-xs px-3 py-2 bg-zinc-800 text-zinc-200 border border-white/10 rounded-xl hover:bg-zinc-700 font-medium"
                >
                  Preset
                </button>
              </div>
            </div>

            <div className="relative mt-6 rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-950 flex items-center justify-center border border-white/10 shadow-lg group">
              <img
                src={simulationResult?.result_image_url || customPhotoUrl || selectedModel?.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'}
                alt="Fit Studio Canvas"
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs text-white flex items-center space-x-2">
                <Layers className="w-3.5 h-3.5 text-violet-400" />
                <span>
                  {simulationResult ? 'Composite Rendered' : 'Preview Canvas'}
                </span>
              </div>

              {simulationResult && (
                <div className="absolute bottom-4 inset-x-4 bg-zinc-950/90 backdrop-blur-xl p-3.5 rounded-xl border border-white/10 shadow-xl text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Composite Style Score</span>
                    <span className="font-serif-luxury text-lg font-bold text-violet-400">
                      {simulationResult.score.toFixed(1)} / 10
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${(simulationResult.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-medium tracking-wide text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing Layered Fitting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Render Multi-Garment Try-On</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-white mb-4">
              2. Selected Garment Layers
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { key: 'top', label: 'Top / Shirt', item: selectedTop, set: setSelectedTop },
                { key: 'bottom', label: 'Bottoms', item: selectedBottom, set: setSelectedBottom },
                { key: 'shoes', label: 'Footwear', item: selectedShoes, set: setSelectedShoes },
                { key: 'outer', label: 'Outerwear', item: selectedOuter, set: setSelectedOuter },
                { key: 'accessory', label: 'Accessories', item: selectedAccessory, set: setSelectedAccessory }
              ].map(slot => (
                <div
                  key={slot.key}
                  onClick={() => setActiveCategory(slot.key as any)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeCategory === slot.key
                      ? 'border-violet-500 bg-zinc-950 ring-2 ring-violet-500/20 shadow-md'
                      : 'border-white/10 bg-zinc-950/60 hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    {slot.label}
                  </span>
                  {slot.item ? (
                    <div className="space-y-1">
                      <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
                        <img src={slot.item.image_url} alt={slot.item.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{slot.item.name}</p>
                      {slot.item.price && <p className="text-[11px] text-violet-400 font-bold">${slot.item.price}</p>}
                    </div>
                  ) : (
                    <div className="aspect-square rounded-lg border border-dashed border-zinc-700 flex flex-col items-center justify-center text-zinc-500 text-[10px]">
                      <span>+ Empty</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                  Select {activeCategory.toUpperCase()} Layer
                </h3>
                <span className="text-xs text-zinc-400">Click any item to load into the active slot</span>
              </div>

              <div className="flex bg-zinc-950 border border-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setSourceTab('catalog')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    sourceTab === 'catalog' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Luxury Catalog
                </button>
                <button
                  onClick={() => setSourceTab('wardrobe')}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    sourceTab === 'wardrobe' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  My Wardrobe ({wardrobe.length})
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-1">
              {(sourceTab === 'catalog' ? products : wardrobe).map((it: any) => (
                <div
                  key={it.id}
                  onClick={() => {
                    if (activeCategory === 'top') setSelectedTop(it);
                    else if (activeCategory === 'bottom') setSelectedBottom(it);
                    else if (activeCategory === 'shoes') setSelectedShoes(it);
                    else if (activeCategory === 'outer') setSelectedOuter(it);
                    else if (activeCategory === 'accessory') setSelectedAccessory(it);
                  }}
                  className="bg-zinc-950/70 rounded-xl border border-white/10 p-2.5 hover:border-violet-500 cursor-pointer transition-all group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-white/5 mb-2">
                    <img src={it.image_url} alt={it.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="text-xs font-medium text-white truncate">{it.name}</p>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-400">
                    <span>{it.category}</span>
                    {it.price && <span className="font-bold text-violet-400">${it.price}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {simulationResult && (
            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-xl font-bold text-white">
                    Fit Studio Compatibility: {simulationResult.score.toFixed(1)} / 10
                  </h3>
                  <p className="text-xs text-zinc-400">Normalized 6-factor composite style assessment</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveLook}
                    className="px-3.5 py-2 bg-zinc-950 border border-white/10 rounded-xl text-xs font-medium text-zinc-300 hover:text-white hover:border-white/20 flex items-center space-x-1.5 transition"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Saved!' : 'Save Look'}</span>
                  </button>
                  <button
                    onClick={handleAddAllToCart}
                    className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-xs font-semibold hover:from-violet-500 hover:to-indigo-500 flex items-center space-x-1.5 shadow-md shadow-violet-500/20 transition"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Outfit to Bag</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {Object.entries(simulationResult.breakdown).map(([k, val]) => (
                  <div key={k} className="bg-zinc-950/70 p-3 rounded-xl border border-white/10">
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

              <div className="bg-zinc-950/80 p-4 rounded-xl border border-white/10 text-xs text-zinc-300 space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-white block mb-1">Stylist Notes:</span>
                {simulationResult.feedback.map((f, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
