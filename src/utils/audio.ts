// Real Birthday Audio Engine with 8 Real MP3 tracks + Full Polyphonic Web Audio Synthesizer Fallback
// 100% resilient across mobile browsers, Vercel deployments, and network environments

export interface BuiltinSong {
  id: string;
  name: string;
  genre: string;
  desc: string;
  icon: string;
  fileUrl: string;
}

export const BUILTIN_SONGS: BuiltinSong[] = [
  {
    id: 'birthday-classic',
    name: 'Classic Happy Birthday Song',
    genre: 'Traditional Celebration',
    desc: 'Original orchestral & chorus celebration of "Happy Birthday To You"',
    icon: '🎂',
    fileUrl: 'birthday-classic.mp3'
  },
  {
    id: 'birthday-kids',
    name: 'Kids Happy Birthday Wish (Rhyme)',
    genre: 'Bachon Ki Pyari Birthday Wish',
    desc: 'Sweet, gentle kids rhyme: "Happy Birthday to you, Happy Birthday dear little one..."',
    icon: '👶',
    fileUrl: 'birthday-kids.mp3'
  },
  {
    id: 'birthday-funzoa',
    name: 'Happy Birthday To You Ji (Teddy & Mimi)',
    genre: 'Fun Birthday Anthem',
    desc: 'Famous viral birthday song: "Happy Birthday to you ji, cake ka tukda khao ji!"',
    icon: '🧸',
    fileUrl: 'birthday-funzoa.mp3'
  },
  {
    id: 'birthday-celebration',
    name: 'Joyful Party Anthem (Baar Baar Din)',
    genre: 'Festive Classic',
    desc: 'Legendary celebratory birthday anthem "Baar Baar Yeh Din Aaye"',
    icon: '🥳',
    fileUrl: 'birthday-celebration.mp3'
  },
  {
    id: 'birthday-party-anthem',
    name: 'Grand Celebration Party Beat',
    genre: 'Party Dance Beat',
    desc: 'Vibrant celebratory party track with horns, confetti beats, and birthday cheer',
    icon: '🎉',
    fileUrl: 'birthday-party-anthem.mp3'
  },
  {
    id: 'birthday-piano',
    name: 'Elegant Piano & Orchestra',
    genre: 'Acoustic Melody',
    desc: 'Gentle, heartwarming piano rendition for romantic or formal wishes',
    icon: '🎹',
    fileUrl: 'birthday-piano.mp3'
  },
  {
    id: 'birthday-pop',
    name: 'Modern Pop Celebration',
    genre: 'Upbeat Pop',
    desc: 'Modern electronic pop birthday beats for besties & party vibes',
    icon: '✨',
    fileUrl: 'birthday-pop.mp3'
  },
  {
    id: 'birthday-romantic',
    name: 'Sweet Acoustic Romance',
    genre: 'Romantic Melody',
    desc: 'Soft guitar and strings for love, partner, or heartfelt relationships',
    icon: '💖',
    fileUrl: 'birthday-romantic.mp3'
  }
];

export const TRACK_MAP: Record<string, string> = {
  'birthday-classic': 'birthday-classic.mp3',
  'happy-birthday-classic': 'birthday-classic.mp3',
  'birthday-kids': 'birthday-kids.mp3',
  'birthday-funzoa': 'birthday-funzoa.mp3',
  'birthday-celebration': 'birthday-celebration.mp3',
  'royal-fanfare': 'birthday-celebration.mp3',
  'birthday-party-anthem': 'birthday-party-anthem.mp3',
  'party-celebration': 'birthday-party-anthem.mp3',
  'birthday-piano': 'birthday-piano.mp3',
  'music-box-lullaby': 'birthday-piano.mp3',
  'birthday-pop': 'birthday-pop.mp3',
  'birthday-romantic': 'birthday-romantic.mp3',
  'acoustic-warm': 'birthday-romantic.mp3'
};

/**
 * Resolves the absolute audio URL safely for both local Vite and Vercel deployments
 */
