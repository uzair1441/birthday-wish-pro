import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Settings, RotateCcw, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { CuteBabySticker } from './CuteBabySticker';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  onOpenSettings: () => void;
  onPreview: () => void;
  onReset: () => void;
  isUnlocked: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSettings,
  onPreview,
  onReset,
  isUnlocked
}) => {
  const [isAudioMuted, setIsAudioMuted] = useState(soundManager.getIsMuted());

  const handleToggleSound = () => {
    const next = !isAudioMuted;
    soundManager.setMuted(next);
    setIsAudioMuted(next);
    if (!next) {
      soundManager.playClick();
    }
  };

  return (
    <motion.header 
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      id="app-navbar" 
      className="border-b border-white/[0.08] bg-[#090714]/85 backdrop-blur-2xl sticky top-0 z-40 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-2">
        
        {/* Boutique Brand Insignia */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 group cursor-pointer">
          <div className="relative shrink-0">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.08 }}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500/25 via-rose-500/20 to-purple-500/25 border border-amber-400/35 flex items-center justify-center shadow-lg shadow-amber-500/15"
            >
              <CuteBabySticker id="peach-goma-kiss" size={26} />
            </motion.div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] sm:text-[9px] text-slate-950 font-bold shadow-md animate-pulse">
              ✨
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-lg font-bold text-white tracking-tight font-serif whitespace-nowrap truncate">
                Birthday Luxe
              </h1>
              <span className="hidden sm:inline-flex bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text text-transparent font-sans text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/25 shrink-0">
                PARTY 3D 🎂
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 font-sans">
              <span>Interactive Birthday Stage Studio</span>
              <span className="text-amber-400/60">•</span>
              <span className="text-rose-300/90 font-medium">Real Cakes & Soundtracks</span>
            </p>
          </div>
        </div>

        {/* Action Controls - Compact & Clean on Mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Sound Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleToggleSound}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              !isAudioMuted
                ? 'bg-amber-400/15 border-amber-400/30 text-amber-300 shadow-sm'
                : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
            }`}
            title={isAudioMuted ? 'Unmute Celebratory Sounds' : 'Mute Sounds'}
          >
            {!isAudioMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline text-[11px]">Sound On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[11px]">Muted</span>
              </>
            )}
          </motion.button>

          {/* Bank Accounts Configuration */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="button"
            id="nav-btn-accounts"
            onClick={onOpenSettings}
            className="p-2 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 text-xs font-semibold transition cursor-pointer shadow-sm flex items-center gap-1.5"
            title="Configure Easypaisa, SadaPay & Bank Accounts"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Bank Setup</span>
          </motion.button>

          {/* Live Preview Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            id="nav-btn-preview"
            onClick={onPreview}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white text-xs font-bold transition cursor-pointer shadow-lg shadow-rose-500/20 shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Preview</span>
          </motion.button>

          {/* Reset Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            id="nav-btn-reset"
            onClick={onReset}
            className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
            title="Start New Wish"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </motion.button>

        </div>

      </div>

      {/* Celebratory Birthday Banner Ribbon Strip */}
      <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/20 to-purple-500/15 border-t border-amber-400/20 py-1 sm:py-1.5 px-3 text-center overflow-hidden">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-semibold text-amber-200 tracking-wide truncate">
          <span className="animate-bounce">🎈</span>
          <span className="truncate">Grand Interactive Birthday Experience Maker</span>
          <span className="text-amber-400/40 hidden md:inline">•</span>
          <span className="hidden md:inline text-rose-200 font-normal">Real Bakery Cakes, Stage Pedestals, Sparklers & Audio</span>
          <span className="animate-bounce">🎂</span>
        </div>
      </div>
    </motion.header>
  );
};



