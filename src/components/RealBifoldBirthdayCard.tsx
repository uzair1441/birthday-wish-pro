import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Lock, Unlock, Sparkles, Film, RotateCcw, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { BirthdayWishData } from '../types';

interface RealBifoldBirthdayCardProps {
  wish: BirthdayWishData;
  isOpen?: boolean;
  onOpenCard?: () => void;
  onCloseCard?: () => void;
  onOpenStatusVideo?: () => void;
}

export const RealBifoldBirthdayCard: React.FC<RealBifoldBirthdayCardProps> = ({
  wish,
  isOpen: controlledIsOpen,
  onOpenCard,
  onCloseCard,
  onOpenStatusVideo
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState<boolean>(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const [isSecretRevealed, setIsSecretRevealed] = useState<boolean>(false);

  const handleOpenCard = () => {
    soundManager.playClick();
    if (onOpenCard) {
      onOpenCard();
    } else {
      setInternalIsOpen(true);
    }

    // Multi-stage celebratory confetti
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.65 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0.2, y: 0.7 }
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 0.8, y: 0.7 }
      });
    }, 300);
  };

  const handleCloseCard = () => {
    soundManager.playClick();
    if (onCloseCard) {
      onCloseCard();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center select-none py-4">
      
      {/* Container with 3D Perspective */}
      <div className="w-full max-w-2xl relative card-perspective flex justify-center">

        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* =========================================================================
               1. CLOSED PHYSICAL CARDBOARD GREETING CARD (باہر کا گتہ / FRONT COVER)
               ========================================================================= */
            <motion.div
              key="closed-card"
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ 
                rotateY: -95, 
                opacity: 0, 
                scale: 0.9,
                transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
              }}
              whileHover={{ scale: 1.02 }}
              onClick={handleOpenCard}
              className="w-full max-w-[360px] sm:max-w-[420px] aspect-[4/5] cardboard-cover-texture rounded-3xl p-6 sm:p-8 cursor-pointer relative overflow-hidden flex flex-col justify-between border-2 border-amber-400/50 shadow-[0_30px_70px_rgba(0,0,0,0.85)] group transition-all mx-auto"
            >
              {/* Embossed Gold Foil Corner Ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-300/80 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-300/80 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-300/80 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-300/80 rounded-br-lg pointer-events-none" />

              {/* Symmetrical Subtle Center Shimmer Ribbon */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-amber-600/10 via-amber-300/25 to-amber-600/10 pointer-events-none border-x border-amber-300/20 shadow-inner" />

              {/* Top Header Stamp */}
              <div className="flex items-center justify-between relative z-10 w-full">
                <div className="px-2.5 py-1 rounded-md border border-amber-400/60 bg-amber-500/15 text-[10px] font-bold text-amber-200 tracking-widest uppercase shadow-sm">
                  VIP Keepsake Card
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-serif italic">
                  <span>Special Delivery</span>
                  <span>✨</span>
                </div>
              </div>

              {/* Cardboard Cover Centerpiece */}
              <div className="text-center space-y-3.5 relative z-10 my-auto w-full px-2">
                {/* 3D Wax Seal Badge */}
                <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-800 via-rose-600 to-amber-600 shadow-[0_8px_25px_rgba(225,29,72,0.65)] border-2 border-amber-300/90 animate-pulse" />
                  <div className="relative z-10 text-white flex flex-col items-center">
                    <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-amber-300 text-amber-300 drop-shadow-md" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-3xl sm:text-4xl font-['Great_Vibes'] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-100 drop-shadow-md leading-tight">
                    Happy Birthday
                  </h3>
                  <div className="h-0.5 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                </div>

                <div className="pt-1.5">
                  <p className="text-[10px] uppercase tracking-widest text-amber-300/80 font-sans font-bold">
                    Handcrafted For
                  </p>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide truncate max-w-[280px] mx-auto mt-0.5 drop-shadow">
                    {wish.recipientName || 'My Beloved'}
                  </p>
                </div>
              </div>

              {/* Bottom Interactive Open Prompt */}
              <div className="relative z-10 text-center space-y-2 w-full">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCard();
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-slate-950 font-extrabold text-xs sm:text-sm tracking-wide shadow-xl shadow-amber-500/25 transition transform group-hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-slate-950" />
                  <span>Open Birthday Card 📖</span>
                </button>
                <p className="text-[10px] text-amber-300/70 font-sans tracking-wide">
                  Tap to unfold like an authentic physical greeting card
                </p>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               2. OPENED BI-FOLD GREETING CARD (جیسے اصلی گتے کا کارڈ دو طرف کھلتا ہے)
               ========================================================================= */
            <motion.div
              key="opened-card"
              initial={{ rotateY: 90, opacity: 0, scale: 0.92 }}
              animate={{ rotateY: 0, opacity: 1, scale: 1 }}
              exit={{ rotateY: 90, opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full rounded-3xl paper-texture-ivory border-4 border-[#2b0816] shadow-[0_35px_80px_rgba(0,0,0,0.85)] p-5 sm:p-8 text-stone-900 relative overflow-hidden preserve-3d"
            >
              {/* Card Spine Crease Shadow (بیچ کی تہہ کا سایہ) */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 paper-crease-shadow pointer-events-none z-10" />

              {/* Top Golden Ornate Border Trim */}
              <div className="border-b-2 border-dashed border-amber-700/30 pb-3 mb-5 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-2 font-serif font-bold text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs sm:text-sm tracking-wide">Personalized Birthday Keepsake</span>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200/90 hover:bg-stone-300 text-stone-800 text-[11px] font-semibold transition cursor-pointer shadow-sm"
                  title="Fold Card Back"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fold Card</span>
                </button>
              </div>

              {/* Main Bi-Fold Card Body (Two matching height pages side-by-side or stacked on mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch relative z-0">
                
                {/* ----------------- LEFT INNER PAGE (بایاں صفحہ: فوٹو / میموری) ----------------- */}
                <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#fdfcf5] border border-stone-300/80 shadow-sm relative h-full min-h-[380px]">
                  
                  {wish.photoUrl ? (
                    /* Mounted Polaroid with Realistic Washi Tape */
                    <div className="flex-1 flex flex-col items-center justify-center my-auto py-2">
                      <div className="relative w-full max-w-[240px] bg-white p-3.5 pt-4 pb-6 rounded-xl shadow-xl border border-stone-200 -rotate-1 hover:rotate-0 transition-transform duration-300">
                        {/* Top Washi Tape Corner */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-amber-400/40 backdrop-blur-sm border-t border-b border-amber-300/80 rotate-2 shadow-sm pointer-events-none" />
                        
                        <div className="aspect-square w-full rounded-lg overflow-hidden bg-stone-100 shadow-inner">
                          <img
                            src={wish.photoUrl}
                            alt="Special Memory"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <p className="mt-3 text-center text-stone-800 font-['Dancing_Script'] text-base font-bold truncate">
                          {wish.photoCaption || 'A Precious Memory to Cherish ✨'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Default Celebratory Birthday Greeting Illustration for Left Page */
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 my-auto py-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-100 via-rose-100 to-amber-200 border-2 border-amber-400/80 flex items-center justify-center text-3xl shadow-md">
                        🎂
                      </div>
                      <div className="space-y-1.5">
                        <p className="font-['Great_Vibes'] text-3xl sm:text-4xl text-rose-800">
                          A Wish From The Heart
                        </p>
                        <p className="text-xs sm:text-sm text-stone-600 max-w-xs font-serif italic leading-relaxed px-2">
                          "May your year ahead be blessed with boundless health, endless happiness, and heartfelt laughter."
                        </p>
                      </div>
                      <div className="pt-1">
                        <span className="text-[11px] uppercase tracking-widest text-amber-900 font-bold px-3.5 py-1 rounded-full bg-amber-200/60 border border-amber-400/50 shadow-xs">
                          Happy Birthday 🎈
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Postal Stamped Seal at the bottom of Left Page */}
                  <div className="mt-4 pt-3 border-t border-dashed border-stone-300 w-full flex items-center justify-between text-[11px] text-stone-500 font-serif">
                    <span>Date: {wish.birthdayDate || 'Today'}</span>
                    <span className="font-bold text-amber-900">★ Official Keepsake ★</span>
                  </div>
                </div>

                {/* ----------------- RIGHT INNER PAGE (دایاں صفحہ: ہاتھ سے لکھا ہوا میسج) ----------------- */}
                <div className="flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-[#fdfcf5] border border-stone-300/80 shadow-sm relative h-full min-h-[380px] space-y-4">
                  
                  {/* Greeting Salutation & Headline */}
                  <div className="space-y-2">
                    <p className="text-2xl sm:text-3xl font-['Dancing_Script'] font-bold text-rose-950">
                      Dearest {wish.recipientName || 'Friend'},
                    </p>
                    {wish.headline && (
                      <div className="px-3 py-1.5 rounded-lg bg-amber-50 border-l-2 border-amber-500 text-xs sm:text-sm font-serif font-bold text-amber-900 italic">
                        "{wish.headline}"
                      </div>
                    )}
                  </div>

                  {/* Sincere Letter Message Body (Balanced, comfortable line-height and aligned margins) */}
                  <div className="flex-1 my-auto text-stone-800 text-xs sm:text-sm leading-relaxed sm:leading-loose font-serif whitespace-pre-wrap py-3 px-1 border-y border-stone-200/80">
                    {wish.message}
                  </div>

                  {/* Sign-off & Signature */}
                  <div className="space-y-1 pt-1">
                    <p className="text-xs text-stone-600 font-serif italic">
                      With all my love, warmest prayers & best wishes,
                    </p>
                    <p className="text-xl sm:text-2xl font-['Dancing_Script'] font-bold text-rose-950">
                      {wish.senderName || 'Your Loved One'}
                      {wish.relationship && (
                        <span className="text-xs font-sans text-stone-600 font-normal ml-2">
                          ({wish.relationship})
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Secret Note Scratch Card Inside */}
                  {wish.secretMessage && (
                    <div className="pt-2">
                      <div
                        onClick={() => {
                          soundManager.playClick();
                          setIsSecretRevealed(!isSecretRevealed);
                        }}
                        className="p-3 rounded-xl bg-amber-50/90 border border-amber-300/80 hover:bg-amber-100/90 cursor-pointer transition flex items-center justify-between text-xs shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded-lg bg-amber-200 text-amber-900">
                            {isSecretRevealed ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="font-bold text-amber-950 block text-[11px]">
                              {isSecretRevealed ? 'Secret Note:' : 'Private Note Sealed Inside'}
                            </span>
                            <span className="text-stone-700 text-[11px]">
                              {isSecretRevealed ? wish.secretMessage : 'Tap to reveal secret message...'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-amber-900 font-bold underline shrink-0 ml-2">
                          {isSecretRevealed ? 'Hide' : 'Reveal'}
                        </span>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Card Footer Actions (WhatsApp 30s Status Video & Re-close) */}
              <div className="mt-6 pt-4 border-t border-dashed border-amber-800/30 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleCloseCard}
                  className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Fold Card Closed</span>
                </button>

                {onOpenStatusVideo && (
                  <button
                    type="button"
                    onClick={onOpenStatusVideo}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Create 30s WhatsApp Status Video</span>
                  </button>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
};
