import { GiftBoxStyleId, SurpriseGiftId } from '../types';

export interface GiftBoxOption {
  id: GiftBoxStyleId;
  name: string;
  themeDesc: string;
  boxColor: string;
  ribbonColor: string;
  borderColor: string;
  accentBg: string;
  emoji: string;
}

export interface SurpriseGiftOption {
  id: SurpriseGiftId;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  stickerId: string;
  revealedGreeting: string;
  badge: string;
}

export const GIFT_BOX_OPTIONS: GiftBoxOption[] = [
  {
    id: 'royal-crimson',
    name: 'Royal Velvet Crimson',
    themeDesc: 'Deep velvet crimson with metallic gold silk ribbon & bow',
    boxColor: 'from-rose-900 via-red-950 to-rose-900',
    ribbonColor: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200',
    borderColor: 'border-amber-400/60',
    accentBg: 'bg-rose-500/20 text-rose-300',
    emoji: '🎁'
  },
  {
    id: 'midnight-gold',
    name: 'Midnight Galaxy & Gold',
    themeDesc: 'Obsidian black with floating starlight dust and pure 24K gold ribbon',
    boxColor: 'from-slate-900 via-purple-950 to-slate-950',
    ribbonColor: 'bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200',
    borderColor: 'border-yellow-400/60',
    accentBg: 'bg-amber-500/20 text-amber-300',
    emoji: '🌟'
  },
  {
    id: 'pastel-rose',
    name: 'Pastel Blossom Rosé',
    themeDesc: 'Blush pink elegance adorned with floral silk bow and pearls',
    boxColor: 'from-pink-900/90 via-rose-950 to-pink-900/90',
    ribbonColor: 'bg-gradient-to-r from-pink-300 via-rose-400 to-pink-200',
    borderColor: 'border-pink-400/60',
    accentBg: 'bg-pink-500/20 text-pink-300',
    emoji: '🌸'
  },
  {
    id: 'emerald-luxury',
    name: 'Imperial Emerald Crown',
    themeDesc: 'Jeweled deep emerald velvet with royal gilded lace ribbon',
    boxColor: 'from-emerald-950 via-teal-950 to-emerald-950',
    ribbonColor: 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200',
    borderColor: 'border-emerald-400/60',
    accentBg: 'bg-emerald-500/20 text-emerald-300',
    emoji: '💎'
  }
];

export const SURPRISE_GIFT_OPTIONS: SurpriseGiftOption[] = [
  {
    id: 'chocolates-roses',
    name: 'Ferrero Rocher & Red Roses Bouquet',
    tagline: 'Sweet luxury chocolates & fragrant fresh roses',
    description: 'A romantic assortment of crispy hazelnut chocolates paired with blooming red velvet roses.',
    emoji: '🍫🌹',
    stickerId: 'peach-goma-hug',
    revealedGreeting: 'A sweet bouquet of fresh red roses and royal hazelnut chocolates, sent with deepest affection!',
    badge: 'Sweet & Romantic'
  },
  {
    id: 'golden-trophy',
    name: '"World’s Best Person" Golden Trophy',
    tagline: 'Official golden lifetime honor award',
    description: 'A dazzling 24K golden trophy engraved: "Awarded to the most amazing, kindhearted, and irreplaceable human on earth."',
    emoji: '🏆✨',
    stickerId: 'chibi-celebrate',
    revealedGreeting: 'Congratulations! You are officially awarded the "World’s Best Person" Birthday Golden Trophy!',
    badge: 'Honor Award'
  },
  {
    id: 'treat-voucher',
    name: 'VIP Birthday Treat & Promise Pass',
    tagline: 'Special dinner or shopping treat on the sender!',
    description: 'An exclusive promise card redeemable for an unforgettable dinner, coffee date, or movie treat paid by the sender.',
    emoji: '🎟️🍕',
    stickerId: 'chibi-surprise',
    revealedGreeting: 'VIP Treat Pass Unlocked! Redeem your free dinner treat, dessert feast, or coffee date anytime on me!',
    badge: 'Real Promise'
  },
  {
    id: 'plush-teddy',
    name: 'Cuddly Plush Teddy & Infinite Hugs',
    tagline: 'Warmest bear hugs and endless cute smiles',
    description: 'A super soft chibi plush teddy bear holding a heart pillow, sending cozy birthday warmth and sweet cuddles.',
    emoji: '🧸💖',
    stickerId: 'bubu-dudu-hug',
    revealedGreeting: 'A giant fluffy bear hug sent straight to you to make you smile and feel cherished today and always!',
    badge: 'Cozy & Cute'
  },
  {
    id: 'wishing-jar',
    name: 'Magic Crystal Jar of 100 Blessings',
    tagline: 'Golden glow jar filled with infinite prayers',
    description: 'A celestial glowing crystal jar holding 100 golden origami stars, each carrying a sincere prayer for peace, health, and joy.',
    emoji: '✨🏺',
    stickerId: 'chibi-dance',
    revealedGreeting: 'May every single star in this wishing jar bring you health, peace, wealth, and boundless happiness this year!',
    badge: 'Heartfelt Prayers'
  }
];
