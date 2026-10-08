import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-6 flex items-baseline justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Order Verification</span>
            <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white tracking-tight mt-1">
              Shopping Bag
            </h1>
          </div>
          {cart && cart.items.length > 0 && (
            <span className="text-xs font-mono text-zinc-400">{cart.item_count} luxury items selected</span>
          )}
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-12 text-center border border-white/10 max-w-md mx-auto space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">Your bag is empty</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Explore tailored silhouettes and curated haute couture in our boutique.
            </p>
            <Link
              to="/shop"
              className="inline-flex px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25"
            >
              Explore Luxury Boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items Column */}
            <div className="lg:col-span-8 bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10 last:border-none last:pb-0">
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img src={item.product.image_url} alt={item.product.name} className="w-20 h-24 object-cover rounded-2xl bg-zinc-950 border border-white/10 shrink-0" />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">{item.product.brand}</span>
                      <h4 className="font-serif-luxury text-base font-bold text-white">{item.product.name}</h4>
                      <span className="text-xs font-mono font-bold text-amber-300">${item.product.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center space-x-2 border border-white/10 rounded-xl px-2 py-1 bg-zinc-950">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 text-sm font-bold text-zinc-400 hover:text-white"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold w-4 text-center text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 text-sm font-bold text-zinc-400 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-mono font-bold text-white w-20 text-right">${item.subtotal.toFixed(2)}</span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Column */}
            <div className="lg:col-span-4 bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-6">
              <h3 className="font-serif-luxury text-xl font-bold text-white">Order Summary</h3>

              <div className="space-y-2.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.item_count} items)</span>
                  <span className="font-mono font-medium text-white">${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Courier Shipping</span>
                  <span className="font-mono font-medium text-emerald-400">{cart.shipping === 0 ? 'COMPLIMENTARY' : `$${cart.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated State & Local Tax</span>
                  <span className="font-mono font-medium text-white">${cart.estimated_tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between text-base font-bold text-white items-baseline">
                  <span>Estimated Total</span>
                  <span className="font-serif-luxury text-2xl font-bold text-amber-300 font-mono">${cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Security Banner */}
              <div className="p-3.5 bg-zinc-950/80 rounded-2xl border border-white/10 text-[11px] text-zinc-400 space-y-1">
                <div className="flex items-center space-x-1.5 font-semibold text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Server-Validated Pricing</span>
                </div>
                <p>Prices are verified against verified backend database records before payment authorization.</p>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25 flex items-center justify-center space-x-2 active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
