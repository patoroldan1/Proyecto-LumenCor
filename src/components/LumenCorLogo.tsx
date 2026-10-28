import React from 'react';

interface LumenCorLogoProps {
  variant?: 'full' | 'icon-only' | 'light';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LumenCorLogo: React.FC<LumenCorLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
  };

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Isotipo: Corazón y Cruz de LumenCor */}
      <div className={`relative flex-none ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            <linearGradient id="roseAura" x1="10" y1="10" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
            <linearGradient id="goldLight" x1="20" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="innerHeart" x1="25" y1="25" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="60%" stopColor="#FEF3C7" />
              <stop offset="100%" stopColor="#FDE68A" />
            </linearGradient>
            <linearGradient id="crossRed" x1="45" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E30613" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>

          {/* Halo Rosa */}
          <path
            d="M28 20 C14 20 5 32 5 46 C5 66 32 84 50 94 C42 80 18 64 18 46 C18 34 26 26 36 26 C43 26 49 30 52 35 C50 28 41 20 28 20 Z"
            fill="url(#roseAura)"
            opacity="0.9"
          />
          {/* Halo Dorado */}
          <path
            d="M38 18 C26 18 18 28 18 42 C18 62 42 78 58 88 C52 76 30 60 30 44 C30 33 38 25 48 25 C54 25 60 29 63 35 C60 26 50 18 38 18 Z"
            fill="url(#goldLight)"
            opacity="0.95"
          />
          {/* Corazón Interior */}
          <path
            d="M52 18 C40 18 32 28 32 40 C32 64 62 82 78 88 C90 76 98 60 98 42 C98 26 86 16 72 16 C63 16 56 21 52 28 C49 22 43 18 38 18 Z"
            fill="url(#innerHeart)"
            stroke="#EA580C"
            strokeWidth="1.5"
          />
          {/* Cruz Roja */}
          <path
            d="M58 24 C57 44 57 66 59 84 C62 84 66 83 67 82 C65 65 65 44 66 25 Z"
            fill="url(#crossRed)"
          />
          <path
            d="M40 43 C49 46 68 46 86 39 C87 42 87 45 85 47 C69 53 50 52 40 48 Z"
            fill="url(#crossRed)"
          />
        </svg>
      </div>

      {/* Tipografía Oficial */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-sans font-black tracking-tight leading-none ${
                size === 'sm'
                  ? 'text-base sm:text-lg'
                  : size === 'lg'
                  ? 'text-2xl sm:text-3xl'
                  : 'text-lg sm:text-xl md:text-2xl'
              } ${variant === 'light' ? 'text-white' : 'text-stone-900'}`}
            >
              LUMEN <span className="text-[#E30613]">COR</span>
            </span>
          </div>
          <span
            className={`font-serif italic tracking-wide mt-0.5 leading-none ${
              size === 'sm' ? 'text-[9px]' : 'text-[10px] sm:text-xs'
            } ${variant === 'light' ? 'text-stone-300' : 'text-stone-600'}`}
          >
            El Corazón es la Luz
          </span>
        </div>
      )}
    </div>
  );
};