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
import ourProcessPng from '../assets/ourProcess.png';
import ourProcessWebp from '../assets/ourProcess.webp';

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

export const FullProcessPage: React.FC<FullProcessPageProps> = ({ onBackToHome, onOpenEnquiry }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  // CMS photo data
  const [cmsSteps, setCmsSteps] = useState<CmsProcessStep[]>([]);
  const [activeCmsStep, setActiveCmsStep] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
  const sliderTimers = useRef<Record<number, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    fetch('/api/process.php')
      .then(r => r.json())
      .then(data => { if (data.success && data.steps?.length) setCmsSteps(data.steps); })
      .catch(() => {});
  }, []);

  // Auto-slide per step
  useEffect(() => {
    cmsSteps.forEach(step => {
      if (step.images.length < 2) return;
      clearInterval(sliderTimers.current[step.id]);
      sliderTimers.current[step.id] = setInterval(() => {
        setActiveImageIndex(prev => ({
          ...prev,
          [step.id]: ((prev[step.id] ?? 0) + 1) % step.images.length,
        }));
      }, 3000);
    });
    return () => Object.values(sliderTimers.current).forEach(clearInterval);
  }, [cmsSteps]);

  const getImgIdx = (stepId: number) => activeImageIndex[stepId] ?? 0;

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

          {cmsSteps.length > 0 ? (
            <div className="space-y-3">
              {/* Step selector tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {cmsSteps.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveCmsStep(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-['Montserrat',sans-serif] transition-all cursor-pointer ${
                      activeCmsStep === idx
                        ? 'bg-[#FF6F2C] text-white shadow-md shadow-orange-500/20'
                        : 'bg-[#FAF8F5] text-[#667078] hover:bg-[#F1EFEC] border border-[#F1EFEC]'
                    }`}
                  >
                    Step {String(step.step_number).padStart(2, '0')} — {step.title}
                  </button>
                ))}
              </div>

              {/* Slider for the active CMS step */}
              {(() => {
                const step = cmsSteps[activeCmsStep];
                if (!step) return null;
                const imgIdx = getImgIdx(step.id);
                const images = step.images;
                if (images.length === 0) {
                  return (
                    <div className="w-full rounded-[10px] border border-[#F1EFEC] bg-[#FAF8F5] flex items-center justify-center py-16 text-sm text-[#667078]">
                      No photos uploaded for this step yet.
                    </div>
                  );
                }
                return (
                  <div className="relative w-full rounded-[10px] overflow-hidden border border-[#F1EFEC] bg-[#FAF8F5] group select-none">
                    {/* Images */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      {images.map((img, i) => (
                        <img
                          key={img.id}
                          src={img.image_path}
                          alt={img.caption || `${step.title} — photo ${i + 1}`}
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === imgIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                          loading="lazy"
                        />
                      ))}
                    </div>

                    {/* Caption */}
                    {images[imgIdx]?.caption && (
                      <div className="absolute bottom-0 left-0 right-0 z-20 px-4 py-2 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-xs font-['Montserrat',sans-serif]">{images[imgIdx].caption}</p>
                      </div>
                    )}

                    {/* Prev / Next controls */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveImageIndex(prev => ({ ...prev, [step.id]: (imgIdx - 1 + images.length) % images.length }))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4 text-[#263238]" />
                        </button>
                        <button
                          onClick={() => setActiveImageIndex(prev => ({ ...prev, [step.id]: (imgIdx + 1) % images.length }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <ArrowRight className="w-4 h-4 text-[#263238]" />
                        </button>
                        {/* Dot indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                          {images.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImageIndex(prev => ({ ...prev, [step.id]: i }))}
                              className={`rounded-full transition-all cursor-pointer ${i === imgIdx ? 'w-5 h-1.5 bg-[#FF6F2C]' : 'w-1.5 h-1.5 bg-white/60 hover:bg-white'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Step description */}
              {cmsSteps[activeCmsStep]?.description && (
                <p className="text-xs text-[#667078] mt-2 font-['Montserrat',sans-serif]">
                  {cmsSteps[activeCmsStep].description}
                </p>
              )}
            </div>
          ) : (
            /* Fallback: static ourProcess.png */
            <div className="w-full rounded-[10px] overflow-hidden border border-[#F1EFEC] bg-[#FAF8F5]">
              <picture className="w-full block">
                <source srcSet={ourProcessWebp} type="image/webp" />
                <img
                  src={ourProcessPng}
                  alt="PERSQFT Full Construction Roadmap"
                  className="w-full h-auto object-contain mx-auto"
                  loading="lazy"
                />
              </picture>
            </div>
          )}
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
