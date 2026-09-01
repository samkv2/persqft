import React, { useState, useEffect } from 'react';
import {
  Layers,
  FileText,
  Building2,
  Users,
  Settings,
  Search,
  Plus,
  Trash2,
  Download,
  Database,
  X,
  Code2,
  RefreshCw,
  PhoneCall,
  Mail,
  MapPin,
  Sparkles,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { cmsStore, type Inquiry, type TeamMember, type SiteSettings } from '../data/cmsStore';
import type { Project } from '../data/projectsData';


interface CmsAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CmsAdminPanel: React.FC<CmsAdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'projects' | 'team' | 'settings' | 'php'>('inquiries');
  const [inquiriesTab, setInquiriesTab] = useState<'ALL' | 'PENDING' | 'CONTACTED' | 'CLOSED'>('ALL');
  
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(cmsStore.getSiteSettings());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [selectedInquiryDetail, setSelectedInquiryDetail] = useState<Inquiry | null>(null);

  // New Project Form State
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    slug: '',
    title: '',
    location: 'Lucknow, UP',
    category: 'Residential',
    status: 'ONGOING',
    progress: 75,
    year: 2026,
    client: 'Private Client',
    area: '5,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    gallery: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'],
    shortDescription: 'Modern luxury architectural build executed with precision RCC framing.',
    description: 'High-end turnkey construction project featuring exposed concrete elements, thermal insulation, and custom interior craft.',
    features: ['Seismic Concrete Structure', 'Custom Facade Glazing', 'Smart Home Wiring']
  });

  useEffect(() => {
    const updateState = () => {
      setInquiries(cmsStore.getInquiries());
      setProjects(cmsStore.getProjects());
      setTeam(cmsStore.getTeam());
      setSiteSettings(cmsStore.getSiteSettings());
    };

    updateState();
    const unsubscribe = cmsStore.subscribe(updateState);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  // Filtered inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesTab = inquiriesTab === 'ALL' || inq.status === inquiriesTab;
    const matchesSearch =
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      inq.serviceRequired.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Filtered projects
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    await cmsStore.addProject({
      ...newProject,
      slug: newProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    });
    setShowAddProjectModal(false);

    setNewProject({
      slug: '',
      title: '',
      location: 'Lucknow, UP',
      category: 'Residential',
      status: 'ONGOING',
      progress: 75,
      year: 2026,
      client: 'Private Client',
      area: '5,000 SQFT',
      coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      gallery: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop'],
      shortDescription: 'Modern luxury architectural build executed with precision RCC framing.',
      description: 'High-end turnkey construction project featuring exposed concrete elements, thermal insulation, and custom interior craft.',
      features: ['Seismic Concrete Structure', 'Custom Facade Glazing', 'Smart Home Wiring']
    });
  };

  const exportInquiriesCSV = () => {
    const headers = 'Reference ID,Full Name,Phone,Email,Service,Area,Status,Created At\n';
    const rows = inquiries
      .map(
        (i) =>
          `"${i.referenceId}","${i.fullName}","${i.phone}","${i.email}","${i.serviceRequired}","${i.areaSqft}","${i.status}","${i.createdAt}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PERSQFT_Inquiries_${new Date().toISOString().substring(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans select-none">
      
      {/* Container Box inspired by the reference design card layout */}
      <div className="bg-[#F4F6FB] w-full max-w-7xl h-[92vh] rounded-[2.5rem] shadow-2xl border border-slate-300/80 overflow-hidden flex flex-col md:flex-row relative">

        {/* ── LEFT DARK SIDEBAR (Matches reference dark nav with pill active state) ── */}
        <aside className="w-full md:w-64 bg-[#181C2B] text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
          
          {/* Brand Logo Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2A75FF] to-[#00C6FF] flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="font-heading font-black text-white text-lg tracking-wider">P</span>
              </div>
              <div>
                <h1 className="font-heading text-base font-bold text-white tracking-wide">PERSQFT <span className="text-[#2A75FF]">CMS</span></h1>
                <p className="text-[10px] font-mono text-slate-400">Admin Control Center</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'inquiries'
                  ? 'bg-[#2A75FF] text-white shadow-lg shadow-blue-500/30 font-bold'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <FileText className="w-4 h-4" />
                <span>Client Inquiries</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'inquiries' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                {inquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'projects'
                  ? 'bg-[#2A75FF] text-white shadow-lg shadow-blue-500/30 font-bold'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4" />
                <span>Projects Portfolio</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'}`}>
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'team'
                  ? 'bg-[#2A75FF] text-white shadow-lg shadow-blue-500/30 font-bold'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4" />
                <span>Team & Leadership</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'settings'
                  ? 'bg-[#2A75FF] text-white shadow-lg shadow-blue-500/30 font-bold'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Settings className="w-4 h-4" />
                <span>Site Stats & Settings</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('php')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                activeTab === 'php'
                  ? 'bg-[#2A75FF] text-white shadow-lg shadow-blue-500/30 font-bold'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">PHP & MySQL Bundle</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-300 font-mono">₹99 Host</span>
            </button>
          </nav>

          {/* User Profile & Back to Site Footer */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 space-y-3">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shadow">
                SA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">samkv2 (Admin)</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">admin@persqft.com</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Main Website</span>
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA (Clean white canvas with 3D gradient header cards) ── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F4F6FB]">
          
          {/* Top Header Bar */}
          <header className="px-6 py-4 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-bold text-slate-900 font-heading tracking-tight">
                {activeTab === 'inquiries' && 'Client Inquiry Requests & Lead Tracking'}
                {activeTab === 'projects' && 'Architectural Projects Portfolio'}
                {activeTab === 'team' && 'Team & Leadership Management'}
                {activeTab === 'settings' && 'Site Metrics & Global Configuration'}
                {activeTab === 'php' && '₹99 Shared Hosting PHP & MySQL Backend Code'}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => cmsStore.resetToDefaults()}
                title="Reset storage to original defaults"
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Scrollable Main Segment Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* ── TOP ROW: 3D SOFT GRADIENT CARDS (Inspired directly by reference UI image!) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Card 1: Vibrant Royal Blue (Group Buy style) */}
              <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#2A75FF] via-[#1E5AD6] to-[#0A40AD] text-white shadow-xl shadow-blue-500/20 overflow-hidden flex items-center justify-between group hover:scale-[1.01] transition-transform">
                <div className="space-y-2 z-10">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase opacity-80">Total Inquiries</span>
                  <div className="text-3xl font-black font-heading tracking-tight">{inquiries.length} Leads</div>
                  <p className="text-xs text-blue-100/80">Active quote requests</p>
                  
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white transition-colors border border-white/30 flex items-center space-x-1.5"
                  >
                    <span>Manage Leads</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* 3D Floating Layers/Disc SVG Graphic */}
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center p-3 text-white shadow-inner pointer-events-none group-hover:rotate-12 transition-transform duration-500">
                  <Database className="w-12 h-12 text-blue-200" />
                </div>
              </div>

              {/* Card 2: Vibrant Sky / Cyan (Flash Sale style) */}
              <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#00C6FF] via-[#00A3FF] to-[#0072FF] text-white shadow-xl shadow-cyan-500/20 overflow-hidden flex items-center justify-between group hover:scale-[1.01] transition-transform">
                <div className="space-y-2 z-10">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase opacity-80">Active Portfolio</span>
                  <div className="text-3xl font-black font-heading tracking-tight">{projects.length} Builds</div>
                  <p className="text-xs text-cyan-100/80">Ongoing & Completed</p>
                  
                  <button
                    onClick={() => { setActiveTab('projects'); setShowAddProjectModal(true); }}
                    className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white transition-colors border border-white/30 flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>
                {/* 3D Floating Stacked Layers SVG Graphic */}
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center p-3 text-white shadow-inner pointer-events-none group-hover:rotate-12 transition-transform duration-500">
                  <Layers className="w-12 h-12 text-cyan-100" />
                </div>
              </div>

              {/* Card 3: Vibrant Emerald / Teal (Event Poster style) */}
              <div className="relative rounded-3xl p-5 bg-gradient-to-br from-[#00E6A5] via-[#00B887] to-[#008560] text-white shadow-xl shadow-emerald-500/20 overflow-hidden flex items-center justify-between group hover:scale-[1.01] transition-transform">
                <div className="space-y-2 z-10">
                  <span className="text-[11px] font-mono font-bold tracking-wider uppercase opacity-80">Managed Execution</span>
                  <div className="text-3xl font-black font-heading tracking-tight">1.25M SQFT</div>
                  <p className="text-xs text-emerald-100/80">Turnkey architectural grid</p>
                  
                  <button
                    onClick={exportInquiriesCSV}
                    className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-bold text-white transition-colors border border-white/30 flex items-center space-x-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
                {/* 3D Torus Ring Graphic */}
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center p-3 text-white shadow-inner pointer-events-none group-hover:rotate-12 transition-transform duration-500">
                  <Sparkles className="w-12 h-12 text-emerald-100" />
                </div>
              </div>

            </div>

            {/* ── SEGMENT 1: CLIENT INQUIRIES & LEADS MANAGER ── */}
            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
                
                {/* Filter Tabs & Search Header (Matches reference image tab control) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  
                  {/* Status Tabs */}
                  <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-2xl">
                    {(['ALL', 'PENDING', 'CONTACTED', 'CLOSED'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setInquiriesTab(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          inquiriesTab === tab
                            ? 'bg-white text-[#2A75FF] shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tab === 'ALL' && 'All Inquiries'}
                        {tab === 'PENDING' && 'Pending Review'}
                        {tab === 'CONTACTED' && 'Contacted'}
                        {tab === 'CLOSED' && 'Closed'}
                      </button>
                    ))}
                  </div>

                  {/* Search Input & Export Action */}
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1 md:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        placeholder="Search name, phone, ref ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2A75FF]"
                      />
                    </div>

                    <button
                      onClick={exportInquiriesCSV}
                      className="px-4 py-2 bg-[#2A75FF] hover:bg-blue-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-2 shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Inquiries Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-mono uppercase text-slate-400 border-b border-slate-100">
                        <th className="pb-3 px-3 font-semibold">Ref ID & Date</th>
                        <th className="pb-3 px-3 font-semibold">Client Name</th>
                        <th className="pb-3 px-3 font-semibold">Contact Info</th>
                        <th className="pb-3 px-3 font-semibold">Service & Area</th>
                        <th className="pb-3 px-3 font-semibold">Status</th>
                        <th className="pb-3 px-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                            No inquiry records match your filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                            
                            {/* Ref ID */}
                            <td className="py-4 px-3 font-mono font-bold text-[#2A75FF]">
                              <div>{inq.referenceId}</div>
                              <div className="text-[10px] font-normal text-slate-400">{inq.createdAt}</div>
                            </td>

                            {/* Client Name */}
                            <td className="py-4 px-3 font-bold text-slate-900">
                              {inq.fullName}
                            </td>

                            {/* Contact Info */}
                            <td className="py-4 px-3 text-slate-600 space-y-0.5">
                              <div className="flex items-center space-x-1.5">
                                <PhoneCall className="w-3 h-3 text-slate-400" />
                                <span>{inq.phone}</span>
                              </div>
                              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{inq.email}</span>
                              </div>
                            </td>

                            {/* Service & Area */}
                            <td className="py-4 px-3">
                              <span className="font-semibold text-slate-800">{inq.serviceRequired}</span>
                              <div className="text-[11px] font-mono text-amber-600 font-bold">{inq.areaSqft}</div>
                            </td>

                            {/* Status Badge */}
                            <td className="py-4 px-3">
                              <select
                                value={inq.status}
                                onChange={(e) => cmsStore.updateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                                  inq.status === 'PENDING'
                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                    : inq.status === 'CONTACTED'
                                    ? 'bg-blue-50 text-blue-600 border-blue-200'
                                    : inq.status === 'REVIEWED'
                                    ? 'bg-purple-50 text-purple-600 border-purple-200'
                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                }`}
                              >
                                <option value="PENDING">🟡 PENDING</option>
                                <option value="REVIEWED">🟣 REVIEWED</option>
                                <option value="CONTACTED">🔵 CONTACTED</option>
                                <option value="CLOSED">🟢 CLOSED</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-3 text-right space-x-2">
                              <button
                                onClick={() => setSelectedInquiryDetail(inq)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => cmsStore.deleteInquiry(inq.id)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Delete Inquiry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── SEGMENT 2: PROJECTS PORTFOLIO CMS ── */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                
                {/* Header Control */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl shadow-sm border border-slate-200/80">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Filter project title, category, location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2A75FF]"
                    />
                  </div>

                  <button
                    onClick={() => setShowAddProjectModal(true)}
                    className="px-5 py-2.5 bg-[#2A75FF] hover:bg-blue-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Project</span>
                  </button>
                </div>

                {/* Projects Grid Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProjects.map((p) => (
                    <div key={p.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all">
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase shadow-sm ${
                          p.status === 'COMPLETED' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {p.status}
                        </span>
                        <span className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold rounded-lg">
                          {p.category}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-[#2A75FF] transition-colors line-clamp-1">
                            {p.title}
                          </h3>
                          <div className="flex items-center space-x-1 text-slate-500 text-xs mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{p.location}</span>
                          </div>
                          <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                            {p.shortDescription}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                          <span className="font-mono text-amber-600 font-bold">{p.area}</span>
                          <button
                            onClick={() => cmsStore.deleteProject(p.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SEGMENT 3: TEAM MANAGEMENT CMS ── */}
            {activeTab === 'team' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900">Leadership & Staff Directory</h3>
                    <p className="text-slate-500 text-xs">Manage management founders and engineering leaders</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {team.map((mem) => (
                    <div key={mem.id} className="p-4 rounded-2xl border border-slate-200/80 flex items-center space-x-3.5 bg-slate-50/50">
                      <img src={mem.image} alt={mem.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#2A75FF]" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{mem.name}</h4>
                        <p className="text-[#2A75FF] text-[10px] font-mono font-bold tracking-wide uppercase truncate">{mem.role}</p>
                      </div>
                      <button
                        onClick={() => cmsStore.deleteTeamMember(mem.id)}
                        className="p-1 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SEGMENT 4: SITE STATS & SETTINGS ── */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-6">
                <h3 className="font-heading font-bold text-base text-slate-900 pb-4 border-b border-slate-100">
                  Global Site Metrics & Contact Config
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Years of Experience</label>
                    <input
                      type="number"
                      value={siteSettings.experienceYears}
                      onChange={(e) => cmsStore.updateSiteSettings({ experienceYears: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Projects Executed Count</label>
                    <input
                      type="number"
                      value={siteSettings.projectsExecuted}
                      onChange={(e) => cmsStore.updateSiteSettings({ projectsExecuted: Number(e.target.value) })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Official Phone Number</label>
                    <input
                      type="text"
                      value={siteSettings.phone}
                      onChange={(e) => cmsStore.updateSiteSettings({ phone: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Official Contact Email</label>
                    <input
                      type="text"
                      value={siteSettings.email}
                      onChange={(e) => cmsStore.updateSiteSettings({ email: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── SEGMENT 5: PHP & MYSQL CODE FOR ₹99 SHARED HOSTING ── */}
            {activeTab === 'php' && (
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-heading font-bold text-base text-white">₹99 Shared Hosting Deployment Code</h3>
                    <p className="text-slate-400 text-xs">Copy these PHP API files and upload to your cPanel `public_html/api/` folder.</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono font-bold">
                    cPanel Ready
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-emerald-400 font-bold">1. MySQL Database Schema (`db_schema.sql`)</div>
                    <pre className="text-slate-300 overflow-x-auto p-3 bg-black/60 rounded-xl text-[11px] leading-relaxed">
{`CREATE TABLE inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_id VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    service_required VARCHAR(100) NOT NULL,
    area_sqft VARCHAR(50) NOT NULL,
    project_note TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                    </pre>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="text-blue-400 font-bold">2. Inquiry Endpoint (`public_html/api/enquiry.php`)</div>
                    <pre className="text-slate-300 overflow-x-auto p-3 bg-black/60 rounded-xl text-[11px] leading-relaxed">
{`<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "persqft_user";
$pass = "YOUR_DB_PASSWORD";
$dbname = "persqft_db";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) { die(json_encode(["success" => false])); }

$data = json_decode(file_get_contents("php://input"), true);
$ref = "PSQFT-" . rand(100000, 999999);

$stmt = $conn->prepare("INSERT INTO inquiries (reference_id, full_name, phone, email, service_required, area_sqft, project_note) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssss", $ref, $data['fullName'], $data['phone'], $data['email'], $data['serviceRequired'], $data['areaSqft'], $data['projectNote']);

if ($stmt->execute()) {
    // Send email alert via PHP mail() or PHPMailer
    mail("contact@persqft.com", "New Inquiry #$ref", "New lead from " . $data['fullName']);
    echo json_encode(["success" => true, "reference_id" => $ref]);
} else {
    echo json_encode(["success" => false]);
}
?>`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ── MODAL: ADD NEW PROJECT ── */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900">Add New Architectural Project</h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imperial Heritage Commercial Complex"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-4 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value as any })}
                    className="w-full px-4 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Interior">Interior</option>
                    <option value="Turnkey">Turnkey</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                    className="w-full px-4 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Location</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full px-4 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Total Area</label>
                  <input
                    type="text"
                    value={newProject.area}
                    onChange={(e) => setNewProject({ ...newProject, area: e.target.value })}
                    className="w-full px-4 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Cover Image URL</label>
                <input
                  type="text"
                  value={newProject.coverImage}
                  onChange={(e) => setNewProject({ ...newProject, coverImage: e.target.value, gallery: [e.target.value] })}
                  className="w-full px-4 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Short Summary</label>
                <textarea
                  rows={2}
                  value={newProject.shortDescription}
                  onChange={(e) => setNewProject({ ...newProject, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 mt-1 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2A75FF] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-500/20"
                >
                  Save & Publish to Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: INQUIRY DETAIL VIEW ── */}
      {selectedInquiryDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-[#2A75FF] font-bold text-xs">{selectedInquiryDetail.referenceId}</span>
                <h3 className="font-heading font-bold text-base text-slate-900">{selectedInquiryDetail.fullName}</h3>
              </div>
              <button onClick={() => setSelectedInquiryDetail(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-mono">Phone</p>
                  <p className="font-bold text-slate-800">{selectedInquiryDetail.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-mono">Email</p>
                  <p className="font-bold text-slate-800">{selectedInquiryDetail.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl">
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-mono">Required Service</p>
                  <p className="font-bold text-slate-800">{selectedInquiryDetail.serviceRequired}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] uppercase font-mono">Area Sqft</p>
                  <p className="font-bold text-amber-600">{selectedInquiryDetail.areaSqft}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl space-y-1">
                <p className="text-slate-400 text-[10px] uppercase font-mono">Project Note & Instructions</p>
                <p className="text-slate-700 leading-relaxed font-sans">{selectedInquiryDetail.projectNote}</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedInquiryDetail(null)}
                className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
