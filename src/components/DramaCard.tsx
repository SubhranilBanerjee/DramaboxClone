'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Eye, Star } from 'lucide-react';
import { Drama } from '@/lib/types';

interface DramaCardProps {
  drama: Drama;
  featured?: boolean;
}

export const DramaCard: React.FC<DramaCardProps> = ({ drama, featured = false }) => {
  return (
    <div className="group flex flex-col bg-[#151515] border border-[#292929] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#FF007A] hover:shadow-[0_4px_16px_rgba(255,0,122,0.22)] hover:-translate-y-1">
      {/* Poster Image Container */}
      <div className="relative block aspect-[2/3] w-full overflow-hidden bg-[#0a0a0a]">
        <Link href={`/drama/${drama.id}`} className="block w-full h-full">
          <img
            src={drama.cover_image_url}
            alt={drama.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Top Episode Count Badge */}
        <div className="absolute top-2 left-2 flex items-center pointer-events-none">
          <span className="bg-[#070707]/85 backdrop-blur-md text-white border border-[#292929] text-[10px] font-bold px-1.5 py-0.5 rounded">
            {drama.total_episodes} EPS
          </span>
        </div>

        {/* Top Rating */}
        {drama.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#070707]/85 backdrop-blur-md text-[#FFC400] border border-[#292929] text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
            <Star className="w-2.5 h-2.5 fill-[#FFC400] text-[#FFC400]" />
            <span>{drama.rating}</span>
          </div>
        )}

        {/* Overlay Play Quick Action on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] pointer-events-none group-hover:pointer-events-auto">
          <Link
            href={`/watch/${drama.id}?ep=1`}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FF007A] hover:bg-[#E6006E] text-white flex items-center justify-center shadow-[0_2px_14px_rgba(255,0,122,0.6)] transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:scale-110"
            aria-label={`Watch ${drama.title}`}
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Compact Card Info */}
      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 bg-[#151515]">
        <div>
          <Link href={`/drama/${drama.id}`}>
            <h3 className="text-xs sm:text-[13px] font-bold text-white line-clamp-1 group-hover:text-[#FF007A] transition-colors">
              {drama.title}
            </h3>
          </Link>
          <p className="mt-0.5 text-[11px] text-[#8F8F98] line-clamp-1 leading-normal">
            {drama.description}
          </p>
        </div>

        {/* Tags and Views */}
        <div className="mt-2 pt-2 border-t border-[#222222] flex items-center justify-between text-[10px] text-[#8F8F98]">
          <div className="flex items-center gap-1 overflow-hidden">
            {drama.tags.slice(0, 1).map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#1c1c1c] text-[#FF007A] border border-[#FF007A]/25 px-1.5 py-0.5 rounded truncate max-w-[70px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {drama.views && (
            <div className="flex items-center gap-1 text-[#8F8F98] shrink-0 font-medium">
              <Eye className="w-3 h-3 text-[#8F8F98]" />
              <span>{drama.views}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
