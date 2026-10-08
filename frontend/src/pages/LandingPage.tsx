import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Shirt, Wand2, Bot, Luggage, ShieldCheck, 
  ArrowRight, Check, Compass, Cpu, Layers, Star 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemoUser, isAuthenticated } = useAuth();

  const handleStartExperience = async () => {
    if (!isAuthenticated) {
      await loginDemoUser();
    }
    navigate('/home');
  };

  return (
    <div className="min-h-screen text-white">
      
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Luxury Fashion Intelligence</span>
              </div>

              <h1 className="font-serif-luxury text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08]">
                Your Wardrobe <br />
                <span className="italic font-normal bg-gradient-to-r from-violet-400 via-indigo-300 to-white bg-clip-text text-transparent">
                  Intelligently Elevated.
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-zinc-400 max-w-xl font-light leading-relaxed">
                Meet your autonomous AI fashion agent. Seamless digital wardrobe ingestion, neural try-on drapery, and calibrated multi-criteria outfit styling.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={handleStartExperience}
                  className="px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl shadow-violet-500/25 flex items-center justify-center space-x-2 group"
                >
                  <span>Launch Experience</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <Link
                  to="/try-on"
                  className="px-8 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-zinc-900 border border-white/10 hover:bg-zinc-800 transition-all flex items-center justify-center"
                >
                  Virtual Try-On Studio
                </Link>
              </div>

              {/* Status Hint */}
              <div className="pt-2 flex items-center space-x-2 text-xs text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Stateless neural inference engine online &bull; 4K real-time garment compositing</span>
              </div>
            </div>

            {/* Editorial Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800"
                    alt="Luxury Editorial Styling"
                    className="w-full h-[520px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Floating AI Score Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/80 backdrop-blur-xl shadow-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">Autonomous Neural Match</span>
                        <h4 className="font-serif-luxury text-base font-bold text-white">Oversized Cashmere & Silk Ivory</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-amber-300">9.6 / 10</span>
                      </div>
                    </div>
                    <div className="mt-2 text-[11px] text-zinc-400 italic">
                      "Calibrated for evening formal reception with ambient drape harmony."
                    </div>
                  </div>
                </div>

                {/* Decorative floating card */}
                <div className="hidden sm:block absolute -top-6 -left-6 bg-zinc-900/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10 max-w-[210px]">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <span>AI Stylist Bestie</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-1">
                    "This tailored silhouette elongates your frame effortlessly ✨"
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6 Key Pillars / Feature Matrix */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Autonomous Fashion Platform</span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white">
            Built with Engineering Rigor
          </h2>
          <p className="text-base text-zinc-400">
            A unified fashion-tech ecosystem engineered with machine learning vision, cloud microservices, and reactive agent planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-sm hover:border-violet-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">AI Outfit Recommendations</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Multi-criteria hybrid recommendation algorithm analyzing occasion formality, style taxonomy, color harmony, and weather suitability with mathematical explainability.
            </p>
            <Link to="/outfit-generator" className="pt-2 text-xs font-semibold text-violet-400 flex items-center space-x-1 group-hover:text-violet-300">
              <span>Try Outfit Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-sm hover:border-violet-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">Smart Digital Wardrobe</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Catalog your entire closet with categories, color profiles, seasons, and formality metrics. Pluggable clothing analysis architecture supporting automated tagging.
            </p>
            <Link to="/wardrobe" className="pt-2 text-xs font-semibold text-indigo-400 flex items-center space-x-1 group-hover:text-indigo-300">
              <span>View Wardrobe</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-sm hover:border-violet-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">AI Fashion Bestie</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Autonomous conversational stylist that reasons over wardrobe items, checks delivery dates across hubs, and recommends looks for global travel destinations.
            </p>
            <Link to="/chat" className="pt-2 text-xs font-semibold text-amber-300 flex items-center space-x-1 group-hover:text-amber-200">
              <span>Chat with Bestie</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-sm hover:border-violet-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">Virtual Try-On Studio</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Upload your photo and preview products on your silhouette with anatomical neck preservation, alpha clean-up, and ambient lighting curve harmonization.
            </p>
            <Link to="/try-on" className="pt-2 text-xs font-semibold text-emerald-400 flex items-center space-x-1 group-hover:text-emerald-300">
              <span>Try Virtual Try-On</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 5 */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-sm hover:border-violet-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
              <Luggage className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">Pack With AI</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Enter your destination, trip duration, and purpose. Generates weather-aware capsule wardrobes and packing checklists, prioritizing what you already own.
            </p>
            <Link to="/travel-assistant" className="pt-2 text-xs font-semibold text-sky-400 flex items-center space-x-1 group-hover:text-sky-300">
              <span>Pack With AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Feature 6 */}
          <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-sm hover:border-violet-500/40 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-white">Curated Luxury Boutique</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Discover contemporary and classic apparel with multi-seller delivery options, guaranteed express air dispatch, and secure checkout.
            </p>
            <Link to="/shop" className="pt-2 text-xs font-semibold text-rose-400 flex items-center space-x-1 group-hover:text-rose-300">
              <span>Explore Boutique</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-zinc-950/70 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Autonomous Workflow</span>
            <h2 className="font-serif-luxury text-4xl font-bold text-white">How StyleSense AI Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white font-serif-luxury text-lg font-bold flex items-center justify-center mx-auto shadow-lg shadow-violet-500/30">
                1
              </div>
              <h4 className="font-serif-luxury text-xl font-bold text-white">Upload Your Wardrobe</h4>
              <p className="text-sm text-zinc-400">
                Add photos of your shirts, blazers, trousers, and shoes. StyleSense categorizes colors, formality, and seasonality.
              </p>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-serif-luxury text-lg font-bold flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
                2
              </div>
              <h4 className="font-serif-luxury text-xl font-bold text-white">Specify Context & Event</h4>
              <p className="text-sm text-zinc-400">
                Tell your AI stylist whether you are headed to a corporate presentation, destination wedding, dinner, or European trip.
              </p>
            </div>

            <div className="bg-zinc-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white font-serif-luxury text-lg font-bold flex items-center justify-center mx-auto shadow-lg shadow-violet-500/30">
                3
              </div>
              <h4 className="font-serif-luxury text-xl font-bold text-white">Receive Scored Looks</h4>
              <p className="text-sm text-zinc-400">
                Get ranked outfit combinations with transparent compatibility scores, styling notes, and virtual try-on previews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-bold text-white">
            Ready to Transform Your Style?
          </h2>
          <p className="text-base text-zinc-400 max-w-xl mx-auto">
            Experience the future of wardrobe intelligence and autonomous AI styling today.
          </p>
          <button
            onClick={handleStartExperience}
            className="px-10 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-xl shadow-violet-500/30"
          >
            Launch StyleSense AI
          </button>
        </div>
      </section>

    </div>
  );
};
