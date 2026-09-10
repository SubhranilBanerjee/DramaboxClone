'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play, Plus, Search, ChevronLeft, ChevronRight, Star, Info, X, Sparkles, BookOpen, ShieldCheck, Video, Megaphone, Check
} from 'lucide-react';
import { getAllDramas, INITIAL_DRAMAS } from '@/lib/data';
import { Drama } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/lib/store';
import { useToast } from '@/components/Toast';

/* ─── Compact Horizontal Poster Row ─────────────────────────────────────── */
interface PosterRowProps { title: string; dramas: Drama[]; emoji?: string; badge?: string }

const PosterRow: React.FC<PosterRowProps> = ({ title, dramas, emoji, badge }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });

  if (!dramas || dramas.length === 0) return null;

  return (
    <section className="mb-8 last:mb-2">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 tracking-wide uppercase">
          {emoji && <span>{emoji}</span>}
          <span>{title}</span>
          {badge && (
            <span className="text-[10px] bg-[#FF007A]/15 border border-[#FF007A]/30 text-[#FF007A] font-bold px-2 py-0.5 rounded-full capitalize tracking-normal">
              {badge}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-1.5">
          {(['left', 'right'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => scroll(dir)}
              className="w-7 h-7 rounded-full border border-[#292929] bg-[#151515] text-[#8F8F98] hover:text-white hover:border-[#FF007A] flex items-center justify-center transition-all cursor-pointer"
              aria-label={`Scroll ${dir}`}
            >
              {dir === 'left' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth no-scrollbar px-1"
      >
        {dramas.map((drama) => (
          <Link
            key={drama.id}
            href={`/drama/${drama.id}`}
            className="shrink-0 w-[135px] sm:w-[155px] md:w-[170px] group block text-decoration-none"
          >
            {/* Compact Poster */}
            <div className="relative rounded-xl overflow-hidden aspect-[2/3] bg-[#111111] border border-[#292929] group-hover:border-[#FF007A] group-hover:shadow-[0_4px_16px_rgba(255,0,122,0.22)] transition-all duration-300">
              <img
                src={drama.cover_image_url}
                alt={drama.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-full bg-[#FF007A] text-white flex items-center justify-center shadow-[0_2px_12px_rgba(255,0,122,0.5)]">
                  <Play size={15} fill="white" className="ml-0.5" />
                </div>
              </div>
              {/* rating */}
              <div className="absolute top-1.5 right-1.5 bg-[#070707]/85 backdrop-blur-md rounded px-1.5 py-0.5 flex items-center gap-1 text-[10px] text-[#FFC400] font-bold border border-[#292929]">
                <Star size={9} fill="#FFC400" color="#FFC400" />
                {drama.rating || 9.8}
              </div>
              {/* ep count */}
              <div className="absolute top-1.5 left-1.5 bg-[#070707]/85 backdrop-blur-md rounded px-1.5 py-0.5 text-[9px] text-white font-bold border border-[#292929]">
                {drama.total_episodes} EPS
              </div>
            </div>
            <p className="mt-2 text-xs font-bold text-white truncate group-hover:text-[#FF007A] transition-colors">
              {drama.title}
            </p>
            <p className="text-[10px] text-[#8F8F98] mt-0.5">
              {drama.views || '1.2M'} views
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ─── Main Home Page ─────────────────────────────────────────────────────── */
export default function HomePage() {
  const { user, isAdmin, isCreator, isAdvertiser } = useAuth();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();

  const [heroIndex, setHeroIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dramas, setDramas] = useState<Drama[]>(INITIAL_DRAMAS);

  // Sync approved dramas in real-time
  useEffect(() => {
    setDramas(getAllDramas());

    const handleDramasChange = () => {
      setDramas(getAllDramas());
    };

    window.addEventListener('creator_dramas_changed', handleDramasChange);
    return () => window.removeEventListener('creator_dramas_changed', handleDramasChange);
  }, []);

  const heroDramas = dramas.slice(0, 4);
  const heroDrama = heroDramas[heroIndex] || dramas[0];

  const isHeroBookmarked = heroDrama ? bookmarks.includes(heroDrama.id) : false;

  const trendingDramas = dramas.filter(d => d.category === 'trending' || (d.rating ?? 0) >= 9.7);
  const romanceDramas = dramas.filter(d => d.category === 'romance' || d.tags.includes('Romance'));
  const revengeDramas = dramas.filter(d => d.category === 'revenge' || d.tags.includes('Revenge'));
  const suspenseDramas = dramas.filter(d => d.category === 'suspense' || d.tags.includes('Suspense'));
  const creatorApprovedDramas = dramas.filter(d => d.creator_id);

  useEffect(() => {
    if (heroDramas.length === 0) return;
    const t = setInterval(() => setHeroIndex(i => (i + 1) % heroDramas.length), 7000);
    return () => clearInterval(t);
  }, [heroDramas.length]);

  const matchPct = Math.min(99, Math.round(85 + (heroDrama?.rating ?? 9.5) * 1.5));

  // Determine user dashboard link
  const dashboardLink = isAdmin
    ? '/admin'
    : isCreator
    ? '/creator/dashboard'
    : isAdvertiser
    ? '/advertiser/dashboard'
    : '/viewer/dashboard';

  const handleToggleHeroBookmark = () => {
    if (!heroDrama) return;
    const active = toggleBookmark(heroDrama.id);
    showToast(active ? `Added "${heroDrama.title}" to Watchlist` : `Removed from Watchlist`, 'info');
  };

  return (
    <div className="bg-[#070707] min-h-screen text-white">

      {/* ══ COMPACT SLEEK HERO ════════════════════════════════════════════ */}
      <section className="relative w-full h-[76vh] min-h-[500px] max-h-[660px] overflow-hidden">

        {/* Background images with crossfade */}
        {heroDramas.map((drama, idx) => (
          <div
            key={drama.id}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${drama.cover_image_url})`,
              opacity: idx === heroIndex ? 1 : 0,
            }}
          />
        ))}

        {/* Maroon and Dark Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#070707]/95 via-[#070707]/70 to-[#3A0A24]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#070707]/80 to-transparent pointer-events-none" />

        {/* ── IN-HERO COMPACT NAVBAR ─────────────────────────────────────── */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-8 py-3.5 gap-4">

          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 text-decoration-none shrink-0 group">
            <img
              src="/logo.png"
              alt="YarrowPlay"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-base sm:text-lg tracking-wider text-white uppercase">
              YARROW<span className="text-[#FF007A] ml-0.5">PLAY</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-5">
            <Link
              href={dashboardLink}
              className="text-xs font-bold tracking-wide flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515]/80 border border-[#292929] hover:border-[#FF007A] text-white transition-all"
            >
              {isAdmin ? (
                <>
                  <ShieldCheck size={12} className="text-[#FF007A]" /> ADMIN
                </>
              ) : isCreator ? (
                <>
                  <Video size={12} className="text-[#FF007A]" /> STUDIO
                </>
              ) : isAdvertiser ? (
                <>
                  <Megaphone size={12} className="text-[#FF007A]" /> ADS
                </>
              ) : (
                <>
                  <Sparkles size={12} className="text-[#FF007A]" /> FOR YOU
                </>
              )}
            </Link>

            <Link
              href="/blog"
              className="text-xs font-semibold text-[#8F8F98] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <BookOpen size={13} className="text-[#FF007A]" /> BLOG
            </Link>

            <Link
              href="/vendor/register"
              className="text-xs font-semibold text-[#8F8F98] hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Megaphone size={13} className="text-[#FFC400]" /> ADVERTISE
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 shrink-0">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-[#151515] border border-[#292929] rounded-full px-3 py-1 text-xs">
                <Search size={13} className="text-[#8F8F98]" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search dramas..."
                  className="bg-transparent border-none outline-none text-white text-xs w-28 sm:w-36 placeholder-[#62626E]"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="bg-transparent border-none cursor-pointer text-[#8F8F98] hover:text-white flex"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-8 h-8 rounded-full bg-[#151515]/80 border border-[#292929] hover:border-[#FF007A] text-[#8F8F98] hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search size={14} />
              </button>
            )}

            <Link
              href={dashboardLink}
              className="w-8 h-8 rounded-full bg-[#FF007A] hover:bg-[#E6006E] flex items-center justify-center text-xs font-bold text-white shadow-[0_2px_10px_rgba(255,0,122,0.4)] transition-all"
              title={user ? `${user.username} (${user.role})` : 'Dashboard'}
            >
              {user ? user.username.charAt(0).toUpperCase() : 'U'}
            </Link>
          </div>
        </nav>

        {/* ── HERO CONTENT ───────────────────────────────────────────────── */}
        {heroDrama && (
          <div className="absolute bottom-10 left-4 sm:left-8 z-10 max-w-lg pr-4">
            <div className="inline-flex items-center gap-1.5 bg-[#FF007A]/15 border border-[#FF007A]/30 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-[#FF007A] mb-2.5 backdrop-blur-md">
              <Star size={10} fill="#FF007A" color="#FF007A" />
              {heroDrama.creator_name ? `Studio: ${heroDrama.creator_name}` : 'Featured Vertical Reel'}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mb-2 leading-none">
              {heroDrama.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-[#8F8F98] mb-2 font-medium">
              <span className="text-[#FF007A] font-bold">{matchPct}% Match</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#FFC400] font-bold">
                <Star size={11} fill="#FFC400" color="#FFC400" />
                {heroDrama.rating}
              </span>
              <span>•</span>
              <span>{heroDrama.total_episodes} Episodes</span>
            </div>

            <p className="text-xs text-[#8F8F98] line-clamp-2 leading-relaxed mb-4 max-w-md">
              {heroDrama.description}
            </p>

            {/* Hero CTAs */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <Link
                href={`/watch/${heroDrama.id}?ep=1`}
                className="inline-flex items-center gap-2 bg-[#FF007A] hover:bg-[#E6006E] text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-[0_4px_16px_rgba(255,0,122,0.35)] hover:scale-105"
              >
                <Play size={13} fill="white" /> PLAY
              </Link>

              <Link
                href={`/drama/${heroDrama.id}`}
                className="inline-flex items-center gap-1.5 bg-[#151515]/90 hover:bg-[#1f1f1f] text-white px-4 py-2 rounded-full text-xs font-semibold border border-[#292929] hover:border-[#FF007A] transition-all"
              >
                <Info size={13} /> DETAILS
              </Link>

              <button
                onClick={handleToggleHeroBookmark}
                aria-label="Add to list"
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isHeroBookmarked
                    ? 'bg-[#FF007A] border-[#FF007A] text-white shadow-[0_2px_10px_rgba(255,0,122,0.4)]'
                    : 'bg-[#151515]/80 border-[#292929] hover:border-[#FF007A] text-[#8F8F98] hover:text-white'
                }`}
              >
                {isHeroBookmarked ? <Check size={14} /> : <Plus size={14} />}
              </button>
            </div>
          </div>
        )}

        {/* Hero dot indicators */}
        <div className="absolute bottom-5 right-4 sm:right-8 flex gap-1.5 z-10">
          {heroDramas.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setHeroIndex(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === heroIndex ? 'w-5 bg-[#FF007A]' : 'w-1.5 bg-white/30'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ══ CONTENT ROWS ═════════════════════════════════════════════════ */}
      <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto">
        {creatorApprovedDramas.length > 0 && (
          <PosterRow
            title="Creator Premieres"
            dramas={creatorApprovedDramas}
            emoji="🌟"
            badge="Verified"
          />
        )}
        <PosterRow title="Trending Now" dramas={trendingDramas} emoji="🔥" />
        <PosterRow title="CEO & Revenge Sagas" dramas={revengeDramas} emoji="👑" />
        <PosterRow title="Top Romance" dramas={romanceDramas} emoji="💖" />
        <PosterRow title="Suspense & Thrillers" dramas={suspenseDramas} emoji="⚡" />
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#202020] px-4 sm:px-8 py-8 text-center bg-[#070707]">
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="/logo.png" alt="YarrowPlay" className="w-6 h-6 object-contain" />
          <span className="font-extrabold tracking-wider text-sm text-white uppercase">
            YARROW<span className="text-[#FF007A]">PLAY</span>
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-[#8F8F98] mb-3">
          <Link href="/blog" className="hover:text-white transition-colors">Creator Blog</Link>
          <Link href="/vendor/register" className="hover:text-white transition-colors">Advertiser & Brand Hub</Link>
          <Link href="/creator/dashboard" className="hover:text-white transition-colors">Creator Studio</Link>
          <Link href="/admin" className="hover:text-white transition-colors">Admin Verification</Link>
        </div>
        <p className="text-[11px] text-[#62626E]">
          Next-Gen Short-Form Vertical Reel Streaming • High Bitrate CDN
        </p>
        <p className="text-[10px] text-[#4A4A55] mt-1.5">
          © 2026 YarrowPlay. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
