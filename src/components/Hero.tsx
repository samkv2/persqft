import React, { useEffect } from 'react';
import { ArrowRight, Play, HardHat, Layers, Network, Compass, CheckCircle2 } from 'lucide-react';
import heroBgPng from '../assets/heroBg.png';
import heroBgWebp from '../assets/heroBg.webp';
import heroBgMobilePng from '../assets/heroBgMobile.png';
import heroBgMobileWebp from '../assets/heroBgMobile.webp';

interface HeroProps {
  onOpenEnquiry: () => void;
  onViewProjects: () => void;
  onWebUIReveal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onViewProjects, onWebUIReveal }) => {
  useEffect(() => {
    if (onWebUIReveal) {
      onWebUIReveal();
    }
  }, [onWebUIReveal]);

  return (
    <section
      id="home"
      className="relative min-h-[640px] sm:min-h-[720px] lg:min-h-screen lg:max-h-[1100px] flex flex-col justify-between overflow-hidden select-none bg-slate-100 pt-24 sm:pt-28 lg:pt-32"
    >
      {/* ── BACKGROUND IMAGE: Responsive Landscape (Desktop) & Portrait (Mobile) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Mobile Background (Portrait) */}
        <picture className="block sm:hidden w-full h-full">
          <source srcSet={heroBgMobileWebp} type="image/webp" />
          <img
            src={heroBgMobilePng}
            alt="PERSQFT Luxury Custom Villa & High-Rise Engineering"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            draggable={false}
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Desktop / Laptop / Tablet Background (Landscape) */}
        <picture className="hidden sm:block w-full h-full">
          <source srcSet={heroBgWebp} type="image/webp" />
          <img
            src={heroBgPng}
            alt="PERSQFT Architectural Execution & Turnkey Construction"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            draggable={false}
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Desktop Left-to-Right Subtle Contrast Veil for pristine typography readability */}
        <div
          className="hidden sm:block absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.78) 32%, rgba(255,255,255,0.25) 58%, transparent 85%)',
          }}
        />

        {/* Mobile Sky Gradient Veil */}
        <div
          className="block sm:hidden absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 35%, rgba(255,255,255,0.15) 60%, rgba(255,255,255,0.7) 100%)',
          }}
        />
      </div>

      {/* ── HANDWRITTEN SCRIPT ACCENT: "Transforming Quality Defining Construction" (Above Villa on Desktop) ── */}
      <div className="hidden lg:block absolute right-8 xl:right-24 top-28 xl:top-36 z-10 pointer-events-none select-none">
        <div className="font-['Caveat',cursive] font-bold text-2xl xl:text-[2.25rem] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] -rotate-6 leading-tight flex flex-col items-center">
          <span>Transforming Quality</span>
          <span className="flex items-center gap-1.5 -mt-0.5">
            <span>Defining Construction</span>
            <span className="text-[#FF6F2C] text-xl font-sans inline-block rotate-12 drop-shadow-sm">✦</span>
          </span>
        </div>
      </div>

      {/* ── HERO MAIN CONTENT CONTAINER ── */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 pt-8 sm:pt-14 lg:pt-16 pb-6 flex-1 flex flex-col justify-center">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          {/* 1. Category / Eyebrow Tag */}
          <p className="font-['Montserrat',sans-serif] text-xs sm:text-sm md:text-[0.95rem] font-semibold tracking-[0.12em] uppercase text-[#667078] mb-3 sm:mb-4">
            Architectural Drawing, New Construction, Renovation, Interior Design
          </p>

          {/* 2. Main Headline: Montserrat Bold 700 (52–64px desktop, 34–40px mobile) */}
          <h1 className="font-['Montserrat',sans-serif] font-bold tracking-tight text-[2.4rem] xs:text-[2.85rem] sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] leading-[1.1] mb-4 sm:mb-5">
            <span className="text-[#263238] block">Your Dream Home</span>
            <span className="text-[#FF6F2C] block mt-1 sm:mt-2">Engineered to Perfection</span>
            <span className="sr-only">
              {' '}
              — Best Construction Company in Sultanpur, Lucknow, Ayodhya &amp; Hathras, Uttar Pradesh
            </span>
          </h1>

          {/* 3. Description Subhead: Inter Regular 400 (16-18px desktop) */}
          <p className="font-['Inter',sans-serif] text-[#667078] text-sm sm:text-base md:text-lg lg:text-[1.12rem] leading-relaxed max-w-xl font-normal mb-7 sm:mb-9">
            We design, plan and build spaces that match your lifestyle, needs and dreams — from concept to completion.
          </p>

          {/* 4. Action Buttons (Primary CTA: #FF6F2C, 6-8px radius | Secondary CTA: 1px #FF6F2C, 6-8px radius) */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={onOpenEnquiry}
              className="inline-flex items-center justify-center gap-2.5 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm md:text-base tracking-wide shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <span>Book Free Consultation</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={onViewProjects}
              className="inline-flex items-center justify-center gap-2.5 bg-white hover:bg-[#FFF1E9] text-[#263238] border border-[#FF6F2C] px-6 sm:px-7 py-3.5 sm:py-4 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm md:text-base tracking-wide shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#263238] text-[#263238] shrink-0" />
              <span>Explore Our Work</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 5. BOTTOM FLOATING FEATURE BAR (Cards: 6-10px radius, border #F1EFEC, soft shadow) ── */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14 pb-5 sm:pb-8">
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[10px] shadow-[0_8px_30px_rgba(38,50,56,0.06)] border border-[#F1EFEC] p-3.5 sm:p-5 lg:p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-[#F1EFEC]">
            {/* Feature 1: Elevations */}
            <div className="flex items-center gap-3 sm:gap-3.5 lg:px-4 xl:px-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[8px] bg-[#FFF1E9] border border-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
                <HardHat className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-[13px] font-medium font-['Inter',sans-serif] text-[#667078] leading-tight">We Design</span>
                <span className="text-sm sm:text-[15px] font-semibold font-['Montserrat',sans-serif] text-[#263238] leading-snug mt-0.5">Elevations</span>
              </div>
            </div>

            {/* Feature 2: Interiors */}
            <div className="flex items-center gap-3 sm:gap-3.5 lg:px-4 xl:px-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[8px] bg-[#FFF1E9] border border-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-[13px] font-medium font-['Inter',sans-serif] text-[#667078] leading-tight">We Create</span>
                <span className="text-sm sm:text-[15px] font-semibold font-['Montserrat',sans-serif] text-[#263238] leading-snug mt-0.5">
                  Beautiful Interiors
                </span>
              </div>
            </div>

            {/* Feature 3: Smart Planning */}
            <div className="flex items-center gap-3 sm:gap-3.5 lg:px-4 xl:px-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[8px] bg-[#FFF1E9] border border-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
                <Network className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-[13px] font-medium font-['Inter',sans-serif] text-[#667078] leading-tight">We Plan</span>
                <span className="text-sm sm:text-[15px] font-semibold font-['Montserrat',sans-serif] text-[#263238] leading-snug mt-0.5">Smartly</span>
              </div>
            </div>

            {/* Feature 4: Detailed Drawings */}
            <div className="flex items-center gap-3 sm:gap-3.5 lg:px-4 xl:px-6">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[8px] bg-[#FFF1E9] border border-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-[13px] font-medium font-['Inter',sans-serif] text-[#667078] leading-tight">We Prepare</span>
                <span className="text-sm sm:text-[15px] font-semibold font-['Montserrat',sans-serif] text-[#263238] leading-snug mt-0.5">
                  Detailed Drawings
                </span>
              </div>
            </div>

            {/* Feature 5: End-to-End Delivery */}
            <div className="flex items-center gap-3 sm:gap-3.5 lg:px-4 xl:px-6 col-span-2 sm:col-span-1">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[8px] bg-[#FFF1E9] border border-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-[13px] font-medium font-['Inter',sans-serif] text-[#667078] leading-tight">We Deliver</span>
                <span className="text-sm sm:text-[15px] font-semibold font-['Montserrat',sans-serif] text-[#263238] leading-snug mt-0.5">End-to-End</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
