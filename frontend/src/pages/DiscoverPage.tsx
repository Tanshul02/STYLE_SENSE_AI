import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Heart, Star, Sparkles, ArrowUpDown, Eye, Check } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('All');
  const [audience, setAudience] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['All', 'Formal', 'Casual', 'Traditional', 'Party Wear', 'Footwear', 'Accessories'];
  const audiences = ['All', 'Women', 'Men', 'Unisex'];

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts(category, audience, search);
      setProducts(data);
    } catch (err) {
      console.warn('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category, audience]);

  const handleQuickAdd = async (product: Product) => {
    await addToCart(product);
    setToastMessage(`Added ${product.name} to bag`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isExcludedForMen = (p: Product) => {
    const text = (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase();
    return /saree|dress|skirt|heels|blouse|slip dress|women/i.test(text);
  };

  const isExcludedForWomen = (p: Product) => {
    const text = (p.name + ' ' + p.category + ' ' + (p.description || '')).toLowerCase();
    return /men's suit|bandhgala|pocket square|men's jacket|chino trousers/i.test(text);
  };

  const sortedProducts = [...products]
    .filter(p => {
      if (audience === 'All') return true;
      const pGender = (p.gender || p.audience || 'unisex').toLowerCase();
      const target = audience.toLowerCase();
      if (target === 'men') {
        if (pGender === 'women' || isExcludedForMen(p)) return false;
        return pGender === 'men' || pGender === 'unisex';
      }
      if (target === 'women') {
        if (pGender === 'men' || isExcludedForWomen(p)) return false;
        return pGender === 'women' || pGender === 'unisex';
      }
      if (target === 'unisex') return pGender === 'unisex';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-violet-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-semibold">{toastMessage} ✨</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Luxury Ready-to-Wear Atelier</span>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white tracking-tight mt-1">
              Curated Boutique & Catalog
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Browse {products.length} architectural silhouettes designed for seamless virtual try-on simulation.
            </p>
          </div>
          <Link
            to="/try-on"
            className="px-4 py-2 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 border border-violet-500/30 text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Open Virtual Try-On</span>
          </Link>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search catalog by title, fabric (cashmere, silk, wool), or vibe..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadProducts()}
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/80 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* Audience Pills */}
            <div className="flex items-center space-x-1 bg-zinc-900/80 p-1 rounded-xl border border-white/10 w-full lg:w-auto justify-center">
              {audiences.map((aud) => (
                <button
                  key={aud}
                  onClick={() => setAudience(aud)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    audience === aud ? 'bg-violet-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 bg-zinc-900/80 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none text-zinc-300 font-medium"
              >
                <option value="featured" className="bg-zinc-950 text-white">Featured Atelier</option>
                <option value="price-low" className="bg-zinc-950 text-white">Price: Low to High</option>
                <option value="price-high" className="bg-zinc-950 text-white">Price: High to Low</option>
                <option value="rating" className="bg-zinc-950 text-white">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-white text-zinc-950 font-bold border-white'
                    : 'bg-zinc-900/60 text-zinc-400 border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center text-zinc-400 text-xs">
            Loading luxury collection...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-3.5 shadow-xl flex flex-col justify-between group hover:border-violet-500/40 transition-all"
              >
                {/* Image Container with Zoom */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-950 mb-3.5">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 rounded-full bg-zinc-950/70 backdrop-blur-md text-white hover:text-rose-400 border border-white/10 transition"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted(p.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
                    {p.category}
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="min-w-0 pr-2">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">{p.brand}</p>
                      <Link to={`/product/${p.id}`} className="text-xs font-bold text-white hover:text-violet-300 truncate block">
                        {p.name}
                      </Link>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300 shrink-0">${p.price}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 pt-2">
                    <button
                      onClick={() => handleQuickAdd(p)}
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
        )}

      </div>
    </div>
  );
};
