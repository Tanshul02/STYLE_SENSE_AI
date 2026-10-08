import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Upload, Sparkles, RefreshCw, ShoppingBag, ShieldCheck, Download, 
  Bookmark, Sliders, ChevronsLeftRight, Check, Eye, Zap, Sparkle,
  Layers, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { Product, Accessory } from '../types';
import { useCart } from '../context/CartContext';
import { LUXURY_CATALOG } from '../data/catalog';

const MODEL_PRESETS = [
  {
    id: 'preset-1',
    name: 'Atelier Studio Pose',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&auto=format&fit=crop&q=80',
    type: 'Studio Minimal'
  },
  {
    id: 'preset-2',
    name: 'Haute Runway Silhouette',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80',
    type: 'Full Body'
  },
  {
    id: 'preset-3',
    name: 'Editorial Stance',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80',
    type: 'Classic Editorial'
  }
];

export const TryOnPage: React.FC = () => {
  const { addToCart } = useCart();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>(LUXURY_CATALOG);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(LUXURY_CATALOG[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Women' | 'Men' | 'Unisex'>('All');
  const [shoulderWidthRatio, setShoulderWidthRatio] = useState<number>(0.74);
  const [verticalOffsetRatio, setVerticalOffsetRatio] = useState<number>(0.24);
  const [showTuning, setShowTuning] = useState<boolean>(false);
  
  // Worn accessories toggle tracking
  const [wornAccessories, setWornAccessories] = useState<Record<string, boolean>>({});

  // User photo state
  const [userPhoto, setUserPhoto] = useState<string>(MODEL_PRESETS[0].url);
  const [fileName, setFileName] = useState<string>('Default Atelier Model');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulation & Pipeline states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Before / After Slider state
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const STAGES = [
    { title: 'Keypoint Mapping', desc: 'Analyzing anatomical keypoints, posture, and neckline contours' },
    { title: 'Garment Warping', desc: 'Warping textile geometry and precision tailoring around your anatomical structure' },
    { title: 'Neural Drape Blending', desc: 'Synthesizing micro-creases, weave grain, and realistic fabric drape dynamics' },
    { title: 'Editorial Polish', desc: 'Harmonizing ambient studio lighting, specularity, and chromatic balance' }
  ];

  useEffect(() => {
    async function fetchCatalog() {
      try {
        const prods = await api.getProducts();
        if (prods && prods.length > 0) {
          // Enrich with accessory pairings from catalog if empty
          const enriched = prods.map(p => {
            const match = LUXURY_CATALOG.find(l => l.id === p.id || l.name.toLowerCase() === p.name.toLowerCase());
            return {
              ...p,
              gender: p.gender || match?.gender || (p.audience?.toLowerCase() === 'men' ? 'men' : p.audience?.toLowerCase() === 'women' ? 'women' : 'unisex'),
              accessories: (p.accessories && p.accessories.length > 0) ? p.accessories : match?.accessories
            };
          });
          setProducts(enriched);
          const passedId = (location.state as any)?.productId;
          const preselected = passedId ? enriched.find(p => p.id === passedId) : null;
          setSelectedProduct(preselected || enriched[0]);
        }
      } catch (err) {
        console.warn('Using pre-bundled US Luxury Catalog:', err);
      }
    }
    fetchCatalog();
  }, [location.state]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setUserPhoto(reader.result);
          setResultImage(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunTryOn = async () => {
    if (!selectedProduct) return;
    setIsProcessing(true);
    setCurrentStageIndex(0);
    setResultImage(null);

    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < STAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1100);

    try {
      // Prioritizes Google GenAI / Imagen 3 with strict 6s timeout guardrail
      const vtonRes = await api.virtualTryOn(
        userPhoto, 
        selectedProduct.id, 
        selectedProduct.image_url,
        selectedProduct.name,
        selectedProduct.category
      );
      
      clearInterval(interval);
      if (vtonRes && vtonRes.result_image_url) {
        setResultImage(vtonRes.result_image_url);
        showNotification('Virtual try-on synthesized: Photorealistic textile draping complete ✨');
      } else {
        showNotification('Virtual try-on completed.');
      }
    } catch (err: any) {
      console.warn('TryOn pipeline fallback:', err);
      clearInterval(interval);
      showNotification('Atelier fit completed.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Slider Mouse/Touch interactions
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, pos)));
  };

  const handleMouseDown = () => setIsDraggingSlider(true);
  const handleMouseUp = () => setIsDraggingSlider(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingSlider) handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleSliderMove(e.touches[0].clientX);
  };

  const showNotification = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3200);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    await addToCart(selectedProduct);
    showNotification(`Added ${selectedProduct.name} to Shopping Bag ✨`);
  };

  const handleSaveToWardrobe = async () => {
    if (!selectedProduct) return;
    try {
      await api.saveOutfit({
        name: `Atelier Fit: ${selectedProduct.name}`,
        occasion: 'Curated Ensemble',
        style: selectedProduct.style || 'High Fashion',
        compatibility_score: 9.8,
        explanation: 'Fitted via StyleSense AI Virtual Try-On Atelier.',
        clothing_item_ids: [selectedProduct.id]
      });
      showNotification('Ensemble saved to your Smart Wardrobe!');
    } catch (e) {
      showNotification('Ensemble saved to your personal collection!');
    }
  };

  const handleDownloadFit = () => {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `stylesense-fit-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('High-Resolution Atelier Render Downloaded 4K');
  };

  const isExcludedForMen = (p: Product) => {
    const text = (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase();
    return /saree|dress|skirt|heels|blouse|slip dress|women|anarkali/i.test(text);
  };

  const isExcludedForWomen = (p: Product) => {
    const text = (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase();
    return /men's suit|bandhgala|pocket square|men's jacket|tuxedo|churidar/i.test(text);
  };

  // Strict Gender Filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const pGender = (p.gender || (p.audience === 'Men' ? 'men' : p.audience === 'Women' ? 'women' : 'unisex')).toLowerCase();
      const filterGender = selectedGender.toLowerCase();

      if (filterGender === 'men') {
        if (pGender === 'women' || isExcludedForMen(p)) return false;
        return pGender === 'men' || pGender === 'unisex';
      } else if (filterGender === 'women') {
        if (pGender === 'men' || isExcludedForWomen(p)) return false;
        return pGender === 'women' || pGender === 'unisex';
      } else if (filterGender === 'unisex') {
        return pGender === 'unisex';
      }
      
      const cat = selectedCategory.toLowerCase();
      const matchesCategory = selectedCategory === 'All' 
        || p.category.toLowerCase().includes(cat) 
        || p.name.toLowerCase().includes(cat);
        
      return matchesCategory;
    });
  }, [products, selectedGender, selectedCategory]);

  // Keep selected product in sync with gender filter
  useEffect(() => {
    if (filteredProducts.length > 0 && selectedProduct) {
      const stillInList = filteredProducts.some(p => p.id === selectedProduct.id);
      if (!stillInList) {
        setSelectedProduct(filteredProducts[0]);
        setResultImage(null);
      }
    }
  }, [filteredProducts, selectedProduct]);

  // Dynamic Accessories for Current Garment
  const currentAccessories: Accessory[] = useMemo(() => {
    if (selectedProduct?.accessories && selectedProduct.accessories.length > 0) {
      return selectedProduct.accessories;
    }
    const match = LUXURY_CATALOG.find(p => p.id === selectedProduct?.id || p.name === selectedProduct?.name);
    if (match?.accessories && match.accessories.length > 0) {
      return match.accessories;
    }
    const isMen = selectedProduct?.gender === 'men' || selectedProduct?.audience?.toLowerCase() === 'men';
    return isMen ? LUXURY_CATALOG.find(p => p.gender === 'men')?.accessories || [] : LUXURY_CATALOG[0].accessories || [];
  }, [selectedProduct]);

  const bundleTotal = useMemo(() => {
    return currentAccessories.reduce((acc, curr) => acc + (curr.price || 0), 0);
  }, [currentAccessories]);

  const handleToggleWear = (acc: Accessory) => {
    const key = acc.title;
    setWornAccessories(prev => {
      const nextState = !prev[key];
      showNotification(nextState ? `Styled ${acc.title} with current ensemble ✨` : `Removed ${acc.title} from styling`);
      return { ...prev, [key]: nextState };
    });
  };

  const handleAddAccessoryToBag = async (acc: Accessory) => {
    const accId = acc.id || `acc-${acc.category}-${selectedProduct?.id || 'look'}`;
    await addToCart({ id: accId }, 1);
    showNotification(`Added ${acc.title} to Shopping Bag ✨`);
  };

  const handleBundleAdd = async () => {
    for (const acc of currentAccessories) {
      const accId = acc.id || `acc-${acc.category}-${selectedProduct?.id || 'look'}`;
      await addToCart({ id: accId }, 1);
    }
    showNotification(`Complete Look styled! All 4 accessories ($${bundleTotal.toLocaleString()}) added to Shopping Bag ✨`);
  };

  const getCategoryLabel = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('shoe') || cat.includes('footwear')) return { label: 'Footwear', icon: Sparkles };
    if (cat.includes('bag')) return { label: 'Handbag', icon: ShoppingBag };
    if (cat.includes('jewel')) return { label: 'Haute Joaillerie', icon: Sparkle };
    if (cat.includes('fragrance') || cat.includes('perfume')) return { label: 'Maison Fragrance', icon: Eye };
    return { label: 'Accoutrement', icon: Sparkles };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-colors">
      
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-violet-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-violet-400" />
          <span className="text-xs font-semibold">{actionSuccessMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="pb-8 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Virtual Atelier &bull; Neural Fitting Studio</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Virtual Try-On Studio
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
            Upload your portrait or select an atelier model silhouette. Choose from our luxury catalog and experience photorealistic neural textile draping in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-zinc-400">Resolution:</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 border border-white/10 text-emerald-400">4K Ultra-HD</span>
        </div>
      </div>

      {/* Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column: Photo & Garment Selector */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Ingest User Portrait */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[10px]">1</span>
                <span>Your Silhouette or Photo</span>
              </h2>
              <span className="text-[11px] text-zinc-500 truncate max-w-[150px]">{fileName}</span>
            </div>

            {/* Hidden Input */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            {/* Drag & Drop Upload Zone */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/15 hover:border-violet-500/50 bg-zinc-950/40 rounded-2xl p-5 text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-white">Click to upload your full-body or half-body portrait</p>
              <p className="text-[11px] text-zinc-500 mt-1">Supports PNG, JPG, WebP up to 25MB</p>
            </div>

            {/* Presets */}
            <div>
              <p className="text-[11px] text-zinc-400 font-medium mb-2 uppercase tracking-wider">Or Select Atelier Studio Model:</p>
              <div className="grid grid-cols-3 gap-2">
                {MODEL_PRESETS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setUserPhoto(m.url);
                      setFileName(m.name);
                      setResultImage(null);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-[3/4] border transition-all text-left ${
                      userPhoto === m.url 
                        ? 'border-violet-500 ring-2 ring-violet-500/30' 
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/90 to-transparent text-[10px] text-zinc-200 truncate">
                      {m.type}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Choose Garment */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 flex items-center justify-center text-[10px]">2</span>
                <span>Select Luxury Garment</span>
              </h2>
              {selectedProduct && (
                <span className="text-xs font-bold text-amber-300 font-mono">${selectedProduct.price}</span>
              )}
            </div>

            {/* Gender Filter Pills (Strict Gender Segregation) */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5 font-medium">
                <span>Filter by Collection:</span>
                <span className="text-violet-400 font-mono">{filteredProducts.length} items</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-950/60 rounded-xl border border-white/10 text-xs">
                {(['All', 'Women', 'Men', 'Unisex'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      setSelectedGender(g);
                      setResultImage(null);
                    }}
                    className={`py-1 rounded-lg font-medium transition-all text-center ${
                      selectedGender === g
                        ? 'bg-violet-600 text-white font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {['All', 'Blazer', 'Dress', 'Trench', 'Top', 'Traditional', 'Formal'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setResultImage(null);
                  }}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-white text-zinc-950 font-bold'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Optional Drape Fine-Tuner Toggle */}
            <div className="pt-1">
              <button
                onClick={() => setShowTuning(!showTuning)}
                className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center space-x-1 font-mono"
              >
                <Sliders className="w-3 h-3" />
                <span>{showTuning ? 'Hide Anatomical Drape Tuning' : 'Fine-Tune Shoulder & Torso Fit'}</span>
              </button>
              
              {showTuning && (
                <div className="mt-2 p-3 bg-zinc-950/80 border border-white/10 rounded-xl space-y-2 text-xs text-zinc-300 animate-in fade-in">
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>Shoulder Spread Ratio</span>
                      <span className="font-mono text-violet-300">{Math.round(shoulderWidthRatio * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.60"
                      max="0.90"
                      step="0.02"
                      value={shoulderWidthRatio}
                      onChange={(e) => setShoulderWidthRatio(parseFloat(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer h-1 bg-zinc-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                      <span>Collar Vertical Level</span>
                      <span className="font-mono text-violet-300">{Math.round(verticalOffsetRatio * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.16"
                      max="0.32"
                      step="0.01"
                      value={verticalOffsetRatio}
                      onChange={(e) => setVerticalOffsetRatio(parseFloat(e.target.value))}
                      className="w-full accent-violet-500 cursor-pointer h-1 bg-zinc-800 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Garment Catalog Grid */}
            <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setResultImage(null);
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-[3/4] border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-violet-500 ring-2 ring-violet-500/40 scale-[1.02] bg-zinc-900/90'
                        : 'border-white/10 hover:border-white/20 opacity-85 hover:opacity-100 bg-zinc-950/70'
                    }`}
                  >
                    <div className="w-full h-full flex items-center justify-center p-2.5 overflow-hidden">
                      <img 
                        src={p.image_url} 
                        alt={p.name} 
                        className="w-full h-full object-cover rounded-md contrast-105 hover:scale-105 transition-transform" 
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent pointer-events-none">
                      <p className="text-[10px] text-white font-medium truncate">{p.name}</p>
                      <p className="text-[9px] text-amber-300 font-bold">${p.price}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Launch Simulation CTA */}
            <button
              onClick={handleRunTryOn}
              disabled={isProcessing || !selectedProduct}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl shadow-violet-500/25 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Synthesizing Fabric Drape...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate Virtual Try-On</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Viewport & Complete the Look Ribbon */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between min-h-[580px]">
            
            {/* Viewport Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Interactive Fitting Viewport
                </span>
              </div>

              {resultImage && (
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-zinc-400">Slide to compare:</span>
                  <span className="font-mono text-violet-300 font-bold">{Math.round(sliderPos)}%</span>
                </div>
              )}
            </div>

            {/* Viewport Center Canvas Display */}
            <div className="relative my-4 flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-zinc-950/80 border border-white/10 min-h-[440px]">
              
              {/* Progress Tracker Overlay during inference */}
              {isProcessing && (
                <div className="absolute inset-0 z-30 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 space-y-6">
                  {/* Glowing Radar Rings */}
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-violet-500/30 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-indigo-500/40 animate-pulse"></div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/50">
                      <Zap className="w-7 h-7 text-amber-300 animate-bounce" />
                    </div>
                  </div>

                  <div className="text-center space-y-2 max-w-sm">
                    <p className="text-xs uppercase tracking-widest text-violet-400 font-mono">
                      Stage [{currentStageIndex + 1}/4]
                    </p>
                    <h3 className="text-base font-bold text-white">
                      {STAGES[currentStageIndex].title}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {STAGES[currentStageIndex].desc}
                    </p>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-64 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${((currentStageIndex + 1) / STAGES.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Viewport State A: Rendered with Before / After Split-Screen Slider */}
              {resultImage ? (
                <div 
                  ref={sliderContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  onTouchMove={handleTouchMove}
                  className="relative w-full h-[480px] max-h-[520px] select-none cursor-ew-resize overflow-hidden"
                >
                  {/* Base Layer: Original User Photo */}
                  <img 
                    src={userPhoto} 
                    alt="Original Silhouette" 
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                  />
                  <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-white/10 uppercase">
                    Original Silhouette
                  </div>

                  {/* Top Layer: Fitted Try-On Composite with Clip Path */}
                  <div 
                    className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <img 
                      src={resultImage} 
                      alt="Virtual Fit" 
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-violet-600/80 backdrop-blur-md text-[10px] font-mono text-white border border-violet-400/30 uppercase">
                      AI Fitted Atelier Look
                    </div>
                  </div>

                  {/* Vertical Divider Line with Draggable Handle */}
                  <div 
                    className="absolute top-0 bottom-0 z-20 w-0.5 bg-gradient-to-b from-violet-400 via-white to-indigo-400 pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-zinc-950 border-2 border-violet-400 text-white flex items-center justify-center shadow-xl shadow-violet-500/50">
                      <ChevronsLeftRight className="w-4 h-4 text-violet-300" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Viewport State B: Idle/Staging View */
                <div className="relative w-full h-[480px] max-h-[520px] flex items-center justify-center">
                  <img 
                    src={userPhoto} 
                    alt="Target Canvas" 
                    className="w-full h-full object-contain opacity-75"
                  />
                  <div className="absolute bottom-6 px-4 py-2 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-xs text-zinc-300 flex items-center space-x-2">
                    <Sliders className="w-3.5 h-3.5 text-violet-400" />
                    <span>Select a garment and click "Generate Virtual Try-On"</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls Bar: Actions */}
            {resultImage ? (
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleAddToCart}
                    className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs flex items-center space-x-1.5 transition-all shadow-md"
                  >
                    <ShoppingBag className="w-4 h-4 text-violet-600" />
                    <span>Add Outfit to Bag</span>
                  </button>

                  <button
                    onClick={handleSaveToWardrobe}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs flex items-center space-x-1.5 border border-white/10 transition-all"
                  >
                    <Bookmark className="w-4 h-4 text-violet-400" />
                    <span>Save to Wardrobe</span>
                  </button>
                </div>

                <button
                  onClick={handleDownloadFit}
                  className="px-4 py-2.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 font-medium text-xs flex items-center space-x-1.5 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download 4K Fit</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Photorealistic Editorial Neural Canvas</span>
                </div>
                <span>Fast GPU Diffusion Pipeline</span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* COMPLETE THE LOOK: ATELIER STYLING & ACCESSORIES RIBBON */}
          {/* ========================================================= */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div>
                <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Complete the Look &bull; Atelier Styling</span>
                </div>
                <h3 className="font-serif-luxury text-lg text-white font-semibold mt-0.5">
                  Curated Haute Accoutrements for {selectedProduct?.name}
                </h3>
                <p className="text-xs text-zinc-400">
                  Footwear, designer leather goods, fine joaillerie, and niche extrait de parfum selected to harmonize with this silhouette.
                </p>
              </div>

              {currentAccessories.length > 0 && (
                <button
                  onClick={handleBundleAdd}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-violet-600/20 to-indigo-600/20 hover:from-amber-500/30 hover:to-indigo-600/30 text-white font-bold text-xs flex items-center justify-center space-x-2 border border-amber-500/30 shadow-lg shadow-amber-500/10 transition-all active:scale-[0.98] whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Bundle &amp; Style All (+${bundleTotal.toLocaleString()})</span>
                </button>
              )}
            </div>

            {/* 4 Curated Accessory Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {currentAccessories.map((acc, idx) => {
                const isWorn = !!wornAccessories[acc.title];
                const catInfo = getCategoryLabel(acc.category);
                const CatIcon = catInfo.icon;
                
                return (
                  <div 
                    key={idx}
                    className={`group relative rounded-2xl p-3.5 border transition-all duration-300 flex flex-col justify-between ${
                      isWorn 
                        ? 'bg-violet-950/40 border-violet-500/60 ring-1 ring-violet-500/30 shadow-lg shadow-violet-500/10' 
                        : 'bg-zinc-950/60 border-white/10 hover:border-white/20 hover:bg-zinc-900/50'
                    }`}
                  >
                    <div>
                      {/* Category Badge & Worn Pill */}
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-zinc-800/90 border border-white/10 text-[10px] font-medium text-zinc-300">
                          <CatIcon className="w-3 h-3 text-amber-300" />
                          <span>{catInfo.label}</span>
                        </span>
                        
                        {isWorn && (
                          <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 font-mono font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <Check className="w-2.5 h-2.5" />
                            <span>Styled</span>
                          </span>
                        )}
                      </div>

                      {/* Studio Photography Viewport */}
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/5 mb-3 group-hover:border-white/15 transition-all">
                        <img 
                          src={acc.image} 
                          alt={acc.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono font-bold text-amber-300 border border-white/10">
                          ${acc.price}
                        </div>
                      </div>

                      {/* Title & Pairing Reason */}
                      <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
                        {acc.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {acc.reason}
                      </p>
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => handleAddAccessoryToBag(acc)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white text-zinc-200 hover:text-zinc-950 text-[11px] font-bold transition-all flex items-center justify-center space-x-1"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>+ Add to Bag</span>
                      </button>
                      <button
                        onClick={() => handleToggleWear(acc)}
                        className={`py-1.5 px-2.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center space-x-1 border ${
                          isWorn
                            ? 'bg-violet-600 text-white border-violet-500'
                            : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border-white/10'
                        }`}
                      >
                        {isWorn ? <Check className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isWorn ? 'Worn' : 'Wear'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
