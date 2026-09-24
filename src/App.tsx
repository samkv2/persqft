import { useState, useEffect } from 'react';
import { Navbar, type NavPageView } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustSeparator } from './components/TrustSeparator';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { TeamSection } from './components/TeamSection';
import { ContactSection } from './components/ContactSection';
import { EnquiryModal } from './components/EnquiryModal';
import { ToolsModal } from './components/ToolsModal';
import { CmsAdminPanel } from './components/CmsAdminPanel';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { NotificationCard } from './components/NotificationCard';
import { AllServicesPage } from './pages/AllServicesPage';
import { FullProcessPage } from './pages/FullProcessPage';
import { AllProjectsPage } from './pages/AllProjectsPage';
import { AllReviewsPage } from './pages/AllReviewsPage';

export function App() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);
  const [initialProject, setInitialProject] = useState('');
  const [webUIVisible, setWebUIVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState<NavPageView>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#cms') {
        setCmsOpen(true);
      } else if (hash === '#services-page' || hash === '#all-services') {
        setCurrentPage('services');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#process-page' || hash === '#full-process') {
        setCurrentPage('process');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#projects-page' || hash === '#all-projects') {
        setCurrentPage('projects');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#reviews-page' || hash === '#all-reviews' || hash === '#testimonials-page') {
        setCurrentPage('reviews');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#home' || hash === '') {
        setCurrentPage('home');
      } else {
        // Section hash on landing page
        setCurrentPage('home');
        setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: NavPageView) => {
    setCurrentPage(page);
    const hashMap: Record<NavPageView, string> = {
      home: '#home',
      services: '#services-page',
      process: '#process-page',
      projects: '#projects-page',
      reviews: '#reviews-page',
    };
    window.location.hash = hashMap[page];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (title?: string) => {
    setInitialProject(title ?? '');
    setEnquiryOpen(true);
  };

  const handleScrollToProjects = () => {
    if (currentPage !== 'home') {
      navigateTo('home');
      setTimeout(() => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[#263238] selection:bg-[#FF6F2C] selection:text-white font-['Inter',sans-serif]">

      {/* Floating Owner WhatsApp & Direct Call Buttons */}
      <FloatingWhatsApp visible={webUIVisible} />

      {/* Floating Push Notification Subscribe Card */}
      <NotificationCard visible={webUIVisible} />

      {/* Navbar */}
      <Navbar
        visible={webUIVisible}
        currentPage={currentPage}
        onNavigatePage={navigateTo}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenTools={() => setToolsOpen(true)}
      />

      <main>
        {currentPage === 'home' && (
          <>
            {/* 01 — Unified Home Screen Segment */}
            <Hero
              onOpenEnquiry={() => handleOpenEnquiry()}
              onViewProjects={handleScrollToProjects}
              onWebUIReveal={() => setWebUIVisible(true)}
            />

            {/* 02 — Complete Design & Build Solutions (Positioned directly below landing page) */}
            <ServicesSection
              onOpenEnquiry={handleOpenEnquiry}
              onExploreAllServices={() => navigateTo('services')}
            />

            {/* 03 — Our Complete Roadmap & Why Choose Us (Just after Our Services) */}
            <ProcessSection
              onOpenEnquiry={handleOpenEnquiry}
              onViewFullProcess={() => navigateTo('process')}
            />

            {/* 04 — Featured Projects: Our Recent Work (Positioned directly after Process) */}
            <ProjectsSection
              onOpenEnquiry={handleOpenEnquiry}
              onViewAllProjects={() => navigateTo('projects')}
            />

            {/* 05 — Client Testimonials & Proven Track Record (Just below Projects Section) */}
            <TestimonialsSection
              onOpenEnquiry={handleOpenEnquiry}
              onViewMoreReviews={() => navigateTo('reviews')}
            />

            {/* Separator — Built on trust. Driven by precision. */}
            <TrustSeparator />

            {/* 06 — Meet Our Team */}
            <TeamSection />

            {/* 08 — Dedicated Contact & Lead Capture Section (Right above Footer) */}
            <ContactSection onOpenEnquiry={() => handleOpenEnquiry()} />
          </>
        )}

        {currentPage === 'services' && (
          <AllServicesPage
            onBackToHome={() => navigateTo('home')}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {currentPage === 'process' && (
          <FullProcessPage
            onBackToHome={() => navigateTo('home')}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {currentPage === 'projects' && (
          <AllProjectsPage
            onBackToHome={() => navigateTo('home')}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}

        {currentPage === 'reviews' && (
          <AllReviewsPage
            onBackToHome={() => navigateTo('home')}
            onOpenEnquiry={handleOpenEnquiry}
          />
        )}
      </main>

      {/* 07 — Footer */}
      <Footer
        currentPage={currentPage}
        onNavigatePage={navigateTo}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenCms={() => setCmsOpen(true)}
      />

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
