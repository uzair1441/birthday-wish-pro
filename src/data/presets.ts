import { CakeOption, ThemeOption, PaymentAccountConfig } from '../types';

export const CAKE_OPTIONS: CakeOption[] = [
  {
    id: 'chocolate-fudge',
    name: 'Chocolate Fudge Cake',
    flavorNotes: 'Complete Whole Round Cake with Dark Chocolate Ganache & Curls',
    realCakeImageUrl: '/cakes/chocolate-fudge.jpg'
  },
  {
    id: 'vanilla-cream',
    name: 'Fresh Vanilla Cream Cake',
    flavorNotes: 'Complete Whole Round Cake with Pure White Buttercream Swirls',
    realCakeImageUrl: '/cakes/vanilla-cream.jpg'
  },
  {
    id: 'strawberry-cream',
    name: 'Strawberry Cream Cake',
    flavorNotes: 'Complete Whole Round Cake Topped with Fresh Whole Strawberries',
    realCakeImageUrl: '/cakes/strawberry-cream.jpg'
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet Royal Cake',
    flavorNotes: 'Complete Whole Round Cake with Rich Cream Cheese Frosting',
    realCakeImageUrl: '/cakes/red-velvet.jpg'
  },
  {
    id: 'black-forest',
    name: 'Black Forest Cherry Cake',
    flavorNotes: 'Complete Whole Round Cake with Dark Cherries & Chocolate Flakes',
    realCakeImageUrl: '/cakes/black-forest.jpg'
  }
];

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'midnight-magic',
    name: 'Midnight Stardust',
    lightingDesc: 'Deep Indigo & Violet Nebula with Cyan Stardust Spotlights',
    bgGradient: 'from-[#080318] via-[#170930] to-[#0a021a]',
    cardBg: 'bg-slate-900/85 border-purple-500/30 shadow-purple-950/60',
    accentColor: 'text-purple-400',
    textColor: 'text-purple-200',
    spotlightLeft: 'from-purple-500/40 via-indigo-600/20 to-transparent',
    spotlightRight: 'from-cyan-400/35 via-purple-600/15 to-transparent',
    ambientAura: 'rgba(168, 85, 247, 0.25)',
    floorGlow: 'rgba(99, 102, 241, 0.3)',
    curtainStop1: '#1e0c38',
    curtainStop2: '#35165f',
    curtainStop3: '#4c1d95',
    emoji: '🌌',
    fluentEmojiId: 'shooting-star'
  },
  {
    id: 'golden-glamour',
    name: 'Golden Glamour',
    lightingDesc: 'Imperial 24K Gold Warmth with Gilded Stage Spotlights',
    bgGradient: 'from-[#191003] via-[#291a05] to-[#120a02]',
    cardBg: 'bg-stone-900/85 border-amber-500/40 shadow-amber-950/60',
    accentColor: 'text-amber-400',
    textColor: 'text-amber-200',
    spotlightLeft: 'from-amber-300/45 via-yellow-500/25 to-transparent',
    spotlightRight: 'from-yellow-400/40 via-amber-600/20 to-transparent',
    ambientAura: 'rgba(245, 158, 11, 0.3)',
    floorGlow: 'rgba(251, 191, 36, 0.35)',
    curtainStop1: '#382205',
    curtainStop2: '#5c3909',
    curtainStop3: '#78350f',
    emoji: '👑',
    fluentEmojiId: 'crown'
  },
  {
    id: 'pastel-blossom',
    name: 'Pastel Blossom',
    lightingDesc: 'Soft Romantic Cherry Blossom & Petal Rose Quartz Glow',
    bgGradient: 'from-[#1c0512] via-[#2f0b20] to-[#17040f]',
    cardBg: 'bg-slate-900/85 border-pink-500/30 shadow-pink-950/60',
    accentColor: 'text-pink-400',
    textColor: 'text-pink-200',
    spotlightLeft: 'from-pink-300/40 via-rose-400/25 to-transparent',
    spotlightRight: 'from-rose-400/40 via-pink-500/20 to-transparent',
    ambientAura: 'rgba(244, 114, 182, 0.28)',
    floorGlow: 'rgba(251, 113, 133, 0.3)',
    curtainStop1: '#3d0c24',
    curtainStop2: '#61163a',
    curtainStop3: '#831843',
    emoji: '🌸',
    fluentEmojiId: 'sparkles'
  },
  {
    id: 'neon-party',
    name: 'Neon Party Vibe',
    lightingDesc: 'High-Voltage Cyber Cyan & Fluorescent Magenta Laser Lighting',
    bgGradient: 'from-[#03131c] via-[#081e2b] to-[#020d14]',
    cardBg: 'bg-slate-900/85 border-cyan-500/40 shadow-cyan-950/60',
    accentColor: 'text-cyan-400',
    textColor: 'text-cyan-200',
    spotlightLeft: 'from-cyan-400/50 via-teal-400/25 to-transparent',
    spotlightRight: 'from-fuchsia-500/50 via-purple-600/25 to-transparent',
    ambientAura: 'rgba(6, 182, 212, 0.3)',
    floorGlow: 'rgba(217, 70, 239, 0.35)',
    curtainStop1: '#082f49',
    curtainStop2: '#0e7490',
    curtainStop3: '#0891b2',
    emoji: '⚡',
    fluentEmojiId: 'party-popper'
  },
  {
    id: 'velvet-sunset',
    name: 'Velvet Sunset',
    lightingDesc: 'Rich Fiery Crimson, Sunset Amber & Candlelight Radiance',
    bgGradient: 'from-[#200606] via-[#360d0d] to-[#160404]',
    cardBg: 'bg-slate-900/85 border-orange-500/30 shadow-orange-950/60',
    accentColor: 'text-orange-400',
    textColor: 'text-orange-200',
    spotlightLeft: 'from-orange-400/45 via-amber-500/25 to-transparent',
    spotlightRight: 'from-rose-500/45 via-red-600/25 to-transparent',
    ambientAura: 'rgba(249, 115, 22, 0.3)',
    floorGlow: 'rgba(239, 68, 68, 0.35)',
    curtainStop1: '#450a0a',
    curtainStop2: '#7f1d1d',
    curtainStop3: '#991b1b',
    emoji: '🌅',
    fluentEmojiId: 'heart-ribbon'
  }
];

