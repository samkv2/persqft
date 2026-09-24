import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, User, Phone, AlertCircle, Sparkles } from 'lucide-react';
import { cmsStore } from '../data/cmsStore';

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
    email: '',
    service: initialProjectTitle || 'Residential Construction',
    area: '1000 - 2000 sqft',
    message: '',
  });

  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (initialProjectTitle) {
      setFormData((prev) => ({ ...prev, service: initialProjectTitle }));
    }
  }, [initialProjectTitle]);

  if (!isOpen) return null;

  // 1. Name input handler: Disallow numbers and symbols in real-time
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strictly allow only alphabet letters, spaces, hyphens, and apostrophes
    const cleaned = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
    setFormData((prev) => ({ ...prev, name: cleaned }));
    if (errors.name) {
      validateName(cleaned);
    }
  };

  const validateName = (name: string): boolean => {
    const trimmed = name.trim();
    if (!trimmed) {
      setErrors((prev) => ({ ...prev, name: 'Full name is required.' }));
      return false;
    }
    const letters = trimmed.replace(/[^a-zA-Z]/g, '');
    if (letters.length < 3) {
      setErrors((prev) => ({
        ...prev,
        name: 'Name must contain at least 3 letters (numbers not allowed).',
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: undefined }));
    return true;
  };

  // 2. Phone input handler: Strictly numbers, stop typing immediately after 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Extract digits only and strictly limit to 10 characters
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData((prev) => ({ ...prev, phone: digits }));
    if (errors.phone) {
      validatePhone(digits);
    }
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: '10-digit mobile number is required.' }));
      return false;
    }
    if (phone.length < 10) {
      setErrors((prev) => ({
        ...prev,
        phone: `Please enter complete 10-digit mobile number (${phone.length}/10 entered).`,
      }));
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Mobile number must start with 6, 7, 8, or 9.',
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: undefined }));
    return true;
  };

  // 3. Message / Project note input handler: Max 500 chars, block pure numbers / phone numbers
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 500);
    setFormData((prev) => ({ ...prev, message: val }));
    if (errors.message) {
      validateMessage(val);
    }
  };

  const validateMessage = (message: string): boolean => {
    const trimmed = message.trim();
    if (!trimmed) {
      setErrors((prev) => ({ ...prev, message: undefined }));
      return true;
    }

    // Check if user entered ONLY a phone number or numeric digits
    const digitsOnly = trimmed.replace(/\D/g, '');
    const lettersCount = (trimmed.match(/[a-zA-Z]/g) || []).length;

    if (lettersCount < 5 && digitsOnly.length >= 5) {
      setErrors((prev) => ({
        ...prev,
        message: 'Message cannot be only a phone number or numbers. Please describe your project requirements.',
      }));
      return false;
    }

    if (trimmed.length < 10) {
      setErrors((prev) => ({
        ...prev,
        message: 'Please enter at least 10 characters describing your project requirements.',
      }));
      return false;
    }

    if (lettersCount < 5) {
      setErrors((prev) => ({
        ...prev,
        message: 'Please enter meaningful details using words/letters, not just numbers or symbols.',
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, message: undefined }));
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const isNameValid = validateName(formData.name);
    const isPhoneValid = validatePhone(formData.phone);
    const isMessageValid = validateMessage(formData.message);

    if (!isNameValid || !isPhoneValid || !isMessageValid) {
      return;
    }

    setSubmitting(true);

    try {
      const createdInquiry = await cmsStore.addInquiry({
        fullName: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${formData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@persqft-client.com`,
        serviceRequired: formData.service,
        areaSqft: formData.area,
        projectNote: formData.message.trim() || 'No additional note provided.',
      });

      setSubmitting(false);
      setSubmitted(true);
      setRefId(createdInquiry.referenceId);
    } catch (err: unknown) {
      setSubmitting(false);
      const errMsg = err instanceof Error ? err.message : 'Failed to submit inquiry. Please try again.';
      setServerError(errMsg);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setErrors({});
    setServerError('');
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: initialProjectTitle || 'Residential Construction',
      area: '1000 - 2000 sqft',
      message: '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      {/* Light-Themed Modal Card */}
      <div className="relative w-full max-w-lg bg-white border border-[#F1EFEC] p-6 sm:p-8 rounded-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.25)] text-[#263238] overflow-hidden my-auto">
        
        {/* Subtle Warm Gradient Accent Line on Top */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF6F2C] to-[#E85B1E]" />

        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 bg-[#FAF8F5] hover:bg-[#F1EFEC] text-[#667078] hover:text-[#263238] rounded-[8px] transition-all cursor-pointer border border-[#F1EFEC]"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          /* SUCCESS STATE */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-block px-3 py-1 rounded-[6px] bg-emerald-100/80 text-emerald-800 font-['Montserrat',sans-serif] text-[11px] font-bold uppercase tracking-wider">
                ✓ INQUIRY RECEIVED
              </div>
              <h3 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight">
                Thank You, {formData.name.split(' ')[0]}!
              </h3>
              <p className="text-[#667078] text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                Our chief architectural engineering team will contact you at <strong className="text-[#263238]">+91 {formData.phone}</strong> within 24 hours to review your project estimate.
              </p>
            </div>

            <div className="p-3.5 rounded-[10px] bg-[#FAF8F5] border border-[#F1EFEC] max-w-xs mx-auto">
              <div className="text-[10px] font-['Montserrat',sans-serif] uppercase text-[#667078] font-semibold tracking-wider">
                OFFICIAL REFERENCE ID
              </div>
              <div className="font-['Montserrat',sans-serif] text-sm sm:text-base text-[#FF6F2C] font-bold tracking-wider mt-0.5">
                #{refId}
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="mt-2 px-6 py-3 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white font-['Montserrat',sans-serif] text-xs font-semibold tracking-wider uppercase rounded-[8px] shadow-sm cursor-pointer transition-all w-full"
            >
              CLOSE
            </button>
          </div>
        ) : (
          /* FORM STATE - LIGHT THEMED */
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            <div className="mb-4 pr-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[6px] bg-[#FFF1E9] border border-[#FFF1E9] font-['Montserrat',sans-serif] text-[10.5px] font-semibold text-[#FF6F2C] uppercase tracking-[0.18em] mb-2">
                <Sparkles className="w-3 h-3 text-[#FF6F2C]" />
                <span>GET A QUOTE</span>
              </div>
              <h3 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight">
                Start Your Project
              </h3>
              <p className="text-[#667078] text-xs sm:text-sm mt-1 leading-relaxed">
                Get an accurate architectural cost estimate &amp; engineering consultation for your construction.
              </p>
            </div>

            {/* 1. Name Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-['Montserrat',sans-serif] text-[11px] font-semibold text-[#263238] uppercase tracking-wider">
                  YOUR FULL NAME <span className="text-[#FF6F2C]">*</span>
                </label>
                <span className="text-[10px] text-[#667078] font-sans">Letters only</span>
              </div>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#667078] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  onBlur={() => validateName(formData.name)}
                  placeholder="e.g. Vikramaditya Sharma"
                  className={`w-full bg-[#FFFFFF] border ${
                    errors.name
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                      : 'border-[#D9D6D2] hover:border-[#FF6F2C]/50 focus:border-[#FF6F2C]'
                  } pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#263238] placeholder:text-[#667078]/60 rounded-[8px] focus:outline-none transition-all shadow-2xs font-medium`}
                />
              </div>
              {errors.name && (
                <p className="text-rose-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* 2. Phone Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-['Montserrat',sans-serif] text-[11px] font-semibold text-[#263238] uppercase tracking-wider">
                  MOBILE NUMBER <span className="text-[#FF6F2C]">*</span>
                </label>
                <span className={`font-['Montserrat',sans-serif] text-[10.5px] font-semibold ${formData.phone.length === 10 ? 'text-emerald-600' : 'text-[#667078]'}`}>
                  {formData.phone.length}/10 Digits
                </span>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-[#263238] font-['Montserrat',sans-serif] text-xs font-bold border-r border-[#D9D6D2] pr-2.5">
                  <Phone className="w-3.5 h-3.5 text-[#FF6F2C] mr-1" />
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={10}
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  onBlur={() => validatePhone(formData.phone)}
                  placeholder="9876543210"
                  className={`w-full bg-[#FFFFFF] border ${
                    errors.phone
                      ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                      : 'border-[#D9D6D2] hover:border-[#FF6F2C]/50 focus:border-[#FF6F2C]'
                  } pl-20 pr-3.5 py-2.5 text-xs sm:text-sm text-[#263238] placeholder:text-[#667078]/60 rounded-[8px] focus:outline-none transition-all shadow-2xs font-['Montserrat',sans-serif] font-medium`}
                />
              </div>
              {errors.phone && (
                <p className="text-rose-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            {/* 3. Service & Area Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-['Montserrat',sans-serif] text-[11px] font-semibold text-[#263238] uppercase tracking-wider mb-1">
                  SERVICE REQUIRED <span className="text-[#FF6F2C]">*</span>
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#D9D6D2] hover:border-[#FF6F2C]/50 focus:border-[#FF6F2C] px-3.5 py-2.5 text-xs sm:text-sm text-[#263238] font-medium rounded-[8px] focus:outline-none transition-all shadow-2xs cursor-pointer"
                >
                  <option value="Residential Construction">Residential Construction</option>
                  <option value="Commercial Construction">Commercial Construction</option>
                  <option value="Architecture & Planning">Architecture & Planning</option>
                  <option value="Interior Execution">Interior Execution</option>
                  <option value="Renovation & Remodeling">Renovation & Remodeling</option>
                  <option value="Turnkey Villa Build">Turnkey Villa Build</option>
                </select>
              </div>

              <div>
                <label className="block font-['Montserrat',sans-serif] text-[11px] font-semibold text-[#263238] uppercase tracking-wider mb-1">
                  APPROX. AREA
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full bg-[#FFFFFF] border border-[#D9D6D2] hover:border-[#FF6F2C]/50 focus:border-[#FF6F2C] px-3.5 py-2.5 text-xs sm:text-sm text-[#263238] font-medium rounded-[8px] focus:outline-none transition-all shadow-2xs cursor-pointer"
                >
                  <option value="Under 1000 sqft">Under 1,000 sqft</option>
                  <option value="1000 - 2000 sqft">1,000 - 2,000 sqft</option>
                  <option value="2000 - 5000 sqft">2,000 - 5,000 sqft</option>
                  <option value="5000+ sqft">5,000+ sqft</option>
                </select>
              </div>
            </div>

            {/* 4. Project Note / Message */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-['Montserrat',sans-serif] text-[11px] font-semibold text-[#263238] uppercase tracking-wider">
                  PROJECT NOTE <span className="text-[#667078] font-sans font-normal">(OPTIONAL)</span>
                </label>
                <span className="font-['Montserrat',sans-serif] text-[10px] text-[#667078]">
                  {formData.message.length}/500
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={500}
                value={formData.message}
                onChange={handleMessageChange}
                onBlur={() => validateMessage(formData.message)}
                placeholder="Plot dimensions, city/location, floors, or special architectural requirements..."
                className={`w-full bg-[#FFFFFF] border ${
                  errors.message
                    ? 'border-rose-400 bg-rose-50/30 focus:border-rose-500'
                    : 'border-[#D9D6D2] hover:border-[#FF6F2C]/50 focus:border-[#FF6F2C]'
                } px-3.5 py-2.5 text-xs sm:text-sm text-[#263238] placeholder:text-[#667078]/60 rounded-[8px] focus:outline-none transition-all shadow-2xs resize-none font-medium`}
              />
              {errors.message && (
                <p className="text-rose-600 text-[11px] font-medium mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.message}</span>
                </p>
              )}
            </div>

            {serverError && (
              <div className="p-3 rounded-[8px] bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white font-['Montserrat',sans-serif] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-[8px] shadow-sm active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>SUBMITTING ESTIMATE...</span>
                </div>
              ) : (
                <>
                  <span>REQUEST ESTIMATE</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
