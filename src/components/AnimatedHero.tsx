import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, Music, Cake, Gift, Heart, Play, Pause, ChevronRight } from 'lucide-react';
import { CuteBabySticker } from './CuteBabySticker';
import { soundManager } from '../utils/audio';

interface AnimatedHeroProps {
  onQuickPreview: () => void;
  onScrollToBuilder: () => void;
}

export const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  onQuickPreview,
  onScrollToBuilder
}) => {
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);

  const toggleTeaserMusic = () => {
    if (isPlayingTeaser) {
      soundManager.stop();
      setIsPlayingTeaser(false);
    } else {
      soundManager.playTrack('happy-birthday-classic', false);
      setIsPlayingTeaser(true);
    }
  };

  return (
    <section className="relative pt-6 sm:pt-10 pb-4 px-4 sm:px-6 max-w-5xl mx-auto w-full overflow-hidden">
      
      {/* Top Floating Badge */}
      <div className="flex justify-center mb-4">
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400/10 via-rose-500/10 to-purple-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-lg shadow-amber-500/5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
          </span>
          <span className="tracking-wide">✨ MODERN INTERACTIVE BIRTHDAY EXPERIENCE</span>
          <span className="hidden sm:inline text-white/30">•</span>
          <span className="hidden sm:inline text-slate-300 font-normal">Real Bakery Cakes & Soundtracks</span>
        </motion.div>
      </div>

      {/* Main Shimmer Headline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-center space-y-3 max-w-3xl mx-auto"
      >
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif leading-[1.15]">
          <span className="text-white">Craft Magical </span>
          <span className="shimmer-text">Birthday Celebrations </span>
          <span className="text-white">That Come Alive</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-base font-normal max-w-2xl mx-auto leading-relaxed">
          Design interactive birthday surprises with real whole bakery cakes, studio celebration soundtracks, interactive balloon popping, golden scratch gifts, and instant WhatsApp link delivery for 300 PKR.
        </p>
      </motion.div>

      {/* Hero Interactive Showcase Cards Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-7 sm:mt-9"
      >
        {/* Card 1: 3D Bakery Cake Preview */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="modern-animated-card p-4 rounded-3xl relative overflow-hidden group cursor-pointer"
          onClick={onScrollToBuilder}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/20 transition-all" />
          <div className="flex items-center justify-between mb-2.5">
            <span className="p-2 rounded-2xl bg-amber-400/15 border border-amber-400/30 text-amber-300">
              <Cake className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300/80 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              5 Artisan Cakes
            </span>
          </div>
          <h3 className="font-bold text-white text-sm">Real Uncut Cakes</h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Whole round cakes with realistic frosting, flickering flame candles, and golden knife cutting.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-amber-300 group-hover:translate-x-1 transition-transform">
            <span>Customize Cake</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Card 2: Interactive Soundtrack Equalizer */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="modern-animated-card p-4 rounded-3xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
          <div className="flex items-center justify-between mb-2.5">
            <span className="p-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300">
              <Music className="w-4 h-4" />
            </span>
            <button
              type="button"
              onClick={toggleTeaserMusic}
              className="flex items-center gap-1 text-[10px] font-bold text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 px-2.5 py-1 rounded-full border border-rose-500/30 transition cursor-pointer active:scale-95"
            >
              {isPlayingTeaser ? <Pause className="w-3 h-3 text-rose-400" /> : <Play className="w-3 h-3 text-rose-400" />}
              <span>{isPlayingTeaser ? 'Pause Demo' : 'Play Melody'}</span>
            </button>
          </div>
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <span>Studio Audio Songs</span>
            {isPlayingTeaser && (
              <span className="flex items-end gap-0.5 h-3.5">
                <span className="w-0.5 h-2 bg-rose-400 animate-pulse" />
                <span className="w-0.5 h-3.5 bg-amber-400 animate-pulse" />
                <span className="w-0.5 h-1.5 bg-rose-400 animate-pulse" />
                <span className="w-0.5 h-3 bg-purple-400 animate-pulse" />
              </span>
            )}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            5 crystal clear built-in celebration songs that play automatically on mobile & desktop.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-rose-300 group-hover:translate-x-1 transition-transform">
            <span>5 Built-in Tracks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>

        {/* Card 3: Royal Surprise & Status Video */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="modern-animated-card p-4 rounded-3xl relative overflow-hidden group cursor-pointer"
          onClick={onQuickPreview}
        >
          <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <div className="flex items-center justify-between mb-2.5">
            <span className="p-2 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300">
              <Gift className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-300/80 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
              Surprise & Video
            </span>
          </div>
          <h3 className="font-bold text-white text-sm">30s Video & Royal Pass</h3>
          <p className="text-[11px] text-slate-400 mt-1">
            Golden scratch surprise reveal and 9:16 WhatsApp status video generator ready to export.
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-purple-300 group-hover:translate-x-1 transition-transform">
            <span>Preview Experience</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </motion.div>
      </motion.div>

      {/* Infinite Scrolling Ticker Ribbon (Modern Animated Agency Style) */}
      <div className="mt-7 py-2.5 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden backdrop-blur-md">
        <div className="animate-marquee items-center gap-6 text-[11px] font-mono font-semibold text-slate-400 tracking-wider uppercase select-none">
          <span className="flex items-center gap-2 text-amber-300">
            <span>🎂</span> WHOLE BAKERY CAKES
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-rose-300">
            <span>🎵</span> 5 CELEBRATION TRACKS
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-emerald-300">
            <span>🎈</span> 3D POPPABLE BALLOONS
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-amber-300">
            <span>🗡️</span> GOLDEN KNIFE CUTTING
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-purple-300">
            <span>🎁</span> ROYAL SCRATCH SURPRISE
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-teal-300">
            <span>📱</span> 30s 9:16 STATUS VIDEO
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-amber-200">
            <span>⚡</span> INSTANT 300 PKR WHATSAPP DELIVERY
          </span>
          <span className="text-white/20">•</span>
          {/* Repeat set for seamless infinite loop */}
          <span className="flex items-center gap-2 text-amber-300">
            <span>🎂</span> WHOLE BAKERY CAKES
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-rose-300">
            <span>🎵</span> 5 CELEBRATION TRACKS
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-emerald-300">
            <span>🎈</span> 3D POPPABLE BALLOONS
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-amber-300">
            <span>🗡️</span> GOLDEN KNIFE CUTTING
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-purple-300">
            <span>🎁</span> ROYAL SCRATCH SURPRISE
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-teal-300">
            <span>📱</span> 30s 9:16 STATUS VIDEO
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2 text-amber-200">
            <span>⚡</span> INSTANT 300 PKR WHATSAPP DELIVERY
          </span>
          <span className="text-white/20">•</span>
        </div>
      </div>

    </section>
  );
};
