export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: 'Residential' | 'Commercial' | 'Architecture' | 'Interior' | 'Turnkey';
  status: 'ONGOING' | 'COMPLETED';
  progress: number;
  year: number;
  client: string;
  area: string;
  coverImage: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  features: string[];
  videoUrl?: string;
}

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-01',
    slug: 'skyline-pinnacle-tower',
    title: 'Skyline Pinnacle Commercial Tower',
    location: 'Gomti Nagar Extension, Lucknow',
    category: 'Commercial',
    status: 'ONGOING',
    progress: 78,
    year: 2026,
    client: 'Apex Global Enterprises',
    area: '125,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: '18-storey ultra-modern commercial high-rise with earthquake-resistant post-tensioned slab superstructure.',
    description: 'Skyline Pinnacle Commercial Tower represents a milestone in modern commercial execution. Designed with structural integrity at its core, this 18-storey commercial landmark features high-performance glass curtain facades, custom seismic dampers, integrated HVAC tunnels, and 4 subterranean parking levels.',
    features: [
      'Post-Tensioned Structural Concrete Core',
      'Double-Glazed Low-E Architectural Curtain Wall',
      'BREEAM Gold Sustainable Energy Efficiency',
      'Automated Building Management System (BMS)',
      'High-Speed Regenerative Elevator Core'
    ]
  },
  {
    id: 'proj-02',
    slug: 'the-glasshouse-estate',
    title: 'The Glasshouse Modern Estate',
    location: 'Golf City, Lucknow',
    category: 'Residential',
    status: 'COMPLETED',
    progress: 100,
    year: 2025,
    client: 'Private Luxury Residence',
    area: '18,500 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'High-end cantilevered minimalist residence crafted with exposed architectural concrete, steel, and thermal glass.',
    description: 'An architectural marvel blending seamless indoor-outdoor living with structural audacity. The Glasshouse Estate features a dramatic 12-meter cantilevered upper deck suspended over an infinity reflection pool, precision-engineered thermal insulation, and custom smart automation throughout.',
    features: [
      '12m Suspended Structural Steel Cantilever',
      'Off-Form Architectural Board-Marked Concrete',
      'Full-Height Floor-to-Ceiling Motorized Glazing',
      'Geothermal Hydronic Radiant Floor System',
      'Custom Millwork & Italian Travertine Finishes'
    ]
  },
  {
    id: 'proj-03',
    slug: 'aethelgard-tech-park',
    title: 'Aethelgard Innovation Tech Park',
    location: 'IT City, Lucknow',
    category: 'Turnkey',
    status: 'ONGOING',
    progress: 64,
    year: 2026,
    client: 'Aethelgard Infrastructure Ltd.',
    area: '210,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Turnkey multi-tenant technology campus with smart energy micro-grid and prefabricated modular steel frameworks.',
    description: 'Built for fast-track delivery, Aethelgard Tech Park integrates state-of-the-art off-site steel fabrication with structural modular construction. The campus accommodates 4,000 tech professionals with zero carbon-footprint design directives.',
    features: [
      'Turnkey Project Delivery in 14 Months',
      'Heavy Structural Prefabricated Steel Truss Work',
      'Solar Photovoltaic Integrated Canopy',
      'Acoustic Damping Slab Insulation',
      'Integrated Fiber & Power Trench Grids'
    ]
  },
  {
    id: 'proj-04',
    slug: 'vanguard-penthouse-villa',
    title: 'Vanguard Villa & Duplex Residence',
    location: 'Civil Lines, Lucknow',
    category: 'Architecture',
    status: 'COMPLETED',
    progress: 100,
    year: 2025,
    client: 'Private Client',
    area: '14,200 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Contemporary sculptural residence with perforated copper facade screens and subterranean private gallery.',
    description: 'Designed as a living architectural sculpture, Vanguard Villa features bespoke copper louvers that dynamically adjust according to solar incidence, balancing climate thermal efficiency with complete visual privacy.',
    features: [
      'Custom Anodized Perforated Copper Skins',
      'Double-Height Central Skylight Atrium',
      'Reinforced Subterranean Concrete Vault',
      'Custom Brass & Terrazzo Interior Craftsmanship'
    ]
  },
  {
    id: 'proj-05',
    slug: 'monolith-corporate-hq',
    title: 'Monolith Logistics & Corporate HQ',
    location: 'Transport Nagar, Lucknow',
    category: 'Commercial',
    status: 'COMPLETED',
    progress: 100,
    year: 2024,
    client: 'Monolith Global Supply Chain',
    area: '85,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Heavy-duty industrial corporate headquarters featuring ultra-flat post-tensioned floors and heavy crane gantries.',
    description: 'Engineered for high load-bearing capacity, Monolith Corporate HQ combines administrative elegance with industrial power. Features ultra-flat concrete slabs engineered to 2mm flatness tolerances across 85,000 sqft.',
    features: [
      'Laser-Screed Superflat Industrial Slabs',
      'Heavy-Duty Overhead Gantry Frame Support',
      'Insulated Sandwich Panel Roofing System',
      'High-Durability Epoxy Polymer Flooring'
    ]
  },
  {
    id: 'proj-06',
    slug: 'zenith-eco-residence',
    title: 'Zenith Organic Luxury Residence',
    location: 'Shaheed Path, Lucknow',
    category: 'Interior',
    status: 'ONGOING',
    progress: 91,
    year: 2026,
    client: 'Dr. V. K. Singhania',
    area: '9,800 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Bespoke interior architectural execution featuring zero-VOC materials, lime plaster finishes, and custom joinery.',
    description: 'Zenith Eco-Residence is an exploration of quiet luxury and biological harmony. Our team executed full interior turn-key detailing, incorporating raw limestone walls, hand-burnished Tadelakt plasters, solid white oak joinery, and concealed magnetic illumination.',
    features: [
      'Natural Tadelakt & Lime Plaster Wall Coatings',
      'Solid FSC-Certified European White Oak Woodwork',
      'Concealed Architectural Magnetic Track Lighting',
      'Acoustic Cork Structural Underlayments'
    ]
  },
  {
    id: 'proj-07',
    slug: 'spire-horizon-towers',
    title: 'Spire Horizon Twin Towers',
    location: 'Sushant Golf City, Lucknow',
    category: 'Commercial',
    status: 'ONGOING',
    progress: 85,
    year: 2026,
    client: 'Horizon Realty Group',
    area: '175,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Twin 22-storey commercial towers with structural skybridge and aerodynamically optimized glass facade.',
    description: 'Spire Horizon Twin Towers features a central structural skybridge connecting two 22-storey towers at the 14th floor level. Engineered with tuned mass dampers and smart HVAC energy recovery systems.',
    features: [
      'Structural Skybridge Steel Connection',
      'Tuned Mass Damper Seismic Protection',
      'Helipad Concrete Deck Reinforcement',
      'Smart Glass Thermal Insulation'
    ]
  },
  {
    id: 'proj-08',
    slug: 'aura-sky-luxury-residences',
    title: 'Aura Sky Penthouse Residences',
    location: 'Mahanagar, Lucknow',
    category: 'Residential',
    status: 'COMPLETED',
    progress: 100,
    year: 2025,
    client: 'Aura Living Developers',
    area: '32,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Ultra-exclusive residential enclave with private rooftop lap pools and smart climate glass pods.',
    description: 'Aura Sky Penthouse Residences combines bold cantilevered pool structures with Italian travertine stone facades and soundproofed floor slabs for ultimate luxury living.',
    features: [
      'Suspended Rooftop Lap Pool',
      'Italian Travertine Cladding Slabs',
      'Soundproofed Multi-Layer Floor Core',
      'Private Express Elevators'
    ]
  },
  {
    id: 'proj-09',
    slug: 'luminary-corporate-park',
    title: 'Luminary Corporate Park',
    location: 'Hazratganj, Lucknow',
    category: 'Turnkey',
    status: 'ONGOING',
    progress: 45,
    year: 2026,
    client: 'Luminary Holdings',
    area: '140,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'State-of-the-art office hub with integrated solar louver facade and subterranean multi-level parking.',
    description: 'Designed for corporate excellence, Luminary Corporate Park features pre-stressed concrete columns, high-speed fiber conduits, and automated building management systems.',
    features: [
      'Pre-stressed High-Strength Concrete Columns',
      'Solar Louver Sun-Shading System',
      'Subterranean 3-Level Automated Parking',
      'Zero-VOC Interior Air Filtration'
    ]
  },
  {
    id: 'proj-10',
    slug: 'the-verdant-eco-villas',
    title: 'The Verdant Eco Villas',
    location: 'Vipul Khand, Lucknow',
    category: 'Architecture',
    status: 'COMPLETED',
    progress: 100,
    year: 2024,
    client: 'Verdant Green Homes',
    area: '24,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Sustainable luxury villas crafted with rammed earth walls, solar roofs, and rainwater harvesting grids.',
    description: 'The Verdant Eco Villas merge biophilic design with structural durability. Built using local stabilizing earth mixes and high-performance timber structural frames.',
    features: [
      'Stabilized Rammed Earth Thermal Walls',
      'Integrated Rainwater Filtration Grid',
      'FSC-Certified Glulam Beams',
      'Passive Solar Heating Layout'
    ]
  },
  {
    id: 'proj-11',
    slug: 'metropolis-trade-center',
    title: 'Metropolis Trade Center',
    location: 'Alambagh, Lucknow',
    category: 'Commercial',
    status: 'ONGOING',
    progress: 68,
    year: 2026,
    client: 'Metropolis Corp',
    area: '190,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Multi-use retail and corporate complex with steel truss glass atrium and high-capacity loading bays.',
    description: 'Engineered for high daily pedestrian traffic, Metropolis Trade Center features a massive 30-meter clear-span steel frame atrium, heavy-load floor plates, and central HVAC plant.',
    features: [
      '30m Structural Steel Clear-Span Atrium',
      'Heavy-Load Logistics Loading Bays',
      'Centralized Chilled Water HVAC Plant',
      'Full Fire Suppression Sprinklers'
    ]
  },
  {
    id: 'proj-12',
    slug: 'apex-sky-atrium-plaza',
    title: 'Apex Sky Atrium & Plaza',
    location: 'Cantt Road, Lucknow',
    category: 'Turnkey',
    status: 'COMPLETED',
    progress: 100,
    year: 2025,
    client: 'Apex Group',
    area: '95,000 SQFT',
    coverImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop'
    ],
    shortDescription: 'Civic corporate plaza featuring illuminated glass elevators and subterranean auditorium.',
    description: 'Apex Sky Atrium & Plaza is a civic architectural masterpiece featuring a subterranean 500-seat acoustic auditorium and a glass-enclosed panoramic elevator core.',
    features: [
      'Subterranean 500-Seat Acoustic Auditorium',
      'Panoramic Hydraulic Glass Elevators',
      'Polished Granite Plaza Landscaping',
      'Seismic Base Isolation Dampers'
    ]
  }
];

