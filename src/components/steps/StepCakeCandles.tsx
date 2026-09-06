import React from 'react';
import { motion } from 'motion/react';
import { BirthdayWishData } from '../../types';
import { CAKE_OPTIONS } from '../../data/presets';
import { InteractiveCake } from '../InteractiveCake';
import { Check, Sparkles } from 'lucide-react';
import { CuteBabySticker } from '../CuteBabySticker';
import { soundManager } from '../../utils/audio';

interface StepCakeCandlesProps {
  data: BirthdayWishData;
  onChange: (updates: Partial<BirthdayWishData>) => void;
}

export const StepCakeCandles: React.FC<StepCakeCandlesProps> = ({ data, onChange }) => {
  const handleSelectCake = (id: any) => {
    soundManager.playClick();
    onChange({ cakeStyle: id });
  };

  return (
    <div id="step-cake-container" className="space-y-6">
      
      {/* Step Header */}
      <div className="border-b border-white/[0.08] pb-5 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold mb-2">
            <span>🎂</span>
            <span>Artisan Bakery Selection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif">
            Step 2: Choose Birthday Cake
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Select an authentic gourmet bakery cake for the interactive golden-knife cutting ceremony.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner">
            <CuteBabySticker id="chibi-cake" size={54} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
        
        {/* Left Side: 5 Real Cake Selection Cards */}
        <div className="lg:col-span-7 space-y-3">
          <label className="text-xs font-semibold text-slate-300 block">
            Select From 5 Real Bakery Cake Designs:
          </label>

          <div className="space-y-3">
            {CAKE_OPTIONS.map((cake) => {
              const isSelected = data.cakeStyle === cake.id;
              return (
                <motion.button
                  key={cake.id}
                  id={`cake-opt-${cake.id}`}
                  type="button"
                  onClick={() => handleSelectCake(cake.id)}
                  whileHover={{ scale: 1.015, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-4 group overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-500/20 via-purple-500/15 to-amber-500/15 border-rose-400 ring-2 ring-rose-400/30 shadow-xl shadow-rose-500/15'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 text-slate-300 hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Real Cake Photo Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md group-hover:scale-105 transition-transform bg-slate-900">
                    <img 
                      src={cake.realCakeImageUrl} 
                      alt={cake.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-amber-200' : 'text-white'}`}>
                        {cake.name}
                      </p>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 flex items-center justify-center shrink-0 shadow animate-pop-in">
                          <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{cake.flavorNotes}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Clean Live Preview of Real Cake (With proper spacing and box fitting) */}
        <div className="lg:col-span-5 flex flex-col items-center w-full">
          <div className="w-full p-5 sm:p-6 rounded-3xl bg-[#0d0a1b]/95 border border-white/[0.12] shadow-2xl flex flex-col items-center">
            <span className="text-[11px] font-bold text-amber-300/90 uppercase tracking-widest mb-3 font-mono bg-amber-400/10 px-3.5 py-1 rounded-full border border-amber-400/25">
              Live Cake Showcase
            </span>
            <InteractiveCake
              cakeStyleId={data.cakeStyle}
              interactive={false}
            />
          </div>
        </div>

      </div>

    </div>
  );
};