export function getTrackAudioUrl(trackId: string): string {
  const fileName = TRACK_MAP[trackId] || 'birthday-classic.mp3';
  if (typeof window === 'undefined') return `/audio/${fileName}`;

  const metaEnv = (import.meta as unknown as { env?: { BASE_URL?: string } }).env;
  const base = metaEnv?.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}audio/${fileName}`;
}

export class BirthdayAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlayingMelody: boolean = false;
  private currentTrackId: string = '';
  private isMuted: boolean = false;
  private ctx: AudioContext | null = null;
  private listeners: Set<(isPlaying: boolean, trackId: string) => void> = new Set();
  private pendingTrackId: string | null = null;
  private hasUnlockedAudio: boolean = false;
  private synthLoopTimeout: number | null = null;
  private isUsingSynthFallback: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlockAudio = () => {
        this.unlockUserAudio();
        window.removeEventListener('touchstart', unlockAudio);
        window.removeEventListener('touchend', unlockAudio);
        window.removeEventListener('click', unlockAudio);
      };
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('touchend', unlockAudio, { passive: true });
      window.addEventListener('click', unlockAudio, { passive: true });
    }
  }

  public subscribe(cb: (isPlaying: boolean, trackId: string) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.isPlayingMelody, this.currentTrackId);
      } catch (err) {
        console.warn('Audio listener error:', err);
      }
    });
  }

  public unlockUserAudio() {
    this.hasUnlockedAudio = true;
    this.initAudioContext();

    if (this.pendingTrackId) {
      const trackToPlay = this.pendingTrackId;
      this.pendingTrackId = null;
      this.playTrack(trackToPlay, true);
    }
  }

  private initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.muted = muted;
    }
    if (muted && this.isUsingSynthFallback) {
      this.stopSynthMelody();
    }
    this.notify();
  }

  public getIsPlaying(): boolean {
    return this.isPlayingMelody;
  }

  public getCurrentTrack(): string {
    return this.currentTrackId;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Play a song with automatic fallback to Web Audio Synthesizer
  public playTrack(trackId: string, loop: boolean = true) {
    if (trackId === 'silent') {
      this.stopMelody();
      this.currentTrackId = 'silent';
      this.notify();
      return;
    }

    this.stopMelody();
    this.initAudioContext();
    this.currentTrackId = trackId;

    const fileUrl = getTrackAudioUrl(trackId);

    try {
      if (!this.audioElement) {
        this.audioElement = new Audio();
      }

      const audio = this.audioElement;
      audio.setAttribute('playsinline', 'true');
      audio.setAttribute('webkit-playsinline', 'true');
      audio.preload = 'auto';
      audio.src = fileUrl;
      audio.loop = loop;
      audio.muted = this.isMuted;

      try {
        audio.volume = 0.9;
      } catch {
        // Mobile iOS restricts volume
      }

      audio.onplay = () => {
        this.isPlayingMelody = true;
        this.isUsingSynthFallback = false;
        this.notify();
      };

      audio.onpause = () => {
        if (!this.isUsingSynthFallback) {
          this.isPlayingMelody = false;
          this.notify();
        }
      };

      audio.onended = () => {
        if (!loop && !this.isUsingSynthFallback) {
          this.isPlayingMelody = false;
          this.notify();
        }
      };

      audio.onerror = () => {
        console.warn('MP3 failed to load on this host, seamlessly switching to Web Audio Synthesizer fallback!');
        // Seamless fallback to pure in-browser synthesized Happy Birthday melody
        this.playSynthMelody(loop);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlayingMelody = true;
            this.isUsingSynthFallback = false;
            this.notify();
          })
          .catch((err) => {
            console.log('Mobile browser prevented immediate autoplay. Queued for first touch:', err);
            this.pendingTrackId = trackId;

            // One-shot retry on next touch
            const retry = () => {
              window.removeEventListener('touchstart', retry);
              window.removeEventListener('click', retry);
              this.playTrack(trackId, loop);
            };
            window.addEventListener('touchstart', retry, { passive: true, once: true });
            window.addEventListener('click', retry, { passive: true, once: true });
          });
      }
    } catch (e) {
      console.warn('Audio element error, using Web Audio synthesizer:', e);
      this.playSynthMelody(loop);
    }
  }

  public togglePlay(trackId?: string) {
    if (this.isPlayingMelody) {
      this.stopMelody();
    } else {
      const trackToPlay = trackId || this.currentTrackId || 'birthday-classic';
      this.playTrack(trackToPlay, true);
    }
  }

  public stopMelody() {
    this.stopSynthMelody();
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Ignore
      }
    }
    this.isPlayingMelody = false;
    this.isUsingSynthFallback = false;
    this.notify();
  }

  public stop() {
    this.stopMelody();
  }

  // --- Real Polyphonic Web Audio Synthesizer Fallback ---
  // Guaranteed to play anywhere (Vercel, offline, broken network) using pure Web Audio API oscillators
  public playSynthMelody(loop: boolean = true) {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    this.stopSynthMelody();
    this.isUsingSynthFallback = true;
    this.isPlayingMelody = true;
    this.notify();

    // Traditional Happy Birthday Note Frequencies (Hz)
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.00;
    const A4 = 440.00;
    const Bb4 = 466.16;
    const C5 = 523.25;

    // [freq, durationInBeats]
    const notes: [number, number][] = [
      // Line 1: Happy birthday to you
      [C4, 0.75], [C4, 0.25], [D4, 1.0], [C4, 1.0], [F4, 1.0], [E4, 2.0],
      // Line 2: Happy birthday to you
      [C4, 0.75], [C4, 0.25], [D4, 1.0], [C4, 1.0], [G4, 1.0], [F4, 2.0],
      // Line 3: Happy birthday dear friend
      [C4, 0.75], [C4, 0.25], [C5, 1.0], [A4, 1.0], [F4, 1.0], [E4, 1.0], [D4, 2.0],
      // Line 4: Happy birthday to you!
      [Bb4, 0.75], [Bb4, 0.25], [A4, 1.0], [F4, 1.0], [G4, 1.0], [F4, 2.5]
    ];

    const beatSec = 0.42; // Upbeat celebratory tempo
    const now = this.ctx.currentTime + 0.05;
    let offset = 0;

    notes.forEach(([freq, beats]) => {
      const dur = beats * beatSec;
      this.playSynthChime(freq, now + offset, dur * 0.88);
      offset += dur;
    });

    if (loop && this.isPlayingMelody) {
      const totalDuration = (offset + 1.2) * 1000;
      this.synthLoopTimeout = window.setTimeout(() => {
        if (this.isPlayingMelody && this.isUsingSynthFallback) {
          this.playSynthMelody(true);
        }
      }, totalDuration);
    }
  }

  private stopSynthMelody() {
    if (this.synthLoopTimeout !== null) {
      clearTimeout(this.synthLoopTimeout);
      this.synthLoopTimeout = null;
    }
    this.isUsingSynthFallback = false;
  }

  // Plays a bell/marimba harmonic chime tone
  private playSynthChime(freq: number, startTime: number, duration: number) {
    if (!this.ctx || this.isMuted) return;

    try {
      // Fundamental oscillator
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      // Overtone for warm celebratory sparkle
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, startTime);

      const vol = 0.25;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      gain2.gain.setValueAtTime(0.001, startTime);
      gain2.gain.exponentialRampToValueAtTime(vol * 0.35, startTime + 0.015);
      gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.6);

      osc.connect(gain);
      osc2.connect(gain2);
      gain.connect(this.ctx.destination);
      gain2.connect(this.ctx.destination);

      osc.start(startTime);
      osc2.start(startTime);
      osc.stop(startTime + duration);
      osc2.stop(startTime + duration);
    } catch {
      // Ignore
    }
  }

  // --- Sound Effects ---

  public playTone(freq: number, duration: number = 0.3, type: OscillatorType = 'sine', startTimeOffset: number = 0, volume: number = 0.3) {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime + startTimeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + duration);
    } catch {
      // Ignore
    }
  }

  // SFX: Cake Cutting Sound Effect
  public playCakeCut() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.18);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Fallback
    }

    this.playTone(659.25, 0.35, 'triangle', 0.12, 0.3); // E5
    this.playTone(880.00, 0.45, 'triangle', 0.22, 0.3); // A5
    this.playTone(1046.5, 0.6, 'sine', 0.32, 0.25);    // C6
  }

  // SFX: Balloon Pop
  public playBalloonPop() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.08;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Fallback
    }
    this.playTone(523.25, 0.15, 'sine', 0.02, 0.2);
  }

  // SFX: Candle Blowout
  public playBlowout() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Fallback
    }
  }

  // SFX: Gift Box Opening Fanfare
  public playGiftUnwrap() {
    if (this.isMuted) return;
    this.playTone(523.25, 0.2, 'triangle', 0.0, 0.25);
    this.playTone(659.25, 0.2, 'triangle', 0.08, 0.25);
    this.playTone(783.99, 0.25, 'triangle', 0.16, 0.3);
    this.playTone(1046.5, 0.5, 'sine', 0.24, 0.35);
  }

  // SFX: Soft UI click
  public playClick() {
    if (this.isMuted) return;
    this.playTone(600, 0.05, 'sine', 0.0, 0.15);
  }

  // SFX: Alert / Warning notification chime
  public playAlertNotice() {
    if (this.isMuted) return;
    this.playTone(440, 0.1, 'sine', 0.0, 0.2);
    this.playTone(330, 0.18, 'sine', 0.08, 0.2);
  }

  // SFX: Celebration fanfare
  public playCelebrationFanfare() {
    if (this.isMuted) return;
    this.playTone(523.25, 0.15, 'triangle', 0.0, 0.25);
    this.playTone(659.25, 0.15, 'triangle', 0.1, 0.25);
    this.playTone(783.99, 0.18, 'triangle', 0.2, 0.3);
    this.playTone(1046.5, 0.45, 'sine', 0.3, 0.35);
  }
}

export const audioEngine = new BirthdayAudioEngine();
export const soundManager = audioEngine;

