import { PROJECTS_DATA, type Project } from './projectsData';


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
  },
  {
    id: 'inq-103',
    referenceId: 'PSQFT-628491',
    fullName: 'Dr. R. K. Singhania',
    phone: '+91 94150 99881',
    email: 'dr.singhania@apollo.org',
    serviceRequired: 'Renovation & Remodeling',
    areaSqft: '4,200 SQFT',
    projectNote: 'Complete structural interior remodeling of existing bungalow in Civil Lines.',
    status: 'REVIEWED',
    createdAt: '2026-08-29 09:45'
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
  },
  {
    id: 3,
    name: 'Nick Fury',
    role: 'Co-Founder & Operations',
    category: 'MANAGEMENT',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    highlightBadge: 'CO-FOUNDER',
    tagline: 'Leading strategic operations and turnkey execution.',
  },
  {
    id: 4,
    name: 'Bruce Banner',
    role: 'Lead Structural Engineer',
    category: 'EMPLOYEE',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
    tagline: 'Specialist in heavy RCC foundations & load-bearing analysis.',
  },
  {
    id: 5,
    name: 'Peter Parker',
    role: 'Junior Civil Engineer',
    category: 'EMPLOYEE',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop',
    tagline: 'Managing site execution & high-precision structural blueprints.',
  },
  {
    id: 6,
    name: 'Natasha Romanoff',
    role: 'Project Head & Safety',
    category: 'EMPLOYEE',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    tagline: 'Overseeing site safety, compliance, and quality control.',
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

  public addProject(project: Omit<Project, 'id'>): Project {
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}`
    };
    this.projects = [newProj, ...this.projects];
    this.saveToStorage();
    return newProj;
  }

  public updateProject(id: string, updated: Partial<Project>) {
    this.projects = this.projects.map((p) => (p.id === id ? { ...p, ...updated } : p));
    this.saveToStorage();
  }

  public deleteProject(id: string) {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.saveToStorage();
  }

  // --- INQUIRIES ---
  public getInquiries(): Inquiry[] {
    return this.inquiries;
  }

  public addInquiry(data: Omit<Inquiry, 'id' | 'referenceId' | 'status' | 'createdAt'>): Inquiry {
    const randomRef = `PSQFT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newInq: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      referenceId: randomRef,
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    this.inquiries = [newInq, ...this.inquiries];
    this.saveToStorage();
    return newInq;
  }

  public updateInquiryStatus(id: string, status: Inquiry['status']) {
    this.inquiries = this.inquiries.map((i) => (i.id === id ? { ...i, status } : i));
    this.saveToStorage();
  }

  public deleteInquiry(id: string) {
    this.inquiries = this.inquiries.filter((i) => i.id !== id);
    this.saveToStorage();
  }

  // --- TEAM ---
  public getTeam(): TeamMember[] {
    return this.team;
  }

  public addTeamMember(member: Omit<TeamMember, 'id'>): TeamMember {
    const newMem: TeamMember = {
      ...member,
      id: Date.now()
    };
    this.team = [...this.team, newMem];
    this.saveToStorage();
    return newMem;
  }

  public deleteTeamMember(id: number) {
    this.team = this.team.filter((m) => m.id !== id);
    this.saveToStorage();
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
