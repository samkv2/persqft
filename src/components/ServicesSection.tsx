import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, FileText, ExternalLink, Palette, Compass, 
  Ruler, Building, Layers, Wrench, ChevronLeft, ChevronRight,
  Eye, Sparkles, Clock
} from 'lucide-react';
import { ServiceDetailModal, type ServiceDetailData } from './ServiceDetailModal';
import elevationWebp from '../assets/serviceElevation.webp';
import elevationJpg from '../assets/serviceElevation.jpg';
import interiorWebp from '../assets/serviceInterior.webp';
import interiorJpg from '../assets/serviceInterior.jpg';
import planningWebp from '../assets/servicePlanning.webp';
import planningJpg from '../assets/servicePlanning.jpg';
import drawingsWebp from '../assets/serviceDrawings.webp';
import drawingsJpg from '../assets/serviceDrawings.jpg';
import testimonialVillaWebp from '../assets/testimonialVilla.webp';

interface ServicesSectionProps {
  onOpenEnquiry: (serviceName?: string) => void;
  onExploreAllServices?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenEnquiry, onExploreAllServices }) => {
  // Built-in static fallbacks with complete architectural details
  const defaultServices: ServiceDetailData[] = [
    {
      id: 'elevation-design',
      slug: 'elevation-design',
      title: '3D Elevation Design',
      tagline: 'Modern, Aesthetic & Distinctive Facades',
      category: 'Design',
      short_description: 'Modern, aesthetic and functional elevations that make a lasting impression.',
      description: 'Make a lasting impression with hyper-realistic 3D elevations engineered with precise material specifications, lighting placements, and contemporary exterior finishes. Designed to harmonize aesthetic distinction with practical weather resilience.',
      imageWebp: elevationWebp,
      imageJpg: elevationJpg,
      gallery: [elevationWebp, drawingsWebp, planningWebp],
      iconName: 'home',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: '3D Elevation Design Technical Dossier (PDF)',
      deliverables: '3D High-Res Renders + Color Code Schedule',
      timeline: '3 - 5 Working Days',
      badge: 'Popular',
      inclusions: [
        'Photorealistic Day & Night 3D Views',
        'Complete Exterior Material & Texture Matrix',
        'Boundary Wall & Main Gate Coordinated CAD',
        'Exterior LED Lighting & Facade Fixtures Plan'
      ]
    },
    {
      id: 'interior-design',
      slug: 'interior-design',
      title: 'Luxury Interior Design & Fit-Out',
      tagline: 'Sophisticated Living Tailored to Your Taste',
      category: 'Interior',
      short_description: 'Thoughtfully designed interiors for beautiful, comfortable living.',
      description: 'From modular kitchens and custom false ceilings to premium woodwork, false flooring, and tailored ambient lighting for comfortable, contemporary living with bespoke luxury.',
      imageWebp: interiorWebp,
      imageJpg: interiorJpg,
      gallery: [interiorWebp, elevationWebp, testimonialVillaWebp],
      iconName: 'palette',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Luxury Interior Catalogue & BoQ (PDF)',
      deliverables: '3D Walkthrough Renders + Carpentry CADs',
      timeline: '7 - 12 Working Days',
      badge: 'Popular',
      inclusions: [
        'Room-by-Room 3D Interior Visualizations',
        'Modular Kitchen & Wardrobe Detail Drawings',
        'False Ceiling & Electrical Ambience Layouts',
        'Complete Material Selection & BoQ Assistance'
      ]
    },
    {
      id: 'floor-planning',
      slug: 'floor-planning',
      title: 'Architectural Floor Planning & Vastu',
      tagline: 'Optimal Space Utilization & Natural Light',
      category: 'Planning',
      short_description: 'Smart space planning for maximum utility and better airflow.',
      description: 'Smart 2D floor plans designed to maximize carpet area, optimize airflow, integrate cross-ventilation, and balance traditional Vastu principles with modern lifestyle needs.',
      imageWebp: planningWebp,
      imageJpg: planningJpg,
      gallery: [planningWebp, drawingsWebp, elevationWebp],
      iconName: 'compass',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Architectural Vastu Planning Guide (PDF)',
      deliverables: '2D Architectural CAD Floor Plans (All Floors)',
      timeline: '2 - 4 Working Days',
      inclusions: [
        'Vastu-Compliant Zoning & Room Layouts',
        'Maximum Carpet Area to Built-Up Ratio',
        'Sun Path & Cross-Ventilation Engineering',
        'Furniture Flow & Space Optimization Maps'
      ]
    },
    {
      id: 'structural-drawings',
      slug: 'structural-drawings',
      title: 'Structural & Working Drawings',
      tagline: 'Earthquake-Resistant RCC Engineering Blueprints',
      category: 'Planning',
      short_description: 'Detailed architectural, structural and working drawings for a hassle-free build.',
      description: 'Rigorous structural calculations and detailed working drawings ensuring zero construction ambiguity on site, vetted and certified by registered civil and structural engineers.',
      imageWebp: drawingsWebp,
      imageJpg: drawingsJpg,
      gallery: [drawingsWebp, planningWebp, elevationWebp],
      iconName: 'ruler',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Structural Blueprints & CAD Specifications (PDF)',
      deliverables: 'Certified Construction Working Drawing Set',
      timeline: '5 - 7 Working Days',
      inclusions: [
        'Foundation, Column Footing & Plinth Beam CADs',
        'RCC Slab & Beam Steel Reinforcement Schedules',
        'Plumbing (Water Supply & Drainage) Blueprints',
        'Concealed Electrical Conduit Line Maps'
      ]
    },
    {
      id: 'turnkey-construction',
      slug: 'turnkey-construction',
      title: 'Turnkey Residential Construction',
      tagline: 'End-to-End Home Building with Guaranteed Quality',
      category: 'Construction',
      short_description: 'Complete hassle-free residential construction from foundation to final handover.',
      description: 'Complete hassle-free residential construction from soil testing and excavation to RCC framing, brickwork, finishing, and key handover with zero cost-escalation and weekly photo audits.',
      imageWebp: testimonialVillaWebp,
      imageJpg: elevationJpg,
      gallery: [testimonialVillaWebp, elevationWebp, interiorWebp],
      iconName: 'building',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Turnkey Construction Contract & BoQ Dossier (PDF)',
      deliverables: 'Move-in Ready Handover with Warranty',
      timeline: '6 - 12 Months',
      badge: 'Featured',
      inclusions: [
        'Grade-A Certified Cement, Steel & Raw Materials',
        'Daily/Weekly Photographic Progress Reports',
        'Dedicated On-Site Civil Project Engineer',
        'Lab Quality Testing for Concrete & Compaction'
      ]
    },
    {
      id: 'commercial-projects',
      slug: 'commercial-projects',
      title: 'Commercial Complexes & Plazas',
      tagline: 'High-Footfall Retail & Office Infrastructure',
      category: 'Construction',
      short_description: 'High-performance commercial complexes with compliant setbacks and maximum FAR.',
      description: 'Engineered commercial buildings, shopping arcades, and corporate spaces with compliant municipal setback parameters, maximum permissible FAR, and durable modern finishes.',
      imageWebp: drawingsWebp,
      imageJpg: drawingsJpg,
      gallery: [drawingsWebp, elevationWebp, planningWebp],
      iconName: 'layers',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Commercial Infrastructure Guidelines (PDF)',
      deliverables: 'Commercial Structural & Architectural Set',
      timeline: 'Tailored to Scope',
      inclusions: [
        'Municipal Byelaw & Road Width FAR Optimization',
        'Basement Parking & Fire Exit Planning',
        'High-Load Capacity Commercial Frame Engineering',
        'Glass Facade & Composite Panel Cladding Specs'
      ]
    },
    {
      id: 'renovation-remodeling',
      slug: 'renovation-remodeling',
      title: 'Structural Renovation & Remodeling',
      tagline: 'Transforming Aging Structures into Modern Spaces',
      category: 'Construction',
      short_description: 'Structural reinforcement, space reconfiguration, and modern facade upgrades.',
      description: 'Reinforce old foundation beams, reconfigure cramped room divisions, update exterior facades, and modernize legacy plumbing and electrical systems with precision.',
      imageWebp: elevationWebp,
      imageJpg: elevationJpg,
      gallery: [elevationWebp, interiorWebp, drawingsWebp],
      iconName: 'wrench',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Structural Renovation Audit Dossier (PDF)',
      deliverables: 'Remodeling Blueprint + Bill of Quantities',
      timeline: '3 - 8 Weeks',
      inclusions: [
        'Existing Structure Health & Load Bearing Audit',
        'Space Reconfiguration & Wall Demolition Plans',
        'Modern Facade Replacement & Surface Upgrades',
        'Waterproofing & Damp-Proof Chemical Injections'
      ]
    }
  ];

  const [services, setServices] = useState<ServiceDetailData[]>(defaultServices);
  const [selectedService, setSelectedService] = useState<ServiceDetailData | null>(null);
  
  // Slider state
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardsPerView, setCardsPerView] = useState<number>(4);
  const trackRef = useRef<HTMLDivElement>(null);

  // Touch gesture support for mobile devices
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Responsive cards per view tracking
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setCardsPerView(4);
      } else if (width >= 640) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Fetch live services from CMS / Database REST API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/services.php')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.services) && data.services.length > 0) {
          const mapped: ServiceDetailData[] = data.services.map((item: any) => ({
            id: item.slug || item.id,
            slug: item.slug,
            title: item.title,
            tagline: item.tagline,
            category: item.category,
            short_description: item.short_description || item.description,
            shortDescription: item.short_description,
            description: item.description,
            image: item.image,
            gallery: Array.isArray(item.gallery) ? item.gallery : (item.image ? [item.image] : []),
            iconName: item.icon_name || 'home',
            icon_name: item.icon_name,
            brochurePdf: item.brochure_pdf || null,
            brochure_pdf: item.brochure_pdf || null,
            brochureTitle: item.brochure_title || 'Service Brochure (PDF)',
            brochure_title: item.brochure_title,
            deliverables: item.deliverables,
            timeline: item.timeline,
            badge: item.badge,
            inclusions: Array.isArray(item.inclusions) ? item.inclusions : [],
          }));
          
          setServices(mapped);
        }
      })
      .catch(() => {
        // Fall back gracefully to default services
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const maxIndex = Math.max(0, services.length - cardsPerView);
  const isOverflowing = services.length > cardsPerView;

  // Keep index within valid bounds when cardsPerView changes
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch event handlers for smooth mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

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

  const getImageUrl = (item: ServiceDetailData): string => {
    const raw = (Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery[0] : '') || item.image || '';
    if (raw) {
      return raw.startsWith('http') ? raw : `/${raw.replace(/^\/+/, '')}`;
    }
    return item.imageWebp || elevationWebp;
  };

  const getPdfUrl = (pdfPath: string): string => {
    return pdfPath.startsWith('http') ? pdfPath : `/${pdfPath.replace(/^\/+/, '')}`;
  };

  return (
    <section id="services" className="py-14 sm:py-20 lg:py-24 bg-white relative overflow-hidden select-none border-b border-[#F1EFEC]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* ── SECTION HEADER WITH CONTROLS ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 sm:mb-12">
          <div className="max-w-3xl">
            <span className="font-['Montserrat',sans-serif] text-base sm:text-lg lg:text-xl font-bold uppercase tracking-[0.14em] text-[#FF6F2C] mb-2.5 block">
              OUR SERVICES
            </span>
            <h2 className="font-['Montserrat',sans-serif] font-semibold text-3xl sm:text-4xl lg:text-[2.65rem] text-[#263238] tracking-tight leading-tight mb-3">
              Complete Design &amp; Build Solutions
            </h2>
            <p className="font-['Inter',sans-serif] text-[#667078] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Click any service card or &ldquo;Learn More&rdquo; to open full architectural deliverables, technical scope, and official brochures.
            </p>
          </div>

          {/* Action Row: Sliding Arrows + Explore All Services */}
          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
            {/* Sliding animation arrow controls when cards overflow */}
            {isOverflowing && (
              <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-[10px] border border-[#F1EFEC]">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  aria-label="Slide to previous services"
                  className={`p-2 rounded-[8px] transition-all cursor-pointer ${
                    currentIndex === 0
                      ? 'text-slate-300 cursor-not-allowed opacity-50'
                      : 'text-[#263238] hover:bg-white hover:text-[#FF6F2C] shadow-2xs active:scale-95'
                  }`}
                  title="Previous Services"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <span className="text-[11px] font-['Montserrat',sans-serif] font-bold text-[#667078] px-1.5 hidden sm:inline">
                  {currentIndex + 1} / {maxIndex + 1}
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= maxIndex}
                  aria-label="Slide to next services"
                  className={`p-2 rounded-[8px] transition-all cursor-pointer ${
                    currentIndex >= maxIndex
                      ? 'text-slate-300 cursor-not-allowed opacity-50'
                      : 'text-[#263238] hover:bg-white hover:text-[#FF6F2C] shadow-2xs active:scale-95'
                  }`}
                  title="Next Services"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

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

        {/* ── SLIDING CAROUSEL CONTAINER (Overflow Width Animated Slider) ── */}
        <div className="relative">
          
          {/* Floating Left Navigation Button (Desktop) */}
          {isOverflowing && (
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              aria-label="Previous service cards"
              className={`hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#F1EFEC] shadow-md items-center justify-center transition-all cursor-pointer ${
                currentIndex === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-[#263238] hover:text-[#FF6F2C] hover:border-[#FF6F2C] hover:scale-105 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Floating Right Navigation Button (Desktop) */}
          {isOverflowing && (
            <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              aria-label="Next service cards"
              className={`hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#F1EFEC] shadow-md items-center justify-center transition-all cursor-pointer ${
                currentIndex >= maxIndex
                  ? 'opacity-0 pointer-events-none'
                  : 'text-[#263238] hover:text-[#FF6F2C] hover:border-[#FF6F2C] hover:scale-105 active:scale-95'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Carousel Viewport */}
          <div
            ref={trackRef}
            className="overflow-hidden w-full py-2 -my-2"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Sliding Track with smooth CSS transform */}
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {services.map((item) => {
                const imgSrc = getImageUrl(item);
                const pdf = item.brochurePdf || item.brochure_pdf;
                const pdfTitle = item.brochureTitle || item.brochure_title || 'View Brochure (PDF)';

                return (
                  <div
                    key={item.id}
                    style={{ width: `${100 / cardsPerView}%` }}
                    className="px-2.5 sm:px-3 lg:px-3.5 shrink-0"
                  >
                    <div
                      onClick={() => setSelectedService(item)}
                      className="h-full bg-white rounded-[10px] border border-[#F1EFEC] shadow-[0_4px_20px_rgba(38,50,56,0.04)] hover:shadow-[0_16px_36px_rgba(38,50,56,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group relative cursor-pointer"
                    >
                      {/* Optional Highlight Badge */}
                      {item.badge && (
                        <span className="absolute top-3 right-3 z-10 bg-[#FF6F2C] text-white text-[10px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{item.badge}</span>
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

                        {/* Hover Overlay Hint */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
                          <span className="inline-flex items-center gap-1 text-white text-xs font-['Montserrat',sans-serif] font-bold">
                            <Eye className="w-3.5 h-3.5 text-[#FF6F2C]" />
                            <span>Click to View Full Details</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                        <div>
                          {/* Service Icon & Category */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="inline-block">{renderIcon(item.iconName || item.icon_name)}</div>
                            {item.timeline && (
                              <span className="text-[11px] font-['Montserrat',sans-serif] text-[#667078] font-medium flex items-center gap-1 bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#F1EFEC]">
                                <Clock className="w-3 h-3 text-[#FF6F2C]" />
                                <span>{item.timeline}</span>
                              </span>
                            )}
                          </div>

                          {/* Service Title */}
                          <h3 className="font-['Montserrat',sans-serif] font-semibold text-xl sm:text-[22px] text-[#263238] tracking-tight mb-2 group-hover:text-[#FF6F2C] transition-colors leading-snug">
                            {item.title}
                          </h3>

                          {/* Service Description */}
                          <p className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3">
                            {item.short_description || item.description}
                          </p>
                        </div>

                        {/* Actions Area: Learn More (Opens Popup) + View Brochure (PDF) */}
                        <div className="pt-4 border-t border-[#F1EFEC] flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedService(item);
                            }}
                            className="inline-flex items-center gap-1.5 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm group/btn transition-colors cursor-pointer text-left"
                            title="Click to view full service specifications in pop-up modal"
                          >
                            <span>Learn More</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                          </button>

                          {pdf && (
                            <a
                              href={getPdfUrl(pdf)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[6px] bg-[#FFF1E9] hover:bg-[#FFE4D4] text-[#FF6F2C] border border-[#FF6F2C]/30 text-[11px] font-['Montserrat',sans-serif] font-bold tracking-tight transition-all shadow-2xs group/pdf"
                              title={pdfTitle}
                            >
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              <span>Brochure</span>
                              <ExternalLink className="w-3 h-3 opacity-70 group-hover/pdf:translate-x-0.5 group-hover/pdf:-translate-y-0.5 transition-transform" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── PAGINATION DOTS WHEN OVERFLOWING ── */}
          {isOverflowing && (
            <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide to service group ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-8 bg-[#FF6F2C]'
                      : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* ── BEAUTIFUL SERVICE DETAIL POP-UP MODAL (CMS & Database Synchronized) ── */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onOpenEnquiry={(title) => {
            setSelectedService(null);
            onOpenEnquiry(title);
          }}
        />
      )}
    </section>
  );
};
