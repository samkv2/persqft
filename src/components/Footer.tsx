import React from 'react';
import {
  ArrowUpRight,
  ArrowUp,
  MapPin,
  Phone,
  Mail,
  Shield,
  Users,
  Leaf,
  HardHat,
  Headphones,
  Clock,
  ChevronRight,
} from 'lucide-react';
import perSqftLogo from '../assets/perSqftLogo.png';
import footerCardBG from '../assets/footerCardBG.png';

interface FooterProps {
  onOpenEnquiry: () => void;
  onOpenCms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEnquiry, onOpenCms }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="footer" className="relative w-full bg-[#070A0F] text-slate-200 select-none border-t border-slate-800/80 pt-6 pb-8 sm:py-10">
      
      {/* Moderately Proportionated Outer Wrapper (Sleek side padding) */}
      <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        
        {/* ── 1. TOP BANNER CARD: "START YOUR PROJECT" ── */}
        <div className="relative rounded-2xl border border-slate-800/90 bg-[#0B0F18] overflow-hidden shadow-2xl">
          {/* Background image & left readability gradient */}
          <div
            className="absolute inset-0 bg-cover bg-right bg-no-repeat pointer-events-none opacity-85"
            style={{ backgroundImage: `url(${footerCardBG})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F18] via-[#0B0F18]/90 to-transparent pointer-events-none" />

          {/* Content inside Top Banner */}
          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
            {/* Left Column: Icon + Text */}
            <div className="flex items-start gap-5 sm:gap-6 max-w-3xl">
              {/* Crane / Building Vector Icon Box */}
              <div className="hidden sm:flex w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border border-[#F48033]/40 bg-[#0B0F18]/90 items-center justify-center shrink-0 shadow-lg">
                <svg className="w-9 h-9 sm:w-10 sm:h-10 text-[#F48033]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 40V16L24 8L36 16V40H12Z" stroke="#F48033" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 40V28H28V40" stroke="#F48033" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6 40H42" stroke="#F48033" strokeWidth="2.2" strokeLinecap="round"/>
                  <path d="M30 12L38 4H44" stroke="#F48033" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="38" cy="4" r="1.5" fill="#F48033"/>
                </svg>
              </div>

              {/* Text */}
              <div className="space-y-1.5">
                <span className="font-mono text-xs text-[#F48033] uppercase tracking-widest font-bold block">
                  READY TO START YOUR PROJECT?
                </span>
                <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white uppercase tracking-tight leading-tight">
                  Let’s Build Something <span className="text-[#F48033]">Extraordinary.</span>
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm max-w-lg font-normal">
                  From concept to completion, we deliver excellence in every detail.
                </p>
              </div>
            </div>

            {/* Right Column: CTA Button */}
            <div className="shrink-0">
              <button
                onClick={onOpenEnquiry}
                className="w-full sm:w-auto px-7 py-3.5 sm:px-8 sm:py-4 bg-[#F48033] hover:bg-[#d96a20] text-white font-heading font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_8px_25px_rgba(244,128,51,0.35)] flex items-center justify-center space-x-3 cursor-pointer"
              >
                <span>START YOUR PROJECT</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. MAIN FOOTER CARD ── */}
        <div className="rounded-2xl border border-slate-800/90 bg-[#0C1018] p-6 sm:p-8 lg:p-10 space-y-8 sm:space-y-10 shadow-2xl">
          
          {/* ROW 1: 4 COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-8 border-b border-slate-800/80">
            
            {/* Col 1: Brand Logo & Description (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick('#home');
                }}
                className="inline-block"
              >
                <img
                  src={perSqftLogo}
                  alt="PER SQFT Constructions Logo"
                  className="h-12 sm:h-14 w-auto object-contain transition-transform hover:scale-105"
                />
              </a>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                Building spaces. Creating lasting value. Premier architectural execution and structural engineering studio.
              </p>

              <div className="w-10 h-[2px] bg-[#F48033] rounded-full" />
            </div>

            {/* Col 2: NAVIGATION (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-heading text-xs font-black uppercase tracking-widest text-white mb-2">
                NAVIGATION
              </h4>
              <div className="w-6 h-[2px] bg-[#F48033] rounded-full mb-3" />
              
              <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-400">
                {[
                  { label: 'Home', href: '#home' },
                  { label: 'Featured Projects', href: '#projects' },
                  { label: 'Specialized Services', href: '#services' },
                  { label: 'About Us', href: '#about' },
                  { label: 'Contact HQ', href: '#contact' },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(item.href);
                      }}
                      className="flex items-center justify-between hover:text-[#F48033] transition-colors group cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#F48033] transition-colors" />
                    </a>
                  </li>
                ))}

                {/* CMS Admin Panel Link */}
                {onOpenCms && (
                  <li className="pt-2">
                    <button
                      onClick={onOpenCms}
                      className="w-full flex items-center justify-between text-[#2A75FF] hover:text-blue-400 font-bold transition-colors group cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>CMS Admin Panel</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-blue-600 group-hover:text-blue-400 transition-colors" />
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Col 3: CONTACT HQ (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-heading text-xs font-black uppercase tracking-widest text-white mb-2">
                CONTACT HQ
              </h4>
              <div className="w-6 h-[2px] bg-[#F48033] rounded-full mb-3" />

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-400 font-medium">
                <li className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-[#F48033] shrink-0 mt-0.5" />
                  <span>PERSQFT Towers, Gomti Nagar Extension, Lucknow, UP 226010</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[#F48033] shrink-0" />
                  <a href="tel:+919559422876" className="hover:text-white transition-colors">
                    +91 9559422876
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[#F48033] shrink-0" />
                  <a href="mailto:samk17@zohomail.in" className="hover:text-white transition-colors">
                    samk17@zohomail.in
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: SOCIAL CONNECT (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="font-heading text-xs font-black uppercase tracking-widest text-white mb-2">
                SOCIAL CONNECT
              </h4>
              <div className="w-6 h-[2px] bg-[#F48033] rounded-full mb-3" />

              <div className="flex items-center space-x-2.5 mb-5">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#F48033] hover:border-[#F48033]/50 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#F48033] hover:border-[#F48033]/50 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#F48033] hover:border-[#F48033]/50 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#F48033] hover:border-[#F48033]/50 transition-all duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>

              <div className="font-mono text-[11px] text-slate-500 uppercase tracking-widest space-y-0.5">
                <div>PERSQFT CONSTRUCTIONS</div>
                <div>STATIC DEPLOYMENT READY</div>
              </div>
            </div>

          </div>

          {/* ROW 2: 4 FEATURE HIGHLIGHTS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 pb-8 border-b border-slate-800/80">
            {[
              {
                icon: Shield,
                title: 'QUALITY ASSURED',
                sub: 'We ensure the highest standards in every project.',
              },
              {
                icon: Users,
                title: 'EXPERT TEAM',
                sub: 'Skilled professionals committed to perfection.',
              },
              {
                icon: Leaf,
                title: 'SUSTAINABLE BUILDING',
                sub: 'Eco-friendly solutions for a better tomorrow.',
              },
              {
                icon: HardHat,
                title: 'ON-TIME DELIVERY',
                sub: 'Delivering projects with precision and care.',
              },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start space-x-3.5 group">
                <div className="w-11 h-11 rounded-xl bg-[#0F141F] border border-slate-800 flex items-center justify-center text-[#F48033] shrink-0 group-hover:border-[#F48033]/50 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-heading text-xs font-extrabold text-white uppercase tracking-wider mb-1">
                    {title}
                  </h5>
                  <p className="text-slate-400 text-xs leading-relaxed font-normal">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ROW 3: BOTTOM COPYRIGHT & HELPLINE BAR */}
          <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs text-slate-400 font-medium">
            
            {/* Copyright */}
            <div className="font-mono text-xs">
              © {new Date().getFullYear()} <span className="text-[#F48033] font-bold">PERSQFT CONSTRUCTIONS.</span> ALL RIGHTS RESERVED.
            </div>

            {/* Question Helpline */}
            <div className="flex items-center space-x-2.5">
              <Headphones className="w-4 h-4 text-[#F48033] shrink-0" />
              <span>Have a question? <strong className="text-white">We're here to help.</strong></span>
            </div>

            {/* Business Hours */}
            <div className="flex items-center space-x-2.5">
              <Clock className="w-4 h-4 text-[#F48033] shrink-0" />
              <span>Mon - Sat: 9:00 AM - 7:00 PM | Sunday: Closed</span>
            </div>

            {/* Back to Top */}
            <div>
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-2 text-white hover:text-[#F48033] font-extrabold tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>BACK TO TOP</span>
                <ArrowUp className="w-4 h-4 text-[#F48033]" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </footer>
  );
};
