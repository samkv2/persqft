import React, { useEffect } from 'react';
import { 
  X, CheckCircle2, Building, Phone, ArrowRight, 
  FileText, ExternalLink, ShieldCheck, Layers, Palette, 
  Compass, Ruler, Wrench, Home, Clock, Sparkles
} from 'lucide-react';

export interface ServiceDetailData {
  id: string | number;
  slug?: string;
  title: string;
  tagline?: string;
  category?: string;
  short_description?: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  imageWebp?: string;
  imageJpg?: string;
  iconName?: string;
  icon_name?: string;
  brochurePdf?: string | null;
  brochure_pdf?: string | null;
  brochureTitle?: string;
  brochure_title?: string;
  deliverables?: string;
  timeline?: string;
  inclusions?: string[];
  badge?: string | null;
}

interface ServiceDetailModalProps {
  service: ServiceDetailData | null;
  onClose: () => void;
  onOpenEnquiry: (serviceTitle?: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onOpenEnquiry,
}) => {
  // Normalize image URL helper
  const getImageUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    return `/${url.replace(/^\/+/, '')}`;
  };

  const getPdfUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `/${url.replace(/^\/+/, '')}`;
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [service]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!service) return null;

  const rawImg = service.image || service.imageWebp || service.imageJpg || '';
  const heroImage = getImageUrl(rawImg);
  const title = service.title || 'Architectural Service';
  const category = service.category || 'Design';
  const tagline = service.tagline || 'Engineered Precision & Architectural Excellence';
  const timeline = service.timeline || '3 - 5 Working Days';
  const deliverables = service.deliverables || 'Complete High-Resolution Architectural Dossier';
  const badge = service.badge;
  const pdfUrl = service.brochurePdf || service.brochure_pdf;
  const pdfTitle = service.brochureTitle || service.brochure_title || 'Comprehensive Service Dossier & Technical Specs (PDF)';
  const description = service.description || service.short_description || service.shortDescription || 'Precision architectural design and engineering executed to perfection by PERSQFT CONSTRUCTIONS.';
  
  // Parse or provide default inclusions
  const inclusions = Array.isArray(service.inclusions) && service.inclusions.length > 0
    ? service.inclusions
    : [
        'Photorealistic 3D Renders with Accurate Material Schedules',
        'Detailed Working CAD Drawings for Seamless On-Site Execution',
        'Vastu Harmonized Spatial Zoning & Natural Ventilation Analysis',
        'Multi-Point Civil Engineering Review & Quality Verification Matrix',
      ];

  const renderCategoryIcon = (iconName?: string) => {
    const name = iconName || service.icon_name || service.iconName;
    switch (name) {
      case 'palette':
        return <Palette className="w-4 h-4 text-[#FF6F2C]" />;
      case 'compass':
        return <Compass className="w-4 h-4 text-[#FF6F2C]" />;
      case 'ruler':
        return <Ruler className="w-4 h-4 text-[#FF6F2C]" />;
      case 'building':
        return <Building className="w-4 h-4 text-[#FF6F2C]" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-[#FF6F2C]" />;
      case 'wrench':
        return <Wrench className="w-4 h-4 text-[#FF6F2C]" />;
      case 'home':
      default:
        return <Home className="w-4 h-4 text-[#FF6F2C]" />;
    }
  };

  return (
    /* Outer Backdrop with deep blur and click-to-dismiss */
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] bg-[#1E2330]/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="service-modal-title"
    >
      {/* Inner Modal Card — Proper width for desktop (max-w-5xl / 6xl) and full responsiveness for mobile */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl lg:max-w-6xl max-h-[92vh] sm:max-h-[90vh] bg-white border border-[#F1EFEC] shadow-2xl rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden my-auto"
      >
        
        {/* ── STICKY TOP HEADER BAR ── */}
        <div className="px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 bg-white/95 backdrop-blur-xs border-b border-[#F1EFEC] flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center space-x-2.5 sm:space-x-3 overflow-hidden">
            {/* Category Tag */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#FFF1E9] text-[#FF6F2C] border border-[#FF6F2C]/30 text-xs font-['Montserrat',sans-serif] font-bold uppercase tracking-wider shrink-0">
              {renderCategoryIcon()}
              <span>{category}</span>
            </span>

            {/* Highlight Badge if exists */}
            {badge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-['Montserrat',sans-serif] font-bold uppercase rounded-[6px] bg-[#FF6F2C] text-white shadow-2xs shrink-0">
                <Sparkles className="w-3 h-3" />
                <span>{badge}</span>
              </span>
            )}

            {/* Timeline pill */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-['Montserrat',sans-serif] font-semibold text-[#667078] bg-[#FAF8F5] border border-[#F1EFEC] rounded-[6px] shrink-0">
              <Clock className="w-3 h-3 text-[#FF6F2C]" />
              <span>Turnaround: {timeline}</span>
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 hover:bg-[#FFF1E9] active:scale-95 text-[#263238] hover:text-[#FF6F2C] border border-slate-200/70 hover:border-[#FF6F2C] rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
            aria-label="Close service details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── SCROLLABLE MODAL CONTENT BODY ── */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-6 sm:space-y-8 text-[#263238] custom-scrollbar">
          
          {/* Header Title & Tagline */}
          <div className="border-b border-[#F1EFEC] pb-5">
            {tagline && (
              <div className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#FF6F2C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF6F2C]"></span>
                <span>{tagline}</span>
              </div>
            )}

            <h2 id="service-modal-title" className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-[#263238] tracking-tight leading-snug">
              {title}
            </h2>

            {service.short_description && (
              <p className="font-['Inter',sans-serif] text-sm sm:text-base text-[#667078] mt-2 leading-relaxed">
                {service.short_description}
              </p>
            )}
          </div>

          {/* ── TWO-COLUMN HERO & SPECIFICATION LAYOUT (Desktop: 2 Columns, Mobile: Stacked) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Visuals & Brochure Column */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Main Service Image Viewport */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden border border-[#F1EFEC] bg-[#FAF8F5] rounded-xl sm:rounded-2xl shadow-xs group">
                <img
                  src={heroImage}
                  alt={`${title} - PERSQFT Constructions`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white">
                    <span className="text-[11px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider text-[#FF6F2C] block">
                      PERSQFT STANDARD
                    </span>
                    <span className="text-sm sm:text-base font-bold font-['Montserrat',sans-serif]">
                      {category} Architectural Scope
                    </span>
                  </div>
                </div>
              </div>

              {/* View Complete Brochure (PDF) Button if uploaded via CMS */}
              {pdfUrl && (
                <div className="bg-[#FFF7F2] border border-[#FF6F2C]/30 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF1E9] border border-[#FF6F2C]/40 text-[#FF6F2C] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-['Montserrat',sans-serif] font-bold text-[#FF6F2C] uppercase tracking-wider block">
                        TECHNICAL DOSSIER
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#263238] truncate block">
                        {pdfTitle}
                      </h4>
                      <span className="text-[11px] text-[#667078] block">
                        Full BoQ, CAD details &amp; material catalog
                      </span>
                    </div>
                  </div>

                  <a
                    href={getPdfUrl(pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#FF6F2C] hover:bg-[#E85B1E] active:scale-95 text-white font-['Montserrat',sans-serif] font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>View Brochure (PDF)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Quick Specs Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 border border-[#F1EFEC] rounded-xl flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078] uppercase font-bold tracking-wider block">
                      DELIVERY TIMELINE
                    </span>
                    <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#263238] truncate block mt-0.5">
                      {timeline}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 border border-[#F1EFEC] rounded-xl flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 mt-0.5">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078] uppercase font-bold tracking-wider block">
                      PRIMARY OUTPUT
                    </span>
                    <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#263238] truncate block mt-0.5">
                      {deliverables}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 border border-[#F1EFEC] rounded-xl flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078] uppercase font-bold tracking-wider block">
                      QUALITY AUDIT
                    </span>
                    <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#263238] truncate block mt-0.5">
                      Zero Site Ambiguity
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 border border-[#F1EFEC] rounded-xl flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 mt-0.5">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078] uppercase font-bold tracking-wider block">
                      APPLICABILITY
                    </span>
                    <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#FF6F2C] truncate block mt-0.5">
                      Villas, Floors, Comm.
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Scope Narrative & Inclusions Column */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Scope & Methodology */}
              <div className="space-y-3 bg-[#FAF8F5] p-5 sm:p-6 border border-[#F1EFEC] rounded-xl sm:rounded-2xl">
                <h3 className="font-['Montserrat',sans-serif] text-sm sm:text-base font-bold text-[#263238] uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6F2C]"></span>
                  <span>Scope of Work &amp; Engineering Approach</span>
                </h3>
                <p className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Inclusions Checklist */}
              <div className="space-y-3">
                <h3 className="font-['Montserrat',sans-serif] text-sm sm:text-base font-bold text-[#263238] uppercase tracking-wider flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF6F2C]"></span>
                  <span>Included in This Service Package</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inclusions.map((inc, i) => (
                    <div 
                      key={i} 
                      className="flex items-start space-x-3 p-3 bg-white border border-[#F1EFEC] font-['Inter',sans-serif] text-xs sm:text-[13px] text-[#263238] rounded-xl hover:border-[#FF6F2C]/40 transition-colors shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#FF6F2C] shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct In-Modal CTA Box */}
              <div className="bg-slate-50 p-4 sm:p-5 border border-slate-200/80 rounded-xl space-y-3">
                <span className="font-['Montserrat',sans-serif] text-xs font-bold text-[#263238] uppercase tracking-wider block">
                  Ready to proceed with this service?
                </span>
                <p className="text-xs text-[#667078] leading-relaxed">
                  Our chief engineers and design leads will review your site measurements, provide preliminary blueprints, and answer all technical queries within 48 hours.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenEnquiry(`Inquiry for service: ${title}`);
                    }}
                    className="w-full sm:flex-1 py-3 px-4 bg-[#FF6F2C] hover:bg-[#E85B1E] active:scale-95 text-white font-['Montserrat',sans-serif] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Enquire for This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href="tel:+916306659601"
                    className="w-full sm:w-auto p-3 bg-white hover:bg-slate-100 text-[#263238] border border-slate-200 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-center space-x-1.5"
                    title="Call Engineering Desk"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FF6F2C]" />
                    <span className="sm:hidden md:inline">Call HQ</span>
                  </a>
                </div>
              </div>

            </div>

          </div>

          {/* ── BOTTOM ACTIONS ROW ── */}
          <div className="pt-6 border-t border-[#F1EFEC] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs font-['Montserrat',sans-serif] text-[#667078] font-semibold text-center sm:text-left">
              Managed via PERSQFT CMS • Data synchronized with database
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/2 sm:w-auto px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-['Montserrat',sans-serif] font-bold transition-colors cursor-pointer"
              >
                Close Window
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry(`Inquiry for service: ${title}`);
                }}
                className="w-1/2 sm:w-auto px-6 py-2.5 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white rounded-lg text-xs font-['Montserrat',sans-serif] font-bold shadow-xs transition-all cursor-pointer"
              >
                Enquire Now
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
