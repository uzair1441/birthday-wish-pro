import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BirthdayWishData, ThemeId, MusicTrackId } from '../../types';
import { THEME_OPTIONS } from '../../data/presets';
import { soundManager, BUILTIN_SONGS } from '../../utils/audio';
import { Play, Square, Check, Music } from 'lucide-react';
import { CuteBabySticker } from '../CuteBabySticker';

interface StepThemeMusicProps {
  data: BirthdayWishData;
  onChange: (updates: Partial<BirthdayWishData>) => void;
}

const PARTICLE_OPTIONS = [
  { id: 'balloons', label: 'Floating Balloons', icon: '🎈' },
  { id: 'confetti', label: 'Confetti Showers', icon: '🎉' },
  { id: 'stars', label: 'Magic Star Dust', icon: '⭐' },
  { id: 'hearts', label: 'Heart Sparkles', icon: '💖' }
];

export const StepThemeMusic: React.FC<StepThemeMusicProps> = ({ data, onChange }) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  const togglePlayTrack = (trackId: string) => {
    if (playingTrackId === trackId) {
      soundManager.stopMelody();
      setPlayingTrackId(null);
    } else {
      soundManager.playTrack(trackId, true);
      setPlayingTrackId(trackId);
    }
  };

  const handleSelectTrack = (trackId: string) => {
    soundManager.playClick();
    onChange({ musicTrack: trackId as MusicTrackId });
  };

  const handleParticleToggle = (particleId: 'balloons' | 'confetti' | 'stars' | 'hearts') => {
    soundManager.playClick();
    const current = data.particles || [];
    if (current.includes(particleId)) {
      onChange({ particles: current.filter(p => p !== particleId) });
    } else {
      onChange({ particles: [...current, particleId] });
    }
  };

  return (
    <div id="step-theme-music-container" className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-5 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-2">
            <span>🎵</span>
            <span>Studio Soundtrack & Lighting</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-serif">
            Step 3: Background Birthday Music & Theme
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audition 5 authentic birthday songs, choose your favorite track, and set the celebration atmosphere.
          </p>
        </div>
        <div className="hidden sm:block">
          <div className="p-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] shadow-inner">
            <CuteBabySticker id="chibi-dance" size={54} />
          </div>
        </div>
      </div>

      {/* 5 Built-in Songs (Directly playable & selectable) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Music className="w-4 h-4 text-amber-400" />
            <span>Select Birthday Soundtrack (5 Real Songs):</span>
          </label>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/25 font-mono">
            TAP ▶ TO AUDITION
          </span>
        </div>

        <div className="space-y-2.5">
          {BUILTIN_SONGS.map((song) => {
            const isSelected = data.musicTrack === song.id;
            const isPlaying = playingTrackId === song.id;

            return (
              <motion.div
                key={song.id}
                id={`song-card-${song.id}`}
                whileHover={{ scale: 1.015, x: 4 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectTrack(song.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-rose-500/20 border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-purple-500/15'
                    : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 text-slate-300 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 ${
                    isSelected ? 'bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 shadow-md' : 'bg-white/[0.06] border border-white/[0.1]'
                  }`}>
                    {song.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-bold truncate ${isSelected ? 'text-amber-200' : 'text-white'}`}>
                        {song.name}
                      </p>
                      <span className="text-[10px] font-semibold text-amber-300/90 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                        {song.genre}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30 animate-pop-in">
                          Active
                        </span>
                      )}
                      {isPlaying && (
                        <span className="flex items-end gap-0.5 h-3.5 ml-1">
                          <span className="w-0.5 h-2 bg-rose-400 animate-pulse" />
                          <span className="w-0.5 h-3.5 bg-amber-400 animate-pulse" />
                          <span className="w-0.5 h-1.5 bg-rose-400 animate-pulse" />
                          <span className="w-0.5 h-3 bg-purple-400 animate-pulse" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{song.desc}</p>
                  </div>
                </div>

                {/* Preview Listen / Stop Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayTrack(song.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm ${
                      isPlaying
                        ? 'bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 shadow-md animate-pulse'
                        : 'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 border border-white/[0.1]'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-3 h-3 fill-current" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Audition</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Theme Atmosphere */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold text-slate-300 block">
          Visual Lighting Theme:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = data.theme === theme.id;
            return (
              <button
                key={theme.id}
                id={`theme-opt-${theme.id}`}
                type="button"
                onClick={() => onChange({ theme: theme.id })}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer overflow-hidden relative group active:scale-98 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-xl'
                    : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02]'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} opacity-70`} />
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{theme.name}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow">
                      <Check className="w-3 h-3 stroke-[3.5]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-semibold text-slate-300 block">
          Floating Celebration Effects:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PARTICLE_OPTIONS.map((item) => {
            const active = (data.particles || []).includes(item.id as any);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleParticleToggle(item.id as any)}
                className={`p-3.5 rounded-2xl border flex items-center gap-2.5 text-xs transition cursor-pointer active:scale-95 ${
                  active
                    ? 'bg-gradient-to-r from-rose-500/20 to-amber-500/20 border-rose-400 text-rose-200 font-semibold shadow-md'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
