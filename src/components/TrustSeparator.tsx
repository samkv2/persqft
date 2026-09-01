import React from 'react';

export const TrustSeparator: React.FC = () => {
  return (
    <div className="relative z-20 w-full bg-[#0F172A] border-y border-slate-800/90 py-4 sm:py-5 px-4 sm:px-12 overflow-hidden select-none">
      {/* Subtle blueprint grid overlay */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />

      <div className="max-w-[1536px] mx-auto flex items-center justify-between relative z-10">
        
        {/* Left Side: Orange Bar + Text */}
        <div className="flex items-center space-x-3.5 sm:space-x-4">
          <div className="w-1.5 h-10 sm:h-12 bg-[#F48033] rounded-full shrink-0" />
          <div className="font-heading text-sm sm:text-base lg:text-lg font-bold leading-tight">
            <span className="text-white block">Built on trust.</span>
            <span className="text-slate-300 block">
              Driven by <span className="text-[#F48033]">precision.</span>
            </span>
          </div>
        </div>

        {/* Right Side: Architectural High-rise Blueprint SVG Illustration */}
        <div className="shrink-0 opacity-50 sm:opacity-80 pl-4">
          <svg
            className="w-20 h-12 sm:w-32 sm:h-16 text-slate-500"
            viewBox="0 0 160 90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            {/* Building 1 - Left Tower */}
            <rect x="15" y="35" width="25" height="50" stroke="currentColor" />
            <line x1="15" y1="45" x2="40" y2="45" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="15" y1="55" x2="40" y2="55" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="15" y1="65" x2="40" y2="65" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="15" y1="75" x2="40" y2="75" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="27" y1="35" x2="27" y2="85" stroke="currentColor" />

            {/* Building 2 - Main Center Tower (Taller with Orange Spire) */}
            <rect x="48" y="15" width="40" height="70" stroke="currentColor" strokeWidth="1.5" />
            <line x1="48" y1="30" x2="88" y2="30" stroke="currentColor" />
            <line x1="48" y1="45" x2="88" y2="45" stroke="currentColor" />
            <line x1="48" y1="60" x2="88" y2="60" stroke="currentColor" />
            <line x1="48" y1="75" x2="88" y2="75" stroke="currentColor" />
            <line x1="68" y1="15" x2="68" y2="85" stroke="currentColor" />
            {/* Spire / Antenna in Orange */}
            <line x1="68" y1="2" x2="68" y2="15" stroke="#F48033" strokeWidth="2" />
            <circle cx="68" cy="2" r="1.5" fill="#F48033" />

            {/* Building 3 - Right Tower */}
            <rect x="96" y="28" width="30" height="57" stroke="currentColor" />
            <line x1="96" y1="42" x2="126" y2="42" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="96" y1="56" x2="126" y2="56" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="96" y1="70" x2="126" y2="70" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="111" y1="28" x2="111" y2="85" stroke="currentColor" />

            {/* Building 4 - Far Right Small Structure */}
            <rect x="132" y="50" width="20" height="35" stroke="currentColor" />
            <line x1="132" y1="65" x2="152" y2="65" stroke="currentColor" strokeDasharray="2 2" />

            {/* Orange Accent Lines */}
            <path d="M 48 85 L 48 15 L 88 15" stroke="#F48033" strokeWidth="1.5" />
          </svg>
        </div>

      </div>
    </div>
  );
};
