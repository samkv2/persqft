import { useState, useEffect } from 'react';
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
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (hostname.startsWith('admin.') || pathname === '/admin' || pathname === '/cms') {
      setIsAdminRoute(true);
    } else if (hash === '#admin' || hash === '#cms') {
      setCmsOpen(true);
    }
  }, []);

  if (isAdminRoute) {
    return (
      <CmsAdminPanel 
        isOpen={true} 
        onClose={() => { window.location.href = '/'; }} 
        isStandalonePage={true} 
      />
    );
  }

  const handleOpenEnquiry = (title?: string) => {
    setInitialProject(title ?? '');
    setEnquiryOpen(true);
  };

  const handleScrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-[#F48033] selection:text-white">

      {/* Floating Theme Accent Switcher Widget */}
      <ThemeAccentPicker visible={webUIVisible} />

      {/* Navbar */}
      <Navbar
        visible={webUIVisible}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenTools={() => setToolsOpen(true)}
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
      <Footer onOpenEnquiry={() => handleOpenEnquiry()} onOpenCms={() => setCmsOpen(true)} />

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
