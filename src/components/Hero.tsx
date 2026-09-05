import React, { useState, useEffect } from 'react';
import { ArrowRight, Phone, Star, Shield, Award } from 'lucide-react';
import bgHero from '../assets/bgHeroSample1.png';

interface HeroProps {
  onOpenEnquiry: () => void;
  onViewProjects: () => void;
  onWebUIReveal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onViewProjects, onWebUIReveal }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Keyboard typing animation for "DEFINING CONSTRUCTION"
  const fullTypingText = 'DEFINING CONSTRUCTION';
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    if (onWebUIReveal) {
      onWebUIReveal();
    }
    return () => clearTimeout(timer);
  }, [onWebUIReveal]);

  useEffect(() => {
    if (!isLoaded) return;

    let delay = isDeleting ? 45 : 85;

    if (!isDeleting && typedText === fullTypingText) {
      delay = 3800; // Hold full text for 3.8 seconds
    } else if (isDeleting && typedText === '') {
      delay = 500; // Pause before typing again
    }

    const timer = setTimeout(() => {
      if (!isDeleting && typedText === fullTypingText) {
        setIsDeleting(true);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
      } else if (!isDeleting) {
        setTypedText(fullTypingText.slice(0, typedText.length + 1));
      } else {
        setTypedText(fullTypingText.slice(0, typedText.length - 1));
      }
    }, typedText === '' && !isDeleting ? 400 : delay);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, isLoaded]);

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden select-none bg-slate-900">
      
      {/* ── BACKGROUND IMAGE: Construction Site & Skyline Sunset ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={bgHero}
          alt="PERSQFT Construction Site with Sunset Skyline"
          loading="eager"
          // @ts-expect-error fetchpriority attribute
          fetchpriority="high"
          draggable={false}
          className="w-full h-full object-cover object-[70%_center] sm:object-center"
        />

        {/* ── Soft Left-to-Right Contrast Veil (Ensures Crisp Typography while Revealing Sunset Skyline) ── */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 36%, rgba(255,255,255,0.28) 65%, transparent 100%)',
          }}
        />
        {/* Subtle mobile base wash for phone screens */}
        <div className="block sm:hidden absolute inset-0 bg-white/40 pointer-events-none" />
      </div>

      {/* ── HERO CONTENT CONTAINER (Left-Aligned per Mockup) ── */}
      <div
        className={`relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 flex flex-col justify-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
          
          {/* 1. Eyebrow Tag: ENGINEERING TOMORROW ── */}
          <div
            className={`flex items-center gap-3 mb-4 sm:mb-5 transition-all duration-1000 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <span className="font-mono text-xs sm:text-sm font-bold text-[#F48033] uppercase tracking-[0.22em]">
              Engineering Tomorrow
            </span>
            <div className="w-10 sm:w-14 h-[2px] bg-[#F48033] rounded-full" />
          </div>

          {/* 2. Main Headline (TRANSFORMING QUALITY, DEFINING CONSTRUCTION with Typing Effect) */}
          <h1
            className={`font-heading font-black uppercase tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-[3.9rem] xl:text-[4.4rem] leading-[1.08] mb-5 sm:mb-6 transition-all duration-1000 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-slate-950 block">TRANSFORMING QUALITY,</span>
            <span className="text-[#F48033] block mt-1 sm:mt-2 min-h-[1.15em]">
              <span>{typedText}</span>
              <span className="inline-block w-[3px] sm:w-[4px] lg:w-[5px] h-[0.85em] bg-[#F48033] ml-1.5 sm:ml-2 align-baseline animate-pulse" />
            </span>
          </h1>

          {/* 3. Bullet Points with Orange Accent Dots */}
          <ul
            className={`space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 max-w-2xl transition-all duration-1000 delay-250 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <li className="flex items-start gap-2.5 sm:gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F48033] shrink-0" />
              <span className="text-slate-800 text-sm sm:text-base font-normal leading-relaxed">
                From deep-piling foundations to glass-facade high-rises — engineered to endure generations.
              </span>
            </li>
            <li className="flex items-start gap-2.5 sm:gap-3">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#F48033] shrink-0" />
              <span className="text-slate-800 text-sm sm:text-base font-normal leading-relaxed">
                Precision-built across Lucknow, Kanpur & across UP.
              </span>
            </li>
          </ul>

          {/* 4. Action Buttons (Orange Primary & White Outlined Secondary) */}
          <div
            className={`flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-10 transition-all duration-1000 delay-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button
              onClick={onOpenEnquiry}
              className="group inline-flex items-center justify-center space-x-2.5 bg-[#F48033] hover:bg-[#d96a20] text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>START YOUR PROJECT</span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onViewProjects}
              className="inline-flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-900 px-6 sm:px-7 py-3.5 sm:py-4 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>VIEW PORTFOLIO</span>
              <ArrowRight className="w-4 h-4 text-[#F48033] shrink-0" />
            </button>
          </div>

          {/* 5. Credibility Card: 3 Equal Columns with Orange Icons */}
          <div
            className={`max-w-lg sm:max-w-xl bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl shadow-lg grid grid-cols-3 divide-x divide-slate-200/80 overflow-hidden transition-all duration-1000 delay-450 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col items-center justify-center py-3.5 sm:py-4 px-3 text-center">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#F48033] mb-1.5 sm:mb-2" strokeWidth={1.8} />
              <span className="font-bold text-xs sm:text-sm text-slate-950 block leading-tight">ISO</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mt-0.5">CERTIFIED</span>
            </div>

            <div className="flex flex-col items-center justify-center py-3.5 sm:py-4 px-3 text-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-[#F48033] mb-1.5 sm:mb-2" strokeWidth={1.8} />
              <span className="font-bold text-xs sm:text-sm text-slate-950 block leading-tight">150+</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mt-0.5">PROJECTS</span>
            </div>

            <div className="flex flex-col items-center justify-center py-3.5 sm:py-4 px-3 text-center">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#F48033] mb-1.5 sm:mb-2" strokeWidth={1.8} />
              <span className="font-bold text-xs sm:text-sm text-slate-950 block leading-tight">10+ YRS</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 uppercase tracking-wider block mt-0.5">EXPERIENCE</span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
