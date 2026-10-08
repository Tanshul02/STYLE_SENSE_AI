import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Sparkles, ShoppingBag, ArrowRight, 
  RefreshCw, Star, Layers, Zap, ChevronDown, ChevronUp, Eye, Check
} from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { processBestieQuery } from './flow';
import { Product } from '../types';
import { api } from '../lib/api';

interface ChatBubble {
  id: string;
  sender: 'user' | 'bestie';
  text: string;
  score?: number;
  traces?: any[];
  plan?: string[];
  intent?: string;
  products?: Product[];
}

export const BestieChat: React.FC = () => {
  const { isBestieOpen, closeBestie } = useUI();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: 'welcome',
      sender: 'bestie',
      text: "Bonjour darling! I'm Bestie AI, your autonomous personal fashion director. Whether you're curating a gala look, solving color harmony dilemmas, or pairing tailored silhouettes, I'm here to elevate your wardrobe.",
      score: 9.8
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>(null);
  const [addedItemNotification, setAddedItemNotification] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isBestieOpen) return null;

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || loading) return;

    const userBubble: ChatBubble = {
      id: Date.now().toString(),
      sender: 'user',
      text
    };
    setMessages(prev => [...prev, userBubble]);
    setInput('');
    setLoading(true);

    try {
      const alreadyShownIds = messages
        .flatMap(m => m.products ? m.products.map(p => p.id) : [])
        .filter(Boolean);

      const result = await processBestieQuery(text, alreadyShownIds);

      const bestieBubble: ChatBubble = {
        id: (Date.now() + 1).toString(),
        sender: 'bestie',
        text: result.text,
        score: result.score,
        traces: result.traces,
        plan: result.plan,
        intent: result.intent,
        products: result.products && result.products.length > 0 ? result.products : undefined
      };
      setMessages(prev => [...prev, bestieBubble]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bestie',
          text: "I analyzed your aesthetic vision. Pairing an oversized wool blazer with monochrome silk trousers will create effortless quiet luxury. How does that sound?"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (product: Product) => {
    await addToCart(product);
    setAddedItemNotification(product.name);
    setTimeout(() => setAddedItemNotification(null), 3000);
  };

  const handleTryOnProduct = (product: Product) => {
    closeBestie();
    navigate('/try-on', { state: { productId: product.id } });
  };

  const PROMPT_SUGGESTIONS = [
    "What should I wear to an evening gala in Paris?",
    "Curate a breathable resort capsule for Goa",
    "How can I get 24h express air delivery for an outfit?",
    "Pair an oversized blazer with high-waisted trousers",
    "Show me monochromatic luxury outfits under $500"
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end pointer-events-auto">
      {/* Dark Ambient Backdrop */}
      <div 
        onClick={closeBestie}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
      />

      {/* Slide-over Drawer Panel */}
      <aside className="relative w-full max-w-md bg-zinc-950/90 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col h-full z-10 text-white">
        
        {/* Header Bar */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-zinc-950 rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif-luxury text-lg font-bold tracking-tight">Bestie AI</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                  Autonomous Agent
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Personal Luxury Fashion Stylist</p>
            </div>
          </div>

          <button
            onClick={closeBestie}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Quick Added Toast */}
        {addedItemNotification && (
          <div className="absolute top-20 inset-x-4 z-20 bg-zinc-900 border border-violet-500 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="truncate">Added to Shopping Bag: {addedItemNotification}</span>
            </div>
            <button 
              onClick={() => { closeBestie(); navigate('/cart'); }}
              className="text-violet-400 font-bold hover:underline shrink-0 text-[11px]"
            >
              View Bag &rarr;
            </button>
          </div>
        )}

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((bubble) => (
            <div 
              key={bubble.id}
              className={`flex flex-col ${bubble.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Bubble Body */}
              <div 
                className={`max-w-[88%] rounded-2xl p-4 text-xs leading-relaxed ${
                  bubble.sender === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-br-xs shadow-md shadow-violet-500/20'
                    : 'bg-zinc-900/80 border border-white/10 text-zinc-200 rounded-bl-xs shadow-lg'
                }`}
              >
                <p className="whitespace-pre-line">{bubble.text}</p>

                {/* Score badge */}
                {bubble.score && (
                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-300 font-mono">
                    <span className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>Atelier Style Score</span>
                    </span>
                    <span className="font-bold">{bubble.score}/10</span>
                  </div>
                )}
              </div>

              {/* Agent Reasoning Trace Badge */}
              {bubble.traces && bubble.traces.length > 0 && (
                <div className="mt-2 w-[88%]">
                  <button
                    onClick={() => setExpandedTraceId(expandedTraceId === bubble.id ? null : bubble.id)}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-violet-500/30 text-[10px] text-violet-300 hover:bg-violet-950/40 transition-colors"
                  >
                    <Zap className="w-3 h-3 text-amber-300" />
                    <span className="font-mono">Agent Reasoning Trace ({bubble.traces.length} steps)</span>
                    {expandedTraceId === bubble.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {/* Expanded Trace Breakdown */}
                  {expandedTraceId === bubble.id && (
                    <div className="mt-2 p-3 bg-zinc-950/90 border border-white/10 rounded-xl space-y-2 text-[10px] font-mono text-zinc-400 animate-in fade-in">
                      <div className="text-violet-400 font-semibold">Intent: {bubble.intent || 'Fashion Consultation'}</div>
                      {bubble.traces.map((t, idx) => (
                        <div key={idx} className="pb-1.5 border-b border-white/5 last:border-0 last:pb-0">
                          <div className="text-zinc-200 flex items-center justify-between">
                            <span>[{t.step_num}] {t.tool_name}</span>
                            <span className="text-zinc-500">{t.duration_ms}ms</span>
                          </div>
                          <div className="text-zinc-500 text-[9px] mt-0.5">{t.output_summary}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Frosted Glass Product Cards in Feed */}
              {bubble.products && bubble.products.length > 0 && (
                <div className="mt-3 w-[88%] space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                    Recommended Luxury Pieces:
                  </p>
                  <div className="grid grid-cols-1 gap-2.5">
                    {bubble.products.map((p) => (
                      <div 
                        key={p.id}
                        className="bg-zinc-900/90 border border-white/10 rounded-2xl p-2.5 flex items-center space-x-3 hover:border-violet-500/40 transition-all shadow-md group"
                      >
                        <img 
                          src={p.image_url} 
                          alt={p.name} 
                          className="w-14 h-14 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white truncate">{p.name}</p>
                          <p className="text-[11px] font-mono text-amber-300 font-bold mt-0.5">${p.price}</p>
                          <div className="flex items-center space-x-2 mt-1.5">
                            <button
                              onClick={() => handleQuickAdd(p)}
                              className="px-2.5 py-1 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-[10px] transition-colors flex items-center space-x-1"
                            >
                              <ShoppingBag className="w-2.5 h-2.5" />
                              <span>Add to Bag</span>
                            </button>
                            <button
                              onClick={() => handleTryOnProduct(p)}
                              className="px-2 py-1 rounded-lg bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 border border-violet-500/30 font-medium text-[10px] transition-colors flex items-center space-x-1"
                            >
                              <Eye className="w-2.5 h-2.5" />
                              <span>Try On</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center space-x-2 p-3 bg-zinc-900/60 border border-white/10 rounded-2xl text-xs text-zinc-400 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-400" />
              <span>Bestie is deliberating & scoring ensemble...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Suggested Conversation Prompt Pills */}
        <div className="px-4 py-2 border-t border-white/5 overflow-x-auto flex space-x-1.5 no-scrollbar bg-zinc-950/60">
          {PROMPT_SUGGESTIONS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="text-[11px] px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-violet-500/40 hover:bg-zinc-800 whitespace-nowrap transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-zinc-900/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center space-x-2"
          >
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Bestie about outfits, dress codes, or styling..." 
              className="flex-1 bg-zinc-950 border border-white/15 focus:border-violet-500 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white disabled:opacity-40 transition-all shadow-md shadow-violet-500/25"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};
