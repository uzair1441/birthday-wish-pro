import React from 'react';
import { motion } from 'motion/react';
import { Check, Crown, Cake, Music, Heart, Sparkles, Send, Gift } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  maxReachedStep: number;
}

const STEPS = [
  { step: 1, label: 'Birthday Star', shortLabel: 'Star 👑', icon: Crown, desc: 'Name & Milestone' },
  { step: 2, label: 'Birthday Cake', shortLabel: 'Cake 🎂', icon: Cake, desc: 'Bakery Cake & Candles' },
  { step: 3, label: 'Party Music', shortLabel: 'Music 🎵', icon: Music, desc: 'Celebration Soundtracks' },
  { step: 4, label: 'Birthday Card', shortLabel: 'Card 💌', icon: Heart, desc: 'Love Letter & Photos' },
  { step: 5, label: 'Party Magic', shortLabel: 'Magic 🎁', icon: Sparkles, desc: 'Balloons & Surprises' },
  { step: 6, label: 'Send Wish', shortLabel: 'Send 🚀', icon: Send, desc: 'WhatsApp & Share Link' }
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  maxReachedStep
}) => {
  const currentStepData = STEPS.find(s => s.step === currentStep) || STEPS[0];
  const progressPercent = Math.round(((currentStep - 1) / (STEPS.length - 1)) * 100);

  return (
    <div id="step-indicator" className="w-full space-y-3.5">
      
      {/* Top Mobile/App Status Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="font-serif font-bold text-white text-sm">
            Step {currentStep}: {currentStepData.label}
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline font-sans">
            ({currentStepData.desc})
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-amber-300 font-semibold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
          <span>{progressPercent}% COMPLETE</span>
        </div>
      </div>

      {/* Segmented Dock - iOS / React Native Floating Style */}
      <div className="p-1.5 sm:p-2 rounded-2xl bg-[#0e0c1a]/90 border border-white/[0.1] backdrop-blur-2xl shadow-xl flex items-center justify-between gap-1 sm:gap-2 relative">
        {STEPS.map((s) => {
          const isCurrent = currentStep === s.step;
          const isPassed = currentStep > s.step;
          const isClickable = s.step <= maxReachedStep + 1;
          const Icon = s.icon;

          return (
            <motion.button
              key={s.step}
              id={`step-nav-btn-${s.step}`}
              type="button"
              disabled={!isClickable}
              onClick={() => onSelectStep(s.step)}
              whileHover={isClickable ? { scale: 1.04 } : {}}
              whileTap={isClickable ? { scale: 0.96 } : {}}
              className={`flex-1 relative py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-xl transition-colors duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer group disabled:cursor-not-allowed ${
                isClickable ? '' : 'opacity-40'
              }`}
            >
              {/* Active sliding background indicator with framer-motion */}
              {isCurrent && (
                <motion.div
                  layoutId="activeDockPill"
                  className="absolute inset-0 bg-gradient-to-b from-amber-400/25 via-rose-500/25 to-purple-600/20 border border-amber-400/40 rounded-xl shadow-lg shadow-rose-500/15 -z-0"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon container */}
              <div className="relative z-10">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-amber-400 to-rose-400 text-slate-950 shadow-md scale-105'
                      : isPassed
                      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                      : 'bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </div>

                {/* Passed check indicator */}
                {isPassed && (
                  <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[4]" />
                  </div>
                )}
              </div>

              {/* Step label */}
              <span
                className={`text-[10px] sm:text-[11px] font-medium tracking-tight truncate max-w-full relative z-10 ${
                  isCurrent ? 'text-amber-200 font-bold' : isPassed ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {s.shortLabel}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Micro Glowing Progress Fill */}
      <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-purple-500 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.6)]"
          style={{ width: `${Math.max(5, progressPercent)}%` }}
        />
      </div>

    </div>
  );
};



