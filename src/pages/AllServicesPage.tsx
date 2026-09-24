import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, Sparkles, Phone, ShieldCheck, Ruler, Home, 
  Layers, Compass, Building, Palette, Wrench, FileText, ExternalLink, Eye 
} from 'lucide-react';
import { ServiceDetailModal, type ServiceDetailData } from '../components/ServiceDetailModal';
import elevationWebp from '../assets/serviceElevation.webp';
import elevationJpg from '../assets/serviceElevation.jpg';
import interiorWebp from '../assets/serviceInterior.webp';
import interiorJpg from '../assets/serviceInterior.jpg';
import planningWebp from '../assets/servicePlanning.webp';
import planningJpg from '../assets/servicePlanning.jpg';
import drawingsWebp from '../assets/serviceDrawings.webp';
import drawingsJpg from '../assets/serviceDrawings.jpg';
import testimonialVillaWebp from '../assets/testimonialVilla.webp';
import testimonialVillaJpg from '../assets/testimonialVilla.jpg';

interface AllServicesPageProps {
  onBackToHome: () => void;
  onOpenEnquiry: (serviceName?: string) => void;
}

interface ComprehensiveService {
  id: string | number;
  category: string;
  title: string;
  tagline: string;
  description: string;
  image?: string;
  imageWebp?: string;
  imageJpg?: string;
  inclusions: string[];
  deliverables: string;
  timeline: string;
  iconName?: string;
  brochurePdf?: string | null;
  brochureTitle?: string;
  popular?: boolean;
}

