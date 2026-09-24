import React, { useState, useEffect, useRef } from 'react';
import { Award, CheckCircle2, BadgeCheck } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { cmsStore, type TeamMember } from '../data/cmsStore';

interface AutoScrollRowProps<T> {
  items: T[];
  renderItem: (item: T, idx: number) => React.ReactNode;
  itemKey: (item: T) => string | number;
  cardWidth?: number;
}

function AutoScrollRow<T>({
  items,
  renderItem,
  itemKey,
  cardWidth = 250,
}: AutoScrollRowProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const isInteractingRef = useRef(false);

  useEffect(() => {
    const check = () => {
      if (!containerRef.current) return;
      const containerW = containerRef.current.clientWidth;
      const totalW = items.length * (cardWidth + 20);
      setIsOverflowing(totalW > containerW);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [items.length, cardWidth]);

  useEffect(() => {
    if (!isOverflowing) return;
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    const step = () => {
      if (!isInteractingRef.current && el) {
        el.scrollLeft += 0.75;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isOverflowing, items.length]);

  if (items.length === 0) return null;

  if (!isOverflowing) {
    return (
      <div ref={containerRef} className="w-full">
        <div className="flex flex-wrap justify-center items-center gap-5 sm:gap-6 py-3">
          {items.map((item, idx) => (
            <div key={itemKey(item)} className="w-[230px] sm:w-[250px] shrink-0">
              {renderItem(item, idx)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Duplicate items for seamless infinite horizontal slide scroll
  const displayItems = [...items, ...items];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden py-3">
      {/* Auto-scroll track */}
      <div
        ref={scrollRef}
        onMouseEnter={() => { isInteractingRef.current = true; }}
        onMouseLeave={() => { isInteractingRef.current = false; }}
        onTouchStart={() => { isInteractingRef.current = true; }}
        onTouchEnd={() => { isInteractingRef.current = false; }}
        className="flex gap-5 sm:gap-6 overflow-x-auto scrollbar-none py-2 px-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {displayItems.map((item, idx) => (
          <div
            key={`${itemKey(item)}-${idx}`}
            className="w-[230px] sm:w-[250px] shrink-0 select-none"
          >
            {renderItem(item, idx % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}

export const TeamSection: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>(cmsStore.getTeam());

  useEffect(() => {
    const unsubscribe = cmsStore.subscribe(() => {
      setTeam(cmsStore.getTeam());
    });
    return () => unsubscribe();
  }, []);

  const management = team.filter((m) => m.category === 'MANAGEMENT');
  const employees = team.filter((m) => m.category === 'EMPLOYEE');

  const getImageSrc = (img?: string, name = 'User') => {
    if (!img) return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F1F5F9&color=333&size=400`;
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')) return img;
    return `/${img}`;
  };

  const renderManagementCard = (member: TeamMember) => (
    <div className="relative group w-[230px] sm:w-[250px] h-[270px] sm:h-[290px] shrink-0 my-2">
      {/* Outer Card Frame with Clean Modern Border & Compact Dimensions (Radius 6-10px, border #F1EFEC) */}
      <div className="relative w-full h-full rounded-[10px] border border-[#F1EFEC] hover:border-[#FF6F2C]/60 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden bg-white flex flex-col">
        {/* Full Portrait Photo */}
        <img
          src={getImageSrc(member.image, member.name)}
          alt={member.name}
          className="w-full h-full object-cover object-top pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=FAF8F5&color=263238&size=400`;
          }}
        />

        {/* Bottom Transparent / White Blur Glass Dock */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 bg-white/90 backdrop-blur-md border-t border-[#F1EFEC] shadow-[0_-4px_16px_rgba(38,50,56,0.04)] flex flex-col justify-end text-left">
          <div className="flex items-center space-x-1.5 mb-0.5">
            <h3 className="font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm text-[#263238] group-hover:text-[#FF6F2C] transition-colors tracking-tight leading-tight truncate">
              {member.name}
            </h3>
            <BadgeCheck className="w-3.5 h-3.5 text-[#FF6F2C] fill-[#FFF1E9] shrink-0" />
          </div>

          <p className="text-[#FF6F2C] text-[10px] sm:text-[11px] font-['Montserrat',sans-serif] font-semibold tracking-wide uppercase truncate">
            {member.role}
          </p>

          {member.tagline && (
            <p className="text-[#667078] text-[10px] sm:text-[11px] font-['Inter',sans-serif] leading-tight line-clamp-1 mt-0.5">
              {member.tagline}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderEmployeeCard = (member: TeamMember) => (
    <div className="group bg-white rounded-[10px] border border-[#F1EFEC] hover:border-[#FF6F2C]/60 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 flex flex-col h-[270px] sm:h-[290px] w-[230px] sm:w-[250px]">
      {/* Photo Header */}
      <div className="relative h-40 sm:h-44 overflow-hidden bg-[#FAF8F5]">
        <img
          src={getImageSrc(member.image, member.name)}
          alt={member.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500 pointer-events-none"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=FAF8F5&color=263238&size=400`;
          }}
        />
      </div>

      {/* Compact Info Box */}
      <div className="p-3 text-left bg-white flex flex-col justify-center border-t border-[#F1EFEC] flex-1">
        <div className="flex items-center space-x-1">
          <h3 className="font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm text-[#263238] group-hover:text-[#FF6F2C] transition-colors leading-snug truncate">
            {member.name}
          </h3>
          <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 shrink-0" />
        </div>

        <p className="text-[#FF6F2C] text-[10px] sm:text-[11px] font-['Montserrat',sans-serif] font-semibold tracking-wide uppercase mt-0.5 truncate">
          {member.role}
        </p>

        {member.tagline && (
          <p className="text-[#667078] text-[11px] mt-1 line-clamp-1 font-['Inter',sans-serif]">
            {member.tagline}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <section id="about" className="py-14 sm:py-20 relative bg-[#FAF8F5] text-[#263238] border-b border-[#F1EFEC] overflow-hidden select-none">
      <span id="team" className="sr-only" />
      {/* Subtle Warm Accent */}
      <div className="w-80 h-80 bg-[#FFF1E9]/60 rounded-full blur-3xl absolute -top-16 -left-16 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center space-x-2.5 text-sm sm:text-base lg:text-lg font-['Montserrat',sans-serif] font-bold text-[#FF6F2C] uppercase tracking-[0.14em] mb-3 px-4 sm:px-5 py-1.5 sm:py-2 bg-[#FFF1E9] border border-[#FF6F2C]/30 rounded-[8px]">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF6F2C]" />
              <span>OUR TEAM</span>
            </div>

            <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#263238] tracking-tight">
              Meet Our <span className="text-[#FF6F2C]">Team</span>
            </h2>
            
            <p className="font-['Inter',sans-serif] text-[#667078] text-xs sm:text-sm font-normal mt-2 max-w-lg mx-auto leading-relaxed">
              Passionate engineers, architects, and site leaders building landmark structures.
            </p>
          </div>
        </ScrollReveal>

        {/* ── ROW 1: MANAGEMENT ── */}
        <div className="mb-14 sm:mb-16">
          <ScrollReveal direction="up" delay={50}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-[2px] bg-[#FF6F2C] rounded-full" />
              <span className="font-['Montserrat',sans-serif] text-xs font-semibold text-[#FF6F2C] uppercase tracking-widest">Leadership</span>
              <div className="w-6 h-[2px] bg-[#FF6F2C] rounded-full" />
            </div>
          </ScrollReveal>

          <AutoScrollRow
            items={management}
            renderItem={renderManagementCard}
            itemKey={(m) => m.id}
            cardWidth={250}
          />
        </div>

        {/* ── ROW 2: EMPLOYEES & ENGINEERS ── */}
        <div>
          <ScrollReveal direction="up" delay={50}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-6 h-[2px] bg-[#FF6F2C] rounded-full" />
              <span className="font-['Montserrat',sans-serif] text-xs font-semibold text-[#667078] uppercase tracking-widest">Engineering & Site Operations</span>
              <div className="w-6 h-[2px] bg-[#FF6F2C] rounded-full" />
            </div>
          </ScrollReveal>

          <AutoScrollRow
            items={employees}
            renderItem={renderEmployeeCard}
            itemKey={(m) => m.id}
            cardWidth={250}
          />
        </div>

      </div>
    </section>
  );
};
