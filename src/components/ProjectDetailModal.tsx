import { useState } from 'react';
import type { Project } from '../data/projectsData';
import { X, MapPin, Activity, Maximize2, CheckCircle2 } from 'lucide-react';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onOpenEnquiry: (projectTitle?: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenEnquiry,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!project) return null;

  return (
    /* Outer Backdrop (Click outside closes modal) */
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn select-none"
    >
      {/* Inner Modal Card (Fits inside viewport, scrollable body, stop propagation) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[88vh] sm:max-h-[90vh] bg-white border border-slate-200/90 shadow-2xl rounded-3xl flex flex-col overflow-hidden"
      >
        
        {/* Sticky Top Header Bar */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-[11px] font-mono font-bold uppercase rounded-full shadow-xs ${
                project.status === 'ONGOING'
                  ? 'bg-[#F48033] text-white'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              {project.status === 'ONGOING' ? `ONGOING // ${project.progress}%` : `COMPLETED // ${project.year}`}
            </span>
            <span className="font-mono text-xs text-slate-500 hidden sm:inline-block">
              SLUG: {project.slug}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white border border-slate-200 hover:border-[#F48033] text-slate-600 hover:text-[#F48033] rounded-full transition-all cursor-pointer flex items-center justify-center"
            aria-label="Close project modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-6 sm:space-y-8 text-slate-900">
          
          {/* Main Title & Sub-header */}
          <div>
            <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-[#F48033] uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{project.location}</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {project.title}
            </h2>
          </div>

          {/* Large Hero Image Banner */}
          <div className="relative aspect-[16/9] max-h-80 w-full overflow-hidden border border-slate-200/80 bg-slate-100 rounded-2xl">
            <img
              src={selectedImage || project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover object-center"
            />

            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs border border-slate-200/90 px-3 py-1 font-mono text-[11px] text-slate-800 flex items-center space-x-1.5 rounded-full shadow-xs">
              <Maximize2 className="w-3 h-3 text-[#F48033]" />
              <span>HIGH RESOLUTION CAD PHOTOGRAPHY</span>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-4 sm:p-5 border border-slate-200/80 rounded-2xl">
            <div>
              <div className="font-mono text-[10px] text-slate-500 uppercase font-bold">LOCATION</div>
              <div className="font-heading text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{project.location}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-slate-500 uppercase font-bold">CATEGORY</div>
              <div className="font-heading text-xs sm:text-sm font-bold text-[#F48033] mt-0.5">{project.category}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-slate-500 uppercase font-bold">BUILT AREA</div>
              <div className="font-heading text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{project.area}</div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-slate-500 uppercase font-bold">COMPLETION</div>
              <div className="font-heading text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{project.year}</div>
            </div>
          </div>

          {/* Progress Bar if Ongoing */}
          {project.status === 'ONGOING' && (
            <div className="bg-orange-50/60 p-4 sm:p-5 border border-orange-200/80 rounded-2xl">
              <div className="flex items-center justify-between font-mono text-xs text-slate-900 mb-2 font-bold">
                <span className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[#F48033] animate-pulse" />
                  <span>ON-SITE EXECUTION PROGRESS</span>
                </span>
                <span className="text-[#F48033]">{project.progress}%</span>
              </div>

              <div className="w-full h-2.5 bg-orange-200/60 border border-orange-300/60 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#F48033] to-amber-500 rounded-full"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Overview & Detailed Copy */}
          <div className="space-y-2">
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wider">
              PROJECT OVERVIEW & STRUCTURAL SCOPE
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
              {project.description}
            </p>
          </div>

          {/* Structural Features Bullet List */}
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wider mb-3">
              TECHNICAL SPECIFICATIONS & HIGHLIGHTS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.features.map((feat) => (
                <div key={feat} className="flex items-center space-x-2.5 p-3 bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-[#F48033] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Gallery Grid */}
          {project.gallery && project.gallery.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wider">
                  PROJECT GALLERY ({project.gallery.length})
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.gallery.map((imgUrl, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className="relative aspect-[4/3] border border-slate-200/80 overflow-hidden cursor-pointer group bg-slate-100 rounded-xl"
                  >
                    <img
                      src={imgUrl}
                      alt={`${project.title} ${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-xs text-white font-bold">
                      VIEW
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Footer inside modal */}
          <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-mono text-xs text-slate-500 font-bold">
              INTERESTED IN A SIMILAR STRUCTURAL BUILD?
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenEnquiry(`Inquiry regarding ${project.title}`);
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#F48033] hover:bg-[#d96a20] text-white font-mono text-xs font-bold tracking-wider uppercase rounded-xl shadow-md transition-all cursor-pointer"
            >
              START PROJECT LIKE THIS
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
