import React, { useState } from 'react';
import { FLUENT_3D_EMOJIS, FluentEmoji } from '../data/emojis';

interface Fluent3DEmojiProps {
  id?: string;
  emojiObj?: FluentEmoji;
  size?: number | string;
  className?: string;
  animate?: 'bounce' | 'pulse' | 'float' | 'spin' | 'wiggle' | 'none';
  onClick?: (e: React.MouseEvent) => void;
  alt?: string;
}

export const Fluent3DEmoji: React.FC<Fluent3DEmojiProps> = ({
  id,
  emojiObj,
  size = 40,
  className = '',
  animate = 'none',
  onClick,
  alt
}) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const data = emojiObj || (id ? FLUENT_3D_EMOJIS[id] : null);

  if (!data) return null;

  const animationClass = {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    float: 'animate-float-slow',
    spin: 'animate-spin',
    wiggle: 'hover:rotate-12 transition-transform duration-200',
    none: ''
  }[animate];

  if (hasError) {
    return (
      <span 
        className={`inline-flex items-center justify-center select-none ${animationClass} ${className}`}
        style={{ fontSize: typeof size === 'number' ? `${size * 0.75}px` : size }}
        onClick={onClick}
      >
        {data.fallbackChar}
      </span>
    );
  }

  const dimensionStyle = typeof size === 'number' 
    ? { width: `${size}px`, height: `${size}px` } 
    : { width: size, height: size };

  return (
    <img
      src={data.url}
      alt={alt || data.name}
      loading="lazy"
      onError={() => setHasError(true)}
      onClick={onClick}
      style={dimensionStyle}
      className={`inline-block object-contain drop-shadow-md select-none ${animationClass} ${className} ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
    />
  );
};
