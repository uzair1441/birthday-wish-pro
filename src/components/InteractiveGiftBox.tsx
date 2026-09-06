import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirthdayWishData } from '../types';
import { GIFT_BOX_OPTIONS, SURPRISE_GIFT_OPTIONS } from '../data/giftPresets';
import { CuteBabySticker } from './CuteBabySticker';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Check, RotateCcw, Share2, Award, Heart, MessageCircle } from 'lucide-react';

interface InteractiveGiftBoxProps {
  wish: BirthdayWishData;
}

export const InteractiveGiftBox: React.FC<InteractiveGiftBoxProps> = ({ wish }) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const selectedBox = GIFT_BOX_OPTIONS.find(b => b.id === wish.giftBoxStyle) || GIFT_BOX_OPTIONS[0];
  const selectedGift = SURPRISE_GIFT_OPTIONS.find(g => g.id === wish.surpriseGift) || SURPRISE_GIFT_OPTIONS[0];

  const handleOpenBox = () => {
    if (isOpened) return;
    setIsOpened(true);
    soundManager.playGiftUnwrap();
    soundManager.playCelebrationFanfare();

    confetti({
      particleCount: 110,
      spread: 100,
      origin: { y: 0.65 },
      colors: ['#F59E0B', '#F43F5E', '#EC4899', '#A855F7', '#10B981']
    });
  };

  const handleCloseBox = () => {
    soundManager.playClick();
    setIsOpened(false);
  };

  return (
    <div id="interactive-gift-section" className="w-full max-w-2xl mx-auto my-4">
      
      {/* Container Header */}
      <div className="text-center space-y-1.5 mb-5">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/35 text-amber-300 text-xs font-bold shadow-sm">
          <Gift className="w-3.5 h-3.5 text-amber-400" />
          <span>VIP Mystery Present For {wish.recipientName || 'You'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center justify-center gap-2">
          <span>{isOpened ? '🎉 Surprise Unboxed!' : '🎁 Tap To Unwrap Your Special Gift'}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          {isOpened
            ? `${wish.senderName || 'Your loved one'} prepared this special birthday present for you!`
            : 'Tap the luxury gift box below to unwrap the surprise inside.'}
        </p>
      </div>

      {/* Main Interactive Stage Box */}
      <div className="relative rounded-3xl bg-slate-950/85 border border-white/[0.12] p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden text-center">
        
        {/* Glow ambient background lights */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {!isOpened ? (
            /* ================= UNOPENED LUXURY GIFT BOX ================= */
            <motion.div
              key="closed-box"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0 }}
              className="flex flex-col items-center py-5 cursor-pointer group"
              onClick={handleOpenBox}
            >
              {/* 3D Wrapped Gift Box with Overhanging Lid & Pedestal Glow */}
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex flex-col items-center justify-center pt-6 pb-2"
              >
                {/* 3D Big Fluffy Ribbon Bow on top */}
                <div className="relative z-30 flex items-center justify-center -mb-3">
                  <div className="relative flex items-center justify-center">
                    {/* Left Loop */}
                    <div className="w-12 h-8 rounded-full border-2 border-amber-200 bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 shadow-lg -rotate-45" />
                    {/* Right Loop */}
                    <div className="w-12 h-8 rounded-full border-2 border-amber-200 bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 shadow-lg rotate-45 -ml-5" />
                    {/* Center Ribbon Knot */}
                    <div className="absolute w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-200 to-amber-300 border-2 border-white shadow-md flex items-center justify-center text-[10px]">
                      ✨
                    </div>
                  </div>
                </div>

                {/* Overhanging Box Lid */}
                <div className="relative z-20 w-44 sm:w-52 h-8 rounded-xl bg-gradient-to-r from-white/20 via-white/5 to-white/20 p-[1px] shadow-lg">
                  <div className={`w-full h-full rounded-xl bg-gradient-to-r ${selectedBox.boxColor} border-t border-b border-amber-300/40 relative overflow-hidden flex items-center justify-center`}>
                    {/* Lid Ribbon */}
                    <div className={`w-8 h-full ${selectedBox.ribbonColor} opacity-90 shadow-sm`} />
                  </div>
                </div>

                {/* Main Box Body */}
                <div
                  className={`w-40 h-36 sm:w-48 sm:h-44 rounded-b-2xl bg-gradient-to-br ${selectedBox.boxColor} border-2 ${selectedBox.borderColor} shadow-[0_20px_50px_rgba(0,0,0,0.65)] relative overflow-hidden flex items-center justify-center -mt-1`}
                >
                  {/* Vertical Ribbon */}
                  <div className={`absolute top-0 bottom-0 w-8 ${selectedBox.ribbonColor} shadow-md opacity-90`} />
                  {/* Horizontal Ribbon */}
                  <div className={`absolute left-0 right-0 h-8 ${selectedBox.ribbonColor} shadow-md opacity-90`} />

                  {/* Shimmer light bar */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.18] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Golden Wax Seal / Center Emblem */}
                  <div className="relative z-10 w-11 h-11 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-400 to-amber-500 border-2 border-yellow-200 shadow-xl flex items-center justify-center text-slate-950 font-bold text-base">
                    🎁
                  </div>

                  {/* Hanging Gift Tag attached to Box */}
                  <div className="absolute bottom-2 right-2 z-20 bg-amber-50 text-stone-900 border border-amber-300/90 px-2.5 py-1 rounded-lg shadow-md rotate-3 text-left">
                    <p className="text-[8px] font-sans font-bold text-amber-800 uppercase tracking-wider">Gift For:</p>
                    <p className="text-[11px] font-serif font-extrabold text-stone-900 truncate max-w-[90px]">
                      {wish.recipientName || 'You'}
                    </p>
                  </div>
                </div>

                {/* Grounding Stage Shadow & Pedestal Glow */}
                <div className="w-48 sm:w-56 h-4 bg-black/60 rounded-full blur-sm mt-1 mx-auto pointer-events-none" />
                <div className="w-36 h-2 bg-amber-400/20 rounded-full blur-md mx-auto pointer-events-none -mt-2" />
              </motion.div>

              {/* Call to action button */}
              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={handleOpenBox}
                  className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-rose-500/25 transition transform group-hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer mx-auto"
                >
                  <Gift className="w-4 h-4 text-slate-950" />
                  <span>Tap to Unwrap Present ✨</span>
                </button>
                <p className="text-[11px] text-amber-300/80 font-medium">
                  {selectedBox.name} • Specially wrapped for this birthday
                </p>
              </div>
            </motion.div>
          ) : (
            /* ================= UNWRAPPED / REVEALED SURPRISE PRESENT ================= */
            <motion.div
              key="opened-box"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center py-2 space-y-5 w-full"
            >
              {/* Revealed Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedGift.badge}</span>
              </div>

              {/* Centerpiece Present Presentation Card */}
              <div className="w-full max-w-md mx-auto p-5 sm:p-7 rounded-3xl bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-amber-500/10 border-2 border-amber-400/60 shadow-2xl relative text-center">
                
                {/* Chibi celebration sticker on top right */}
                <div className="absolute top-4 right-4 p-1 rounded-2xl bg-slate-900/90 border border-amber-400/40 shadow-xl">
                  <CuteBabySticker id={selectedGift.stickerId} size={42} animate={true} />
                </div>

                {/* Big Emoji / Icon Visual Showcase in Circular Pedestal */}
                <div className="py-2">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-400/20 via-rose-500/20 to-purple-500/20 border-2 border-amber-400/40 flex items-center justify-center text-5xl sm:text-6xl drop-shadow-xl shadow-inner animate-bounce">
                    {selectedGift.emoji}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-extrabold text-white mt-3">
                    {selectedGift.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-300 mt-1 tracking-wide">
                    {selectedGift.tagline}
                  </p>
                </div>

                {/* Description / Story of the gift */}
                <div className="mt-4 p-4 rounded-2xl bg-black/45 border border-white/[0.1] text-xs sm:text-sm text-slate-200 leading-relaxed text-left shadow-inner">
                  <p>{selectedGift.revealedGreeting}</p>
                </div>

                {/* Sender's Custom Gift Note */}
                <div className="mt-3.5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/35 flex items-start gap-3 text-left">
                  <Heart className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-100 flex-1">
                    <span className="font-bold block text-amber-200 text-xs">
                      Personal Note from {wish.senderName || 'Your Loved One'}:
                    </span>
                    <p className="text-[11px] sm:text-xs text-amber-200/90 mt-1 italic leading-relaxed">
                      "{wish.giftNote || 'Sent with all my love, warmth, and warmest prayers for your blessed year ahead!'}"
                    </p>
                  </div>
                </div>

                {/* If it's a VIP Treat Voucher: Offer WhatsApp Claim Link */}
                {selectedGift.id === 'treat-voucher' && (
                  <div className="mt-4 pt-3 border-t border-white/[0.08]">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                        `Hey ${wish.senderName || 'there'}! I just unboxed your VIP Birthday Treat Pass on my birthday link! When are we going for our treat? 🍕☕😄`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Claim Your Treat on WhatsApp with {wish.senderName || 'Sender'}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Actions: Re-wrap & Enjoy */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseBox}
                  className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Pack Back in Gift Box</span>
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};
