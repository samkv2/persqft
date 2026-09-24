import React, { useState, useEffect } from 'react';
import { ArrowRight, FileText, ExternalLink, Palette, Compass, Ruler, Building, Layers, Wrench } from 'lucide-react';
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

export interface ServiceCardData {
  id: string | number;
  title: string;
  tagline?: string;
  category?: string;
  description: string;
  image?: string;
  imageWebp?: string;
  imageJpg?: string;
  iconName?: string;
  brochurePdf?: string | null;
  brochureTitle?: string;
  deliverables?: string;
  timeline?: string;
  badge?: string | null;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenEnquiry, onExploreAllServices }) => {
  // Built-in static fallbacks
  const defaultServices: ServiceCardData[] = [
    {
      id: 'elevation-design',
      title: 'Elevation Design',
      tagline: 'Modern, Aesthetic & Distinctive Facades',
      category: 'Design',
      description: 'Modern, aesthetic and functional elevations that make a lasting impression.',
      imageWebp: elevationWebp,
      imageJpg: elevationJpg,
      iconName: 'home',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Elevation Design Technical Brochure (PDF)',
    },
    {
      id: 'interior-design',
      title: 'Interior Design',
      tagline: 'Sophisticated Living Tailored to Your Taste',
      category: 'Interior',
      description: 'Thoughtfully designed interiors for beautiful, comfortable living.',
      imageWebp: interiorWebp,
      imageJpg: interiorJpg,
      iconName: 'palette',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Luxury Interior Portfolio (PDF)',
    },
    {
      id: 'planning',
      title: 'Planning',
      tagline: 'Optimal Space Utilization & Natural Light',
      category: 'Planning',
      description: 'Smart space planning for maximum utility and better flow.',
      imageWebp: planningWebp,
      imageJpg: planningJpg,
      iconName: 'compass',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Architectural Planning Specs (PDF)',
    },
    {
      id: 'drawings',
      title: 'Drawings',
      tagline: 'Earthquake-Resistant RCC Engineering Blueprints',
      category: 'Planning',
      description: 'Detailed architectural, structural and working drawings for a hassle-free build.',
      imageWebp: drawingsWebp,
      imageJpg: drawingsJpg,
      iconName: 'ruler',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Engineering Drawings Set (PDF)',
    },
  ];

  const [services, setServices] = useState<ServiceCardData[]>(defaultServices);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/services.php')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.services) && data.services.length > 0) {
          const mapped: ServiceCardData[] = data.services.map((item: any) => ({
            id: item.slug || item.id,
            title: item.title,
            tagline: item.tagline,
            category: item.category,
            description: item.short_description || item.description,
            image: item.image,
            iconName: item.icon_name || 'home',
            brochurePdf: item.brochure_pdf || null,
            brochureTitle: item.brochure_title || 'Service Brochure (PDF)',
            deliverables: item.deliverables,
            timeline: item.timeline,
            badge: item.badge,
          }));
          // Show up to 4 services on homepage grid
          setServices(mapped.slice(0, 4));
        }
      })
      .catch(() => {
        // Fall back gracefully to default services if endpoint not reached or offline
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'palette':
        return <Palette className="w-7 h-7 text-[#FF6F2C]" />;
      case 'compass':
        return <Compass className="w-7 h-7 text-[#FF6F2C]" />;
      case 'ruler':
        return <Ruler className="w-7 h-7 text-[#FF6F2C]" />;
      case 'building':
        return <Building className="w-7 h-7 text-[#FF6F2C]" />;
      case 'layers':
        return <Layers className="w-7 h-7 text-[#FF6F2C]" />;
      case 'wrench':
        return <Wrench className="w-7 h-7 text-[#FF6F2C]" />;
      case 'home':
      default:
        return (
          <svg
            className="w-7 h-7 text-[#FF6F2C]"
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 14L16 4L28 14V27C28 27.5523 27.5523 28 27 28H5C4.44772 28 4 27.5523 4 27V14Z" />
            <path d="M12 28V16H20V28" />
            <path d="M16 4V10" />
            <circle cx="16" cy="12" r="1.5" fill="#FF6F2C" />
          </svg>
        );
    }
  };

  const getImageUrl = (item: ServiceCardData): string => {
    if (item.image) {
      return item.image.startsWith('http') ? item.image : `/${item.image.replace(/^\/+/, '')}`;
    }
    return item.imageWebp || elevationWebp;
  };

  const getPdfUrl = (pdfPath: string): string => {
    return pdfPath.startsWith('http') ? pdfPath : `/${pdfPath.replace(/^\/+/, '')}`;
  };

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

        {/* ── 4 SERVICE CARDS GRID (Cards: 10px radius, border #F1EFEC, soft shadow) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {services.map((item) => {
            const imgSrc = getImageUrl(item);
            return (
              <div
                key={item.id}
                className="bg-white rounded-[10px] border border-[#F1EFEC] shadow-[0_4px_20px_rgba(38,50,56,0.04)] hover:shadow-[0_16px_36px_rgba(38,50,56,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative"
              >
                {/* Optional Highlight Badge */}
                {item.badge && (
                  <span className="absolute top-3 right-3 z-10 bg-[#FF6F2C] text-white text-[10px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] shadow-xs">
                    {item.badge}
                  </span>
                )}

                {/* Card Top: Image thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                  {item.imageWebp && item.imageJpg ? (
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
                  ) : (
                    <img
                      src={imgSrc}
                      alt={`${item.title} by PERSQFT`}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Service Icon */}
                    <div className="mb-4 inline-block">{renderIcon(item.iconName)}</div>

                    {/* Service Title: Montserrat SemiBold 600 */}
                    <h3 className="font-['Montserrat',sans-serif] font-semibold text-xl sm:text-[22px] text-[#263238] tracking-tight mb-2 group-hover:text-[#FF6F2C] transition-colors">
                      {item.title}
                    </h3>

                    {/* Service Description: Inter Regular 400 */}
                    <p className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions Area: Learn More + View Brochure (PDF) */}
                  <div className="pt-4 border-t border-[#F1EFEC] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onOpenEnquiry(item.title)}
                      className="inline-flex items-center gap-1.5 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm group/btn transition-colors cursor-pointer text-left"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    {item.brochurePdf && (
                      <a
                        href={getPdfUrl(item.brochurePdf)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] bg-[#FFF1E9] hover:bg-[#FFE4D4] text-[#FF6F2C] border border-[#FF6F2C]/30 text-[11px] font-['Montserrat',sans-serif] font-bold tracking-tight transition-all shadow-2xs group/pdf"
                        title={item.brochureTitle || 'View Complete Service Brochure (PDF) in new browser tab'}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span>Brochure (PDF)</span>
                        <ExternalLink className="w-3 h-3 opacity-70 group-hover/pdf:translate-x-0.5 group-hover/pdf:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
