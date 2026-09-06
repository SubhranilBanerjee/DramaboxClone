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
    <div className="group flex flex-col bg-[#0e0c1c] border border-[#221c3d] rounded-xl overflow-hidden transition-all duration-300 hover:border-pink-500/70 hover:shadow-[0_0_20px_rgba(255,42,141,0.25)] hover:-translate-y-1">
      {/* Poster Image Container */}
      <div className="relative block aspect-[3/4] w-full overflow-hidden bg-[#141126]">
        <Link href={`/drama/${drama.id}`} className="block w-full h-full">
          <img
            src={drama.cover_image_url}
            alt={drama.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          <span className="bg-[#080712]/85 backdrop-blur-md text-cyan-300 border border-cyan-500/40 text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_8px_rgba(0,240,255,0.3)]">
            {drama.total_episodes} EPS
          </span>
        </div>

        {/* Top Rating */}
        {drama.rating && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-[#080712]/85 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[11px] font-semibold px-2 py-0.5 rounded pointer-events-none">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
            <span>{drama.rating}</span>
          </div>
        )}

        {/* Overlay Play Quick Action on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] pointer-events-none group-hover:pointer-events-auto">
          <Link
            href={`/watch/${drama.id}?ep=1`}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,42,141,0.8)] transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:scale-110"
            aria-label={`Watch ${drama.title}`}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </Link>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-gradient-to-b from-[#0e0c1c] to-[#090814]">
        <div>
          <Link href={`/drama/${drama.id}`}>
            <h3 className="text-sm font-bold text-slate-100 line-clamp-1 group-hover:text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(255,42,141,0.6)] transition-all">
              {drama.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {drama.description}
          </p>
        </div>

        {/* Tags and Views */}
        <div className="mt-3 pt-2.5 border-t border-[#1f1a38] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {drama.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="bg-[#151229] text-pink-300/90 border border-pink-500/20 px-1.5 py-0.5 rounded truncate max-w-[80px]"
              >
                {tag}
              </span>
            ))}
          </div>

          {drama.views && (
            <div className="flex items-center gap-1 text-cyan-400/90 shrink-0 font-medium">
              <Eye className="w-3 h-3 text-cyan-400" />
              <span>{drama.views}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
