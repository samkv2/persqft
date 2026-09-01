import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2, Building2, Pause, Play } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  gender: 'male' | 'female';
  projectType: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 1,
    name: 'Mr. Anoop Shukla',
    role: 'Employed at Secretariat Lucknow',
    location: 'Lucknow, UP',
    quote: 'PERSQFT Construction exceeded our expectations. Every detail from structural integrity to interior execution was delivered with pristine craftsmanship. We highly recommend them.',
    rating: 5,
    gender: 'male',
    projectType: 'Luxury Villa Construction',
  },
  {
    id: 2,
    name: 'Mr. R.K. Verma',
    role: 'Senior Guard at INDIAN RAILWAYS',
    location: 'Kanpur, UP',
    quote: 'Every corner reflects our vision. Thanks to the PERSQFT team for bringing our dream home to life with complete transparency and on-time handover.',
    rating: 5,
    gender: 'male',
    projectType: 'Independent Residence',
  },
  {
    id: 3,
    name: 'Dr. Sunita Sharma',
    role: 'Senior Medical Officer',
    location: 'Noida, NCR',
    quote: 'Building our family home was smooth and stress-free. The 3D walkthroughs gave us exact clarity before construction even began. Outstanding team!',
    rating: 5,
    gender: 'female',
    projectType: 'Turnkey Residential',
  },
  {
    id: 4,
    name: 'Er. Vikramaditya Singh',
    role: 'Chief Structural Consultant',
    location: 'Lucknow, UP',
    quote: 'As an engineer myself, I was deeply impressed by PERSQFT\'s structural precision and strict adherence to architectural standards throughout our commercial project.',
    rating: 5,
    gender: 'male',
    projectType: 'Commercial Complex',
  },
  {
    id: 5,
    name: 'Mrs. Priya Malhotra',
    role: 'Interior Architect',
    location: 'Gomti Nagar, Lucknow',
    quote: 'Working with PERSQFT was absolute bliss. Their structural finesse and willingness to collaborate made our multi-level home a true masterpiece.',
    rating: 5,
    gender: 'female',
    projectType: 'Contemporary Residence',
  },
  {
    id: 6,
    name: 'Mr. Alok Trivedi',
    role: 'Director, Trivedi Enterprises',
    location: 'Lucknow, UP',
    quote: 'Top-notch quality, transparent billing, and zero delay in project timeline. PERSQFT is hands down the best architectural construction firm in the region.',
    rating: 5,
    gender: 'male',
    projectType: 'Corporate Office',
  },
];

