import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustSeparator } from './components/TrustSeparator';
import { OurStorySection } from './components/OurStorySection';
import { StatsSection } from './components/StatsSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { TeamSection } from './components/TeamSection';
import { ContactSection } from './components/ContactSection';
import { EnquiryModal } from './components/EnquiryModal';
import { ToolsModal } from './components/ToolsModal';
import { CmsAdminPanel } from './components/CmsAdminPanel';
import { Footer } from './components/Footer';
import { ThemeAccentPicker } from './components/ThemeAccentPicker';

export function App() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);
  const [initialProject, setInitialProject] = useState('');
  const [webUIVisible, setWebUIVisible] = useState(true);

  const handleOpenEnquiry = (title?: string) => {
    setInitialProject(title ?? '');
    setEnquiryOpen(true);
  };

  const handleScrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-[#F48033] selection:text-white">

      {/* Floating Permanent CMS Admin Trigger Badge (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-[999]">
        <button
          onClick={() => setCmsOpen(true)}
          className="group flex items-center space-x-2.5 px-4 py-2.5 bg-[#181C2B] hover:bg-[#2A75FF] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-full shadow-2xl transition-all duration-300 hover:scale-105 border border-slate-700/80 cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>CMS ADMIN PANEL</span>
        </button>
      </div>

      {/* Floating Theme Accent Switcher Widget */}
      <ThemeAccentPicker visible={webUIVisible} />

      {/* Navbar */}
      <Navbar
        visible={webUIVisible}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenTools={() => setToolsOpen(true)}
        onOpenCms={() => setCmsOpen(true)}
      />


      <main>
        {/* 01 — Unified Home Screen Segment */}
        <Hero
          onOpenEnquiry={() => handleOpenEnquiry()}
          onViewProjects={handleScrollToProjects}
          onWebUIReveal={() => setWebUIVisible(true)}
        />

        {/* Separator — Built on trust. Driven by precision. */}
        <TrustSeparator />

        {/* 02 — Our Story */}
        <OurStorySection onOpenEnquiry={() => handleOpenEnquiry()} />

        {/* 03 — Stats Counter */}
        <StatsSection />

        {/* 04 — Specialized Services */}
        <ServicesSection onOpenEnquiry={handleOpenEnquiry} />

        {/* 05 — Dedicated Contact & Inquiry Section */}
        <ContactSection />

        {/* 06 — Infinite Featured Projects Slider */}
        <ProjectsSection onOpenEnquiry={handleOpenEnquiry} />

        {/* 07 — What Our Clients Say (Testimonials) */}
        <TestimonialsSection />

        {/* 08 — Meet Our Team */}
        <TeamSection />
      </main>

      {/* 07 — Footer */}
      <Footer onOpenEnquiry={() => handleOpenEnquiry()} />

      {/* Enquiry Form Modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        initialProjectTitle={initialProject}
      />

      {/* Architectural Productivity Tools Hub Modal */}
      <ToolsModal
        isOpen={toolsOpen}
        onClose={() => setToolsOpen(false)}
        onOpenEnquiryWithDetails={(summary) => handleOpenEnquiry(summary)}
      />

      {/* PERSQFT CMS Admin Panel Modal (UI/UX Inspired Design) */}
      <CmsAdminPanel
        isOpen={cmsOpen}
        onClose={() => setCmsOpen(false)}
      />
    </div>
  );
}


export default App;
