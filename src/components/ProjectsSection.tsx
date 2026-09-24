import React, { useState, useEffect } from 'react';
import type { Project } from '../data/projectsData';
import { cmsStore } from '../data/cmsStore';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ArrowRight } from 'lucide-react';
import elevationWebp from '../assets/serviceElevation.webp';
import elevationJpg from '../assets/serviceElevation.jpg';
import interiorWebp from '../assets/serviceInterior.webp';
import interiorJpg from '../assets/serviceInterior.jpg';
import planningWebp from '../assets/servicePlanning.webp';
import planningJpg from '../assets/servicePlanning.jpg';
import drawingsWebp from '../assets/serviceDrawings.webp';
import drawingsJpg from '../assets/serviceDrawings.jpg';

interface ProjectsSectionProps {
  onOpenEnquiry: (projectTitle?: string) => void;
  onViewAllProjects?: () => void;
}

interface RecentWorkItem {
  id: string;
  title: string;
  categoryDisplay: string;
  categoryFilter: 'Residential' | 'Commercial' | 'Interior' | 'Elevation' | 'Planning';
  imageWebp: string;
  imageJpg: string;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenEnquiry, onViewAllProjects }) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [cmsProjects, setCmsProjects] = useState<Project[]>(cmsStore.getProjects());

  useEffect(() => {
    const update = () => setCmsProjects(cmsStore.getProjects());
    update();
    const unsub = cmsStore.subscribe(update);
    return () => unsub();
  }, []);

  const filterTabs = ['All', 'Residential', 'Commercial', 'Interior', 'Elevation', 'Planning'];

  // Base featured recent projects matching mockup
  const baseProjects: RecentWorkItem[] = [
    {
      id: 'modern-residence',
      title: 'Modern Residence',
      categoryDisplay: 'Elevation Design',
      categoryFilter: 'Elevation',
      imageWebp: elevationWebp,
      imageJpg: elevationJpg,
    },
    {
      id: 'luxury-apartment',
      title: 'Luxury Apartment',
      categoryDisplay: 'Interior Design',
      categoryFilter: 'Interior',
      imageWebp: interiorWebp,
      imageJpg: interiorJpg,
    },
    {
      id: 'site-planning',
      title: 'Site Planning',
      categoryDisplay: 'Planning & Layout',
      categoryFilter: 'Planning',
      imageWebp: planningWebp,
      imageJpg: planningJpg,
    },
    {
      id: 'architectural-drawings',
      title: 'Architectural Drawings',
      categoryDisplay: 'Drawings',
      categoryFilter: 'Commercial',
      imageWebp: drawingsWebp,
      imageJpg: drawingsJpg,
    },
  ];

  // Secondary items mapped for category pills so filters feel active
  const extendedProjects: RecentWorkItem[] = [
    ...baseProjects,
    {
      id: 'golf-city-villa',
      title: 'The Glasshouse Modern Estate',
      categoryDisplay: 'Residential Architecture',
      categoryFilter: 'Residential',
      imageWebp: elevationWebp,
      imageJpg: elevationJpg,
    },
    {
      id: 'skyline-pinnacle',
      title: 'Skyline Commercial Landmark',
      categoryDisplay: 'Commercial Tower',
      categoryFilter: 'Commercial',
      imageWebp: drawingsWebp,
      imageJpg: drawingsJpg,
    },
  ];

  const displayedList =
    activeTab === 'All'
      ? baseProjects
      : extendedProjects.filter((item) => {
          if (activeTab === 'Residential') {
            return (
              item.categoryFilter === 'Residential' || item.id === 'modern-residence'
            );
          }
          if (activeTab === 'Elevation') {
            return item.categoryFilter === 'Elevation';
          }
          if (activeTab === 'Interior') {
            return item.categoryFilter === 'Interior';
          }
          if (activeTab === 'Planning') {
            return item.categoryFilter === 'Planning';
          }
          if (activeTab === 'Commercial') {
            return (
              item.categoryFilter === 'Commercial' ||
              item.id === 'architectural-drawings'
            );
          }
          return true;
        });

  const handleCardClick = (project: RecentWorkItem) => {
    // Check if there is a matching detailed project in cmsStore
    const found = cmsProjects.find(
      (p) =>
        p.title.toLowerCase().includes(project.title.toLowerCase()) ||
        p.category.toLowerCase().includes(project.categoryFilter.toLowerCase())
    );
    if (found) {
      setSelectedProject(found);
    } else {
      onOpenEnquiry(project.title);
    }
  };

  return (
    <section
      id="projects"
      className="py-14 sm:py-20 lg:py-24 bg-white relative overflow-hidden select-none border-b border-[#F1EFEC]"
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        {/* ── 1. SECTION HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="font-['Montserrat',sans-serif] text-base sm:text-lg lg:text-xl font-bold uppercase tracking-[0.14em] text-[#FF6F2C] mb-2.5 block">
              OUR PROJECTS
            </span>
            <h2 className="font-['Montserrat',sans-serif] font-semibold text-3xl sm:text-4xl lg:text-[2.65rem] text-[#263238] tracking-tight leading-tight">
              Our Recent Work
            </h2>
          </div>

          <div className="shrink-0 pt-2 md:pt-0">
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

        {/* ── 2. CATEGORY FILTER PILLS (Radius 6-8px, brand colors) ── */}
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

        {/* ── 3. 4-CARD RESPONSIVE GRID (Cards: 6-10px radius, border #F1EFEC) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {displayedList.map((project) => (
            <div
              key={project.id}
              onClick={() => handleCardClick(project)}
              className="bg-white rounded-[10px] border border-[#F1EFEC] shadow-[0_4px_20px_rgba(38,50,56,0.04)] hover:shadow-[0_16px_36px_rgba(38,50,56,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
            >
              {/* Card Thumbnail Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF8F5]">
                <picture className="w-full h-full">
                  <source srcSet={project.imageWebp} type="image/webp" />
                  <img
                    src={project.imageJpg}
                    alt={`${project.title} - ${project.categoryDisplay} by PERSQFT`}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </picture>
              </div>

              {/* Card Bottom Bar */}
              <div className="p-4 sm:p-5 flex items-center justify-between bg-white">
                <div className="pr-3">
                  <h3 className="font-['Montserrat',sans-serif] font-semibold text-base sm:text-[17px] text-[#263238] group-hover:text-[#FF6F2C] transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="font-['Inter',sans-serif] text-xs sm:text-sm text-[#667078] mt-0.5 font-normal">
                    {project.categoryDisplay}
                  </p>
                </div>

                {/* Orange Circular Arrow Button */}
                <div className="w-8 h-8 rounded-full border border-[#FF6F2C] text-[#FF6F2C] flex items-center justify-center shrink-0 group-hover:bg-[#FF6F2C] group-hover:text-white transition-all duration-200 shadow-2xs">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
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
