import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Lightbulb,
  FileText,
  Home,
  HardHat,
  Check,
  Clock,
  ChevronRight,
  ClipboardList,
  Phone,
} from 'lucide-react';

interface FullProcessPageProps {
  onBackToHome: () => void;
  onOpenEnquiry: (processStep?: string) => void;
}

interface ProcessStepDetail {
  stepNumber: string;
  stepName: string;
  category: string;
  duration: string;
  summary: string;
  icon: React.ReactNode;
  keyActionPoints: string[];
  deliverablesGiven: string[];
  engineeringQualityGate: string;
  clientRole: string;
}

// CMS types (matches api/process.php response)
interface CmsProcessImage { id: number; image_path: string; caption: string; sort_order: number; }
interface CmsProcessStep  { id: number; step_number: number; title: string; description: string; images: CmsProcessImage[]; }

// Dynamically import all 26 process step photos from local assets
const stepImagesGlob = import.meta.glob<{ default: string }>('../assets/ourPerocessStepsAssets/*.{png,webp}', { eager: true });
const getLocalAsset = (fileName: string): string => {
  const match = Object.entries(stepImagesGlob).find(([path]) => path.includes(fileName));
  return match ? match[1].default : '';
};

// Default fallback 6 blueprint steps with all 26 curated photos
const defaultProcessSteps: CmsProcessStep[] = [
  {
    id: 1,
    step_number: 1,
    title: 'Consultation & Requirement Discovery',
    description: 'Site visit, soil bearing capacity test, Vastu orientation, contour assessment, and transparent cost estimates.',
    images: [
      { id: 101, image_path: getLocalAsset('step1_im1') || '/uploads/process/step1_im1.webp', caption: 'Site Contour & Boundary Survey', sort_order: 1 },
      { id: 102, image_path: getLocalAsset('step1_im2') || '/uploads/process/step1_im2.webp', caption: 'Soil & Geotechnical Testing', sort_order: 2 },
      { id: 103, image_path: getLocalAsset('step1_im3') || '/uploads/process/step1_im3.webp', caption: 'Client Discovery & Feasibility Brief', sort_order: 3 },
    ]
  },
  {
    id: 2,
    step_number: 2,
    title: 'Concept & Design Development',
    description: 'Architectural space planning, sun-path analysis, functional zoning, and 2D conceptual floor plans.',
    images: [
      { id: 201, image_path: getLocalAsset('step2_im1') || '/uploads/process/step2_im1.webp', caption: 'Space Optimization & Circulation Layout', sort_order: 1 },
      { id: 202, image_path: getLocalAsset('step2_im2') || '/uploads/process/step2_im2.webp', caption: '2D Concept Blueprint Planning', sort_order: 2 },
    ]
  },
  {
    id: 3,
    step_number: 3,
    title: 'Planning & Structural Documentation',
    description: 'Seismic Zone III/IV earthquake-resistant RCC structural calculations, footing schedules, plumbing, and electrical conduits.',
    images: [
      { id: 301, image_path: getLocalAsset('step3_im1') || '/uploads/process/step3_im1.webp', caption: 'Structural Framing & Foundation Schedule', sort_order: 1 },
      { id: 302, image_path: getLocalAsset('step3_im2') || '/uploads/process/step3_im2.webp', caption: 'Reinforcement Column & Beam CAD', sort_order: 2 },
      { id: 303, image_path: getLocalAsset('step3_im3') || '/uploads/process/step3_im3.webp', caption: 'Slab Reinforcement Grid Calculations', sort_order: 3 },
      { id: 304, image_path: getLocalAsset('step3_im4') || '/uploads/process/step3_im4.webp', caption: 'Plumbing & Drainage Schematic Blueprint', sort_order: 4 },
      { id: 305, image_path: getLocalAsset('step3_im5') || '/uploads/process/step3_im5.webp', caption: 'Electrical Circuit & Distribution Layout', sort_order: 5 },
      { id: 306, image_path: getLocalAsset('step3_im6') || '/uploads/process/step3_im6.webp', caption: 'Civil Approval & Municipal Setback Drawing', sort_order: 6 },
    ]
  },
  {
    id: 4,
    step_number: 4,
    title: '3D Elevation & Interior Styling',
    description: 'Photorealistic 4K 3D elevation facades, exterior material palette, moodboards, and interior spaces.',
    images: [
      { id: 401, image_path: getLocalAsset('step4_im1') || '/uploads/process/step4_im1.webp', caption: 'Day Facade 3D Architectural View', sort_order: 1 },
      { id: 402, image_path: getLocalAsset('step4_im2') || '/uploads/process/step4_im2.webp', caption: 'Night Lighting & Exterior Elevation', sort_order: 2 },
      { id: 403, image_path: getLocalAsset('step4_im3') || '/uploads/process/step4_im3.webp', caption: 'Modern Balcony & Cladding Aesthetics', sort_order: 3 },
      { id: 404, image_path: getLocalAsset('step4_im4') || '/uploads/process/step4_im4.webp', caption: 'Living Lounge & Interior Styling Render', sort_order: 4 },
      { id: 405, image_path: getLocalAsset('step4_im5') || '/uploads/process/step4_im5.webp', caption: 'Modular Kitchen & Fabrication Details', sort_order: 5 },
      { id: 406, image_path: getLocalAsset('step4_im6') || '/uploads/process/step4_im6.webp', caption: 'Master Bedroom Ambience & Finishes', sort_order: 6 },
      { id: 407, image_path: getLocalAsset('step4_final') || '/uploads/process/step4_final.webp', caption: 'Approved Final 3D Elevation Blueprint', sort_order: 7 },
    ]
  },
  {
    id: 5,
    step_number: 5,
    title: 'Execution & Rigorous Site Supervision',
    description: 'On-site civil engineer supervision, cube compression testing, waterproofing chemical membranes, and weekly updates.',
    images: [
      { id: 501, image_path: getLocalAsset('step5_im1') || '/uploads/process/step5_im1.webp', caption: 'Ground Excavation & Footing Casting', sort_order: 1 },
      { id: 502, image_path: getLocalAsset('step5_im2') || '/uploads/process/step5_im2.webp', caption: 'Plinth Beam Casting & Anti-Termite Treatment', sort_order: 2 },
      { id: 503, image_path: getLocalAsset('step5_im3') || '/uploads/process/step5_im3.webp', caption: 'Brickwork & Concrete Curing Rigor', sort_order: 3 },
      { id: 504, image_path: getLocalAsset('step5_im4') || '/uploads/process/step5_im4.webp', caption: 'Roof Slab Casting with High-Grade Concrete', sort_order: 4 },
    ]
  },
  {
    id: 6,
    step_number: 6,
    title: 'Quality Handover & Lifetime Structural Warranty',
    description: '400+ point quality inspection, MEP load testing, defect liability warranty certificate, and key handover.',
    images: [
      { id: 601, image_path: getLocalAsset('step6_im1') || '/uploads/process/step6_im1.webp', caption: 'Final Finishing & Surface Paint Inspection', sort_order: 1 },
      { id: 602, image_path: getLocalAsset('step6_im2') || '/uploads/process/step6_im2.webp', caption: 'Electrical Load & Water Pressure Gate Audit', sort_order: 2 },
      { id: 603, image_path: getLocalAsset('step6_im3') || '/uploads/process/step6_im3.webp', caption: 'As-Built Drawings & Warranty Dossier', sort_order: 3 },
      { id: 604, image_path: getLocalAsset('step6_im4') || '/uploads/process/step6_im4.webp', caption: 'Pristine Handover & Happy Homeowner Welcome', sort_order: 4 },
    ]
  },
];