export const TestimonialsSection: React.FC = () => {
  // Triplicate array for seamless infinite looping
  const displayItems = [...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA, ...TESTIMONIALS_DATA];
  const [currentIndex, setCurrentIndex] = useState(TESTIMONIALS_DATA.length);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play infinite scrolling timer (3.5s interval)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Seamless wrap around when track reaches end of duplicate set
  const handleTransitionEnd = () => {
    if (currentIndex >= TESTIMONIALS_DATA.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(TESTIMONIALS_DATA.length);
    } else if (currentIndex < TESTIMONIALS_DATA.length) {
      setIsTransitioning(false);
      setCurrentIndex(TESTIMONIALS_DATA.length * 2 - 1);
    }
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const activeNormalizedIndex = currentIndex % TESTIMONIALS_DATA.length;

  return (
    <section id="testimonials" className="py-16 sm:py-20 relative bg-[#F8FAFC] text-slate-900 border-b border-slate-200/80 overflow-hidden select-none">
      {/* Background Blueprint Grid & Warm Ambient Accents */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-15 pointer-events-none" />
      <div className="w-80 h-80 bg-[#FCE8D5]/60 rounded-full blur-3xl absolute -top-12 -right-12 pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header & Control Strip */}
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#F48033] uppercase tracking-[0.25em] mb-2 px-3 py-1 bg-[#F48033]/10 border border-[#F48033]/20 rounded-full">
                <Quote className="w-3.5 h-3.5 text-[#F48033]" />
                <span>CLIENT TESTIMONIALS</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none mt-1">
                What Our <span className="text-[#F48033]">Clients Say</span>
              </h2>
              
              <p className="text-slate-600 text-xs sm:text-sm font-normal mt-2.5 max-w-xl">
                From a couple to large Indian family, we have houses built with emotions for everyone.
              </p>
            </div>

            {/* Controls: Prev / Pause / Next */}
            <div className="flex items-center space-x-3 self-start md:self-auto">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:bg-[#F48033] hover:text-white shadow-sm flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                title="Previous Review"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="px-3 py-2 rounded-full bg-white border border-slate-200/90 text-slate-700 font-mono text-[11px] font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                title={isAutoPlaying ? 'Pause Slide' : 'Play Slide'}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#F48033]" />
                    <span>AUTOPLAY</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    <span>PAUSED</span>
                  </>
                )}
              </button>

              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white border border-slate-200/90 text-slate-700 hover:bg-[#F48033] hover:text-white shadow-sm flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
                title="Next Review"
                aria-label="Next Review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* SINGLE ROW INFINITE CAROUSEL SLIDER (3 CARDS IN A ROW ON DESKTOP) */}
        <div
          className="relative overflow-hidden w-full py-2"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            onTransitionEnd={handleTransitionEnd}
            className={`flex ${
              isTransitioning
                ? 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'
                : 'transition-none'
            }`}
            style={{
              transform: `translateX(-${(currentIndex * 100) / 3}%)`,
            }}
          >
            {displayItems.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
              >
                <div className="bg-white border border-slate-200/90 hover:border-[#F48033]/60 rounded-2xl p-6 sm:p-7 shadow-[0_6px_24px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group transform hover:-translate-y-1 relative">
                  
                  <div>
                    {/* Top Row: 5 Star Rating & Project Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#F48033] text-[#F48033]" />
                        ))}
                      </div>

                      <div className="flex items-center space-x-1 text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/60">
                        <Building2 className="w-3 h-3 text-[#F48033]" />
                        <span className="truncate max-w-[130px]">{item.projectType}</span>
                      </div>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans italic mb-6">
                      "{item.quote}"
                    </p>
                  </div>

                  {/* Client Profile Footer with Vector Avatar (Male / Female) */}
                  <div className="flex items-center space-x-3.5 pt-4 border-t border-slate-100">
                    
                    {/* AVATAR BADGE ICON (MALE VS FEMALE) */}
                    <div className="relative shrink-0">
                      {item.gender === 'male' ? (
                        /* Male Avatar Badge */
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#080E1A] to-[#1E293B] text-white flex items-center justify-center border-2 border-[#F48033]/40 shadow-xs">
                          <svg className="w-6 h-6 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 8c-1.654 0-3-1.346-3-3s1.346-3 3-3 3 1.346 3 3-1.346 3-3 3zm0 3.75c-4.136 0-7.5 2.619-7.5 5.833 0 .23.187.417.417.417h14.166c.23 0 .417-.187.417-.417 0-3.214-3.364-5.833-7.5-5.833zm-6.602 5.083c.48-2.213 3.328-4.25 6.602-4.25s6.122 2.037 6.602 4.25H5.398z" />
                          </svg>
                        </div>
                      ) : (
                        /* Female Avatar Badge */
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F48033] to-[#d96a20] text-white flex items-center justify-center border-2 border-orange-300/60 shadow-xs">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm0 3.5c-3.866 0-7 2.239-7 5v.5a1 1 0 001 1h12a1 1 0 001-1v-.5c0-2.761-3.134-5-7-5zm-5 4.5c.357-1.54 2.443-3 5-3s4.643 1.46 5 3H7z" />
                          </svg>
                        </div>
                      )}

                      {/* Verified Badge Checkmark */}
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      </div>
                    </div>

                    <div className="overflow-hidden">
                      <h4 className="font-heading text-sm font-bold text-slate-900 group-hover:text-[#F48033] transition-colors truncate">
                        {item.name}
                      </h4>
                      <p className="text-slate-500 text-xs font-normal truncate">
                        {item.role}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM PAGINATION INDICATOR DOTS */}
        <div className="mt-8 flex items-center justify-center gap-1.5">
          {TESTIMONIALS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(TESTIMONIALS_DATA.length + idx);
                setIsAutoPlaying(false);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeNormalizedIndex === idx
                  ? 'w-6 h-2 bg-[#F48033]'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to review slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
