import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, ChevronDown, Building2, Users, Sparkles, FolderKanban, MessageSquareQuote, MapPin, Lock } from 'lucide-react';
import perSqftLogo from '../assets/perSqftLogo.png';

export type NavPageView = 'home' | 'services' | 'process' | 'projects' | 'reviews';

interface NavbarProps {
  visible: boolean;
  onOpenEnquiry: () => void;
  onOpenTools?: () => void;
  currentPage?: NavPageView;
  onNavigatePage?: (page: NavPageView) => void;
}

const CustomHamburgerIcon = ({ className = 'w-7 h-7' }: { className?: string }) => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 7C4 6.44771 4.44772 6 5 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H5C4.44772 8 4 7.55229 4 7Z" fill="currentColor" />
    <path d="M4 13.9998C4 13.4475 4.44772 12.9997 5 12.9997L16 13C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15L5 14.9998C4.44772 14.9998 4 14.552 4 13.9998Z" fill="currentColor" />
    <path d="M5 19.9998C4.44772 19.9998 4 20.4475 4 20.9998C4 21.552 4.44772 21.9997 22 21.9997H22C22.5523 21.9997 23 21.552 23 20.9998C23 20.4475 22.5523 19.9998 22 19.9998H5Z" fill="currentColor" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({
  visible,
  onOpenEnquiry,
  onOpenTools,
  currentPage = 'home',
  onNavigatePage,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    if (currentPage !== 'home' && onNavigatePage) {
      onNavigatePage('home');
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageNavigate = (page: NavPageView) => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    if (onNavigatePage) {
      onNavigatePage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMobileDropdown = (title: string) => {
    setOpenMobileDropdown(openMobileDropdown === title ? null : title);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        } ${
          scrolled
            ? 'bg-white border-b border-[#F1EFEC] shadow-xs py-2 sm:py-2.5'
            : 'bg-white border-b border-[#F1EFEC] shadow-[0_2px_18px_rgba(38,50,56,0.04)] py-2.5 sm:py-3.5'
        }`}
      >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between">
          
          {/* Left: Hamburger Toggle (All screens, opens comprehensive navigation drawer) */}
          <div className="flex items-center relative z-50">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#263238] hover:text-[#FF6F2C] focus:outline-none cursor-pointer rounded-[8px] hover:bg-[#FFF1E9]/70 transition-colors shrink-0"
              aria-label="Toggle menu"
            >
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
                <X
                  className={`w-7 h-7 sm:w-8 sm:h-8 absolute transition-all duration-[800ms] ease-in-out transform text-[#FF6F2C] ${
                    mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75 pointer-events-none'
                  }`}
                />
                <div
                  className={`absolute transition-all duration-[800ms] ease-in-out transform ${
                    mobileMenuOpen ? 'opacity-0 rotate-90 scale-75 pointer-events-none' : 'opacity-100 rotate-0 scale-100 text-[#263238] hover:text-[#FF6F2C]'
                  }`}
                >
                  <CustomHamburgerIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
              </div>
            </button>
          </div>

          {/* Center: Brand Logo (Enlarged) */}
          <a
            href="#home"
            className="flex items-center space-x-3 group shrink-0"
            onClick={(e) => {
              e.preventDefault();
              handlePageNavigate('home');
            }}
          >
            <img
              src={perSqftLogo}
              alt="PER SQFT Constructions"
              className="h-11 sm:h-13 md:h-14 lg:h-16 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            />
          </a>

          {/* Right: Phone Number Button (Primary CTA: 6-8px radius, #FF6F2C) */}
          <div className="flex items-center shrink-0">
            <a
              href="tel:+916306659601"
              className="inline-flex items-center justify-center gap-2 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm tracking-wide shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
              aria-label="Call +91 6306659601"
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>+91 6306659601</span>
            </a>
          </div>

        </div>
      </div>
    </header>

    {/* Full-Screen Circular Cover-Up Navigation Menu (Hardware-Accelerated & Ultra-Smooth) */}
    <div
      className={`fixed inset-0 z-40 bg-white flex flex-col justify-between overflow-y-auto select-none opacity-100 ${
        mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      style={{
        clipPath: mobileMenuOpen
          ? 'circle(160% at 28px 28px)'
          : 'circle(0% at 28px 28px)',
        WebkitClipPath: mobileMenuOpen
          ? 'circle(160% at 28px 28px)'
          : 'circle(0% at 28px 28px)',
        transition: 'clip-path 0.8s ease-in-out, -webkit-clip-path 0.8s ease-in-out',
        WebkitTransition: '-webkit-clip-path 0.8s ease-in-out, clip-path 0.8s ease-in-out',
        willChange: 'clip-path',
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
      }}
    >
        <div className="w-full max-w-lg mx-auto px-6 sm:px-8 pt-24 pb-8 flex flex-col justify-between min-h-screen">
          <div className="space-y-3.5">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handlePageNavigate('home');
              }}
              className={`block py-2.5 font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold uppercase transition-colors border-b border-[#F1EFEC] ${
                currentPage === 'home' ? 'text-[#FF6F2C]' : 'text-[#263238] hover:text-[#FF6F2C]'
              }`}
            >
              HOME
            </a>

            {/* Mobile Services Accordion */}
            <div className="border-b border-[#F1EFEC] pb-2">
              <button
                onClick={() => toggleMobileDropdown('SERVICES')}
                className={`w-full flex items-center justify-between py-2 font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold uppercase cursor-pointer ${
                  currentPage === 'services' ? 'text-[#FF6F2C]' : 'text-[#263238]'
                }`}
              >
                <span>SERVICES</span>
                <ChevronDown className={`w-5 h-5 text-[#FF6F2C] transition-transform duration-300 ${openMobileDropdown === 'SERVICES' ? 'rotate-180' : ''}`} />
              </button>
              {openMobileDropdown === 'SERVICES' && (
                <div className="pl-4 space-y-3 py-2 border-l-2 border-[#FF6F2C]/50 ml-2 animate-fadeIn">
                  <button
                    onClick={() => handlePageNavigate('services')}
                    className="w-full flex items-center justify-between text-sm font-['Montserrat',sans-serif] font-semibold text-[#FF6F2C] py-1 hover:underline text-left cursor-pointer"
                  >
                    <span>★ Explore All 7 Services (Full Page)</span>
                    <span className="text-[10px] bg-[#FFF1E9] px-2 py-0.5 rounded font-bold">VIEW</span>
                  </button>
                  <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="flex items-center space-x-2.5 text-sm font-['Montserrat',sans-serif] font-medium text-[#263238] py-1 hover:text-[#FF6F2C]">
                    <Sparkles className="w-4 h-4 text-[#FF6F2C]" />
                    <span>Custom Home Builds</span>
                  </a>
                  <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="flex items-center space-x-2.5 text-sm font-['Montserrat',sans-serif] font-medium text-[#263238] py-1 hover:text-[#FF6F2C]">
                    <Building2 className="w-4 h-4 text-[#FF6F2C]" />
                    <span>Real Estate Development</span>
                  </a>
                </div>
              )}
            </div>

            {/* Process Direct / Submenu */}
            <div className="border-b border-[#F1EFEC] pb-2">
              <button
                onClick={() => handlePageNavigate('process')}
                className={`w-full flex items-center justify-between py-2 font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold uppercase cursor-pointer text-left ${
                  currentPage === 'process' ? 'text-[#FF6F2C]' : 'text-[#263238] hover:text-[#FF6F2C]'
                }`}
              >
                <span>ROADMAP &amp; PROCESS</span>
                <span className="text-[10px] bg-[#FFF1E9] text-[#FF6F2C] font-bold px-2 py-0.5 rounded uppercase">
                  Interactive
                </span>
              </button>
            </div>

            {/* Mobile Showcase Accordion */}
            <div className="border-b border-[#F1EFEC] pb-2">
              <button
                onClick={() => toggleMobileDropdown('SHOWCASE')}
                className={`w-full flex items-center justify-between py-2 font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold uppercase cursor-pointer ${
                  currentPage === 'projects' || currentPage === 'reviews' ? 'text-[#FF6F2C]' : 'text-[#263238]'
                }`}
              >
                <span>SHOWCASE</span>
                <ChevronDown className={`w-5 h-5 text-[#FF6F2C] transition-transform duration-300 ${openMobileDropdown === 'SHOWCASE' ? 'rotate-180' : ''}`} />
              </button>
              {openMobileDropdown === 'SHOWCASE' && (
                <div className="pl-4 space-y-3 py-2 border-l-2 border-[#FF6F2C]/50 ml-2 animate-fadeIn">
                  <button
                    onClick={() => handlePageNavigate('projects')}
                    className="w-full flex items-center justify-between text-sm font-['Montserrat',sans-serif] font-semibold text-[#FF6F2C] py-1 hover:underline text-left cursor-pointer"
                  >
                    <span>★ All Projects Catalog (Full Page)</span>
                    <span className="text-[10px] bg-[#FFF1E9] px-2 py-0.5 rounded font-bold">PORTFOLIO</span>
                  </button>
                  <button
                    onClick={() => handlePageNavigate('reviews')}
                    className="w-full flex items-center justify-between text-sm font-['Montserrat',sans-serif] font-semibold text-[#FF6F2C] py-1 hover:underline text-left cursor-pointer"
                  >
                    <span>★ Client Reviews (4.9 ★)</span>
                    <span className="text-[10px] bg-[#FFF1E9] px-2 py-0.5 rounded font-bold">REVIEWS</span>
                  </button>
                  <a href="#projects" onClick={(e) => { e.preventDefault(); handleNavClick('#projects'); }} className="flex items-center space-x-2.5 text-sm font-['Montserrat',sans-serif] font-medium text-[#263238] py-1 hover:text-[#FF6F2C]">
                    <FolderKanban className="w-4 h-4 text-[#FF6F2C]" />
                    <span>Featured Recent Work</span>
                  </a>
                  <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleNavClick('#testimonials'); }} className="flex items-center space-x-2.5 text-sm font-['Montserrat',sans-serif] font-medium text-[#263238] py-1 hover:text-[#FF6F2C]">
                    <MessageSquareQuote className="w-4 h-4 text-[#FF6F2C]" />
                    <span>Client Testimonials</span>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Company Accordion */}
            <div className="border-b border-[#F1EFEC] pb-2">
              <button
                onClick={() => toggleMobileDropdown('COMPANY')}
                className="w-full flex items-center justify-between py-2 font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold uppercase text-[#263238] cursor-pointer"
              >
                <span>COMPANY</span>
                <ChevronDown className={`w-5 h-5 text-[#FF6F2C] transition-transform duration-300 ${openMobileDropdown === 'COMPANY' ? 'rotate-180' : ''}`} />
              </button>
              {openMobileDropdown === 'COMPANY' && (
                <div className="pl-4 space-y-3 py-2 border-l-2 border-[#FF6F2C]/50 ml-2 animate-fadeIn">
                  <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('#about'); }} className="flex items-center space-x-2.5 text-sm font-['Montserrat',sans-serif] font-medium text-[#263238] py-1 hover:text-[#FF6F2C]">
                    <Users className="w-4 h-4 text-[#FF6F2C]" />
                    <span>Leadership &amp; Team</span>
                  </a>
                </div>
              )}
            </div>

            {/* Tools Link */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTools?.();
              }}
              className="w-full flex items-center justify-between py-2.5 font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold uppercase text-[#263238] cursor-pointer border-b border-[#F1EFEC]"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#FF6F2C]" />
                <span>TOOLS</span>
              </div>
              <span className="bg-[#FF6F2C] text-white text-[10px] font-['Montserrat',sans-serif] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                NEW
              </span>
            </button>

            {/* Contact Link */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="block py-2.5 font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold uppercase text-[#263238] hover:text-[#FF6F2C] transition-colors border-b border-[#F1EFEC]"
            >
              CONTACT
            </a>

            {/* CMS Portal Link */}
            <a
              href="/admin/login.php"
              className="flex items-center justify-between py-2.5 font-['Montserrat',sans-serif] text-base sm:text-lg font-semibold uppercase text-[#263238] hover:text-[#FF6F2C] transition-colors border-b border-[#F1EFEC]"
              title="Open CMS Executive Portal"
            >
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-[#FF6F2C]" />
                <span>CMS PORTAL</span>
              </div>
              <span className="text-[10px] bg-[#FFF1E9] text-[#FF6F2C] font-bold px-2 py-0.5 rounded uppercase">
                ADMIN
              </span>
            </a>
          </div>

          {/* Bottom Action and Info Section */}
          <div className="pt-6 space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-3.5 sm:py-4 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white font-['Montserrat',sans-serif] text-sm font-semibold uppercase tracking-wider rounded-[8px] shadow-sm flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              <span>GET A QUOTE</span>
            </button>

            <div className="p-4 rounded-[8px] bg-[#FAF8F5] border border-[#F1EFEC] text-xs font-['Inter',sans-serif] text-[#667078] space-y-2">
              <div className="flex items-center space-x-2 text-[#263238] font-bold font-['Montserrat',sans-serif]">
                <Phone className="w-3.5 h-3.5 text-[#FF6F2C]" />
                <span>+91-6306659601</span>
              </div>
              <div className="pt-2 border-t border-[#F1EFEC] space-y-1.5">
                <div className="flex items-start space-x-2 text-[#263238]">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6F2C] shrink-0 mt-0.5" />
                  <span><strong>Hathras:</strong> Shop 14, Bagla College Mkt, Aligarh Rd (204101)</span>
                </div>
                <div className="flex items-start space-x-2 text-[#263238]">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6F2C] shrink-0 mt-0.5" />
                  <span><strong>Sultanpur HQ:</strong> Ramashankar Mkt, Busstand Rd, Civil Line (228001)</span>
                </div>
                <div className="text-[11px] font-bold text-[#FF6F2C] pt-1">
                  ✓ Working All Over Uttar Pradesh
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
