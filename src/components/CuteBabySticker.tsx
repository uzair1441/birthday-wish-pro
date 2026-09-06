import React from 'react';

export type CuteStickerId = 
  | 'peach-goma-kiss'
  | 'bubu-dudu-hug'
  | 'chibi-cake'
  | 'chibi-dance'
  | 'flying-kisses'
  | 'sleepy-cuddle'
  | 'party-celebrate'
  | 'love-gift';

export interface CuteStickerItem {
  id: CuteStickerId;
  name: string;
  tag: string;
}

export const CUTE_STICKER_LIST: CuteStickerItem[] = [
  { id: 'peach-goma-kiss', name: 'Sweet Kitten Kiss', tag: 'Kissing with Heart' },
  { id: 'bubu-dudu-hug', name: 'Cuddle Hug', tag: 'Tight Hug & Love' },
  { id: 'chibi-cake', name: 'Birthday Cake Baby', tag: 'Eating Cake' },
  { id: 'chibi-dance', name: 'Happy Dance', tag: 'Party Dancing' },
  { id: 'flying-kisses', name: 'Blowing Kisses', tag: 'Love Hearts' },
  { id: 'sleepy-cuddle', name: 'Sweet Cuddle', tag: 'Cozy Sleeping' },
  { id: 'party-celebrate', name: 'Confetti Popper', tag: 'Celebration' },
  { id: 'love-gift', name: 'Heart Gift', tag: 'Special Gift' }
];

interface CuteBabyStickerProps {
  id: string;
  size?: number;
  className?: string;
  animate?: boolean;
}

