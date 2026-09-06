import React from 'react';
import { motion } from 'motion/react';
import { BirthdayWishData, GiftBoxStyleId, SurpriseGiftId } from '../../types';
import { GIFT_BOX_OPTIONS, SURPRISE_GIFT_OPTIONS } from '../../data/giftPresets';
import { Gift, Sparkles, Check, Heart, Trophy, Ticket, PartyPopper } from 'lucide-react';
import { CuteBabySticker } from '../CuteBabySticker';
import { soundManager } from '../../utils/audio';

interface StepInteractionsProps {
  data: BirthdayWishData;
  onChange: (updates: Partial<BirthdayWishData>) => void;
}

export const StepInteractions: React.FC<StepInteractionsProps> = ({ data, onChange }) => {
  const currentBoxStyle = data.giftBoxStyle || 'royal-crimson';
  const currentSurpriseGift = data.surpriseGift || 'chocolates-roses';

  const handleSelectBox = (boxId: GiftBoxStyleId) => {
    soundManager.playClick();
    onChange({ giftBoxStyle: boxId });
  };

  const handleSelectGift = (giftId: SurpriseGiftId) => {
    soundManager.playClick();
    onChange({ surpriseGift: giftId });
  };

  return (
    <div id="step-interactions-container" className="space-y-7">
      
      {/* Step Header */}
      <div className="border-b border-white/[0.08] pb-5 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-2">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>VIP Birthday Present</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif">
            Step 5: Pick a Surprise Birthday Gift
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose a luxury gift box and the special present hidden inside that pops open when the recipient unwraps it!
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner">
            <CuteBabySticker id="chibi-celebrate" size={54} />
          </div>
        </div>
      </div>

      {/* SECTION 1: Choose Luxury Gift Box Style */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span>1. Choose Luxury Gift Box Style</span>
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {GIFT_BOX_OPTIONS.map((box) => {
            const isSelected = currentBoxStyle === box.id;
            return (
              <motion.div
                key={box.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectBox(box.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/[0.08] border-amber-400 shadow-lg shadow-amber-500/10 ring-2 ring-amber-400/30'
                    : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                {/* Visual miniature box representation */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${box.boxColor} border ${box.borderColor} shadow flex items-center justify-center text-xl shrink-0 relative overflow-hidden`}>
                    <div className={`absolute inset-y-0 w-2.5 ${box.ribbonColor}`} />
                    <div className={`absolute inset-x-0 h-2.5 ${box.ribbonColor}`} />
                    <span className="relative z-10">{box.emoji}</span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {box.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 block line-clamp-1">
                      {box.themeDesc}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-2.5 flex items-center justify-end gap-1 text-[11px] text-amber-300 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Selected Box</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Choose The Surprise Present Inside */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>2. Choose What's Hidden Inside the Box</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {SURPRISE_GIFT_OPTIONS.map((gift) => {
            const isSelected = currentSurpriseGift === gift.id;
            return (
              <motion.div
                key={gift.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectGift(gift.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-transparent border-amber-400 shadow-xl shadow-amber-500/15 ring-2 ring-amber-400/30'
                    : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0">
                    {gift.emoji}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {gift.name}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-amber-300 font-medium shrink-0">
                        {gift.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-200/90 mt-0.5 font-medium">
                      {gift.tagline}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {gift.description}
                    </p>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2 border-t border-amber-400/20 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 italic">Recipient unboxes this with fanfare & sparkles!</span>
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Selected Present
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Sender's Gift Tag / Note */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>3. Gift Tag Note (Stamped on the Present)</span>
        </label>
        <input
          id="input-gift-note"
          type="text"
          placeholder="e.g. A sweet little surprise for the sweetest person in the universe! 💖"
          value={data.giftNote || ''}
          onChange={(e) => onChange({ giftNote: e.target.value })}
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-amber-400/20 text-sm transition"
        />
        <p className="text-[11px] text-slate-500">
          This short personal note will appear directly under the gift when unboxed.
        </p>
      </div>

      {/* SECTION 4: Interactive Party Sparks Toggle */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PartyPopper className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white">Party Atmosphere Effects</h4>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
            Active By Default
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Cake Knife */}
          <div 
            onClick={() => onChange({ enableCutCake: !(data.enableCutCake ?? true) })}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] cursor-pointer flex items-center justify-between text-xs transition"
          >
            <span className="text-slate-300 text-[11px]">🎂 Cake Cutting Knife</span>
            <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
              (data.enableCutCake ?? true) ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-white/20'
            }`}>
              {(data.enableCutCake ?? true) && <Check className="w-3 h-3" />}
            </div>
          </div>

          {/* Balloons */}
          <div 
            onClick={() => onChange({ enablePopBalloons: !data.enablePopBalloons })}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] cursor-pointer flex items-center justify-between text-xs transition"
          >
            <span className="text-slate-300 text-[11px]">🎈 Poppable Balloons</span>
            <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
              data.enablePopBalloons ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-white/20'
            }`}>
              {data.enablePopBalloons && <Check className="w-3 h-3" />}
            </div>
          </div>

          {/* Confetti */}
          <div 
            onClick={() => onChange({ enableConfettiPopper: !data.enableConfettiPopper })}
            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] cursor-pointer flex items-center justify-between text-xs transition"
          >
            <span className="text-slate-300 text-[11px]">🎊 Confetti Cannons</span>
            <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
              data.enableConfettiPopper ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-white/20'
            }`}>
              {data.enableConfettiPopper && <Check className="w-3 h-3" />}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
