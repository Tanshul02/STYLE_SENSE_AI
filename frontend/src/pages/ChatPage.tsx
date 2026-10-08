import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, Send, Sparkles, Shirt, ShoppingBag, ArrowRight, 
  RefreshCw, CheckCircle2, User, ChevronRight, Wand2 
} from 'lucide-react';
import { api } from '../services/api';
import { AgentChatResponse, AgentMemory } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  traces?: any[];
  score?: number;
  products?: any[];
}

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [shownProductIds, setShownProductIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user?.full_name ? user.full_name.split(' ')[0] : 'there'}! I am Bestie, your premier AI fashion concierge. I have real-time access to your digital wardrobe, our haute luxury catalog, and 0–10 aesthetic compatibility scoring. Tell me where you are going or what silhouette you'd love to explore!`
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTrace, setActiveTrace] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTIONS = [
    'What should I wear for a client presentation tomorrow?',
    'Style a traditional ethnic look for an upcoming celebration',
    'Evaluate my wardrobe balance and recommend new luxury pieces',
    'Give me a rainy day outfit with 0–10 style scoring'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setActiveTrace('Planning subgoals & invoking WardrobeTool...');

    try {
      const res = await api.agentChat(text, shownProductIds);
      const suggestedProds = res.catalog_products_suggested || [];
      if (suggestedProds.length > 0) {
        const newIds = suggestedProds.map((p: any) => p.id);
        setShownProductIds(prev => Array.from(new Set([...prev, ...newIds])));
      }
      const assistantMsg: MessageItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply,
        traces: res.traces,
        score: res.final_score,
        products: suggestedProds
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I encountered a moment of reflection while planning. Let me assist you with another styling request!'
        }
      ]);
    } finally {
      setLoading(false);
      setActiveTrace(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-5rem)] flex flex-col text-white">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif-luxury text-xl font-bold text-white">StyleSense Agent</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                AUTONOMOUS
              </span>
            </div>
            <p className="text-xs text-zinc-400">Tool-calling &bull; Memory feedback &bull; 0–10 Scoring</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/agent-insights"
            className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-violet-500/50 transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Agent Insights</span>
          </Link>
          <Link
            to="/ai-fit-studio"
            className="text-xs px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all flex items-center space-x-1 shadow-md shadow-violet-500/20"
          >
            <span>Open Fit Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-6 pr-2">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-5 shadow-sm space-y-3 ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-zinc-900/60 backdrop-blur-2xl border border-white/10 text-white'
              }`}
            >
              <div className="flex items-center justify-between text-xs opacity-75">
                <span className="font-bold tracking-wide uppercase text-[10px]">
                  {m.role === 'user' ? 'You' : 'StyleSense Personal Stylist'}
                </span>
                {m.score && (
                  <span className="font-mono text-amber-300 font-bold text-xs bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg">
                    Score: {m.score.toFixed(1)} / 10
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

              {m.traces && m.traces.length > 0 && (
                <div className="pt-2 border-t border-white/10 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">
                    Tools Executed in Plan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.traces.map((t, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-lg bg-zinc-950 border border-white/10 text-zinc-300"
                      >
                        {t.tool_name} ({t.duration_ms}ms)
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Recommended Catalog Product Cards */}
              {m.products && m.products.length > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5 uppercase tracking-wider font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      Curated Atelier Pieces:
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      In Stock &bull; Fast Transit
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {m.products.map((p: any) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl bg-zinc-950/80 border border-white/10 hover:border-violet-500/50 transition-all flex flex-col justify-between group text-left shadow"
                      >
                        <div>
                          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-zinc-900 border border-white/5 mb-2">
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {p.price && (
                              <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-amber-300 border border-white/10">
                                ${p.price}
                              </div>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
                            {p.name}
                          </p>
                          {p.brand && (
                            <p className="text-[10px] text-zinc-400 font-mono">
                              {p.brand}
                            </p>
                          )}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-1.5">
                          <button
                            onClick={() => navigate('/tryon', { state: { productId: p.id } })}
                            className="flex-1 py-1 px-2 rounded-lg bg-violet-600/30 hover:bg-violet-600 text-violet-300 hover:text-white text-[10px] font-bold font-mono transition text-center"
                          >
                            Try On
                          </button>
                          <Link
                            to={`/product/${p.id}`}
                            className="py-1 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium transition text-center"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="p-1 rounded-lg bg-white/10 hover:bg-white text-zinc-300 hover:text-zinc-950 transition"
                            title="Add to Shopping Bag"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 text-xs text-zinc-400 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
              <span>{activeTrace || 'Synthesizing recommendations...'}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="text-xs px-3.5 py-1.5 bg-zinc-900/80 border border-white/10 hover:border-violet-500 hover:text-white rounded-full text-zinc-400 whitespace-nowrap transition-all"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="pt-2">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-sm focus-within:border-violet-500 transition-all"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your autonomous fashion agent anything..."
            className="flex-1 text-sm px-3 py-2 bg-transparent focus:outline-none text-white placeholder-zinc-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl transition-all disabled:opacity-40 shadow-md shadow-violet-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
