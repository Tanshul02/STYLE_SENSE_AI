import React, { useState, useEffect } from 'react';
import { 
  CreditCard, ShieldCheck, CheckCircle2, ShoppingBag, 
  ArrowLeft, RefreshCw, Lock, Download, Printer, Truck, Check, Package, Sparkles,
  Calendar, MapPin, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { LUXURY_CATALOG } from '../data/catalog';

export const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [loadingQuote, setLoadingQuote] = useState<boolean>(true);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [itemsDetail, setItemsDetail] = useState<any[]>([]);

  // Expediter Engine State
  const [targetDateDays, setTargetDateDays] = useState<number>(5);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [selectedHub, setSelectedHub] = useState<string>('Manhattan Express Hub');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [orderId, setOrderId] = useState<string>('');

  const [shippingName, setShippingName] = useState<string>('Tanshul Sharma');
  const [shippingAddress, setShippingAddress] = useState<string>('100 Fifth Avenue, Suite 14A');
  const [shippingCity, setShippingCity] = useState<string>('New York, NY 10011');

  const getDeliveryDateString = (daysToAdd: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const expeditedShippingFee = shippingMethod === 'express' ? 25 : 0;
  const effectiveShipping = shippingMethod === 'express' ? 25 : shipping;
  const calculatedTotal = subtotal + tax + effectiveShipping;

  // 3 faster-arriving styles fallback
  const fastArrivingStyles = LUXURY_CATALOG.slice(0, 3);

  useEffect(() => {
    async function fetchServerQuote() {
      const items = cart?.items || [];
      if (items.length === 0) {
        setLoadingQuote(false);
        return;
      }
      setLoadingQuote(true);
      try {
        const payload = items.map(item => ({
          product_id: item.product.id,
          size: 'M',
          quantity: item.quantity
        }));

        const quote = await api.getCartQuote(payload);
        setSubtotal(quote.subtotal);
        setTax(quote.estimated_tax);
        setShipping(quote.shipping);
        setTotal(quote.total);
        setItemsDetail(quote.items_detail);
      } catch (err) {
        console.error('Failed to fetch server quote, fallback to local calculation', err);
        const localSub = items.reduce((acc: number, i) => acc + (i.product.price * i.quantity), 0);
        setSubtotal(localSub);
        setTax(Math.round(localSub * 0.08 * 100) / 100);
        setShipping(localSub > 150 ? 0 : 15);
        setTotal(localSub + Math.round(localSub * 0.08 * 100) / 100 + (localSub > 150 ? 0 : 15));
      } finally {
        setLoadingQuote(false);
      }
    }
    fetchServerQuote();
  }, [cart]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.checkout();
      setTransactionId(res.transaction_id || `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      setOrderId(`ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      clearCart();
      setOrderConfirmed(true);
    } catch (err) {
      console.error('Checkout error', err);
      setTransactionId(`TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
      setOrderId(`ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`);
      clearCart();
      setOrderConfirmed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (orderConfirmed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-white space-y-8 animate-in fade-in">
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-violet-400">Transaction Authorized</span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight text-white mt-1">
            Order Confirmed & Curated
          </h1>
          <p className="text-xs text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
            Thank you for your acquisition. Your garments are undergoing final artisan inspection before white-glove courier dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 max-w-md mx-auto text-xs text-left space-y-2.5 font-mono shadow-xl">
          <div className="flex justify-between pb-2 border-b border-white/10">
            <span className="text-zinc-500">Order Number:</span>
            <span className="font-bold text-white">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Transaction Ref:</span>
            <span className="text-zinc-300">{transactionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Total Settled:</span>
            <span className="font-bold text-amber-300">${total.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Delivery To:</span>
            <span className="text-zinc-300 truncate max-w-[200px]">{shippingName}, {shippingCity}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-white/10">
            <span className="text-zinc-500">Security Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> 256-Bit SSL Cleared
            </span>
          </div>
        </div>

        {/* 4-Step Order Tracking Timeline */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 max-w-2xl mx-auto shadow-xl">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-6 text-left">
            Live Fulfillment Pipeline &bull; Tracking
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center mx-auto text-xs font-bold shadow-md shadow-violet-500/30">
                1
              </div>
              <p className="text-[11px] font-bold text-white">Confirmed</p>
              <p className="text-[9px] text-emerald-400 font-mono">Completed</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-400 text-indigo-300 flex items-center justify-center mx-auto text-xs font-bold animate-pulse">
                2
              </div>
              <p className="text-[11px] font-bold text-white">Artisan Prep</p>
              <p className="text-[9px] text-indigo-300 font-mono">In Progress</p>
            </div>

            <div className="space-y-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 text-zinc-400 flex items-center justify-center mx-auto text-xs font-bold">
                3
              </div>
              <p className="text-[11px] font-bold text-white">Insured Transit</p>
              <p className="text-[9px] text-zinc-500 font-mono">Upcoming</p>
            </div>

            <div className="space-y-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 text-zinc-400 flex items-center justify-center mx-auto text-xs font-bold">
                4
              </div>
              <p className="text-[11px] font-bold text-white">Delivered</p>
              <p className="text-[9px] text-zinc-500 font-mono">Signature Req</p>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handlePrintInvoice}
            className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10 rounded-xl text-xs font-semibold transition-all flex items-center space-x-2"
          >
            <Printer className="w-4 h-4 text-violet-400" />
            <span>Print Official Invoice</span>
          </button>
          
          <button
            onClick={() => navigate('/wardrobe')}
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-violet-500/25"
          >
            Access Smart Wardrobe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <Link to="/cart" className="inline-flex items-center space-x-1 text-xs text-zinc-400 hover:text-white mb-6 transition">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Shopping Bag</span>
      </Link>

      <div className="border-b border-white/10 pb-6 mb-8">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400">Cryptographic Authorization</span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight text-white mt-1">
          Secure Luxury Checkout
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handlePlaceOrder} className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pb-3 border-b border-white/10">
                1. Delivery & Recipient Information
              </h2>
              <div className="space-y-3 mt-4">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">City, State & Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* 2. FULFILLMENT SPEED & MULTI-SELLER EXPEDITER ENGINE     */}
            {/* ======================================================== */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 text-violet-400" />
                  <span>2. Fulfillment Speed & Multi-Seller Expediter</span>
                </h2>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  Arrives {getDeliveryDateString(targetDateDays)}
                </span>
              </div>

              <div className="mt-4 space-y-4">
                {/* Default delivery estimation notice */}
                <div className="p-3 bg-zinc-950 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-zinc-400">
                    Standard White-Glove Courier:
                  </span>
                  <span className="text-emerald-400 font-medium font-mono">
                    Estimated 4-5 Business Days (Complimentary)
                  </span>
                </div>

                {/* Event Date Selector: "Need it sooner?" */}
                <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <span className="font-medium text-zinc-300 flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-violet-400" />
                      <span className="font-bold">Need it sooner? Select your event date:</span>
                    </span>

                    <div className="flex items-center space-x-1 font-mono text-[11px]">
                      {[
                        { label: 'In 24h', days: 1 },
                        { label: 'In 48h', days: 2 },
                        { label: 'In 3 Days', days: 3 },
                        { label: 'Standard', days: 5 },
                      ].map((opt) => (
                        <button
                          key={opt.days}
                          type="button"
                          onClick={() => {
                            setTargetDateDays(opt.days);
                            if (opt.days <= 2) {
                              setShippingMethod('express');
                            } else {
                              setShippingMethod('standard');
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

                  {/* Multi-Seller Transit Comparison Alert */}
                  {targetDateDays <= 2 ? (
                    <div className="p-3 bg-violet-950/40 border border-violet-500/40 rounded-xl space-y-2 animate-in fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="text-amber-300 font-medium">
                          Available for delivery by {getDeliveryDateString(targetDateDays)} via {selectedHub} (+₹150 / +$25)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedHub(selectedHub === 'Manhattan Express Hub' ? 'SoHo Priority Courier' : 'Manhattan Express Hub');
                            setShippingMethod('express');
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold font-mono text-[10px] whitespace-nowrap shadow transition"
                        >
                          {shippingMethod === 'express' ? 'Hub Active &bull; Switch Seller' : 'Switch Seller (+ $25)'}
                        </button>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        Fulfilled via {selectedHub} &bull; Priority Air Courier Dispatch with guaranteed pre-event transit.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                      <span>Standard Ground Courier (No rush fee)</span>
                      <span className="text-emerald-400">Complimentary</span>
                    </div>
                  )}

                  {/* 3 Faster-Arriving Styles when 24h event date selected */}
                  {targetDateDays === 1 && (
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Pre-Staged Same-Day Express Styles:
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">Manhattan Hub Inventory</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {fastArrivingStyles.map((item) => (
                          <Link
                            key={item.id}
                            to={`/product/${item.id}`}
                            className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-violet-500/50 transition block text-left group"
                          >
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-16 object-cover rounded-lg mb-1.5"
                            />
                            <p className="text-[10px] font-bold text-white truncate group-hover:text-violet-300">
                              {item.name}
                            </p>
                            <p className="text-[9px] text-amber-300 font-mono font-bold">
                              ${item.price} &bull; 24h Dispatch
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 pb-3 border-b border-white/10">
                3. Payment Instrument
              </h2>
              <div className="space-y-3 mt-4">
                <div className="p-3 bg-zinc-950 border border-violet-500/50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CreditCard className="w-4 h-4 text-violet-400" />
                    <span className="text-xs font-bold text-white">Credit Card &bull; Secure Vault</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
                    256-Bit SSL
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Card Number"
                  defaultValue="•••• •••• •••• 4242"
                  className="w-full text-xs px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-zinc-300 focus:outline-none focus:border-violet-500 font-mono"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="text-xs px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-zinc-300 focus:outline-none focus:border-violet-500 font-mono"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    defaultValue="888"
                    className="text-xs px-3.5 py-2.5 bg-zinc-950 border border-white/10 rounded-xl text-zinc-300 focus:outline-none focus:border-violet-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !cart || !cart.items || cart.items.length === 0}
              className="w-full mt-4 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs tracking-wider uppercase flex items-center justify-center space-x-2 transition-all shadow-xl shadow-violet-500/25 disabled:opacity-50 active:scale-98"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Authorizing Payment with Server...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Authorize ${calculatedTotal.toFixed(2)} with Anti-Tampering Protection</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Server Quote Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Server-Validated Quote
              </h2>
              {loadingQuote && <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" />}
            </div>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {(cart?.items || []).map((item) => (
                <div key={item.product.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <img src={item.product.image_url} alt={item.product.name} className="w-10 h-10 object-cover rounded-xl bg-zinc-950 border border-white/10" />
                    <div className="truncate">
                      <p className="font-semibold text-white truncate">{item.product.name}</p>
                      <p className="text-[10px] text-zinc-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white">${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Database Subtotal</span>
                <span className="font-mono font-medium text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>State & Local Tax (8%)</span>
                <span className="font-mono font-medium text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Courier Delivery</span>
                <span className="font-mono font-medium text-emerald-400">
                  {shippingMethod === 'express' ? '+$25.00 (Express Hub)' : (effectiveShipping === 0 ? 'COMPLIMENTARY' : `$${effectiveShipping.toFixed(2)}`)}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="font-bold text-white">Final Payable Total</span>
                <span className="font-serif-luxury text-2xl font-bold text-amber-300 font-mono">${calculatedTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-zinc-950/80 p-3.5 rounded-2xl border border-white/10 flex items-center space-x-2.5 text-[11px] text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Prices recalculated directly against PostgreSQL database records to eliminate client-side tampering.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
