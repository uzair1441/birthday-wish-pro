// Real Birthday Audio Engine with 5 downloaded real audio tracks and Web Audio SFX
// 100% self-contained in local /public/audio/ files, no external network dependencies

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
    fileUrl: '/audio/birthday-classic.mp3'
  },
  {
    id: 'birthday-kids',
    name: 'Kids Happy Birthday Wish (Rhyme)',
    genre: 'Bachon Ki Pyari Birthday Wish',
    desc: 'Sweet, gentle kids rhyme: "Happy Birthday to you, Happy Birthday dear little one..."',
    icon: '👶',
    fileUrl: '/audio/birthday-kids.mp3'
  },
  {
    id: 'birthday-funzoa',
    name: 'Happy Birthday To You Ji (Teddy & Mimi)',
    genre: 'Fun Birthday Anthem',
    desc: 'Famous viral birthday song: "Happy Birthday to you ji, cake ka tukda khao ji!"',
    icon: '🧸',
    fileUrl: '/audio/birthday-funzoa.mp3'
  },
  {
    id: 'birthday-celebration',
    name: 'Joyful Party Anthem (Baar Baar Din)',
    genre: 'Festive Classic',
    desc: 'Legendary celebratory birthday anthem "Baar Baar Yeh Din Aaye"',
    icon: '🥳',
    fileUrl: '/audio/birthday-celebration.mp3'
  },
  {
    id: 'birthday-party-anthem',
    name: 'Grand Celebration Party Beat',
    genre: 'Party Dance Beat',
    desc: 'Vibrant celebratory party track with horns, confetti beats, and birthday cheer',
    icon: '🎉',
    fileUrl: '/audio/birthday-party-anthem.mp3'
  }
];

// Helper to map legacy and new track IDs to real audio file paths
const TRACK_MAP: Record<string, string> = {
  'birthday-classic': '/audio/birthday-classic.mp3',
  'happy-birthday-classic': '/audio/birthday-classic.mp3',
  'birthday-kids': '/audio/birthday-kids.mp3',
  'birthday-piano': '/audio/birthday-kids.mp3',
  'music-box-lullaby': '/audio/birthday-kids.mp3',
  'birthday-funzoa': '/audio/birthday-funzoa.mp3',
  'birthday-pop': '/audio/birthday-funzoa.mp3',
  'party-celebration': '/audio/birthday-funzoa.mp3',
  'birthday-celebration': '/audio/birthday-celebration.mp3',
  'royal-fanfare': '/audio/birthday-celebration.mp3',
  'birthday-party-anthem': '/audio/birthday-party-anthem.mp3',
  'birthday-romantic': '/audio/birthday-party-anthem.mp3',
  'acoustic-warm': '/audio/birthday-party-anthem.mp3'
};

class BirthdayAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlayingMelody: boolean = false;
  private currentTrackId: string = '';
  private isMuted: boolean = false;
  private ctx: AudioContext | null = null;

  private initAudioContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  }

  public getIsPlaying(): boolean {
    return this.isPlayingMelody;
  }

  public getCurrentTrack(): string {
    return this.currentTrackId;
  }

  // Play a real downloaded Happy Birthday song
  public playTrack(trackId: string, loop: boolean = true) {
    if (trackId === 'silent') {
      this.stopMelody();
      this.currentTrackId = 'silent';
      return;
    }

    const fileUrl = TRACK_MAP[trackId] || '/audio/birthday-classic.mp3';

    // If same track is already playing, do not restart
    if (this.isPlayingMelody && this.currentTrackId === trackId && this.audioElement && !this.audioElement.paused) {
      return;
    }

    this.stopMelody();
    this.currentTrackId = trackId;

    try {
      const audio = new Audio(fileUrl);
      audio.loop = loop;
      audio.muted = this.isMuted;
      audio.volume = 0.85;

      audio.onplay = () => {
        this.isPlayingMelody = true;
      };

      audio.onpause = () => {
        this.isPlayingMelody = false;
      };

      audio.onended = () => {
        if (!loop) {
          this.isPlayingMelody = false;
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Audio autoplay prevented or error, will retry on user gesture:', err);
          this.isPlayingMelody = false;
        });
      }

      this.audioElement = audio;
    } catch (e) {
      console.warn('Could not initialize audio element:', e);
      this.isPlayingMelody = false;
    }
  }

  public stopMelody() {
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {
        // Ignore pause errors
      }
      this.audioElement = null;
    }
    this.isPlayingMelody = false;
  }

  public stop() {
    this.stopMelody();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Web Audio Tone Synthesis for crisp UI sound effects
  private playTone(freq: number, duration: number = 0.3, type: OscillatorType = 'sine', startTimeOffset: number = 0, volume: number = 0.3) {
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
      // Ignore synth errors
    }
  }

  // SFX: Cake Cutting Sound Effect
  public playCakeCut() {
    if (this.isMuted) return;
    this.initAudioContext();
    if (!this.ctx) return;

    try {
      // Whoosh knife slice
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

    // Celebratory slice chime
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
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch {
      // Fallback
    }

    this.playTone(523.25, 0.2, 'triangle', 0.04, 0.2);
  }

  // SFX: Gift Card Unwrap & Chimes
  public playGiftUnwrap() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.45, 'sine', idx * 0.08, 0.3);
      this.playTone(freq * 1.5, 0.25, 'triangle', idx * 0.08 + 0.02, 0.12);
    });
  }

  // SFX: Fanfare celebration
  public playCelebrationFanfare() {
    const chord = [440, 554.37, 659.25, 880];
    chord.forEach((freq) => {
      this.playTone(freq, 0.7, 'triangle', 0, 0.25);
    });
  }

  // SFX: Standard button click
  public playClick() {
    this.playTone(800, 0.06, 'sine', 0, 0.15);
  }
}

export const soundManager = new BirthdayAudioEngine();