export const COMPANY_STATS = [
  { value: 10, label: 'YEARS OF EXPERIENCE', suffix: '+' },
  { value: 150, label: 'PROJECTS EXECUTED', suffix: '+' },
  { value: 25, label: 'LOCATIONS COVERED', suffix: '+' },
  { value: 100, label: 'ON-TIME DELIVERY', suffix: '%' }
];

export const SERVICES_DATA = [
  {
    id: '01',
    title: 'Custom Home Builds',
    shortDesc: 'End-to-end bespoke luxury home construction tailored to your lifestyle, crafted with structural precision.',
    fullDesc: 'From site excavation to structural concrete, custom architectural facades, and interior finishing. We deliver high-performance luxury residences built to last generations.',
    icon: 'Home',
    tagline: ['Trusted', 'Tailored', 'Delivered'],
    color: 'emerald',
    highlights: ['Bespoke Architectural Design', 'Seismic Concrete Framing', 'Turnkey Construction', 'Smart Home Integration']
  },
  {
    id: '02',
    title: 'Home Extensions',
    shortDesc: 'Seamless vertical and horizontal home additions engineered to blend flawlessly with existing structures.',
    fullDesc: 'Add extra living space, multi-car garages, or additional floors to your property with structural load calculations, steel beam insertion, and matching architectural facades.',
    icon: 'ArrowUpRight',
    tagline: ['Expand', 'Enhance', 'Elevate'],
    color: 'amber',
    highlights: ['Vertical Floor Additions', 'Structural Beam Retrofitting', 'Seamless Facade Matching', 'Zero-Disruption Site Plan']
  },
  {
    id: '03',
    title: 'Renovation & Remodeling',
    shortDesc: 'Complete structural modernizations, interior overhauls, and facade transformations for aging properties.',
    fullDesc: 'Breathe new life into residential and commercial buildings. We execute carbon-fiber column wrapping, interior wall removals, luxury marble laying, and HVAC system upgrades.',
    icon: 'RefreshCw',
    tagline: ['Restore', 'Reimagine', 'Reinvent'],
    color: 'rose',
    highlights: ['Structural Wall Removal', 'Facade Modernization', 'Luxury Interior Refit', 'Energy-Efficient Insulation']
  },
  {
    id: '04',
    title: 'Real Estate Development',
    shortDesc: 'High-yield residential plotting, group housing developments, and land asset optimization.',
    fullDesc: 'From feasibility studies and municipal zoning approvals to heavy infrastructure development, drainage networks, and high-density residential community builds.',
    icon: 'HardHat',
    tagline: ['Invest', 'Innovate', 'Build Smart'],
    color: 'blue',
    highlights: ['Land Feasibility Audits', 'Zoning & Municipal Permits', 'Infrastructure Grid Setup', 'Smart Community Planning']
  },
  {
    id: '05',
    title: 'Landscaping & Exteriors',
    shortDesc: 'Curated exterior hardscaping, swimming pools, perimeter boundary walls, and biophilic gardens.',
    fullDesc: 'Enhance curb appeal and outdoor leisure space. We construct reinforced travertine decks, infinity reflection pools, subterranean lighting grids, and weather-resistant gazebos.',
    icon: 'Trees',
    tagline: ['Beautify', 'Structure', 'Impress'],
    color: 'green',
    highlights: ['Infinity Pool Construction', 'Travertine Paving & Decks', 'Biophilic Garden Grids', 'Automated Exterior Lighting']
  },
  {
    id: '06',
    title: 'Commercial Projects',
    shortDesc: 'Multi-storey corporate towers, retail hubs, and industrial warehouses delivered on tight schedules.',
    fullDesc: 'High-density commercial projects demand load-bearing engineering, double-glazed curtain walls, automated BMS systems, and zero-downtime execution.',
    icon: 'Building2',
    tagline: ['Scalable', 'Efficient', 'Built Right'],
    color: 'sky',
    highlights: ['Curtain Wall Glasswork', 'Subterranean Basements', 'HVAC & MEP Integration', 'BMS Automation']
  }
];
