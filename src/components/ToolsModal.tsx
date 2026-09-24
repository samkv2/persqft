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
      <div className="relative w-full max-w-4xl bg-white border border-[#F1EFEC] shadow-2xl rounded-[10px] overflow-hidden my-auto select-none">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-[#F1EFEC] bg-[#FAF8F5]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-[8px] bg-[#FFF1E9] border border-[#FFF1E9] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF6F2C]" />
            </div>
            <div>
              <h3 className="font-['Montserrat',sans-serif] text-lg sm:text-xl font-bold text-[#263238] tracking-tight">
                PERSQFT Architectural Tools
              </h3>
              <p className="text-xs text-[#667078] font-['Inter',sans-serif]">
                Interactive estimation & planning utilities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#667078] hover:text-[#263238] hover:bg-[#F1EFEC] rounded-[8px] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#F1EFEC] bg-[#FAF8F5] px-4 sm:px-8 pt-3 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('estimator')}
            className={`flex items-center space-x-2 px-4 py-3 font-['Montserrat',sans-serif] text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'estimator'
                ? 'border-[#FF6F2C] text-[#FF6F2C] bg-white rounded-t-[8px] shadow-xs'
                : 'border-transparent text-[#667078] hover:text-[#263238]'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#FF6F2C]" />
            <span>1. Cost Estimator</span>
          </button>

          <button
            onClick={() => setActiveTab('far')}
            className={`flex items-center space-x-2 px-4 py-3 font-['Montserrat',sans-serif] text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'far'
                ? 'border-[#FF6F2C] text-[#FF6F2C] bg-white rounded-t-[8px] shadow-xs'
                : 'border-transparent text-[#667078] hover:text-[#263238]'
            }`}
          >
            <Ruler className="w-4 h-4 text-[#FF6F2C]" />
            <span>2. Municipal FAR Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center space-x-2 px-4 py-3 font-['Montserrat',sans-serif] text-xs sm:text-sm font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-[#FF6F2C] text-[#FF6F2C] bg-white rounded-t-[8px] shadow-xs'
                : 'border-transparent text-[#667078] hover:text-[#263238]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#FF6F2C]" />
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
                    className={`p-3.5 rounded-[8px] border font-['Montserrat',sans-serif] text-xs font-semibold uppercase tracking-wider text-center transition-all cursor-pointer ${
                      projectType === type
                        ? 'border-[#FF6F2C] bg-[#FFF1E9] text-[#FF6F2C]'
                        : 'border-[#F1EFEC] bg-[#FAF8F5] text-[#263238] hover:border-[#D9D6D2]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Slider & Quality Selector */}
              <div className="bg-[#FAF8F5] border border-[#F1EFEC] p-5 rounded-[10px] space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-2 font-['Montserrat',sans-serif] text-xs font-semibold uppercase text-[#263238]">
                    <span>Built-Up Area</span>
                    <span className="text-sm font-bold text-[#FF6F2C]">{sqft.toLocaleString()} Sq. Ft.</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={15000}
                    step={100}
                    value={sqft}
                    onChange={(e) => setSqft(Number(e.target.value))}
                    className="w-full accent-[#FF6F2C] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-['Montserrat',sans-serif] text-xs font-semibold uppercase text-[#263238]">
                    Quality Tier & Finishes
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['standard', 'premium', 'luxury'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTier(t)}
                        className={`py-2.5 px-3 rounded-[8px] border font-['Montserrat',sans-serif] text-xs font-semibold uppercase tracking-wider text-center transition-all cursor-pointer ${
                          tier === t
                            ? 'border-[#FF6F2C] bg-[#FF6F2C] text-white shadow-xs'
                            : 'border-[#F1EFEC] bg-white text-[#263238] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {t} (₹{rates[projectType][t]}/sqft)
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="bg-[#263238] text-white p-6 rounded-[10px] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="font-['Montserrat',sans-serif] text-xs uppercase tracking-widest text-[#FAF8F5]/80">Estimated Investment</span>
                    <div className="font-['Montserrat',sans-serif] text-2xl sm:text-4xl font-bold text-[#FF6F2C]">
                      ₹{(totalCost / 100000).toFixed(2)} Lakhs
                      <span className="text-xs font-normal text-[#FAF8F5]/70 ml-2">(₹{totalCost.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 font-['Montserrat',sans-serif] text-xs text-[#FAF8F5]">
                    Rate: <span className="text-white font-bold">₹{currentRate}/sqft</span>
                  </div>
                </div>

                {/* Itemized Breakdown Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-['Inter',sans-serif] text-xs">
                  <div className="bg-white/10 p-3 rounded-[8px]">
                    <span className="text-[#FAF8F5]/70 block text-[10px] uppercase font-['Montserrat',sans-serif]">Civil Structure (45%)</span>
                    <span className="font-bold text-white text-sm">₹{(civilCost / 100000).toFixed(2)} L</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-[8px]">
                    <span className="text-[#FAF8F5]/70 block text-[10px] uppercase font-['Montserrat',sans-serif]">MEP & Utilities (20%)</span>
                    <span className="font-bold text-white text-sm">₹{(mepCost / 100000).toFixed(2)} L</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-[8px]">
                    <span className="text-[#FAF8F5]/70 block text-[10px] uppercase font-['Montserrat',sans-serif]">Façade & Windows (15%)</span>
                    <span className="font-bold text-white text-sm">₹{(facadeCost / 100000).toFixed(2)} L</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-[8px]">
                    <span className="text-[#FAF8F5]/70 block text-[10px] uppercase font-['Montserrat',sans-serif]">Finishes & Fittings (20%)</span>
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
                <div className="bg-[#FAF8F5] border border-[#F1EFEC] p-4 rounded-[10px]">
                  <label className="block font-['Montserrat',sans-serif] text-xs font-semibold uppercase text-[#263238] mb-1">
                    Plot Width (Ft)
                  </label>
                  <input
                    type="number"
                    value={plotWidth}
                    onChange={(e) => setPlotWidth(Math.max(10, Number(e.target.value)))}
                    className="w-full bg-white border border-[#D9D6D2] rounded-[8px] px-3 py-2 text-sm font-semibold font-['Montserrat',sans-serif] text-[#263238] focus:border-[#FF6F2C] outline-none"
                  />
                </div>

                <div className="bg-[#FAF8F5] border border-[#F1EFEC] p-4 rounded-[10px]">
                  <label className="block font-['Montserrat',sans-serif] text-xs font-semibold uppercase text-[#263238] mb-1">
                    Plot Length (Ft)
                  </label>
                  <input
                    type="number"
                    value={plotLength}
                    onChange={(e) => setPlotLength(Math.max(10, Number(e.target.value)))}
                    className="w-full bg-white border border-[#D9D6D2] rounded-[8px] px-3 py-2 text-sm font-semibold font-['Montserrat',sans-serif] text-[#263238] focus:border-[#FF6F2C] outline-none"
                  />
                </div>

                <div className="bg-[#FAF8F5] border border-[#F1EFEC] p-4 rounded-[10px]">
                  <label className="block font-['Montserrat',sans-serif] text-xs font-semibold uppercase text-[#263238] mb-1">
                    Road Width (Ft)
                  </label>
                  <select
                    value={roadWidth}
                    onChange={(e) => setRoadWidth(e.target.value as any)}
                    className="w-full bg-white border border-[#D9D6D2] rounded-[8px] px-3 py-2 text-sm font-semibold font-['Montserrat',sans-serif] text-[#263238] focus:border-[#FF6F2C] outline-none cursor-pointer"
                  >
                    <option value="30">30 Ft Road</option>
                    <option value="40">40 Ft Road</option>
                    <option value="60">60+ Ft Wide Avenue</option>
                  </select>
                </div>
              </div>

              {/* FAR Results */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#FFF7F2] border border-[#FFF1E9] p-4 rounded-[10px]">
                  <span className="font-['Montserrat',sans-serif] text-[10px] uppercase tracking-wider text-[#667078] block">Total Plot Area</span>
                  <span className="font-['Montserrat',sans-serif] text-xl font-bold text-[#263238]">{totalPlotArea.toLocaleString()} Sq. Ft.</span>
                </div>

                <div className="bg-[#FFF7F2] border border-[#FFF1E9] p-4 rounded-[10px]">
                  <span className="font-['Montserrat',sans-serif] text-[10px] uppercase tracking-wider text-[#667078] block">Permissible FAR</span>
                  <span className="font-['Montserrat',sans-serif] text-xl font-bold text-[#FF6F2C]">{farRatio} : 1</span>
                </div>

                <div className="bg-[#FFF7F2] border border-[#FFF1E9] p-4 rounded-[10px]">
                  <span className="font-['Montserrat',sans-serif] text-[10px] uppercase tracking-wider text-[#667078] block">Max Built-Up Area</span>
                  <span className="font-['Montserrat',sans-serif] text-xl font-bold text-[#263238]">{maxBuildableSqft.toLocaleString()} Sq. Ft.</span>
                </div>

                <div className="bg-[#FFF7F2] border border-[#FFF1E9] p-4 rounded-[10px]">
                  <span className="font-['Montserrat',sans-serif] text-[10px] uppercase tracking-wider text-[#667078] block">Ground Coverage</span>
                  <span className="font-['Montserrat',sans-serif] text-xl font-bold text-[#263238]">{maxGroundCoverageSqft.toLocaleString()} Sq. Ft.</span>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-[8px] border border-[#F1EFEC] flex items-center justify-between font-['Inter',sans-serif] text-xs">
                <span className="text-[#667078]">Recommended Setbacks:</span>
                <span className="font-semibold text-[#263238]">Front: {frontSetback}ft | Rear: {rearSetback}ft</span>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE GENERATOR */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] border border-[#F1EFEC] p-4 rounded-[10px]">
                  <label className="block font-['Montserrat',sans-serif] text-xs font-semibold uppercase text-[#263238] mb-1">
                    Project Built-Up Area (Sq. Ft.)
                  </label>
                  <input
                    type="number"
                    value={timelineSqft}
                    onChange={(e) => setTimelineSqft(Math.max(500, Number(e.target.value)))}
                    className="w-full bg-white border border-[#D9D6D2] rounded-[8px] px-3 py-2 text-sm font-semibold font-['Montserrat',sans-serif] text-[#263238] focus:border-[#FF6F2C] outline-none"
                  />
                </div>

                <div className="bg-[#FAF8F5] border border-[#F1EFEC] p-4 rounded-[10px]">
                  <label className="block font-['Montserrat',sans-serif] text-xs font-semibold uppercase text-[#263238] mb-1">
                    Number of Floors (G+N)
                  </label>
                  <select
                    value={floors}
                    onChange={(e) => setFloors(Number(e.target.value))}
                    className="w-full bg-white border border-[#D9D6D2] rounded-[8px] px-3 py-2 text-sm font-semibold font-['Montserrat',sans-serif] text-[#263238] focus:border-[#FF6F2C] outline-none cursor-pointer"
                  >
                    <option value={1}>Ground Floor Only (G)</option>
                    <option value={2}>Ground + 1 Floor (G+1)</option>
                    <option value={3}>Ground + 2 Floors (G+2)</option>
                    <option value={4}>Ground + 3 Floors (G+3)</option>
                  </select>
                </div>
              </div>

              {/* Total Duration Banner */}
              <div className="bg-[#263238] text-white p-5 rounded-[10px] flex items-center justify-between">
                <div>
                  <span className="font-['Montserrat',sans-serif] text-xs uppercase tracking-widest text-[#FAF8F5]/80">Target Delivery Schedule</span>
                  <div className="font-['Montserrat',sans-serif] text-2xl font-bold text-[#FF6F2C]">
                    {baseMonths} Months ({totalWeeks} Weeks)
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-2 text-xs font-['Montserrat',sans-serif] text-[#FAF8F5]">
                  <ShieldCheck className="w-5 h-5 text-[#FF6F2C]" />
                  <span>Guaranteed Turnkey Timeline</span>
                </div>
              </div>

              {/* Milestone Phases List */}
              <div className="space-y-2.5">
                {phases.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#FAF8F5] border border-[#F1EFEC] p-3.5 rounded-[8px] font-['Inter',sans-serif] text-xs">
                    <div className="flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6F2C]" />
                      <span className="font-semibold text-[#263238]">{p.title}</span>
                    </div>
                    <span className="bg-white border border-[#F1EFEC] px-3 py-1 rounded-[6px] font-semibold text-[#667078]">
                      {p.duration} ({p.pct})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 py-4 border-t border-[#F1EFEC] bg-[#FAF8F5] gap-3">
          <div className="text-xs text-[#667078] font-['Inter',sans-serif] text-center sm:text-left">
            *Estimates are indicative based on PERSQFT engineered benchmarks.
          </div>

          <button
            onClick={handleApplyEstimateToEnquiry}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-6 py-3 rounded-[8px] font-['Montserrat',sans-serif] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            <span>GET OFFICIAL QUOTE FOR THIS SPEC</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
