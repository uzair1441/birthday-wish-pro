import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirthdayWishData } from '../types';
import { THEME_OPTIONS } from '../data/presets';
import { InteractiveCake } from './InteractiveCake';
import { CakeStagePedestal } from './CakeStagePedestal';
import { BirthdayStageDecor } from './BirthdayStageDecor';
import { StatusVideoGenerator } from './StatusVideoGenerator';
import { soundManager, BUILTIN_SONGS } from '../utils/audio';
import { CuteBabySticker } from './CuteBabySticker';
import { BirthdayWishHeader } from './BirthdayWishHeader';
import { RealBifoldBirthdayCard } from './RealBifoldBirthdayCard';
import { InteractiveGiftBox } from './InteractiveGiftBox';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  PartyPopper, 
  RotateCcw, 
  ArrowLeft, 
  Lock, 
  Unlock,
  Film,
  Gift,
  Smile,
  Play,
  Pause
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CelebrationViewProps {
  wish: BirthdayWishData;
  onExitPreview?: () => void;
  isStandaloneRecipient?: boolean;
}

interface BalloonItem {
  id: number;
  icon: string;
  x: number;
  speed: number;
  popped: boolean;
  blessing: string;
}

const BALLOON_BLESSINGS = [
  '🌟 Good Health & Boundless Energy!',
  '💖 Endless Love, Peace & Happiness!',
  '🚀 Huge Career Success & Great Wins!',
  '✈️ Amazing Travels & Fun Adventures!',
  '💰 Prosperity, Wealth & Good Fortune!',
  '🎂 Sweetest Memories & Forever Laughs!'
];

