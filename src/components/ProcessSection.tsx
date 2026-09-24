import React from 'react';
import {
  MessageSquare,
  Lightbulb,
  FileText,
  Home,
  HardHat,
  Check,
  ArrowRight,
} from 'lucide-react';
import ourProcessPng from '../assets/ourProcess.png';
import ourProcessWebp from '../assets/ourProcess.webp';

interface ProcessSectionProps {
  onOpenEnquiry: (serviceName?: string) => void;
  onViewFullProcess?: () => void;
}

interface StepItem {
  number: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  isHighlight?: boolean;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onOpenEnquiry, onViewFullProcess }) => {
  const steps: StepItem[] = [
    {
      number: '01',
      title: 'Consultation & Requirement',
      icon: <MessageSquare className="w-6 h-6 stroke-[1.9]" />,
    },
    {
      number: '02',
      title: 'Concept & Design Development',
      icon: <Lightbulb className="w-6 h-6 stroke-[1.9]" />,
    },
    {
      number: '03',
      title: 'Planning & Documentation',
      icon: <FileText className="w-6 h-6 stroke-[1.9]" />,
    },
    {
      number: '04',
      title: 'Elevation & Interior Design',
      icon: <Home className="w-6 h-6 stroke-[1.9]" />,
    },
    {
      number: '05',
      title: 'Execution & Site Supervision',
      icon: <HardHat className="w-6 h-6 stroke-[1.9]" />,
    },
    {
      number: '06',
      title: 'Final Handover',
      subtitle: 'Your Dream Home',
      icon: <Check className="w-6 h-6 stroke-[2.8]" />,
      isHighlight: true,
    },
  ];

  const whyChooseUsFeatures = [
    'End-to-End Services',
    'Experienced Team',
    'Premium Quality & Detail',
    'On-Time Delivery',
    'Client-Centric Approach',
  ];

  return (
    <section id="process" className="py-14 sm:py-20 lg:py-24 bg-white relative overflow-hidden select-none border-b border-[#F1EFEC]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        {/* ── 1. SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12">
          <div className="max-w-3xl">
            <span className="font-['Montserrat',sans-serif] text-base sm:text-lg lg:text-xl font-bold uppercase tracking-[0.14em] text-[#FF6F2C] mb-2.5 block">
              OUR PROCESS
            </span>
            <h2 className="font-['Montserrat',sans-serif] font-semibold text-3xl sm:text-4xl lg:text-[2.65rem] text-[#263238] tracking-tight leading-tight mb-3">
              Our Complete Roadmap
            </h2>
            <div className="font-['Inter',sans-serif] text-[#667078] text-sm sm:text-base leading-relaxed max-w-2xl font-normal space-y-0.5">
              <p>A smooth journey from your idea to your dream home.</p>
              <p>We make the entire process simple, transparent and stress-free.</p>
            </div>
          </div>

          <div className="shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => {
                if (onViewFullProcess) {
                  onViewFullProcess();
                } else {
                  onOpenEnquiry('Our Complete Roadmap');
                }
              }}
              className="inline-flex items-center gap-2 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-semibold text-sm sm:text-base group transition-colors cursor-pointer"
            >
              <span>View Full Process</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── 2. 6-STEP HORIZONTAL ROADMAP ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-3 my-10 sm:my-14">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative flex flex-col items-start group">
              {/* Top Row: Icon circle + connector arrow for large screens */}
              <div className="flex items-center w-full justify-between">
                <div
                  className={`w-13 h-13 sm:w-14 sm:h-14 rounded-[8px] flex items-center justify-center shrink-0 shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                    step.isHighlight
                      ? 'bg-[#FF6F2C] text-white shadow-xs'
                      : 'bg-[#FFF1E9] border border-[#FFF1E9] text-[#FF6F2C]'
                  }`}
                >
                  {step.icon}
                </div>

                {/* Arrow Connector between steps */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex flex-1 items-center justify-center px-1">
                    <ArrowRight className="w-4 h-4 text-[#D9D6D2]" />
                  </div>
                )}
              </div>

              {/* Step Number */}
              <span className="font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm text-[#FF6F2C] mt-3.5 mb-1 tracking-wider block">
                {step.number}
              </span>

              {/* Step Title: Montserrat SemiBold 600 */}
              <h4 className="font-['Montserrat',sans-serif] font-semibold text-sm sm:text-[15px] text-[#263238] leading-snug">
                {step.title}
              </h4>

              {/* Step Subtitle */}
              {step.subtitle && (
                <p className="font-['Inter',sans-serif] text-xs font-medium text-[#667078] mt-1 leading-normal">
                  {step.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── 3. BOTTOM SPLIT: IMAGE + "WHY CHOOSE US" ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch pt-2 sm:pt-4">
          {/* Left Column: Embedded Image (Radius 6-10px) */}
          <div className="lg:col-span-7 rounded-[10px] overflow-hidden shadow-xs border border-[#F1EFEC] relative min-h-[320px] sm:min-h-[420px] h-full">
            <picture className="w-full h-full block">
              <source srcSet={ourProcessWebp} type="image/webp" />
              <img
                src={ourProcessPng}
                alt="Your Vision, Our Expertise - PERSQFT Constructions"
                loading="lazy"
                decoding="async"
                draggable={false}
                className="w-full h-full object-cover object-center"
              />
            </picture>
          </div>

          {/* Right Column: Why Choose Us Card (Warm Off-White #FAF8F5, Border #F1EFEC, Radius 6-10px) */}
          <div className="lg:col-span-5 bg-[#FAF8F5] rounded-[10px] border border-[#F1EFEC] p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="font-['Montserrat',sans-serif] font-semibold text-2xl sm:text-3xl text-[#263238] tracking-tight mb-2">
                Why Choose Us
              </h3>
              <p className="font-['Inter',sans-serif] text-[#667078] text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 font-normal">
                We don't just design spaces, we build better living.
              </p>

              {/* Checklist */}
              <ul className="space-y-3.5 sm:space-y-4">
                {whyChooseUsFeatures.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-[4px] bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[2.6]" />
                    </div>
                    <span className="font-['Montserrat',sans-serif] font-semibold text-sm sm:text-base text-[#263238]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button (Secondary CTA: Background #FFFFFF, Text #263238, Border 1px #FF6F2C, Radius 6-8px, Hover #FFF1E9) */}
            <div>
              <button
                onClick={() => onOpenEnquiry('Why Choose Us - Know More')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#FFF1E9] text-[#263238] border border-[#FF6F2C] px-7 sm:px-8 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm sm:text-[14.5px] transition-all duration-200 cursor-pointer w-fit mt-8 active:scale-95 shadow-xs"
              >
                <span>Know More</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

