import React from 'react';
import { ArrowRight } from 'lucide-react';
import elevationWebp from '../assets/serviceElevation.webp';
import elevationJpg from '../assets/serviceElevation.jpg';
import interiorWebp from '../assets/serviceInterior.webp';
import interiorJpg from '../assets/serviceInterior.jpg';
import planningWebp from '../assets/servicePlanning.webp';
import planningJpg from '../assets/servicePlanning.jpg';
import drawingsWebp from '../assets/serviceDrawings.webp';
import drawingsJpg from '../assets/serviceDrawings.jpg';

interface ServicesSectionProps {
  onOpenEnquiry: (serviceName?: string) => void;
  onExploreAllServices?: () => void;
}

interface ServiceCardData {
  id: string;
  title: string;
  description: string;
  imageWebp: string;
  imageJpg: string;
  icon: React.ReactNode;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenEnquiry, onExploreAllServices }) => {
  const services: ServiceCardData[] = [
    {
      id: 'elevation-design',
      title: 'Elevation Design',
      description: 'Modern, aesthetic and functional elevations that make a lasting impression.',
      imageWebp: elevationWebp,
      imageJpg: elevationJpg,
      icon: (
        <svg
          className="w-8 h-8 text-[#FF6F2C]"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Elevation house facade line-art */}
          <path d="M4 14L16 4L28 14V27C28 27.5523 27.5523 28 27 28H5C4.44772 28 4 27.5523 4 27V14Z" />
          <path d="M12 28V16H20V28" />
          <path d="M16 4V10" />
          <circle cx="16" cy="12" r="1.5" fill="#FF6F2C" />
        </svg>
      ),
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      description: 'Thoughtfully designed interiors for beautiful, comfortable living.',
      imageWebp: interiorWebp,
      imageJpg: interiorJpg,
      icon: (
        <svg
          className="w-8 h-8 text-[#FF6F2C]"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Armchair / luxury sofa interior line-art */}
          <path d="M6 14C6 11.7909 7.79086 10 10 10H22C24.2091 10 26 11.7909 26 14V23H6V14Z" />
          <path d="M3 16C3 14.8954 3.89543 14 5 14H6V24H5C3.89543 24 3 23.1046 3 22V16Z" />
          <path d="M26 14H27C28.1046 14 29 14.8954 29 16V22C29 23.1046 28.1046 24 27 24H26V14Z" />
          <path d="M8 24V28M24 24V28" />
        </svg>
      ),
    },
    {
      id: 'planning',
      title: 'Planning',
      description: 'Smart space planning for maximum utility and better flow.',
      imageWebp: planningWebp,
      imageJpg: planningJpg,
      icon: (
        <svg
          className="w-8 h-8 text-[#FF6F2C]"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Planning grid / site camera layout */}
          <rect x="4" y="6" width="24" height="20" rx="4" />
          <circle cx="16" cy="16" r="4.5" />
          <path d="M12 6V4M20 6V4" />
          <path d="M23 10H24" />
        </svg>
      ),
    },
    {
      id: 'drawings',
      title: 'Drawings',
      description: 'Detailed architectural, structural and working drawings for a hassle-free build.',
      imageWebp: drawingsWebp,
      imageJpg: drawingsJpg,
      icon: (
        <svg
          className="w-8 h-8 text-[#FF6F2C]"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Drafting geometric compass rosette */}
          <path d="M16 3L20 12L29 16L20 20L16 29L12 20L3 16L12 12L16 3Z" />
          <circle cx="16" cy="16" r="2.5" fill="#FF6F2C" />
        </svg>
      ),
    },
  ];

  return (
    <section id="services" className="py-14 sm:py-20 lg:py-24 bg-white relative overflow-hidden select-none">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        {/* ── SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12">
          <div className="max-w-3xl">
            <span className="font-['Montserrat',sans-serif] text-base sm:text-lg lg:text-xl font-bold uppercase tracking-[0.14em] text-[#FF6F2C] mb-2.5 block">
              OUR SERVICES
            </span>
            <h2 className="font-['Montserrat',sans-serif] font-semibold text-3xl sm:text-4xl lg:text-[2.65rem] text-[#263238] tracking-tight leading-tight mb-3">
              Complete Design &amp; Build Solutions
            </h2>
            <p className="font-['Inter',sans-serif] text-[#667078] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              From stunning elevations to elegant interiors, precise planning and detailed drawings — we handle everything under one roof.
            </p>
          </div>

          <div className="shrink-0 pt-2 md:pt-0">
            <button
              onClick={() => {
                if (onExploreAllServices) {
                  onExploreAllServices();
                } else {
                  onOpenEnquiry('All Services');
                }
              }}
              className="inline-flex items-center gap-2 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-semibold text-sm sm:text-base group transition-colors cursor-pointer"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── 4 SERVICE CARDS GRID (Cards: 6-10px radius, border #F1EFEC, soft shadow) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {services.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[10px] border border-[#F1EFEC] shadow-[0_4px_20px_rgba(38,50,56,0.04)] hover:shadow-[0_16px_36px_rgba(38,50,56,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Card Top: Image thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                <picture className="w-full h-full">
                  <source srcSet={item.imageWebp} type="image/webp" />
                  <img
                    src={item.imageJpg}
                    alt={`${item.title} by PERSQFT`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </picture>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                <div>
                  {/* Service Icon */}
                  <div className="mb-4 inline-block">{item.icon}</div>

                  {/* Service Title: Montserrat SemiBold 600 */}
                  <h3 className="font-['Montserrat',sans-serif] font-semibold text-xl sm:text-[22px] text-[#263238] tracking-tight mb-2.5 group-hover:text-[#FF6F2C] transition-colors">
                    {item.title}
                  </h3>

                  {/* Service Description: Inter Regular 400 */}
                  <p className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                {/* Learn More Action Button */}
                <button
                  onClick={() => onOpenEnquiry(item.title)}
                  className="inline-flex items-center gap-1.5 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-semibold text-sm sm:text-[14.5px] group/btn transition-colors cursor-pointer text-left"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
