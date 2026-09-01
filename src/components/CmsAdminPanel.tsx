import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  FolderKanban,
  Settings,
  Search,
  Bell,
  Plus,
  ChevronDown,
  ChevronRight,
  LogOut,
  Database,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';
import { cmsStore, type Inquiry, type TeamMember } from '../data/cmsStore';
import type { Project } from '../data/projectsData';
import { AddProjectModal, AddTeamModal } from './CmsAddModals';

interface CmsAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
}

export const CmsAdminPanel: React.FC<CmsAdminPanelProps> = ({ isOpen, onClose, isStandalonePage }) => {
  const [activeMenu, setActiveMenu] = useState<'inquiries' | 'projects' | 'team' | 'settings'>('inquiries');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CLOSED'>('ALL');
  const [showAddModal, setShowAddModal] = useState<'none' | 'project' | 'team'>('none');
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateState = () => {
      setInquiries(cmsStore.getInquiries());
      setProjects(cmsStore.getProjects());
      setTeam(cmsStore.getTeam());
    };
    updateState();
    const unsubscribe = cmsStore.subscribe(updateState);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const filteredInquiries = inquiries.filter(i => 
    (activeTab === 'ALL' || i.status === activeTab) && 
    (i.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || i.referenceId.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeam = team.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={isStandalonePage 
      ? "min-h-screen bg-[#E5E9F0] font-sans text-slate-800 flex items-center justify-center p-4"
      : "fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans text-slate-800"
    }>
      
      {/* Main App Container */}
      <div className={isStandalonePage
        ? "w-full max-w-[1400px] h-[95vh] bg-[#F3F6FB] rounded-[2rem] shadow-2xl flex overflow-hidden border border-white/50" 
        : "w-full max-w-[1400px] h-[92vh] bg-[#F3F6FB] rounded-[2rem] shadow-2xl flex overflow-hidden border border-white/50"
      }>
        
        {/* SIDEBAR (Dark Blue/Grey) */}
        <aside className="w-64 bg-[#2B3243] flex flex-col shrink-0 relative z-20 shadow-2xl">
          {/* Logo Area */}
          <div className="h-20 bg-[#397BFF] flex items-center px-8 rounded-br-[2rem]">
            <span className="text-white font-black text-2xl tracking-wider">UIUX</span>
          </div>

          <div className="flex-1 py-8 flex flex-col gap-1 overflow-y-auto">
            
            {/* Menu Item 1 */}
            <div className="px-4">
              <button 
                onClick={() => setActiveMenu('inquiries')}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${
                  activeMenu === 'inquiries' 
                    ? 'bg-[#397BFF] text-white rounded-r-full shadow-lg shadow-blue-500/30 font-bold -ml-4 pr-8 pl-8' 
                    : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[13px]">Inquiries Panel</span>
                </div>
                {activeMenu !== 'inquiries' && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            </div>

            {/* Menu Item 2 */}
            <div className="px-4">
              <button 
                onClick={() => setActiveMenu('projects')}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${
                  activeMenu === 'projects' 
                    ? 'bg-[#397BFF] text-white rounded-r-full shadow-lg shadow-blue-500/30 font-bold -ml-4 pr-8 pl-8' 
                    : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FolderKanban className="w-4 h-4" />
                  <span className="text-[13px]">Projects CMS</span>
                </div>
                {activeMenu !== 'projects' && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            </div>

            {/* Menu Item 3 */}
            <div className="px-4">
              <button 
                onClick={() => setActiveMenu('team')}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${
                  activeMenu === 'team' 
                    ? 'bg-[#397BFF] text-white rounded-r-full shadow-lg shadow-blue-500/30 font-bold -ml-4 pr-8 pl-8' 
                    : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4" />
                  <span className="text-[13px]">Team Directory</span>
                </div>
                {activeMenu !== 'team' && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            </div>

            {/* Menu Item 4 */}
            <div className="px-4">
              <button 
                onClick={() => setActiveMenu('settings')}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${
                  activeMenu === 'settings' 
                    ? 'bg-[#397BFF] text-white rounded-r-full shadow-lg shadow-blue-500/30 font-bold -ml-4 pr-8 pl-8' 
                    : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Settings className="w-4 h-4" />
                  <span className="text-[13px]">System Settings</span>
                </div>
                {activeMenu !== 'settings' && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            </div>

          </div>

          <div className="p-6 border-t border-slate-700/50">
            <button onClick={onClose} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-[13px]">Exit to Website</span>
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden rounded-tl-[2rem] -ml-4 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
          
          {/* Top Navbar */}
          <header className="h-20 flex items-center justify-end px-10 shrink-0">
            <div className="flex items-center space-x-5">
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-3 ml-2 border-l border-slate-200 pl-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  S
                </div>
                <span className="text-sm font-semibold text-slate-700">Samkv2</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </header>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto px-10 pb-10">
            
            {/* 3 Vibrant Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Card 1: Blue */}
              <div className="bg-gradient-to-br from-[#538EFE] to-[#397BFF] rounded-[1.5rem] p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-1">Inquiries Log</h3>
                  <p className="text-blue-100 text-xs mb-5 pr-12 line-clamp-2">Manage all client leads and property quote requests.</p>
                  <button className="px-4 py-1.5 border border-white/50 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors">
                    Detail
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 group-hover:scale-110 transition-transform duration-500">
                  <Database className="w-20 h-20 text-blue-200/50" strokeWidth={1} />
                </div>
              </div>

              {/* Card 2: Cyan */}
              <div className="bg-gradient-to-br from-[#40C4FF] to-[#0096FF] rounded-[1.5rem] p-6 text-white shadow-xl shadow-cyan-500/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-1">Projects CMS</h3>
                  <p className="text-cyan-100 text-xs mb-5 pr-12 line-clamp-2">Set up and manage architectural portfolio items.</p>
                  <button className="px-4 py-1.5 border border-white/50 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors">
                    Set up
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 group-hover:scale-110 transition-transform duration-500">
                  <Layers className="w-20 h-20 text-cyan-200/50" strokeWidth={1} />
                </div>
              </div>

              {/* Card 3: Green */}
              <div className="bg-gradient-to-br from-[#42E39F] to-[#12B774] rounded-[1.5rem] p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-1">Site Stats</h3>
                  <p className="text-emerald-100 text-xs mb-5 pr-12 line-clamp-2">Customize global settings and view database status.</p>
                  <button className="px-4 py-1.5 border border-white/50 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors">
                    Design
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 group-hover:scale-110 transition-transform duration-500">
                  <Sparkles className="w-20 h-20 text-emerald-200/50" strokeWidth={1} />
                </div>
              </div>
            </div>

            {/* Tabbed Interface Section */}
            <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6">
              
              {/* Tabs */}
              <div className="flex items-center space-x-1 border-b border-slate-200 mb-6">
                <button 
                  onClick={() => setActiveTab('ALL')}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ALL' ? 'border-[#397BFF] text-[#397BFF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  All Records
                </button>
                <button 
                  onClick={() => setActiveTab('PENDING')}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PENDING' ? 'border-[#397BFF] text-[#397BFF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => setActiveTab('CLOSED')}
                  className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'CLOSED' ? 'border-[#397BFF] text-[#397BFF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Completed
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700">Record Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter a keyword to search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-64 focus:outline-none focus:border-[#397BFF]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700">Category</label>
                    <select className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-48 focus:outline-none text-slate-400">
                      <option>Please choose</option>
                    </select>
                  </div>
                  <button className="px-6 py-2 border border-[#397BFF] text-[#397BFF] font-bold text-xs rounded-lg hover:bg-blue-50 transition-colors">
                    Search
                  </button>
                </div>
                {(activeMenu === 'projects' || activeMenu === 'team') && (
                  <button 
                    onClick={() => setShowAddModal(activeMenu === 'projects' ? 'project' : 'team')}
                    className="px-6 py-2 bg-[#397BFF] text-white font-bold text-xs rounded-lg flex items-center space-x-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Release</span>
                  </button>
                )}
              </div>

              {/* List Data */}
              <div className="space-y-4">
                
                {activeMenu === 'inquiries' && filteredInquiries.map(inq => (
                  <div key={inq.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-4">
                    <div className="flex items-center space-x-6 flex-1">
                      {/* Image Placeholder */}
                      <div className="w-40 h-20 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                        <span className="font-black text-xl tracking-wider">LEAD</span>
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-slate-800 mb-1">{inq.fullName}</h4>
                        <p className="text-xs text-slate-500">{inq.serviceRequired} • {inq.areaSqft}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-mono">Ref: {inq.referenceId} | Contact: {inq.phone}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <select 
                        value={inq.status}
                        onChange={(e) => cmsStore.updateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                        className="px-4 py-1.5 border border-[#397BFF] text-[#397BFF] rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors bg-white outline-none cursor-pointer"
                      >
                         <option value="PENDING">PENDING</option>
                         <option value="REVIEWED">REVIEWED</option>
                         <option value="CONTACTED">CONTACTED</option>
                         <option value="CLOSED">CLOSED</option>
                      </select>
                      <button onClick={() => cmsStore.deleteInquiry(inq.id)} className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {activeMenu === 'projects' && filteredProjects.map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-4">
                    <div className="flex items-center space-x-6 flex-1">
                      <img src={p.coverImage} alt={p.title} className="w-40 h-20 rounded-xl object-cover shadow-sm flex-shrink-0" />
                      <div>
                        <h4 className="text-[15px] font-bold text-slate-800 mb-1">{p.title}</h4>
                        <p className="text-xs text-slate-500">{p.category} • {p.location}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-mono">Status: {p.status} | Area: {p.area}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 shrink-0">
                      <button className="px-4 py-1.5 border border-[#397BFF] text-[#397BFF] rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                        Revise
                      </button>
                      <button className="px-4 py-1.5 border border-[#397BFF] text-[#397BFF] rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                        Pause
                      </button>
                      <button onClick={() => cmsStore.deleteProject(p.id)} className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {activeMenu === 'team' && filteredTeam.map(t => (
                  <div key={t.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-4">
                    <div className="flex items-center space-x-6 flex-1">
                      <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover shadow-sm flex-shrink-0 border-2 border-slate-100" />
                      <div>
                        <h4 className="text-[15px] font-bold text-slate-800 mb-1">{t.name}</h4>
                        <p className="text-xs text-slate-500">{t.role} • {t.category}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{t.tagline || 'No tagline provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 shrink-0">
                      <button className="px-4 py-1.5 border border-[#397BFF] text-[#397BFF] rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                        Revise
                      </button>
                      <button onClick={() => cmsStore.deleteTeamMember(t.id)} className="px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {((activeMenu === 'inquiries' && filteredInquiries.length === 0) || 
                  (activeMenu === 'projects' && filteredProjects.length === 0) ||
                  (activeMenu === 'team' && filteredTeam.length === 0)) && (
                  <div className="py-12 text-center">
                     <p className="text-slate-400 text-sm">No records found for the current filter.</p>
                  </div>
                )}

              </div>
            </div>

          </div>
        </main>
      </div>

      {showAddModal === 'project' && <AddProjectModal onClose={() => setShowAddModal('none')} />}
      {showAddModal === 'team' && <AddTeamModal onClose={() => setShowAddModal('none')} />}
    </div>
  );
};
