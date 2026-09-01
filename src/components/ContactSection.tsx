import React, { useState } from 'react';
import { User, Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setRefId(`PSQFT-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1000);
  };

  return (
    <section id="contact" className="relative bg-[#080E1A] text-white overflow-hidden select-none py-10 sm:py-12 lg:py-14 border-t border-slate-800">
      
      {/* ── DUAL ANGLED SPLIT BACKGROUND LAYERS ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        
        {/* 1. RIGHT SIDE: Pure Crisp Architectural Building Photo (No white blend, no orange arc) */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[60%] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
            alt="Architectural Luxury Building Render"
            className="w-full h-full object-cover object-center opacity-85"
          />
          {/* Subtle dark gradient overlay on left edge for seamless dark contrast */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080E1A] to-transparent" />
        </div>

        {/* 2. LEFT SIDE: Solid Dark Panel for Form Visibility */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-[45%] bg-[#080E1A] z-0" />
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Contact Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: HEADLINE & CONTACT INFORMATION */}
          <div className="lg:col-span-5 space-y-6 lg:space-y-8">
            <ScrollReveal direction="left">
              <div className="space-y-6">
                <div>
                  <div className="font-mono text-xs font-bold text-[#F48033] uppercase tracking-[0.25em] mb-2">
                    LET'S CONNECT
                  </div>
                  <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-[1.1]">
                    Get in touch with our <span className="text-[#F48033]">technical experts</span>
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4 font-normal">
                    We take our commitments to our users seriously. Reach out to us for any complaints, queries, or architectural project consultations, and we will be happy to assist you.
                  </p>
                </div>

                {/* CONTACT INFORMATION INNER CARD */}
                <div className="bg-[#0F172A]/90 border border-slate-700/70 rounded-2xl p-5 sm:p-6 space-y-4 backdrop-blur-md shadow-xl">
                  <div className="border-b border-slate-700/60 pb-3">
                    <h3 className="font-heading text-xs sm:text-sm font-bold uppercase text-white tracking-wider">
                      CONTACT INFORMATION
                    </h3>
                    <div className="w-10 h-0.5 bg-[#F48033] mt-1.5 rounded-full" />
                  </div>

                  <div className="space-y-3.5 text-xs sm:text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F48033]/15 border border-[#F48033]/30 flex items-center justify-center text-[#F48033] shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="text-slate-200 font-medium">Lucknow, Uttar Pradesh, India</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F48033]/15 border border-[#F48033]/30 flex items-center justify-center text-[#F48033] shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <span className="text-slate-400">Email: </span>
                        <a href="mailto:samk17@zohomail.in" className="text-[#F48033] font-mono font-semibold hover:underline">
                          samk17@zohomail.in
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F48033]/15 border border-[#F48033]/30 flex items-center justify-center text-[#F48033] shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-slate-400">Phone: </span>
                        <a href="tel:+919559422876" className="text-[#F48033] font-mono font-semibold hover:underline">
                          +91 9559422876
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT COLUMN: FLOATING WHITE FORM CARD */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="right" delay={100}>
            <div className="bg-white text-slate-900 border border-slate-200/90 p-6 sm:p-10 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] relative overflow-hidden">
              
              {/* Top-left Dot Matrix Decor */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-[radial-gradient(#CBD5E1_1.5px,transparent_1.5px)] [background-size:8px_8px] opacity-60 pointer-events-none" />

              {submitted ? (
                /* Success Message */
                <div className="text-center py-10 space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h3 className="font-heading text-2xl font-black uppercase text-slate-900">
                    Message Sent Successfully!
                  </h3>

                  <div className="inline-block bg-orange-50 border border-orange-200 px-4 py-2 rounded-xl font-mono text-xs text-[#F48033] font-bold shadow-2xs">
                    REFERENCE ID: {refId}
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto font-normal">
                    Thank you, <span className="text-slate-900 font-bold">{formData.name}</span>. Our technical team has received your message and will get back to you shortly.
                  </p>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* Sleek Form Fields */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Card Title & Divider */}
                  <div className="text-center mb-6 pt-2">
                    <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase text-slate-900 tracking-tight">
                      CONTACT <span className="text-[#F48033]">PERSQFT</span>
                    </h3>

                    {/* Subtle Orange Accent Divider */}
                    <div className="flex items-center justify-center gap-1.5 my-2">
                      <div className="w-10 h-0.5 bg-[#F48033] rounded-full" />
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F48033]" />
                      <div className="w-10 h-0.5 bg-[#F48033] rounded-full" />
                    </div>

                    <p className="text-slate-500 text-xs sm:text-sm font-normal">
                      Fill out the form below and we'll get back to you shortly.
                    </p>
                  </div>

                  {/* Input 1: Your Name */}
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full bg-slate-50/60 border border-slate-200/90 focus:border-[#F48033] focus:bg-white text-slate-900 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 font-normal shadow-2xs"
                    />
                  </div>

                  {/* Input 2: Your Email */}
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="w-full bg-slate-50/60 border border-slate-200/90 focus:border-[#F48033] focus:bg-white text-slate-900 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 font-normal shadow-2xs"
                    />
                  </div>

                  {/* Input 3: Your Mobile Number */}
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your Mobile Number"
                      className="w-full bg-slate-50/60 border border-slate-200/90 focus:border-[#F48033] focus:bg-white text-slate-900 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 font-normal shadow-2xs"
                    />
                  </div>

                  {/* Input 4: Your Message (optional) */}
                  <div className="relative flex items-start">
                    <MessageSquare className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message (optional)"
                      className="w-full bg-slate-50/60 border border-slate-200/90 focus:border-[#F48033] focus:bg-white text-slate-900 pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all placeholder:text-slate-400 resize-none font-normal shadow-2xs"
                    />
                  </div>

                  {/* Send Message Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#F48033] hover:bg-[#d96a20] text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-3"
                  >
                    {isSubmitting ? (
                      <span className="font-mono text-xs animate-pulse">SENDING...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
