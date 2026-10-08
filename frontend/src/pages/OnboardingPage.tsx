import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserPreferences } = useAuth();

  const [step, setStep] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Casual', 'Elegant']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Black', 'Ivory', 'Navy']);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(['College', 'Daily Wear']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Improve style', 'Save outfit combinations']);
  const [saving, setSaving] = useState(false);

  const styleOptions = ['Casual', 'Streetwear', 'Formal', 'Minimalist', 'Traditional', 'Sporty', 'Elegant'];
  const colorOptions = ['Black', 'White', 'Ivory', 'Navy', 'Emerald', 'Beige', 'Charcoal', 'Muted Coral', 'Burgundy'];
  const occasionOptions = ['College', 'Office', 'Parties', 'Weddings', 'Travel', 'Daily Wear'];
  const goalOptions = ['Improve style', 'Save outfit combinations', 'Pack smarter', 'Discover products'];

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      await updateUserPreferences({
        style_preferences: selectedStyles,
        favorite_colors: selectedColors,
        fashion_goals: selectedGoals
      });
      navigate('/home');
    } catch (err) {
      navigate('/home');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-white">
      <div className="max-w-2xl w-full bg-zinc-900/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl space-y-8">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <span>Step {step} of 4</span>
            <span className="text-violet-400 font-bold">Fashion Profiler</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Styles */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Step 1 — Aesthetic</span>
              <h2 className="font-serif-luxury text-3xl font-bold text-white">What aesthetics define your wardrobe?</h2>
              <p className="text-sm text-zinc-400">Select all that match your everyday or aspirational looks.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {styleOptions.map((style) => {
                const active = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    onClick={() => toggleItem(selectedStyles, setSelectedStyles, style)}
                    className={`p-4 rounded-xl text-left border text-sm font-medium transition-all ${
                      active
                        ? 'bg-violet-600/20 text-white border-violet-500 shadow-md ring-1 ring-violet-500/30'
                        : 'bg-zinc-950/80 text-zinc-300 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{style}</span>
                      {active && <Check className="w-4 h-4 text-violet-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Colors */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Step 2 — Color Palette</span>
              <h2 className="font-serif-luxury text-3xl font-bold text-white">Which colors do you gravitate towards?</h2>
              <p className="text-sm text-zinc-400">Your recommendations will incorporate harmonious combinations of these hues.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colorOptions.map((color) => {
                const active = selectedColors.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => toggleItem(selectedColors, setSelectedColors, color)}
                    className={`p-4 rounded-xl text-left border text-sm font-medium transition-all ${
                      active
                        ? 'bg-violet-600/20 text-white border-violet-500 shadow-md ring-1 ring-violet-500/30'
                        : 'bg-zinc-950/80 text-zinc-300 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{color}</span>
                      {active && <Check className="w-4 h-4 text-violet-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Occasions */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Step 3 — Occasions</span>
              <h2 className="font-serif-luxury text-3xl font-bold text-white">Where do you spend most of your time?</h2>
              <p className="text-sm text-zinc-400">We will tailor capsule combinations calibrated for these contexts.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {occasionOptions.map((occ) => {
                const active = selectedOccasions.includes(occ);
                return (
                  <button
                    key={occ}
                    onClick={() => toggleItem(selectedOccasions, setSelectedOccasions, occ)}
                    className={`p-4 rounded-xl text-left border text-sm font-medium transition-all ${
                      active
                        ? 'bg-violet-600/20 text-white border-violet-500 shadow-md ring-1 ring-violet-500/30'
                        : 'bg-zinc-950/80 text-zinc-300 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{occ}</span>
                      {active && <Check className="w-4 h-4 text-violet-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Fashion Goals */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">Step 4 — Objectives</span>
              <h2 className="font-serif-luxury text-3xl font-bold text-white">What are your primary fashion goals?</h2>
              <p className="text-sm text-zinc-400">Help StyleSense AI customize your home recommendations and conversational assistant.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goalOptions.map((goal) => {
                const active = selectedGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleItem(selectedGoals, setSelectedGoals, goal)}
                    className={`p-4 rounded-xl text-left border text-sm font-medium transition-all ${
                      active
                        ? 'bg-violet-600/20 text-white border-violet-500 shadow-md ring-1 ring-violet-500/30'
                        : 'bg-zinc-950/80 text-zinc-300 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{goal}</span>
                      {active && <Check className="w-4 h-4 text-violet-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-white/10 flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-zinc-300 bg-zinc-950 border border-white/10 hover:bg-zinc-800 transition flex items-center space-x-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition flex items-center space-x-2 shadow-lg shadow-violet-500/20"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="px-8 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition flex items-center space-x-2 shadow-lg shadow-violet-500/25"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{saving ? 'Curating Profile...' : 'Complete Profile'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
