import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  FolderKanban,
  Settings,
  Search,
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
  X,
  ShieldCheck
} from 'lucide-react';
import { cmsStore, type Inquiry, type TeamMember, type AdminUser } from '../data/cmsStore';
import type { Project } from '../data/projectsData';
import { AddProjectModal, AddTeamModal, AddAdminModal, EditAdminModal } from './CmsAddModals';

interface CmsAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isStandalonePage?: boolean;
}

export const CmsAdminPanel: React.FC<CmsAdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeMenu, setActiveMenu] = useState<'inquiries' | 'projects' | 'team' | 'admins' | 'settings'>('inquiries');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CLOSED'>('ALL');
  const [showAddModal, setShowAddModal] = useState<'none' | 'project' | 'team' | 'admin'>('none');
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateState = () => {
      setInquiries(cmsStore.getInquiries());
      setProjects(cmsStore.getProjects());
      setTeam(cmsStore.getTeam());
      setAdmins(cmsStore.getAdmins());
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

  const filteredAdmins = admins.filter(a =>
    a.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const handleSaveAndSync = async () => {
    setIsSaving(true);
    setSaveToast('Saving state & syncing with live MySQL server...');
    try {
      await cmsStore.saveAndSyncAll();
      setSaveToast('✓ All changes saved permanently to MySQL & live on site!');
      setTimeout(() => setSaveToast(null), 3500);
    } catch {
      setSaveToast('⚠️ Saved locally. Server sync will retry automatically.');
      setTimeout(() => setSaveToast(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const matchedAdmin = admins.find(a => 
      a.email.toLowerCase() === trimmedEmail.toLowerCase() || 
      a.username.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (
      (trimmedEmail === 'admin@persqft.com' && password === 'PersqftAdmin2026!') ||
      (matchedAdmin && (matchedAdmin.password ? matchedAdmin.password === password : password === 'PersqftAdmin2026!'))
    ) {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid email or password.');
    }
  };

  const trimmedEmail = email.trim();
  const currentAdmin = trimmedEmail ? admins.find(a => 
    a.email.toLowerCase() === trimmedEmail.toLowerCase() || 
    a.username.toLowerCase() === trimmedEmail.toLowerCase()
  ) : null;

  const isSuperAdmin = currentAdmin 
    ? (currentAdmin.id === 1 || /CEO|HEAD|Owner/i.test(currentAdmin.role))
    : (trimmedEmail.toLowerCase() === 'admin@persqft.com' || trimmedEmail.toLowerCase() === 'admin');

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4 font-sans text-slate-800">
        <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FF8F3D] to-[#FF6F2C]"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#FF6F2C] shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight uppercase font-mono">PERSQFT CMS</h2>
            <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">Enterprise Administration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email or Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6F2C] focus:ring-1 focus:ring-[#FF6F2C] transition-all bg-slate-50 focus:bg-white" 
                  placeholder="admin@persqft.com"
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
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6F2C] focus:ring-1 focus:ring-[#FF6F2C] transition-all bg-slate-50 focus:bg-white" 
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="text-rose-500 text-xs font-bold text-center bg-rose-50 py-2 rounded-lg">
                {loginError}
              </div>
            )}

            <button type="submit" className="w-full py-3 bg-[#FF6F2C] hover:bg-[#d96a20] text-white rounded-xl font-bold mt-2 transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 cursor-pointer">
              <span>Access CMS</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <button onClick={onClose} className="w-full mt-4 text-center text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors cursor-pointer">
            Cancel & Return to Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] w-screen h-screen bg-[#F3F6FB] flex overflow-hidden font-sans text-slate-800 select-none">
      
      {/* Main Full-Window Container */}
      <div className="w-full h-full bg-[#F3F6FB] flex overflow-hidden relative">
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR (Dark Charcoal / Slate matching logo theme) */}
        <aside className={`absolute md:relative w-64 h-full bg-[#1E2330] flex flex-col shrink-0 z-40 shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          {/* Logo Area (PERSQFT Logo Theme with Brand Orange) */}
          <div className="h-16 md:h-20 bg-gradient-to-r from-[#FF8F3D] to-[#FF6F2C] flex items-center justify-between px-6 md:px-8">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-white text-black font-black text-lg flex items-center justify-center rounded-xl shadow-md font-mono">
                P
              </div>
              <div className="leading-tight">
                <span className="text-white font-black text-lg md:text-xl tracking-wider uppercase font-mono block">PERSQFT</span>
                <span className="text-[9px] font-mono text-white/80 tracking-widest uppercase block">CMS PANEL</span>
              </div>
            </div>
            <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 py-8 flex flex-col gap-1.5 overflow-y-auto">
            
            {/* Menu Item 1: Inquiries Panel */}
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('inquiries'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 cursor-pointer ${
                  activeMenu === 'inquiries' 
                    ? 'bg-[#FF6F2C] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
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

            {/* Menu Item 2: Projects CMS */}
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('projects'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 cursor-pointer ${
                  activeMenu === 'projects' 
                    ? 'bg-[#FF6F2C] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
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

            {/* Menu Item 3: Team Directory */}
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('team'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 cursor-pointer ${
                  activeMenu === 'team' 
                    ? 'bg-[#FF6F2C] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
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

            {/* Menu Item 4: Admin Users */}
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('admins'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 cursor-pointer ${
                  activeMenu === 'admins' 
                    ? 'bg-[#FF6F2C] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
                    : 'text-slate-400 hover:text-white rounded-xl hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[13px]">Admin Users</span>
                </div>
                {activeMenu !== 'admins' && <ChevronRight className="w-4 h-4 opacity-50" />}
              </button>
            </div>

            {/* Menu Item 5: System Settings */}
            <div className="px-3 md:px-4">
              <button 
                onClick={() => { setActiveMenu('settings'); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-all duration-300 cursor-pointer ${
                  activeMenu === 'settings' 
                    ? 'bg-[#FF6F2C] text-white rounded-r-full shadow-lg shadow-orange-500/30 font-bold -ml-3 md:-ml-4 pr-6 md:pr-8 pl-6 md:pl-8' 
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
            <button onClick={() => setIsAuthenticated(false)} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span className="text-[13px]">Logout</span>
            </button>
            <button onClick={onClose} className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors w-full mt-4 cursor-pointer">
              <ChevronRight className="w-4 h-4 rotate-180" />
              <span className="text-[13px]">Exit to Website</span>
            </button>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT (Full Window Layout) */}
        <main className="flex-1 flex flex-col bg-white overflow-hidden z-10">
          
          {/* Top Navbar */}
          <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-10 shrink-0 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <button 
                className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase hidden md:inline">PERSQFT EXECUTIVE CMS CONTROL</span>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Save & Publish Live State Button */}
              <button
                onClick={handleSaveAndSync}
                disabled={isSaving}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 sm:space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                    <span className="hidden sm:inline">Save & Publish Live</span>
                    <span className="sm:hidden">Save State</span>
                  </>
                )}
              </button>

              {/* Dedicated Server Portal */}
              <a
                href="/admin/login.php"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center space-x-1 px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-mono text-[11px] font-bold rounded-xl transition-all"
                title="Launch Server Administration Suite"
              >
                <span>Server Portal</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </a>

              <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors hidden md:flex">
                <Search className="w-4 h-4" />
              </button>
              {(() => {
                const displayName = currentAdmin ? currentAdmin.username : (trimmedEmail ? trimmedEmail.split('@')[0] : 'PERSQFT HEAD/CEO');
                const initial = displayName.slice(0, 1).toUpperCase();
                return (
                  <button 
                    onClick={() => {
                      if (currentAdmin) setEditingAdmin(currentAdmin);
                      else if (admins.length > 0) setEditingAdmin(admins[0]);
                    }}
                    title="Edit Profile & Password"
                    className="flex items-center space-x-2 sm:space-x-3 ml-1 sm:border-l border-slate-200 sm:pl-4 cursor-pointer group text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF8F3D] to-[#FF6F2C] flex items-center justify-center text-white text-xs font-bold shadow-md font-mono group-hover:scale-105 transition-transform">
                      {initial}
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-[#FF6F2C] transition-colors block leading-tight">{displayName}</span>
                      <span className="text-[10px] font-mono text-slate-400 block -mt-0.5">{currentAdmin?.role || (isSuperAdmin ? 'PERSQFT HEAD/CEO' : 'Admin')}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block group-hover:text-slate-600" />
                  </button>
                );
              })()}
            </div>
          </header>

          {/* Save Status Toast */}
          {saveToast && (
            <div className={`mx-4 md:mx-10 mt-4 p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
              saveToast.includes('✓') 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                : (saveToast.includes('⚠️') ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-blue-50 border-blue-300 text-blue-800')
            }`}>
              <span>{saveToast}</span>
              <button onClick={() => setSaveToast(null)} className="text-slate-400 hover:text-slate-700 ml-4 font-bold">✕</button>
            </div>
          )}

          {/* Content Scroll Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 pb-10 pt-6">
            
            {/* 3 Vibrant Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              
              {/* Card 1: PERSQFT Brand Orange Theme Card */}
              <div className="bg-gradient-to-br from-[#FF8F3D] to-[#FF6F2C] rounded-[1.5rem] p-6 text-white shadow-xl shadow-orange-500/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-1">Inquiries Log</h3>
                  <p className="text-orange-100 text-xs mb-5 pr-12 line-clamp-2">Manage all client leads and property quote requests.</p>
                  <button 
                    onClick={() => setActiveMenu('inquiries')}
                    className="px-4 py-1.5 border border-white/50 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Detail
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 group-hover:scale-110 transition-transform duration-500">
                  <Database className="w-20 h-20 text-orange-200/50" strokeWidth={1} />
                </div>
              </div>

              {/* Card 2: Sky Blue Projects Card */}
              <div className="bg-gradient-to-br from-[#40C4FF] to-[#0096FF] rounded-[1.5rem] p-6 text-white shadow-xl shadow-cyan-500/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-1">Projects CMS</h3>
                  <p className="text-cyan-100 text-xs mb-5 pr-12 line-clamp-2">Set up and manage architectural portfolio items.</p>
                  <button 
                    onClick={() => setActiveMenu('projects')}
                    className="px-4 py-1.5 border border-white/50 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    Set up
                  </button>
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-90 group-hover:scale-110 transition-transform duration-500">
                  <Layers className="w-20 h-20 text-cyan-200/50" strokeWidth={1} />
                </div>
              </div>

              {/* Card 3: Emerald Site Stats Card */}
              <div className="bg-gradient-to-br from-[#42E39F] to-[#12B774] rounded-[1.5rem] p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-1">Site Stats</h3>
                  <p className="text-emerald-100 text-xs mb-5 pr-12 line-clamp-2">Customize global settings and view database status.</p>
                  <button 
                    onClick={() => setActiveMenu('settings')}
                    className="px-4 py-1.5 border border-white/50 rounded-lg text-xs font-semibold hover:bg-white/20 transition-colors cursor-pointer"
                  >
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
              <div className="flex items-center space-x-1 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveTab('ALL')}
                  className={`px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'ALL' ? 'border-[#FF6F2C] text-[#FF6F2C]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  All Records
                </button>
                <button 
                  onClick={() => setActiveTab('PENDING')}
                  className={`px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'PENDING' ? 'border-[#FF6F2C] text-[#FF6F2C]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => setActiveTab('CLOSED')}
                  className={`px-4 md:px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === 'CLOSED' ? 'border-[#FF6F2C] text-[#FF6F2C]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                  Completed
                </button>
              </div>

              {/* Filters Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:space-x-4 flex-1">
                  <div className="flex items-center space-x-2">
                    <label className="text-xs font-bold text-slate-700 shrink-0">Search</label>
                    <input 
                      type="text" 
                      placeholder="Enter a keyword"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full sm:w-64 focus:outline-none focus:border-[#FF6F2C]"
                    />
                  </div>
                </div>
                {(activeMenu === 'projects' || activeMenu === 'team' || (activeMenu === 'admins' && isSuperAdmin)) && (
                  <button 
                    onClick={() => setShowAddModal(activeMenu === 'projects' ? 'project' : (activeMenu === 'team' ? 'team' : 'admin'))}
                    className="px-6 py-2.5 bg-[#FF6F2C] hover:bg-[#d96a20] text-white font-bold text-xs rounded-lg flex items-center justify-center space-x-2 shadow-md shadow-orange-500/20 transition-colors w-full sm:w-auto cursor-pointer"
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
                      {/* Brand Orange LEAD Badge matching screenshot */}
                      <div className="w-36 sm:w-40 h-20 rounded-xl bg-gradient-to-r from-[#FF6F2C] to-[#FF5E1B] flex items-center justify-center text-white flex-shrink-0 shadow-md">
                        <span className="font-black text-xl tracking-wider font-mono">LEAD</span>
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
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 border border-[#FF6F2C] text-[#FF6F2C] rounded-lg text-xs font-semibold hover:bg-orange-50 transition-colors bg-white outline-none cursor-pointer"
                      >
                         <option value="PENDING">PENDING</option>
                         <option value="REVIEWED">REVIEWED</option>
                         <option value="CONTACTED">CONTACTED</option>
                         <option value="CLOSED">CLOSED</option>
                      </select>
                      <button onClick={() => cmsStore.deleteInquiry(inq.id)} className="px-3 sm:px-4 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer">
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
                      <button className="flex-1 sm:flex-none px-3 py-1.5 border border-[#FF6F2C] text-[#FF6F2C] rounded-lg text-xs font-semibold hover:bg-orange-50 transition-colors text-center cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => cmsStore.deleteProject(p.id)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors text-center cursor-pointer">
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
                      <button className="flex-1 sm:flex-none px-3 py-1.5 border border-[#FF6F2C] text-[#FF6F2C] rounded-lg text-xs font-semibold hover:bg-orange-50 transition-colors text-center cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => cmsStore.deleteTeamMember(t.id)} className="px-3 py-1.5 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors text-center cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {/* Admin Users / Access Control Tab */}
                {activeMenu === 'admins' && filteredAdmins.map(a => {
                  const isOwnCard = currentAdmin ? a.id === currentAdmin.id : false;
                  const canEdit = isSuperAdmin || isOwnCard;
                  const canDelete = isSuperAdmin && a.id > 1 && !isOwnCard;

                  return (
                    <div key={a.id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow bg-white gap-4">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 text-white flex items-center justify-center font-black text-base font-mono flex-shrink-0 shadow-md border-2 border-slate-100">
                          {a.username.slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-[14px] sm:text-[15px] font-bold text-slate-800 truncate">{a.username}</h4>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold font-mono ${a.id === 1 ? 'bg-orange-50 text-[#FF6F2C] border border-orange-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                              {a.role}
                            </span>
                          </div>
                          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-mono truncate">Login Email: <span className="text-slate-800 font-semibold">{a.email}</span></p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Created: {a.createdAt}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 justify-end">
                        {canEdit && (
                          <button 
                            onClick={() => setEditingAdmin(a)} 
                            className="px-3 py-1.5 border border-[#FF6F2C] text-[#FF6F2C] rounded-lg text-xs font-semibold hover:bg-orange-50 transition-colors text-center cursor-pointer"
                          >
                            Edit {isOwnCard ? '(You)' : ''}
                          </button>
                        )}

                        {canDelete ? (
                          <button onClick={() => cmsStore.deleteAdmin(a.id)} className="px-3 py-1.5 border border-rose-300 text-rose-600 rounded-lg text-xs font-semibold hover:bg-rose-50 transition-colors text-center cursor-pointer">
                            Delete
                          </button>
                        ) : a.id === 1 ? (
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-mono font-bold">
                            Primary Owner
                          </span>
                        ) : !canEdit ? (
                          <span className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-400 rounded-lg text-[10px] font-mono">
                            Protected
                          </span>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                {/* System Settings Tab */}
                {activeMenu === 'settings' && (
                  <div className="space-y-6 py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                        <span className="text-xs font-bold text-[#FF6F2C] uppercase font-mono">Company Details</span>
                        <div className="space-y-2 text-xs text-slate-700">
                          <div><span className="font-bold text-slate-500">Name:</span> PERSQFT CONSTRUCTIONS</div>
                          <div><span className="font-bold text-slate-500">Tagline:</span> Architectural Excellence & Structural Precision</div>
                          <div><span className="font-bold text-slate-500">Phone:</span> +91-6306659601</div>
                          <div><span className="font-bold text-slate-500">Email:</span> contact@persqft.com</div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                        <span className="text-xs font-bold text-emerald-600 uppercase font-mono">Database Status</span>
                        <div className="space-y-2 text-xs text-slate-700 font-mono">
                          <div>Engine: <span className="font-bold text-slate-900">MySQL / MariaDB</span></div>
                          <div>Total Inquiries: <span className="font-bold text-[#FF6F2C]">{inquiries.length}</span></div>
                          <div>Total Projects: <span className="font-bold text-cyan-600">{projects.length}</span></div>
                          <div>Total Staff: <span className="font-bold text-emerald-600">{team.length}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {((activeMenu === 'inquiries' && filteredInquiries.length === 0) || 
                  (activeMenu === 'projects' && filteredProjects.length === 0) ||
                  (activeMenu === 'team' && filteredTeam.length === 0) ||
                  (activeMenu === 'admins' && filteredAdmins.length === 0)) && (
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
      {showAddModal === 'admin' && <AddAdminModal onClose={() => setShowAddModal('none')} />}
      {editingAdmin && <EditAdminModal admin={editingAdmin} isSuperAdmin={isSuperAdmin} onClose={() => setEditingAdmin(null)} />}
    </div>
  );
};
