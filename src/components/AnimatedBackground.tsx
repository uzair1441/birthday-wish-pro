import React, { useMemo } from 'react';

export const AnimatedBackground: React.FC = () => {
  // Drifting celebration sparkles
  const stars = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: `${(i * 13 + 5) % 95}%`,
      top: `${(i * 19 + 7) % 92}%`,
      size: 2 + ((i * 3) % 4),
      delay: `${(i * 0.35) % 4}s`,
      duration: `${2.8 + ((i * 2) % 3.5)}s`,
      color: ['#FDE047', '#F43F5E', '#A855F7', '#38BDF8', '#34D399'][i % 5],
    }));
  }, []);

  // Hanging celebratory bunting flags for website background
  const flags = [
    '#F43F5E', '#F59E0B', '#8B5CF6', '#10B981', '#EC4899',
    '#38BDF8', '#EAB308', '#F43F5E', '#A855F7', '#06B6D4',
    '#F97316', '#EC4899', '#FBBF24', '#8B5CF6', '#10B981',
    '#F43F5E', '#38BDF8', '#F59E0B'
  ];

  // Overhead warm party festoon bulbs
  const bulbs = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    color: ['#FDE047', '#F43F5E', '#38BDF8', '#C084FC', '#4ADE80'][i % 5],
    delay: `${(i * 0.3) % 3}s`,
    duration: `${1.8 + (i % 3) * 0.5}s`,
  }));

  // Background floating helium balloon bouquets
  const backgroundBalloons = [
    { id: 1, left: '3%', top: '18%', color: 'from-amber-600 via-amber-400 to-amber-100', size: 'w-14 h-18', delay: '0s', duration: '7s' },
    { id: 2, left: '6%', top: '26%', color: 'from-rose-700 via-pink-500 to-rose-200', size: 'w-16 h-20', delay: '1s', duration: '6.5s' },
    { id: 3, left: '94%', top: '22%', color: 'from-purple-800 via-purple-500 to-purple-200', size: 'w-16 h-20', delay: '0.5s', duration: '7.5s' },
    { id: 4, left: '91%', top: '34%', color: 'from-amber-600 via-amber-400 to-amber-100', size: 'w-14 h-18', delay: '1.5s', duration: '6s' },
    { id: 5, left: '2%', top: '65%', color: 'from-purple-900 via-pink-600 to-rose-200', size: 'w-16 h-20', delay: '2s', duration: '8s' },
    { id: 6, left: '93%', top: '70%', color: 'from-rose-800 via-rose-500 to-pink-200', size: 'w-15 h-19', delay: '1.2s', duration: '7s' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-20 select-none">
      
      {/* 1. Dramatic Stage Spotlight Cones */}
      <div className="absolute -top-20 left-1/6 w-[450px] h-[750px] bg-gradient-to-b from-amber-300/10 via-rose-500/5 to-transparent transform -rotate-15 blur-3xl" />
      <div className="absolute -top-20 right-1/6 w-[450px] h-[750px] bg-gradient-to-b from-purple-400/10 via-amber-400/5 to-transparent transform rotate-15 blur-3xl" />

      {/* 2. Overhead Stage Curtains / Drapes Header Shimmer */}
      <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-rose-950/70 via-purple-950/40 to-transparent border-b border-amber-400/20" />

      {/* 3. Overhead Festive Party Bunting Garland (Pennant Flags across top) */}
      <div className="absolute top-0 inset-x-0 h-18 overflow-hidden opacity-85">
        <svg className="w-full h-14 stroke-amber-300/30 fill-none" viewBox="0 0 1000 50" preserveAspectRatio="none">
          <path d="M 0,10 Q 250,45 500,15 Q 750,45 1000,10" strokeWidth="1.2" strokeDasharray="3 2" />
        </svg>

        <div className="absolute top-0 inset-x-2 sm:inset-x-8 flex justify-between items-start">
          {flags.map((color, idx) => (
            <div 
              key={idx} 
              className="animate-flag-sway origin-top"
              style={{ animationDelay: `${idx * 0.15}s` }}
            >
              <svg className="w-3.5 sm:w-5 md:w-6 h-5 sm:h-7 md:h-8 filter drop-shadow-sm" viewBox="0 0 20 28">
                <polygon points="0,0 20,0 10,26" fill={color} opacity="0.85" />
                <line x1="0" y1="1.5" x2="20" y2="1.5" stroke="#FEF08A" strokeWidth="1" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Twinkling Fairy Lights Festoon along Header */}
      <div className="absolute top-10 sm:top-12 inset-x-0 h-8 flex justify-around items-center px-4 sm:px-10">
        {bulbs.map((b) => (
          <div
            key={b.id}
            className="flex flex-col items-center"
            style={{
              animation: `fairyTwinkle ${b.duration} ease-in-out infinite`,
              animationDelay: b.delay,
            }}
          >
            <div className="w-1 h-1 bg-stone-700 rounded-xs" />
            <div
              className="w-2 sm:w-2.5 h-3 sm:h-3.5 rounded-full shadow-md"
              style={{
                backgroundColor: b.color,
                boxShadow: `0 0 8px ${b.color}`,
              }}
            />
          </div>
        ))}
      </div>

      {/* 5. Dynamic Aurora Mesh Glows */}
      <div 
        className="absolute -top-48 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-rose-600/18 via-purple-600/15 to-transparent rounded-full blur-[140px] animate-aurora-1" 
      />
      <div 
        className="absolute top-1/3 -right-32 w-[550px] h-[550px] bg-gradient-to-br from-amber-500/15 via-rose-500/12 to-transparent rounded-full blur-[140px] animate-aurora-2" 
      />
      <div 
        className="absolute -bottom-32 left-10 w-[650px] h-[650px] bg-gradient-to-tr from-purple-700/15 via-indigo-600/10 to-transparent rounded-full blur-[160px] animate-aurora-1" 
      />

      {/* 6. Subtle Party Confetti & Fairy Light Dot Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:32px_32px]"
      />

      {/* 7. Floating Balloon Bouquets on Left & Right Margins */}
      {backgroundBalloons.map((b) => (
        <div
          key={b.id}
          className="absolute hidden md:block select-none"
          style={{
            left: b.left,
            top: b.top,
            animation: `floatSlow ${b.duration} ease-in-out infinite`,
            animationDelay: b.delay,
          }}
        >
          <div className="relative flex flex-col items-center">
            {/* Balloon Body */}
            <div className={`${b.size} rounded-full bg-gradient-to-tr ${b.color} shadow-[0_8px_16px_rgba(0,0,0,0.5)] border border-white/20`}>
              <div className="absolute top-2.5 left-2.5 w-3 h-5 rounded-full bg-white/50 blur-[1px]" />
            </div>
            {/* String */}
            <div className="w-0.5 h-14 bg-gradient-to-b from-amber-400/60 via-amber-200/40 to-transparent -mt-0.5" />
          </div>
        </div>
      ))}

      {/* 8. Floating Sparkling Stardust & Party Particles */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            backgroundColor: s.color,
            boxShadow: `0 0 6px ${s.color}`,
            animation: `pulseGlow ${s.duration} ease-in-out infinite`,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* 9. Stage Floor Footlights Glow along Bottom */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-rose-950/40 via-transparent to-transparent pointer-events-none">
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
      </div>

    </div>
  );
};