export const AllServicesPage: React.FC<AllServicesPageProps> = ({ onBackToHome, onOpenEnquiry }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<ServiceDetailData | null>(null);

  const defaultServicesList: ComprehensiveService[] = [
    {
      id: 'elevation-design',
      category: 'Design',
      title: '3D Elevation Design',
      tagline: 'Modern, Aesthetic & Distinctive Facades',
      description: 'Make a lasting impression with hyper-realistic 3D elevations engineered with precise material specifications, lighting placements, and contemporary exterior finishes.',
      imageWebp: elevationWebp,
      imageJpg: elevationJpg,
      inclusions: [
        'Photorealistic Day & Night 3D Views',
        'Complete Exterior Material & Texture Matrix',
        'Boundary Wall & Main Gate Coordinated CAD',
        'Exterior LED Lighting & Facade Fixtures Plan',
      ],
      deliverables: '3D High-Res Renders + Color Code Schedule',
      timeline: '3 - 5 Working Days',
      iconName: 'home',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Complete 3D Elevation Dossier (PDF)',
      popular: true,
    },
    {
      id: 'interior-design',
      category: 'Interior',
      title: 'Luxury Interior Design & Fit-Out',
      tagline: 'Sophisticated Living Tailored to Your Taste',
      description: 'From modular kitchens and custom false ceilings to premium woodwork, false flooring, and tailored ambient lighting for comfortable, contemporary living.',
      imageWebp: interiorWebp,
      imageJpg: interiorJpg,
      inclusions: [
        'Room-by-Room 3D Interior Visualizations',
        'Modular Kitchen & Wardrobe Detail Drawings',
        'False Ceiling & Electrical Ambience Layouts',
        'Complete Material Selection & BoQ Assistance',
      ],
      deliverables: '3D Walkthrough Renders + Carpentry CADs',
      timeline: '7 - 12 Working Days',
      iconName: 'palette',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Interior Design Specification Dossier (PDF)',
      popular: true,
    },
    {
      id: 'floor-planning',
      category: 'Planning',
      title: 'Architectural Floor Planning & Vastu',
      tagline: 'Optimal Space Utilization & Natural Light',
      description: 'Smart 2D floor plans designed to maximize carpet area, optimize airflow, integrate cross-ventilation, and balance traditional Vastu principles with modern lifestyle needs.',
      imageWebp: planningWebp,
      imageJpg: planningJpg,
      inclusions: [
        'Vastu-Compliant Zoning & Room Layouts',
        'Maximum Carpet Area to Built-Up Ratio',
        'Sun Path & Cross-Ventilation Engineering',
        'Furniture Flow & Space Optimization Maps',
      ],
      deliverables: '2D Architectural CAD Floor Plans (All Floors)',
      timeline: '2 - 4 Working Days',
      iconName: 'compass',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Architectural Vastu Planning Dossier (PDF)',
    },
    {
      id: 'structural-drawings',
      category: 'Planning',
      title: 'Structural & Working Drawings',
      tagline: 'Earthquake-Resistant RCC Engineering Blueprints',
      description: 'Rigorous structural calculations and detailed working drawings ensuring zero construction ambiguity on site, vetted by certified civil and structural engineers.',
      imageWebp: drawingsWebp,
      imageJpg: drawingsJpg,
      inclusions: [
        'Foundation, Column Footing & Plinth Beam CADs',
        'RCC Slab & Beam Steel Reinforcement Schedules',
        'Plumbing (Water Supply & Drainage) Blueprints',
        'Concealed Electrical Conduit Line Maps',
      ],
      deliverables: 'Certified Construction Working Drawing Set',
      timeline: '5 - 7 Working Days',
      iconName: 'ruler',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Structural Blueprints & CAD Specifications (PDF)',
    },
    {
      id: 'turnkey-construction',
      category: 'Construction',
      title: 'Turnkey Residential Construction',
      tagline: 'End-to-End Home Building with Guaranteed Quality',
      description: 'Complete hassle-free residential construction from soil testing and excavation to RCC framing, brickwork, finishing, and key handover with zero cost-escalation.',
      imageWebp: testimonialVillaWebp,
      imageJpg: testimonialVillaJpg,
      inclusions: [
        'Grade-A Certified Cement, Steel & Raw Materials',
        'Daily/Weekly Photographic Progress Reports',
        'Dedicated On-Site Civil Project Engineer',
        'Lab Quality Testing for Concrete & Compaction',
      ],
      deliverables: 'Move-in Ready Handover with Warranty',
      timeline: '6 - 12 Months (Based on Sq. Ft.)',
      iconName: 'building',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Turnkey Construction Contract & Technical Dossier (PDF)',
      popular: true,
    },
    {
      id: 'commercial-projects',
      category: 'Construction',
      title: 'Commercial Complexes & Plazas',
      tagline: 'High-Footfall Retail & Office Infrastructure',
      description: 'Engineered commercial buildings, shopping arcades, and corporate spaces with compliant municipal setback parameters, maximum permissible FAR, and durable modern finishes.',
      imageWebp: drawingsWebp,
      imageJpg: drawingsJpg,
      inclusions: [
        'Municipal Byelaw & Road Width FAR Optimization',
        'Basement Parking & Fire Exit Planning',
        'High-Load Capacity Commercial Frame Engineering',
        'Glass Facade & Composite Panel Cladding Specs',
      ],
      deliverables: 'Commercial Structural & Architectural Set',
      timeline: 'Tailored to Scope',
      iconName: 'layers',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Commercial Infrastructure Guidelines (PDF)',
    },
    {
      id: 'renovation-remodeling',
      category: 'Construction',
      title: 'Structural Renovation & Remodeling',
      tagline: 'Transforming Aging Structures into Modern Spaces',
      description: 'Reinforce old foundation beams, reconfigure cramped room divisions, update exterior facades, and modernize legacy plumbing and electrical systems with precision.',
      imageWebp: elevationWebp,
      imageJpg: elevationJpg,
      inclusions: [
        'Existing Structure Health & Load Bearing Audit',
        'Space Reconfiguration & Wall Demolition Plans',
        'Modern Facade Replacement & Surface Upgrades',
        'Waterproofing & Damp-Proof Chemical Injections',
      ],
      deliverables: 'Remodeling Blueprint + Bill of Quantities',
      timeline: '3 - 8 Weeks',
      iconName: 'wrench',
      brochurePdf: 'uploads/services/persqft_service_brochure_sample.pdf',
      brochureTitle: 'Structural Renovation Audit Dossier (PDF)',
    },
  ];

  const [servicesList, setServicesList] = useState<ComprehensiveService[]>(defaultServicesList);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/services.php')
      .then((res) => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.services) && data.services.length > 0) {
          const mapped: ComprehensiveService[] = data.services.map((item: any) => ({
            id: item.slug || item.id,
            category: item.category || 'Design',
            title: item.title,
            tagline: item.tagline || '',
            description: item.description || item.short_description || '',
            image: item.image,
            inclusions: Array.isArray(item.inclusions) && item.inclusions.length > 0
              ? item.inclusions
              : [
                  'Full Architectural & Structural Drawings',
                  'High-Resolution 3D Visualization Renders',
                  'Dedicated Project Engineer Supervision',
                  'Material Quality Certification Matrix',
                ],
            deliverables: item.deliverables || 'Complete Project Blueprint Set',
            timeline: item.timeline || 'On Schedule',
            iconName: item.icon_name || 'home',
            brochurePdf: item.brochure_pdf || null,
            brochureTitle: item.brochure_title || 'Service Brochure (PDF)',
            popular: item.badge ? item.badge.toLowerCase().includes('popular') : false,
          }));
          setServicesList(mapped);
        }
      })
      .catch(() => {
        // Fall back gracefully
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'palette':
        return <Palette className="w-5 h-5 text-[#FF6F2C]" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-[#FF6F2C]" />;
      case 'ruler':
        return <Ruler className="w-5 h-5 text-[#FF6F2C]" />;
      case 'building':
        return <Building className="w-5 h-5 text-[#FF6F2C]" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-[#FF6F2C]" />;
      case 'wrench':
        return <Wrench className="w-5 h-5 text-[#FF6F2C]" />;
      case 'home':
      default:
        return <Home className="w-5 h-5 text-[#FF6F2C]" />;
    }
  };

  const getImageUrl = (item: ComprehensiveService): string => {
    if (item.image) {
      return item.image.startsWith('http') ? item.image : `/${item.image.replace(/^\/+/, '')}`;
    }
    return item.imageWebp || elevationWebp;
  };

  const getPdfUrl = (pdfPath: string): string => {
    return pdfPath.startsWith('http') ? pdfPath : `/${pdfPath.replace(/^\/+/, '')}`;
  };

  // Derive unique categories from list
  const availableCategories = ['All', ...Array.from(new Set(servicesList.map(s => s.category).filter(Boolean)))];

  const filteredServices = activeFilter === 'All'
    ? servicesList
    : servicesList.filter(s => s.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 sm:pt-24 pb-16 select-none font-['Inter',sans-serif]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* ── TOP BREADCRUMB & BACK NAVIGATION ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 pt-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-['Montserrat',sans-serif] font-semibold text-[#263238] hover:text-[#FF6F2C] bg-white border border-[#F1EFEC] hover:border-[#FF6F2C] px-3.5 sm:px-4 py-2 rounded-[8px] transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6F2C]" />
            <span>Back to Home</span>
          </button>

          <div className="font-['Montserrat',sans-serif] text-xs text-[#667078] flex items-center gap-2 font-medium">
            <span onClick={onBackToHome} className="hover:text-[#FF6F2C] cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-[#FF6F2C] font-semibold">All Services</span>
          </div>
        </div>

        {/* ── HERO HEADER BANNER ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-6 sm:p-10 lg:p-12 mb-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFF1E9]/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#FFF1E9] border border-[#FF6F2C]/30 text-[#FF6F2C] px-3.5 py-1 rounded-[6px] text-xs font-['Montserrat',sans-serif] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Architectural &amp; Engineering Scope</span>
            </div>

            <h1 className="font-['Montserrat',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#263238] tracking-tight leading-tight mb-4">
              All Design &amp; Construction Services in One Place
            </h1>

            <p className="text-[#667078] text-sm sm:text-base leading-relaxed mb-6 font-normal">
              Whether you need 3D elevations, precision floor planning, detailed working drawings, or turnkey on-site villa construction across Uttar Pradesh, our certified team handles every phase with zero compromise on quality.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEnquiry('All Services General Consultation')}
                className="inline-flex items-center gap-2 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-6 sm:px-7 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+916306659601"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#FFF1E9] text-[#263238] border border-[#FF6F2C] px-5 sm:px-6 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF6F2C]" />
                <span>Call HQ: +91 6306659601</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── CATEGORY FILTER TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-5 py-2.5 rounded-[8px] font-['Montserrat',sans-serif] text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeFilter.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#FF6F2C] text-white shadow-xs'
                  : 'bg-white text-[#263238] border border-[#F1EFEC] hover:border-[#FF6F2C]'
              }`}
            >
              {cat === 'All' ? 'All Services' : cat}
            </button>
          ))}
        </div>

        {/* ── COMPREHENSIVE SERVICE CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-16">
          {filteredServices.map((service) => {
            const imgSrc = getImageUrl(service);
            return (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="bg-white rounded-[10px] border border-[#F1EFEC] shadow-xs hover:shadow-md hover:border-[#FF6F2C]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
              >
                {/* Card Thumbnail Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                  {service.imageWebp && service.imageJpg ? (
                    <picture className="w-full h-full">
                      <source srcSet={service.imageWebp} type="image/webp" />
                      <img
                        src={service.imageJpg}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </picture>
                  ) : (
                    <img
                      src={imgSrc}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  )}

                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
                    <span className="inline-flex items-center gap-1 text-white text-xs font-['Montserrat',sans-serif] font-bold">
                      <Eye className="w-3.5 h-3.5 text-[#FF6F2C]" />
                      <span>Click to View Full Details</span>
                    </span>
                  </div>

                  {/* Popular Badge */}
                  {service.popular && (
                    <span className="absolute top-3 right-3 bg-[#FF6F2C] text-white text-[10px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] shadow-xs">
                      Popular
                    </span>
                  )}

                  <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-[#263238] text-[11px] font-['Montserrat',sans-serif] font-semibold px-2.5 py-1 rounded-[6px] border border-[#F1EFEC] flex items-center gap-1.5 shadow-2xs">
                    {renderIcon(service.iconName)}
                    <span>{service.timeline}</span>
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Montserrat',sans-serif] font-bold text-xl text-[#263238] group-hover:text-[#FF6F2C] transition-colors mb-1">
                      {service.title}
                    </h3>
                    
                    {service.tagline && (
                      <p className="text-xs font-['Montserrat',sans-serif] font-semibold text-[#FF6F2C] uppercase tracking-wide mb-2.5">
                        {service.tagline}
                      </p>
                    )}

                    <p className="font-['Inter',sans-serif] text-xs sm:text-sm text-[#667078] leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Deliverables / Scope */}
                    {service.inclusions && service.inclusions.length > 0 && (
                      <div className="mb-5 pt-4 border-t border-[#F1EFEC]">
                        <span className="text-[11px] font-['Montserrat',sans-serif] font-bold text-[#263238] uppercase tracking-wider block mb-2.5">
                          Included in Scope:
                        </span>
                        <ul className="space-y-2">
                          {service.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#263238]">
                              <Check className="w-3.5 h-3.5 text-[#FF6F2C] shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Action: Deliverables, PDF Brochure & Get Estimate */}
                  <div className="pt-4 border-t border-[#F1EFEC] space-y-3">
                    <div className="text-[11px] text-[#667078]">
                      <span className="block font-medium">Output:</span>
                      <span className="font-semibold text-[#263238] line-clamp-1">{service.deliverables}</span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(service);
                        }}
                        className="inline-flex items-center gap-1.5 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-semibold text-xs transition-colors cursor-pointer"
                        title="Click to view full specifications in pop-up modal"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-2 ml-auto">
                        {/* View Brochure (PDF) Button opening in a new tab */}
                        {service.brochurePdf && (
                          <a
                            href={getPdfUrl(service.brochurePdf)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[8px] bg-[#FFF1E9] hover:bg-[#FFE4D4] text-[#FF6F2C] border border-[#FF6F2C]/40 text-xs font-['Montserrat',sans-serif] font-bold transition-all shadow-2xs group/pdf"
                            title={service.brochureTitle || 'Open Complete Service Brochure (PDF) in new browser tab'}
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Brochure</span>
                            <ExternalLink className="w-3 h-3 opacity-70 group-hover/pdf:translate-x-0.5 group-hover/pdf:-translate-y-0.5 transition-transform" />
                          </a>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenEnquiry(service.title);
                          }}
                          className="inline-flex items-center gap-1.5 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-3.5 py-2 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs tracking-wide shrink-0 cursor-pointer shadow-2xs active:scale-95 transition-all"
                        >
                          <span>Get Estimate</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── PERSQFT GUARANTEE CALLOUT ── */}
        <div className="bg-[#FAF8F5] border border-[#F1EFEC] rounded-[10px] p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left mb-12">
          <div className="flex items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-[8px] bg-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-bold text-sm text-[#263238]">100% Quality Assurance</h4>
              <p className="text-xs text-[#667078] mt-0.5">Strict multi-point engineering inspections on every project.</p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-[8px] bg-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-bold text-sm text-[#263238]">Zero Deviation Blueprints</h4>
              <p className="text-xs text-[#667078] mt-0.5">Execution matches 3D CAD renders down to the millimeter.</p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-[8px] bg-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-bold text-sm text-[#263238]">Vastu &amp; Municipal Compliance</h4>
              <p className="text-xs text-[#667078] mt-0.5">Harmonized Vastu layouts with full local byelaw clearance.</p>
            </div>
          </div>

          <div className="flex items-center sm:items-start gap-3.5">
            <div className="w-10 h-10 rounded-[8px] bg-[#FFF1E9] flex items-center justify-center shrink-0 text-[#FF6F2C]">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-['Montserrat',sans-serif] font-bold text-sm text-[#263238]">Statewide UP Operations</h4>
              <p className="text-xs text-[#667078] mt-0.5">Dual hubs in Sultanpur &amp; Hathras servicing 11 key cities.</p>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-xs">
          <h3 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight mb-2">
            Ready to Begin Your Architectural Journey?
          </h3>
          <p className="text-sm text-[#667078] max-w-md mx-auto mb-6">
            Get in touch with our chief engineers today for plot measurement, cost estimation, and personalized design consultation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenEnquiry('Consultation via Services Page')}
              className="bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-7 py-3.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Book Free Site Consultation
            </button>
            <button
              onClick={onBackToHome}
              className="bg-[#FAF8F5] hover:bg-[#F1EFEC] text-[#263238] border border-[#F1EFEC] px-6 py-3.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm transition-colors cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>

      </div>

      {/* ── BEAUTIFUL SERVICE DETAIL POP-UP MODAL ── */}
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
    </div>
  );
};
