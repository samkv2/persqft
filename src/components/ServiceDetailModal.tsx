import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Building, Phone, ArrowRight, 
  FileText, ExternalLink, ShieldCheck, Layers, Palette, 
  Compass, Ruler, Wrench, Home, Clock, Sparkles,
  ChevronLeft, ChevronRight, Maximize2, Eye
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
  gallery?: string[];
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
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

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

  // Reset active image & gallery state when service changes
  useEffect(() => {
    setActiveImageIndex(0);
    setIsGalleryOpen(false);
  }, [service]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [service]);

  // Build complete gallery list (cover image + gallery images, de-duplicated)
  const rawCover = service?.image || service?.imageWebp || service?.imageJpg || '';
  const rawGallery = Array.isArray(service?.gallery) ? service.gallery : [];
  const allImages = Array.from(new Set([rawCover, ...rawGallery].filter(Boolean))).map(getImageUrl);
  const currentImage = allImages[activeImageIndex] || getImageUrl(rawCover);

  // Close on Escape key & Arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isGalleryOpen) {
          setIsGalleryOpen(false);
        } else {
          onClose();
        }
      } else if (allImages.length > 1) {
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isGalleryOpen, allImages.length]);

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
    setTouchStartX(null);
  };

  if (!service) return null;

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
          <div className="flex items-center space-x-2 sm:space-x-2.5 overflow-hidden">
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

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Top Bar Prominent View Brochure Button */}
            {pdfUrl && (
              <a
                href={getPdfUrl(pdfUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#FFF1E9] hover:bg-[#FF6F2C] text-[#FF6F2C] hover:text-white border border-[#FF6F2C]/40 text-xs font-['Montserrat',sans-serif] font-bold transition-all shadow-2xs group shrink-0"
                title={pdfTitle}
              >
                <FileText className="w-4 h-4 text-[#FF6F2C] group-hover:text-white transition-colors" />
                <span className="hidden sm:inline">View Brochure (PDF)</span>
                <span className="sm:hidden">Brochure (PDF)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75 group-hover:opacity-100 transition-opacity" />
              </a>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 hover:bg-[#FFF1E9] active:scale-95 text-[#263238] hover:text-[#FF6F2C] border border-slate-200/70 hover:border-[#FF6F2C] rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
              aria-label="Close service details modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
              
              {/* Main Service Image Viewport / Slider */}
              <div 
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden border border-[#F1EFEC] bg-[#FAF8F5] rounded-xl sm:rounded-2xl shadow-xs group select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  key={activeImageIndex}
                  src={currentImage}
                  alt={`${title} - View ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 pointer-events-none" />

                {/* Left/Right Prev/Next Buttons for Multiple Images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#FF6F2C] text-white backdrop-blur-md shadow-lg flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 z-10"
                      aria-label="Previous service image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-[#FF6F2C] text-white backdrop-blur-md shadow-lg flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100 hover:scale-110 active:scale-95 z-10"
                      aria-label="Next service image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Floating Action Buttons */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  {/* View Gallery Button */}
                  <button
                    type="button"
                    onClick={() => setIsGalleryOpen(true)}
                    className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/65 hover:bg-[#FF6F2C] text-white text-xs font-['Montserrat',sans-serif] font-bold backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer group/btn"
                    title="Open full view gallery slider"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#FF6F2C] group-hover/btn:text-white transition-colors" />
                    <span>View Gallery {allImages.length > 1 ? `(${allImages.length})` : ''}</span>
                  </button>

                  {/* Floating Brochure (PDF) Button */}
                  {pdfUrl && (
                    <a
                      href={getPdfUrl(pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/65 hover:bg-[#FF6F2C] text-white text-xs font-['Montserrat',sans-serif] font-bold backdrop-blur-md shadow-md transition-all group/pdf"
                      title={pdfTitle}
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FF6F2C] group-hover/pdf:text-white" />
                      <span className="hidden sm:inline">Brochure (PDF)</span>
                      <span className="sm:hidden">PDF</span>
                      <ExternalLink className="w-3 h-3 opacity-75 group-hover/pdf:opacity-100" />
                    </a>
                  )}
                </div>

                {/* Bottom Info Bar inside Hero Image */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10 pointer-events-none">
                  <div className="text-white text-shadow-sm">
                    <span className="text-[10px] sm:text-[11px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider text-[#FF6F2C] block">
                      PERSQFT SPECIFICATION
                    </span>
                    <span className="text-xs sm:text-sm font-bold font-['Montserrat',sans-serif] block truncate max-w-[220px] sm:max-w-xs">
                      {title}
                    </span>
                  </div>

                  {allImages.length > 1 && (
                    <div className="pointer-events-auto bg-black/75 backdrop-blur-xs text-white text-[11px] font-['Montserrat',sans-serif] font-bold px-3 py-1 rounded-full shadow-xs">
                      {activeImageIndex + 1} / {allImages.length} Photos
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Photo Thumbnail Bar & View Gallery Banner */}
              {allImages.length > 1 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar pt-0.5">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-16 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          activeImageIndex === idx
                            ? 'border-[#FF6F2C] shadow-sm scale-[1.03]'
                            : 'border-slate-200/80 hover:border-slate-300 opacity-65 hover:opacity-100'
                        }`}
                        aria-label={`View photo ${idx + 1}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#667078] px-1">
                    <span className="font-['Montserrat',sans-serif] font-medium text-[11px]">
                      Swipe or click arrows to browse ({allImages.length} photos)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsGalleryOpen(true)}
                      className="inline-flex items-center gap-1 text-[#FF6F2C] hover:text-[#E85B1E] font-['Montserrat',sans-serif] font-bold text-xs cursor-pointer hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open Fullscreen Gallery</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Technical Dossier & Brochure Card (Stacked layout with full-width button to guarantee zero overflow) */}
              {pdfUrl && (
                <div className="bg-[#FFF7F2] border border-[#FF6F2C]/30 rounded-xl p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF1E9] border border-[#FF6F2C]/40 text-[#FF6F2C] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-['Montserrat',sans-serif] font-bold text-[#FF6F2C] uppercase tracking-wider block">
                        TECHNICAL DOSSIER &amp; SPECIFICATIONS
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-[#263238] truncate block" title={pdfTitle}>
                        {pdfTitle}
                      </h4>
                      <span className="text-[11px] text-[#667078] block truncate">
                        Full BoQ, CAD details &amp; material catalog
                      </span>
                    </div>
                  </div>

                  <a
                    href={getPdfUrl(pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 bg-[#FF6F2C] hover:bg-[#E85B1E] active:scale-95 text-white font-['Montserrat',sans-serif] font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open Complete Brochure (PDF)</span>
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

            <div className="flex items-center space-x-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-1/3 sm:w-auto px-4 sm:px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-['Montserrat',sans-serif] font-bold transition-colors cursor-pointer"
              >
                Close Window
              </button>

              {pdfUrl && (
                <a
                  href={getPdfUrl(pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-1/3 sm:w-auto px-4 py-2.5 rounded-lg bg-[#FFF1E9] hover:bg-[#FFE4D4] text-[#FF6F2C] border border-[#FF6F2C]/40 text-xs font-['Montserrat',sans-serif] font-bold transition-all shadow-2xs flex items-center justify-center gap-1.5"
                  title={pdfTitle}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Brochure (PDF)</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}

              <button
                onClick={() => {
                  onClose();
                  onOpenEnquiry(`Inquiry for service: ${title}`);
                }}
                className="w-1/3 sm:w-auto px-5 sm:px-6 py-2.5 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white rounded-lg text-xs font-['Montserrat',sans-serif] font-bold shadow-xs transition-all cursor-pointer"
              >
                Enquire Now
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ── FULL-SCREEN GALLERY LIGHTBOX MODAL ── */}
      {isGalleryOpen && (
        <div
          onClick={() => setIsGalleryOpen(false)}
          className="fixed inset-0 z-[1050] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-3 sm:p-6 animate-fadeIn select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Full screen photo gallery"
        >
          {/* Top Bar */}
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center justify-between px-2 sm:px-4 py-2 border-b border-white/10 shrink-0 text-white"
          >
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden">
              <span className="px-2.5 py-1 rounded-[6px] bg-[#FF6F2C] text-white text-[11px] font-['Montserrat',sans-serif] font-bold uppercase tracking-wider shrink-0">
                {category}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold font-['Montserrat',sans-serif] truncate">
                  {title}
                </h3>
                <span className="text-[11px] text-white/60 block sm:inline">
                  Photo {activeImageIndex + 1} of {allImages.length}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <span className="hidden md:inline-block text-xs text-white/50 font-['Montserrat',sans-serif] mr-2">
                Press Esc or click ✕ to exit
              </span>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FF6F2C] text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                aria-label="Close full gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage with Big Arrows and Touch Swipe */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 flex items-center justify-center my-3 sm:my-4 px-2 sm:px-12 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {allImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-[#FF6F2C] text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}

            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <img
                key={activeImageIndex}
                src={currentImage}
                alt={`${title} - Photo ${activeImageIndex + 1}`}
                className="max-w-[92vw] sm:max-w-[85vw] max-h-[70vh] sm:max-h-[76vh] object-contain rounded-xl shadow-2xl transition-all duration-300 animate-fadeIn"
              />
            </div>

            {allImages.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-[#FF6F2C] text-white backdrop-blur-md flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 px-2 sm:px-4 py-2 border-t border-white/10 flex flex-col items-center gap-2"
          >
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1 custom-scrollbar">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 sm:w-20 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#FF6F2C] ring-2 ring-[#FF6F2C]/50 scale-105'
                        : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            
            <div className="text-[11px] text-white/50 font-['Montserrat',sans-serif]">
              Use keyboard arrows ← → or swipe on mobile to navigate
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
