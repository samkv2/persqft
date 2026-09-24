import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Activity, CheckCircle2, Building, Calendar, 
  Ruler, User, Phone, ArrowRight, ChevronLeft, ChevronRight, Layers
} from 'lucide-react';

export interface ProjectDetailData {
  id: string | number;
  slug?: string;
  title: string;
  location?: string;
  category?: string;
  status?: 'ONGOING' | 'COMPLETED' | string;
  progress?: number;
  year?: number | string;
  client?: string;
  area?: string;
  coverImage?: string;
  cover_image?: string;
  gallery?: string[];
  shortDescription?: string;
  short_description?: string;
  description?: string;
  features?: string[];
}

interface ProjectDetailModalProps {
  project: ProjectDetailData | null;
  onClose: () => void;
  onOpenEnquiry: (projectTitle?: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenEnquiry,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Normalize image URL helper
  const getImageUrl = (url?: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    return `/${url.replace(/^\/+/, '')}`;
  };

  // Build complete gallery list (cover image + gallery images, de-duplicated)
  const cover = project?.coverImage || project?.cover_image || '';
  const rawGallery = Array.isArray(project?.gallery) ? project.gallery : [];
  const allImages = Array.from(new Set([cover, ...rawGallery].filter(Boolean))).map(getImageUrl);

  // Reset active image on project change
  useEffect(() => {
    setActiveImageIndex(0);
    setIsPaused(false);
  }, [project]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [project]);

  // 2-second automatic slide time per image
  useEffect(() => {
    if (allImages.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
    }, 2000);

    return () => clearInterval(timer);
  }, [allImages.length, isPaused]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (allImages.length > 1) {
        if (e.key === 'ArrowLeft') {
          setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, allImages.length]);

  if (!project) return null;

  const currentImage = allImages[activeImageIndex] || getImageUrl(cover);
  const title = project.title || 'Architectural Project';
  const category = project.category || 'Architecture';
  const location = project.location || 'Uttar Pradesh, India';
  const client = project.client || 'Private Client';
  const area = project.area || 'Custom SQ.FT';
  const year = project.year || '2026';
  const status = (project.status || 'COMPLETED').toUpperCase();
  const progress = project.progress ?? 100;
  const description = project.description || project.short_description || project.shortDescription || 'Precision architectural design and structural engineering executed to perfection by PERSQFT CONSTRUCTIONS.';
  const features = Array.isArray(project.features) && project.features.length > 0 
    ? project.features 
    : [
        'Seismic Zone Resistant Structural RCC Framing',
        'Vastu Harmonized Spatial Flow & Natural Ventilation',
        'High-Performance Thermal Glazing & Facade Systems',
        'High-Grade Certified Steel & Concrete Verification',
      ];

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

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
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNextImage();
    } else if (distance < -minSwipeDistance) {
      handlePrevImage();
    }
  };

  return (
    /* Outer Backdrop with deep blur and click-to-dismiss */
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] bg-[#1E2330]/80 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      {/* Inner Modal Card — Generous width for desktop (max-w-5xl / 6xl) and full responsiveness for mobile */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl lg:max-w-6xl max-h-[92vh] sm:max-h-[90vh] bg-white border border-[#F1EFEC] shadow-2xl rounded-2xl sm:rounded-3xl flex flex-col overflow-hidden my-auto"
      >
        
        {/* ── STICKY TOP HEADER BAR ── */}
        <div className="px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 bg-white/95 backdrop-blur-xs border-b border-[#F1EFEC] flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center space-x-2.5 sm:space-x-3 overflow-hidden">
            {/* Category Tag */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[6px] bg-[#FFF1E9] text-[#FF6F2C] border border-[#FF6F2C]/30 text-xs font-['Montserrat',sans-serif] font-bold uppercase tracking-wider shrink-0">
              <Layers className="w-3.5 h-3.5" />
              <span>{category}</span>
            </span>

            {/* Status Indicator */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-['Montserrat',sans-serif] font-bold uppercase rounded-[6px] shadow-2xs shrink-0 ${
                status === 'ONGOING'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {status === 'ONGOING' ? (
                <>
                  <Activity className="w-3 h-3 animate-pulse" />
                  <span>ONGOING ({progress}%)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>COMPLETED ({year})</span>
                </>
              )}
            </span>

            {project.slug && (
              <span className="font-['Montserrat',sans-serif] text-xs text-[#8A95A0] hidden md:inline-block truncate">
                Ref: #{project.slug}
              </span>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 hover:bg-[#FFF1E9] active:scale-95 text-[#263238] hover:text-[#FF6F2C] border border-slate-200/70 hover:border-[#FF6F2C] rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── SCROLLABLE MODAL CONTENT BODY ── */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 space-y-6 sm:space-y-8 text-[#263238] custom-scrollbar">
          
          {/* Header Title & Location */}
          <div className="border-b border-[#F1EFEC] pb-5">
            <div className="flex items-center space-x-1.5 font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#FF6F2C] uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{location}</span>
            </div>

            <h2 id="project-modal-title" className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl md:text-4xl font-bold text-[#263238] tracking-tight leading-snug">
              {title}
            </h2>
          </div>

          {/* ── TWO-COLUMN HERO & GALLERY LAYOUT (Desktop: 2 Columns, Mobile: Stacked) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* Visuals Column (Gallery Showcase) */}
            <div className="lg:col-span-7 space-y-3.5">
              
              {/* Main Active Image Viewport */}
              <div 
                className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden border border-[#F1EFEC] bg-[#FAF8F5] rounded-xl sm:rounded-2xl shadow-xs group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <img
                  src={currentImage}
                  alt={`${title} - View ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover object-center transition-all duration-500 ease-out"
                />

                {/* Left/Right Prev/Next Buttons for Multiple Images */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#263238] hover:text-[#FF6F2C] shadow-md flex items-center justify-center transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 hover:bg-white text-[#263238] hover:text-[#FF6F2C] shadow-md flex items-center justify-center transition-all cursor-pointer opacity-90 group-hover:opacity-100"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Photo Counter Pill */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[11px] font-['Montserrat',sans-serif] font-bold px-3 py-1 rounded-full shadow-xs">
                    {activeImageIndex + 1} / {allImages.length} Photos
                  </div>
                )}
              </div>

              {/* Multi-Photo Thumbnail Bar */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar pt-1">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 sm:w-24 aspect-[4/3] rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-[#FF6F2C] shadow-sm scale-[1.02]'
                          : 'border-slate-200/80 hover:border-slate-300 opacity-70 hover:opacity-100'
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
            </div>

            {/* Project Quick-Specs Column */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* 4 Quick Facts Cards Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 border border-[#F1EFEC] rounded-xl flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 mt-0.5">
                    <Ruler className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078] uppercase font-bold tracking-wider block">BUILT AREA</span>
                    <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#263238] truncate block mt-0.5">{area}</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 border border-[#F1EFEC] rounded-xl flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078] uppercase font-bold tracking-wider block">YEAR / PHASE</span>
                    <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#263238] truncate block mt-0.5">{year}</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 border border-[#F1EFEC] rounded-xl flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078] uppercase font-bold tracking-wider block">CLIENT</span>
                    <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#263238] truncate block mt-0.5">{client}</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3.5 sm:p-4 border border-[#F1EFEC] rounded-xl flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 mt-0.5">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078] uppercase font-bold tracking-wider block">TYPE</span>
                    <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold text-[#FF6F2C] truncate block mt-0.5">{category}</span>
                  </div>
                </div>
              </div>

              {/* Progress Card if ONGOING */}
              {status === 'ONGOING' && (
                <div className="bg-[#FFF7F2] p-4 border border-[#FFF1E9] rounded-xl">
                  <div className="flex items-center justify-between font-['Montserrat',sans-serif] text-xs text-[#263238] mb-2 font-bold">
                    <span className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-[#FF6F2C] animate-pulse" />
                      <span>ON-SITE STRUCTURAL EXECUTION</span>
                    </span>
                    <span className="text-[#FF6F2C] font-extrabold">{progress}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-[#FFF1E9] border border-[#FF6F2C]/30 rounded-full relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF6F2C] to-[#E85B1E] rounded-full transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Direct In-Modal CTA Box */}
              <div className="bg-slate-50 p-4 sm:p-5 border border-slate-200/80 rounded-xl space-y-3">
                <span className="font-['Montserrat',sans-serif] text-xs font-bold text-[#263238] uppercase tracking-wider block">
                  Like this architectural standard?
                </span>
                <p className="text-xs text-[#667078] leading-relaxed">
                  Our chief engineers can inspect your plot, prepare customized blueprints, and deliver cost estimates within 48 hours.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenEnquiry(`Inquiry regarding project: ${title}`);
                    }}
                    className="w-full sm:flex-1 py-3 px-4 bg-[#FF6F2C] hover:bg-[#E85B1E] active:scale-95 text-white font-['Montserrat',sans-serif] font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Enquire for Similar Build</span>
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

          {/* ── OVERVIEW & DETAILED NARRATIVE ── */}
          <div className="space-y-3 pt-2 border-t border-[#F1EFEC]">
            <h3 className="font-['Montserrat',sans-serif] text-sm sm:text-base font-bold text-[#263238] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6F2C]"></span>
              <span>Project Scope &amp; Architectural Narrative</span>
            </h3>
            <p className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* ── TECHNICAL SPECIFICATIONS & SCOPE HIGHLIGHTS ── */}
          <div className="space-y-3 pt-2 border-t border-[#F1EFEC]">
            <h3 className="font-['Montserrat',sans-serif] text-sm sm:text-base font-bold text-[#263238] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6F2C]"></span>
              <span>Key Technical Specifications &amp; Deliverables</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((feat, i) => (
                <div 
                  key={i} 
                  className="flex items-start space-x-3 p-3 sm:p-3.5 bg-[#FAF8F5] border border-[#F1EFEC] font-['Inter',sans-serif] text-xs sm:text-[13px] text-[#263238] rounded-xl hover:border-[#FF6F2C]/40 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#FF6F2C] shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">{feat}</span>
                </div>
              ))}
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
                  onOpenEnquiry(`Inquiry regarding project: ${title}`);
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
