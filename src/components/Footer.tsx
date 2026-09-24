import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle, X } from 'lucide-react';
import perSqftLogo from '../assets/perSqftLogo.png';

interface FooterProps {
  onOpenEnquiry?: () => void;
  onOpenCms?: () => void;
  currentPage?: 'home' | 'services' | 'process' | 'projects' | 'reviews';
  onNavigatePage?: (page: 'home' | 'services' | 'process' | 'projects' | 'reviews') => void;
}

/* ── Vector-Accurate Social Icons matching mockup ── */
const InstagramIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
  </svg>
);

const YoutubeIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const LinkedinIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <circle cx="4.98" cy="3.5" r="2.5" />
    <rect x="2.5" y="8" width="4.96" height="13" rx="0.5" />
    <path d="M14.5 8c-2.4 0-3.5 1.3-4 2.1V8.5h-4.8c.06 1.3 0 12.5 0 12.5h4.8v-7c0-.37.03-.74.13-1.01.29-.74.98-1.51 2.14-1.51 1.51 0 2.11 1.15 2.11 2.83v6.69H20v-7.18c0-3.85-2.06-5.82-4.95-5.82z" />
  </svg>
);

const PinterestIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
  </svg>
);

export const Footer: React.FC<FooterProps> = ({ onOpenCms: _onOpenCms, currentPage = 'home', onNavigatePage }) => {
  const [unavailableNotice, setUnavailableNotice] = useState<string | null>(null);

  useEffect(() => {
    if (unavailableNotice) {
      const timer = setTimeout(() => setUnavailableNotice(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [unavailableNotice]);

  const handleUnavailableSocial = (e: React.MouseEvent, platform: string) => {
    e.preventDefault();
    setUnavailableNotice(
      `${platform} page is currently not available. Please connect with us on Instagram or Facebook!`
    );
  };
  const handleNavClick = (href: string) => {
    if (currentPage !== 'home' && onNavigatePage) {
      onNavigatePage('home');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePageClick = (page: 'home' | 'services' | 'process' | 'projects' | 'reviews') => {
    if (onNavigatePage) {
      onNavigatePage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white border-t border-[#F1EFEC] pt-10 sm:pt-12 pb-8 sm:pb-10 select-none">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        {/* ── TOP ROW: LOGO | NAV LINKS | SOCIALS ── */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 pb-8 sm:pb-10">
          {/* 1. Brand Logo */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick('home');
              }}
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <img
                src={perSqftLogo}
                alt="PERSQFT Constructions"
                className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </a>

            {/* Vertical separator */}
            <div className="hidden md:block w-[1px] h-8 lg:h-10 bg-[#F1EFEC]" />
          </div>

          {/* 2. Center Nav Links (Montserrat 500-600, Deep Slate #263238, Hover #FF6F2C) */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-10">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick('home');
              }}
              className="font-['Montserrat',sans-serif] text-sm sm:text-base font-medium text-[#263238] hover:text-[#FF6F2C] transition-colors cursor-pointer"
            >
              Home
            </a>
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick('services');
              }}
              className="font-['Montserrat',sans-serif] text-sm sm:text-base font-medium text-[#263238] hover:text-[#FF6F2C] transition-colors cursor-pointer"
            >
              Services
            </a>
            <a
              href="#process"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick('process');
              }}
              className="font-['Montserrat',sans-serif] text-sm sm:text-base font-medium text-[#263238] hover:text-[#FF6F2C] transition-colors cursor-pointer"
            >
              Process
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick('projects');
              }}
              className="font-['Montserrat',sans-serif] text-sm sm:text-base font-medium text-[#263238] hover:text-[#FF6F2C] transition-colors cursor-pointer"
            >
              Projects
            </a>
            <a
              href="#reviews"
              onClick={(e) => {
                e.preventDefault();
                handlePageClick('reviews');
              }}
              className="font-['Montserrat',sans-serif] text-sm sm:text-base font-medium text-[#263238] hover:text-[#FF6F2C] transition-colors cursor-pointer"
            >
              Reviews
            </a>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#about');
              }}
              className="font-['Montserrat',sans-serif] text-sm sm:text-base font-medium text-[#263238] hover:text-[#FF6F2C] transition-colors cursor-pointer"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="font-['Montserrat',sans-serif] text-sm sm:text-base font-medium text-[#263238] hover:text-[#FF6F2C] transition-colors cursor-pointer"
            >
              Contact
            </a>
          </nav>

          {/* 3. Right Social Icons with separator */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Vertical separator */}
            <div className="hidden md:block w-[1px] h-6 bg-[#F1EFEC]" />

            <div className="flex items-center gap-4 sm:gap-5 text-[#263238]">
              {/* Instagram Official Profile */}
              <a
                href="https://www.instagram.com/persqft_construction11"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow PERSQFT on Instagram"
                title="Follow PERSQFT on Instagram"
                className="hover:text-[#FF6F2C] transition-colors p-1"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              {/* Facebook Official Profile */}
              <a
                href="https://www.facebook.com/shubham.upadhyay.9843499"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with PERSQFT on Facebook"
                title="Connect with PERSQFT on Facebook"
                className="hover:text-[#FF6F2C] transition-colors p-1"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>

              {/* YouTube (Not Available Notice) */}
              <a
                href="#youtube-not-available"
                onClick={(e) => handleUnavailableSocial(e, 'YouTube')}
                aria-label="YouTube channel (Not Available)"
                title="YouTube channel is currently not available"
                className="hover:text-[#FF6F2C] transition-colors p-1 opacity-70 hover:opacity-100 cursor-pointer"
              >
                <YoutubeIcon className="w-5 h-5" />
              </a>

              {/* LinkedIn (Not Available Notice) */}
              <a
                href="#linkedin-not-available"
                onClick={(e) => handleUnavailableSocial(e, 'LinkedIn')}
                aria-label="LinkedIn profile (Not Available)"
                title="LinkedIn profile is currently not available"
                className="hover:text-[#FF6F2C] transition-colors p-1 opacity-70 hover:opacity-100 cursor-pointer"
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>

              {/* Pinterest (Not Available Notice) */}
              <a
                href="#pinterest-not-available"
                onClick={(e) => handleUnavailableSocial(e, 'Pinterest')}
                aria-label="Pinterest profile (Not Available)"
                title="Pinterest profile is currently not available"
                className="hover:text-[#FF6F2C] transition-colors p-1 opacity-70 hover:opacity-100 cursor-pointer"
              >
                <PinterestIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* ── TWO OFFICES & STATEWIDE SUMMARY STRIP ── */}
        <div className="border-t border-[#F1EFEC] py-5 my-1 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6 text-xs text-[#667078] font-['Inter',sans-serif]">
          <div className="flex items-start gap-2">
            <span className="font-['Montserrat',sans-serif] font-semibold text-[#263238] shrink-0">📍 Hathras Office:</span>
            <span>Shop no. 14, Bagla college market, Aligarh Rd, Nehru Colony, Hathras, UP 204101</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-['Montserrat',sans-serif] font-semibold text-[#263238] shrink-0">📍 Sultanpur HQ:</span>
            <span>Ramashankar Market, Busstand Road, opp. Indian Oil Petrol Pump, Civil Line, Sultanpur, UP 228001</span>
          </div>
        </div>

        {/* ── BOTTOM ROW: COPYRIGHT & LEGAL ── */}
        <div className="border-t border-[#F1EFEC] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-[#667078] gap-3 font-['Inter',sans-serif]">
          <p>© 2026 PERSQFT Constructions. All rights reserved.</p>

          <div className="flex items-center gap-4 text-[#667078]">
            <a
              href="/admin/login.php"
              className="inline-flex items-center gap-1.5 text-[#263238] hover:text-[#FF6F2C] font-['Montserrat',sans-serif] font-medium transition-colors cursor-pointer"
              title="Open CMS Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#FF6F2C]" />
              <span>CMS Portal</span>
            </a>
            <span className="text-[#D9D6D2]">|</span>
            <a href="#home" className="hover:text-[#FF6F2C] transition-colors font-['Montserrat',sans-serif]">
              Privacy Policy
            </a>
            <span className="text-[#D9D6D2]">|</span>
            <a href="#home" className="hover:text-[#FF6F2C] transition-colors font-['Montserrat',sans-serif]">
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </div>

      {/* ── NOT AVAILABLE SOCIAL MEDIA WARNING TOAST ── */}
      {unavailableNotice && (
        <div 
          role="alert"
          className="fixed bottom-6 right-6 z-[9999] max-w-sm sm:max-w-md bg-[#263238] text-white p-4 rounded-xl shadow-2xl border border-amber-500/50 flex items-start gap-3 animate-fadeIn select-none"
        >
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs sm:text-sm">
            <p className="font-semibold text-amber-400 font-['Montserrat',sans-serif]">Channel Not Available</p>
            <p className="text-slate-200 mt-1 leading-snug">{unavailableNotice}</p>
          </div>
          <button
            onClick={() => setUnavailableNotice(null)}
            className="text-slate-400 hover:text-white p-1 cursor-pointer transition-colors"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </footer>
  );
};
