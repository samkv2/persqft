import React, { useState, useEffect } from 'react';
import {
  Users,
  FileCheck,
  Clock,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import clientAvatar1Webp from '../assets/clientAvatar1.webp';
import clientAvatar1Jpg from '../assets/clientAvatar1.jpg';
import commentSegPng from '../assets/commentSeg.png';
import commentSegWebp from '../assets/commentSeg.webp';

interface TestimonialItem {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatarWebp: string;
  avatarJpg: string;
}

interface TestimonialsSectionProps {
  onOpenEnquiry?: (subject?: string) => void;
  onViewMoreReviews?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ onOpenEnquiry, onViewMoreReviews }) => {
  const testimonials: TestimonialItem[] = [
    {
      id: 1,
      name: 'Rohit Sharma',
      role: 'Homeowner',
      quote:
        '“The team was incredibly professional and understood our vision perfectly. From planning to final handover, everything was smooth and beyond our expectations!”',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
    },
    {
      id: 2,
      name: 'Anoop Shukla',
      role: 'Luxury Villa Owner, Lucknow',
      quote:
        '“PERSQFT Construction exceeded our expectations. Every detail from structural integrity to interior execution was delivered with pristine craftsmanship. We highly recommend them!”',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
    },
    {
      id: 3,
      name: 'Dr. Sunita Sharma',
      role: 'Turnkey Residential Client',
      quote:
        '“Building our family home was smooth and stress-free. The 3D walkthroughs gave us exact clarity before construction even began. Truly an outstanding engineering team!”',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
    },
    {
      id: 4,
      name: 'Er. Vikramaditya Singh',
      role: 'Commercial Project Consultant',
      quote:
        '“As an engineer myself, I was deeply impressed by PERSQFT’s structural precision, quality testing, and strict adherence to architectural standards throughout our project.”',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // 2-second automatic slide time with pause on hover/touch
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [testimonials.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
  };

  const stats = [
    {
      number: '500+',
      label: 'Happy Clients',
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />,
    },
    {
      number: '250+',
      label: 'Projects Completed',
      icon: <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />,
    },
    {
      number: '10+',
      label: 'Years of Experience',
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />,
    },
    {
      number: '100%',
      label: 'Client Satisfaction',
      icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />,
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-14 sm:py-20 lg:py-24 bg-white relative overflow-hidden select-none border-b border-[#F1EFEC]"
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        {/* ── 1. SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="font-['Montserrat',sans-serif] text-base sm:text-lg lg:text-xl font-bold uppercase tracking-[0.14em] text-[#FF6F2C] mb-2.5 block">
              OUR TESTIMONIALS
            </span>
            <h2 className="font-['Montserrat',sans-serif] font-semibold text-3xl sm:text-4xl lg:text-[2.65rem] text-[#263238] tracking-tight leading-tight">
              What Our Clients Say
            </h2>
          </div>

          <div className="shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => {
                if (onViewMoreReviews) {
                  onViewMoreReviews();
                } else {
                  onOpenEnquiry?.('Client Testimonials & Reviews');
                }
              }}
              className="inline-flex items-center gap-2 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-semibold text-sm sm:text-base group transition-colors cursor-pointer"
            >
              <span>View More Reviews</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── 2. SPOTLIGHT TESTIMONIAL & VILLA SHOWCASE ── */}
        <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-8 mb-12 sm:mb-16">
          {/* Left Review Card Carousel Viewport (Smooth horizontal sliding animation) */}
          <div 
            className="w-full lg:flex-1 overflow-hidden rounded-[10px]"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {testimonials.map((item) => (
                <div key={item.id} className="w-full shrink-0">
                  <div className="bg-white rounded-[10px] p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_rgba(38,50,56,0.04)] border border-[#F1EFEC] flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7 transition-all duration-300 h-full min-h-[220px]">
                    {/* Circular Avatar Photo */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden shrink-0 border-2 border-[#FFF1E9] shadow-xs bg-[#FAF8F5]">
                      <picture className="w-full h-full">
                        <source srcSet={item.avatarWebp} type="image/webp" />
                        <img
                          src={item.avatarJpg}
                          alt={`${item.name} - ${item.role}`}
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>

                    {/* Quote & Author Info */}
                    <div className="flex-1 flex flex-col justify-between text-center sm:text-left min-w-0">
                      <p className="font-['Inter',sans-serif] text-[#263238] text-sm sm:text-base md:text-[16.5px] leading-relaxed font-normal">
                        {item.quote}
                      </p>

                      <div className="mt-4 sm:mt-5 pt-3 border-t border-[#F1EFEC] sm:border-0 sm:pt-0">
                        <h3 className="font-['Montserrat',sans-serif] font-semibold text-base sm:text-lg text-[#263238] leading-tight truncate">
                          {item.name}
                        </h3>
                        <p className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm font-normal mt-0.5 truncate">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Controls (Dots indicator & Arrow Navigation) */}
          <div className="flex lg:flex-col items-center justify-center gap-3 sm:gap-4 shrink-0 px-2 py-1">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    currentIndex === i
                      ? 'w-3 h-3 bg-[#FF6F2C]'
                      : 'w-2 h-2 bg-[#D9D6D2] hover:bg-[#667078]'
                  }`}
                />
              ))}
            </div>

            {/* Arrow Nav Buttons (Radius 6-8px, border #F1EFEC) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-[8px] bg-white shadow-2xs border border-[#F1EFEC] hover:border-[#FF6F2C] text-[#263238] hover:text-[#FF6F2C] flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-[8px] bg-white shadow-2xs border border-[#F1EFEC] hover:border-[#FF6F2C] text-[#263238] hover:text-[#FF6F2C] flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Visual: Modern Luxury Villa (commentSeg.png) + Floating Cursive Script */}
          <div className="w-full lg:w-[380px] xl:w-[420px] rounded-[10px] overflow-hidden shadow-[0_4px_24px_rgba(38,50,56,0.05)] border border-[#F1EFEC] relative shrink-0 aspect-[16/10] bg-[#FAF8F5] group">
            <picture className="w-full h-full block">
              <source srcSet={commentSegWebp} type="image/webp" />
              <img
                src={commentSegPng}
                alt="PERSQFT Luxury Finished Villa"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </picture>

            {/* Floating Cursive Script "Happy Clients Happy Homes ♡" */}
            <div className="absolute right-3 sm:right-5 bottom-3 sm:bottom-4 pointer-events-none select-none z-10">
              <div className="font-['Caveat',cursive] font-bold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] -rotate-6 flex flex-col items-end leading-tight">
                <span>Happy Clients</span>
                <span className="flex items-center gap-1">
                  <span>Happy Homes</span>
                  <span className="text-[#FF6F2C]">♡</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. BOTTOM STATS BAR: Very Light Orange (#FFF7F2, Border #FFF1E9, Radius 6-10px) ── */}
        <div className="w-full bg-[#FFF7F2] rounded-[10px] border border-[#FFF1E9] p-5 sm:p-7 lg:p-9 shadow-xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-[#FFF1E9]">
            {stats.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3.5 sm:gap-4 lg:px-6 xl:px-8"
              >
                {/* Orange Icon Badge (Radius 6-8px, #FFF1E9 bg, #FF6F2C icon) */}
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-[8px] bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 shadow-2xs">
                  {item.icon}
                </div>

                {/* Stat Text */}
                <div className="flex flex-col">
                  <span className="font-['Montserrat',sans-serif] font-bold text-2xl sm:text-3xl text-[#263238] tracking-tight leading-none">
                    {item.number}
                  </span>
                  <span className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm font-medium mt-1 leading-snug">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
