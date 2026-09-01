import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import aboutBgImage from '../assets/aboutBG.png';
import aboutBgVideo from '../assets/AboutSectionBgCip.mp4';
import lastFrameBg from '../assets/lastFrameAboutSectionBG.jpeg';
import { ScrollReveal } from './ScrollReveal';

interface OurStorySectionProps {
  onOpenEnquiry?: () => void;
}

export const OurStorySection: React.FC<OurStorySectionProps> = ({ onOpenEnquiry }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reverseAnimRef = useRef<number | null>(null);

  const storySlides = [
    {
      category: 'OUR STORY',
      title: 'ENGINEERING PRECISION & MASTERFUL BUILDING',
      description:
        'PERSQFT CONSTRUCTIONS was born from a singular vision: to bring mathematical precision and architectural mastery to every square foot of space. We engineer structures that redefine modern skylines while upholding uncompromised structural integrity, sustainable engineering, and sub-millimeter construction tolerances.',
      ctaText: 'LEARN MORE ABOUT US',
      highlights: ['100% BIM Coordinated', 'Sub-Millimeter Tolerances', 'Turnkey Execution'],
    },
  ];

  // Smooth video playback on viewport scroll
  useEffect(() => {
    const playForward = () => {
      if (reverseAnimRef.current) {
        cancelAnimationFrame(reverseAnimRef.current);
        reverseAnimRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.playbackRate = 1.75;
        videoRef.current.play().catch(() => {});
      }
    };

    const playReverse = () => {
      if (videoRef.current) {
        videoRef.current.pause();
        const step = () => {
          if (videoRef.current && videoRef.current.currentTime > 0.08) {
            videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 0.16);
            reverseAnimRef.current = requestAnimationFrame(step);
          } else if (videoRef.current) {
            videoRef.current.currentTime = 0;
            reverseAnimRef.current = null;
          }
        };
        reverseAnimRef.current = requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playForward();
          } else {
            playReverse();
          }
        });
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      if (reverseAnimRef.current) {
        cancelAnimationFrame(reverseAnimRef.current);
      }
    };
  }, []);

  const currentSlide = storySlides[0];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-20 lg:py-28 bg-[#D8DFE1] border-b border-slate-300/80 overflow-hidden select-none z-10"
    >
      {/* ── FULL ABOUT SECTION BACKGROUND IMAGE MIXED WITH #D8DFE1 ── */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[#D8DFE1] select-none">
        <img
          src={aboutBgImage}
          alt="About Section Architectural Grid Background"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-cover object-center opacity-90 mix-blend-multiply pointer-events-none select-none"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#D8DFE1] to-transparent pointer-events-none" />
      </div>

      {/* ── FULL WIDTH FOREGROUND CONTAINER ── */}
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-12 lg:px-20 relative z-10">
        
        {/* MAIN EDITORIAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center min-h-0 lg:min-h-[640px]">
          
          {/* LEFT COLUMN: ENHANCED STORY CONTENT & TYPOGRAPHY */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <ScrollReveal direction="left">
              <div>
                {/* Category Tag */}
                <div className="inline-flex items-center gap-2.5 mb-3 sm:mb-4">
                  <span className="w-3 h-3 rounded-full bg-[#F48033]" />
                  <span className="font-mono text-xs sm:text-sm text-[#F48033] tracking-[0.25em] font-bold uppercase">
                    {currentSlide.category}
                  </span>
                </div>

                {/* Main Title (Responsive Font Size) */}
                <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-slate-950 uppercase tracking-tight leading-[1.05]">
                  {currentSlide.title}
                </h2>

                {/* Signature Orange Underline Bar */}
                <div className="w-16 sm:w-20 h-1.5 bg-[#F48033] rounded-full my-4 sm:my-6 transition-all duration-500" />

                {/* Narrative Paragraph */}
                <p className="text-slate-800 text-base sm:text-xl leading-relaxed font-medium mb-6 sm:mb-8 font-sans transition-all duration-300">
                  {currentSlide.description}
                </p>

                {/* Polished Highlight Badges */}
                <div className="flex flex-wrap gap-2.5 sm:gap-3 mb-8 sm:mb-10">
                  {currentSlide.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-300/80 px-3.5 sm:px-4 py-2 rounded-xl shadow-xs"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#F48033]" />
                      <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 uppercase">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Primary Action Button */}
                <div>
                  <button
                    onClick={() => onOpenEnquiry && onOpenEnquiry()}
                    className="w-full sm:w-auto group relative overflow-hidden rounded-lg bg-[#F48033] hover:bg-[#d96a20] px-8 sm:px-9 py-3.5 sm:py-4 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_6px_22px_rgba(244,128,51,0.4)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(244,128,51,0.6)] hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <span>{currentSlide.ctaText}</span>
                    <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT COLUMN: EXPANDED FULL-WIDTH 3D ANIMATION EMBEDDED OBJECT */}
          <div className="lg:col-span-6 relative h-full min-h-[280px] sm:min-h-[480px] lg:min-h-[620px] flex items-center justify-center pointer-events-none select-none">
            <ScrollReveal direction="right" delay={150} className="w-full h-full">
              {/* Expanded Right Container */}
              <div className="relative w-full h-full min-h-[280px] sm:min-h-[480px] lg:min-h-[620px] overflow-hidden rounded-2xl flex items-center justify-center pointer-events-none select-none shadow-xl border border-slate-300/60 bg-[#D8DFE1]/50">
                
                {/* Native video element */}
                <video
                  ref={videoRef}
                  src={aboutBgVideo}
                  muted
                  playsInline
                  preload="auto"
                  disablePictureInPicture
                  controlsList="nodownload no-remote-playback noremoteplayback nofullscreen"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className="w-full h-full object-cover mix-blend-multiply filter contrast-[1.05] pointer-events-none select-none"
                />

                {/* Static Last Frame Fallback */}
                <img
                  src={lastFrameBg}
                  alt="3D Architectural Building Model"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-0 pointer-events-none select-none"
                />

                {/* Soft blend edges */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#D8DFE1] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#D8DFE1] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-[#D8DFE1] to-transparent pointer-events-none z-10" />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#D8DFE1] to-transparent pointer-events-none z-10" />
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>

    </section>
  );
};