export const CelebrationView: React.FC<CelebrationViewProps> = ({
  wish,
  onExitPreview,
  isStandaloneRecipient = false
}) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(soundManager.getIsPlaying());
  const [isCakeCut, setIsCakeCut] = useState<boolean>(false);
  const [isGiftOpened, setIsGiftOpened] = useState<boolean>(false);
  const [isSecretRevealed, setIsSecretRevealed] = useState<boolean>(false);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [poppedCount, setPoppedCount] = useState<number>(0);
  const [latestBlessing, setLatestBlessing] = useState<string | null>(null);
  const [showStatusVideoModal, setShowStatusVideoModal] = useState<boolean>(false);
  const [mysteryTapped, setMysteryTapped] = useState<boolean>(false);

  // Subscribe to real-time audio playback status changes
  useEffect(() => {
    const unsub = soundManager.subscribe((playing) => {
      setIsPlayingMusic(playing);
    });
    return unsub;
  }, []);

  const theme = THEME_OPTIONS.find(t => t.id === wish.theme) || THEME_OPTIONS[0];

  // Calculate unlocked milestone count (out of 4)
  const unlockedCount = [
    isCakeCut,
    isGiftOpened,
    poppedCount > 0,
    isGiftOpened || isCakeCut // Celebration milestone
  ].filter(Boolean).length;

  // Initialize poppable balloons (Constrained to left and right peripheral corridors to keep center clean)
  useEffect(() => {
    if (wish.enablePopBalloons) {
      const icons = ['🎈', '🎉', '⭐', '💖', '🎁', '🎂'];
      const generated: BalloonItem[] = Array.from({ length: 6 }).map((_, idx) => ({
        id: idx,
        icon: icons[idx % icons.length],
        x: idx % 2 === 0 ? (3 + Math.floor(Math.random() * 12)) : (85 + Math.floor(Math.random() * 11)),
        speed: 10 + Math.random() * 6,
        popped: false,
        blessing: BALLOON_BLESSINGS[idx % BALLOON_BLESSINGS.length]
      }));
      setBalloons(generated);
    }
  }, [wish.enablePopBalloons]);

  const handleStartCelebration = () => {
    soundManager.unlockUserAudio();
    setHasStarted(true);
    soundManager.setMuted(false);
    setIsMuted(false);
    // Play the built-in selected song automatically with mobile unlock
    soundManager.playTrack(wish.musicTrack || 'birthday-classic', true);

    // Welcome confetti
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    });
  };

  const handleToggleMusic = () => {
    soundManager.unlockUserAudio();
    if (isPlayingMusic) {
      soundManager.stopMelody();
    } else {
      soundManager.setMuted(false);
      setIsMuted(false);
      soundManager.playTrack(wish.musicTrack || 'birthday-classic', true);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
    if (!nextMuted && !soundManager.getIsPlaying()) {
      soundManager.playTrack(wish.musicTrack || 'birthday-classic', true);
    }
  };

  const handlePopBalloon = (id: number, e: React.MouseEvent, blessing: string) => {
    e.stopPropagation();
    soundManager.playBalloonPop();
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    setPoppedCount(prev => prev + 1);
    setLatestBlessing(blessing);

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left / window.innerWidth;
    const y = rect.top / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y }
    });
  };

  const handleOpenGiftCard = () => {
    if (isGiftOpened) return;
    setIsGiftOpened(true);
    soundManager.playGiftUnwrap();
    confetti({
      particleCount: 100,
      spread: 110,
      origin: { y: 0.7 }
    });
  };

  const handleMysteryTap = () => {
    soundManager.playCelebrationFanfare();
    setMysteryTapped(true);
    confetti({
      particleCount: 45,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#F43F5E', '#A855F7', '#10B981']
    });
  };

  const handleFireConfetti = () => {
    soundManager.playCelebrationFanfare();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.8 }
    });
  };

  const handleResetCelebration = () => {
    setIsCakeCut(false);
    setIsGiftOpened(false);
    setIsSecretRevealed(false);
    setPoppedCount(0);
    setLatestBlessing(null);
    if (wish.enablePopBalloons) {
      setBalloons(prev => prev.map(b => ({ ...b, popped: false })));
    }
    soundManager.playClick();
  };

  // Cleanup audio when leaving view
  useEffect(() => {
    return () => {
      soundManager.stopMelody();
    };
  }, []);

  const selectedStickers = wish.selectedStickers && wish.selectedStickers.length > 0 
    ? wish.selectedStickers 
    : ['peach-goma-kiss', 'bubu-dudu-hug', 'chibi-cake', 'chibi-dance'];

  const currentSong = BUILTIN_SONGS.find(s => s.id === wish.musicTrack) || BUILTIN_SONGS[0];

  return (
    <div 
      id="celebration-screen"
      className={`min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br ${theme.bgGradient} text-white select-none flex flex-col`}
    >
      {/* 🎭 Authentic Grand Birthday Stage Decorations (Curtains, Bunting, Balloon Pillars, Fairy Lights, Spotlights) */}
      <BirthdayStageDecor 
        recipientName={wish.recipientName} 
        age={wish.age} 
        showCurtains={true} 
        themeId={wish.theme} 
      />

      {/* Subtle Fairy Light String Curtain & Sparkling Stage Dust */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:28px_28px] pointer-events-none -z-0 opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none -z-0" />

      {/* Floating Poppable Balloons */}
      {hasStarted && wish.enablePopBalloons && (
        <div className="fixed inset-0 pointer-events-none z-15 overflow-hidden">
          {balloons.map((balloon) => !balloon.popped ? (
            <div
              key={balloon.id}
              onClick={(e) => handlePopBalloon(balloon.id, e, balloon.blessing)}
              className="absolute pointer-events-auto cursor-pointer transition-transform hover:scale-125 active:scale-90"
              style={{
                left: `${balloon.x}%`,
                bottom: '-80px',
                animation: `floatUp ${balloon.speed}s linear infinite`,
                animationDelay: `${balloon.id * 1.5}s`
              }}
            >
              <div className="flex flex-col items-center group">
                <span className="text-4xl filter drop-shadow-md">{balloon.icon}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/80 text-white font-bold backdrop-blur-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity shadow">
                  Tap to Pop!
                </span>
              </div>
            </div>
          ) : null)}
        </div>
      )}

      {/* Latest Balloon Blessing Toast */}
      {latestBlessing && (
        <div className="fixed top-18 inset-x-4 max-w-sm mx-auto z-40 animate-bounce">
          <div className="p-3 px-4 rounded-2xl bg-slate-900/95 border border-amber-400 text-amber-200 text-xs font-bold text-center shadow-2xl backdrop-blur-md flex items-center justify-between gap-2">
            <span>{latestBlessing}</span>
            <button 
              type="button" 
              onClick={() => setLatestBlessing(null)}
              className="text-slate-400 hover:text-white cursor-pointer font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 1. Pre-Start Greeting Envelope Screen */}
      {!hasStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center px-3.5 sm:px-6 py-6 text-center relative z-30 w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md p-4 sm:p-8 rounded-3xl sm:rounded-[2.5rem] bg-slate-950/95 border border-white/20 shadow-2xl space-y-5 relative overflow-hidden modern-animated-card"
          >
            
            {/* Ambient Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/25 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

            {/* Elegant Calligraphy Birthday Wish Typography Emblem */}
            <BirthdayWishHeader />

            <div className="space-y-2 relative px-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 inline-flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>A VIP Birthday Celebration Awaits You!</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
                For {wish.recipientName || 'You'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {wish.senderName ? `${wish.senderName} has crafted an interactive celebration with real cake, music, and gifts especially for you!` : 'Someone crafted an interactive birthday celebration for you!'}
              </p>
            </div>

            {/* VIP Luxury Celebration Ticket & Interactive Mystery Seal */}
            <div className="relative p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-400/40 shadow-xl overflow-hidden text-left">
              {/* Shimmer light effect */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
              
              {/* VIP Pass Header Bar */}
              <div className="flex items-center justify-between border-b border-amber-400/20 pb-2 mb-2.5 text-[11px] font-mono tracking-wider text-amber-300 uppercase">
                <span className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  VIP ROYAL PASS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-semibold text-[10px]">
                  ALL INCLUSIVE
                </span>
              </div>

              {/* Interactive Surprise Latch / Box */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleMysteryTap}
                className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-amber-400/30 hover:border-amber-400 transition-all flex items-center gap-3 cursor-pointer group shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-400 to-purple-500 p-0.5 shadow-md group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-2xl">
                    {mysteryTapped ? '✨' : '🎁'}
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-amber-200 group-hover:text-amber-100 flex items-center gap-1.5">
                      <span>{mysteryTapped ? 'Surprise Unlocked!' : 'Interactive Birthday Box'}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-medium">
                        {mysteryTapped ? 'Ready' : 'Tap to Shake!'}
                      </span>
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-300/90 mt-0.5 leading-snug">
                    {mysteryTapped
                      ? '🎂 Cake Ceremony • 💌 Secret Letter • 🎈 Blessings • 📱 Status Reel'
                      : 'Tap to unlock the celebration secrets prepared for you!'}
                  </p>
                </div>
              </motion.button>

              {/* VIP Footer Stamp */}
              <div className="mt-2.5 pt-2 border-t border-amber-400/15 flex items-center justify-between text-[11px] text-amber-200/80 font-serif italic">
                <span>Specially curated for {wish.recipientName || 'You'}</span>
                <span className="text-rose-400 not-italic font-sans text-xs">❤️ With Love</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              id="btn-start-celebration"
              onClick={handleStartCelebration}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-rose-500/30 transition cursor-pointer flex items-center justify-center gap-2.5"
            >
              <span>Tap to Open Celebration ✨</span>
            </motion.button>
          </motion.div>

          {/* Pre-start Navigation Links at bottom */}
          <div className="mt-4 flex items-center justify-center gap-3">
            {onExitPreview && (
              <button
                type="button"
                onClick={onExitPreview}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-xs text-slate-300 hover:text-white transition cursor-pointer shadow-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Editor</span>
              </button>
            )}

            {isStandaloneRecipient && (
              <a
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-xs text-rose-300 hover:text-rose-200 transition shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Your Own Wish</span>
              </a>
            )}
          </div>
        </div>
      ) : (
        /* 2. Full Active Celebration Stage */
        <motion.main 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col items-center justify-start px-4 sm:px-16 md:px-20 pt-16 sm:pt-22 pb-28 max-w-4xl mx-auto w-full z-10 space-y-7"
        >
          
          {/* Main Title & Milestone Badge */}
          <div className="text-center space-y-2 pt-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-medium text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{wish.milestoneTitle || (wish.age ? `Celebrating ${wish.age} Wonderful Years` : 'Special Milestone Day!')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight drop-shadow-md text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-white to-amber-200">
              Happy Birthday, {wish.recipientName}!
            </h1>

            {wish.nickname && (
              <p className="text-sm font-medium text-pink-300">
                To our beloved "{wish.nickname}" 💖
              </p>
            )}
          </div>

          {/* Interactive Music Player Bar - Tap to Play / Pause anytime on Mobile or Desktop */}
          <div className="flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full bg-slate-900/90 border border-amber-400/35 text-xs text-slate-200 shadow-xl backdrop-blur-md">
            <button
              type="button"
              onClick={handleToggleMusic}
              className="flex items-center gap-2.5 cursor-pointer group text-left"
              title={isPlayingMusic ? 'Pause Music' : 'Play Birthday Music'}
            >
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold shadow transition-transform group-hover:scale-105 ${
                isPlayingMusic ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950' : 'bg-white/10 text-amber-300 border border-white/20'
              }`}>
                {isPlayingMusic ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-200 truncate max-w-[130px] sm:max-w-[200px]">
                    {currentSong.name}
                  </span>
                  {isPlayingMusic && (
                    <span className="flex items-end gap-0.5 h-3 shrink-0">
                      <span className="w-0.5 h-2 bg-rose-400 animate-pulse" />
                      <span className="w-0.5 h-3 bg-amber-400 animate-pulse" />
                      <span className="w-0.5 h-1.5 bg-rose-400 animate-pulse" />
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 truncate">
                  {isPlayingMusic ? 'Playing • Tap to pause' : 'Tap to Play Birthday Song 🎵'}
                </p>
              </div>
            </button>

            <div className="w-px h-5 bg-white/15" />

            <button
              type="button"
              onClick={handleToggleMute}
              className="p-1 rounded-lg text-slate-300 hover:text-white transition"
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* SURPRISE 1: Real Cake Display on an Illuminated Birthday Stage Pedestal with Pyrotechnics */}
          <div className="w-full flex flex-col items-center">
            <CakeStagePedestal isCakeCut={isCakeCut}>
              <InteractiveCake
                cakeStyleId={wish.cakeStyle}
                interactive={wish.enableCutCake ?? true}
                isCakeCut={isCakeCut}
                onCutCake={() => {
                  setIsCakeCut(true);
                  confetti({ particleCount: 90, spread: 100, origin: { y: 0.65 } });
                }}
              />
            </CakeStagePedestal>
          </div>

          {/* Cute Animated Baby Stickers (Bubu & Dudu / Peach & Goma) */}
          <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-5 py-1">
            {selectedStickers.map((stickerId, idx) => (
              <div
                key={idx}
                onClick={() => {
                  soundManager.playClick();
                  confetti({ particleCount: 20, spread: 45, origin: { y: 0.75 } });
                }}
                className="p-2.5 rounded-3xl bg-slate-900/80 hover:bg-slate-800 border border-white/20 backdrop-blur-md transition-transform hover:scale-115 active:scale-95 cursor-pointer shadow-lg"
                title="Tap for mini confetti"
              >
                <CuteBabySticker id={stickerId} size={58} animate={true} />
              </div>
            ))}
          </div>

          {/* SURPRISE 2: Realistic 3D Physical Cardboard Greeting Card (Bi-Fold) */}
          <div className="w-full max-w-2xl">
            <RealBifoldBirthdayCard
              wish={wish}
              isOpen={isGiftOpened}
              onOpenCard={handleOpenGiftCard}
              onCloseCard={() => setIsGiftOpened(false)}
              onOpenStatusVideo={() => setShowStatusVideoModal(true)}
            />
          </div>

          {/* SURPRISE 3: Luxury 3D Surprise Gift Box Unboxing */}
          <InteractiveGiftBox wish={wish} />

          {/* ================= CELEBRATION FOOTER CONTROLS ================= */}
          <footer className="w-full max-w-3xl mx-auto mt-8 pt-5 pb-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 rounded-3xl bg-slate-950/85 border border-white/15 backdrop-blur-xl shadow-2xl">
            
            {/* Left: Navigation Actions (Back to Editor / Start New Wish) */}
            <div className="flex items-center gap-2">
              {onExitPreview && (
                <button
                  id="btn-footer-back-to-editor"
                  type="button"
                  onClick={onExitPreview}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 text-xs font-semibold text-slate-200 hover:text-white transition cursor-pointer shadow-sm active:scale-95"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Editor</span>
                </button>
              )}

              {isStandaloneRecipient && (
                <a
                  id="btn-footer-create-wish"
                  href="/"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500/20 to-purple-500/20 hover:from-rose-500/30 hover:to-purple-500/30 border border-rose-400/40 text-xs font-bold text-rose-200 transition shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>Start New Wish</span>
                </a>
              )}
            </div>

            {/* Center: Celebration Controls (Confetti, Replay, Mute) */}
            <div className="flex items-center gap-2">
              {wish.enableConfettiPopper && (
                <button
                  id="btn-footer-confetti"
                  type="button"
                  onClick={handleFireConfetti}
                  title="Fire Party Poppers!"
                  className="p-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-amber-300 hover:text-amber-200 transition active:scale-90 cursor-pointer shadow-sm"
                >
                  <PartyPopper className="w-4 h-4" />
                </button>
              )}

              <button
                id="btn-footer-replay"
                type="button"
                onClick={handleResetCelebration}
                title="Replay Celebration"
                className="p-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-slate-200 hover:text-white transition active:scale-90 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="btn-footer-mute"
                type="button"
                onClick={handleToggleMute}
                title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
                className="p-2.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-slate-200 hover:text-white transition active:scale-90 cursor-pointer shadow-sm"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />}
              </button>
            </div>

            {/* Right: WhatsApp Status Video & Thank You */}
            <div className="flex items-center gap-2">
              <button
                id="btn-footer-status-video"
                type="button"
                onClick={() => setShowStatusVideoModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition active:scale-95 cursor-pointer shrink-0"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Status Video</span>
              </button>

              <a
                id="btn-footer-thankyou"
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Thank you so much ${wish.senderName}! I just opened your birthday wish and loved the cake & message! 🥰🎂`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                title={`Send Thank You to ${wish.senderName}`}
              >
                <Smile className="w-4 h-4" />
                <span>Thank You</span>
              </a>
            </div>

          </footer>

        </motion.main>
      )}

      {/* 30-Second Status Video Generator Modal */}
      <StatusVideoGenerator
        isOpen={showStatusVideoModal}
        onClose={() => setShowStatusVideoModal(false)}
        wish={wish}
      />

      {/* Floating Balloon Keyframe Style */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-50vh) rotate(5deg);
          }
          100% {
            transform: translateY(-110vh) rotate(-5deg);
          }
        }
      `}</style>
    </div>
  );
};
