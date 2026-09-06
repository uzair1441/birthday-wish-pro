export interface FluentEmoji {
  id: string;
  name: string;
  category: 'celebration' | 'sweets' | 'love' | 'magic' | 'fun';
  url: string;
  fallbackChar: string;
}

const BASE_URL = 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/';

export const FLUENT_3D_EMOJIS: Record<string, FluentEmoji> = {
  // Celebration
  'birthday-cake': {
    id: 'birthday-cake',
    name: 'Birthday Cake',
    category: 'sweets',
    url: `${BASE_URL}Birthday%20cake/3D/birthday_cake_3d.png`,
    fallbackChar: '🎂'
  },
  'party-popper': {
    id: 'party-popper',
    name: 'Party Popper',
    category: 'celebration',
    url: `${BASE_URL}Party%20popper/3D/party_popper_3d.png`,
    fallbackChar: '🎉'
  },
  'wrapped-gift': {
    id: 'wrapped-gift',
    name: 'Wrapped Gift',
    category: 'celebration',
    url: `${BASE_URL}Wrapped%20gift/3D/wrapped_gift_3d.png`,
    fallbackChar: '🎁'
  },
  'balloon': {
    id: 'balloon',
    name: 'Festive Balloon',
    category: 'celebration',
    url: `${BASE_URL}Balloon/3D/balloon_3d.png`,
    fallbackChar: '🎈'
  },
  'partying-face': {
    id: 'partying-face',
    name: 'Party Vibe',
    category: 'fun',
    url: `${BASE_URL}Partying%20face/3D/partying_face_3d.png`,
    fallbackChar: '🥳'
  },
  'star-struck': {
    id: 'star-struck',
    name: 'Starstruck',
    category: 'fun',
    url: `${BASE_URL}Star-struck/3D/star-struck_3d.png`,
    fallbackChar: '🤩'
  },
  'crown': {
    id: 'crown',
    name: 'Royal Crown',
    category: 'celebration',
    url: `${BASE_URL}Crown/3D/crown_3d.png`,
    fallbackChar: '👑'
  },
  'sparkles': {
    id: 'sparkles',
    name: 'Magic Sparkles',
    category: 'magic',
    url: `${BASE_URL}Sparkles/3D/sparkles_3d.png`,
    fallbackChar: '✨'
  },
  'sparkler': {
    id: 'sparkler',
    name: 'Sparkler Firework',
    category: 'celebration',
    url: `${BASE_URL}Sparkler/3D/sparkler_3d.png`,
    fallbackChar: '🎇'
  },
  'teddy-bear': {
    id: 'teddy-bear',
    name: 'Cute Teddy',
    category: 'love',
    url: `${BASE_URL}Teddy%20bear/3D/teddy_bear_3d.png`,
    fallbackChar: '🧸'
  },
  'heart-ribbon': {
    id: 'heart-ribbon',
    name: 'Heart Ribbon',
    category: 'love',
    url: `${BASE_URL}Heart%20with%20ribbon/3D/heart_with_ribbon_3d.png`,
    fallbackChar: '💝'
  },
  'love-letter': {
    id: 'love-letter',
    name: 'Love Letter',
    category: 'love',
    url: `${BASE_URL}Love%20letter/3D/love_letter_3d.png`,
    fallbackChar: '💌'
  },
  'smiling-hearts': {
    id: 'smiling-hearts',
    name: 'Smiling Hearts',
    category: 'love',
    url: `${BASE_URL}Smiling%20face%20with%20hearts/3D/smiling_face_with_hearts_3d.png`,
    fallbackChar: '🥰'
  },
  'red-heart': {
    id: 'red-heart',
    name: 'True Love',
    category: 'love',
    url: `${BASE_URL}Red%20heart/3D/red_heart_3d.png`,
    fallbackChar: '❤️'
  },
  'cupcake': {
    id: 'cupcake',
    name: 'Cupcake Delight',
    category: 'sweets',
    url: `${BASE_URL}Cupcake/3D/cupcake_3d.png`,
    fallbackChar: '🧁'
  },
  'shortcake': {
    id: 'shortcake',
    name: 'Strawberry Slice',
    category: 'sweets',
    url: `${BASE_URL}Shortcake/3D/shortcake_3d.png`,
    fallbackChar: '🍰'
  },
  'lollipop': {
    id: 'lollipop',
    name: 'Candy Swirl',
    category: 'sweets',
    url: `${BASE_URL}Lollipop/3D/lollipop_3d.png`,
    fallbackChar: '🍭'
  },
  'magic-wand': {
    id: 'magic-wand',
    name: 'Magic Wand',
    category: 'magic',
    url: `${BASE_URL}Magic%20wand/3D/magic_wand_3d.png`,
    fallbackChar: '🪄'
  },
  'glowing-star': {
    id: 'glowing-star',
    name: 'Golden Star',
    category: 'magic',
    url: `${BASE_URL}Glowing%20star/3D/glowing_star_3d.png`,
    fallbackChar: '🌟'
  },
  'shooting-star': {
    id: 'shooting-star',
    name: 'Wish Star',
    category: 'magic',
    url: `${BASE_URL}Shooting%20star/3D/shooting_star_3d.png`,
    fallbackChar: '🌠'
  },
  'gem-stone': {
    id: 'gem-stone',
    name: 'Precious Gem',
    category: 'celebration',
    url: `${BASE_URL}Gem%20stone/3D/gem_stone_3d.png`,
    fallbackChar: '💎'
  },
  'rainbow': {
    id: 'rainbow',
    name: 'Rainbow Joy',
    category: 'fun',
    url: `${BASE_URL}Rainbow/3D/rainbow_3d.png`,
    fallbackChar: '🌈'
  },
  'bottle-cork': {
    id: 'bottle-cork',
    name: 'Bubbly Toast',
    category: 'celebration',
    url: `${BASE_URL}Bottle%20with%20popping%20cork/3D/bottle_with_popping_cork_3d.png`,
    fallbackChar: '🍾'
  },
  'fire': {
    id: 'fire',
    name: 'Fiery Spark',
    category: 'fun',
    url: `${BASE_URL}Fire/3D/fire_3d.png`,
    fallbackChar: '🔥'
  },
  'musical-notes': {
    id: 'musical-notes',
    name: 'Celebration Tune',
    category: 'fun',
    url: `${BASE_URL}Musical%20notes/3D/musical_notes_3d.png`,
    fallbackChar: '🎶'
  }
};

export const STICKER_LIST: FluentEmoji[] = Object.values(FLUENT_3D_EMOJIS);

export const DEFAULT_STICKERS = [
  'party-popper',
  'balloon',
  'crown',
  'sparkles',
  'teddy-bear',
  'wrapped-gift'
];

export const REACTION_EMOJIS = [
  FLUENT_3D_EMOJIS['party-popper'],
  FLUENT_3D_EMOJIS['birthday-cake'],
  FLUENT_3D_EMOJIS['red-heart'],
  FLUENT_3D_EMOJIS['crown'],
  FLUENT_3D_EMOJIS['smiling-hearts'],
  FLUENT_3D_EMOJIS['sparkles']
];
