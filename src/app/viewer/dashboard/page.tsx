'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Play,
  Bookmark,
  Coins,
  Compass,
  Clock,
  CheckCircle2,
  Star,
  Shuffle,
  Film
} from 'lucide-react';
import { useCoinBalance, useBookmarks, useUnlockedEpisodes } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { getAllDramas } from '@/lib/data';
import { useToast } from '@/components/Toast';

export default function ViewerDashboardPage() {
  const { balance, addCoins } = useCoinBalance();
  const { bookmarks, toggleBookmark } = useBookmarks();
  const { unlocked } = useUnlockedEpisodes();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedGenre, setSelectedGenre] = useState('All');
  const allDramas = getAllDramas();

  const bookmarkedDramas = allDramas.filter((d) => bookmarks.includes(d.id));

  // "Continue Watching" simulated items
  const continueWatchingList = [
    {
      drama: allDramas[0],
      currentEp: 3,
      totalEp: allDramas[0].total_episodes,
      progressPct: 68,
      lastWatched: '2 hours ago',
    },
    {
      drama: allDramas[2] || allDramas[1],
      currentEp: 5,
      totalEp: (allDramas[2] || allDramas[1]).total_episodes,
      progressPct: 84,
      lastWatched: 'Yesterday',
    },
  ];

  // Recommendations filtered by selected genre
  const recommendedDramas = allDramas.filter((d) => {
    if (selectedGenre === 'All') return true;
    if (selectedGenre === 'Trending') return d.category === 'trending';
    if (selectedGenre === 'Romance') return d.category === 'romance' || d.tags.includes('Romance');
    if (selectedGenre === 'Revenge') return d.category === 'revenge' || d.tags.includes('Revenge');
    if (selectedGenre === 'Suspense') return d.category === 'suspense' || d.tags.includes('Suspense');
    return true;
  });

  const handleClaimDailyCoins = () => {
    addCoins(50);
    showToast('Claimed +50 Daily Bonus Coins!', 'success');
  };

  const handleSurpriseMe = () => {
    const randomDrama = allDramas[Math.floor(Math.random() * allDramas.length)];
    if (randomDrama) {
      showToast(`Rolling reel: ${randomDrama.title}`, 'info');
      window.location.href = `/watch/${randomDrama.id}?ep=1`;
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white pb-16">
      {/* Top Banner / Welcome */}
      <div className="border-b border-[#292929] bg-gradient-to-r from-[#3A0A24]/30 via-[#151515] to-[#070707]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-[#FF007A]/15 border border-[#FF007A]/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#FF007A]">
                  <Compass className="w-3 h-3 text-[#FF007A]" />
                  YARROWPLAY VIEWER HUB
                </span>
                <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-amber-300">
                  <Star className="w-2.5 h-2.5 fill-amber-300" /> VIP MEMBER
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase flex items-center gap-2">
                <span>Welcome back,</span>
                <span className="text-[#FF007A]">{user ? user.username : 'VIP Viewer'}</span>
              </h1>
              <p className="text-xs text-[#8F8F98] max-w-lg">
                Your personalized vertical reels, continue-watching queue, and curated recommendations.
              </p>

              {user?.favorite_genres && user.favorite_genres.length > 0 && (
                <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-[#8F8F98] uppercase">Saved Interests:</span>
                  {user.favorite_genres.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded-full bg-[#191919] border border-[#2d2d2d] text-[10px] text-pink-300 font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Coin Widget & Surprise Me Button */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-2.5 bg-[#151515] border border-[#292929] px-3.5 py-2 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-[#FFC400]/15 border border-[#FFC400]/30 flex items-center justify-center text-[#FFC400]">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-[#8F8F98]">Balance</div>
                  <div className="text-xs font-black text-[#FFC400]">{balance} Coins</div>
                </div>
                <button
                  onClick={handleClaimDailyCoins}
                  className="ml-1 bg-[#FF007A] hover:bg-[#E6006E] text-white font-bold text-[10px] px-2.5 py-1 rounded-full transition-all shadow-[0_2px_8px_rgba(255,0,122,0.3)]"
                >
                  +50 Free
                </button>
              </div>

              <button
                onClick={handleSurpriseMe}
                className="flex items-center gap-1.5 bg-[#191919] hover:bg-[#222222] border border-[#292929] hover:border-[#FF007A] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
              >
                <Shuffle className="w-3.5 h-3.5 text-[#FF007A]" /> Surprise Me
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Dashboard Access Bar */}
      <div className="bg-[#0e0e0e] border-b border-[#202020] py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[#8F8F98]">
            <span className="text-[11px] font-semibold">Active Mode: <strong className="text-white">VIP Viewer</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#666]">Switch Portal:</span>
            <Link
              href="/creator/dashboard"
              className="px-2.5 py-1 rounded-lg bg-[#161616] hover:bg-[#20152b] border border-[#292929] hover:border-purple-500/40 text-[11px] font-semibold text-purple-300 transition-all flex items-center gap-1.5"
            >
              Creator Studio
            </Link>
            <Link
              href="/advertiser/dashboard"
              className="px-2.5 py-1 rounded-lg bg-[#161616] hover:bg-[#251e12] border border-[#292929] hover:border-amber-500/40 text-[11px] font-semibold text-amber-300 transition-all flex items-center gap-1.5"
            >
              Advertiser Hub
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ══ CONTINUE WATCHING ROW ══════════════════════════════════════ */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF007A]" /> Continue Watching
            </h2>
            <span className="text-[11px] text-[#8F8F98]">Auto-synced</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {continueWatchingList.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-xl bg-[#151515] border border-[#292929] hover:border-[#FF007A] transition-all items-center"
              >
                <div className="w-16 sm:w-20 aspect-[2/3] rounded-lg overflow-hidden relative shrink-0 bg-[#070707]">
                  <img src={item.drama.cover_image_url} alt={item.drama.title} className="w-full h-full object-cover" />
                  <Link
                    href={`/watch/${item.drama.id}?ep=${item.currentEp}`}
                    className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#FF007A] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(255,0,122,0.6)]">
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </div>
                  </Link>
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div>
                    <span className="text-[10px] font-bold text-[#FF007A] uppercase tracking-wider">
                      Episode {item.currentEp} of {item.totalEp}
                    </span>
                    <h3 className="text-xs font-bold text-white truncate">{item.drama.title}</h3>
                    <p className="text-[10px] text-[#8F8F98]">{item.lastWatched}</p>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-[#8F8F98] mb-1">
                      <span>Progress</span>
                      <span className="font-bold text-[#FF007A]">{item.progressPct}%</span>
                    </div>
                    <div className="w-full h-1 bg-[#292929] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF007A] rounded-full"
                        style={{ width: `${item.progressPct}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/watch/${item.drama.id}?ep=${item.currentEp}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FF007A] hover:underline"
                  >
                    Resume Playing &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ WHAT TO WATCH (PERSONALIZED RECOMMENDATIONS) ═══════════════ */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF007A]" /> For You
              </h2>
              <p className="text-[11px] text-[#8F8F98]">Recommended vertical reels based on your history</p>
            </div>

            {/* Genre Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Trending', 'Romance', 'Revenge', 'Suspense'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedGenre === genre
                      ? 'bg-[#FF007A] text-white shadow-[0_2px_10px_rgba(255,0,122,0.35)]'
                      : 'bg-[#151515] text-[#8F8F98] border border-[#292929] hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {recommendedDramas.slice(0, 12).map((drama) => (
              <div
                key={drama.id}
                className="group relative bg-[#151515] border border-[#292929] rounded-xl overflow-hidden flex flex-col hover:border-[#FF007A] transition-all"
              >
                <div className="aspect-[2/3] relative overflow-hidden bg-[#0a0a0a]">
                  <img
                    src={drama.cover_image_url}
                    alt={drama.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-[#070707]/80 backdrop-blur-md rounded px-1.5 py-0.5 text-[9px] font-bold text-[#FFC400] flex items-center gap-1 border border-[#292929]">
                    <Star className="w-2.5 h-2.5 fill-[#FFC400]" /> {drama.rating || 9.8}
                  </div>

                  <Link
                    href={`/watch/${drama.id}?ep=1`}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#FF007A] flex items-center justify-center text-white shadow-[0_2px_10px_rgba(255,0,122,0.6)]">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </Link>
                </div>

                <div className="p-2.5 space-y-1">
                  <h4 className="text-xs font-bold text-white truncate">{drama.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-[#8F8F98]">
                    <span>{drama.total_episodes} eps</span>
                    <button
                      onClick={() => toggleBookmark(drama.id)}
                      className={`p-0.5 hover:text-[#FF007A] ${bookmarks.includes(drama.id) ? 'text-[#FF007A]' : 'text-[#8F8F98]'}`}
                      title="Bookmark"
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={bookmarks.includes(drama.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ BOOKMARKED WATCHLIST ════════════════════════════════════════ */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#FF007A]" /> My Saved Watchlist
              <span className="text-xs font-normal text-[#8F8F98]">({bookmarkedDramas.length})</span>
            </h2>
          </div>

          {bookmarkedDramas.length === 0 ? (
            <div className="p-6 border border-dashed border-[#292929] rounded-xl bg-[#151515] text-center space-y-1.5">
              <Bookmark className="w-6 h-6 text-[#8F8F98] mx-auto" />
              <p className="text-xs text-[#8F8F98]">You have no saved dramas yet. Click the bookmark icon on any drama to add it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {bookmarkedDramas.map((drama) => (
                <Link
                  key={drama.id}
                  href={`/watch/${drama.id}?ep=1`}
                  className="group bg-[#151515] border border-[#292929] rounded-xl overflow-hidden hover:border-[#FF007A] transition-all block"
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-[#070707]">
                    <img src={drama.cover_image_url} alt={drama.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-bold text-white truncate">{drama.title}</h4>
                    <span className="text-[10px] text-[#FF007A]">In Watchlist</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ══ UNLOCKED VIP EPISODES ══════════════════════════════════════ */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-[#FF007A]" /> Unlocked Episodes
              <span className="text-xs font-normal text-[#8F8F98]">({unlocked.length})</span>
            </h2>
          </div>

          {unlocked.length === 0 ? (
            <div className="p-6 border border-dashed border-[#292929] rounded-xl bg-[#151515] text-center space-y-1.5">
              <Coins className="w-6 h-6 text-[#8F8F98] mx-auto" />
              <p className="text-xs text-[#8F8F98]">You haven&apos;t unlocked any premium episodes yet. Use your starter 100 coins to unlock cliffhangers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {unlocked.map((epId) => (
                <div
                  key={epId}
                  className="p-3 bg-[#151515] border border-[#292929] rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#FF007A]/15 text-[#FF007A] flex items-center justify-center font-bold text-xs border border-[#FF007A]/30">
                      VIP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{epId}</div>
                      <div className="text-[10px] text-emerald-400">Unlocked & Available</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
