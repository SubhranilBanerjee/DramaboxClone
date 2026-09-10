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
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-4 border-b border-[#202020] last:border-b-0">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-3 px-4 md:px-0">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && <p className="text-[11px] text-[#8F8F98] mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-1.5">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs font-semibold text-[#8F8F98] hover:text-[#FF007A] transition-colors mr-1"
            >
              See All
            </Link>
          )}
          {/* Compact Scroll Buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => handleScroll('left')}
              className="w-7 h-7 rounded-full border border-[#292929] text-[#8F8F98] hover:text-white hover:border-[#FF007A] bg-[#151515] flex items-center justify-center transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="w-7 h-7 rounded-full border border-[#292929] text-[#8F8F98] hover:text-white hover:border-[#FF007A] bg-[#151515] flex items-center justify-center transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Compact Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth px-4 md:px-0 pb-2"
      >
        {dramas.map((drama) => (
          <div
            key={drama.id}
            className="w-[135px] sm:w-[155px] md:w-[170px] shrink-0"
          >
            <DramaCard drama={drama} />
          </div>
        ))}
      </div>
    </section>
  );
};
