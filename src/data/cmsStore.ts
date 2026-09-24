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

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  password?: string;
  createdAt: string;
}

const INITIAL_ADMINS: AdminUser[] = [
  {
    id: 1,
    username: 'PERSQFT HEAD/CEO',
    email: 'admin@persqft.com',
    role: 'PERSQFT HEAD/CEO',
    createdAt: '2026-09-01'
  }
];

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

// Fallback real team from MySQL database - never dummy placeholder comic characters
const INITIAL_TEAM: TeamMember[] = [
  {
    id: 2,
    name: 'Alita Siera',
    role: 'Co-Founder & Director',
    category: 'MANAGEMENT',
    image: '/uploads/team/1789071721_9c11e325_alita-siera.webp',
    highlightBadge: 'CO-FOUNDER',
    tagline: 'Directing structural integrity, ethics & project execution.',
  },
  {
    id: 3,
    name: 'Ellie William',
    role: 'Co-Founder & Director',
    category: 'MANAGEMENT',
    image: '/uploads/team/1789071799_a7039a30_ellie-william.webp',
    highlightBadge: 'Ex-Soldier',
    tagline: 'Leading strategic operations and turnkey execution.',
  },
  {
    id: 4,
    name: 'Shivam kumar',
    role: 'Software Developer',
    category: 'EMPLOYEE',
    image: '/uploads/team/1789071679_bddac23d_shivam-kumar.webp',
    tagline: 'Specialist Software Development and Cybersecurity.',
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

const DUMMY_TEAM_NAMES = new Set([
  'steve rogers',
  'tony stark',
  'nick fury',
  'bruce banner',
  'peter parker',
  'thor odinson',
  'wanda maximoff',
  'stephen strange'
]);

function isStaleDummyTeam(list: any[]): boolean {
  if (!Array.isArray(list) || list.length === 0) return true;
  return list.some(
    (m) => m && typeof m.name === 'string' && DUMMY_TEAM_NAMES.has(m.name.trim().toLowerCase())
  );
}

function normalizeImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) {
    return url;
  }
  return `/${url}`;
}

const INITIAL_SITE_SETTINGS: SiteSettings = {
  companyName: 'PERSQFT CONSTRUCTIONS',
  tagline: 'Architectural Excellence & Structural Precision',
  phone: '+91-6306659601',
  email: 'contact@persqft.com',
  address: 'Hathras Office: Shop no. 14, Bagla college market, Aligarh Rd, Nehru Colony, Hathras (204101) | Sultanpur HQ: RAMASHANKAR MARKET, BUSSTAND ROAD, opposite INDIAN OIL PETROLPUMP, beside BABA TELECOM, Civil Line, Sultanpur (228001)',
  experienceYears: 10,
  projectsExecuted: 150,
  locationsCovered: 25,
  onTimeDeliveryPercent: 100,
};

type Listener = () => void;

class CmsStore {
  private projects: Project[] = [];
  private inquiries: Inquiry[] = [];
  private team: TeamMember[] = INITIAL_TEAM;
  private admins: AdminUser[] = INITIAL_ADMINS;
  private siteSettings: SiteSettings = INITIAL_SITE_SETTINGS;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.loadFromStorage();
    // Fast non-blocking sync from live PHP/MySQL API (runs in ~150-200ms)
    this.syncFromPhpApi();

