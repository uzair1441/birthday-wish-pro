import React from 'react';
import { BirthdayWishData } from '../../types';
import { Check, Sparkles, Wand2 } from 'lucide-react';
import { CuteBabySticker } from '../CuteBabySticker';

interface StepInteractionsProps {
  data: BirthdayWishData;
  onChange: (updates: Partial<BirthdayWishData>) => void;
}

export const StepInteractions: React.FC<StepInteractionsProps> = ({ data, onChange }) => {
  const SURPRISE_ELEMENTS = [
    {
      id: 'enableCutCake' as const,
      title: 'Ceremonial Cake Cutting Knife',
      desc: 'An interactive golden knife that lets the recipient slice their cake with sound effects and serve fresh slices with confetti.',
      stickerId: 'chibi-cake',
      badge: 'Interactive Ceremony',
      active: data.enableCutCake ?? true
    },
    {
      id: 'enableUnwrapGift' as const,
      title: 'VIP Royal Mystery Gift Box',
      desc: 'An animated shimmering royal gold gift box that shakes and unboxes with magical chimes, revealing your personal message & photo keepsake.',
      stickerId: 'chibi-surprise',
      badge: 'Luxury Unboxing',
      active: data.enableUnwrapGift
    },
    {
      id: 'enablePopBalloons' as const,
      title: 'Poppable 3D Birthday Balloons',
      desc: 'Colorful balloons float across their screen that pop with authentic sound effects and confetti bursts when clicked or tapped.',
      stickerId: 'chibi-dance',
      badge: 'Touch Haptics',
      active: data.enablePopBalloons
    },
    {
      id: 'enableConfettiPopper' as const,
      title: 'Golden Party Poppers & Cannons',
      desc: 'Floating party popper buttons that shoot multi-colored confetti cannons across the screen whenever tapped.',
      stickerId: 'peach-goma-hug',
      badge: 'Party Atmosphere',
      active: data.enableConfettiPopper
    }
  ];

  return (
    <div id="step-interactions-container" className="space-y-6">
      <div className="border-b border-white/[0.08] pb-5 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Interactive Delight Suite</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif">
            Step 5: Interactive Surprise Mechanics
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Turn a static greeting into an unforgettable, touchable party experience with haptic-feel animations.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner">
            <CuteBabySticker id="chibi-celebrate" size={54} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SURPRISE_ELEMENTS.map((elem) => {
          return (
            <div
              key={elem.id}
              id={`interactive-card-${elem.id}`}
              onClick={() => onChange({ [elem.id]: !elem.active })}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99] ${
                elem.active
                  ? 'bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-amber-500/10 border-amber-400/80 ring-2 ring-amber-400/20 shadow-xl'
                  : 'bg-white/[0.02] border-white/[0.07] hover:border-white/20 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform p-1">
                  <CuteBabySticker id={elem.stickerId} size={42} animate={elem.active} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-sm font-bold truncate ${elem.active ? 'text-amber-200' : 'text-white'}`}>
                      {elem.title}
                    </h3>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition shrink-0 ${
                        elem.active ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 shadow-md' : 'border border-white/20 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                    </div>
                  </div>
                  <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] rounded-full bg-white/[0.06] text-amber-300 border border-white/[0.08] font-mono">
                    {elem.badge}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {elem.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Feature Status:</span>
                <span className={`font-semibold flex items-center gap-1.5 ${elem.active ? 'text-amber-300' : 'text-slate-500'}`}>
                  {elem.active ? (
                    <>
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      Activated & Ready
                    </>
                  ) : (
                    'Disabled'
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3.5 shadow-md">
        <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300">
          <Wand2 className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-300">
          All interactive surprise elements have spatial sound effects powered by synthetic Web Audio oscillators. They run smoothly at 60 FPS on iOS and Android devices without loading delay!
        </p>
      </div>
    </div>
  );
};

