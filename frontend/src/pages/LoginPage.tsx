import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginDemoUser } = useAuth();
  
  const [email, setEmail] = useState('demo@stylesense.ai');
  const [password, setPassword] = useState('StyleSense2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await loginDemoUser();
      navigate('/home');
    } catch (err: any) {
      setError('Could not connect to demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-8 text-white">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-serif-luxury text-2xl font-bold mx-auto shadow-lg shadow-violet-500/20">
            S
          </div>
          <h2 className="font-serif-luxury text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-xs text-zinc-400">Sign in to your autonomous personal AI wardrobe & stylist</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-2 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-500/25 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Login Button */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-3 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-950 border border-white/10 hover:border-violet-500/50 hover:bg-zinc-900 transition flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Instant Demo Session Login</span>
          </button>
          <div className="text-center text-xs text-zinc-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-violet-400 font-semibold hover:underline">
              Join StyleSense AI
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
