import React from 'react';
import bannerImg from '../assets/Persqft_Banner_name_page-0001.jpg';

export const TrustSeparator: React.FC = () => {
  return (
    <section aria-label="PERSQFT Brand Banner" className="relative z-20 w-full bg-white border-y border-slate-200/90 py-3 sm:py-4 md:py-5 lg:py-6 shadow-xs select-none">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-10 flex items-center justify-center">
        <img
          src={bannerImg}
          alt="PERSQFT CONSTRUCTIONS - Transforming Quality, Defining Construction"
          className="w-full h-auto max-h-[85px] sm:max-h-[110px] md:max-h-[140px] lg:max-h-[165px] object-contain mx-auto"
          loading="eager"
        />
      </div>
    </section>
  );
};
