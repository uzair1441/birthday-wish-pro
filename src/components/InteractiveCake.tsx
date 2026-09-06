import React, { useState } from 'react';
import { CAKE_OPTIONS } from '../data/presets';
import { CakeStyleId } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface InteractiveCakeProps {
  cakeStyleId: CakeStyleId;
  interactive?: boolean;
  onCutCake?: () => void;
  isCakeCut?: boolean;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({
  cakeStyleId,
  interactive = true,
  onCutCake,
  isCakeCut: externalCakeCut
}) => {
  const [internalCakeCut, setInternalCakeCut] = useState<boolean>(false);
  const [isSlicing, setIsSlicing] = useState<boolean>(false);

  const isCakeCut = externalCakeCut !== undefined ? externalCakeCut : internalCakeCut;
  const cake = CAKE_OPTIONS.find(c => c.id === cakeStyleId) || CAKE_OPTIONS[0];

  const handleCutCake = () => {
    if (isCakeCut || isSlicing) return;
    setIsSlicing(true);
    soundManager.playCakeCut();

    setTimeout(() => {
      setIsSlicing(false);
      setInternalCakeCut(true);
      if (onCutCake) onCutCake();

      soundManager.playCelebrationFanfare();
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#F43F5E', '#FBBF24', '#38BDF8', '#A855F7', '#10B981']
      });
    }, 600);
  };

  return (
    <div id="interactive-cake-container" className="w-full flex flex-col items-center select-none py-2">
      
      {/* Real Cake Photo Card - Sized 1:1 square for crisp native 1024x1024 resolution without distortion */}
      <div className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 group bg-[#090714] transform-gpu">
        <img 
          src={cake.realCakeImageUrl} 
          alt={cake.name}
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover select-none"
          style={{
            imageRendering: '-webkit-optimize-contrast',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        />

        {/* Subtle Vignette for clean contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

        {/* Cut effect overlay */}
        {isCakeCut && (
          <div className="absolute inset-0 bg-black/15 pointer-events-none" />
        )}

        {/* Knife Slicing Animation */}
        {isSlicing && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <div className="animate-bounce transform rotate-45">
              <span className="text-7xl drop-shadow-2xl">🔪</span>
            </div>
          </div>
        )}

        {/* Slice Served Badge if cut */}
        {isCakeCut && (
          <div className="absolute top-3 right-3 z-20 bg-rose-500 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-xl animate-bounce">
            <span>🍰</span>
            <span>Slice Served!</span>
          </div>
        )}
      </div>

      {/* Clean Cake Name & Cutting Button */}
      <div className="mt-4 text-center space-y-3 w-full">
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide drop-shadow">
          {cake.name}
        </h3>

        {/* Interactive Cut Cake Button */}
        {interactive && (
          <div className="pt-1">
            {!isCakeCut ? (
              <button
                id="btn-cut-cake"
                type="button"
                onClick={handleCutCake}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500 hover:from-rose-400 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-rose-500/25 transition transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2.5 mx-auto"
              >
                <span>🔪</span>
                <span>Cut The Birthday Cake</span>
              </button>
            ) : (
              <div className="py-2 px-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 max-w-xs mx-auto animate-pop-in">
                <span>✨ Birthday Cake Cut & Served! 🍰</span>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
