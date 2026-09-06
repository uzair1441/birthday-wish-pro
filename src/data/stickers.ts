export interface CuteSticker {
  id: string;
  name: string;
  category: 'cute-animals' | 'sweets' | 'party' | 'love';
  fluentEmojiId: string;
  badge: string;
  animationClass: string;
  tagline: string;
}

export const CUTE_STICKERS: CuteSticker[] = [
  {
    id: 'kawaii-bear',
    name: 'Teddy Party Bear',
    category: 'cute-animals',
    fluentEmojiId: 'teddy-bear',
    badge: 'Cuddle',
    animationClass: 'animate-wiggle',
    tagline: 'Sending warm cuddles & smiles'
  },
  {
    id: 'party-kitty',
    name: 'Birthday Kitty',
    category: 'cute-animals',
    fluentEmojiId: 'partying-face',
    badge: 'Cheer',
    animationClass: 'animate-bounce',
    tagline: 'Ready to purr and celebrate'
  },
  {
    id: 'sweet-cupcake',
    name: 'Dancing Cupcake',
    category: 'sweets',
    fluentEmojiId: 'cupcake',
    badge: 'Sweet',
    animationClass: 'animate-wiggle',
    tagline: 'Extra frosting, extra joy'
  },
  {
    id: 'magic-star',
    name: 'Sparkle Star',
    category: 'party',
    fluentEmojiId: 'glowing-star',
    badge: 'Glow',
    animationClass: 'animate-pulse',
    tagline: 'May all your wishes shine'
  },
  {
    id: 'golden-crown',
    name: 'Royal Birthday Crown',
    category: 'party',
    fluentEmojiId: 'crown',
    badge: 'Royal',
    animationClass: 'animate-wiggle',
    tagline: 'For the birthday queen/king'
  },
  {
    id: 'party-popper-cute',
    name: 'Confetti Blast',
    category: 'party',
    fluentEmojiId: 'party-popper',
    badge: 'Pop!',
    animationClass: 'animate-bounce',
    tagline: 'Hip hip hooray!'
  },
  {
    id: 'balloon-bunch',
    name: 'Sky Balloon',
    category: 'party',
    fluentEmojiId: 'balloon',
    badge: 'Float',
    animationClass: 'animate-float-sway',
    tagline: 'Reaching for the stars'
  },
  {
    id: 'winged-heart',
    name: 'Sweet Love Ribbon',
    category: 'love',
    fluentEmojiId: 'heart-ribbon',
    badge: 'Love',
    animationClass: 'animate-float-slow',
    tagline: 'Wrapped with all our love'
  },
  {
    id: 'birthday-gift',
    name: 'Mystery Gift Box',
    category: 'party',
    fluentEmojiId: 'wrapped-gift',
    badge: 'Surprise',
    animationClass: 'animate-bounce',
    tagline: 'Tap to see what is inside'
  },
  {
    id: 'magic-sparkler',
    name: 'Fairy Sparkler',
    category: 'party',
    fluentEmojiId: 'sparkler',
    badge: 'Magic',
    animationClass: 'animate-pulse',
    tagline: 'Brightest wishes forever'
  },
  {
    id: 'shortcake-cute',
    name: 'Strawberry Bliss',
    category: 'sweets',
    fluentEmojiId: 'shortcake',
    badge: 'Yummy',
    animationClass: 'animate-wiggle',
    tagline: 'Sweetest slice for the sweetest soul'
  },
  {
    id: 'love-letter-cute',
    name: 'Heart Envelope',
    category: 'love',
    fluentEmojiId: 'love-letter',
    badge: 'Letter',
    animationClass: 'animate-float-slow',
    tagline: 'Secret heartfelt words'
  }
];
