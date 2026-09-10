'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Play, Plus, Search, ChevronLeft, ChevronRight, Star, Info, X, Sparkles, BookOpen, ShieldCheck, Video, Megaphone
} from 'lucide-react';
import { getAllDramas, INITIAL_DRAMAS } from '@/lib/data';
import { Drama } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

/* ─── Horizontal poster-card row ───────────────────────────────────────── */
interface PosterRowProps { title: string; dramas: Drama[]; emoji?: string; badge?: string }

const PosterRow: React.FC<PosterRowProps> = ({ title, dramas, emoji, badge }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -380 : 380, behavior: 'smooth' });

  if (!dramas || dramas.length === 0) return null;

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          {emoji && <span>{emoji}</span>}{title}
          {badge && (
            <span style={{ fontSize: '0.65rem', background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.5)', color: '#c084fc', padding: '2px 8px', borderRadius: 999, textTransform: 'none', letterSpacing: 'normal' }}>
              {badge}
            </span>
          )}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['left', 'right'] as const).map((dir) => (
            <button key={dir} onClick={() => scroll(dir)}
              style={{ width: 30, height: 30, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#a855f7')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
            >
              {dir === 'left' ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} style={{ display: 'flex', gap: '0.85rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        {dramas.map((drama) => (
          <Link key={drama.id} href={`/drama/${drama.id}`}
            style={{ flexShrink: 0, width: 150, textDecoration: 'none', display: 'block' }}
          >
            {/* Poster */}
            <div style={{ position: 'relative', borderRadius: '0.6rem', overflow: 'hidden', aspectRatio: '2/3', background: '#111' }}>
              <img src={drama.cover_image_url} alt={drama.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform .3s' }}
                onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.07)')}
                onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
              />
              {/* hover overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 60%)', opacity: 0, transition: 'opacity .25s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
              >
                <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: 'rgba(168,85,247,.9)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={16} fill="white" color="white" />
                </div>
              </div>
              {/* rating */}
              <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,.65)', borderRadius: 4, padding: '2px 5px', display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#fbbf24', fontWeight: 600 }}>
                <Star size={9} fill="#fbbf24" color="#fbbf24" />
                {drama.rating || 9.8}
              </div>
            </div>
            <p style={{ marginTop: '0.45rem', fontSize: '0.72rem', fontWeight: 600, color: '#d1d5db', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{drama.title}</p>
            <p style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: 2 }}>{drama.total_episodes} eps • {drama.views || '1.2M'}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

/* ─── Main Page ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { user, isAdmin, isCreator, isAdvertiser } = useAuth();
  const [activeNav, setActiveNav] = useState('DRAMAS');
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

  return (
    <div style={{ background: '#09090b', minHeight: '100vh', color: '#fff', fontFamily: 'inherit' }}>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', width: '100%', height: '92vh', minHeight: 600, overflow: 'hidden' }}>

        {/* Background images with crossfade */}
        {heroDramas.map((drama, idx) => (
          <div key={drama.id} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${drama.cover_image_url})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: idx === heroIndex ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }} />
        ))}

        {/* Gradients */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.1) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,1) 0%, rgba(9,9,11,0.3) 35%, transparent 65%)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to bottom, rgba(9,9,11,0.6) 0%, transparent 100%)' }} />

        {/* ── IN-HERO NAVBAR ─────────────────────────────────────────────── */}
        <nav style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2.5rem', gap: '1.5rem' }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', flexShrink: 0 }}>
            <img src="/logo.jpg" alt="DramaBox Logo"
              style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', boxShadow: '0 0 14px rgba(168,85,247,0.7)' }} />
            <span style={{ fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.12em', color: '#fff', textTransform: 'uppercase' }}>
              DRAMA<span style={{ color: '#a855f7', textShadow: '0 0 14px #a855f7' }}>BOX</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', gap: '1.6rem', alignItems: 'center' }}>
            <Link
              href={dashboardLink}
              style={{
                textDecoration: 'none',
                color: '#4ade80',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 10px',
                borderRadius: 999,
                background: 'rgba(74,222,128,0.12)',
                border: '1px solid rgba(74,222,128,0.3)',
              }}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck size={13} /> ADMIN
                </>
              ) : isCreator ? (
                <>
                  <Video size={13} /> STUDIO
                </>
              ) : isAdvertiser ? (
                <>
                  <Megaphone size={13} /> ADS
                </>
              ) : (
                <>
                  <Sparkles size={13} /> FOR YOU
                </>
              )}
            </Link>

            <Link
              href="/blog"
              style={{
                textDecoration: 'none',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                transition: 'all .2s',
              }}
            >
              <BookOpen size={14} color="#a855f7" /> BLOG
            </Link>

            <Link
              href="/vendor/register"
              style={{
                textDecoration: 'none',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Megaphone size={13} color="#f59e0b" /> ADVERTISE
            </Link>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            {searchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '6px 14px' }}>
                <Search size={14} color="rgba(255,255,255,0.7)" />
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search dramas..."
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '0.8rem', width: 160 }}
                />
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.8)', transition: 'all .2s', backdropFilter: 'blur(8px)' }}
              >
                <Search size={16} />
              </button>
            )}

            <Link href={dashboardLink}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: isAdmin ? 'linear-gradient(135deg, #a855f7, #6366f1)' : isAdvertiser ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'linear-gradient(135deg, #7c3aed, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: '#fff', textDecoration: 'none',
                boxShadow: '0 0 10px rgba(168,85,247,0.5)', border: '2px solid rgba(255,255,255,0.25)'
              }}
              title={user ? `${user.username} (${user.role})` : 'Dashboard'}
            >
              {user ? user.username.charAt(0).toUpperCase() : 'U'}
            </Link>
          </div>
        </nav>

        {/* ── HERO CONTENT ───────────────────────────────────────────────── */}
        {heroDrama && (
          <div style={{ position: 'absolute', bottom: '13%', left: '2.5rem', zIndex: 10, maxWidth: 520 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.5)', borderRadius: 999, padding: '4px 12px', fontSize: '0.72rem', fontWeight: 600, color: '#c084fc', marginBottom: '0.85rem', backdropFilter: 'blur(8px)' }}>
              <Star size={11} fill="#c084fc" color="#c084fc" />
              {heroDrama.creator_name ? `Verified Studio: ${heroDrama.creator_name}` : 'Original Drama Series'}
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.05, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.01em', textShadow: '0 2px 30px rgba(0,0,0,0.8)', marginBottom: '0.7rem' }}>
              {heroDrama.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', fontSize: '0.78rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>Vertical Reel Drama</span>
              <span style={{ color: '#4ade80', fontWeight: 700 }}>{matchPct}% Match</span>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>2026 Edition</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '1.4rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {heroDrama.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href={`/watch/${heroDrama.id}?ep=1`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#a855f7', color: '#fff', padding: '0.7rem 1.6rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 22px rgba(168,85,247,0.6)', transition: 'all .2s', letterSpacing: '0.04em' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#9333ea')}
                onMouseLeave={e => (e.currentTarget.style.background = '#a855f7')}
              >
                <Play size={16} fill="white" /> PLAY
              </Link>
              <Link href={`/drama/${heroDrama.id}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', color: '#fff', padding: '0.7rem 1.4rem', borderRadius: 999, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', transition: 'all .2s', letterSpacing: '0.04em' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
              >
                <Info size={16} /> MORE INFO
              </Link>
              <button aria-label="Add to list"
                style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = '#a855f7')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)')}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Hero dot indicators */}
        <div style={{ position: 'absolute', bottom: '5.5%', right: '2.5rem', display: 'flex', gap: 6, zIndex: 10 }}>
          {heroDramas.map((_, idx) => (
            <button key={idx} onClick={() => setHeroIndex(idx)}
              style={{ width: idx === heroIndex ? 24 : 7, height: 7, borderRadius: 999, background: idx === heroIndex ? '#a855f7' : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', transition: 'all .35s', padding: 0 }}
            />
          ))}
        </div>
      </section>

      {/* ══ CONTENT ROWS ═════════════════════════════════════════════════ */}
      <div style={{ padding: '2.5rem 2.5rem 1rem', background: '#09090b' }}>
        {creatorApprovedDramas.length > 0 && (
          <PosterRow
            title="Approved Creator Premieres"
            dramas={creatorApprovedDramas}
            emoji="🌟"
            badge="Admin Verified"
          />
        )}
        <PosterRow title="Trending Now" dramas={trendingDramas} emoji="🔥" />
        <PosterRow title="CEO & Revenge Sagas" dramas={revengeDramas} emoji="👑" />
        <PosterRow title="Top Romance" dramas={romanceDramas} emoji="💖" />
        <PosterRow title="Suspense & Thrillers" dramas={suspenseDramas} emoji="⚡" />
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2.5rem 2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
          <img src="/logo.jpg" alt="DramaBox" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }} />
          <span style={{ fontWeight: 900, letterSpacing: '0.15em', fontSize: '0.9rem', color: '#fff' }}>DRAMABOX</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.8rem' }}>
          <Link href="/blog" style={{ color: 'inherit', textDecoration: 'none' }}>Creator Blog</Link>
          <Link href="/vendor/register" style={{ color: 'inherit', textDecoration: 'none' }}>Advertiser & Vendor Hub</Link>
          <Link href="/creator/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>Creator Studio</Link>
          <Link href="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin Verification</Link>
        </div>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>Short-Form Vertical Reel Dramas • Powered by Cloudinary Video CDN</p>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>© 2026 DramaBox. All rights reserved.</p>
      </footer>
    </div>
  );
}
