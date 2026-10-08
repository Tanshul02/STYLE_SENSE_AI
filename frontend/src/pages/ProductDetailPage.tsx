import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ShoppingBag, Heart, Star, Sparkles, Eye, ShieldCheck, 
  Check, Truck, Clock, Calendar, Zap, RefreshCw, ChevronRight, MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { Product, SellerOption } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [catalogAlternatives, setCatalogAlternatives] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [loading, setLoading] = useState(true);
  const [addedToast, setAddedToast] = useState(false);

  // Delivery Expediter & Multi-Seller Switcher States
  const [selectedSeller, setSelectedSeller] = useState<SellerOption | null>(null);
  const [targetDateDays, setTargetDateDays] = useState<number>(3); // 1 = tomorrow, 2 = 48h, 3 = standard
  const [useExpressShipping, setUseExpressShipping] = useState<boolean>(false);
  const [showSellerDrawer, setShowSellerDrawer] = useState<boolean>(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.getProduct(id);
        setProduct(data);
        if (data.sellers && data.sellers.length > 0) {
          setSelectedSeller(data.sellers[0]);
        }

        // Fetch category alternatives for expediter recommendations
        const allProds = await api.getProducts(data.category);
        setCatalogAlternatives(allProds.filter(p => p.id !== data.id).slice(0, 3));
      } catch (err) {
        console.warn('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen text-white py-24 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-bold">Product not found</h2>
        <Link to="/shop" className="text-xs font-semibold text-violet-400 hover:underline">
          Return to Boutique Catalog
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    await addToCart(product, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleTryOn = () => {
    navigate('/try-on', { state: { productId: product.id } });
  };

  // Calculate target estimated date
  const getDeliveryDateString = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const currentTransitDays = useExpressShipping
    ? (selectedSeller?.express_days || 1)
    : (selectedSeller?.standard_days || 3);

  const deliveryDateFormatted = getDeliveryDateString(currentTransitDays);

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-900 border border-violet-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-in fade-in slide-in-from-bottom-4">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">Added {product.name} to Shopping Bag ✨</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link to="/shop" className="inline-flex items-center space-x-2 text-xs text-zinc-400 hover:text-white transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Luxury Boutique</span>
        </Link>

        {/* Product Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left Column: Edge-to-Edge Image */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 shadow-2xl group">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-3 rounded-full bg-zinc-950/70 backdrop-blur-md text-white hover:text-rose-400 border border-white/10 transition shadow-lg"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300">
                {product.category} &bull; {product.gender?.toUpperCase() || 'UNISEX'}
              </div>
            </div>

            {/* Quick Virtual Try-On Banner below image */}
            <button
              onClick={handleTryOn}
              className="w-full py-3.5 rounded-2xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-bold transition flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>Simulate Drape on Your Portrait Silhouette &rarr;</span>
            </button>
          </div>

          {/* Right Column: Details, Expediter & Fitting Actions */}
          <div className="md:col-span-6 space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400">{product.brand}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-white/10">
                  {product.audience}
                </span>
              </div>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-3 pt-1">
                <span className="font-serif-luxury text-3xl font-bold text-amber-300 font-mono">${product.price}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                  In Stock &bull; Insured Delivery
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              {product.description || 'Meticulously crafted with architectural tailoring. Optimized for instant neural virtual try-on drape simulation over your uploaded portrait silhouette.'}
            </p>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-300">Select Atelier Size:</span>
                <span className="text-zinc-500 font-mono">Size Guide</span>
              </div>
              <div className="flex items-center space-x-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-11 h-11 rounded-xl text-xs font-bold border transition-all ${
                      selectedSize === size
                        ? 'bg-white text-zinc-950 border-white shadow-lg'
                        : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* ======================================================== */}
            {/* DELIVERY DATE EXPEDITER & MULTI-SELLER SWITCHER CARD    */}
            {/* ======================================================== */}
            <div className="bg-zinc-900/70 border border-white/10 rounded-2xl p-4.5 space-y-3.5 shadow-lg">
              
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-violet-400" />
                  <span>Fulfillment & Dispatch Expediter</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  Arrives {deliveryDateFormatted}
                </span>
              </div>

              {/* Active Fulfillment Hub Info */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="text-[11px] text-zinc-400 font-medium">Fulfilled from:</p>
                  <p className="font-semibold text-white flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-violet-400 shrink-0" />
                    <span>{selectedSeller?.name || 'Atelier Sense Flagship'} ({selectedSeller?.location || 'New York, NY'})</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowSellerDrawer(!showSellerDrawer)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-violet-300 border border-white/10 text-[10px] font-mono transition"
                >
                  {showSellerDrawer ? 'Close Hubs' : 'Switch Seller Hub'}
                </button>
              </div>

              {/* Interactive Expedite Speed Selector: "Need it sooner?" */}
              <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-zinc-300 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    <span className="font-bold">Need it sooner? Select your event date:</span>
                  </span>
                  
                  {/* Event Date Selector Pills */}
                  <div className="flex items-center space-x-1 font-mono text-[11px]">
                    {[
                      { label: 'In 24h', days: 1 },
                      { label: 'In 48h', days: 2 },
                      { label: 'In 3 Days', days: 3 },
                      { label: 'Standard', days: 5 },
                    ].map((opt) => (
                      <button
                        key={opt.days}
                        onClick={() => {
                          setTargetDateDays(opt.days);
                          if (opt.days <= 2) {
                            setUseExpressShipping(true);
                          } else {
                            setUseExpressShipping(false);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg border transition-all ${
                          targetDateDays === opt.days
                            ? 'bg-violet-600 border-violet-500 text-white font-bold shadow'
                            : 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expediter Comparison Alert & Seller Switch Prompt */}
                {targetDateDays <= 2 && (
                  <div className="p-3 bg-violet-950/40 border border-violet-500/40 rounded-xl space-y-2 animate-in fade-in">
                    {(() => {
                      // Check if current seller can fulfill in time
                      const canCurrentFulfill = (selectedSeller?.express_days || 3) <= targetDateDays;
                      const altFastSeller = product.sellers?.find(s => s.id !== selectedSeller?.id && s.express_days <= targetDateDays);

                      if (canCurrentFulfill) {
                        return (
                          <div className="flex items-center justify-between text-xs text-emerald-400 font-medium">
                            <span className="flex items-center space-x-1.5">
                              <Check className="w-4 h-4" />
                              <span>Guaranteed arrival by {getDeliveryDateString(targetDateDays)} via active hub.</span>
                            </span>
                            <span className="font-mono text-zinc-300 text-[11px]">Express Air (+$25)</span>
                          </div>
                        );
                      } else if (altFastSeller) {
                        return (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <span className="text-amber-300">
                              Available for delivery by {getDeliveryDateString(altFastSeller.express_days)} via {altFastSeller.name} Express Hub (+${altFastSeller.express_price})
                            </span>
                            <button
                              onClick={() => {
                                setSelectedSeller(altFastSeller);
                                setUseExpressShipping(true);
                              }}
                              className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold font-mono text-[10px] whitespace-nowrap shadow transition"
                            >
                              Switch Seller Hub &rarr;
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-xs text-amber-300">
                            We cannot deliver this exact piece in {targetDateDays * 24} hours, but here are similar styles arriving faster:
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <button
                    onClick={() => { setUseExpressShipping(false); setTargetDateDays(3); }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      !useExpressShipping
                        ? 'border-violet-500 bg-violet-600/20 text-white'
                        : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span>Standard Dispatch</span>
                      <span className="text-emerald-400 font-mono">Free</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-0.5">3-5 days delivery</p>
                  </button>

                  <button
                    onClick={() => { setUseExpressShipping(true); setTargetDateDays(1); }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      useExpressShipping
                        ? 'border-violet-500 bg-violet-600/20 text-white'
                        : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-amber-300 flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-amber-300" />
                        <span>Express Air Hub</span>
                      </span>
                      <span className="text-violet-300 font-mono">+$25</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Guaranteed 24-48h arrival</p>
                  </button>
                </div>
              </div>

              {/* Multi-Seller Switcher Drawer (Lists alternative partner fulfillment centers) */}
              {showSellerDrawer && product.sellers && product.sellers.length > 0 && (
                <div className="p-3 bg-zinc-950/90 border border-white/10 rounded-xl space-y-2 animate-in fade-in">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-violet-400">
                    Available Fulfillment Centers & Sellers:
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {product.sellers.map((seller) => {
                      const isCurrent = selectedSeller?.id === seller.id;
                      return (
                        <div
                          key={seller.id}
                          onClick={() => { setSelectedSeller(seller); setShowSellerDrawer(false); }}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                            isCurrent
                              ? 'border-violet-500 bg-violet-900/30 text-white'
                              : 'border-white/10 bg-zinc-900/60 text-zinc-300 hover:border-white/30'
                          }`}
                        >
                          <div>
                            <p className="font-semibold text-white">{seller.name}</p>
                            <p className="text-[10px] text-zinc-400">{seller.location} &bull; {seller.standard_days} days transit</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                              Express: {seller.express_days}d (+${seller.express_price})
                            </span>
                            {isCurrent && <p className="text-[9px] text-violet-300 font-bold uppercase mt-0.5">Active</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Urgent Date Expediter: Visually Similar In-Stock Alternatives that Arrive Faster */}
              {useExpressShipping && catalogAlternatives.length > 0 && (
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-amber-300">
                    Need it sooner? 3 Similar Styles Arriving Faster:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {catalogAlternatives.map((alt) => (
                      <Link
                        key={alt.id}
                        to={`/product/${alt.id}`}
                        className="group p-1.5 rounded-xl bg-zinc-950/70 border border-white/10 hover:border-violet-500/40 transition block text-left"
                      >
                        <img src={alt.image_url} alt={alt.name} className="w-full aspect-square object-cover rounded-lg mb-1" />
                        <p className="text-[10px] font-semibold text-white truncate">{alt.name}</p>
                        <p className="text-[9px] font-mono text-emerald-400">1-Day Express Ready</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-xl"
              >
                <ShoppingBag className="w-4 h-4 text-violet-600" />
                <span>Add to Shopping Bag (${product.price})</span>
              </button>

              <button
                onClick={handleTryOn}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-violet-500/25"
              >
                <Eye className="w-4 h-4 text-amber-300" />
                <span>Virtual Try-On in 4K Atelier</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/10 flex items-center space-x-3 text-xs text-zinc-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Complimentary insured express delivery & artisan garment bag included.</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
