import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'auto',
  showText = true,
  size = 'md'
}) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const textSizes = {
    sm: 'text-base tracking-tight',
    md: 'text-xl tracking-tight',
    lg: 'text-2xl tracking-tighter'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="brand-logo">
      {/* Custom Circular Economy + Connection + Subtle "W" Logo */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#146B4A] to-[#0B3D2E] shadow-sm shadow-[#0B3D2E]/20 border border-[#35A66F]/30 overflow-hidden group`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-[#EFF9F2] transition-transform duration-300 group-hover:scale-105"
        >
          {/* Subtle circular flow arrows forming a modern angular W */}
          <path
            d="M8 11L13 24L18 15L23 24L28 11"
            stroke="#EFF9F2"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="8" cy="11" r="2.2" fill="#35A66F" />
          <circle cx="28" cy="11" r="2.2" fill="#35A66F" />
          <circle cx="18" cy="15" r="1.8" fill="#C8EBD5" />
          {/* Circular loop accent */}
          <path
            d="M27 21C26.5 24 23.5 26.5 18 26.5C12.5 26.5 9.5 24 9 21"
            stroke="#35A66F"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeDasharray="2 3"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-heading font-extrabold ${textSizes[size]} leading-none ${
              isLight ? 'text-white' : 'text-[#0B3D2E]'
            }`}
          >
            WASTEMATCH
          </span>
          {size === 'lg' && (
            <span className={`text-[10px] font-medium tracking-wider uppercase mt-1 ${isLight ? 'text-[#C8EBD5]' : 'text-[#60756A]'}`}>
              Resource Marketplace
            </span>
          )}
        </div>
      )}
    </div>
  );
};
