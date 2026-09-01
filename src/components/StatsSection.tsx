import React, { useEffect, useState, useRef } from 'react';
import { COMPANY_STATS } from '../data/projectsData';
import { ScrollReveal } from './ScrollReveal';

export const StatsSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState<number[]>(COMPANY_STATS.map(() => 0));
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          COMPANY_STATS.forEach((stat, idx) => {
            const duration = 1800;
            const steps = 40;
            const stepTime = duration / steps;
            const increment = stat.value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                current = stat.value;
                clearInterval(timer);
              }
              setCounts((prev) => {
                const updated = [...prev];
                updated[idx] = Math.floor(current);
                return updated;
              });
            }, stepTime);
          });
        }
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      ref={sectionRef}
      className="py-16 relative bg-slate-100 border-b border-slate-200 overflow-hidden"
    >
      <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {COMPANY_STATS.map((stat, idx) => (
            <ScrollReveal key={stat.label} direction="up" delay={idx * 100}>
              <div
                style={{
                  boxShadow: 'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
                }}
                className="relative p-6 sm:p-8 bg-white border border-slate-200 hover:border-[#FF5E1B] rounded-xl transition-all duration-300 group h-full"
              >
                {/* Technical Corner Crosshairs */}
                <div className="absolute top-2 left-2 text-[10px] font-mono text-[#FF5E1B] opacity-60">
                  +
                </div>
                <div className="absolute top-2 right-2 text-[10px] font-mono text-[#FF5E1B] opacity-60">
                  +
                </div>

                {/* Number Count */}
                <div className="font-heading text-4xl sm:text-6xl font-black text-slate-900 group-hover:text-[#FF5E1B] transition-colors flex items-baseline">
                  <span>{counts[idx]}</span>
                  <span className="text-[#FF5E1B] ml-1">{stat.suffix}</span>
                </div>

                {/* Label */}
                <div className="mt-3 font-mono text-xs text-slate-600 uppercase tracking-widest font-bold">
                  {stat.label}
                </div>

                {/* Bottom Orange Indicator Bar */}
                <div className="mt-4 w-12 h-[3px] bg-[#FF5E1B]/30 group-hover:w-full group-hover:bg-[#FF5E1B] transition-all duration-500 rounded-full" />
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
