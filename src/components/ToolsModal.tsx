import React, { useState } from 'react';
import { X, Calculator, Ruler, Calendar, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { defaultToolsConfig } from '../data/toolsData';

interface ToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiryWithDetails?: (details: string) => void;
}

export const ToolsModal: React.FC<ToolsModalProps> = ({
  isOpen,
  onClose,
  onOpenEnquiryWithDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'estimator' | 'far' | 'timeline'>('estimator');

  // Tool 1: Cost Estimator State
  const [sqft, setSqft] = useState<number>(2500);
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | 'interior'>('residential');
  const [tier, setTier] = useState<'standard' | 'premium' | 'luxury'>('luxury');

  // Tool 2: FAR Calculator State
  const [plotWidth, setPlotWidth] = useState<number>(40);
  const [plotLength, setPlotLength] = useState<number>(60);
  const [roadWidth, setRoadWidth] = useState<'30' | '40' | '60'>('40');

  // Tool 3: Timeline Calculator State
  const [timelineSqft, setTimelineSqft] = useState<number>(3000);
  const [floors, setFloors] = useState<number>(3);

  if (!isOpen) return null;

  // Rates per sqft from Config Data
  const rates = defaultToolsConfig.estimatorRates;
  const currentRate = rates[projectType][tier];
  const totalCost = sqft * currentRate;

  // Breakdown percentages from Config Data
  const civilCost = Math.round(totalCost * defaultToolsConfig.breakdownPercentages.civil);
  const mepCost = Math.round(totalCost * defaultToolsConfig.breakdownPercentages.mep);
  const facadeCost = Math.round(totalCost * defaultToolsConfig.breakdownPercentages.facade);
  const finishCost = Math.round(totalCost * defaultToolsConfig.breakdownPercentages.finishes);

  // FAR Calculation Logic from Config Data
  const totalPlotArea = plotWidth * plotLength;
  const roadKey = roadWidth === '60' ? 'road60' : roadWidth === '40' ? 'road40' : 'road30';
  const farConfig = defaultToolsConfig.farDefaults[roadKey];
  const farRatio = farConfig.ratio;
  const maxGroundCoverageSqft = Math.round(totalPlotArea * farConfig.maxGroundCoveragePct);
  const maxBuildableSqft = Math.round(totalPlotArea * farRatio);
  const frontSetback = farConfig.frontSetback;
  const rearSetback = farConfig.rearSetback;

  // Timeline Calculation Logic
  const baseMonths = Math.max(4, Math.round((timelineSqft / 1000) * 2.5 + floors * 1.5));
  const totalWeeks = baseMonths * 4;

  const phases = [
    { title: 'Site Prep & Excavation', duration: `${Math.round(totalWeeks * 0.1)} Wks`, pct: '10%' },
    { title: 'Deep Piling & RCC Slab Frame', duration: `${Math.round(totalWeeks * 0.35)} Wks`, pct: '35%' },
    { title: 'Brickwork & Waterproofing', duration: `${Math.round(totalWeeks * 0.15)} Wks`, pct: '15%' },
    { title: 'MEP & Concealed Plumbing', duration: `${Math.round(totalWeeks * 0.15)} Wks`, pct: '15%' },
    { title: 'Façade & Plastering', duration: `${Math.round(totalWeeks * 0.12)} Wks`, pct: '12%' },
    { title: 'Interior Fit-Out & Handover', duration: `${Math.round(totalWeeks * 0.13)} Wks`, pct: '13%' },
  ];

  const handleApplyEstimateToEnquiry = () => {
    const summary = `Estimated ${sqft} sq.ft ${tier.toUpperCase()} ${projectType.toUpperCase()} project (Est: ₹${(totalCost / 100000).toFixed(2)} Lakhs)`;
    onClose();
    if (onOpenEnquiryWithDetails) {
      onOpenEnquiryWithDetails(summary);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden my-auto select-none">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F48033]/10 border border-[#F48033]/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#F48033]" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                PERSQFT Architectural Tools
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Interactive estimation & planning utilities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 px-4 sm:px-8 pt-3 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('estimator')}
            className={`flex items-center space-x-2 px-4 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'estimator'
                ? 'border-[#F48033] text-[#F48033] bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#F48033]" />
            <span>1. Cost Estimator</span>
          </button>

          <button
            onClick={() => setActiveTab('far')}
            className={`flex items-center space-x-2 px-4 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'far'
                ? 'border-[#F48033] text-[#F48033] bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Ruler className="w-4 h-4 text-[#F48033]" />
            <span>2. Municipal FAR Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-2 px-4 py-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-[#F48033] text-[#F48033] bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#F48033]" />
            <span>3. Timeline Generator</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* TAB 1: COST ESTIMATOR */}
          {activeTab === 'estimator' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['residential', 'commercial', 'interior'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setProjectType(type)}
                    className={`p-3.5 rounded-2xl border font-mono text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                      projectType === type
                        ? 'border-[#F48033] bg-[#F48033]/10 text-[#F48033]'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Slider & Quality Selector */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2 font-mono text-xs font-bold uppercase text-slate-700">
                    <span>Built-Up Area</span>
                    <span className="text-sm font-black text-[#F48033]">{sqft.toLocaleString()} Sq. Ft.</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={15000}
                    step={100}
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full accent-[#F48033] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-mono text-xs font-bold uppercase text-slate-700">
                    Quality Tier & Finishes
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['standard', 'premium', 'luxury'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTier(t)}
                        className={`py-2.5 px-3 rounded-xl border font-mono text-xs font-bold uppercase tracking-wider text-center transition-all cursor-pointer ${
                          tier === t
                            ? 'border-[#F48033] bg-[#F48033] text-white shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {t} (₹{rates[projectType][t]}/sqft)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Estimated Investment</span>
                    <div className="font-heading text-2xl sm:text-4xl font-black text-[#F48033]">
                      ₹{(totalCost / 100000).toFixed(2)} Lakhs
                      <span className="text-xs font-normal text-slate-400 ml-2">(₹{totalCost.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 font-mono text-xs text-slate-300">
                    Rate: <span className="text-white font-bold">₹{currentRate}/sqft</span>
                  </div>
                </div>

                {/* Itemized Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
                  <div className="bg-slate-800/80 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase">Civil Structure (45%)</span>
                    <span className="font-bold text-white text-sm">₹{(civilCost / 100000).toFixed(2)} L</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase">MEP & Utilities (20%)</span>
                    <span className="font-bold text-white text-sm">₹{(mepCost / 100000).toFixed(2)} L</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase">Façade & Windows (15%)</span>
                    <span className="font-bold text-white text-sm">₹{(facadeCost / 100000).toFixed(2)} L</span>
                  </div>
                  <div className="bg-slate-800/80 p-3 rounded-xl">
                    <span className="text-slate-400 block text-[10px] uppercase">Finishes & Fittings (20%)</span>
                    <span className="font-bold text-white text-sm">₹{(finishCost / 100000).toFixed(2)} L</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FAR CALCULATOR */}
          {activeTab === 'far' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <label className="block font-mono text-xs font-bold uppercase text-slate-700 mb-1">
                    Plot Width (Ft)
                  </label>
                  <input
                    type="number"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(Math.max(10, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold font-mono"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <label className="block font-mono text-xs font-bold uppercase text-slate-700 mb-1">
                    Plot Length (Ft)
                  </label>
                  <input
                    type="number"
                    value={plotLength}
                    onChange={(e) => setPlotLength(Math.max(10, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold font-mono"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <label className="block font-mono text-xs font-bold uppercase text-slate-700 mb-1">
                    Road Width (Ft)
                  </label>
                  <select
                    value={roadWidth}
                    onChange={(e) => setRoadWidth(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold font-mono"
                  >
                    <option value="30">30 Ft Road</option>
                    <option value="40">40 Ft Road</option>
                    <option value="60">60+ Ft Wide Avenue</option>
                  </select>
                </div>
              </div>

              {/* FAR Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">Total Plot Area</span>
                  <span className="font-heading text-xl font-black text-slate-900">{totalPlotArea.toLocaleString()} Sq. Ft.</span>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">Permissible FAR</span>
                  <span className="font-heading text-xl font-black text-[#F48033]">{farRatio} : 1</span>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">Max Built-Up Area</span>
                  <span className="font-heading text-xl font-black text-slate-900">{maxBuildableSqft.toLocaleString()} Sq. Ft.</span>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 block">Ground Coverage</span>
                  <span className="font-heading text-xl font-black text-slate-900">{maxGroundCoverageSqft.toLocaleString()} Sq. Ft.</span>
                </div>
              </div>

              <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-700">Recommended Setbacks:</span>
                <span className="font-bold text-slate-900">Front: {frontSetback}ft | Rear: {rearSetback}ft</span>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE GENERATOR */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <label className="block font-mono text-xs font-bold uppercase text-slate-700 mb-1">
                    Project Built-Up Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    value={timelineSqft}
                    onChange={(e) => setTimelineSqft(Math.max(500, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold font-mono"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                  <label className="block font-mono text-xs font-bold uppercase text-slate-700 mb-1">
                    Number of Floors (G+N)
                  </label>
                  <select
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold font-mono"
                  >
                    <option value={1}>Ground Floor Only (G)</option>
                    <option value={2}>Ground + 1 Floor (G+1)</option>
                    <option value={3}>Ground + 2 Floors (G+2)</option>
                    <option value={4}>Ground + 3 Floors (G+3)</option>
                  </select>
                </div>
              </div>

              {/* Total Duration Banner */}
              <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Target Delivery Schedule</span>
                  <div className="font-heading text-2xl font-black text-[#F48033]">
                    {baseMonths} Months ({totalWeeks} Weeks)
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-slate-300">
                  <ShieldCheck className="w-5 h-5 text-[#F48033]" />
                  <span>Guaranteed Turnkey Timeline</span>
                </div>
              </div>

              {/* Milestone Phases List */}
              <div className="space-y-2.5">
                {phases.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3.5 rounded-xl font-mono text-xs">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-[#F48033]" />
                      <span className="font-bold text-slate-900">{p.title}</span>
                    </div>
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold text-slate-700">
                      {p.duration} ({p.pct})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 py-4 border-t border-slate-200 bg-slate-50 gap-3">
          <div className="text-xs text-slate-500 font-mono text-center sm:text-left">
            *Estimates are indicative based on PERSQFT engineered benchmarks.
          </div>

          <button
            onClick={handleApplyEstimateToEnquiry}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#F48033] hover:bg-[#d96a20] text-white px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
          >
            <span>GET OFFICIAL QUOTE FOR THIS SPEC</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
