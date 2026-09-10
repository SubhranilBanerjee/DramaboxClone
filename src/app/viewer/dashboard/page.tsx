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
  Flame,
  Star,
  Shuffle,
  Shield,
  User,
  Film
} from 'lucide-react';
import { useCoinBalance, useBookmarks, useUnlockedEpisodes } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { getAllDramas, INITIAL_DRAMAS } from '@/lib/data';
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
    <div className="min-h-screen bg-[#080711] text-white pb-20">
      {/* Top Banner / Welcome */}
      <div className="border-b border-[#211b3d] bg-gradient-to-r from-[#170e2c] via-[#100d24] to-[#080711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold text-cyan-300">
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                VIEWER DISCOVERY HUB & STREAMING COMMAND
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase flex items-center gap-3">
                <span>Welcome back,</span>
                <span className="neon-text-cyan">{user ? user.username : 'VIP Viewer'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Here are your personalized vertical reels, continue-watching queue, and curated recommendations for today.
              </p>
            </div>

            {/* Coin Widget & Surprise Me Button */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 bg-[#130f26] border border-[#2b2252] px-4 py-2.5 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Balance</div>
                  <div className="text-sm font-black text-amber-300">{balance} Coins</div>
                </div>
                <button
                  onClick={handleClaimDailyCoins}
                  className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-[11px] px-3 py-1.5 rounded-lg transition-all"
                >
                  +50 Free
                </button>
              </div>

              <button
                onClick={handleSurpriseMe}
                className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-[0_0_20px_rgba(255,42,141,0.4)] transition-all"
              >
                <Shuffle className="w-4 h-4" /> Surprise Me
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ══ CONTINUE WATCHING ROW ══════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-pink-400" /> Continue Watching
            </h2>
            <span className="text-xs text-slate-400">Auto-synced</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {continueWatchingList.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-4 rounded-2xl bg-[#0e0c1c] border border-[#261f49] hover:border-pink-500/40 transition-all items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]"
              >
                <div className="w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden relative shrink-0 bg-slate-950">
                  <img src={item.drama.cover_image_url} alt={item.drama.title} className="w-full h-full object-cover" />
                  <Link
                    href={`/watch/${item.drama.id}?ep=${item.currentEp}`}
                    className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,42,141,0.8)]">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </Link>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                      Episode {item.currentEp} of {item.totalEp}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate">{item.drama.title}</h3>
                    <p className="text-[11px] text-slate-400">{item.lastWatched}</p>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="font-bold text-cyan-300">{item.progressPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#1e173d] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full"
                        style={{ width: `${item.progressPct}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/watch/${item.drama.id}?ep=${item.currentEp}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    Resume Playing &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ WHAT TO WATCH (PERSONALIZED RECOMMENDATIONS) ═══════════════ */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> What to Watch For You
              </h2>
              <p className="text-xs text-slate-400">Curated based on 9:16 vertical completion rates and trending tropes</p>
            </div>

            {/* Genre Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Trending', 'Romance', 'Revenge', 'Suspense'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedGenre === genre
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                      : 'bg-[#141026] text-slate-400 border border-[#251e44] hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {recommendedDramas.slice(0, 12).map((drama) => (
              <div
                key={drama.id}
                className="group relative bg-[#0e0c1c] border border-[#241d45] rounded-xl overflow-hidden flex flex-col hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all"
              >
                <div className="aspect-[2/3] relative overflow-hidden bg-slate-950">
                  <img
                    src={drama.cover_image_url}
                    alt={drama.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md rounded px-1.5 py-0.5 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> {drama.rating || 9.8}
                  </div>

                  <Link
                    href={`/watch/${drama.id}?ep=1`}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.7)]">
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </div>
                  </Link>
                </div>

                <div className="p-3 space-y-1">
                  <h4 className="text-xs font-bold text-white truncate">{drama.title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{drama.total_episodes} eps</span>
                    <button
                      onClick={() => toggleBookmark(drama.id)}
                      className={`p-1 hover:text-pink-400 ${bookmarks.includes(drama.id) ? 'text-pink-400' : 'text-slate-500'}`}
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
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" /> My Saved Watchlist
              <span className="text-xs font-normal text-slate-400">({bookmarkedDramas.length})</span>
            </h2>
          </div>

          {bookmarkedDramas.length === 0 ? (
            <div className="p-8 border border-dashed border-[#271f49] rounded-2xl bg-[#0e0c1c] text-center space-y-2">
              <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">You have no saved dramas yet. Click the bookmark icon on any drama to add it here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {bookmarkedDramas.map((drama) => (
                <Link
                  key={drama.id}
                  href={`/watch/${drama.id}?ep=1`}
                  className="group bg-[#0e0c1c] border border-[#241d45] rounded-xl overflow-hidden hover:border-amber-400/50 transition-all block"
                >
                  <div className="aspect-[2/3] relative overflow-hidden bg-slate-950">
                    <img src={drama.cover_image_url} alt={drama.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-bold text-white truncate">{drama.title}</h4>
                    <span className="text-[10px] text-amber-400">Saved in Watchlist</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ══ UNLOCKED VIP EPISODES ══════════════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4 text-purple-400" /> Unlocked Premium Episodes
              <span className="text-xs font-normal text-slate-400">({unlocked.length})</span>
            </h2>
          </div>

          {unlocked.length === 0 ? (
            <div className="p-8 border border-dashed border-[#271f49] rounded-2xl bg-[#0e0c1c] text-center space-y-2">
              <Coins className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">You haven't unlocked any premium episodes yet. Use your starter 100 coins to unlock cliffhangers!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {unlocked.map((epId) => (
                <div
                  key={epId}
                  className="p-3 bg-[#0e0c1c] border border-purple-500/30 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                      VIP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{epId}</div>
                      <div className="text-[10px] text-emerald-400">Unlocked & Permanently Available</div>
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
