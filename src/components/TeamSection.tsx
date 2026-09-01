import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { cmsStore, type TeamMember } from '../data/cmsStore';

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

  return (
    <section id="team" className="py-14 sm:py-20 relative bg-[#F8FAFC] text-slate-900 border-b border-slate-200/80 overflow-hidden select-none">
      {/* Background Blueprint Grid & Warm Ambient Accents */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-15 pointer-events-none" />
      <div className="w-80 h-80 bg-[#FCE8D5]/60 rounded-full blur-3xl absolute -top-16 -left-16 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-[#F48033] uppercase tracking-[0.25em] mb-2 px-3 py-1 bg-[#F48033]/10 border border-[#F48033]/20 rounded-full">
              <Award className="w-3.5 h-3.5 text-[#F48033]" />
              <span>OUR TEAM</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Meet Our <span className="text-[#F48033]">Team</span>
            </h2>
            
            <p className="text-slate-600 text-xs sm:text-sm font-normal mt-2 max-w-lg mx-auto leading-relaxed">
              Passionate engineers, architects, and site leaders building landmark structures.
            </p>
          </div>
        </ScrollReveal>

        {/* ── ROW 1: MANAGEMENT — Premium Horizontal Cards ── */}
        <div className="mb-10 sm:mb-14">
          <ScrollReveal direction="up" delay={50}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-[2px] bg-[#F48033] rounded-full" />
              <span className="font-mono text-[11px] font-bold text-[#F48033] uppercase tracking-widest">Leadership</span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {management.map((member, idx) => (
              <ScrollReveal key={member.id} direction="up" delay={idx * 100}>
                <div className="group relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl border border-slate-700/60 hover:border-[#F48033]/50 shadow-md hover:shadow-[0_8px_32px_rgba(244,128,51,0.15)] transition-all duration-300 overflow-hidden p-5 flex flex-col gap-4">

                  {/* Top row: avatar + badge */}
                  <div className="flex items-center gap-3.5">
                    {/* Circular Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#F48033]/60 shadow-lg">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-top pointer-events-none"
                        />
                      </div>
                      {/* Verified dot */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#1E293B] flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>

                    {/* Name + Badge */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h3 className="font-heading text-sm font-bold text-white group-hover:text-[#F48033] transition-colors truncate leading-tight">
                          {member.name}
                        </h3>
                      </div>
                      <p className="text-[#F48033] text-[10px] font-mono font-bold tracking-widest uppercase truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-[#F48033]/40 via-slate-600/40 to-transparent" />

                  {/* Tagline */}
                  {member.tagline && (
                    <p className="text-slate-400 text-[11px] leading-relaxed font-sans line-clamp-2">
                      {member.tagline}
                    </p>
                  )}

                  {/* Badge pill */}
                  {member.highlightBadge && (
                    <div className="self-start">
                      <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-[#F48033]/15 text-[#F48033] border border-[#F48033]/30">
                        {member.highlightBadge}
                      </span>
                    </div>
                  )}

                  {/* Subtle top-right orange glow */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#F48033]/5 rounded-full blur-2xl pointer-events-none" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* ── ROW 2: EMPLOYEES & ENGINEERS (SLEEK 4-COLUMN COMPACT CARDS) ── */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-5 max-w-4xl mx-auto">
            {employees.map((member, idx) => (
              <ScrollReveal key={member.id} direction="up" delay={(idx % 3) * 100}>
                <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#F48033]/60 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 flex flex-col">
                  {/* Photo Header */}
                  <div className="relative h-36 sm:h-44 overflow-hidden bg-slate-100">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-all duration-500 pointer-events-none"
                    />
                  </div>

                  {/* Compact Info Box */}
                  <div className="p-3 sm:p-3.5 text-left bg-white flex flex-col justify-center border-t border-slate-100 flex-1">
                    <div className="flex items-center space-x-1">
                      <h3 className="font-heading text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#F48033] transition-colors leading-snug truncate">
                        {member.name}
                      </h3>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 fill-emerald-100 shrink-0" />
                    </div>

                    <p className="text-[#F48033] text-[10px] sm:text-[11px] font-mono font-bold tracking-wide uppercase mt-0.5 truncate">
                      {member.role}
                    </p>

                    {member.tagline && (
                      <p className="text-slate-500 text-[11px] mt-1 line-clamp-1 font-sans">
                        {member.tagline}
                      </p>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