const resolveImgUrl = (raw: string): string => {
  if (!raw) return '';
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:') || raw.startsWith('blob:')) return raw;
  return `/${raw.replace(/^\/+/, '')}`;
};

export const FullProcessPage: React.FC<FullProcessPageProps> = ({ onBackToHome, onOpenEnquiry }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // CMS photo data
  const [cmsSteps, setCmsSteps] = useState<CmsProcessStep[]>([]);
  const [activeCmsStep, setActiveCmsStep] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetch('/api/process.php')
      .then(r => r.json())
      .then(data => {
        if (data.success && Array.isArray(data.steps) && data.steps.length > 0) {
          setCmsSteps(data.steps);
        }
      })
      .catch(() => {});
  }, []);

  const displaySteps = (cmsSteps.length > 0) ? cmsSteps : defaultProcessSteps;
  const currentCmsStep = displaySteps[activeCmsStep] || displaySteps[0];
  const currentStepImages = currentCmsStep?.images || [];
  const currentImgIdx = currentCmsStep ? (activeImageIndex[currentCmsStep.id] ?? 0) : 0;

  // Auto-advance active slider every 3 seconds (pauses when hovered/touched)
  useEffect(() => {
    if (isSliderPaused || currentStepImages.length <= 1 || !currentCmsStep) return;

    const timer = setInterval(() => {
      setActiveImageIndex(prev => {
        const cur = prev[currentCmsStep.id] ?? 0;
        return {
          ...prev,
          [currentCmsStep.id]: (cur + 1) % currentStepImages.length,
        };
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [isSliderPaused, currentCmsStep, currentStepImages.length]);

  const handlePrevImage = () => {
    if (!currentCmsStep || currentStepImages.length <= 1) return;
    setActiveImageIndex(prev => {
      const cur = prev[currentCmsStep.id] ?? 0;
      return {
        ...prev,
        [currentCmsStep.id]: (cur - 1 + currentStepImages.length) % currentStepImages.length,
      };
    });
  };

  const handleNextImage = () => {
    if (!currentCmsStep || currentStepImages.length <= 1) return;
    setActiveImageIndex(prev => {
      const cur = prev[currentCmsStep.id] ?? 0;
      return {
        ...prev,
        [currentCmsStep.id]: (cur + 1) % currentStepImages.length,
      };
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSliderPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNextImage();
    } else if (diff < -45) {
      handlePrevImage();
    }
    touchStartX.current = null;
    setIsSliderPaused(false);
  };

  const processSteps: ProcessStepDetail[] = [
    {
      stepNumber: '01',
      stepName: 'Consultation & Requirement Discovery',
      category: 'Initial Feasibility Phase',
      duration: '1 - 2 Days',
      summary: 'We begin with an in-depth one-on-one session to understand your lifestyle, aesthetic aspirations, family size, plot orientation, budget targets, and timeline constraints.',
      icon: <MessageSquare className="w-6 h-6 stroke-[1.9]" />,
      keyActionPoints: [
        'Site Visit & Contour / Boundary Verification on Ground',
        'Soil Bearing Capacity & Groundwater Level Preliminary Assessment',
        'Discussion of Vastu Orientation & Natural Sunlight Axes',
        'Budget Alignment & Transparent Cost-per-Sqft Engineering Estimates',
      ],
      deliverablesGiven: [
        'Initial Project Feasibility Brief',
        'Plot Dimension & Setback Boundary Analysis Sheet',
        'Indicative Budget Estimate Range & Milestones Matrix',
      ],
      engineeringQualityGate: 'Total Station Ground Survey & Road-Width Clearance Audit.',
      clientRole: 'Provide plot registry/deed dimensions & specify dream preferences.',
    },
    {
      stepNumber: '02',
      stepName: 'Concept & Design Development',
      category: 'Creative Architectural Space Planning',
      duration: '3 - 5 Days',
      summary: 'Our architects develop multiple functional conceptual layouts that maximize living carpet area, ensure natural cross-ventilation, and follow Vastu principles.',
      icon: <Lightbulb className="w-6 h-6 stroke-[1.9]" />,
      keyActionPoints: [
        'Zoning of Living, Private, Service & Circulation Areas',
        'Sun-Path & Wind Direction Thermal Comfort Analysis',
        'Drafting of 2D Conceptual Floor Plans (Multiple Layout Options)',
        'Furniture Positioning & Room Circulation Flow Optimization',
      ],
      deliverablesGiven: [
        '2D Architectural Concept Floor Plans (Ground & Upper Floors)',
        'Vastu Compliance Audit Scorecard',
        'Interactive 2D Revision Cycles until 100% Client Satisfaction',
      ],
      engineeringQualityGate: 'Carpet Area Efficiency Check (Zero Wasted Circulation Space).',
      clientRole: 'Review layout options and give approval or revision requests.',
    },
    {
      stepNumber: '03',
      stepName: 'Planning & Structural Documentation',
      category: 'Engineering Working Blueprints',
      duration: '5 - 7 Days',
      summary: 'Before touching ground on site, every structural beam, column footing, plumbing pipe, and electrical conduit is mathematically designed and blueprinted.',
      icon: <FileText className="w-6 h-6 stroke-[1.9]" />,
      keyActionPoints: [
        'Seismic Zone III/IV Earthquake-Resistant RCC Framing Calculations',
        'Foundation Depth, Column Reinforcement & Plinth Beam Schedules',
        'Plumbing Schematics: Gravity Flow Drainage & Fresh Water Line Pressure',
        'Electrical Conduit Diagrams: Load Balancing, Inverter & Generator Backups',
      ],
      deliverablesGiven: [
        'Full Structural Working Drawing Set Signed by Certified Engineers',
        'Plumbing (MEP) Schematic & Pipe Diameter Schedules',
        'Electrical Layout & DB Box Circuit Balancing Drawings',
      ],
      engineeringQualityGate: 'STAAD.Pro Structural Safety Analysis & Rebar Density Calculations.',
      clientRole: 'Final sign-off on room power points, AC positions, and plumbing nodes.',
    },
    {
      stepNumber: '04',
      stepName: '3D Elevation & Interior Styling',
      category: 'Hyper-Realistic Visualization',
      duration: '4 - 6 Days',
      summary: 'Experience your future home in photorealistic 3D detail before laying a single brick. Inspect colors, lighting, textures, balconies, and finishes.',
      icon: <Home className="w-6 h-6 stroke-[1.9]" />,
      keyActionPoints: [
        'Exterior Facade 3D Modeling (Contemporary, Modern or Neo-Classical)',
        'Exterior Material Palette Selection (Stone Cladding, Louvers, Texture Paints)',
        'Interior Room 3D Views (Living Lounge, Modular Kitchen, Master Suites)',
        'Balcony Railing, Boundary Wall & Gate Synchronized Aesthetics',
      ],
      deliverablesGiven: [
        'Day & Night 4K Photorealistic Facade Renderings',
        'Material Specification Matrix with Paint/Texture Brand Codes',
        'Modular Kitchen & Wardrobe Fabrication Working CADs',
      ],
      engineeringQualityGate: 'Material Availability & Local Weather Durability Validation.',
      clientRole: 'Choose exterior color schemes and interior finishes from our 3D renders.',
    },
    {
      stepNumber: '05',
      stepName: 'Execution & Rigorous Site Supervision',
      category: 'Turnkey Ground Construction',
      duration: '6 - 10 Months',
      summary: 'Our dedicated on-site civil engineers manage raw material testing, steel reinforcement binding, concrete pouring, brickwork, plastering, and finishing.',
      icon: <HardHat className="w-6 h-6 stroke-[1.9]" />,
      keyActionPoints: [
        'Certified Grade-A Raw Materials Only (Tested Steel, 43/53 Grade Cement)',
        'Stage-by-Stage Casting Supervision with Concrete Cube Compression Tests',
        'Waterproofing Chemical Membranes on Plinth, Sunken Slabs & Roof Terraces',
        'Weekly Digital Photographic Progress Updates Delivered to Your Phone',
      ],
      deliverablesGiven: [
        'Stage-by-Stage Civil Inspection Sign-Off Reports',
        'Lab Test Certificates for Steel Tensile Strength & Concrete Cubes',
        'Live Photo/Video Execution Log on WhatsApp & Client Portal',
      ],
      engineeringQualityGate: 'Mandatory 21-Day Water Curing Audit & Plumb-Line Level Verification.',
      clientRole: 'Release stage payments against verified civil milestones completed.',
    },
    {
      stepNumber: '06',
      stepName: 'Final Inspection & Key Handover',
      category: 'Move-in Ready Delivery',
      duration: '1 - 2 Weeks',
      summary: 'A comprehensive 150-point quality snagging inspection ensures every switch works, every tile is level, plumbing runs seamlessly, and your dream home is spotless for Griha Pravesh.',
      icon: <Check className="w-6 h-6 stroke-[2.8]" />,
      keyActionPoints: [
        '150-Point Quality Snag-Free Audit Across Every Room and Surface',
        'Plumbing Pressure Tests & Drainage Slope Runoff Verification',
        'Electrical Fixture, Earthing & MCB Tripping Load Inspections',
        'Deep Chemical Cleaning & Polishing of Entire Premises',
      ],
      deliverablesGiven: [
        'All Original Architectural & Structural "As-Built" Drawings',
        'PERSQFT Official Warranty & Guarantee Certificate',
        'Official Brass Key Set in Premium Presentation Box',
      ],
      engineeringQualityGate: 'Zero-Snag Quality Certification Signed by Chief Construction Head.',
      clientRole: 'Perform walk-through with our engineering head and receive your keys!',
    },
  ];

  const currentStep = processSteps[activeStepIndex];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-20 sm:pt-24 pb-16 select-none font-['Inter',sans-serif]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-14">
        
        {/* ── BREADCRUMB & BACK NAVIGATION ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 pt-4">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-['Montserrat',sans-serif] font-semibold text-[#263238] hover:text-[#FF6F2C] bg-white border border-[#F1EFEC] hover:border-[#FF6F2C] px-3.5 sm:px-4 py-2 rounded-[8px] transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-[#FF6F2C]" />
            <span>Back to Home</span>
          </button>

          <div className="font-['Montserrat',sans-serif] text-xs text-[#667078] flex items-center gap-2 font-medium">
            <span onClick={onBackToHome} className="hover:text-[#FF6F2C] cursor-pointer">Home</span>
            <span>/</span>
            <span className="text-[#FF6F2C] font-semibold">Our Complete Process</span>
          </div>
        </div>

        {/* ── HERO BANNER ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-6 sm:p-10 lg:p-12 mb-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFF1E9]/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#FFF1E9] border border-[#FF6F2C]/30 text-[#FF6F2C] px-3.5 py-1 rounded-[6px] text-xs font-['Montserrat',sans-serif] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Engineered Precision Roadmap</span>
            </div>

            <h1 className="font-['Montserrat',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#263238] tracking-tight leading-tight mb-4">
              Our 6-Step Construction Roadmap in Interactive Points
            </h1>

            <p className="text-[#667078] text-sm sm:text-base leading-relaxed mb-6 font-normal">
              Building a dream home shouldn't be stressful. We follow a transparent, engineering-backed 6-stage lifecycle where every milestone has clear deliverables, client review gates, and zero hidden costs.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEnquiry('Consultation for Step 01 Discovery')}
                className="inline-flex items-center gap-2 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-6 sm:px-7 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span>Initiate Step 01 Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+916306659601"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#FFF1E9] text-[#263238] border border-[#FF6F2C] px-5 sm:px-6 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF6F2C]" />
                <span>Speak to Chief Engineer</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE STEP NAVIGATOR (HORIZONTAL SCROLL BAR) ── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-['Montserrat',sans-serif] text-xs sm:text-sm font-bold uppercase tracking-wider text-[#263238]">
              Select An Interactive Step To Inspect:
            </span>
            <span className="text-xs text-[#FF6F2C] font-semibold font-['Montserrat',sans-serif]">
              Step {activeStepIndex + 1} of 6
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {processSteps.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <button
                  key={step.stepNumber}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`p-3.5 sm:p-4 rounded-[10px] border transition-all text-left flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-white border-[#FF6F2C] shadow-md ring-2 ring-[#FF6F2C]/20'
                      : 'bg-[#FAF8F5] border-[#F1EFEC] hover:bg-white hover:border-[#D9D6D2]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-['Montserrat',sans-serif] font-bold text-xs ${isActive ? 'text-[#FF6F2C]' : 'text-[#667078]'}`}>
                      STEP {step.stepNumber}
                    </span>
                    <span className={`w-7 h-7 rounded-[6px] flex items-center justify-center ${isActive ? 'bg-[#FFF1E9] text-[#FF6F2C]' : 'bg-white text-[#667078] border border-[#F1EFEC]'}`}>
                      {step.icon}
                    </span>
                  </div>

                  <p className={`font-['Montserrat',sans-serif] font-semibold text-xs sm:text-[13px] leading-tight line-clamp-2 ${isActive ? 'text-[#263238]' : 'text-[#667078]'}`}>
                    {step.stepName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ACTIVE STEP DETAILED INTERACTIVE CARD ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] shadow-sm p-6 sm:p-10 mb-12 animate-fadeIn">
          {/* Top Step Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#F1EFEC] gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[10px] bg-[#FFF1E9] text-[#FF6F2C] flex items-center justify-center shrink-0 border border-[#FF6F2C]/30 shadow-xs">
                {currentStep.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-['Montserrat',sans-serif] text-xs font-bold uppercase tracking-wider text-[#FF6F2C]">
                    STEP {currentStep.stepNumber} // {currentStep.category}
                  </span>
                </div>
                <h2 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight">
                  {currentStep.stepName}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-flex items-center gap-1.5 bg-[#FAF8F5] border border-[#F1EFEC] px-3.5 py-1.5 rounded-[6px] text-xs font-['Montserrat',sans-serif] font-semibold text-[#263238]">
                <Clock className="w-3.5 h-3.5 text-[#FF6F2C]" />
                <span>Est. Duration: {currentStep.duration}</span>
              </span>
            </div>
          </div>

          {/* Overview text */}
          <p className="text-[#667078] text-sm sm:text-base leading-relaxed mb-8 max-w-4xl">
            {currentStep.summary}
          </p>

          {/* Two-Column Deep Dive: Key Action Points (Left) + Deliverables & Quality Gates (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Left Box: Key Action Points */}
            <div className="bg-[#FAF8F5] rounded-[10px] p-6 border border-[#F1EFEC]">
              <h3 className="font-['Montserrat',sans-serif] text-sm sm:text-base font-bold text-[#263238] uppercase tracking-wider mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#FF6F2C]" />
                <span>On-Site Activities &amp; Milestones:</span>
              </h3>
              <ul className="space-y-3">
                {currentStep.keyActionPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#263238]">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6F2C] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Box: What Client Receives + Quality Gate */}
            <div className="space-y-4">
              <div className="bg-[#FFF7F2] rounded-[10px] p-6 border border-[#FFF1E9]">
                <h3 className="font-['Montserrat',sans-serif] text-sm sm:text-base font-bold text-[#263238] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF6F2C] stroke-[3]" />
                  <span>Deliverables Handed to You:</span>
                </h3>
                <ul className="space-y-2.5">
                  {currentStep.deliverablesGiven.map((del, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#263238] font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6F2C] mt-2 shrink-0" />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Engineering Quality Gate & Client Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="bg-[#FAF8F5] p-4 rounded-[8px] border border-[#F1EFEC]">
                  <span className="font-['Montserrat',sans-serif] text-[10px] uppercase font-bold text-[#667078] block mb-1">
                    Quality Gate Protocol:
                  </span>
                  <p className="text-xs font-semibold text-[#263238] leading-snug">
                    {currentStep.engineeringQualityGate}
                  </p>
                </div>

                <div className="bg-[#FAF8F5] p-4 rounded-[8px] border border-[#F1EFEC]">
                  <span className="font-['Montserrat',sans-serif] text-[10px] uppercase font-bold text-[#667078] block mb-1">
                    Client Checkpoint:
                  </span>
                  <p className="text-xs font-semibold text-[#263238] leading-snug">
                    {currentStep.clientRole}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Interactive Step Navigation Footer */}
          <div className="pt-6 border-t border-[#F1EFEC] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                disabled={activeStepIndex === 0}
                onClick={() => setActiveStepIndex(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F1EFEC] disabled:opacity-40 text-[#263238] rounded-[8px] font-['Montserrat',sans-serif] text-xs font-semibold border border-[#F1EFEC] transition-colors cursor-pointer"
              >
                Previous Step
              </button>

              <button
                disabled={activeStepIndex === processSteps.length - 1}
                onClick={() => setActiveStepIndex(prev => Math.min(processSteps.length - 1, prev + 1))}
                className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#F1EFEC] disabled:opacity-40 text-[#263238] rounded-[8px] font-['Montserrat',sans-serif] text-xs font-semibold border border-[#F1EFEC] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => onOpenEnquiry(`Inquiry for Step ${currentStep.stepNumber}: ${currentStep.stepName}`)}
              className="inline-flex items-center gap-2 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-6 py-2.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span>Discuss Step {currentStep.stepNumber} For Your Plot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── VISUAL EXECUTION BLUEPRINT: CMS Photo Slider ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-6 sm:p-8 lg:p-10 shadow-xs mb-12">
          <div className="max-w-2xl mb-6">
            <span className="font-['Montserrat',sans-serif] text-xs font-bold uppercase tracking-wider text-[#FF6F2C] block mb-1">
              FULL ARCHITECTURAL WORKFLOW BLUEPRINT
            </span>
            <h3 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight">
              Visual Execution Blueprint
            </h3>
            <p className="text-xs sm:text-sm text-[#667078] mt-1">
              Every detail is premeditated, blueprinted, and rigorously supervised on ground by our civil engineers.
            </p>
          </div>

          <div className="space-y-4">
            {/* Step selector tabs */}
            <div className="flex flex-wrap gap-2 mb-2">
              {displaySteps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveCmsStep(idx);
                    setActiveStepIndex(idx);
                  }}
                  className={`px-3.5 py-2 rounded-[8px] text-xs font-semibold font-['Montserrat',sans-serif] transition-all cursor-pointer flex items-center gap-2 ${
                    activeCmsStep === idx
                      ? 'bg-[#FF6F2C] text-white shadow-md shadow-orange-500/20'
                      : 'bg-[#FAF8F5] text-[#667078] hover:bg-[#F1EFEC] border border-[#F1EFEC]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-md text-[10px] font-black flex items-center justify-center font-mono ${
                    activeCmsStep === idx ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {String(step.step_number).padStart(2, '0')}
                  </span>
                  <span>{step.title}</span>
                </button>
              ))}
            </div>

            {/* Step description */}
            {currentCmsStep?.description && (
              <p className="text-xs sm:text-sm text-[#667078] font-['Montserrat',sans-serif] pb-1">
                {currentCmsStep.description}
              </p>
            )}

            {/* Slider track container */}
            {currentStepImages.length > 0 ? (
              <div 
                className="relative w-full rounded-[12px] overflow-hidden border border-[#F1EFEC] bg-slate-900 group select-none shadow-sm"
                onMouseEnter={() => setIsSliderPaused(true)}
                onMouseLeave={() => setIsSliderPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* Horizontal sliding track */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                  <div 
                    className="flex w-full h-full transition-transform duration-500 ease-out will-change-transform"
                    style={{ transform: `translateX(-${currentImgIdx * 100}%)` }}
                  >
                    {currentStepImages.map((img, i) => (
                      <div key={img.id || i} className="w-full h-full shrink-0 relative bg-slate-950 flex items-center justify-center">
                        <img
                          src={resolveImgUrl(img.image_path)}
                          alt={img.caption || `${currentCmsStep.title} — photo ${i + 1}`}
                          className="w-full h-full object-contain sm:object-cover"
                          loading="lazy"
                        />
                        {/* Gradient caption overlay */}
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 sm:p-6 text-white pointer-events-none">
                          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[#FF8F3D] block mb-1">
                            Step {String(currentCmsStep.step_number).padStart(2, '0')} • {currentCmsStep.title}
                          </span>
                          <p className="text-xs sm:text-sm font-semibold font-['Montserrat',sans-serif] text-slate-100 line-clamp-2">
                            {img.caption || `Phase Blueprint Visual #${i + 1}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top-right counter badge */}
                <div className="absolute top-3 right-3 z-20 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-mono font-bold rounded-full border border-white/10 pointer-events-none">
                  {currentImgIdx + 1} / {currentStepImages.length}
                </div>

                {/* Prev / Next controls */}
                {currentStepImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      aria-label="Previous photo"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/80 hover:bg-white text-[#263238] rounded-full flex items-center justify-center shadow-lg transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      aria-label="Next photo"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 bg-white/80 hover:bg-white text-[#263238] rounded-full flex items-center justify-center shadow-lg transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-xs rounded-full">
                      {currentStepImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            if (currentCmsStep) {
                              setActiveImageIndex(prev => ({ ...prev, [currentCmsStep.id]: i }));
                            }
                          }}
                          aria-label={`Jump to photo ${i + 1}`}
                          className={`rounded-full transition-all cursor-pointer ${
                            i === currentImgIdx
                              ? 'w-6 h-1.5 bg-[#FF6F2C]'
                              : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="w-full rounded-[10px] border border-[#F1EFEC] bg-[#FAF8F5] flex items-center justify-center py-16 text-sm text-[#667078]">
                No photos uploaded for this step yet.
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="bg-[#FAF8F5] border border-[#F1EFEC] rounded-[10px] p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-xs">
          <h3 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight mb-2">
            Experience Hassle-Free Construction With Zero Stress
          </h3>
          <p className="text-sm text-[#667078] max-w-md mx-auto mb-6">
            Start with Step 01 today. We inspect your plot, discuss requirements, and present an exact engineering roadmap with fixed timelines.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenEnquiry('Process Roadmap Consultation')}
              className="bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-7 py-3.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Book Step 01 Consultation
            </button>
            <button
              onClick={onBackToHome}
              className="bg-white hover:bg-[#FAF8F5] text-[#263238] border border-[#F1EFEC] px-6 py-3.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
