export type CakeStyleId = 
  | 'chocolate-fudge'
  | 'vanilla-cream'
  | 'strawberry-cream'
  | 'red-velvet'
  | 'black-forest';

export type ThemeId = 'midnight-magic' | 'golden-glamour' | 'pastel-blossom' | 'neon-party' | 'velvet-sunset';

export type MusicTrackId = 
  | 'birthday-classic'
  | 'birthday-kids'
  | 'birthday-funzoa'
  | 'birthday-celebration'
  | 'birthday-party-anthem'
  | 'birthday-piano'
  | 'birthday-pop'
  | 'birthday-romantic'
  | 'happy-birthday-classic'
  | 'party-celebration'
  | 'music-box-lullaby'
  | 'acoustic-warm'
  | 'royal-fanfare'
  | 'silent';

export interface BirthdayWishData {
  id: string;
  recipientName: string;
  nickname?: string;
  age?: number;
  milestoneTitle?: string;
  senderName: string;
  relationship: string;
  birthdayDate?: string;
  
  // Real Cake Selection
  cakeStyle: CakeStyleId;
  
  // Atmosphere & Sound (5 Built-in reliable music tracks)
  theme: ThemeId;
  musicTrack: MusicTrackId;
  particles: ('balloons' | 'confetti' | 'stars' | 'hearts')[];
  selectedStickers?: string[];
  
  // Message & Memories
  headline: string;
  message: string;
  secretMessage?: string;
  photoUrl?: string;
  photoCaption?: string;
  
  // Interactive features enabled
  enableCutCake?: boolean;
  enablePopBalloons: boolean;
  enableUnwrapGift: boolean;
  enableConfettiPopper: boolean;
  
  // Metadata & Payment
  createdAt: number;
  isPaid: boolean;
  transactionId?: string;
}

export interface PaymentAccountConfig {
  feePkr: number;
  easypaisa: {
    accountNumber: string;
    accountTitle: string;
    instructions: string;
  };
  sadapay: {
    accountNumber: string;
    accountTitle: string;
    iban?: string;
    instructions: string;
  };
  bank: {
    bankName: string;
    accountNumber: string;
    accountTitle: string;
    iban: string;
    branchCode?: string;
  };
}

export interface CakeOption {
  id: CakeStyleId;
  name: string;
  flavorNotes: string;
  realCakeImageUrl: string;
}

export interface ThemeOption {
  id: ThemeId;
  name: string;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  textColor: string;
  emoji: string;
  fluentEmojiId?: string;
}
