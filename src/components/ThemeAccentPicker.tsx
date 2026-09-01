import React, { useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

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

  const applyThemeColor = (hex: string, dark: string) => {
    setActiveColor(hex);
    document.documentElement.style.setProperty('--theme-accent', hex);
    document.documentElement.style.setProperty('--theme-accent-dark', dark);
  };

  useEffect(() => {
    // Initial theme set
    applyThemeColor('#F48033', '#d96a20');
  }, []);

  const handleSelectColor = (color: typeof themeColors[0]) => {
    applyThemeColor(color.hex, color.dark);
    setIsOpen(false);
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-700 ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {/* Popover palette panel */}
      {isOpen && (
        <div className="mb-3 p-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl animate-fadeIn space-y-2 select-none">
          <div className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
            THEME ACCENT COLOR
          </div>
          <div className="flex items-center space-x-2">
            {themeColors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleSelectColor(color)}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer hover:scale-110 shadow-md ${
                  activeColor === color.hex ? `ring-2 ring-offset-2 ring-offset-slate-900 ${color.ring}` : ''
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {activeColor === color.hex && <Check className="w-4 h-4 text-white drop-shadow-sm" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white border border-slate-700/80 rounded-full shadow-xl backdrop-blur-md transition-all duration-200 cursor-pointer hover:border-slate-500 group"
        title="Change Accent Theme Color"
      >
        <Palette className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" style={{ color: activeColor }} />
        <span className="font-mono text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
          THEME ACCENT
        </span>
      </button>
    </div>
  );
};
