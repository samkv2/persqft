import React, { useState, useEffect } from 'react';
import { PhoneCall } from 'lucide-react';
import { cmsStore, type SiteSettings } from '../data/cmsStore';

interface FloatingWhatsAppProps {
  visible?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ visible = true }) => {
  const [settings, setSettings] = useState<SiteSettings>(cmsStore.getSiteSettings());
  const [hoveredButton, setHoveredButton] = useState<'none' | 'call' | 'whatsapp'>('none');

  useEffect(() => {
    return cmsStore.subscribe(() => {
      setSettings(cmsStore.getSiteSettings());
    });
  }, []);

  if (!visible) return null;

  // Clean phone number: remove all non-digits
  const cleanPhone = (settings.phone || '+916306659601').replace(/\D/g, '');
  // Default to 916306659601 if empty or invalid
  const targetPhone = cleanPhone.length >= 10 ? cleanPhone : '916306659601';
  const dialerPhone = '+916306659601';

  const defaultMessage = encodeURIComponent(
    'Hello PERSQFT Constructions, I am interested in your architectural and construction services.'
  );
  const whatsappUrl = `https://wa.me/${targetPhone}?text=${defaultMessage}`;

  return (
    <aside 
      aria-label="Instant Contact Options"
      className="fixed right-4 bottom-5 sm:right-7 sm:bottom-7 z-50 flex flex-col items-end space-y-2.5 sm:space-y-3 select-none"
    >
      {/* ── 1. CALL DIRECT WIDGET (TOP) ── */}
      <div className="flex items-center justify-end">
        {/* Call Tooltip / Teaser Bubble */}
        <div
          className={`hidden sm:flex items-center space-x-2 bg-white/95 text-slate-800 px-3.5 py-1.5 rounded-2xl shadow-xl border border-slate-200/90 mr-2.5 pointer-events-none transition-all duration-300 backdrop-blur-md ${
            hoveredButton === 'call'
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 translate-x-3 scale-95'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6F2C] animate-pulse" />
          <span className="text-xs font-semibold font-mono tracking-tight text-slate-800">
            Call HQ: +91-6306659601
          </span>
        </div>

        {/* Call Floating Button (Static clean button, no ripple animation) */}
        <a
          href={`tel:${dialerPhone}`}
          aria-label="Direct call PERSQFT HQ on +916306659601"
          onMouseEnter={() => setHoveredButton('call')}
          onMouseLeave={() => setHoveredButton('none')}
          className="relative group w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-full bg-[#FF6F2C] hover:bg-[#E85B1E] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(255,111,44,0.4)] hover:shadow-[0_12px_32px_rgba(255,111,44,0.6)] transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
        >
          <PhoneCall className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white fill-white/20 relative z-10" />
        </a>
      </div>

      {/* ── 2. WHATSAPP DIRECT WIDGET (BOTTOM) ── */}
      <div className="flex items-center justify-end">
        {/* WhatsApp Tooltip / Teaser Bubble */}
        <div
          className={`hidden sm:flex items-center space-x-2 bg-white/95 text-slate-800 px-3.5 py-1.5 rounded-2xl shadow-xl border border-slate-200/90 mr-2.5 pointer-events-none transition-all duration-300 backdrop-blur-md ${
            hoveredButton === 'whatsapp'
              ? 'opacity-100 translate-x-0 scale-100'
              : 'opacity-0 translate-x-3 scale-95'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span className="text-xs font-semibold font-mono tracking-tight text-slate-800">
            Chat on WhatsApp
          </span>
        </div>

        {/* WhatsApp Floating Button (Refined Compact Size) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Direct message PERSQFT owner on WhatsApp"
          onMouseEnter={() => setHoveredButton('whatsapp')}
          onMouseLeave={() => setHoveredButton('none')}
          className="relative group w-12 h-12 sm:w-[50px] sm:h-[50px] rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)] transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-white/20"
        >
          {/* WhatsApp Vector Icon */}
          <svg
            className="w-6 h-6 sm:w-6.5 sm:h-6.5 fill-current relative z-10 transition-transform duration-300 group-hover:scale-110"
            viewBox="0 0 24 24"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>
    </aside>
  );
};
