import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Wand2, Shirt, Bot, ArrowRight, Compass, 
  ShoppingBag, Check, Bookmark, Heart, SunMedium, Eye, Zap, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';
import { ClothingItem, Product } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleBestie } = useUI();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = user?.full_name?.split(' ')[0] || 'Tanshul';

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [wItems, pItems] = await Promise.all([
          api.getWardrobe(),
          api.getProducts()
        ]);
        setWardrobe(wItems);
        setProducts(pItems);
      } catch (err) {
        console.warn('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleQuickAdd = async (product: Product) => {
    await addToCart(product);
    setAddedItemNotification(product.name);
    setTimeout(() => setAddedItemNotification(null), 3000);
  };

  return (
    <div className="min-h-screen text-white pb-24">
      
      {/* Toast Notification */}
      {addedItemNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-violet-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-semibold">Added {addedItemNotification} to Shopping Bag ✨</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Luxury Hero Banner */}
        <section className="relative rounded-3xl p-8 sm:p-14 border border-white/10 bg-zinc-900/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-violet-600/20 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-widest text-violet-400 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Haute Fashion Intelligence Atelier</span>
            </div>
            
            <h1 className="font-serif-luxury text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              {getGreeting()}, <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">{firstName}</span>
            </h1>
            
            <p className="text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
              Step into your autonomous luxury styling suite. Curate bespoke looks with explainable neural scoring, try on pieces with 4K canvas diffusion, and consult your personal AI director.
            </p>

            <div className="flex flex-wrap gap-3.5 pt-2">
              <Link
                to="/try-on"
                className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all flex items-center space-x-2 shadow-lg shadow-violet-500/25 active:scale-95"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Launch Try-On Studio</span>
              </Link>
              
              <button
                onClick={toggleBestie}
                className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/15 transition-all flex items-center space-x-2 active:scale-95"
              >
                <Bot className="w-4 h-4 text-violet-400" />
                <span>Consult Bestie AI</span>
              </button>

              <Link
                to="/shop"
                className="px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4 text-zinc-400" />
                <span>Explore Boutique</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Section: Atelier Curated Look */}
        <section className="space-y-4">
          <div className="flex justify-between items-end pb-2 border-b border-white/10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Daily Atelier Recommendation</span>
              <h2 className="font-serif-luxury text-3xl font-bold text-white mt-0.5">Today's Signature Ensemble</h2>
            </div>
            <Link to="/ai-fit-studio" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center space-x-1">
              <span>Open Fit Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((item, idx) => (
              <div 
                key={item.id}
                className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-4 shadow-xl flex flex-col justify-between group hover:border-violet-500/40 transition-all"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 mb-4">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                      onClick={() => toggleWishlist(item.id)}
                      className="p-2 rounded-full bg-zinc-950/70 backdrop-blur-md text-white hover:text-rose-400 border border-white/10 transition"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted(item.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-300">
                    Match Score: 9.{8 - idx}/10
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">{item.brand}</span>
                      <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
                    </div>
                    <span className="text-sm font-mono font-bold text-amber-300">${item.price}</span>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => handleQuickAdd(item)}
                      className="flex-1 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                    <Link
                      to="/try-on"
                      className="px-3 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 border border-violet-500/30 text-xs font-medium transition flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Try On</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Smart Wardrobe & Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center mb-4">
                <Shirt className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-white">Digital Wardrobe Vault</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                You have {wardrobe.length} digitized fashion pieces cataloged with automatic chromatic tagging, occasion indexing, and fabric thermal weights.
              </p>
            </div>
            <Link
              to="/wardrobe"
              className="w-fit px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 text-xs font-bold flex items-center space-x-2 transition"
            >
              <span>Manage Wardrobe</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-white">Contextual Occasion Advice</h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Wondering if an outfit is appropriate for a rooftop gala, business summit, or dinner date? Get real-time AI etiquette analysis.
              </p>
            </div>
            <Link
              to="/should-i-wear-this"
              className="w-fit px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 text-xs font-bold flex items-center space-x-2 transition"
            >
              <span>Evaluate An Outfit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};
