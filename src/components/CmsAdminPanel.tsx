import React, { useState, useEffect } from 'react';
import { cmsStore, type Inquiry, type SiteSettings } from '../data/cmsStore';
import type { Project } from '../data/projectsData';

interface CmsAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
}

export const CmsAdminPanel: React.FC<CmsAdminPanelProps> = ({ isOpen, onClose, isStandalonePage }) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'projects' | 'settings'>('inquiries');
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(cmsStore.getSiteSettings());

  useEffect(() => {
    const updateState = () => {
      setInquiries(cmsStore.getInquiries());
      setProjects(cmsStore.getProjects());
      setSiteSettings(cmsStore.getSiteSettings());
    };
    updateState();
    const unsubscribe = cmsStore.subscribe(updateState);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  return (
    <div className={isStandalonePage 
      ? "min-h-screen bg-[#0F1014] text-slate-300 font-mono select-none"
      : "fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-mono select-none"
    }>
      <div className={isStandalonePage
        ? "w-full min-h-screen flex flex-col relative"
        : "bg-[#0F1014] w-full max-w-7xl h-[92vh] border border-[#333] flex flex-col relative overflow-hidden"
      }>
        
        {/* TOP HEADER */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-[#333] shrink-0 bg-[#0F1014]">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-white tracking-widest uppercase flex items-center space-x-2">
              <span className="text-slate-400">P</span>
              <span>PERSQFT ADMIN CMS</span>
            </span>
            <span className="px-2 py-0.5 border border-[#F48033]/50 text-[#F48033] text-[10px] font-bold tracking-widest uppercase bg-[#F48033]/10">
              v2.4 SECURE
            </span>
          </div>
          <div className="flex items-center space-x-6 text-xs uppercase font-bold tracking-widest">
            <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors flex items-center space-x-2">
              <span>←</span>
              <span>BACK TO PUBLIC WEBSITE</span>
            </button>
            <button onClick={onClose} className="px-4 py-1.5 border border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors">
              LOGOUT
            </button>
          </div>
        </header>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden bg-[#0F1014]">
          
          {/* SIDEBAR */}
          <aside className="w-72 shrink-0 border-r border-[#333] p-6 space-y-4">
            <div className="border border-[#333] p-1 space-y-1">
              
              <button 
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center justify-between px-3 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === 'projects' ? 'bg-[#F48033] text-black' : 'text-slate-400 hover:bg-[#1A1C23] hover:text-white'
                }`}
              >
                <span>1. PROJECTS CMS</span>
                {activeTab === 'projects' && <span>[ACTIVE]</span>}
              </button>

              <button 
                onClick={() => setActiveTab('inquiries')}
                className={`w-full flex items-center justify-between px-3 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === 'inquiries' ? 'bg-[#F48033] text-black' : 'text-slate-400 hover:bg-[#1A1C23] hover:text-white'
                }`}
              >
                <span>2. ENQUIRIES PANEL</span>
                {activeTab === 'inquiries' 
                  ? <span>[ACTIVE]</span> 
                  : <span className="text-[#F48033]">NEW ({inquiries.length})</span>
                }
              </button>

              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center justify-between px-3 py-3 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  activeTab === 'settings' ? 'bg-[#F48033] text-black' : 'text-slate-400 hover:bg-[#1A1C23] hover:text-white'
                }`}
              >
                <span>3. DB SYSTEM STATUS</span>
                {activeTab === 'settings'
                  ? <span>[ACTIVE]</span>
                  : <span className="text-emerald-500">ONLINE</span>
                }
              </button>

            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 p-8 overflow-y-auto">
            {activeTab === 'inquiries' && (
              <div className="border border-[#333] p-6 bg-[#121318]">
                <h2 className="text-white font-bold text-sm tracking-widest uppercase mb-6">CLIENT ENQUIRIES LOG</h2>
                
                <div className="space-y-3">
                  {inquiries.map(inq => (
                    <div key={inq.id} className="border border-[#2A2B33] bg-[#16171C] p-5 flex items-center justify-between transition-colors hover:border-[#F48033]/50">
                      <div>
                        <div className="text-[#F48033] font-bold text-[13px] uppercase tracking-wide mb-1.5">
                          #{inq.referenceId} — {inq.fullName}
                        </div>
                        <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1.5">
                          {inq.serviceRequired} • {inq.email} • {inq.phone}
                        </div>
                        <div className="text-slate-500 text-[10px] uppercase tracking-widest">
                          Budget/Area: {inq.areaSqft} • Date: {inq.createdAt}
                        </div>
                      </div>
                      <div>
                        <select 
                          value={inq.status}
                          onChange={(e) => cmsStore.updateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                          className="bg-[#2A2B33] text-slate-200 border border-[#444] text-[11px] uppercase font-bold px-4 py-2 outline-none cursor-pointer hover:bg-[#333] transition-colors appearance-none"
                        >
                          <option value="PENDING">NEW</option>
                          <option value="REVIEWED">REVIEWED</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </div>
                    </div>
                  ))}
                  
                  {inquiries.length === 0 && (
                    <div className="text-slate-500 text-xs uppercase tracking-widest p-4 text-center border border-[#222]">
                      No active inquiries found.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="border border-[#333] p-6 bg-[#121318]">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-bold text-sm tracking-widest uppercase">PROJECTS DATABASE</h2>
                    <button className="px-4 py-1.5 bg-[#F48033] text-black font-bold text-[11px] uppercase tracking-widest hover:bg-white transition-colors">
                      + ADD RECORD
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                  {projects.map(p => (
                    <div key={p.id} className="border border-[#2A2B33] bg-[#16171C] p-5 flex items-center justify-between transition-colors hover:border-[#F48033]/50">
                       <div>
                          <div className="text-[#F48033] font-bold text-[13px] uppercase tracking-wide mb-1.5">{p.title}</div>
                          <div className="text-slate-400 text-[11px] uppercase tracking-wider">{p.category} • {p.location} • STATUS: {p.status}</div>
                       </div>
                       <button onClick={() => cmsStore.deleteProject(p.id)} className="px-3 py-1.5 border border-rose-500/50 text-rose-500 text-[10px] uppercase font-bold tracking-widest hover:bg-rose-500 hover:text-white transition-colors">
                         DELETE
                       </button>
                    </div>
                  ))}
                 </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="border border-[#333] p-6 bg-[#121318]">
                <h2 className="text-white font-bold text-sm tracking-widest uppercase mb-6">SYSTEM STATUS & CONFIG</h2>
                <div className="space-y-0 text-[11px] uppercase tracking-widest text-slate-400 border border-[#333]">
                  <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#16171C]">
                    <span>DATABASE CONNECTION</span>
                    <span className="text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">STABLE</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#16171C]">
                    <span>STORAGE USAGE</span>
                    <span className="text-white">12.4 MB / 500 MB</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b border-[#333] bg-[#16171C]">
                    <span>FRONTEND DEPLOYMENT</span>
                    <span className="text-[#F48033]">SYNCED</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#16171C]">
                    <span>ADMIN OVERRIDE EMAIL</span>
                    <span className="text-white font-bold">{siteSettings.email}</span>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
