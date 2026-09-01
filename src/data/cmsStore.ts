import { PROJECTS_DATA, type Project } from './projectsData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface Inquiry {
  id: string;
  referenceId: string;
  fullName: string;
  phone: string;
  email: string;
  serviceRequired: string;
  areaSqft: string;
  projectNote: string;
  attachmentUrl?: string;
  status: 'PENDING' | 'REVIEWED' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  category: 'MANAGEMENT' | 'EMPLOYEE';
  image: string;
  highlightBadge?: string;
  tagline?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  experienceYears: number;
  projectsExecuted: number;
  locationsCovered: number;
  onTimeDeliveryPercent: number;
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-101',
    referenceId: 'PSQFT-849201',
    fullName: 'Vikramaditya Sharma',
    phone: '+91 98765 43210',
    email: 'v.sharma@gmail.com',
    serviceRequired: 'Custom Home Builds',
    areaSqft: '3,500 SQFT',
    projectNote: 'Looking to construct a 3-storey luxury villa in Golf City, Lucknow. Have initial AutoCAD floor plans ready.',
    status: 'PENDING',
    createdAt: '2026-09-01 14:32'
  },
  {
    id: 'inq-102',
    referenceId: 'PSQFT-739102',
    fullName: 'Ananya Verma',
    phone: '+91 98112 34567',
    email: 'ananya.v@realtycorp.in',
    serviceRequired: 'Commercial Projects',
    areaSqft: '25,000 SQFT',
    projectNote: 'Turnkey commercial floor construction requirement in Gomti Nagar Extension. Need site audit.',
    status: 'CONTACTED',
    createdAt: '2026-08-31 11:15'
  }
];

const INITIAL_TEAM: TeamMember[] = [
  {
    id: 1,
    name: 'Tony Stark',
    role: 'Founder & CEO',
    category: 'MANAGEMENT',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
    highlightBadge: 'FOUNDER & CEO',
    tagline: 'Architectural visionary guiding PERSQFT standards & futuristic designs.',
  },
  {
    id: 2,
    name: 'Steve Rogers',
    role: 'Co-Founder & Director',
    category: 'MANAGEMENT',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    highlightBadge: 'CO-FOUNDER',
    tagline: 'Directing structural integrity, ethics & project execution.',
  }
];

const INITIAL_SITE_SETTINGS: SiteSettings = {
  companyName: 'PERSQFT CONSTRUCTIONS',
  tagline: 'Architectural Excellence & Structural Precision',
  phone: '+91 98765 43210',
  email: 'contact@persqft.com',
  address: 'Level 4, Skyline Pinnacle Tower, Gomti Nagar Extension, Lucknow, UP',
  experienceYears: 10,
  projectsExecuted: 150,
  locationsCovered: 25,
  onTimeDeliveryPercent: 100,
};

type Listener = () => void;

