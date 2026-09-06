import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Crown } from 'lucide-react';

interface BirthdayWishHeaderProps {
  className?: string;
  subtitle?: string;
}

export const BirthdayWishHeader: React.FC<BirthdayWishHeaderProps> = ({ 
  className = '' 
}) => {
  return (
    <div className={`relative flex flex-col items-center justify-center py-2 select-none ${className}`}>
      
      {/* Ambient Pulsing Aura behind text */}
      <div className="absolute w-52 h-24 bg-gradient-to-r from-amber-500/25 via-rose-500/20 to-purple-500/20 blur-2xl rounded-full pointer-events-none -z-10 animate-pulse" />

      {/* Floating Ornate Birthday Wish Typography Emblem */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex flex-col items-center"
      >
        {/* Crown & Sparkles Top Accent */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <motion.span 
            animate={{ rotate: [-8, 8, -8], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          >
            <Sparkles className="w-4 h-4" />
          </motion.span>

          <div className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/25 to-amber-500/20 border border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.3)] flex items-center gap-1.5 backdrop-blur-sm">
            <Crown className="w-3.5 h-3.5 text-amber-300 drop-shadow" />
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-amber-200 font-sans">
              Royal Celebration
            </span>
          </div>

          <motion.span 
            animate={{ rotate: [8, -8, 8], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          >
            <Sparkles className="w-4 h-4" />
          </motion.span>
        </div>

        {/* Main Luxurious Script Heading: Happy Birthday */}
        <div className="relative">
          <h2 
            className="text-4xl sm:text-5xl font-['Great_Vibes'] tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-100 drop-shadow-[0_4px_16px_rgba(251,191,36,0.45)] leading-tight px-4"
            style={{ textShadow: '0 2px 20px rgba(251, 191, 36, 0.4)' }}
          >
            Happy Birthday
          </h2>

          {/* Golden Underline Flourish Ornament */}
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-amber-400 to-amber-200 opacity-80" />
            <div className="w-2 h-2 rotate-45 border border-amber-300 bg-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <span className="text-xs text-amber-300 font-serif italic tracking-widest">
              Wishes & Blessings
            </span>
            <div className="w-2 h-2 rotate-45 border border-amber-300 bg-amber-400/60 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            <div className="h-px w-12 sm:w-16 bg-gradient-to-l from-transparent via-amber-400 to-amber-200 opacity-80" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
