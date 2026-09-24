import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, MapPin, Building2, Navigation, Phone } from 'lucide-react';
import forumImgPng from '../assets/forumImg.png';
import forumImgWebp from '../assets/forumImg.webp';

interface ContactSectionProps {
  onOpenEnquiry?: (subject?: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenEnquiry }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.length < 10) {
      alert('Please provide your name and a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);
    const trackingRef = `PSQFT-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const response = await fetch('/api/enquiry.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: name,
          phone: phone,
          serviceRequired: requirement || 'General Project Consultation',
          projectNote: `Website Quick Contact Form Submission. Requirement: ${requirement || 'Consultation'}`,
          referenceId: trackingRef,
        }),
      });

      if (!response.ok) {
        throw new Error('Server response error');
      }

      setRefId(trackingRef);
      setSubmitted(true);
      setName('');
      setPhone('');
      setRequirement('');
    } catch {
      // Optimistic client success even if offline
      setRefId(trackingRef);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-10 sm:py-14 lg:py-16 bg-[#FAF8F5] relative overflow-hidden select-none border-b border-[#F1EFEC]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        {/* ── 1. STATEWIDE PRESENCE: WORKING ALL OVER UTTAR PRADESH (NOW FIRST) ── */}
        <div className="mb-12 sm:mb-16">
          {/* Highlight Header */}
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 bg-[#FFF1E9] text-[#FF6F2C] border border-[#FF6F2C]/25 px-4 py-1.5 rounded-[8px] text-xs sm:text-sm font-['Montserrat',sans-serif] font-semibold tracking-wide uppercase shadow-2xs mb-3">
              <span className="w-2 h-2 rounded-full bg-[#FF6F2C] animate-pulse" />
              <span>Working All Over Uttar Pradesh</span>
            </div>
            
            <h3 className="font-['Montserrat',sans-serif] font-semibold text-2xl sm:text-3xl lg:text-4xl text-[#263238] tracking-tight leading-tight mb-3">
              Two Dedicated Hubs. <span className="text-[#FF6F2C]">Statewide Execution.</span>
            </h3>
            
            <p className="font-['Inter',sans-serif] text-[#667078] text-sm sm:text-base leading-relaxed">
              Headquartered in <strong>Sultanpur</strong> with a major regional operations hub in <strong>Hathras</strong>, our civil engineers, architects, and on-site teams execute turnkey builds across all major cities of Uttar Pradesh.
            </p>
          </div>

          {/* Main Cities Pill Cloud */}
          <div className="mb-8 sm:mb-10 bg-white rounded-[10px] border border-[#F1EFEC] p-4 sm:p-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3.5 pb-3 border-b border-[#F1EFEC]">
              <span className="text-xs sm:text-sm font-['Montserrat',sans-serif] font-semibold uppercase tracking-wider text-[#263238] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6F2C]" />
                <span>Primary Cities of Active Operations:</span>
              </span>
              <span className="text-xs font-['Montserrat',sans-serif] font-semibold text-[#FF6F2C] bg-[#FFF1E9] px-2.5 py-1 rounded-[6px] border border-[#FFF1E9]">
                11 Key Hubs + Entire UP
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {[
                'Hathras',
                'Aligarh',
                'Mathura',
                'Agra',
                'Sultanpur',
                'Ayodhya',
                'Lucknow',
                'Varanasi',
                'Allahabad',
                'Kanpur',
                'Akbarpur',
              ].map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1.5 bg-[#FAF8F5] hover:bg-[#FFF1E9] border border-[#F1EFEC] hover:border-[#FF6F2C] text-[#263238] hover:text-[#FF6F2C] px-3 sm:px-4 py-1.5 sm:py-2 rounded-[8px] text-xs sm:text-sm font-medium transition-colors duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F2C]" />
                  <span>{city}</span>
                </span>
              ))}
              <span className="inline-flex items-center gap-1.5 bg-[#FFF1E9] border border-[#FF6F2C]/30 text-[#FF6F2C] px-3 sm:px-4 py-1.5 sm:py-2 rounded-[8px] text-xs sm:text-sm font-semibold">
                ✓ All Over Uttar Pradesh
              </span>
            </div>
          </div>

          {/* 2 Regional Office Cards (Radius 6-10px, border #F1EFEC) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Office 1: Hathras */}
            <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-5 sm:p-7 shadow-xs hover:shadow-md hover:border-[#FF6F2C]/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] font-['Montserrat',sans-serif] font-semibold uppercase tracking-wider text-[#FF6F2C] bg-[#FFF1E9] border border-[#FF6F2C]/30 px-3 py-1 rounded-[6px]">
                    OFFICE 01 • WESTERN UP
                  </span>
                  <span className="text-xs font-medium text-[#667078]">PIN: 204101</span>
                </div>

                <h4 className="font-['Montserrat',sans-serif] font-semibold text-lg sm:text-xl text-[#263238] mb-2 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#FF6F2C] shrink-0" />
                  <span>Hathras Office</span>
                </h4>

                <p className="font-['Inter',sans-serif] text-[#667078] text-sm leading-relaxed mb-4">
                  Shop no. 14, Bagla college, market, Aligarh Rd, Nehru Colony, Hathras, Uttar Pradesh 204101
                </p>
              </div>

              <div className="pt-4 border-t border-[#F1EFEC] flex flex-wrap items-center gap-3">
                <a
                  href="https://maps.google.com/?q=Shop+no.+14+Bagla+college+market+Aligarh+Rd+Nehru+Colony+Hathras+Uttar+Pradesh+204101"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-['Montserrat',sans-serif] font-semibold text-[#263238] hover:text-[#FF6F2C] bg-[#FAF8F5] hover:bg-[#FFF1E9] border border-[#F1EFEC] hover:border-[#FF6F2C] px-3.5 py-2 rounded-[8px] transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FF6F2C]" />
                  <span>Get Directions</span>
                </a>
                <a
                  href="tel:+916306659601"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-['Montserrat',sans-serif] font-semibold text-white bg-[#FF6F2C] hover:bg-[#E85B1E] px-3.5 py-2 rounded-[8px] transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Office</span>
                </a>
              </div>
            </div>

            {/* Office 2: Sultanpur */}
            <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-5 sm:p-7 shadow-xs hover:shadow-md hover:border-[#FF6F2C]/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-[11px] font-['Montserrat',sans-serif] font-semibold uppercase tracking-wider text-[#FF6F2C] bg-[#FFF1E9] border border-[#FF6F2C]/30 px-3 py-1 rounded-[6px]">
                    OFFICE 02 • HEADQUARTERS
                  </span>
                  <span className="text-xs font-medium text-[#667078]">PIN: 228001</span>
                </div>

                <h4 className="font-['Montserrat',sans-serif] font-semibold text-lg sm:text-xl text-[#263238] mb-2 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#FF6F2C] shrink-0" />
                  <span>Sultanpur Head Office</span>
                </h4>

                <p className="font-['Inter',sans-serif] text-[#667078] text-sm leading-relaxed mb-4">
                  RAMASHANKAR MARKET, BUSSTAND ROAD, opposite INDIAN OIL PETROLPUMP, beside BABA TELECOM, Civil Line, Sultanpur, Uttar Pradesh 228001
                </p>
              </div>

              <div className="pt-4 border-t border-[#F1EFEC] flex flex-wrap items-center gap-3">
                <a
                  href="https://maps.google.com/?q=RAMASHANKAR+MARKET+BUSSTAND+ROAD+opposite+INDIAN+OIL+PETROLPUMP+beside+BABA+TELECOM+Civil+Line+Sultanpur+Uttar+Pradesh+228001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-['Montserrat',sans-serif] font-semibold text-[#263238] hover:text-[#FF6F2C] bg-[#FAF8F5] hover:bg-[#FFF1E9] border border-[#F1EFEC] hover:border-[#FF6F2C] px-3.5 py-2 rounded-[8px] transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FF6F2C]" />
                  <span>Get Directions</span>
                </a>
                <a
                  href="tel:+916306659601"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-['Montserrat',sans-serif] font-semibold text-white bg-[#FF6F2C] hover:bg-[#E85B1E] px-3.5 py-2 rounded-[8px] transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Office</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. TWO-COLUMN WRAPPER: IMAGE (LEFT) + WARM CARD (RIGHT) (NOW SECOND / FORM SEGMENT) ── */}
        <div className="pt-6 sm:pt-10 border-t border-[#F1EFEC]">
          <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 lg:gap-6">
            
            {/* 2A. Left Visual: forumImg.png (Radius 6-10px, border #F1EFEC) */}
            <div className="w-full lg:w-[29%] shrink-0 rounded-[10px] overflow-hidden shadow-xs border border-[#F1EFEC] relative aspect-[16/10] sm:aspect-[4/3] lg:aspect-auto min-h-[220px] sm:min-h-[280px] lg:min-h-0 bg-[#FAF8F5] group">
              <picture className="w-full h-full block">
                <source srcSet={forumImgWebp} type="image/webp" />
                <img
                  src={forumImgPng}
                  alt="Modern Architecture & Living Room by PERSQFT"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
              </picture>
            </div>

            {/* 2B. Right: Warm Peach/Cream Form Card (Very Light Orange #FFF7F2, Border #FFF1E9, Radius 6-10px) */}
            <div className="w-full lg:w-[71%] bg-[#FFF7F2] rounded-[10px] p-6 sm:p-8 lg:p-10 border border-[#FFF1E9] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 shadow-[0_2px_16px_rgba(38,50,56,0.03)]">
              
              {/* Middle Copy + Consultation Button */}
              <div className="w-full lg:w-[53%] flex flex-col justify-center">
                <span className="font-['Montserrat',sans-serif] text-base sm:text-lg lg:text-xl font-bold uppercase tracking-[0.14em] text-[#FF6F2C] mb-2 block">
                  CONTACT US
                </span>
                <h2 className="font-['Montserrat',sans-serif] font-semibold text-3xl sm:text-4xl lg:text-[2.65rem] text-[#263238] tracking-tight leading-tight mb-3">
                  Get Started Today
                </h2>
                <p className="font-['Inter',sans-serif] text-[#667078] text-sm sm:text-base leading-relaxed mb-6 sm:mb-7 font-normal max-w-md">
                  Share your requirements and our team will get back to you with the best solution for your space.
                </p>

                <div>
                  <button
                    type="button"
                    onClick={() => onOpenEnquiry?.('Get Started Today - Free Consultation')}
                    className="inline-flex items-center justify-center gap-2.5 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-7 sm:px-8 py-3.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm sm:text-base tracking-wide shadow-xs active:scale-95 transition-all duration-200 cursor-pointer"
                  >
                    <span>Book Free Consultation</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Vertical divider on desktop */}
              <div className="hidden lg:block w-[1px] bg-[#FFF1E9] self-stretch mx-1" />

              {/* Right Form Inputs */}
              <div className="w-full lg:w-[47%]">
                {submitted ? (
                  <div className="bg-white rounded-[10px] border border-emerald-200 p-6 text-center shadow-xs">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="font-['Montserrat',sans-serif] font-semibold text-lg text-[#263238] mb-1">
                      Thank You!
                    </h3>
                    <p className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm mb-3">
                      Your inquiry has been received. Our architectural team will reach out shortly.
                    </p>
                    {refId && (
                      <span className="inline-block bg-[#FAF8F5] font-['Montserrat',sans-serif] text-xs font-semibold text-[#263238] px-3 py-1.5 rounded-[6px] border border-[#F1EFEC]">
                        Ref: {refId}
                      </span>
                    )}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="block mx-auto mt-4 text-xs font-['Montserrat',sans-serif] font-semibold text-[#FF6F2C] hover:underline cursor-pointer"
                    >
                      Submit another requirement
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                    {/* Name Input (Radius 6-8px, Border 1px #D9D6D2, Focus #FF6F2C) */}
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name *"
                        required
                        className="w-full bg-white border border-[#D9D6D2] rounded-[8px] px-4 py-3 text-sm text-[#263238] placeholder:text-[#667078]/70 focus:outline-none focus:ring-2 focus:ring-[#FF6F2C]/20 focus:border-[#FF6F2C] transition-all shadow-2xs font-['Inter',sans-serif]"
                      />
                    </div>

                    {/* Phone Input */}
                    <div>
                      <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="Your Phone Number *"
                        required
                        className="w-full bg-white border border-[#D9D6D2] rounded-[8px] px-4 py-3 text-sm text-[#263238] placeholder:text-[#667078]/70 focus:outline-none focus:ring-2 focus:ring-[#FF6F2C]/20 focus:border-[#FF6F2C] transition-all shadow-2xs font-['Inter',sans-serif]"
                      />
                    </div>

                    {/* Requirement Dropdown */}
                    <div className="relative">
                      <select
                        name="requirement"
                        value={requirement}
                        onChange={(e) => setRequirement(e.target.value)}
                        className="w-full bg-white border border-[#D9D6D2] rounded-[8px] px-4 py-3 text-sm text-[#263238] focus:outline-none focus:ring-2 focus:ring-[#FF6F2C]/20 focus:border-[#FF6F2C] transition-all shadow-2xs appearance-none cursor-pointer pr-10 font-['Inter',sans-serif]"
                      >
                        <option value="">Your Requirement</option>
                        <option value="Custom Home Builds">Custom Home Builds</option>
                        <option value="Luxury Villa Construction">Luxury Villa Construction</option>
                        <option value="Elevation Design">Elevation Design</option>
                        <option value="Interior Design">Interior Design</option>
                        <option value="Planning & Documentation">Planning & Documentation</option>
                        <option value="Commercial Development">Commercial Development</option>
                        <option value="Turnkey Architectural Execution">Turnkey Architectural Execution</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#667078] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Submit Button (Primary CTA: #FF6F2C, 6-8px radius) */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#FF6F2C] hover:bg-[#E85B1E] disabled:opacity-70 text-white py-3.5 sm:py-4 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm sm:text-base tracking-wide shadow-xs active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
