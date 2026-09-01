import React, { useState, useEffect } from 'react';
import type { Project } from '../data/projectsData';

import { cmsStore } from '../data/cmsStore';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface ProjectsSectionProps {
  onOpenEnquiry: (projectTitle?: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenEnquiry }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [allProjects, setAllProjects] = useState<Project[]>(cmsStore.getProjects());

  useEffect(() => {
    const updateProjects = () => setAllProjects(cmsStore.getProjects());
    updateProjects();
    const unsub = cmsStore.subscribe(updateProjects);
    return () => unsub();
  }, []);

  const categories = ['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'ARCHITECTURE', 'TURNKEY', 'ONGOING', 'COMPLETED'];

  const filteredProjects = allProjects.filter((proj) => {
    if (filter === 'ALL') return true;
    if (filter === 'ONGOING') return proj.status === 'ONGOING';
    if (filter === 'COMPLETED') return proj.status === 'COMPLETED';
    return proj.category.toUpperCase() === filter;
  });


  // Triplicate the cards array for seamless infinite looping
  const displayProjects = [...filteredProjects, ...filteredProjects, ...filteredProjects];
  const [currentIndex, setCurrentIndex] = useState<number>(filteredProjects.length);

  // Reset index to middle set when filter changes
  useEffect(() => {
    setIsTransitioning(false);
    setCurrentIndex(filteredProjects.length);
  }, [filter, filteredProjects.length]);

  // Infinite Slider Auto-Play Logic (Card-by-card slide with break)
  useEffect(() => {
    if (!isAutoPlaying || filteredProjects.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 3800); // 3.8s break per card

    return () => clearInterval(interval);
  }, [isAutoPlaying, filteredProjects.length]);

  // Seamless boundary wrap check after transition completes
  const handleTransitionEnd = () => {
    if (currentIndex >= filteredProjects.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(filteredProjects.length);
    } else if (currentIndex < filteredProjects.length) {
      setIsTransitioning(false);
      setCurrentIndex(filteredProjects.length * 2 - 1);
    }
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const activeNormalizedIndex = currentIndex % filteredProjects.length;

  return (
    <section id="projects" className="py-16 sm:py-24 relative bg-white border-b border-slate-200/80 overflow-hidden select-none">
      
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Our Projects
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-normal mt-2.5 max-w-xl mx-auto">
              From a couple to Large Indian Family, we have houses built with emotions for everyone
            </p>
          </div>

          {/* Filter Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 border-b border-slate-200/80 pb-4 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 text-xs font-mono tracking-wider uppercase transition-all rounded-full cursor-pointer shrink-0 ${
                  filter === cat
                    ? 'bg-[#F48033] text-white font-bold shadow-md shadow-orange-500/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* CAROUSEL SLIDER VIEWPORT WITH NAVIGATION ARROWS */}
        <div
          className="relative px-2 sm:px-6"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200/90 text-[#F48033] hover:bg-[#F48033] hover:text-white shadow-md flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200/90 text-[#F48033] hover:bg-[#F48033] hover:text-white shadow-md flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Smooth Motion Infinite Slider Track */}
          <div className="overflow-hidden w-full rounded-3xl py-2">
            <div
              onTransitionEnd={handleTransitionEnd}
              className={`flex ${
                isTransitioning
                  ? 'transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]'
                  : 'transition-none'
              }`}
              style={{
                transform: `translateX(-${(currentIndex * 100) / 3}%)`,
              }}
            >
              {displayProjects.map((project, idx) => (
                <div
                  key={`${project.id}-${idx}`}
                  className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3"
                >
                  <div
                    onClick={() => setSelectedProject(project)}
                    className="group bg-white border border-slate-200/80 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col transform hover:-translate-y-1"
                  >
                    {/* Top Architectural Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        draggable={false}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop';
                        }}
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 pointer-events-none select-none"
                      />

                      {/* Status Badge Overlay */}
                      <div className="absolute top-3 left-3 z-10">
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md shadow-xs ${
                            project.status === 'ONGOING'
                              ? 'bg-[#F48033] text-white'
                              : 'bg-slate-900/85 text-white'
                          }`}
                        >
                          {project.status === 'ONGOING' ? 'ONGOING' : 'COMPLETED'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom White Card Content Box */}
                    <div className="p-4 sm:p-5 text-center bg-white flex flex-col justify-center border-t border-slate-100">
                      <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#F48033] transition-colors leading-snug truncate">
                        {project.title}
                      </h3>

                      <p className="text-slate-500 text-xs font-medium tracking-wide mt-1 truncate">
                        {project.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM PAGINATION DOTS */}
        <div className="mt-6 flex items-center justify-center gap-1.5">
          {filteredProjects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsTransitioning(true);
                setCurrentIndex(filteredProjects.length + idx);
                setIsAutoPlaying(false);
              }}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeNormalizedIndex === idx
                  ? 'w-6 h-2 bg-[#F48033]'
                  : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Go to project slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* Project Specs Modal View */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenEnquiry={onOpenEnquiry}
      />
    </section>
  );
};
