import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Shirt, Compass, Bot, Luggage, Wand2, ShoppingBag, 
  Activity, Menu, X, LogOut, Bookmark, Scale, Cpu, CheckSquare, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { toggleBestie } = useUI();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Shop Boutique', path: '/shop', icon: ShoppingBag },
    { name: 'Try-On Studio', path: '/try-on', icon: Sparkles },
    { name: 'Wardrobe', path: '/wardrobe', icon: Shirt },
    { name: 'Fit Studio', path: '/ai-fit-studio', icon: Layers },
    { name: 'Style Advice', path: '/should-i-wear-this', icon: CheckSquare },
    { name: 'Compare', path: '/compare-looks', icon: Scale },
    { name: 'Capsule Pack', path: '/travel-assistant', icon: Luggage },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-3 inset-x-0 z-50 flex flex-col items-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-zinc-950/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] px-5 py-2.5 flex items-center justify-between max-w-6xl w-full transition-all">
        
        {/* Brand Monogram & Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white flex items-center justify-center font-serif-luxury text-base font-bold shadow-md shadow-violet-500/25 transition-transform group-hover:scale-105">
            S
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-serif-luxury text-xl font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors">
              StyleSense
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400 px-1.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
              AI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-xs font-medium tracking-wide transition-all rounded-full ${
                  active
                    ? 'text-white bg-white/10 shadow-sm border border-white/10 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Ask Bestie Glow Button */}
          <button
            onClick={toggleBestie}
            title="Open Autonomous AI Fashion Stylist Bestie"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-violet-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span className="hidden sm:inline">Ask Bestie</span>
          </button>

          {/* Cart Icon Glass Pill */}
          <Link
            to="/cart"
            className="relative p-2 text-zinc-300 hover:text-white transition-colors rounded-full hover:bg-white/10"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-violet-600 rounded-full border border-zinc-900 shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Profile & Auth */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-1.5 pl-1.5 border-l border-white/10">
              <Link to="/profile" className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition">
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user.full_name}
                  className="w-7 h-7 rounded-full object-cover border border-white/20"
                />
              </Link>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                title="Sign Out"
                className="p-1 text-zinc-400 hover:text-rose-400 rounded-full hover:bg-white/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1 pl-1">
              <Link
                to="/login"
                className="px-2.5 py-1 text-xs font-medium text-zinc-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition"
              >
                Join
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-zinc-300 hover:text-white rounded-full hover:bg-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto lg:hidden bg-zinc-950/95 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 mt-2 max-w-md w-full shadow-2xl space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  active ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 text-violet-400" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
