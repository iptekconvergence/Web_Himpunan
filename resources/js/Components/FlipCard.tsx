import React from 'react';

export interface FlipCardProps {
  data: {
    name: string;
    username: string;
    image: string;
    bio: string;
    periodName?: string;
    nim?: string;
    stats?: {
      following?: number | string;
      followers?: number | string;
      posts?: number | string;
    };
    socialLinks: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      instagram?: string;
    };
  };
}

export function FlipCard({ data }: FlipCardProps) {
  return (
    <div className="group h-[380px] w-full max-w-[300px] [perspective:1000px] mx-auto cursor-pointer">
      <div className="relative h-full w-full rounded-[24px] shadow-lg transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:shadow-2xl group-hover:scale-[1.02]">
        
        {/* Front Face */}
        <div className="absolute inset-0 h-full w-full rounded-[24px] [backface-visibility:hidden] overflow-hidden">
          
          {/* Background Layer */}
          <div className="absolute inset-0 h-full w-full rounded-[24px] bg-gradient-to-br from-[#4F46E5] to-[#0F172A] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
            {/* Subtle glow & abstract pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 mix-blend-overlay"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#2563EB] rounded-full blur-[80px] opacity-40"></div>
          </div>

          {/* Content Layer */}
          <div className="absolute inset-0 flex flex-col h-full w-full">
            
            {/* Top Info Section - compact, tight to top */}
            <div className="flex flex-col items-center z-10 px-4 text-center pt-6">
              <h2 className="text-xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
                {data.name}
              </h2>
              <div className="mt-2 flex flex-col gap-0.5 items-center text-center">
                <p className="text-[14px] font-semibold text-[rgba(255,255,255,0.9)] drop-shadow-sm text-center">
                  {data.username}
                </p>
                <p className="text-[11px] font-medium text-[rgba(255,255,255,0.7)] text-center leading-tight">
                  Periode {data.periodName || '2025–2026'}
                </p>
                {data.nim && (
                  <p className="text-[11px] font-medium text-[rgba(255,255,255,0.7)] text-center leading-tight">
                    NIM: {data.nim}
                  </p>
                )}
              </div>
            </div>
            
            {/* Image Section - fills remaining space, contained inside card */}
            <div className="relative flex-grow w-full flex items-end justify-center overflow-hidden">
              <img 
                src={data.image} 
                alt={data.name} 
                className="absolute bottom-0 h-[270px] w-auto max-w-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] z-20 pointer-events-none" 
              />
            </div>
            
            {/* Glass highlight at the bottom edge */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/40 to-transparent rounded-b-[24px] pointer-events-none z-10"></div>
          </div>
        </div>
        
        {/* Back Face */}
        <div className="absolute inset-0 h-full w-full rounded-[24px] bg-gradient-to-br from-[#5B3E93] to-slate-900 px-6 py-8 text-white [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between items-center text-center shadow-2xl overflow-hidden">
          
          {/* Decorative glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-purple-500 rounded-full blur-[60px] opacity-30 pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>

          {/* Name & Role */}
          <div className="text-center z-10 w-full flex flex-col items-center">
            <h3 className="font-bold text-lg leading-tight text-center">{data.name}</h3>
            <p className="text-sm text-purple-300 mt-1 font-medium text-center">{data.username}</p>
          </div>

          {/* Bio */}
          <div className="z-10 flex-grow w-full flex flex-col justify-center items-center text-center px-1">
            <p className="text-sm text-white/80 text-center leading-relaxed line-clamp-5 w-full">
              {data.bio}
            </p>
          </div>

          {/* Instagram Link */}
          <div className="z-10 w-full flex justify-center">
            <a
              href={data.socialLinks.instagram && data.socialLinks.instagram !== '#' ? data.socialLinks.instagram : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all ring-1 ring-white/20 ${data.socialLinks.instagram && data.socialLinks.instagram !== '#' ? 'bg-white/10 hover:bg-white/20 hover:scale-[1.02] cursor-pointer' : 'bg-white/5 opacity-50 cursor-default'}`}
            >
              <svg className="w-5 h-5 text-pink-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
              </svg>
              Instagram
            </a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