export const CuteBabySticker: React.FC<CuteBabyStickerProps> = ({
  id,
  size = 64,
  className = '',
  animate = true
}) => {
  const animClass = animate ? 'transition-transform duration-300 hover:scale-110' : '';

  switch (id) {
    case 'peach-goma-kiss':
      // The exact cute kittens kissing from user's image (Peach & Goma / Bubu & Dudu style!)
      return (
        <div 
          className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Beating Heart above heads */}
            <g className={animate ? "animate-pulse origin-center" : ""}>
              <path
                d="M 60 22 C 57 14, 46 14, 46 24 C 46 32, 60 41, 60 41 C 60 41, 74 32, 74 24 C 74 14, 63 14, 60 22 Z"
                fill="#FF3366"
              />
            </g>

            {/* Left Gray Cat (Goma / Bubu style) */}
            <g className={animate ? "origin-bottom animate-wiggle-subtle" : ""}>
              {/* Cat Body */}
              <ellipse cx="44" cy="80" rx="22" ry="24" fill="#A8A29E" />
              {/* Head */}
              <ellipse cx="42" cy="56" rx="22" ry="19" fill="#A8A29E" />
              {/* Ears */}
              <path d="M 23 46 Q 20 28 32 38 Z" fill="#A8A29E" />
              <path d="M 26 44 Q 24 33 32 39 Z" fill="#FCA5A5" />
              <path d="M 52 40 Q 60 28 62 44 Z" fill="#A8A29E" />
              <path d="M 54 40 Q 59 32 60 43 Z" fill="#FCA5A5" />
              {/* Blushing Cheeks */}
              <circle cx="32" cy="62" r="4.5" fill="#F87171" opacity="0.85" />
              <circle cx="53" cy="62" r="4.5" fill="#F87171" opacity="0.85" />
              {/* Happy Kiss Eyes */}
              <path d="M 33 54 Q 37 51 40 54" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 46 54 Q 49 51 52 54" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Cute Open Mouth Kiss */}
              <ellipse cx="45" cy="62" rx="3" ry="4" fill="#E11D48" />
              {/* Little Arm reaching */}
              <path d="M 54 74 Q 65 72 63 80" stroke="#78716C" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              {/* Little Tail */}
              <path d="M 24 88 Q 14 84 18 74" stroke="#78716C" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </g>

            {/* Right White Cat (Peach / Dudu style) kissing */}
            <g className={animate ? "origin-bottom animate-wiggle-subtle-reverse" : ""}>
              {/* Cat Body */}
              <ellipse cx="78" cy="80" rx="22" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              {/* Head leaning into kiss */}
              <ellipse cx="74" cy="56" rx="22" ry="19" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
              {/* Ears */}
              <path d="M 64 42 Q 62 30 72 40 Z" fill="#FFFFFF" />
              <path d="M 66 41 Q 65 34 71 40 Z" fill="#FBCFE8" />
              <path d="M 88 43 Q 98 32 94 48 Z" fill="#FFFFFF" />
              <path d="M 89 44 Q 95 36 93 47 Z" fill="#FBCFE8" />
              {/* Blushing Cheek */}
              <circle cx="83" cy="62" r="4.5" fill="#F472B6" opacity="0.85" />
              {/* Loving Closed Eye */}
              <path d="M 72 54 Q 75 51 78 54" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Cute Kiss Snout touching */}
              <ellipse cx="63" cy="60" rx="2" ry="3" fill="#FB7185" />
              {/* Little White Tail */}
              <path d="M 98 86 Q 106 78 98 70" stroke="#CBD5E1" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      );

    case 'bubu-dudu-hug':
      // Cute couple hugging tightly with hearts
      return (
        <div 
          className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Floating Mini Hearts */}
            <path d="M 35 25 C 33 20, 26 20, 26 26 C 26 31, 35 36, 35 36 C 35 36, 44 31, 44 26 C 44 20, 37 20, 35 25 Z" fill="#FB7185" className="animate-bounce" />
            <path d="M 85 22 C 83 17, 76 17, 76 23 C 76 28, 85 33, 85 33 C 85 33, 94 28, 94 23 C 94 17, 87 17, 85 22 Z" fill="#F43F5E" className="animate-pulse" />

            {/* Back Teddy Bear (Brown) */}
            <circle cx="48" cy="62" r="24" fill="#B45309" />
            <circle cx="32" cy="46" r="8" fill="#B45309" />
            <circle cx="32" cy="46" r="4.5" fill="#FDE68A" />
            <circle cx="64" cy="46" r="8" fill="#B45309" />
            <circle cx="64" cy="46" r="4.5" fill="#FDE68A" />
            {/* Bear Face */}
            <ellipse cx="48" cy="65" rx="10" ry="7" fill="#FDE68A" />
            <circle cx="48" cy="63" r="3" fill="#451A03" />
            <path d="M 40 58 Q 43 55 45 58" stroke="#451A03" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 51 58 Q 53 55 56 58" stroke="#451A03" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Front White Cuddle Bunny/Kitty Hugging */}
            <ellipse cx="68" cy="74" rx="22" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <circle cx="70" cy="56" r="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            {/* Cheeks */}
            <circle cx="62" cy="60" r="4" fill="#FDA4AF" />
            <circle cx="78" cy="60" r="4" fill="#FDA4AF" />
            {/* Happy Closed Eyes */}
            <path d="M 64 54 Q 67 51 70 54" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M 73 54 Q 76 51 79 54" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Hugging Arms Wrapping Around Bear */}
            <path d="M 52 70 Q 36 68 44 78 Q 56 82 62 76" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
          </svg>
        </div>
      );

    case 'chibi-cake':
      // Cute baby kitten holding a birthday cake with candle
      return (
        <div 
          className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Party Cone Hat */}
            <polygon points="60,10 46,38 74,38" fill="#EC4899" />
            <circle cx="60" cy="10" r="4" fill="#FBBF24" />
            <path d="M 50 30 Q 60 25 70 30" stroke="#FDE047" strokeWidth="3" fill="none" />

            {/* Baby Kitty Head */}
            <ellipse cx="60" cy="56" rx="28" ry="23" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <path d="M 36 44 Q 30 26 46 36 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <path d="M 37 42 Q 33 32 44 38 Z" fill="#FBCFE8" />
            <path d="M 84 44 Q 90 26 74 36 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <path d="M 83 42 Q 87 32 76 38 Z" fill="#FBCFE8" />

            {/* Big Sparkling Kawaii Eyes */}
            <circle cx="48" cy="54" r="5" fill="#1E293B" />
            <circle cx="46" cy="52" r="2" fill="#FFFFFF" />
            <circle cx="72" cy="54" r="5" fill="#1E293B" />
            <circle cx="70" cy="52" r="2" fill="#FFFFFF" />
            {/* Rosy Cheeks */}
            <circle cx="42" cy="62" r="5" fill="#F43F5E" opacity="0.75" />
            <circle cx="78" cy="62" r="5" fill="#F43F5E" opacity="0.75" />
            {/* Smiling Mouth */}
            <path d="M 56 62 Q 60 66 64 62" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />

            {/* Cute Birthday Cake Plate Held in Paws */}
            <g className="animate-bounce">
              {/* Plate */}
              <ellipse cx="60" cy="100" rx="30" ry="6" fill="#CBD5E1" />
              {/* Cake Body */}
              <rect x="42" y="80" width="36" height="18" rx="4" fill="#F472B6" />
              {/* Whipped Cream Frosting */}
              <path d="M 40 80 Q 45 74 49 80 Q 54 74 59 80 Q 64 74 69 80 Q 74 74 79 80 L 80 84 L 40 84 Z" fill="#FFF1F2" />
              {/* Strawberry on top */}
              <circle cx="60" cy="74" r="4.5" fill="#E11D48" />
              {/* Glowing Candle */}
              <rect x="58" y="64" width="4" height="10" fill="#FDE047" rx="1" />
              <path d="M 60 56 Q 57 60 60 64 Q 63 60 60 56 Z" fill="#F97316" className="animate-pulse" />
            </g>
          </svg>
        </div>
      );

    case 'chibi-dance':
      // Cute dancing baby kitten with confetti
      return (
        <div 
          className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Flying Confetti */}
            <circle cx="25" cy="30" r="3" fill="#38BDF8" className="animate-ping" />
            <rect x="88" y="24" width="6" height="6" fill="#F59E0B" transform="rotate(45 91 27)" />
            <circle cx="95" cy="50" r="2.5" fill="#EC4899" />
            <circle cx="20" cy="70" r="3" fill="#10B981" />

            {/* Dancing Gray Cat */}
            <g className="animate-wiggle">
              <ellipse cx="60" cy="76" rx="20" ry="22" fill="#A8A29E" />
              <ellipse cx="60" cy="50" rx="24" ry="20" fill="#A8A29E" />
              {/* Ears */}
              <polygon points="40,36 34,18 48,28" fill="#A8A29E" />
              <polygon points="40,34 36,22 46,28" fill="#FCA5A5" />
              <polygon points="80,36 86,18 72,28" fill="#A8A29E" />
              <polygon points="80,34 84,22 74,28" fill="#FCA5A5" />
              {/* Starry Happy Eyes */}
              <path d="M 46 48 L 50 48 M 48 46 L 48 50" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 70 48 L 74 48 M 72 46 L 72 50" stroke="#292524" strokeWidth="2.5" strokeLinecap="round" />
              {/* Cheeks */}
              <circle cx="44" cy="54" r="4.5" fill="#F87171" />
              <circle cx="76" cy="54" r="4.5" fill="#F87171" />
              {/* Open Joyful Mouth */}
              <ellipse cx="60" cy="56" rx="5" ry="6" fill="#DC2626" />
              {/* Raised Dancing Arms */}
              <path d="M 42 70 Q 28 60 36 50" stroke="#78716C" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M 78 70 Q 92 60 84 50" stroke="#78716C" strokeWidth="6" strokeLinecap="round" fill="none" />
            </g>
          </svg>
        </div>
      );

    case 'flying-kisses':
      // Cute kitten blowing pink hearts
      return (
        <div 
          className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Stream of Floating Hearts */}
            <path d="M 85 30 C 83 25, 76 25, 76 31 C 76 36, 85 41, 85 41 C 85 41, 94 36, 94 31 C 94 25, 87 25, 85 30 Z" fill="#F43F5E" className="animate-bounce" />
            <path d="M 98 48 C 96 44, 90 44, 90 48 C 90 52, 98 56, 98 56 C 98 56, 106 52, 106 48 C 106 44, 100 44, 98 48 Z" fill="#FB7185" className="animate-ping" />

            {/* White Kitten in Profile Blowing Kiss */}
            <ellipse cx="48" cy="74" rx="22" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <ellipse cx="46" cy="52" rx="22" ry="19" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <polygon points="30,40 22,22 38,32" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="32,38 25,26 36,32" fill="#FBCFE8" />
            <polygon points="56,38 64,22 50,32" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="55,38 61,26 51,32" fill="#FBCFE8" />
            {/* Blushing cheek */}
            <circle cx="50" cy="58" r="5" fill="#FDA4AF" />
            {/* Wink and kiss face */}
            <path d="M 38 48 Q 42 45 46 48" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 52 48 L 56 50 L 52 52" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Kiss Pout */}
            <ellipse cx="66" cy="54" rx="3.5" ry="4" fill="#F43F5E" />
            {/* Paws blowing kiss */}
            <ellipse cx="64" cy="68" rx="6" ry="5" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          </svg>
        </div>
      );

    case 'party-celebrate':
      // Two cute baby cats popping party popper
      return (
        <div 
          className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Golden Star bursts */}
            <polygon points="60,14 63,22 72,23 65,29 68,37 60,32 52,37 55,29 48,23 57,22" fill="#FBBF24" className="animate-spin" style={{ animationDuration: '6s' }} />

            {/* Left Cat */}
            <circle cx="40" cy="65" r="18" fill="#A8A29E" />
            <polygon points="28,52 24,38 36,46" fill="#A8A29E" />
            <circle cx="34" cy="65" r="3.5" fill="#F87171" />
            <path d="M 34 58 Q 38 55 42 58" stroke="#292524" strokeWidth="2" fill="none" />

            {/* Right Cat */}
            <circle cx="80" cy="65" r="18" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="86,52 94,38 82,46" fill="#FFFFFF" />
            <circle cx="84" cy="65" r="3.5" fill="#F472B6" />
            <path d="M 76 58 Q 80 55 84 58" stroke="#334155" strokeWidth="2" fill="none" />

            {/* Party Popper Center */}
            <polygon points="60,60 50,86 70,86" fill="#F59E0B" />
            <path d="M 50 60 Q 60 52 70 60" stroke="#EF4444" strokeWidth="4" fill="none" />
            {/* Ribbons shooting out */}
            <path d="M 56 50 Q 50 36 44 26" stroke="#EC4899" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 64 50 Q 70 36 76 26" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
      );

    default:
      // Love Gift
      return (
        <div 
          className={`relative inline-flex items-center justify-center select-none ${animClass} ${className}`}
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
            {/* Baby Kitty Peeking over Gift */}
            <ellipse cx="60" cy="50" rx="22" ry="18" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <polygon points="44,38 38,22 50,32" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="44,36 40,26 48,32" fill="#FBCFE8" />
            <polygon points="76,38 82,22 70,32" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />
            <polygon points="76,36 80,26 72,32" fill="#FBCFE8" />
            <circle cx="50" cy="48" r="3.5" fill="#1E293B" />
            <circle cx="70" cy="48" r="3.5" fill="#1E293B" />
            <circle cx="44" cy="54" r="4" fill="#FDA4AF" />
            <circle cx="76" cy="54" r="4" fill="#FDA4AF" />

            {/* Red & Gold Heart Gift Box */}
            <rect x="36" y="66" width="48" height="42" rx="6" fill="#E11D48" />
            <rect x="32" y="60" width="56" height="10" rx="3" fill="#F43F5E" />
            {/* Gold Ribbon */}
            <rect x="56" y="60" width="8" height="48" fill="#FBBF24" />
            <rect x="36" y="82" width="48" height="8" fill="#FBBF24" />
            {/* Big Ribbon Bow */}
            <ellipse cx="52" cy="56" rx="7" ry="5" fill="#F59E0B" transform="rotate(-20 52 56)" />
            <ellipse cx="68" cy="56" rx="7" ry="5" fill="#F59E0B" transform="rotate(20 68 56)" />
            <circle cx="60" cy="57" r="4" fill="#D97706" />
          </svg>
        </div>
      );
  }
};
