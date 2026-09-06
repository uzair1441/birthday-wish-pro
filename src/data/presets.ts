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
    bgGradient: 'from-slate-950 via-purple-950 to-slate-900',
    cardBg: 'bg-slate-900/85 border-purple-500/20 shadow-purple-950/50',
    accentColor: 'text-purple-400',
    textColor: 'text-purple-200',
    emoji: '🌌',
    fluentEmojiId: 'shooting-star'
  },
  {
    id: 'golden-glamour',
    name: 'Golden Glamour',
    bgGradient: 'from-amber-950/90 via-slate-950 to-stone-900',
    cardBg: 'bg-stone-900/85 border-amber-500/30 shadow-amber-950/50',
    accentColor: 'text-amber-400',
    textColor: 'text-amber-200',
    emoji: '👑',
    fluentEmojiId: 'crown'
  },
  {
    id: 'pastel-blossom',
    name: 'Pastel Blossom',
    bgGradient: 'from-rose-950 via-slate-900 to-pink-950',
    cardBg: 'bg-slate-900/85 border-pink-500/20 shadow-pink-950/50',
    accentColor: 'text-pink-400',
    textColor: 'text-pink-200',
    emoji: '🌸',
    fluentEmojiId: 'sparkles'
  },
  {
    id: 'neon-party',
    name: 'Neon Party Vibe',
    bgGradient: 'from-cyan-950 via-slate-950 to-fuchsia-950',
    cardBg: 'bg-slate-900/85 border-cyan-500/30 shadow-cyan-950/50',
    accentColor: 'text-cyan-400',
    textColor: 'text-cyan-200',
    emoji: '⚡',
    fluentEmojiId: 'party-popper'
  },
  {
    id: 'velvet-sunset',
    name: 'Velvet Sunset',
    bgGradient: 'from-orange-950 via-red-950 to-slate-950',
    cardBg: 'bg-slate-900/85 border-orange-500/20 shadow-orange-950/50',
    accentColor: 'text-orange-400',
    textColor: 'text-orange-200',
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
