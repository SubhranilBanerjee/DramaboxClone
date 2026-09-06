'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Drama } from '@/lib/types';
import { DramaCard } from './DramaCard';

interface CategoryRowProps {
  title: string;
  subtitle?: string;
  dramas: Drama[];
  viewAllHref?: string;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  title,
  subtitle,
  dramas,
  viewAllHref,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-5 border-b border-[#1c1733] last:border-b-0">
      {/* Row Header */}
      <div className="flex items-end justify-between mb-4 px-4 md:px-0">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors mr-2"
            >
              See All
            </Link>
          )}
          {/* Scroll Buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => handleScroll('left')}
              className="p-1.5 rounded-lg border border-[#241e3d] text-slate-400 hover:text-cyan-400 hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] bg-[#0f0d1e] transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-1.5 rounded-lg border border-[#241e3d] text-slate-400 hover:text-cyan-400 hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] bg-[#0f0d1e] transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-0 pb-3"
      >
        {dramas.map((drama) => (
          <div
            key={drama.id}
            className="w-[180px] sm:w-[210px] md:w-[230px] shrink-0"
          >
            <DramaCard drama={drama} />
          </div>
        ))}
      </div>
    </section>
  );
};
