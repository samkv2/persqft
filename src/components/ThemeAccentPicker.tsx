import React, { useState, useEffect, useRef } from 'react';
import { Palette, Check, X } from 'lucide-react';

export const themeColors = [
  { id: 'orange',   name: 'Architectural Orange', hex: '#F48033', dark: '#d96a20', ring: 'ring-orange-500' },
  { id: 'sapphire', name: 'Royal Sapphire',        hex: '#2563EB', dark: '#1d4ed8', ring: 'ring-blue-600' },
  { id: 'emerald',  name: 'Precious Emerald',      hex: '#059669', dark: '#047857', ring: 'ring-emerald-600' },
  { id: 'amethyst', name: 'Deep Amethyst',         hex: '#7C3AED', dark: '#6d28d9', ring: 'ring-violet-600' },
];

interface ThemeAccentPickerProps {
  visible?: boolean;
}

export const ThemeAccentPicker: React.FC<ThemeAccentPickerProps> = ({ visible = true }) => {
  const [activeColor, setActiveColor] = useState('#F48033');
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const applyThemeColor = (hex: string, dark: string) => {
    setActiveColor(hex);
    document.documentElement.style.setProperty('--theme-accent', hex);
    document.documentElement.style.setProperty('--theme-accent-dark', dark);
  };

  useEffect(() => {
    applyThemeColor('#F48033', '#d96a20');
  }, []);

  // Close on outside tap/click for mobile and tablet
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleSelectColor = (color: typeof themeColors[0]) => {
    applyThemeColor(color.hex, color.dark);
    setIsOpen(false);
    setIsHovered(false);
  };

  const isExpanded = isOpen || isHovered;

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed left-0 bottom-6 sm:bottom-8 z-50 select-none transition-all duration-300 ease-out"
    >
      <div className="flex items-center">
        
        {/* Minimized Docked Left Border Tab Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group flex items-center justify-center bg-white/95 hover:bg-white text-slate-800 border-y border-r border-slate-200/90 rounded-r-2xl shadow-xl backdrop-blur-xl cursor-pointer transition-all duration-300 ${
            isExpanded
              ? 'py-3.5 px-3 border-r-transparent'
              : 'py-3 px-2.5 hover:px-3.5 hover:shadow-[0_4px_25px_rgba(0,0,0,0.12)]'
          }`}
          title="Change Theme Accent Color"
          aria-label="Change Theme Accent Color"
        >
          <div className="relative flex flex-col items-center gap-1.5">
            <Palette
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45"
              style={{ color: activeColor }}
            />
            {/* Active Color Pip Indicator */}
            <span
              className="w-1.5 h-1.5 rounded-full shadow-xs"
              style={{ backgroundColor: activeColor }}
            />
          </div>
        </button>

        {/* Sliding Color Swatch Palette Drawer */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded
              ? 'max-w-[360px] opacity-100 translate-x-0'
              : 'max-w-0 opacity-0 -translate-x-4 pointer-events-none'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-2xl border-y border-r border-slate-200/90 py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-r-2xl shadow-2xl flex items-center gap-3">
            <div className="flex flex-col pr-1">
              <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Theme Color
              </span>
              <span className="text-[10px] font-bold text-slate-900 whitespace-nowrap">
                Select Accent
              </span>
            </div>

            <div className="h-7 w-px bg-slate-200" />

            {/* 4 Swatches */}
            <div className="flex items-center gap-2">
              {themeColors.map((color) => {
                const isSelected = activeColor === color.hex;
                return (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => handleSelectColor(color)}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-115 active:scale-95 shadow-md ${
                      isSelected
                        ? `ring-2 ring-offset-2 ring-offset-white ${color.ring} scale-105`
                        : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow-sm" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>

            {/* Close button on mobile/tab when open */}
            {isOpen && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsHovered(false);
                }}
                className="sm:hidden p-1 text-slate-400 hover:text-slate-700 rounded-md ml-0.5 cursor-pointer"
                aria-label="Close color picker"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
