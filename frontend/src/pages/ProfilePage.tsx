import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Sparkles, Check, Bookmark, Calendar, ShieldCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen text-white py-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="border-b border-white/10 pb-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Account & Atelier Profile</span>
          <h1 className="font-serif-luxury text-4xl sm:text-5xl font-bold tracking-tight text-white mt-1">User Profile</h1>
          <p className="text-xs text-zinc-400 mt-2">Personal style DNA, color harmonies, and autonomous memory preferences.</p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
              alt={user?.full_name}
              className="w-24 h-24 rounded-full object-cover border-2 border-violet-500 shadow-xl shadow-violet-500/20"
            />
            <div className="space-y-1">
              <h2 className="font-serif-luxury text-2xl font-bold text-white">{user?.full_name}</h2>
              <p className="text-xs text-zinc-400 font-mono">{user?.email}</p>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold mt-2">
                <ShieldCheck className="w-3 h-3" />
                <span>Supabase PostgreSQL &bull; Cloud Synchronized</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Style Aesthetics</h3>
            <div className="flex flex-wrap gap-2">
              {user?.style_preferences?.map((s) => (
                <span key={s} className="px-3.5 py-1.5 bg-zinc-800/80 rounded-xl text-xs font-medium text-white border border-white/10">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Favorite Color Palette</h3>
            <div className="flex flex-wrap gap-2">
              {user?.favorite_colors?.map((c) => (
                <span key={c} className="px-3.5 py-1.5 bg-zinc-800/80 rounded-xl text-xs font-medium text-white border border-white/10 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  <span>{c}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Fashion Goals</h3>
            <div className="flex flex-wrap gap-2">
              {user?.fashion_goals?.map((g) => (
                <span key={g} className="px-3.5 py-1.5 bg-violet-600/20 rounded-xl text-xs font-medium text-violet-300 border border-violet-500/30">
                  {g}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
