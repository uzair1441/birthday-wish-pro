import React from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface BirthdayStageDecorProps {
  recipientName?: string;
  age?: number | string;
  showCurtains?: boolean;
}

export const BirthdayStageDecor: React.FC<BirthdayStageDecorProps> = ({
  recipientName,
  age,
  showCurtains = true,
}) => {
  const handleBalloonClick = (e: React.MouseEvent) => {
    soundManager.playBalloonPop();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = rect.left / window.innerWidth;
    const y = rect.top / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x, y },
      colors: ['#F59E0B', '#EC4899', '#8B5CF6', '#10B981', '#38BDF8'],
    });
  };

  // 14 colorful festive triangular bunting flags
  const flags = [
    { color: '#F43F5E', rotate: -6 },
    { color: '#F59E0B', rotate: 3 },
    { color: '#8B5CF6', rotate: -4 },
    { color: '#10B981', rotate: 5 },
    { color: '#EC4899', rotate: -3 },
    { color: '#38BDF8', rotate: 4 },
    { color: '#EAB308', rotate: -5 },
    { color: '#F43F5E', rotate: 3 },
    { color: '#A855F7', rotate: -4 },
    { color: '#06B6D4', rotate: 5 },
    { color: '#F97316', rotate: -3 },
    { color: '#EC4899', rotate: 4 },
    { color: '#FBBF24', rotate: -4 },
    { color: '#8B5CF6', rotate: 2 },
  ];

  // Fairy light bulbs
  const fairyLights = Array.from({ length: 22 }).map((_, i) => ({
    id: i,
    color: ['#FBBF24', '#F43F5E', '#38BDF8', '#A855F7', '#34D399', '#F59E0B'][i % 6],
    delay: `${(i * 0.25) % 2.5}s`,
    duration: `${1.8 + (i % 3) * 0.4}s`,
  }));

  // Sparkler rising particles
  const sparklers = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    delay: `${(i * 0.3) % 2}s`,
    left: `${20 + (i * 8)}%`,
    duration: `${1.2 + (i % 4) * 0.2}s`,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-35">
      
      {/* 1. Dramatic Theatrical Stage Spotlight Beams */}
      <div className="absolute -top-10 left-1/12 w-96 h-[800px] bg-gradient-to-b from-amber-300/15 via-rose-500/5 to-transparent transform -rotate-18 origin-top-left blur-3xl pointer-events-none animate-spotlight" />
      <div className="absolute -top-10 right-1/12 w-96 h-[800px] bg-gradient-to-b from-purple-400/15 via-amber-400/5 to-transparent transform rotate-18 origin-top-right blur-3xl pointer-events-none animate-spotlight" style={{ animationDelay: '4s' }} />

      {/* 2. Overhead Theatrical Stage Curtains & Velvet Swag Drapes */}
      {showCurtains && (
        <>
          {/* Top Valance Scallop Trim */}
          <div className="absolute top-0 left-0 right-0 h-12 sm:h-16 bg-gradient-to-b from-[#1c040d] via-[#2d0516] to-[#1c040d]/95 border-b-2 border-amber-400/50 shadow-2xl z-20 flex items-start justify-center overflow-hidden">
            <svg className="w-full h-9 text-rose-900 fill-current opacity-90" viewBox="0 0 1200 40" preserveAspectRatio="none">
              <path d="M0,0 Q100,35 200,0 Q300,35 400,0 Q500,35 600,0 Q700,35 800,0 Q900,35 1000,0 Q1100,35 1200,0 L1200,0 L0,0 Z" />
            </svg>
            {/* Golden fringe beads along top */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 opacity-90 shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
          </div>

          {/* Left Stage Curtain & Tieback (Stays Fixed on Screen) */}
          <div className="absolute top-0 left-0 w-20 sm:w-36 md:w-48 lg:w-56 h-[380px] sm:h-[460px] pointer-events-none z-20">
            <svg className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]" viewBox="0 0 200 460" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curtainGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4c0519" />
                  <stop offset="35%" stopColor="#881337" />
                  <stop offset="70%" stopColor="#9f1239" />
                  <stop offset="100%" stopColor="#4c0519" />
                </linearGradient>
                <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#FDE68A" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>
              {/* Velvet folds */}
              <path d="M0,0 C60,20 120,40 180,0 C160,140 70,220 50,320 C30,370 70,420 120,460 L0,460 Z" fill="url(#curtainGradLeft)" />
              <path d="M30,0 C80,30 110,60 140,0 C120,120 50,210 35,310 C20,360 45,410 80,460 L0,460 Z" fill="#be123c" opacity="0.3" />
              {/* Golden Rope Tie-back */}
              <ellipse cx="60" cy="270" rx="35" ry="10" fill="none" stroke="url(#goldRibbon)" strokeWidth="4" />
              {/* Tassel */}
              <path d="M85,275 L95,315 L75,315 Z" fill="url(#goldRibbon)" />
            </svg>
          </div>

          {/* Right Stage Curtain & Tieback (Stays Fixed on Screen) */}
          <div className="absolute top-0 right-0 w-20 sm:w-36 md:w-48 lg:w-56 h-[380px] sm:h-[460px] pointer-events-none z-20">
            <svg className="w-full h-full filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]" viewBox="0 0 200 460" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curtainGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#4c0519" />
                  <stop offset="35%" stopColor="#881337" />
                  <stop offset="70%" stopColor="#9f1239" />
                  <stop offset="100%" stopColor="#4c0519" />
                </linearGradient>
              </defs>
              {/* Velvet folds */}
              <path d="M200,0 C140,20 80,40 20,0 C40,140 130,220 150,320 C170,370 130,420 80,460 L200,460 Z" fill="url(#curtainGradRight)" />
              <path d="M170,0 C120,30 90,60 60,0 C80,120 150,210 165,310 C180,360 155,410 120,460 L200,460 Z" fill="#be123c" opacity="0.3" />
              {/* Golden Rope Tie-back */}
              <ellipse cx="140" cy="270" rx="35" ry="10" fill="none" stroke="url(#goldRibbon)" strokeWidth="4" />
              {/* Tassel */}
              <path d="M115,275 L105,315 L125,315 Z" fill="url(#goldRibbon)" />
            </svg>
          </div>
        </>
      )}

      {/* 3. Overhead Festive Bunting Garlands (Colorful Pennant Party Flags) */}
      <div className="absolute top-6 sm:top-9 inset-x-0 h-24 pointer-events-none z-15 overflow-hidden">
        {/* Scalloped hanging string curve */}
        <svg className="w-full h-20 stroke-amber-200/40 fill-none" viewBox="0 0 1000 70" preserveAspectRatio="none">
          <path d="M 0,15 Q 250,55 500,20 Q 750,55 1000,15" strokeWidth="1.5" strokeDasharray="4 2" />
        </svg>

        {/* Hanging party flags container */}
        <div className="absolute top-0 inset-x-3 sm:inset-x-12 flex justify-between items-start">
          {flags.map((flag, idx) => (
            <div
              key={idx}
              className="animate-flag-sway origin-top"
              style={{ animationDelay: `${idx * 0.18}s` }}
            >
              <svg 
                className="w-4 sm:w-6 md:w-8 h-6 sm:h-9 md:h-11 filter drop-shadow-md" 
                viewBox="0 0 30 40"
              >
                <polygon 
                  points="0,0 30,0 15,38" 
                  fill={flag.color} 
                  opacity="0.92"
                />
                {/* Gold stitch line */}
                <line x1="0" y1="2" x2="30" y2="2" stroke="#FEF08A" strokeWidth="1.5" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Twinkling Fairy Light Festoon String */}
      <div className="absolute top-12 sm:top-16 inset-x-0 h-8 pointer-events-none z-16 flex justify-around items-center px-4 sm:px-12">
        {fairyLights.map((bulb) => (
          <div
            key={bulb.id}
            className="flex flex-col items-center"
            style={{
              animation: `fairyTwinkle ${bulb.duration} ease-in-out infinite`,
              animationDelay: bulb.delay,
            }}
          >
            {/* Socket base */}
            <div className="w-1 h-1 bg-stone-800 rounded-xs" />
            {/* Glowing teardrop bulb */}
            <div
              className="w-2.5 sm:w-3.5 h-3.5 sm:h-4.5 rounded-full shadow-lg"
              style={{
                backgroundColor: bulb.color,
                boxShadow: `0 0 10px ${bulb.color}, 0 0 20px ${bulb.color}`,
              }}
            />
          </div>
        ))}
      </div>

      {/* 5. Left Flank Grand Balloon Arch Column (Fixed on Left Edge, Non-Intrusive) */}
      <div className="absolute top-20 sm:top-24 left-1 sm:left-3 md:left-6 lg:left-8 bottom-6 w-20 sm:w-28 md:w-36 lg:w-44 pointer-events-auto z-15 hidden sm:flex flex-col items-center justify-start animate-balloon-float-l scale-90 md:scale-100 origin-top-left">
        
        {/* Crown Star Foil Balloon */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: 10 }}
          onClick={handleBalloonClick}
          className="cursor-pointer mb-2 filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.5)]"
          title="Click to pop celebration confetti!"
        >
          <span className="text-3xl sm:text-4xl md:text-5xl select-none">⭐</span>
        </motion.div>

        {/* Dense Metallic Balloon Cluster */}
        <div className="relative w-full h-[420px]">
          {/* Balloon 1 - Chrome Gold */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-0 left-2 w-14 sm:w-18 md:w-20 h-18 sm:h-22 md:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-100 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-amber-200/50"
          >
            <div className="absolute top-2.5 left-3.5 w-3.5 h-5 rounded-full bg-white/60 blur-[1px]" />
          </div>

          {/* Balloon 2 - Rose Gold Pearl */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-10 right-0 w-16 sm:w-20 md:w-22 h-20 sm:h-24 md:h-26 rounded-full bg-gradient-to-tr from-rose-700 via-pink-500 to-rose-200 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-rose-300/40"
          >
            <div className="absolute top-3.5 left-3.5 w-3.5 h-6 rounded-full bg-white/60 blur-[1px]" />
          </div>

          {/* Balloon 3 - Deep Metallic Purple */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-28 left-0 w-14 sm:w-18 md:w-20 h-18 sm:h-22 md:h-24 rounded-full bg-gradient-to-tr from-purple-900 via-purple-600 to-purple-200 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-purple-300/40"
          >
            <div className="absolute top-2.5 left-3.5 w-3.5 h-5 rounded-full bg-white/60 blur-[1px]" />
          </div>

          {/* Balloon 4 - Ruby Shimmer */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-44 right-1 w-16 sm:w-20 md:w-22 h-20 sm:h-24 md:h-26 rounded-full bg-gradient-to-tr from-red-800 via-rose-500 to-pink-100 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-rose-200/50"
          >
            <div className="absolute top-3.5 left-3.5 w-3.5 h-6 rounded-full bg-white/60 blur-[1px]" />
          </div>

          {/* Balloon 5 - Pearl White */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-60 left-2 w-14 sm:w-18 md:w-20 h-18 sm:h-22 md:h-24 rounded-full bg-gradient-to-tr from-slate-400 via-slate-100 to-white shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-white"
          >
            <div className="absolute top-2.5 left-3.5 w-3.5 h-5 rounded-full bg-white/80 blur-[1px]" />
          </div>

          {/* Curling Golden Ribbon Streamers */}
          <svg className="absolute top-72 left-4 w-14 h-40 stroke-amber-400 fill-none opacity-80" viewBox="0 0 60 180">
            <path d="M 20,0 Q 40,30 20,60 Q 5,90 25,120 Q 45,150 20,180" strokeWidth="2" />
            <path d="M 35,0 Q 15,30 35,60 Q 55,90 35,120 Q 15,150 35,180" strokeWidth="1.5" stroke="#F43F5E" />
          </svg>
        </div>

        {/* Stage Gift Box at Left Column Base */}
        <div className="mt-auto hidden md:block">
          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 border border-amber-300 shadow-xl flex items-center justify-center">
            {/* Satin Ribbon cross */}
            <div className="absolute inset-x-0 h-2.5 bg-amber-400 top-1/2 -translate-y-1/2 shadow-xs" />
            <div className="absolute inset-y-0 w-2.5 bg-amber-400 left-1/2 -translate-x-1/2 shadow-xs" />
            {/* Top Bow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl select-none">
              🎀
            </div>
          </div>
        </div>
      </div>

      {/* 6. Right Flank Grand Balloon Arch Column (Fixed on Right Edge, Non-Intrusive) */}
      <div className="absolute top-20 sm:top-24 right-1 sm:right-3 md:right-6 lg:right-8 bottom-6 w-20 sm:w-28 md:w-36 lg:w-44 pointer-events-auto z-15 hidden sm:flex flex-col items-center justify-start animate-balloon-float-r scale-90 md:scale-100 origin-top-right">
        
        {/* Crown Foil Heart Balloon */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: -10 }}
          onClick={handleBalloonClick}
          className="cursor-pointer mb-2 filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.5)]"
          title="Click to pop celebration confetti!"
        >
          <span className="text-3xl sm:text-4xl md:text-5xl select-none">💖</span>
        </motion.div>

        {/* Dense Metallic Balloon Cluster */}
        <div className="relative w-full h-[420px]">
          {/* Balloon 1 - Rose Gold */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-0 right-1 w-16 sm:w-20 md:w-22 h-20 sm:h-24 md:h-26 rounded-full bg-gradient-to-tr from-rose-700 via-pink-500 to-rose-200 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-rose-300/40"
          >
            <div className="absolute top-3.5 left-3.5 w-3.5 h-6 rounded-full bg-white/60 blur-[1px]" />
          </div>

          {/* Balloon 2 - Chrome Gold */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-12 left-0 w-14 sm:w-18 md:w-20 h-18 sm:h-22 md:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-100 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-amber-200/50"
          >
            <div className="absolute top-2.5 left-3.5 w-3.5 h-5 rounded-full bg-white/60 blur-[1px]" />
          </div>

          {/* Balloon 3 - Electric Violet */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-28 right-0 w-15 sm:w-19 md:w-21 h-19 sm:h-23 md:h-25 rounded-full bg-gradient-to-tr from-purple-900 via-purple-600 to-purple-200 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-purple-300/40"
          >
            <div className="absolute top-2.5 left-3.5 w-3.5 h-5 rounded-full bg-white/60 blur-[1px]" />
          </div>

          {/* Balloon 4 - Pearl White */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-44 left-1 w-14 sm:w-18 md:w-20 h-18 sm:h-22 md:h-24 rounded-full bg-gradient-to-tr from-slate-400 via-slate-100 to-white shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-white"
          >
            <div className="absolute top-2.5 left-3.5 w-3.5 h-5 rounded-full bg-white/80 blur-[1px]" />
          </div>

          {/* Balloon 5 - Metallic Ruby */}
          <div 
            onClick={handleBalloonClick}
            className="absolute top-60 right-1 w-16 sm:w-20 md:w-22 h-20 sm:h-24 md:h-26 rounded-full bg-gradient-to-tr from-red-800 via-rose-500 to-pink-100 shadow-[0_10px_20px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-105 transition-transform border border-rose-200/50"
          >
            <div className="absolute top-3.5 left-3.5 w-3.5 h-6 rounded-full bg-white/60 blur-[1px]" />
          </div>

          {/* Curling Golden Ribbon Streamers */}
          <svg className="absolute top-72 right-4 w-14 h-40 stroke-amber-400 fill-none opacity-80" viewBox="0 0 60 180">
            <path d="M 40,0 Q 20,30 40,60 Q 55,90 35,120 Q 15,150 40,180" strokeWidth="2" />
            <path d="M 25,0 Q 45,30 25,60 Q 5,90 25,120 Q 45,150 25,180" strokeWidth="1.5" stroke="#A855F7" />
          </svg>
        </div>

        {/* Stage Gift Box at Right Column Base */}
        <div className="mt-auto hidden md:block">
          <div className="relative w-14 h-14 rounded-xl bg-gradient-to-tr from-purple-700 to-purple-500 border border-amber-300 shadow-xl flex items-center justify-center">
            {/* Satin Ribbon cross */}
            <div className="absolute inset-x-0 h-2.5 bg-amber-400 top-1/2 -translate-y-1/2 shadow-xs" />
            <div className="absolute inset-y-0 w-2.5 bg-amber-400 left-1/2 -translate-x-1/2 shadow-xs" />
            {/* Top Bow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl select-none">
              🎀
            </div>
          </div>
        </div>
      </div>

      {/* 7. Stage Floor Footlights Rim along Bottom (Fixed at Screen Bottom) */}
      <div className="absolute bottom-0 inset-x-0 h-8 pointer-events-none z-10 flex flex-col justify-end">
        {/* Footlights Glow along stage floor */}
        <div className="w-full h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-purple-500 shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
      </div>

    </div>
  );
};
