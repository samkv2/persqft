import React, { useState, useEffect, useRef } from 'react';
import { ProjectDetailModal, type ProjectDetailData } from './ProjectDetailModal';
import { ArrowRight, Eye, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import elevationWebp from '../assets/serviceElevation.webp';
import elevationJpg from '../assets/serviceElevation.jpg';
import interiorWebp from '../assets/serviceInterior.webp';
import interiorJpg from '../assets/serviceInterior.jpg';
import planningWebp from '../assets/servicePlanning.webp';
import planningJpg from '../assets/servicePlanning.jpg';
import drawingsWebp from '../assets/serviceDrawings.webp';
import drawingsJpg from '../assets/serviceDrawings.jpg';
import testimonialVillaWebp from '../assets/testimonialVilla.webp';

interface ProjectsSectionProps {
  onOpenEnquiry: (projectTitle?: string) => void;
  onViewAllProjects?: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenEnquiry, onViewAllProjects }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectDetailData | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectDetailData[]>([]);

  // Default high-grade architectural fallback projects with complete specifications
  const fallbackProjects: ProjectDetailData[] = [
    {
      id: 'modern-residence',
      slug: 'modern-luxury-residence-elevation',
      title: 'Modern Residence',
      category: 'Elevation',
      location: 'Civil Lines, Sultanpur, UP',
      client: 'Dr. R. K. Srivastava',
      area: '4,850 SQ.FT',
      year: 2026,
      status: 'COMPLETED',
      progress: 100,
      coverImage: elevationWebp,
      gallery: [elevationWebp, elevationJpg, interiorWebp, planningWebp],
      shortDescription: 'Modern, aesthetic and functional elevations engineered with precision facade louvers.',
      description: 'The Modern Residence represents contemporary residential architecture at its finest. Designed with an emphasis on geometric balance, cantilevered terraces, and natural stone textures, this home provides expansive double-height living areas, seamless indoor-outdoor transitions, and energy-conscious cross ventilation.',
      features: [
        'Seismic Resistant Reinforced RCC Column & Beam Frame',
        'Double-Glazed Low-E Energy Efficient Facade Glass',
        'Laser-Cut Precision Exterior Louver System',
        'Vastu Harmonized Master Suite & Central Courtyard',
      ],
    },
    {
      id: 'luxury-apartment',
      slug: 'luxury-contemporary-apartment-interior',
      title: 'Luxury Apartment',
      category: 'Interior',
      location: 'Gomti Nagar Extension, Lucknow',
      client: 'Mr. & Mrs. Anoop Shukla',
      area: '3,200 SQ.FT',
      year: 2025,
      status: 'COMPLETED',
      progress: 100,
      coverImage: interiorWebp,
      gallery: [interiorWebp, interiorJpg, elevationWebp],
      shortDescription: 'Thoughtfully designed interiors with bespoke carpentry and circadian lighting.',
      description: 'A bespoke interior architecture transformation marrying imported Italian Statuario marble with warm fluted timber wall accents. Features concealed dimmable architectural cove lighting, customized German modular kitchen hardware, and sound-isolated acoustic suite paneling.',
      features: [
        'Custom Italian Statuario & Travertine Flooring',
        'German Engineered Soft-Close Modular Cabinetry',
        'Smart Circadian Mood Lighting Automation',
        'Concealed Ductable VRV Climate Control System',
      ],
    },
    {
      id: 'site-planning',
      slug: 'comprehensive-site-planning-vastu',
      title: 'Site Planning',
      category: 'Planning',
      location: 'Aligarh Road, Hathras, UP',
      client: 'Vikas Agarwal & Sons',
      area: '18,500 SQ.FT',
      year: 2026,
      status: 'ONGOING',
      progress: 85,
      coverImage: planningWebp,
      gallery: [planningWebp, planningJpg, drawingsWebp],
      shortDescription: 'Smart space planning and master layouts designed for maximum utility and airflow.',
      description: 'Comprehensive architectural master planning balancing stringent local municipal setback byelaws with optimal Floor Area Ratio (FAR). Meticulously structured zoning guarantees uninterrupted sunlight access, wide internal driveway radii, and full Vastu compliance.',
      features: [
        'Municipal Byelaw & Boundary Setback Optimization',
        'Integrated Sun-Path & Wind Direction Microclimate Study',
        'Underground Stormwater Harvesting & Drainage Map',
        'Dedicated Fire Escape & Two-Way Vehicular Flow Corridors',
      ],
    },
    {
      id: 'architectural-drawings',
      slug: 'structural-and-working-blueprints',
      title: 'Architectural Drawings',
      category: 'Commercial',
      location: 'Transport Nagar, Lucknow, UP',
      client: 'Apex Global Logistics',
      area: '24,000 SQ.FT',
      year: 2026,
      status: 'ONGOING',
      progress: 92,
      coverImage: drawingsWebp,
      gallery: [drawingsWebp, drawingsJpg, planningWebp],
      shortDescription: 'Detailed architectural, structural and working drawings for zero on-site construction error.',
      description: 'High-precision engineering blueprint dossier produced with advanced CAD modeling. Contains complete structural schedules, rebar placement sheets, plinth beam sections, MEP conduits, and hydraulic plumbing diagrams certified by registered structural engineers.',
      features: [
        'Certified RCC Foundation & Column Footing Schedules',
        'High-Tensile Fe550D Steel Rebar Bar Bending Schedules',
        'Color-Coded Plumbing & Concealed Electrical Schematics',
        'Zero-Ambiguity Working Drawings for Site Contractors',
      ],
    },
    {
      id: 'the-glasshouse-estate',
      slug: 'the-glasshouse-estate',
      title: 'The Glasshouse Modern Estate',
      category: 'Residential',
      location: 'Golf City, Lucknow',
      client: 'Private Residence',
      area: '18,500 SQ.FT',
      year: 2025,
      status: 'COMPLETED',
      progress: 100,
      coverImage: testimonialVillaWebp,
      gallery: [testimonialVillaWebp, elevationWebp, interiorWebp],
      shortDescription: 'High-end cantilevered minimalist residence crafted with exposed architectural concrete.',
      description: 'An architectural marvel blending seamless indoor-outdoor living with structural audacity. Features a dramatic 12-meter cantilevered upper deck suspended over an infinity reflection pool, precision-engineered thermal insulation, and custom smart automation throughout.',
      features: [
        '12m Suspended Structural Steel Cantilever',
        'Off-Form Architectural Board-Marked Concrete',
        'Floor-to-Ceiling Motorized Acoustic Glazing',
        'Geothermal Hydronic Radiant Floor Heating',
      ],
    },
  ];

  // Fetch live projects from CMS / Database REST API
  useEffect(() => {
    let isMounted = true;
    fetch('/api/projects.php')
      .then((res) => {
        if (!res.ok) throw new Error('API request failed');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          // Normalize API response into ProjectDetailData
          const apiProjects: ProjectDetailData[] = data.projects.map((p: any) => ({
            id: p.id || p.slug,
            slug: p.slug,
            title: p.title,
            category: p.category,
            location: p.location,
            client: p.client,
            area: p.area,
            year: p.year,
            status: p.status,
            progress: p.progress,
            coverImage: p.cover_image,
            cover_image: p.cover_image,
            gallery: Array.isArray(p.gallery) ? p.gallery : [p.cover_image],
            shortDescription: p.short_description || p.description,
            short_description: p.short_description,
            description: p.description,
            features: Array.isArray(p.features) ? p.features : [],
          }));

          // Merge API projects with base fallbacks for any missing categories
          const combined = [...apiProjects];
          fallbackProjects.forEach((fb) => {
            if (!combined.some((item) => item.slug === fb.slug || item.title.toLowerCase() === fb.title.toLowerCase())) {
              combined.push(fb);
            }
          });

          setProjectsList(combined);
        } else if (isMounted) {
          setProjectsList(fallbackProjects);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProjectsList(fallbackProjects);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Slider state & responsiveness (matching Services format)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardsPerView, setCardsPerView] = useState<number>(4);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Touch gesture support for mobile devices
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 45;

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

  const currentList = projectsList.length > 0 ? projectsList : fallbackProjects;

  const filterTabs = ['All', 'Residential', 'Commercial', 'Interior', 'Elevation', 'Planning'];

  // Filter projects by category tab
  const filteredProjects = currentList.filter((item) => {
    if (activeTab === 'All') return true;
    const cat = (item.category || '').toLowerCase();
    const target = activeTab.toLowerCase();

    if (target === 'residential') return cat.includes('residential') || cat.includes('architecture');
    if (target === 'commercial') return cat.includes('commercial') || cat.includes('turnkey');
    if (target === 'interior') return cat.includes('interior');
    if (target === 'elevation') return cat.includes('elevation') || cat.includes('design') || cat.includes('architecture');
    if (target === 'planning') return cat.includes('planning');
    return cat.includes(target);
  });

  const displayItems = activeTab === 'All' ? currentList : filteredProjects;
  const maxIndex = Math.max(0, displayItems.length - cardsPerView);
  const isOverflowing = displayItems.length > cardsPerView;

  // Reset index when tab or maxIndex changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab]);

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // 2-second automatic slide time
  useEffect(() => {
    if (!isOverflowing || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(timer);
  }, [isOverflowing, isPaused, maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  // Touch event handlers for smooth mobile swipe
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
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Helper to get image path
  const getCardImage = (project: ProjectDetailData): string => {
    const raw = project.coverImage || project.cover_image;
    if (!raw) return elevationWebp;
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) return raw;
    return `/${raw.replace(/^\/+/, '')}`;
  };

  return (
    <section
      id="projects"
      className="py-14 sm:py-20 lg:py-24 bg-white relative overflow-hidden select-none border-b border-[#F1EFEC]"
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* ── 1. SECTION HEADER WITH CONTROLS ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="font-['Montserrat',sans-serif] text-base sm:text-lg lg:text-xl font-bold uppercase tracking-[0.14em] text-[#FF6F2C] mb-2.5 block">
              OUR PROJECTS
            </span>
            <h2 className="font-['Montserrat',sans-serif] font-semibold text-3xl sm:text-4xl lg:text-[2.65rem] text-[#263238] tracking-tight leading-tight">
              Our Recent Work
            </h2>
            <p className="font-['Inter',sans-serif] text-[#667078] text-sm sm:text-base mt-2 max-w-2xl font-normal">
              Click any project card to inspect full architectural specifications, blueprints, and construction execution details.
            </p>
          </div>

          <div className="shrink-0 pt-2 md:pt-0 flex items-center gap-3">
            {isOverflowing && (
              <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#F1EFEC] rounded-[10px] p-1">
                <button
                  onClick={handlePrev}
                  aria-label="Slide to previous projects"
                  className="p-2 rounded-[8px] text-[#263238] hover:bg-white hover:text-[#FF6F2C] shadow-2xs active:scale-95 transition-all cursor-pointer"
                  title="Previous Projects"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                
                <span className="text-[11px] font-['Montserrat',sans-serif] font-bold text-[#667078] px-1.5 hidden sm:inline">
                  {currentIndex + 1} / {maxIndex + 1}
                </span>

                <button
                  onClick={handleNext}
                  aria-label="Slide to next projects"
                  className="p-2 rounded-[8px] text-[#263238] hover:bg-white hover:text-[#FF6F2C] shadow-2xs active:scale-95 transition-all cursor-pointer"
                  title="Next Projects"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            )}

            <button
              onClick={() => {
                if (onViewAllProjects) {
                  onViewAllProjects();
                } else {
                  onOpenEnquiry('Featured Projects Portfolio');
                }
              }}
              className="inline-flex items-center gap-2 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-semibold text-sm sm:text-base group transition-colors cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── 2. CATEGORY FILTER PILLS ── */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 mb-8 sm:mb-10">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 sm:px-6 py-2 sm:py-2.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#FF6F2C] text-white shadow-xs'
                    : 'bg-[#F1EFEC] hover:bg-[#FFF1E9] text-[#263238]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── 3. SLIDING CAROUSEL CONTAINER (Overflow Width Animated Slider & 2s Auto-Slide) ── */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Floating Left Navigation Button (Desktop) */}
          {isOverflowing && (
            <button
              onClick={handlePrev}
              aria-label="Previous project cards"
              className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#F1EFEC] shadow-md items-center justify-center transition-all cursor-pointer text-[#263238] hover:text-[#FF6F2C] hover:border-[#FF6F2C] hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Floating Right Navigation Button (Desktop) */}
          {isOverflowing && (
            <button
              onClick={handleNext}
              aria-label="Next project cards"
              className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-[#F1EFEC] shadow-md items-center justify-center transition-all cursor-pointer text-[#263238] hover:text-[#FF6F2C] hover:border-[#FF6F2C] hover:scale-105 active:scale-95"
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
            <div
              className="flex transition-transform duration-500 ease-out will-change-transform"
              style={{
                transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
              }}
            >
              {displayItems.map((project) => {
                const imgSrc = getCardImage(project);
                const status = (project.status || 'COMPLETED').toUpperCase();

                return (
                  <div
                    key={project.id}
                    style={{ width: `${100 / cardsPerView}%` }}
                    className="px-2.5 sm:px-3 lg:px-3.5 shrink-0"
                  >
                    <div
                      onClick={() => setSelectedProject(project)}
                      className="h-full bg-white rounded-[10px] border border-[#F1EFEC] shadow-[0_4px_20px_rgba(38,50,56,0.04)] hover:shadow-[0_16px_36px_rgba(38,50,56,0.09)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer relative"
                    >
                      {/* Category & Status Overlay Badges */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                        <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[4px] shadow-2xs flex items-center gap-1">
                          <Layers className="w-3 h-3 text-[#FF6F2C]" />
                          <span>{project.category || 'Architecture'}</span>
                        </span>
                      </div>

                      {status === 'ONGOING' && (
                        <span className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-[10px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] shadow-xs">
                          {project.progress}% Ongoing
                        </span>
                      )}

                      {/* Card Thumbnail Image */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                        <img
                          src={imgSrc}
                          alt={`${project.title} by PERSQFT`}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
                          <span className="inline-flex items-center gap-1 text-white text-xs font-['Montserrat',sans-serif] font-bold">
                            <Eye className="w-3.5 h-3.5 text-[#FF6F2C]" />
                            <span>Click to View Full Project Details</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Bottom Bar: Title, Category & View Details Button */}
                      <div className="p-4 sm:p-5 flex items-center justify-between bg-white border-t border-[#F1EFEC]/60">
                        <div className="pr-3 min-w-0 flex-1">
                          <h3 className="font-['Montserrat',sans-serif] font-semibold text-base sm:text-[17px] text-[#263238] group-hover:text-[#FF6F2C] transition-colors leading-snug truncate">
                            {project.title}
                          </h3>
                          <p className="font-['Inter',sans-serif] text-xs sm:text-sm text-[#667078] mt-0.5 font-normal truncate">
                            {project.location || project.category || 'Architectural Design'}
                          </p>
                        </div>

                        {/* View Details Action Button */}
                        <div 
                          title="View Project Specifications & Gallery"
                          className="flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full bg-[#FFF1E9] text-[#FF6F2C] group-hover:bg-[#FF6F2C] group-hover:text-white transition-all duration-200 shadow-2xs font-['Montserrat',sans-serif] text-xs font-bold"
                        >
                          <span className="hidden sm:inline text-[11px]">View Details</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile slide indicator pills */}
        {isOverflowing && (
          <div className="flex items-center justify-center gap-1.5 mt-6 lg:hidden">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-[#FF6F2C]' : 'w-1.5 bg-slate-200'
                }`}
                aria-label={`Go to project slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── BEAUTIFUL PROJECT DETAILS POP-UP MODAL (Synchronized with CMS/DB) ── */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenEnquiry={(title) => {
            setSelectedProject(null);
            onOpenEnquiry(title);
          }}
        />
      )}
    </section>
  );
};
