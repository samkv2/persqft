import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProjectTitle?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  initialProjectTitle = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: initialProjectTitle || 'Residential Construction',
    area: '1000 - 2000 sqft',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setRefId(`PSQFT-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 800);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn select-none">
      
      {/* Sleek Compact Dark-Navy Modal Card */}
      <div className="relative w-full max-w-md bg-[#080E1A] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl text-white">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 bg-slate-900 border border-slate-800 hover:border-[#F48033] text-slate-400 hover:text-white rounded-full transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          /* SUCCESS STATE */
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 bg-[#F48033]/20 border border-[#F48033] rounded-full flex items-center justify-center mx-auto text-[#F48033]">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>

            <h3 className="font-heading text-2xl font-black text-white uppercase tracking-tight">
              INQUIRY RECEIVED!
            </h3>

            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
              Our chief architectural team will contact you within 24 hours to discuss your project estimation.
            </p>

            <div className="pt-2 font-mono text-[11px] text-[#F48033] font-bold">
              REFERENCE ID: #{refId}
            </div>

            <button
              onClick={handleResetAndClose}
              className="mt-4 px-6 py-2.5 bg-[#F48033] hover:bg-[#d96a20] text-white font-mono text-xs font-bold tracking-wider uppercase rounded-xl shadow-md cursor-pointer transition-all w-full"
            >
              CLOSE
            </button>
          </div>
        ) : (
          /* FORM STATE */
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="mb-2">
              <div className="font-mono text-[11px] font-bold text-[#F48033] uppercase tracking-[0.2em] mb-1">
                GET A QUOTE
              </div>
              <h3 className="font-heading text-2xl font-black text-white tracking-tight">
                Start Your Project
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Get an accurate architectural cost estimate for your construction.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-slate-300 uppercase mb-1">
                YOUR NAME *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikramaditya Sharma"
                className="w-full bg-[#0D1526] border border-slate-800 focus:border-[#F48033] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 rounded-xl focus:outline-none transition-colors"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-slate-300 uppercase mb-1">
                PHONE NUMBER *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-[#0D1526] border border-slate-800 focus:border-[#F48033] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 rounded-xl focus:outline-none transition-colors"
              />
            </div>

            {/* Service Select */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-slate-300 uppercase mb-1">
                SERVICE REQUIRED *
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full bg-[#0D1526] border border-slate-800 focus:border-[#F48033] px-3.5 py-2.5 text-xs text-white rounded-xl focus:outline-none transition-colors"
              >
                <option value="Residential Construction">Residential Construction</option>
                <option value="Commercial Construction">Commercial Construction</option>
                <option value="Architecture & Planning">Architecture & Planning</option>
                <option value="Interior Execution">Interior Execution</option>
                <option value="Renovation & Remodeling">Renovation & Remodeling</option>
                <option value="Turnkey Villa Build">Turnkey Villa Build</option>
              </select>
            </div>

            {/* Area Range */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-slate-300 uppercase mb-1">
                APPROXIMATE AREA (SQFT)
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full bg-[#0D1526] border border-slate-800 focus:border-[#F48033] px-3.5 py-2.5 text-xs text-white rounded-xl focus:outline-none transition-colors"
              >
                <option value="Under 1000 sqft">Under 1000 sqft</option>
                <option value="1000 - 2000 sqft">1000 - 2000 sqft</option>
                <option value="2000 - 5000 sqft">2000 - 5000 sqft</option>
                <option value="5000+ sqft">5000+ sqft</option>
              </select>
            </div>

            {/* Optional Note */}
            <div>
              <label className="block font-mono text-[10px] font-bold text-slate-300 uppercase mb-1">
                PROJECT NOTE (OPTIONAL)
              </label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Plot dimensions, location, or special requirements..."
                className="w-full bg-[#0D1526] border border-slate-800 focus:border-[#F48033] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 rounded-xl focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#F48033] hover:bg-[#d96a20] text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {submitting ? (
                <span>SUBMITTING...</span>
              ) : (
                <>
                  <span>REQUEST ESTIMATE</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
