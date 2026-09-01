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
  Users,
  Lock,
  Mail,
  Key,
  Menu,
  X
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeMenu, setActiveMenu] = useState<'inquiries' | 'projects' | 'team' | 'settings'>('inquiries');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CLOSED'>('ALL');
  const [showAddModal, setShowAddModal] = useState<'none' | 'project' | 'team'>('none');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@shivam.com' && password === 'root123') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#538EFE] to-[#397BFF]"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#397BFF]">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Admin Login</h2>
            <p className="text-sm text-slate-500 mt-1">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#397BFF] focus:ring-1 focus:ring-[#397BFF] transition-all bg-slate-50 focus:bg-white" 
                  placeholder="admin@shivam.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#397BFF] focus:ring-1 focus:ring-[#397BFF] transition-all bg-slate-50 focus:bg-white" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="text-rose-500 text-xs font-bold text-center bg-rose-50 py-2 rounded-lg">
                {loginError}
              </div>
            )}

            <button type="submit" className="w-full py-3 bg-[#397BFF] text-white rounded-xl font-bold mt-2 hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2">
              <span>Access CMS</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <button onClick={onClose} className="w-full mt-4 text-center text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors">
            Cancel & Return to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isStandalonePage 
      ? "min-h-screen bg-[#E5E9F0] font-sans text-slate-800 flex items-center justify-center p-0 md:p-4"
      : "fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 font-sans text-slate-800"
    }>
      
      {/* Main App Container */}
      <div className={isStandalonePage
        ? "w-full h-full min-h-screen md:min-h-0 md:max-w-[1400px] md:h-[95vh] bg-[#F3F6FB] md:rounded-[2rem] shadow-2xl flex overflow-hidden border-0 md:border md:border-white/50 relative" 
        : "w-full h-full min-h-screen md:min-h-0 md:max-w-[1400px] md:h-[92vh] bg-[#F3F6FB] md:rounded-[2rem] shadow-2xl flex overflow-hidden border-0 md:border md:border-white/50 relative"
      }>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR (Dark Blue/Grey) */}
        <aside className={`absolute md:relative w-64 h-full bg-[#2B3243] flex flex-col shrink-0 z-40 shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          {/* Logo Area */}
          <div className="h-16 md:h-20 bg-[#397BFF] flex items-center justify-between px-6 md:px-8 md:rounded-br-[2rem]">
            <span className="text-white font-black text-xl md:text-2xl tracking-wider">UIUX</span>
            <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 py-8 flex flex-col gap-1 overflow-y-auto">
            
            {/* Menu Item 1 */}
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('inquiries'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${
                  activeMenu === 'inquiries' 
                    ? 'bg-[#397BFF] text-white rounded-r-full shadow-lg shadow-blue-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
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
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('projects'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${
                  activeMenu === 'projects' 
                    ? 'bg-[#397BFF] text-white rounded-r-full shadow-lg shadow-blue-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
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
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('team'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${
                  activeMenu === 'team' 
                    ? 'bg-[#397BFF] text-white rounded-r-full shadow-lg shadow-blue-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
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
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('settings'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 ${
                  activeMenu === 'settings' 
                    ? 'bg-[#397BFF] text-white rounded-r-full shadow-lg shadow-blue-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
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
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full">
              <LogOut className="w-4 h-4" />
              <span className="text-[13px]">Logout</span>
            </button>
            <button onClick={onClose} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full mt-4">
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span className="text-[13px]">Exit to Website</span>
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden md:rounded-tl-[2rem] md:-ml-4 z-10 md:shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
          
          {/* Top Navbar */}
          <header className="h-16 md:h-20 flex items-center justify-between md:justify-end px-4 md:px-10 shrink-0 border-b border-slate-100 md:border-none">
            <button 
              className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3 md:space-x-5">
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors hidden sm:flex">
                <Bell className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-3 ml-1 md:ml-2 sm:border-l border-slate-200 sm:pl-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  S
                </div>
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">Samkv2</span>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </div>
            </div>
          </header>

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 pb-10 pt-4 md:pt-0">
            
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
            <div className="bg-white md:rounded-[1.5rem] md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:border border-slate-100 md:p-6 -mx-4 md:mx-0">
              
              {/* Tabs */}
              <div className="flex items-center space-x-1 border-b border-slate-200 mb-6 overflow-x-auto px-4 md:px-0 no-scrollbar">
                <button 
                  onClick={() => setActiveTab('ALL')}
                  className={`px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ALL' ? 'border-[#397BFF] text-[#397BFF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  All Records
                </button>
                <button 
                  onClick={() => setActiveTab('PENDING')}
                  className={`px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'PENDING' ? 'border-[#397BFF] text-[#397BFF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => setActiveTab('CLOSED')}
                  className={`px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'CLOSED' ? 'border-[#397BFF] text-[#397BFF]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Completed
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-4 md:px-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700 shrink-0">Search</label>
                    <input 
                      type="text" 
                      placeholder="Enter a keyword"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full sm:w-64 focus:outline-none focus:border-[#397BFF]"
                    />
                  </div>
                </div>
                {(activeMenu === 'projects' || activeMenu === 'team') && (
                  <button 
                    onClick={() => setShowAddModal(activeMenu === 'projects' ? 'project' : 'team')}
                    className="px-6 py-2.5 bg-[#397BFF] text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Release</span>
                  </button>
                )}
              </div>

              {/* List Data */}
              <div className="space-y-4 px-4 md:px-0">
                
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
                    <div className="flex items-center space-x-2 sm:space-x-3 shrink-0 w-full sm:w-auto">
                      <select 
                        value={inq.status}
                        onChange={(e) => cmsStore.updateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                        className="flex-1 sm:flex-none px-2 sm:px-4 py-1.5 border border-[#397BFF] text-[#397BFF] rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors bg-white outline-none cursor-pointer"
                      >
                         <option value="PENDING">PENDING</option>
                         <option value="REVIEWED">REVIEWED</option>
                         <option value="CONTACTED">CONTACTED</option>
                         <option value="CLOSED">CLOSED</option>
                      </select>
                      <button onClick={() => cmsStore.deleteInquiry(inq.id)} className="px-3 sm:px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {activeMenu === 'projects' && filteredProjects.map(p => (
                  <div key={p.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <img 
                        src={p.coverImage || 'https://via.placeholder.com/400x200?text=No+Image'} 
                        alt={p.title} 
                        className="w-24 h-16 sm:w-40 sm:h-20 rounded-xl object-cover shadow-sm flex-shrink-0" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                      />
                      <div>
                        <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-800 mb-1 line-clamp-1">{p.title}</h4>
                        <p className="text-[11px] sm:text-xs text-slate-500">{p.category} • {p.location}</p>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 font-mono">Status: {p.status} | Area: {p.area}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <button className="flex-1 sm:flex-none px-3 py-1.5 border border-[#397BFF] text-[#397BFF] rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors text-center">
                        Edit
                      </button>
                      <button onClick={() => cmsStore.deleteProject(p.id)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors text-center">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {activeMenu === 'team' && filteredTeam.map(t => (
                  <div key={t.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <img 
                        src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=F1F5F9&color=333&size=200`} 
                        alt={t.name} 
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-sm flex-shrink-0 border-2 border-slate-100" 
                        onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=F1F5F9&color=333&size=200`; }}
                      />
                      <div>
                        <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-800 mb-1">{t.name}</h4>
                        <p className="text-[11px] sm:text-xs text-slate-500">{t.role} • {t.category}</p>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 line-clamp-1">{t.tagline || 'No tagline provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                      <button className="flex-1 sm:flex-none px-3 py-1.5 border border-[#397BFF] text-[#397BFF] rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors text-center">
                        Edit
                      </button>
                      <button onClick={() => cmsStore.deleteTeamMember(t.id)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors text-center">
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
