import React from 'react';
import bannerImg from '../assets/Persqft_Banner_name_page-0001.jpg';

export const TrustSeparator: React.FC = () => {
  return (
    <section aria-label="PERSQFT Brand Banner" className="relative z-20 w-full bg-white border-y border-slate-200/80 py-1 sm:py-1.5 select-none">
      <div className="w-full max-w-[1920px] mx-auto px-1 sm:px-2 flex items-center justify-center">
        <img
          src={bannerImg}
          alt="PERSQFT CONSTRUCTIONS - Transforming Quality, Defining Construction"
          className="w-full h-auto max-h-[140px] sm:max-h-[180px] md:max-h-[220px] object-contain mx-auto block"
          loading="eager"
        />
      </div>
    </section>
  );
};
