import React from 'react';

interface NexoraIconProps {
  className?: string;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  withContainer?: boolean;
  withGlow?: boolean;
}

export const NexoraIcon: React.FC<NexoraIconProps> = ({
  className = '',
  size = 'md',
  withContainer = true,
  withGlow = true,
}) => {
  const pixelSize =
    typeof size === 'number'
      ? size
      : size === 'sm'
      ? 28
      : size === 'md'
      ? 38
      : size === 'lg'
      ? 54
      : 80;

  const symbolContent = (
    <svg
      viewBox="0 0 512 512"
      className="w-full h-full overflow-visible"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Ribbon Left Stem: Cyan to Blue */}
        <linearGradient id="nLeft" x1="0%" y1="100%" x2="60%" y2="0%">
          <stop offset="0%" stopColor="#0062ff" />
          <stop offset="40%" stopColor="#00b4d8" />
          <stop offset="100%" stopColor="#00f5d4" />
        </linearGradient>

        {/* Ribbon Diagonal: Cyan -> Deep Blue -> Purple -> Magenta */}
        <linearGradient id="nDiag" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="25%" stopColor="#0066ff" />
          <stop offset="55%" stopColor="#581c87" />
          <stop offset="80%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>

        {/* Ribbon Right Fold: Magenta -> Coral -> Amber Gold */}
        <linearGradient id="nRight" x1="20%" y1="90%" x2="80%" y2="10%">
          <stop offset="0%" stopColor="#c026d3" />
          <stop offset="35%" stopColor="#ec4899" />
          <stop offset="70%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        {/* Sparkle Gold Gradient */}
        <radialGradient id="nGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fde047" />
          <stop offset="70%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>

        {/* Sparkle Cyan Gradient */}
        <radialGradient id="nCyan" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#67e8f9" />
          <stop offset="80%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </radialGradient>

        {/* Drop shadow / Ambient Filter */}
        <filter id="nBloom" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient background bloom */}
      {withGlow && (
        <>
          <circle cx="210" cy="240" r="110" fill="#00d2ff" opacity="0.25" />
          <circle cx="330" cy="270" r="95" fill="#ec4899" opacity="0.28" />
          <circle cx="340" cy="210" r="75" fill="#f59e0b" opacity="0.2" />
        </>
      )}

      {/* 3D Folded Ribbon 'N' */}
      <g transform="translate(10, -5)" filter="url(#nBloom)">
        {/* Layer 1: Right Upward Swell Fold (Orange/Magenta Back-Fold) */}
        <path
          d="M 285 365 
             C 320 375, 365 345, 375 280
             C 382 235, 368 185, 345 145
             C 340 135, 332 142, 330 152
             C 322 195, 336 245, 335 285
             C 334 320, 305 342, 275 345
             Z"
          fill="url(#nRight)"
        />

        {/* Layer 2: Diagonal Sweep (Cyan -> Purple -> Magenta) */}
        <path
          d="M 188 140
             C 215 138, 245 170, 275 220
             C 305 270, 335 328, 355 352
             C 365 365, 352 376, 335 372
             C 300 366, 268 318, 238 268
             C 208 218, 178 160, 188 140
             Z"
          fill="url(#nDiag)"
        />

        {/* Layer 3: Left Column & Front Loop (Cyan / Electric Blue Fold) */}
        <path
          d="M 172 355
             C 142 355, 128 320, 128 270
             C 128 205, 142 148, 175 136
             C 192 130, 202 145, 202 165
             C 202 190, 188 235, 178 280
             C 170 315, 175 345, 192 352
             C 198 355, 190 362, 172 355
             Z"
          fill="url(#nLeft)"
        />

        {/* Highlights */}
        <path
          d="M 175 136
             C 188 148, 196 172, 192 205
             C 186 248, 172 290, 168 330
             C 165 310, 164 280, 168 240
             C 172 198, 180 160, 175 136
             Z"
          fill="#ffffff"
          opacity="0.35"
        />

        <path
          d="M 200 152
             C 230 195, 268 255, 305 305
             C 300 305, 260 250, 230 195
             C 210 165, 202 152, 200 152
             Z"
          fill="#ffffff"
          opacity="0.25"
        />

        <path
          d="M 160 145 C 175 136, 192 135, 205 142"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.65"
        />

        <path
          d="M 368 250 C 375 220, 370 178, 350 148"
          fill="none"
          stroke="#fef08a"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>

      {/* Sparkle Stars */}
      <g transform="translate(372, 132)">
        <path
          d="M 0 -22 Q 0 0 -22 0 Q 0 0 0 22 Q 0 0 22 0 Q 0 0 0 -22 Z"
          fill="url(#nGold)"
        />
        <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
      </g>

      <g transform="translate(398, 172)">
        <path
          d="M 0 -13 Q 0 0 -13 0 Q 0 0 0 13 Q 0 0 13 0 Q 0 0 0 -13 Z"
          fill="url(#nCyan)"
        />
        <circle cx="0" cy="0" r="2" fill="#ffffff" />
      </g>

      <g transform="translate(366, 186)">
        <path
          d="M 0 -8 Q 0 0 -8 0 Q 0 0 0 8 Q 0 0 8 0 Q 0 0 0 -8 Z"
          fill="url(#nCyan)"
          opacity="0.85"
        />
        <circle cx="0" cy="0" r="1.2" fill="#ffffff" />
      </g>
    </svg>
  );

  if (!withContainer) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: pixelSize, height: pixelSize }}
      >
        {symbolContent}
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/80 shadow-lg shadow-sky-500/10 group-hover:shadow-sky-500/25 transition-all p-1 overflow-hidden ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    >
      {/* Subtle outer neon ring */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-500/20 via-indigo-500/10 to-rose-500/20 opacity-60 pointer-events-none" />
      <div className="w-full h-full relative z-10 flex items-center justify-center">
        {symbolContent}
      </div>
    </div>
  );
};