export const PRESET_MESSAGES = [
  {
    label: 'Best Friend Forever',
    headline: 'To My Absolute Favorite Human in the World!',
    message: 'Happy Birthday to the one who makes every ordinary day feel like an adventure! May this new chapter bring you endless laughs, late-night pizza runs, unforgettable road trips, and everything your heart desires. Cheers to another year of legendary memories together! 🥂✨'
  },
  {
    label: 'Romantic Love',
    headline: 'You Are My Forever Favorite Blessing 💖',
    message: 'Happy Birthday to the love of my life! Every moment spent with you is a treasure, and every smile of yours lights up my world. Thank you for being my rock, my warmth, and my biggest joy. May your birthday be as magical and wonderful as you are to me.'
  },
  {
    label: 'Family & Respect',
    headline: 'Wishing You Good Health, Peace & Endless Joy',
    message: 'Warmest birthday wishes to someone so deeply cherished! May God bless your journey with boundless health, peace of mind, prosperity, and sweet happiness. Thank you for your kindness, wisdom, and unconditional love. Have the most wonderful day!'
  },
  {
    label: 'Playful & Funny',
    headline: 'Aging Like Fine Cheese (A Little Smellier, Much Better)',
    message: 'Happy Birthday! Another year wiser, cooler, and definitely closer to needing a magnifier to read the menu! Don’t worry about how many candles are on the cake; we already alerted the local fire brigade. Have an epic birthday full of cake and no regrets!'
  }
];

export const DEFAULT_PAYMENT_CONFIG: PaymentAccountConfig = {
  feePkr: 300,
  easypaisa: {
    accountNumber: '0300-1234567',
    accountTitle: 'Birthday Wishes Official',
    instructions: 'Send Rs. 300 via Easypaisa App. Keep your 11-digit Transaction ID (TID) ready to paste below.'
  },
  sadapay: {
    accountNumber: '0300-1234567',
    accountTitle: 'Birthday Wishes Official',
    iban: 'PK12SADA0000001234567890',
    instructions: 'Send Rs. 300 to SadaPay wallet. Verify title before confirming transfer.'
  },
  bank: {
    bankName: 'Meezan Bank Limited',
    accountNumber: '0101-0102030405',
    accountTitle: 'Birthday Wishes Services',
    iban: 'PK45MEZN0001010102030405',
    branchCode: '0101'
  }
};
