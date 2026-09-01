import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone, RefreshCw, ChevronDown, Building2, Users, Sparkles, FolderKanban, MessageSquareQuote } from 'lucide-react';
import perSqftLogo from '../assets/perSqftLogo.png';

interface NavbarProps {
  visible: boolean;
  onOpenEnquiry: () => void;
  onOpenTools?: () => void;
  onReplayIntro?: () => void;
  onOpenCms?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ visible, onOpenEnquiry, onOpenTools, onReplayIntro, onOpenCms }) => {

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<string | null>(null);

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'projects', 'services', 'about', 'team', 'testimonials', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDesktopDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    setOpenMobileDropdown(null);
    setActiveDesktopDropdown(null);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleDesktopDropdown = (title: string) => {
    setActiveDesktopDropdown((prev) => (prev === title ? null : title));
  };

  const toggleMobileDropdown = (title: string) => {
    setOpenMobileDropdown(openMobileDropdown === title ? null : title);
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      } ${
        scrolled
          ? 'bg-white/85 backdrop-blur-2xl backdrop-saturate-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_10px_35px_rgba(0,0,0,0.08)] border-b border-white/60 py-2.5 sm:py-3'
          : 'bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.04)] py-3 sm:py-4'
      }`}
    >
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <a
            href="#home"
            className="flex items-center space-x-3 group shrink-0"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
          >
            <img
              src={perSqftLogo}
              alt="PER SQFT Constructions"
              className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${
                scrolled ? 'h-8 sm:h-9 lg:h-11' : 'h-10 sm:h-12 lg:h-14'
              }`}
            />
          </a>

          {/* Desktop & Tablet Navigation Links (Responsive lg:flex for smooth fit across tablets) */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-9">
            
            {/* 1. Home Link */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
              className={`font-mono text-sm xl:text-[15px] font-bold uppercase tracking-wider transition-colors py-1.5 ${
                activeSection === 'home' ? 'text-[#F48033]' : 'text-slate-800 hover:text-[#F48033]'
              }`}
            >
              HOME
            </a>

            {/* 2. Company Dropdown (Hover + Click support for tablets with unbreakable hover bridge) */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDesktopDropdown('COMPANY')}
              onMouseLeave={() => setActiveDesktopDropdown(null)}
            >
              <button
                onClick={() => toggleDesktopDropdown('COMPANY')}
                className={`flex items-center space-x-1.5 font-mono text-sm xl:text-[15px] font-bold uppercase tracking-wider py-1 cursor-pointer transition-colors ${
                  activeDesktopDropdown === 'COMPANY' ? 'text-[#F48033]' : 'text-slate-800 hover:text-[#F48033]'
                }`}
              >
                <span>COMPANY</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 text-[#F48033] ${
                    activeDesktopDropdown === 'COMPANY' ? 'rotate-180' : 'group-hover:rotate-180'
                  }`}
                />
              </button>

              {/* Clean Dropdown Box with Unbreakable Hover Bridge */}
              <div
                className={`absolute top-full left-0 pt-2 -mt-1 w-56 transition-all duration-200 transform origin-top z-50 ${
                  activeDesktopDropdown === 'COMPANY'
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                }`}
              >
                <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2.5 before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:content-['']">
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#about');
                    }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50/70 transition-colors group/item"
                  >
                    <Building2 className="w-4 h-4 text-[#F48033] shrink-0" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 group-hover/item:text-[#F48033]">
                      Our Story & Legacy
                    </span>
                  </a>

                  <a
                    href="#team"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#team');
                    }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50/70 transition-colors group/item"
                  >
                    <Users className="w-4 h-4 text-[#F48033] shrink-0" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 group-hover/item:text-[#F48033]">
                      Leadership & Team
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* 3. Services Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDesktopDropdown('SERVICES')}
              onMouseLeave={() => setActiveDesktopDropdown(null)}
            >
              <button
                onClick={() => toggleDesktopDropdown('SERVICES')}
                className={`flex items-center space-x-1.5 font-mono text-sm xl:text-[15px] font-bold uppercase tracking-wider py-1 cursor-pointer transition-colors ${
                  activeDesktopDropdown === 'SERVICES' ? 'text-[#F48033]' : 'text-slate-800 hover:text-[#F48033]'
                }`}
              >
                <span>SERVICES</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 text-[#F48033] ${
                    activeDesktopDropdown === 'SERVICES' ? 'rotate-180' : 'group-hover:rotate-180'
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-0 pt-2 -mt-1 w-60 transition-all duration-200 transform origin-top z-50 ${
                  activeDesktopDropdown === 'SERVICES'
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                }`}
              >
                <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2.5 before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:content-['']">
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#services');
                    }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50/70 transition-colors group/item"
                  >
                    <Sparkles className="w-4 h-4 text-[#F48033] shrink-0" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 group-hover/item:text-[#F48033]">
                      Custom Home Builds
                    </span>
                  </a>

                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#services');
                    }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50/70 transition-colors group/item"
                  >
                    <Building2 className="w-4 h-4 text-[#F48033] shrink-0" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 group-hover/item:text-[#F48033]">
                      Real Estate & Commercial
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* 4. Showcase Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveDesktopDropdown('SHOWCASE')}
              onMouseLeave={() => setActiveDesktopDropdown(null)}
            >
              <button
                onClick={() => toggleDesktopDropdown('SHOWCASE')}
                className={`flex items-center space-x-1.5 font-mono text-sm xl:text-[15px] font-bold uppercase tracking-wider py-1 cursor-pointer transition-colors ${
                  activeDesktopDropdown === 'SHOWCASE' ? 'text-[#F48033]' : 'text-slate-800 hover:text-[#F48033]'
                }`}
              >
                <span>SHOWCASE</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 text-[#F48033] ${
                    activeDesktopDropdown === 'SHOWCASE' ? 'rotate-180' : 'group-hover:rotate-180'
                  }`}
                />
              </button>

              <div
                className={`absolute top-full left-0 pt-2 -mt-1 w-56 transition-all duration-200 transform origin-top z-50 ${
                  activeDesktopDropdown === 'SHOWCASE'
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto'
                }`}
              >
                <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-2.5 before:absolute before:-top-4 before:left-0 before:w-full before:h-4 before:content-['']">
                  <a
                    href="#projects"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#projects');
                    }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50/70 transition-colors group/item"
                  >
                    <FolderKanban className="w-4 h-4 text-[#F48033] shrink-0" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 group-hover/item:text-[#F48033]">
                      Featured Projects
                    </span>
                  </a>

                  <a
                    href="#testimonials"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick('#testimonials');
                    }}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-orange-50/70 transition-colors group/item"
                  >
                    <MessageSquareQuote className="w-4 h-4 text-[#F48033] shrink-0" />
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 group-hover/item:text-[#F48033]">
                      Client Reviews
                    </span>
                  </a>
                </div>
              </div>
            </div>

            {/* 5. Tools Link */}
            <button
              onClick={() => onOpenTools?.()}
              className="flex items-center space-x-1.5 font-mono text-sm xl:text-[15px] font-bold uppercase tracking-wider text-slate-800 hover:text-[#F48033] transition-colors py-1.5 cursor-pointer relative group"
            >
              <span>TOOLS</span>
              <span className="bg-[#F48033] text-white text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                NEW
              </span>
            </button>

            {/* 6. Contact Link */}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className={`font-mono text-sm xl:text-[15px] font-bold uppercase tracking-wider transition-colors py-1.5 ${
                activeSection === 'contact' ? 'text-[#F48033]' : 'text-slate-800 hover:text-[#F48033]'
              }`}
            >
              CONTACT
            </a>

            {/* 7. Direct CMS Panel Link */}
            {onOpenCms && (
              <button
                onClick={onOpenCms}
                className="flex items-center space-x-2 font-mono text-xs xl:text-sm font-bold uppercase tracking-wider text-white bg-[#181C2B] hover:bg-[#2A75FF] transition-all px-3.5 py-2 rounded-xl shadow-md cursor-pointer border border-slate-700"
                title="Open CMS Admin Dashboard"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>CMS PANEL</span>
              </button>
            )}
          </nav>


          {/* Action Buttons (Enhanced Design & Increased Text Size) */}
          <div className="hidden lg:flex items-center space-x-3.5">
            {onOpenCms && (
              <button
                onClick={onOpenCms}
                className="flex items-center space-x-2 px-4 py-3 bg-[#181C2B] hover:bg-[#2A75FF] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md transition-all duration-200 cursor-pointer border border-slate-700/80"
                title="Open CMS Admin Dashboard"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>CMS PANEL</span>
              </button>
            )}

            {onReplayIntro && (
              <button
                onClick={onReplayIntro}
                className="flex items-center space-x-2 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-700 hover:text-[#F48033] border border-slate-300 hover:border-[#F48033] rounded-xl transition-all cursor-pointer hover:bg-orange-50/50"
                title="Replay Entrance Animation"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#F48033]" />
                <span>REPLAY INTRO</span>
              </button>
            )}

            <button
              onClick={onOpenEnquiry}
              className="group flex items-center space-x-2.5 bg-[#F48033] hover:opacity-90 text-white font-mono text-xs sm:text-sm font-bold uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              <span>GET A QUOTE</span>
            </button>
          </div>


          {/* Mobile & Tablet Hamburger Toggle (< 1024px screens) */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-900 hover:text-[#F48033] focus:outline-none cursor-pointer rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-2xl border-b border-slate-200 px-6 pt-5 pb-7 space-y-4 animate-fadeIn select-none shadow-2xl">
          
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="block py-2 font-mono text-base font-bold uppercase text-slate-900"
          >
            HOME
          </a>

          {/* Mobile Company Accordion */}
          <div>
            <button
              onClick={() => toggleMobileDropdown('COMPANY')}
              className="w-full flex items-center justify-between py-2 font-mono text-base font-bold uppercase text-slate-900 cursor-pointer"
            >
              <span>COMPANY</span>
              <ChevronDown className={`w-5 h-5 text-[#F48033] transition-transform duration-200 ${openMobileDropdown === 'COMPANY' ? 'rotate-180' : ''}`} />
            </button>
            {openMobileDropdown === 'COMPANY' && (
              <div className="pl-4 space-y-2.5 py-2 border-l-2 border-[#F48033]/40 ml-2">
                <a href="#about" onClick={(e) => { e.preventDefault(); handleNavClick('#about'); }} className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-800 py-1 hover:text-[#F48033]">
                  <Building2 className="w-4 h-4 text-[#F48033]" />
                  <span>Our Story & Legacy</span>
                </a>
                <a href="#team" onClick={(e) => { e.preventDefault(); handleNavClick('#team'); }} className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-800 py-1 hover:text-[#F48033]">
                  <Users className="w-4 h-4 text-[#F48033]" />
                  <span>Leadership & Team</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Services Accordion */}
          <div>
            <button
              onClick={() => toggleMobileDropdown('SERVICES')}
              className="w-full flex items-center justify-between py-2 font-mono text-base font-bold uppercase text-slate-900 cursor-pointer"
            >
              <span>SERVICES</span>
              <ChevronDown className={`w-5 h-5 text-[#F48033] transition-transform duration-200 ${openMobileDropdown === 'SERVICES' ? 'rotate-180' : ''}`} />
            </button>
            {openMobileDropdown === 'SERVICES' && (
              <div className="pl-4 space-y-2.5 py-2 border-l-2 border-[#F48033]/40 ml-2">
                <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-800 py-1 hover:text-[#F48033]">
                  <Sparkles className="w-4 h-4 text-[#F48033]" />
                  <span>Custom Home Builds</span>
                </a>
                <a href="#services" onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }} className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-800 py-1 hover:text-[#F48033]">
                  <Building2 className="w-4 h-4 text-[#F48033]" />
                  <span>Real Estate Development</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile Showcase Accordion */}
          <div>
            <button
              onClick={() => toggleMobileDropdown('SHOWCASE')}
              className="w-full flex items-center justify-between py-2 font-mono text-base font-bold uppercase text-slate-900 cursor-pointer"
            >
              <span>SHOWCASE</span>
              <ChevronDown className={`w-5 h-5 text-[#F48033] transition-transform duration-200 ${openMobileDropdown === 'SHOWCASE' ? 'rotate-180' : ''}`} />
            </button>
            {openMobileDropdown === 'SHOWCASE' && (
              <div className="pl-4 space-y-2.5 py-2 border-l-2 border-[#F48033]/40 ml-2">
                <a href="#projects" onClick={(e) => { e.preventDefault(); handleNavClick('#projects'); }} className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-800 py-1 hover:text-[#F48033]">
                  <FolderKanban className="w-4 h-4 text-[#F48033]" />
                  <span>Featured Projects</span>
                </a>
                <a href="#testimonials" onClick={(e) => { e.preventDefault(); handleNavClick('#testimonials'); }} className="flex items-center space-x-2 text-sm font-mono font-bold text-slate-800 py-1 hover:text-[#F48033]">
                  <MessageSquareQuote className="w-4 h-4 text-[#F48033]" />
                  <span>Client Reviews</span>
                </a>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTools?.();
            }}
            className="w-full flex items-center justify-between py-2 font-mono text-base font-bold uppercase text-slate-900 cursor-pointer"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#F48033]" />
              <span>TOOLS</span>
            </div>
            <span className="bg-[#F48033] text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              NEW
            </span>
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="block py-2 font-mono text-base font-bold uppercase text-slate-900"
          >
            CONTACT
          </a>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
            {onOpenCms && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCms();
                }}
                className="w-full py-3.5 bg-[#181C2B] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-2xl shadow-md flex items-center justify-center space-x-2 border border-slate-700"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>CMS ADMIN PANEL</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-4 bg-[#F48033] hover:opacity-90 text-white font-mono text-sm font-bold uppercase tracking-wider rounded-2xl shadow-lg transition-opacity"
            >
              GET A QUOTE
            </button>
          </div>


        </div>
      )}
    </header>
  );
};
