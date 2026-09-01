import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Phone, Star, Shield, Award, SkipForward } from 'lucide-react';
import renderWithoutWeb10sFastMP4 from '../assets/renderWithoutWeb10s_1080p_fast.mp4';
import renderWithoutWeb10sWebM from '../assets/renderWithoutWeb10s_1080p_fast.webm';
import freshLastFrame from '../assets/freshLastFrame.jpeg';
import firstFrameEntrance from '../assets/firstFrameEntrance.jpeg';

interface HeroProps {
  onOpenEnquiry: () => void;
  onViewProjects: () => void;
  onWebUIReveal?: () => void;
}

const slides = [
  {
    tagline1: 'BUILDING THE FUTURE,',
    tagline2: 'SQUARE BY SQUARE.',
    bullets: [
      'From deep-piling foundations to glass–facade high–rises — engineered to endure generations.',
      'Precision–built across Lucknow, Kanpur & across UP.',
    ],
    cta: 'Start Your Project',
    cta2: 'View Portfolio',
  },
];

const badges = [
  { icon: Shield, line1: 'ISO',    line2: 'CERTIFIED' },
  { icon: Award,  line1: '150+',   line2: 'PROJECTS' },
  { icon: Star,   line1: '10+ YRS', line2: 'EXPERIENCE' },
];

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onViewProjects, onWebUIReveal }) => {
  const [showWebUI, setShowWebUI] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const revealUI = () => {
    setShowWebUI(true);
    if (onWebUIReveal) {
      onWebUIReveal();
    }
  };

  // Instant 0ms video playback trigger without video.load() delay (iOS Safari Compatible)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Silent catch for iOS Low Power Mode - do NOT skip UI prematurely
        });
      }
    };

    attemptPlay();

    // Fallback for iOS Low Power Mode or initial touch requirement
    const handleUserInteraction = () => {
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener('touchstart', handleUserInteraction, { passive: true, once: true });
    window.addEventListener('pointerdown', handleUserInteraction, { passive: true, once: true });

    // Safety fallback: reveal Web UI if video stalls completely for 14 seconds
    const timer = setTimeout(() => {
      revealUI();
    }, 14000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('pointerdown', handleUserInteraction);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 10;

      // Reveal Web UI ONLY when video completes its full natural time or ends
      if (videoRef.current.ended || (dur > 0 && cur >= dur - 0.15)) {
        revealUI();
      }
    }
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    revealUI();
  };

  const handleCta2 = (label: string) => {
    if (label.toLowerCase().includes('portfolio') || label.toLowerCase().includes('projects')) {
      onViewProjects();
    } else if (label.toLowerCase().includes('services')) {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onOpenEnquiry();
    }
  };

  return (
    <section id="home" className="relative min-h-[auto] sm:min-h-screen flex flex-col overflow-hidden select-none bg-white">
      
      {/* ── UNIFIED BACKGROUND LAYER: FIT & CENTERED VIDEO / IMAGE BACKDROP ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-slate-100">
        
        {/* Layer 0: Instant 0ms First Frame Poster Image (PREVENTS ANY DARK/BLACK BLANK SCREEN ON FRESH LOAD) */}
        <img
          src={firstFrameEntrance}
          alt="PERSQFT Construction Site Scene"
          draggable={false}
          loading="eager"
          // @ts-expect-error fetchpriority attribute
          fetchpriority="high"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        {/* Layer A: Full Screen Fill Last Frame Image Backdrop (Appears ONLY when Web UI is revealed) */}
        <img
          src={freshLastFrame}
          alt="PERSQFT Construction Site Render"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 z-10 ${
            showWebUI ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Layer B: Entrance Video Overlay (iOS H.264 FastStart First + WebM Fallback) */}
        <video
          ref={videoRef}
          poster={firstFrameEntrance}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload no-remote-playback noremoteplayback nofullscreen"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          onTimeUpdate={handleTimeUpdate}
          onEnded={revealUI}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 z-20 ${
            showWebUI ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <source src={renderWithoutWeb10sFastMP4} type="video/mp4" />
          <source src={renderWithoutWeb10sWebM} type="video/webm" />
        </video>

        {/* Layer C — Unified Left-to-Right Glassmorphic Veil (frosted text backdrop on left, clear render on right) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 z-25 backdrop-blur-sm ${
            showWebUI ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background:
              'linear-gradient(to right, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.72) 40%, rgba(255,255,255,0.25) 70%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0.5) 70%, transparent 100%)',
          }}
        />
      </div>

      {/* ── SKIP INTRO BUTTON OVERLAY (DURING INITIAL VIDEO) ── */}
      {!showWebUI && (
        <div className="absolute bottom-10 right-6 sm:right-12 z-40 animate-fadeIn">
          <button
            onClick={handleSkip}
            className="flex items-center space-x-2 px-5 py-3 bg-[#F48033] hover:bg-[#d96a20] text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer border border-white/20"
          >
            <span>SKIP INTRO</span>
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── HOME WEB UI CONTENT (FLOATS ELEGANTLY OVER GRADIENT GLASS VEIL) ── */}
      <div
        className={`relative z-30 flex-1 flex flex-col justify-center max-w-[1536px] mx-auto w-full px-4 sm:px-12 lg:px-16 pt-24 sm:pt-32 pb-8 sm:pb-12 transition-all duration-1000 ${
          showWebUI ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
          
          {/* Main Headline */}
          <div>
            {/* Eyebrow label */}
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="font-mono text-[11px] sm:text-xs font-bold text-[#F48033] uppercase tracking-[0.25em]">
                Engineering Tomorrow
              </span>
              <div className="w-8 h-px bg-[#F48033]" />
            </div>

            <h1 className="font-heading font-black uppercase leading-[1.08] tracking-tight text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] mb-5 sm:mb-6">
              <span className="text-slate-950 block">{slides[0].tagline1}</span>
              <span className="text-[#F48033] block">{slides[0].tagline2}</span>
            </h1>

            {/* Bullet sub-text matching screenshot */}
            <ul className="space-y-2.5 mb-6 sm:mb-8">
              {slides[0].bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#F48033] shrink-0" />
                  <span className="text-slate-800 text-sm sm:text-base font-normal leading-snug font-sans">
                    {bullet}
                  </span>
                </li>
              ))}
            </ul>

            {/* Action Buttons — sharp rectangle, flat styling without drop shadows */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8">
              <button
                onClick={onOpenEnquiry}
                className="group inline-flex items-center justify-center space-x-2.5 bg-[#F48033] hover:bg-[#d96a20] text-white px-6 py-3.5 rounded-none font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap border border-[#d96a20]"
              >
                <Phone className="w-4 h-4 shrink-0" />
                <span>{slides[0].cta}</span>
                <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleCta2(slides[0].cta2)}
                className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-900 px-6 py-3.5 rounded-none font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>{slides[0].cta2}</span>
                <ArrowRight className="w-4 h-4 text-[#F48033] shrink-0" />
              </button>
            </div>

            {/* Credibility Tiles — 3 equal columns, icon top + label below, flat styling without drop shadow */}
            <div className="grid grid-cols-3 gap-0 border border-slate-200/80 bg-white/95 backdrop-blur-md mt-1">
              {badges.map((b, i) => {
                const Icon = b.icon;
                return (
                  <div
                    key={b.line1}
                    className={`flex flex-col items-center justify-center py-3.5 px-2 ${
                      i < badges.length - 1 ? 'border-r border-slate-200/80' : ''
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#F48033] mb-2" strokeWidth={1.5} />
                    <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-800 text-center leading-tight">
                      {b.line1}<br />{b.line2}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

    </section>
  );
};
