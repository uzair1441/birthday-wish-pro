import React from 'react';
import { Sparkles } from 'lucide-react';

interface CakeStagePedestalProps {
  children: React.ReactNode;
  isCakeCut?: boolean;
}

export const CakeStagePedestal: React.FC<CakeStagePedestalProps> = ({
  children,
  isCakeCut = false,
}) => {
  return (
    <div className="relative w-full max-w-lg mx-auto flex flex-col items-center select-none my-3">
      
      {/* 1. Dramatic Soft Stage Spotlight from Above */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-80 bg-gradient-to-b from-amber-300/20 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 2. Elevated Luxury Bakery Stage Card */}
      <div className="w-full rounded-3xl bg-slate-950/75 border border-amber-400/25 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col items-center">
        
        {/* Subtle Ambient Corner Glows */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

        {/* Elegant Stage Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[11px] font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Birthday Cake Ceremony</span>
          <span className="text-amber-400/50">•</span>
          <span className="text-rose-300 capitalize">{isCakeCut ? 'Served ✨' : 'Ready to Cut'}</span>
        </div>

        {/* 3. The Interactive Cake (Cleanly centered with ample padding) */}
        <div className="w-full flex flex-col items-center z-10">
          {children}
        </div>

        {/* Subtle Bottom Glow Rim */}
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent rounded-full mt-2" />
      </div>

    </div>
  );
};
