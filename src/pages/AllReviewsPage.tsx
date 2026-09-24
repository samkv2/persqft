import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  CheckCircle2,
  MapPin,
  Sparkles,
  ShieldCheck,
  Phone,
  ThumbsUp,
} from 'lucide-react';
import clientAvatar1Webp from '../assets/clientAvatar1.webp';
import clientAvatar1Jpg from '../assets/clientAvatar1.jpg';
import testimonialVillaWebp from '../assets/testimonialVilla.webp';
import testimonialVillaJpg from '../assets/testimonialVilla.jpg';
import elevationWebp from '../assets/serviceElevation.webp';
import interiorWebp from '../assets/serviceInterior.webp';
import drawingsWebp from '../assets/serviceDrawings.webp';

interface AllReviewsPageProps {
  onBackToHome: () => void;
  onOpenEnquiry: (topic?: string) => void;
}

interface DetailedReview {
  id: string;
  name: string;
  role: string;
  location: string;
  projectType: string;
  category: 'Villas' | 'Elevation' | 'Commercial' | 'Interior';
  rating: number;
  date: string;
  quote: string;
  highlight: string;
  avatarWebp?: string;
  avatarJpg?: string;
  projectThumbnail?: string;
  verified: boolean;
}

export const AllReviewsPage: React.FC<AllReviewsPageProps> = ({ onBackToHome, onOpenEnquiry }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const reviews: DetailedReview[] = [
    {
      id: 'review-1',
      name: 'Dr. Sunita & Rajesh Sharma',
      role: 'Turnkey Residential Villa Owners',
      location: 'Civil Lines, Sultanpur, UP',
      projectType: '4,200 sq.ft Duplex Villa',
      category: 'Villas',
      rating: 5,
      date: 'January 2026',
      highlight: 'Delivered 2 weeks before schedule with zero hidden charges!',
      quote: 'Building our family villa with PERSQFT was the best decision we made. From the initial 3D walkthroughs to the final marble laying, their chief engineers were on site every single day. The quality of concrete and reinforcement was tested in certified labs. Absolutely transparent!',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
      projectThumbnail: testimonialVillaWebp,
      verified: true,
    },
    {
      id: 'review-2',
      name: 'Er. Vikramaditya Singh',
      role: 'Commercial Project Consultant',
      location: 'Aligarh Road, Hathras, UP',
      projectType: 'Commercial Arcade G+3',
      category: 'Commercial',
      rating: 5,
      date: 'December 2025',
      highlight: 'Exceptional structural calculation and municipal setback compliance.',
      quote: 'As a civil engineer myself, I am very critical of structural workmanship. PERSQFT handled our 14,000 sq.ft commercial plaza with textbook adherence to IS codes. Their column beam rebar schedules were immaculate and the glass facade detailing looks world-class.',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
      projectThumbnail: drawingsWebp,
      verified: true,
    },
    {
      id: 'review-3',
      name: 'Ananya & Amit Srivastava',
      role: 'Interior Architecture Clients',
      location: 'Gomti Nagar Extension, Lucknow, UP',
      projectType: 'Luxury 4BHK Penthouse Interiors',
      category: 'Interior',
      rating: 5,
      date: 'November 2025',
      highlight: 'Exact match between 3D CAD renders and executed woodwork.',
      quote: 'Usually interior designers promise 3D renders that look nothing like the finished work. With PERSQFT, the executed ceiling cove lighting, German modular kitchen, and custom fluted wall panels matched the 3D renders down to the exact color shade.',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
      projectThumbnail: interiorWebp,
      verified: true,
    },
    {
      id: 'review-4',
      name: 'Thakur Mahendra Pratap',
      role: 'Heritage Villa Residence',
      location: 'Near Ram Path, Ayodhya, UP',
      projectType: 'Traditional Haveli Architecture (5,500 sq.ft)',
      category: 'Villas',
      rating: 5,
      date: 'February 2026',
      highlight: 'Perfect harmony of Vastu principles and grand aesthetics.',
      quote: 'Our family wanted a home that respects our Ayodhya roots while offering modern structural comfort. The central courtyard planning and stone-carved elevation designed by PERSQFT has become the talk of the entire locality.',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
      projectThumbnail: elevationWebp,
      verified: true,
    },
    {
      id: 'review-5',
      name: 'Prof. Hemant K. Gupta',
      role: 'Elevation Remodeling Client',
      location: 'Marris Road, Aligarh, UP',
      projectType: 'Facade Modernization & Pergola Roof',
      category: 'Elevation',
      rating: 5,
      date: 'October 2025',
      highlight: 'Completely transformed our 20-year-old house into a modern masterpiece.',
      quote: 'We wanted to modernize our old ancestral home without demolishing the core structure. PERSQFT did a load-bearing test, added timber-finish aluminum louvers and warm LED light channels. The house now looks brand new and ultra-luxurious.',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
      projectThumbnail: elevationWebp,
      verified: true,
    },
    {
      id: 'review-6',
      name: 'Sandeep Agarwal',
      role: 'Retail Showroom Owner',
      location: 'Cantonment, Varanasi, UP',
      projectType: 'Multi-Brand Retail Showroom',
      category: 'Commercial',
      rating: 5,
      date: 'January 2026',
      highlight: 'Column-free open span design allowed maximum merchandise display.',
      quote: 'PERSQFT designed wide column-free RCC spans that gave us unbroken sightlines across our entire showroom floor. Their municipal approval assistance and fire-safety blueprints saved us weeks of government back-and-forth.',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
      projectThumbnail: drawingsWebp,
      verified: true,
    },
    {
      id: 'review-7',
      name: 'Dr. Alok Verma',
      role: 'Villa Owner',
      location: 'Civil Lines, Sultanpur, UP',
      projectType: 'Contemporary 3-Storey Home',
      category: 'Villas',
      rating: 5,
      date: 'September 2025',
      highlight: 'Zero cost-escalation from start to key handover.',
      quote: 'In building construction, cost overruns of 30-40% are notorious. PERSQFT committed to a fixed milestone estimate and never asked for a single extra rupee. Their WhatsApp progress updates kept me relaxed throughout.',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
      projectThumbnail: testimonialVillaWebp,
      verified: true,
    },
    {
      id: 'review-8',
      name: 'Meera Chawla',
      role: 'Interior Redesign Client',
      location: 'Agra Rd, Hathras, UP',
      projectType: 'Living Suite & Modular Kitchen',
      category: 'Interior',
      rating: 5,
      date: 'August 2025',
      highlight: 'Superb carpentry craftsmanship and durable hardware fittings.',
      quote: 'The soft-close hydraulic fittings, acrylic kitchen shutters, and concealed wardrobe sensor lights installed by PERSQFT are top-tier. They even provided a 5-year workmanship warranty certificate!',
      avatarWebp: clientAvatar1Webp,
      avatarJpg: clientAvatar1Jpg,
      projectThumbnail: interiorWebp,
      verified: true,
    },
  ];

  const categories = ['All', 'Villas', 'Elevation', 'Commercial', 'Interior'];

  const filteredReviews = activeCategory === 'All'
    ? reviews
    : reviews.filter((r) => r.category === activeCategory);

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
            <span className="text-[#FF6F2C] font-semibold">Client Testimonials &amp; Reviews</span>
          </div>
        </div>

        {/* ── HERO BANNER ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-6 sm:p-10 lg:p-12 mb-10 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFF1E9]/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#FFF1E9] border border-[#FF6F2C]/30 text-[#FF6F2C] px-3.5 py-1 rounded-[6px] text-xs font-['Montserrat',sans-serif] font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Experiences From Verified Homeowners</span>
            </div>

            <h1 className="font-['Montserrat',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#263238] tracking-tight leading-tight mb-4">
              What Our Clients Say Across Uttar Pradesh
            </h1>

            <p className="text-[#667078] text-sm sm:text-base leading-relaxed mb-6 font-normal">
              From Sultanpur and Hathras to Lucknow, Ayodhya, and Varanasi — read genuine feedback from families and business owners who entrusted their architectural dreams to PERSQFT Constructions.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenEnquiry('Review Page General Consultation')}
                className="inline-flex items-center gap-2 bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-6 sm:px-7 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <span>Build Your Dream Home With Us</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:+916306659601"
                className="inline-flex items-center gap-2 bg-white hover:bg-[#FFF1E9] text-[#263238] border border-[#FF6F2C] px-5 sm:px-6 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#FF6F2C]" />
                <span>Direct Call: +91 6306659601</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── RATING SCORECARD & TRUST METRICS ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-6 sm:p-8 mb-10 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Average Rating Block */}
          <div className="text-center md:text-left md:border-r border-[#F1EFEC] md:pr-8">
            <div className="font-['Montserrat',sans-serif] text-4xl sm:text-5xl font-bold text-[#263238] mb-1 flex items-center justify-center md:justify-start gap-2">
              <span>4.9</span>
              <span className="text-base text-[#667078] font-normal font-['Inter',sans-serif]">/ 5.0</span>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-1 text-[#FF6F2C] mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#FF6F2C] text-[#FF6F2C]" />
              ))}
            </div>

            <p className="text-xs text-[#667078]">
              Based on <strong>500+ completed projects</strong> across Uttar Pradesh
            </p>
          </div>

          {/* Star Breakdown */}
          <div className="space-y-2 md:border-r border-[#F1EFEC] md:pr-8">
            <div className="flex items-center gap-3 text-xs font-['Montserrat',sans-serif]">
              <span className="w-12 text-[#263238] font-semibold">5 Star</span>
              <div className="flex-1 bg-[#F1EFEC] h-2 rounded-full overflow-hidden">
                <div className="bg-[#FF6F2C] h-full w-[94%]" />
              </div>
              <span className="w-10 text-right text-[#667078]">94%</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-['Montserrat',sans-serif]">
              <span className="w-12 text-[#263238] font-semibold">4 Star</span>
              <div className="flex-1 bg-[#F1EFEC] h-2 rounded-full overflow-hidden">
                <div className="bg-[#FF6F2C] h-full w-[6%]" />
              </div>
              <span className="w-10 text-right text-[#667078]">6%</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-['Montserrat',sans-serif]">
              <span className="w-12 text-[#263238] font-semibold">3 Star</span>
              <div className="flex-1 bg-[#F1EFEC] h-2 rounded-full overflow-hidden">
                <div className="bg-[#FF6F2C] h-full w-[0%]" />
              </div>
              <span className="w-10 text-right text-[#667078]">0%</span>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-[#263238]">
              <CheckCircle2 className="w-4 h-4 text-[#FF6F2C] shrink-0" />
              <span><strong>100% On-Time Handover</strong> Guarantee</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#263238]">
              <ShieldCheck className="w-4 h-4 text-[#FF6F2C] shrink-0" />
              <span><strong>IS-Code Certified</strong> Earthquake-Resistant RCC</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#263238]">
              <ThumbsUp className="w-4 h-4 text-[#FF6F2C] shrink-0" />
              <span><strong>Zero Cost Escalation</strong> Milestone Payments</span>
            </div>
          </div>
        </div>

        {/* ── CATEGORY FILTER TABS ── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-[8px] font-['Montserrat',sans-serif] text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#FF6F2C] text-white shadow-xs'
                  : 'bg-white text-[#263238] border border-[#F1EFEC] hover:border-[#FF6F2C]'
              }`}
            >
              {cat === 'All' ? 'All Reviews' : `${cat} Projects`}
            </button>
          ))}
        </div>

        {/* ── TESTIMONIALS REVIEWS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 mb-14">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-[10px] border border-[#F1EFEC] shadow-xs hover:shadow-md hover:border-[#FF6F2C]/40 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Stars + Date + Location */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#FF6F2C]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FF6F2C] text-[#FF6F2C]" />
                    ))}
                  </div>

                  <span className="text-[11px] font-medium text-[#667078]">
                    {rev.date}
                  </span>
                </div>

                {/* Highlight Quote Header */}
                <div className="mb-3">
                  <h4 className="font-['Montserrat',sans-serif] font-bold text-base sm:text-lg text-[#263238] leading-snug">
                    "{rev.highlight}"
                  </h4>
                </div>

                {/* Full Body Quote */}
                <p className="font-['Inter',sans-serif] text-xs sm:text-sm text-[#667078] leading-relaxed mb-6">
                  {rev.quote}
                </p>

                {/* Project Specs Tag */}
                <div className="mb-6 p-2.5 bg-[#FAF8F5] rounded-[8px] border border-[#F1EFEC] flex items-center justify-between text-xs font-['Montserrat',sans-serif]">
                  <span className="text-[#667078]">Project: <strong className="text-[#263238]">{rev.projectType}</strong></span>
                  <span className="text-[#FF6F2C] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{rev.location}</span>
                  </span>
                </div>
              </div>

              {/* Bottom Author Card */}
              <div className="pt-4 border-t border-[#F1EFEC] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-[#F1EFEC] overflow-hidden shrink-0 flex items-center justify-center font-['Montserrat',sans-serif] font-bold text-sm text-[#FF6F2C]">
                    {rev.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-['Montserrat',sans-serif] font-bold text-xs sm:text-sm text-[#263238]">
                      {rev.name}
                    </h5>
                    <p className="text-[11px] text-[#667078]">
                      {rev.role}
                    </p>
                  </div>
                </div>

                {rev.verified && (
                  <span className="inline-flex items-center gap-1 bg-[#FFF1E9] text-[#FF6F2C] border border-[#FF6F2C]/30 text-[10px] font-['Montserrat',sans-serif] font-semibold px-2 py-0.5 rounded-[4px]">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Build</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── CLIENT SPOTLIGHT VILLA SHOWCASE ── */}
        <div className="bg-white rounded-[10px] border border-[#F1EFEC] p-6 sm:p-10 mb-12 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full lg:w-1/2 aspect-[16/10] rounded-[10px] overflow-hidden bg-[#FAF8F5] border border-[#F1EFEC]">
              <picture className="w-full h-full block">
                <source srcSet={testimonialVillaWebp} type="image/webp" />
                <img
                  src={testimonialVillaJpg}
                  alt="Verified PERSQFT Luxury Villa"
                  className="w-full h-full object-cover object-center"
                />
              </picture>
            </div>

            <div className="w-full lg:w-1/2 space-y-4">
              <span className="font-['Montserrat',sans-serif] text-xs font-bold uppercase tracking-wider text-[#FF6F2C]">
                SPOTLIGHT RESIDENTIAL HANDOVER
              </span>
              <h3 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight">
                "They turned our plot into a timeless family estate."
              </h3>
              <p className="text-xs sm:text-sm text-[#667078] leading-relaxed">
                4,200 sq.ft Turnkey Luxury Villa handed over with complete structural certification, Vastu-compliant layout, 3-car shaded porch, and high-efficiency cross ventilation.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenEnquiry('Consultation inspired by Villa Spotlight')}
                  className="bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-6 py-3 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-xs sm:text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Inquire About a Villa Like This</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM CTA ── */}
        <div className="bg-[#FAF8F5] border border-[#F1EFEC] rounded-[10px] p-8 sm:p-10 text-center max-w-3xl mx-auto shadow-xs">
          <h3 className="font-['Montserrat',sans-serif] text-2xl sm:text-3xl font-bold text-[#263238] tracking-tight mb-2">
            Be Our Next Happy Homeowner
          </h3>
          <p className="text-sm text-[#667078] max-w-md mx-auto mb-6">
            Contact us today for an on-site plot inspection, free cost estimate, and comprehensive 3D design consultation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenEnquiry('Review Page Final CTA')}
              className="bg-[#FF6F2C] hover:bg-[#E85B1E] text-white px-7 py-3.5 rounded-[8px] font-['Montserrat',sans-serif] font-semibold text-sm tracking-wide shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              Book Free Site Consultation
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