class CmsStore {
  private projects: Project[] = [];
  private inquiries: Inquiry[] = [];
  private team: TeamMember[] = [];
  private siteSettings: SiteSettings = INITIAL_SITE_SETTINGS;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
    if (isSupabaseConfigured) {
      this.syncFromSupabase();
    }
  }

  private loadFromStorage() {
    try {
      const storedProjects = localStorage.getItem('persqft_projects');
      this.projects = storedProjects ? JSON.parse(storedProjects) : PROJECTS_DATA;

      const storedInquiries = localStorage.getItem('persqft_inquiries');
      this.inquiries = storedInquiries ? JSON.parse(storedInquiries) : INITIAL_INQUIRIES;

      const storedTeam = localStorage.getItem('persqft_team');
      this.team = storedTeam ? JSON.parse(storedTeam) : INITIAL_TEAM;

      const storedSettings = localStorage.getItem('persqft_settings');
      this.siteSettings = storedSettings ? JSON.parse(storedSettings) : INITIAL_SITE_SETTINGS;
    } catch {
      this.projects = PROJECTS_DATA;
      this.inquiries = INITIAL_INQUIRIES;
      this.team = INITIAL_TEAM;
      this.siteSettings = INITIAL_SITE_SETTINGS;
    }
  }

  private async syncFromSupabase() {
    if (!supabase) return;
    try {
      const { data: inqData } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (inqData && inqData.length > 0) {
        this.inquiries = inqData.map((d: any) => ({
          id: d.id,
          referenceId: d.reference_id,
          fullName: d.full_name,
          phone: d.phone,
          email: d.email,
          serviceRequired: d.service_required,
          areaSqft: d.area_sqft,
          projectNote: d.project_note,
          status: d.status,
          createdAt: d.created_at
        }));
      }

      const { data: projData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projData && projData.length > 0) {
        this.projects = projData.map((d: any) => ({
          id: d.id,
          slug: d.slug,
          title: d.title,
          location: d.location,
          category: d.category,
          status: d.status,
          progress: d.progress,
          year: d.year,
          client: d.client,
          area: d.area,
          coverImage: d.cover_image,
          gallery: d.gallery || [d.cover_image],
          shortDescription: d.short_description,
          description: d.description,
          features: d.features || []
        }));
      }

      const { data: teamData } = await supabase.from('team').select('*').order('id', { ascending: true });
      if (teamData && teamData.length > 0) {
        this.team = teamData.map((d: any) => ({
          id: d.id,
          name: d.name,
          role: d.role,
          category: d.category,
          image: d.image,
          highlightBadge: d.highlight_badge,
          tagline: d.tagline
        }));
      }

      this.saveToStorage();
    } catch (err) {
      console.warn('Supabase sync warning:', err);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('persqft_projects', JSON.stringify(this.projects));
      localStorage.setItem('persqft_inquiries', JSON.stringify(this.inquiries));
      localStorage.setItem('persqft_team', JSON.stringify(this.team));
      localStorage.setItem('persqft_settings', JSON.stringify(this.siteSettings));
    } catch (e) {
      console.error('Storage save error:', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // --- PROJECTS ---
  public getProjects(): Project[] {
    return this.projects;
  }

  public async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`
    };
    this.projects = [newProj, ...this.projects];
    this.saveToStorage();

    if (supabase) {
      await supabase.from('projects').insert({
        id: newProj.id,
        slug: newProj.slug,
        title: newProj.title,
        location: newProj.location,
        category: newProj.category,
        status: newProj.status,
        progress: newProj.progress,
        year: newProj.year,
        client: newProj.client,
        area: newProj.area,
        cover_image: newProj.coverImage,
        short_description: newProj.shortDescription,
        description: newProj.description,
        features: newProj.features
      });
    }

    return newProj;
  }

  public async updateProject(id: string, updated: Partial<Project>) {
    this.projects = this.projects.map((p) => (p.id === id ? { ...p, ...updated } : p));
    this.saveToStorage();

    if (supabase) {
      await supabase.from('projects').update(updated).eq('id', id);
    }
  }

  public async deleteProject(id: string) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.saveToStorage();

    if (supabase) {
      await supabase.from('projects').delete().eq('id', id);
    }
  }

  // --- INQUIRIES ---
  public getInquiries(): Inquiry[] {
    return this.inquiries;
  }

  public async addInquiry(data: Omit<Inquiry, 'id' | 'referenceId' | 'status' | 'createdAt'>): Promise<Inquiry> {
    const randomRef = `PSQFT-${Math.floor(100000 + Math.random() * 900000)}`;
    const createdAtStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newInq: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      referenceId: randomRef,
      status: 'PENDING',
      createdAt: createdAtStr
    };
    this.inquiries = [newInq, ...this.inquiries];
    this.saveToStorage();

    if (supabase) {
      await supabase.from('inquiries').insert({
        id: newInq.id,
        reference_id: newInq.referenceId,
        full_name: newInq.fullName,
        phone: newInq.phone,
        email: newInq.email,
        service_required: newInq.serviceRequired,
        area_sqft: newInq.areaSqft,
        project_note: newInq.projectNote,
        status: newInq.status,
        created_at: newInq.createdAt
      });
    }

    return newInq;
  }

  public async updateInquiryStatus(id: string, status: Inquiry['status']) {
    this.inquiries = this.inquiries.map((i) => (i.id === id ? { ...i, status } : i));
    this.saveToStorage();

    if (supabase) {
      await supabase.from('inquiries').update({ status }).eq('id', id);
    }
  }

  public async deleteInquiry(id: string) {
    this.inquiries = this.inquiries.filter((i) => i.id !== id);
    this.saveToStorage();

    if (supabase) {
      await supabase.from('inquiries').delete().eq('id', id);
    }
  }

  // --- TEAM ---
  public getTeam(): TeamMember[] {
    return this.team;
  }

  public async addTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    const newMem: TeamMember = {
      ...member,
      id: Date.now()
    };
    this.team = [...this.team, newMem];
    this.saveToStorage();

    if (supabase) {
      await supabase.from('team').insert({
        id: newMem.id,
        name: newMem.name,
        role: newMem.role,
        category: newMem.category,
        image: newMem.image,
        highlight_badge: newMem.highlightBadge,
        tagline: newMem.tagline
      });
    }

    return newMem;
  }

  public async deleteTeamMember(id: number) {
    this.team = this.team.filter((m) => m.id !== id);
    this.saveToStorage();

    if (supabase) {
      await supabase.from('team').delete().eq('id', id);
    }
  }

  // --- SITE SETTINGS ---
  public getSiteSettings(): SiteSettings {
    return this.siteSettings;
  }

  public updateSiteSettings(settings: Partial<SiteSettings>) {
    this.siteSettings = { ...this.siteSettings, ...settings };
    this.saveToStorage();
  }

  // --- RESET ALL ---
  public resetToDefaults() {
    this.projects = PROJECTS_DATA;
    this.inquiries = INITIAL_INQUIRIES;
    this.team = INITIAL_TEAM;
    this.siteSettings = INITIAL_SITE_SETTINGS;
    this.saveToStorage();
  }
}

export const cmsStore = new CmsStore();
