import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  MapPin,
  Maximize2,
  Sparkles,
  Phone,
} from 'lucide-react';
import { cmsStore } from '../data/cmsStore';
import type { Project } from '../data/projectsData';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import elevationWebp from '../assets/serviceElevation.webp';
import elevationJpg from '../assets/serviceElevation.jpg';
import interiorWebp from '../assets/serviceInterior.webp';
import planningWebp from '../assets/servicePlanning.webp';
import planningJpg from '../assets/servicePlanning.jpg';
import drawingsWebp from '../assets/serviceDrawings.webp';
import drawingsJpg from '../assets/serviceDrawings.jpg';
import commentSegPng from '../assets/commentSeg.png';

interface AllProjectsPageProps {
  onBackToHome: () => void;
  onOpenEnquiry: (projectTitle?: string) => void;
}

export const AllProjectsPage: React.FC<AllProjectsPageProps> = ({ onBackToHome, onOpenEnquiry }) => {
  const [cmsProjects, setCmsProjects] = useState<Project[]>(cmsStore.getProjects());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    let isMounted = true;
    fetch('/api/projects.php')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          const mapped: Project[] = data.projects.map((p: any) => ({
            id: String(p.id || p.slug),
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
            gallery: Array.isArray(p.gallery) ? p.gallery : [p.cover_image],
            shortDescription: p.short_description || p.description,
            description: p.description,
            features: Array.isArray(p.features) ? p.features : [],
          }));
          setCmsProjects(mapped);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Built-in fallback architectural projects if CMS is empty or offline
  const fallbackCatalog: Project[] = [
    {
      id: 'villa-elegance-sultanpur',
      title: 'The Sultanpur Grand Villa Estate',
      slug: 'the-sultanpur-grand-villa-estate',
      category: 'Residential',
      location: 'Civil Lines, Sultanpur, UP',
      year: 2026,
      client: 'Dr. R. K. Srivastava',
      area: '4,800 sq.ft',
      coverImage: commentSegPng,
      gallery: [commentSegPng, elevationWebp, interiorWebp],
      shortDescription: 'Modern luxury duplex residence with double-height glass facades and cantilevered private balconies.',
      description: 'A bespoke modern duplex residence featuring double-height glass facades, cantilevered private balconies, smart climate control orientation, and luxurious natural stone accents.',
      features: [
        'Earthquake-Resistant Reinforced RCC Structure',
        'Vastu-Compliant Master Bedrooms & Courtyard',
        'Double-Height Living Lounge with Skylight',
        'Private Swimming Pool & Terrace Garden',
      ],
      progress: 92,
      status: 'ONGOING',
    },
    {
      id: 'hathras-commercial-hub',
      title: 'Hathras Central Commercial Arcade',
      slug: 'hathras-central-commercial-arcade',
      category: 'Commercial',
      location: 'Aligarh Road, Hathras, UP',
      year: 2025,
      client: 'Vikas Agarwal & Sons',
      area: '14,500 sq.ft',
      coverImage: drawingsWebp,
      gallery: [drawingsWebp, elevationWebp],
      shortDescription: '4-storey commercial retail and office complex with basement parking and wide corridors.',
      description: 'A 4-storey commercial shopping and office complex with high-footfall open corridors, basement parking, fire-retardant structural framing, and energy-efficient curtain glass walls.',
      features: [
        'Municipal Byelaw & Road Width FAR Compliant',
        'Basement Parking with Automated Ramp System',
        'High-Load Capacity RCC Pillar Spans (6m+)',
        'Energy Efficient LED & Thermal Glazing',
      ],
      progress: 100,
      status: 'COMPLETED',
    },
    {
      id: 'lucknow-modern-interior',
      title: 'Gomti Nagar Contemporary Penthouse',
      slug: 'gomti-nagar-contemporary-penthouse',
      category: 'Interior',
      location: 'Gomti Nagar Extension, Lucknow, UP',
      year: 2025,
      client: 'Mr. & Mrs. Anoop Shukla',
      area: '3,200 sq.ft',
      coverImage: interiorWebp,
      gallery: [interiorWebp, planningWebp],
      shortDescription: 'Ultra-modern interior architecture featuring bespoke Italian marble flooring and concealed lighting.',
      description: 'Ultra-modern interior architecture featuring bespoke Italian marble flooring, concealed warm lighting fixtures, acoustic paneling, and a high-spec German modular kitchen.',
      features: [
        'Custom Concealed Linear Diffuser HVAC',
        'Acoustically Vetted Master Suite & Home Theatre',
        'Motorized Smart Home Automation Grid',
        'Italian Quartz Countertops & Veneer Paneling',
      ],
      progress: 100,
      status: 'COMPLETED',
    },
    {
      id: 'ayodhya-heritage-bungalow',
      title: 'Ayodhya Heritage Villa Residence',
      slug: 'ayodhya-heritage-villa-residence',
      category: 'Residential',
      location: 'Near Ram Path, Ayodhya, UP',
      year: 2026,
      client: 'Pandey Family Heritage Trust',
      area: '5,600 sq.ft',
      coverImage: elevationWebp,
      gallery: [elevationWebp, commentSegPng],
      shortDescription: 'Harmonious blend of traditional Indian architectural grandeur and modern structural resilience.',
      description: 'Harmonious blend of traditional Indian architectural grandeur and modern structural resilience, featuring stone carved pilasters, large verandas, and Vastu-aligned central courtyard.',
      features: [
        'Classical Sandstone Facade Detailing',
        'Central Brahmasthan Open Courtyard',
        'Rainwater Harvesting & Solar Energy Integration',
        'Heavy-Duty Grade-A Solid Foundation Footing',
      ],
      progress: 75,
      status: 'ONGOING',
    },
    {
      id: 'aligarh-modern-duplex',
      title: 'Aligarh Modern Minimalist Duplex',
      slug: 'aligarh-modern-minimalist-duplex',
      category: 'Architecture',
      location: 'Marris Road, Aligarh, UP',
      year: 2025,
      client: 'Er. Sandeep Maheshwari',
      area: '2,900 sq.ft',
      coverImage: elevationJpg,
      gallery: [elevationJpg, drawingsJpg],
      shortDescription: 'Striking rectilinear geometric facade with timber louvers and tinted picture windows.',
      description: 'Striking rectilinear geometric facade with timber-finish aluminum louvers, large tinted picture windows, and integrated recessed warm lighting bands.',
      features: [
        'Thermally Insulated Facade Envelope',
        'Pergola Roof Terrace with Modern Bar Area',
        'Concealed Drain Downpipes & Storm Management',
        'Anti-Rust Powder-Coated Metal Balustrades',
      ],
      progress: 100,
      status: 'COMPLETED',
    },
    {
      id: 'varanasi-riverside-plaza',
      title: 'Varanasi Commercial Showroom & Studios',
      slug: 'varanasi-commercial-showroom-studios',
      category: 'Commercial',
      location: 'Cantonment, Varanasi, UP',
      year: 2026,
      client: 'Kashi Retail Ventures',
      area: '9,200 sq.ft',
      coverImage: planningJpg,
      gallery: [planningJpg, drawingsWebp],
      shortDescription: 'Multi-brand showroom with expansive column-free showroom floors and modern capsule elevators.',
      description: 'Multi-brand showroom with expansive column-free showroom floors, modern glass capsule elevators, and compliant municipal loading bays.',
      features: [
        'Column-Free Span for Retail Display Flexibility',
        'Heavy-Duty Commercial Grade-A Flooring',
        'Integrated Diesel Generator Backup Room',
        'Municipal Fire Safety & Sprinkler Blueprints',
      ],
      progress: 60,
      status: 'ONGOING',
    },
  ];

  const projectsToDisplay = cmsProjects.length > 0 ? cmsProjects : fallbackCatalog;

  // Remove potential duplicates by title
  const uniqueProjects = Array.from(
    new Map(projectsToDisplay.map((item) => [item.title.toLowerCase(), item])).values()
  );

  const categories = ['All', 'Residential', 'Commercial', 'Interior', 'Elevation', 'Ongoing', 'Completed'];

  const filteredProjects = uniqueProjects.filter((proj) => {
    // Search filter
    const matchesSearch =
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category filter
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Ongoing') return proj.status === 'ONGOING';
    if (activeCategory === 'Completed') return proj.status === 'COMPLETED';
    return proj.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 sm:pt-24 pb-16 select-none font-['Inter',sans-serif]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* ── BREADCRUMB & BACK NAVIGATION ── */}
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
            <span className="text-[#FF6F2C] font-semibold">Our Projects Portfolio</span>
          </div>
        </div>

        {/* ── HERO HEADER BANNER ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-6 sm:p-10 lg:p-12 mb-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFF1E9]/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#FFF1E9] border border-[#FF6F2C]/30 text-[#FF6F2C] px-3.5 py-1 rounded-[6px] text-xs font-['Montserrat',sans-serif] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Statewide Construction Portfolio</span>
            </div>

            <h1 className="font-['Montserrat',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#263238] tracking-tight leading-tight mb-4">
              All Architectural &amp; Engineering Projects
            </h1>

            <p className="text-[#667078] text-sm sm:text-base leading-relaxed mb-6 font-normal">
              Browse our complete track record of residential duplex villas, modern facade elevations, commercial arcades, and luxury interior executions delivered across Uttar Pradesh.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEnquiry('Portfolio Projects General Inquiry')}
                className="inline-flex items-center gap-2 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-6 sm:px-7 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span>Book Site Consultation for Your Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+916306659601"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#FFF1E9] text-[#263238] border border-[#FF6F2C] px-5 sm:px-6 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF6F2C]" />
                <span>Call Project Office: +91 6306659601</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── SEARCH & FILTER CONTROLS ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-4 sm:p-5 mb-8 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#667078] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city (e.g. Sultanpur, Hathras), project title..."
              className="w-full bg-[#FAF8F5] border border-[#D9D6D2] focus:border-[#FF6F2C] text-[#263238] text-xs sm:text-sm rounded-[8px] pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-[#667078]/70"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-[8px] font-['Montserrat',sans-serif] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#FF6F2C] text-white shadow-xs'
                    : 'bg-[#FAF8F5] hover:bg-[#FFF1E9] text-[#263238] border border-[#F1EFEC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── PROJECTS GRID ── */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-12 text-center my-8">
            <p className="text-sm font-semibold text-[#263238] mb-1">No projects matched your criteria.</p>
            <p className="text-xs text-[#667078] mb-4">Try clearing your search query or selecting a different category.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="px-4 py-2 bg-[#FF6F2C] text-white text-xs font-semibold rounded-[8px]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 mb-14">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-[10px] border border-[#F1EFEC] shadow-xs hover:shadow-md hover:border-[#FF6F2C]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                {/* Project Cover Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Status Badge */}
                  <span
                    className={`absolute top-3 left-3 text-[10.5px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[6px] shadow-xs ${
                      project.status === 'ONGOING'
                        ? 'bg-[#FF6F2C] text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {project.status === 'ONGOING' ? `ONGOING // ${project.progress}%` : `COMPLETED // ${project.year}`}
                  </span>

                  {/* High Res Tag */}
                  <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#263238] text-[10px] font-['Montserrat',sans-serif] font-semibold px-2 py-0.5 rounded-[4px] border border-[#F1EFEC] flex items-center gap-1 shadow-2xs">
                    <Maximize2 className="w-3 h-3 text-[#FF6F2C]" />
                    <span>View CAD Renders</span>
                  </span>
                </div>

                {/* Project Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-['Montserrat',sans-serif] font-semibold text-[#FF6F2C] uppercase tracking-wider mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{project.location}</span>
                    </div>

                    <h3 className="font-['Montserrat',sans-serif] font-bold text-lg sm:text-xl text-[#263238] group-hover:text-[#FF6F2C] transition-colors tracking-tight mb-2">
                      {project.title}
                    </h3>

                    <p className="font-['Inter',sans-serif] text-xs sm:text-sm text-[#667078] leading-relaxed line-clamp-2 mb-4">
                      {project.description}
                    </p>

                    {/* Quick Specs Pill */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#FAF8F5] rounded-[8px] border border-[#F1EFEC] mb-4 text-xs font-['Montserrat',sans-serif]">
                      <div>
                        <span className="text-[10px] text-[#667078] uppercase block">Built Area</span>
                        <span className="font-semibold text-[#263238]">{project.area}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#667078] uppercase block">Scope</span>
                        <span className="font-semibold text-[#FF6F2C]">{project.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="pt-3 border-t border-[#F1EFEC] flex items-center justify-between">
                    <span className="font-['Montserrat',sans-serif] text-xs font-semibold text-[#263238] group-hover:text-[#FF6F2C] flex items-center gap-1 transition-colors">
                      <span>Inspect Project Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>

                    <span className="w-8 h-8 rounded-[8px] bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 group-hover:bg-[#FF6F2C] group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── STATS BAR ── */}
        <div className="bg-[#263238] text-white rounded-[10px] p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center mb-12">
          <div>
            <div className="font-['Montserrat',sans-serif] text-2xl sm:text-4xl font-bold text-[#FF6F2C]">250+</div>
            <div className="text-xs text-[#FAF8F5]/80 font-['Inter',sans-serif] mt-1">Projects Completed</div>
          </div>
          <div>
            <div className="font-['Montserrat',sans-serif] text-2xl sm:text-4xl font-bold text-[#FF6F2C]">11+</div>
            <div className="text-xs text-[#FAF8F5]/80 font-['Inter',sans-serif] mt-1">Cities in Uttar Pradesh</div>
          </div>
          <div>
            <div className="font-['Montserrat',sans-serif] text-2xl sm:text-4xl font-bold text-[#FF6F2C]">10+</div>
            <div className="text-xs text-[#FAF8F5]/80 font-['Inter',sans-serif] mt-1">Years Civil Excellence</div>
          </div>
          <div>
            <div className="font-['Montserrat',sans-serif] text-2xl sm:text-4xl font-bold text-[#FF6F2C]">100%</div>
            <div className="text-xs text-[#FAF8F5]/80 font-['Inter',sans-serif] mt-1">Verified Client Satisfaction</div>
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-xs">
          <h3 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight mb-2">
            Want to Build a Landmark Structure Like These?
          </h3>
          <p className="text-sm text-[#667078] max-w-md mx-auto mb-6">
            Consult our chief structural engineers for customized floor plans, 3D elevations, and turnkey execution for your plot.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenEnquiry('Portfolio Projects Action Inquiry')}
              className="bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-7 py-3.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Get Estimate for Your Plot
            </button>
            <button
              onClick={onBackToHome}
              className="bg-[#FAF8F5] hover:bg-[#F1EFEC] text-[#263238] border border-[#F1EFEC] px-6 py-3.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>

      </div>

      {/* Render Project Detail Modal when a project is clicked */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenEnquiry={(title) => {
          setSelectedProject(null);
          onOpenEnquiry(title);
        }}
      />
    </div>
  );
};