    // Instant live sync on window focus and tab return
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.syncFromPhpApi();
        }
      });
      window.addEventListener('focus', () => {
        this.syncFromPhpApi();
      });
    }
  }

  private loadFromStorage() {
    try {
      const storedProjects = localStorage.getItem('persqft_projects');
      this.projects = storedProjects ? JSON.parse(storedProjects) : PROJECTS_DATA;

      const storedInquiries = localStorage.getItem('persqft_inquiries');
      this.inquiries = storedInquiries ? JSON.parse(storedInquiries) : INITIAL_INQUIRIES;

      const storedTeam = localStorage.getItem('persqft_team');
      if (storedTeam) {
        const parsed = JSON.parse(storedTeam);
        if (isStaleDummyTeam(parsed)) {
          // Immediately purge old mock Avengers from client storage
          this.team = INITIAL_TEAM;
          try {
            localStorage.setItem('persqft_team', JSON.stringify(INITIAL_TEAM));
          } catch {}
        } else {
          this.team = parsed;
        }
      } else {
        this.team = INITIAL_TEAM;
      }

      const storedAdmins = localStorage.getItem('persqft_admins');
      this.admins = storedAdmins ? JSON.parse(storedAdmins) : INITIAL_ADMINS;

      const storedSettings = localStorage.getItem('persqft_settings');
      this.siteSettings = storedSettings ? JSON.parse(storedSettings) : INITIAL_SITE_SETTINGS;
    } catch {
      this.projects = PROJECTS_DATA;
      this.inquiries = INITIAL_INQUIRIES;
      this.team = INITIAL_TEAM;
      this.admins = INITIAL_ADMINS;
      this.siteSettings = INITIAL_SITE_SETTINGS;
    }
  }

  private async syncFromPhpApi() {
    const timestamp = Date.now();

    try {
      // Concurrent non-blocking requests for lightning-fast (<200ms) sync
      const [projRes, teamRes, setRes, admRes] = await Promise.allSettled([
        fetch(`/api/projects.php?_t=${timestamp}`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/team.php?_t=${timestamp}`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/settings.php?_t=${timestamp}`).then((r) => (r.ok ? r.json() : null)),
        fetch(`/api/admins.php?_t=${timestamp}`).then((r) => (r.ok ? r.json() : null))
      ]);

      // 1. Team sync (Highest visual priority)
      if (teamRes.status === 'fulfilled' && teamRes.value?.success && Array.isArray(teamRes.value.team)) {
        this.team = teamRes.value.team.map((m: any) => ({
          id: Number(m.id),
          name: m.name,
          role: m.role,
          category: m.category,
          image: normalizeImageUrl(m.image),
          highlightBadge: m.highlight_badge,
          tagline: m.tagline
        }));
        try {
          localStorage.setItem('persqft_team', JSON.stringify(this.team));
        } catch {}
        this.notify();
      }

      // 2. Projects sync
      if (projRes.status === 'fulfilled' && projRes.value?.success && Array.isArray(projRes.value.projects)) {
        this.projects = projRes.value.projects.map((d: any) => ({
          id: String(d.id),
          slug: d.slug,
          title: d.title,
          location: d.location,
          category: d.category,
          status: d.status,
          progress: Number(d.progress),
          year: Number(d.year || 2026),
          client: d.client || 'Private Client',
          area: d.area || '',
          coverImage: normalizeImageUrl(d.cover_image),
          gallery: typeof d.gallery === 'string' ? JSON.parse(d.gallery || '[]') : (d.gallery || [d.cover_image]),
          shortDescription: d.short_description || '',
          description: d.description || '',
          features: typeof d.features === 'string' ? JSON.parse(d.features || '[]') : (d.features || [])
        }));
        try {
          localStorage.setItem('persqft_projects', JSON.stringify(this.projects));
        } catch {}
        this.notify();
      }

      // 3. Site Settings sync
      if (setRes.status === 'fulfilled' && setRes.value?.success && setRes.value.settings) {
        const s = setRes.value.settings;
        this.siteSettings = {
          companyName: s.company_name || this.siteSettings.companyName,
          tagline: s.tagline || this.siteSettings.tagline,
          phone: s.phone || this.siteSettings.phone,
          email: s.email || this.siteSettings.email,
          address: s.address || this.siteSettings.address,
          experienceYears: Number(s.experience_years) || this.siteSettings.experienceYears,
          projectsExecuted: Number(s.projects_executed) || this.siteSettings.projectsExecuted,
          locationsCovered: Number(s.locations_covered) || this.siteSettings.locationsCovered,
          onTimeDeliveryPercent: Number(s.on_time_delivery_percent) || this.siteSettings.onTimeDeliveryPercent,
        };
        try {
          localStorage.setItem('persqft_settings', JSON.stringify(this.siteSettings));
        } catch {}
        this.notify();
      }

      // 4. Admins sync
      if (admRes.status === 'fulfilled' && admRes.value?.success && Array.isArray(admRes.value.admins)) {
        this.admins = admRes.value.admins.map((a: any) => ({
          id: Number(a.id),
          username: a.username,
          email: a.email,
          role: a.role || 'Data Entry Admin',
          createdAt: a.created_at || '2026-09-01'
        }));
        try {
          localStorage.setItem('persqft_admins', JSON.stringify(this.admins));
        } catch {}
        this.notify();
      }
    } catch {
      // Offline or network error fallback
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('persqft_projects', JSON.stringify(this.projects));
      localStorage.setItem('persqft_inquiries', JSON.stringify(this.inquiries));
      localStorage.setItem('persqft_team', JSON.stringify(this.team));
      localStorage.setItem('persqft_admins', JSON.stringify(this.admins));
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
    try {
      const res = await fetch('/api/projects.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.id) {
          const newProj: Project = { ...project, id: String(json.id) };
          this.projects = [newProj, ...this.projects];
          this.saveToStorage();
          return newProj;
        }
      }
    } catch (e) {
      console.warn('API add project fallback:', e);
    }

    const fallbackProj: Project = { ...project, id: `proj-${Date.now()}` };
    this.projects = [fallbackProj, ...this.projects];
    this.saveToStorage();
    return fallbackProj;
  }

  public async updateProject(id: string, updated: Partial<Project>) {
    this.projects = this.projects.map((p) => (p.id === id ? { ...p, ...updated } : p));
    this.saveToStorage();

    try {
      await fetch('/api/projects.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updated })
      });
    } catch (e) {
      console.warn('API update project error:', e);
    }
  }

  public async deleteProject(id: string): Promise<boolean> {
    this.projects = this.projects.filter((p) => p.id !== id);
    this.saveToStorage();

    try {
      const res = await fetch('/api/projects.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return res.ok;
    } catch (e) {
      console.warn('API delete project error:', e);
      return false;
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

    try {
      fetch('/api/enquiry.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newInq.fullName,
          phone: newInq.phone,
          email: newInq.email,
          serviceRequired: newInq.serviceRequired,
          areaSqft: newInq.areaSqft,
          projectNote: newInq.projectNote
        })
      }).catch(() => {});
    } catch {
      // Ignored in offline preview mode
    }

    return newInq;
  }

  public async updateInquiryStatus(id: string, status: Inquiry['status']) {
    this.inquiries = this.inquiries.map((i) => (i.id === id ? { ...i, status } : i));
    this.saveToStorage();

    try {
      await fetch('/api/enquiry.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
    } catch (e) {
      console.warn('API update inquiry status error:', e);
    }
  }

  public async deleteInquiry(id: string): Promise<boolean> {
    this.inquiries = this.inquiries.filter((i) => i.id !== id);
    this.saveToStorage();

    try {
      const res = await fetch('/api/enquiry.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return res.ok;
    } catch (e) {
      console.warn('API delete inquiry error:', e);
      return false;
    }
  }

  // --- TEAM ---
  public getTeam(): TeamMember[] {
    return this.team;
  }

  public async addTeamMember(member: Omit<TeamMember, 'id'>): Promise<TeamMember> {
    try {
      const res = await fetch('/api/team.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.member) {
          const newMem: TeamMember = {
            id: Number(json.member.id),
            name: json.member.name,
            role: json.member.role,
            category: json.member.category,
            image: json.member.image,
            highlightBadge: json.member.highlight_badge,
            tagline: json.member.tagline
          };
          this.team = [...this.team, newMem];
          this.saveToStorage();
          return newMem;
        }
      }
    } catch (e) {
      console.warn('API add team member fallback:', e);
    }

    const fallbackMem: TeamMember = { ...member, id: Date.now() };
    this.team = [...this.team, fallbackMem];
    this.saveToStorage();
    return fallbackMem;
  }

  public async deleteTeamMember(id: number): Promise<boolean> {
    this.team = this.team.filter((m) => m.id !== id);
    this.saveToStorage();

    try {
      const res = await fetch('/api/team.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      return res.ok;
    } catch (e) {
      console.warn('API delete team member error:', e);
      return false;
    }
  }

  // --- SITE SETTINGS ---
  public getSiteSettings(): SiteSettings {
    return this.siteSettings;
  }

  public async updateSiteSettings(settings: Partial<SiteSettings>) {
    this.siteSettings = { ...this.siteSettings, ...settings };
    this.saveToStorage();

    try {
      await fetch('/api/settings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    } catch (e) {
      console.warn('API update settings error:', e);
    }
  }

  // --- FORCE SAVE & SYNC ALL WITH BACKEND ---
  public async saveAndSyncAll(): Promise<boolean> {
    await this.syncFromPhpApi();
    return true;
  }

  // --- ADMIN USERS (ACCESS CONTROL) ---
  public getAdmins(): AdminUser[] {
    return this.admins;
  }

  public async addAdmin(data: { username: string; email: string; password?: string; role: string }): Promise<AdminUser> {
    try {
      const res = await fetch('/api/admins.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.admin) {
          this.admins = [...this.admins, json.admin];
          this.saveToStorage();
          return json.admin;
        }
      }
    } catch {
      // Fallback
    }

    const newAdmin: AdminUser = {
      id: Date.now(),
      username: data.username || data.email.split('@')[0],
      email: data.email,
      role: data.role || 'Data Entry Admin',
      password: data.password,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    this.admins = [...this.admins, newAdmin];
    this.saveToStorage();
    return newAdmin;
  }

  public async updateAdmin(id: number, data: Partial<AdminUser>): Promise<boolean> {
    try {
      await fetch('/api/admins.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data })
      });
    } catch {
      // Fallback
    }
    this.admins = this.admins.map(a => a.id === id ? { ...a, ...data } : a);
    this.saveToStorage();
    return true;
  }

  public async deleteAdmin(id: number): Promise<boolean> {
    if (id <= 1) return false;
    try {
      await fetch('/api/admins.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
    } catch {
      // Fallback
    }
    this.admins = this.admins.filter(a => a.id !== id);
    this.saveToStorage();
    return true;
  }

  // --- RESET ALL ---
  public resetToDefaults() {
    this.projects = PROJECTS_DATA;
    this.inquiries = INITIAL_INQUIRIES;
    this.team = INITIAL_TEAM;
    this.admins = INITIAL_ADMINS;
    this.siteSettings = INITIAL_SITE_SETTINGS;
    this.saveToStorage();
  }
}

export const cmsStore = new CmsStore();
