'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Flame, Star, Sparkles, TrendingUp, Heart, Shield, Clock } from 'lucide-react';
import { INITIAL_DRAMAS } from '@/lib/data';
import { CategoryRow } from '@/components/CategoryRow';
import { DramaCard } from '@/components/DramaCard';

export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const heroDrama = INITIAL_DRAMAS[0];

  const trendingDramas = INITIAL_DRAMAS.filter((d) => d.category === 'trending' || d.rating! >= 9.7);
  const romanceDramas = INITIAL_DRAMAS.filter((d) => d.category === 'romance' || d.tags.includes('Romance'));
  const revengeDramas = INITIAL_DRAMAS.filter((d) => d.category === 'revenge' || d.tags.includes('Revenge'));
  const suspenseDramas = INITIAL_DRAMAS.filter((d) => d.category === 'suspense' || d.tags.includes('Suspense'));

  const filterTags = ['All', 'Trending', 'Revenge', 'Romance', 'Suspense', 'CEO', 'Historical'];

  const filteredDramas = selectedTag === 'All'
    ? INITIAL_DRAMAS
    : INITIAL_DRAMAS.filter((d) =>
        d.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase())) ||
        d.category?.toLowerCase() === selectedTag.toLowerCase()
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 relative z-10">
      {/* FEATURED HERO SPOTLIGHT (Neon Cyber Edition inspired by photo) */}
      <section className="relative border border-[#261f47] rounded-2xl overflow-hidden bg-gradient-to-r from-[#0d0b1d] via-[#110e24] to-[#0a1224] shadow-[0_0_40px_rgba(255,42,141,0.15)]">
        {/* Ambient backlight inside the card (Cyan monitor glow + Magenta neon wall glow) */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-pink-600/20 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-500/20 rounded-full filter blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-pink-500/15 text-pink-400 border border-pink-500/40 text-xs font-bold px-3 py-1 rounded-full shadow-[0_0_12px_rgba(255,42,141,0.35)]">
                <Flame className="w-3.5 h-3.5 text-pink-400 fill-pink-400 filter drop-shadow-[0_0_4px_rgba(255,42,141,0.8)]" />
                #1 TRENDING REEL DRAMA
              </span>
              <span className="text-xs font-mono text-cyan-400/80">UPDATED DAILY</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {heroDrama.title.split(' ')[0]}{' '}
              <span className="neon-sign-pink">
                {heroDrama.title.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
              {heroDrama.description}
            </p>

            {/* Tags & Metadata */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {heroDrama.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-[#16122d] text-cyan-300 border border-cyan-500/20 px-2.5 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-300 ml-2">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
                <span>{heroDrama.rating} ({heroDrama.views} views)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href={`/watch/${heroDrama.id}?ep=1`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,42,141,0.6)] hover:shadow-[0_0_30px_rgba(255,42,141,0.9)] hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Ep. 1 Free
              </Link>
              <Link
                href={`/drama/${heroDrama.id}`}
                className="inline-flex items-center justify-center gap-2 bg-[#120f26] hover:bg-[#1a1636] text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]"
              >
                View Episodes ({heroDrama.total_episodes})
              </Link>
            </div>
          </div>

          {/* Hero Right Visual Poster */}
          <div className="lg:col-span-5 h-64 sm:h-96 lg:h-full relative overflow-hidden bg-[#0a0914] border-t lg:border-t-0 lg:border-l border-[#261f47]">
            <img
              src={heroDrama.cover_image_url}
              alt={heroDrama.title}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0b1d] via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* NEON FILTER TAGS BAR */}
      <section className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
        {filterTags.map((tag) => {
          const isActive = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-pink-600 text-white border-pink-500 shadow-[0_0_15px_rgba(255,42,141,0.6)] font-bold'
                  : 'bg-[#100e21] text-slate-400 border-[#231d3d] hover:border-pink-500/50 hover:text-pink-300'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </section>

      {/* DYNAMIC FEED VIEW */}
      {selectedTag === 'All' ? (
        <div className="space-y-6">
          {/* Row 1: Trending Now */}
          <div id="trending">
            <CategoryRow
              title="🔥 Trending Now"
              subtitle="Most watched vertical dramas this week"
              dramas={trendingDramas}
            />
          </div>

          {/* Row 2: CEO & Revenge Sagas */}
          <div id="revenge">
            <CategoryRow
              title="👑 CEO & Revenge Sagas"
              subtitle="Betrayals, secret billionaires, and retribution"
              dramas={revengeDramas}
            />
          </div>

          {/* Row 3: Top Romance */}
          <div id="romance">
            <CategoryRow
              title="💖 Top Romance"
              subtitle="Enemies to lovers, contract marriages, and heartfelt bonds"
              dramas={romanceDramas}
            />
          </div>

          {/* Row 4: Suspense & Thrillers */}
          <div id="suspense">
            <CategoryRow
              title="⚡ Suspense & Thrillers"
              subtitle="Mystery plots with cliffhangers in every minute"
              dramas={suspenseDramas}
            />
          </div>
        </div>
      ) : (
        /* Filtered Grid View */
        <section className="py-4">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">
              <span className="neon-text-pink">{selectedTag}</span> Dramas ({filteredDramas.length})
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredDramas.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>
        </section>
      )}

      {/* NEON FOOTER */}
      <footer className="pt-12 pb-8 border-t border-[#1a1633] text-center text-xs text-slate-500 space-y-2">
        <p className="font-extrabold text-white tracking-widest uppercase">
          DRAMABOX <span className="neon-text-pink">STREAMING</span>
        </p>
        <p className="text-slate-400">Short-Form Vertical Reel Dramas • Neon Cyber Edition</p>
      </footer>
    </div>
  );
}
