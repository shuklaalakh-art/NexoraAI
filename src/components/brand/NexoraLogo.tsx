import React from 'react';
import { NexoraIcon } from './NexoraIcon';

interface NexoraLogoProps {
  variant?: 'horizontal' | 'stacked' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const NexoraLogo: React.FC<NexoraLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  showSubtitle = true,
  className = '',
}) => {
  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        {/* Symbol with Glow */}
        <div className="relative mb-3 group">
          <div className="absolute -inset-4 bg-gradient-to-r from-sky-500/20 via-purple-500/20 to-orange-500/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition duration-700" />
          <NexoraIcon
            size={size === 'sm' ? 48 : size === 'md' ? 72 : size === 'lg' ? 96 : 120}
            withContainer={false}
          />
        </div>

        {/* Wordmark: NEXORA */}
        <div className="flex items-center justify-center font-black tracking-wider text-white">
          <span className="text-2xl sm:text-4xl tracking-[0.18em] font-extrabold text-white">
            NEX
          </span>

          {/* Iconic Glowing Torus Ring for 'O' */}
          <span className="relative inline-flex items-center justify-center mx-1 sm:mx-1.5">
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-[4px] sm:border-[5px] border-transparent bg-gradient-to-tr from-sky-400 via-purple-500 to-amber-500 [background-clip:border-box] shadow-[0_0_18px_rgba(56,189,248,0.5)]" />
            <span className="absolute w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-slate-950" />
          </span>

          <span className="text-2xl sm:text-4xl tracking-[0.18em] font-extrabold text-white">
            RA
          </span>
        </div>

        {/* Subtitle: BY ALAKH with neon accent dividers */}
        {showSubtitle && (
          <div className="flex items-center gap-3 mt-2 sm:mt-2.5 w-full max-w-[280px] justify-center">
            <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-sky-400 to-sky-400/80" />
            <span className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-slate-300 font-mono">
              BY ALAKH
            </span>
            <div className="h-[1.5px] flex-1 bg-gradient-to-r from-purple-400/80 via-purple-400 to-transparent" />
          </div>
        )}
      </div>
    );
  }

  // Horizontal Header Layout
  const iconPixel = size === 'sm' ? 32 : size === 'md' ? 38 : size === 'lg' ? 46 : 56;
  const textSize =
    size === 'sm'
      ? 'text-base tracking-[0.15em]'
      : size === 'md'
      ? 'text-lg tracking-[0.18em]'
      : 'text-xl tracking-[0.2em]';

  const ringSize =
    size === 'sm'
      ? 'w-4 h-4 border-[2.5px]'
      : size === 'md'
      ? 'w-5 h-5 border-[3.5px]'
      : 'w-6 h-6 border-[4px]';

  const ringHole =
    size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Folded Ribbon 'N' Symbol */}
      <NexoraIcon size={iconPixel} withContainer={false} />

      {/* Typography Block */}
      <div className="flex flex-col">
        <div className="flex items-center leading-none">
          <span className={`font-black text-white ${textSize}`}>NEX</span>

          {/* Glowing Torus Ring for 'O' */}
          <span className="relative inline-flex items-center justify-center mx-0.5 sm:mx-1">
            <span
              className={`rounded-full border-transparent bg-gradient-to-tr from-sky-400 via-purple-500 to-amber-500 [background-clip:border-box] shadow-[0_0_12px_rgba(56,189,248,0.45)] ${ringSize}`}
            />
            <span className={`absolute rounded-full bg-slate-950 ${ringHole}`} />
          </span>

          <span className={`font-black text-white ${textSize}`}>RA</span>

          <span className="ml-2 text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/25">
            PRO
          </span>
        </div>

        {/* 'BY ALAKH' Accent Header Subtitle */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <div className="h-[1px] w-5 bg-gradient-to-r from-transparent to-sky-400/90" />
            <span className="text-[9px] font-medium tracking-[0.28em] uppercase text-slate-400 font-mono">
              BY ALAKH
            </span>
            <div className="h-[1px] w-5 bg-gradient-to-r from-purple-400/90 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
};
