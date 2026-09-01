import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/projectsData';
import servicesBG from '../assets/servicesBG.png';
import { Check, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ServicesSectionProps {
  onOpenEnquiry: (serviceName?: string) => void;
}

// Dual-tone custom line-art SVGs matching user reference screenshot
const RenderServiceIcon: React.FC<{ serviceId: string }> = ({ serviceId }) => {
  switch (serviceId) {
    case '01': // Custom Home Builds
      return (
        <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 36V22L22 14L32 22V36H12Z" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26 10L36 18" stroke="#F48033" strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M8 36H36" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round"/>
          <circle cx="38" cy="26" r="4" fill="#FFEAE0" stroke="#F48033" strokeWidth="2"/>
          <path d="M38 30V36" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case '02': // Home Extensions
      return (
        <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 36V24L20 16L30 24V36H10Z" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 36H34" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M38 34V14M38 14L33 19M38 14L43 19" stroke="#F48033" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26 14H36" stroke="#F48033" strokeWidth="1.8" strokeDasharray="2 2"/>
        </svg>
      );
    case '03': // Renovation & Remodeling
      return (
        <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 30V22L24 16L32 22V30H16Z" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M38 20C39.5 23 39.5 26.5 38 29.5C35.5 34.5 30 38 24 38C16.3 38 10 31.7 10 24" stroke="#F48033" strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M10 28L10 24L14 24" stroke="#F48033" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 28C8.5 25 8.5 21.5 10 18.5C12.5 13.5 18 10 24 10C31.7 10 38 16.3 38 24" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M38 20L38 24L34 24" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case '04': // Real Estate Development
      return (
        <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 38V26H18V38" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18 38V12H30V38" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 38V20H38V38" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 38H42" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round"/>
          <circle cx="24" cy="17" r="1.5" fill="#F48033"/>
          <circle cx="24" cy="23" r="1.5" fill="#F48033"/>
          <circle cx="24" cy="29" r="1.5" fill="#F48033"/>
        </svg>
      );
    case '05': // Architecture & Design
      return (
        <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 36L24 12L36 36" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 28H32" stroke="#F48033" strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M8 36H40" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round"/>
          <circle cx="24" cy="20" r="2" fill="#F48033"/>
        </svg>
      );
    case '06': // Project Management
      return (
        <svg className="w-7 h-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="12" y="10" width="24" height="30" rx="3" stroke="#1E293B" strokeWidth="2.4"/>
          <path d="M18 18H30" stroke="#F48033" strokeWidth="2.4" strokeLinecap="round"/>
          <path d="M18 24H30" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
          <path d="M18 30H24" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
          <path d="M20 6H28" stroke="#F48033" strokeWidth="2.4" strokeLinecap="round"/>
        </svg>
      );
    default:
      return null;
  }
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenEnquiry }) => {
  const [selectedService, setSelectedService] = useState<typeof SERVICES_DATA[0] | null>(null);

  return (
    <section id="services" className="py-16 sm:py-24 relative bg-[#FAFCFF] border-b border-slate-200/80 overflow-hidden select-none">
      
      {/* ── BACKGROUND IMAGE (OPACITY 0.08 MULTIPLY FOR CLEAN ELEVATED FINISH) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src={servicesBG}
          alt="Architectural Blueprint Structural Overlay"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-cover object-center opacity-[0.075] mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFCFF]/80 via-transparent to-[#FAFCFF]/90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-12 sm:mb-16">
            {/* Top Orange Roof Outline Icon */}
            <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center text-[#F48033] transition-transform duration-300 hover:scale-110">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4L4 14V28H28V14L16 4Z" stroke="#F48033" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight mb-2">
              Our <span className="text-[#F48033]">Services</span>
            </h2>

            {/* Small Orange Underline Accent */}
            <div className="w-8 h-[2px] bg-[#F48033] mx-auto mb-3 rounded-full" />

            <p className="text-slate-600 text-xs sm:text-sm font-normal max-w-md mx-auto leading-relaxed">
              Explore our range of expert solutions — each crafted with care and commitment to quality.
            </p>
          </div>
        </ScrollReveal>

        {/* Compact Premium Service Cards — 3 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-4">
          {SERVICES_DATA.map((service, idx) => {
            return (
              <ScrollReveal key={service.id} direction="up" delay={(idx % 3) * 80}>
                <div
                  onClick={() => setSelectedService(service)}
                  className="group relative bg-white rounded-xl cursor-pointer border border-slate-200/80 hover:border-[#F48033]/50 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(244,128,51,0.13)] overflow-hidden flex items-center gap-4 p-4"
                >
                  {/* Left orange accent bar */}
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-[#F48033] to-[#FF8C42] rounded-l-xl transition-all duration-300 group-hover:w-1" />

                  {/* Icon Badge */}
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFF4EC] to-[#FFE8D5] border border-[#F48033]/20 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                    <RenderServiceIcon serviceId={service.id} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-sm font-bold text-slate-900 group-hover:text-[#F48033] transition-colors duration-200 truncate leading-tight mb-1">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1 flex-wrap">
                      {service.tagline.map((tag, i) => (
                        <React.Fragment key={i}>
                          <span className="text-[10px] font-mono text-slate-500 leading-none">{tag}</span>
                          {i < service.tagline.length - 1 && (
                            <span className="text-[#F48033] text-[9px] font-black leading-none">›</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-[#F48033] group-hover:border-[#F48033] transition-all duration-300">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 p-6 sm:p-10 rounded-3xl shadow-2xl">
            
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 font-sans text-xs font-bold text-slate-500 hover:text-[#F48033] border border-slate-200 hover:border-[#F48033] px-3 py-1.5 uppercase rounded-lg transition-colors"
            >
              CLOSE [X]
            </button>

            <div className="text-xs font-bold text-[#F48033] uppercase tracking-widest mb-2">
              SERVICE OVERVIEW
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4">
              {selectedService.title}
            </h3>

            <p className="text-slate-600 text-base leading-relaxed mb-6 font-normal">
              {selectedService.fullDesc}
            </p>

            <div className="mb-8">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                KEY EXECUTION HIGHLIGHTS:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedService.highlights.map((h) => (
                  <div key={h} className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-800 rounded-xl">
                    <Check className="w-4 h-4 text-[#F48033] shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={() => {
                  const s = selectedService.title;
                  setSelectedService(null);
                  onOpenEnquiry(s);
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#F48033] hover:bg-[#d96a20] text-white font-bold text-xs tracking-wider uppercase rounded-xl shadow-md transition-colors"
              >
                REQUEST PROPOSAL FOR THIS SERVICE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
