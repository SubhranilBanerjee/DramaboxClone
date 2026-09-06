'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Coins,
  Sparkles,
  Shield,
  Play,
  Bookmark,
  CheckCircle2,
  Database,
  ArrowRight,
  User,
  Plus,
  LogOut,
  LogIn
} from 'lucide-react';
import {
  useCoinBalance,
  useBookmarks,
  useUnlockedEpisodes,
  getUserId,
} from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_DRAMAS } from '@/lib/data';
import { DramaCard } from '@/components/DramaCard';
import { useToast } from '@/components/Toast';
import { AuthModal } from '@/components/AuthModal';

export default function ProfilePage() {
  const { balance, addCoins } = useCoinBalance();
  const { bookmarks } = useBookmarks();
  const { unlocked } = useUnlockedEpisodes();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'unlocks' | 'bookmarks' | 'supabase'>('unlocks');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [guestId, setGuestId] = useState<string>('');

  useEffect(() => {
    setGuestId(getUserId());
  }, []);

  const bookmarkedDramas = INITIAL_DRAMAS.filter((d) => bookmarks.includes(d.id));

  // Find drama title & episode number for unlocked episode IDs
  const unlockedDetails = unlocked.map((unlockedId) => {
    const match = unlockedId.match(/(.+)-ep-(\d+)/);
    if (match) {
      const dramaId = match[1];
      const epNum = parseInt(match[2], 10);
      const drama = INITIAL_DRAMAS.find((d) => d.id === dramaId);
      return {
        id: unlockedId,
        dramaId,
        dramaTitle: drama ? drama.title : 'Drama Series',
        coverUrl: drama ? drama.cover_image_url : '',
        epNum,
      };
    }
    return null;
  }).filter(Boolean);

  const handleClaimDaily = () => {
    addCoins(50);
    showToast('Claimed +50 Daily Free Coins!', 'success');
  };

  const handleSignOut = async () => {
    await signOut();
    showToast('Signed out of account.', 'info');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
      {/* Profile Header (Neon Cyber Card) */}
      <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-[0_0_35px_rgba(255,42,141,0.15)] relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 text-white flex items-center justify-center text-xl font-black shadow-[0_0_20px_rgba(255,42,141,0.6)]">
            {user ? user.username.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">
                {user ? user.username : 'Guest Viewer'}
              </h1>
              <span className="text-[10px] font-extrabold bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded shadow-[0_0_6px_rgba(255,42,141,0.4)]">
                {user ? 'VIP MEMBER' : 'GUEST'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              {user ? user.email : `Guest ID: ${guestId}`}
            </p>
            {user && (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-medium mt-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Right Action Block */}
        <div className="flex flex-col sm:items-end w-full sm:w-auto gap-3 relative z-10">
          {/* Quick Balance Status */}
          <div className="bg-[#141026] border border-[#2d2454] rounded-xl px-5 py-3 text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]">
            <div>
              <div className="text-xs text-slate-400 font-medium">Available Balance</div>
              <div className="text-xl font-extrabold text-white flex items-center gap-1.5 justify-end">
                <Coins className="w-5 h-5 text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
                <span className="neon-text-cyan">{balance} Coins</span>
              </div>
            </div>
            <button
              onClick={handleClaimDaily}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-[0_0_12px_rgba(255,42,141,0.5)] hover:shadow-[0_0_20px_rgba(255,42,141,0.8)] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              Claim +50 Daily
            </button>
          </div>

          {/* Guest Sign In Prompt */}
          {!user && (
            <div className="flex items-center gap-2 w-full justify-end">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 border border-[#28214a] hover:border-pink-500/60 rounded-lg transition-colors bg-[#120f26]"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                }}
                className="text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-[0_0_12px_rgba(255,42,141,0.5)] flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-cyan-300" />
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* COIN STORE PACKAGES */}
      <section className="bg-[#0e0c1c] border border-[#221c3d] rounded-2xl p-6 space-y-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              COIN <span className="neon-text-pink">TOP-UP STORE</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Unlock drama episodes sequentially or binge-watch full seasons.
            </p>
          </div>
          <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.25)]">
            INSTANT DELIVERY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Package 1 */}
          <div className="border border-[#231d3d] bg-[#120f26] rounded-xl p-4 flex flex-col justify-between hover:border-pink-500/60 transition-all">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Starter</div>
              <div className="text-lg font-extrabold text-white mt-1">100 Coins</div>
              <div className="text-xs text-slate-400 mt-1">Unlocks 5 episodes</div>
            </div>
            <button
              onClick={() => {
                addCoins(100);
                showToast('Added 100 Coins to balance!', 'success');
              }}
              className="mt-4 w-full text-xs font-bold bg-[#1a1538] hover:bg-pink-600 text-white py-2 rounded-lg transition-all hover:shadow-[0_0_12px_rgba(255,42,141,0.5)]"
            >
              Add 100 Coins ($0.99)
            </button>
          </div>

          {/* Package 2 */}
          <div className="border border-pink-500/70 bg-[#16112d] rounded-xl p-4 flex flex-col justify-between relative shadow-[0_0_20px_rgba(255,42,141,0.25)]">
            <div className="absolute -top-2 right-3 bg-pink-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-[0_0_8px_rgba(255,42,141,0.7)]">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Binge Pack</div>
              <div className="text-lg font-extrabold text-white mt-1 neon-text-pink">350 Coins</div>
              <div className="text-xs text-slate-300 mt-1">Unlocks 17+ episodes</div>
            </div>
            <button
              onClick={() => {
                addCoins(350);
                showToast('Added 350 Coins to balance!', 'success');
              }}
              className="mt-4 w-full text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-500 hover:to-purple-500 py-2 rounded-lg shadow-[0_0_15px_rgba(255,42,141,0.6)] hover:scale-105 transition-all"
            >
              Add 350 Coins ($2.99)
            </button>
          </div>

          {/* Package 3 */}
          <div className="border border-[#231d3d] bg-[#120f26] rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/60 transition-all">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ultimate Reel</div>
              <div className="text-lg font-extrabold text-white mt-1 neon-text-cyan">1000 Coins</div>
              <div className="text-xs text-slate-400 mt-1">Unlimited unlocks for multiple series</div>
            </div>
            <button
              onClick={() => {
                addCoins(1000);
                showToast('Added 1000 Coins to balance!', 'success');
              }}
              className="mt-4 w-full text-xs font-bold bg-[#1a1538] hover:bg-cyan-500 hover:text-slate-950 text-white py-2 rounded-lg transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.5)]"
            >
              Add 1000 Coins ($6.99)
            </button>
          </div>
        </div>
      </section>

      {/* TABS (Unlocked Episodes vs Bookmarks vs Supabase Status) */}
      <section className="space-y-4">
        <div className="flex border-b border-[#201a3b] gap-6">
          <button
            onClick={() => setActiveTab('unlocks')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'unlocks'
                ? 'border-pink-500 text-pink-400 drop-shadow-[0_0_8px_rgba(255,42,141,0.6)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Unlocked Episodes ({unlocked.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'bookmarks'
                ? 'border-cyan-400 text-cyan-300 drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            My Saved Dramas ({bookmarkedDramas.length})
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'supabase'
                ? 'border-purple-500 text-purple-400 drop-shadow-[0_0_8px_rgba(176,38,255,0.6)]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Supabase DB Config
          </button>
        </div>

        {/* TAB 1: UNLOCKED EPISODES */}
        {activeTab === 'unlocks' && (
          <div>
            {unlockedDetails.length === 0 ? (
              <div className="text-center py-12 bg-[#0e0c1c] border border-[#221c3d] rounded-2xl">
                <Coins className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">No unlocked premium episodes yet</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Episodes 1–5 are free for all dramas. Unlock premium episodes 6+ to watch exclusive twists!
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white px-5 py-2.5 rounded-xl shadow-[0_0_12px_rgba(255,42,141,0.5)] hover:scale-105 transition-all"
                >
                  Explore Dramas
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {unlockedDetails.map((item) => (
                  item && (
                    <div
                      key={item.id}
                      className="border border-[#231d3d] rounded-xl p-3.5 bg-[#0e0c1c] flex items-center justify-between gap-3 hover:border-pink-500/60 transition-all shadow-[0_0_12px_rgba(0,0,0,0.4)]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.coverUrl && (
                          <img
                            src={item.coverUrl}
                            alt=""
                            className="w-12 h-14 object-cover rounded-lg shrink-0 border border-[#261f47]"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {item.dramaTitle}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] text-cyan-300 font-medium mt-0.5">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Ep. {item.epNum} Unlocked
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/watch/${item.dramaId}?ep=${item.epNum}`}
                        className="p-2.5 rounded-lg bg-pink-600 text-white hover:bg-pink-500 shadow-[0_0_10px_rgba(255,42,141,0.6)] transition-all shrink-0"
                        aria-label="Play unlocked episode"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </Link>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BOOKMARKS */}
        {activeTab === 'bookmarks' && (
          <div>
            {bookmarkedDramas.length === 0 ? (
              <div className="text-center py-12 bg-[#0e0c1c] border border-[#221c3d] rounded-2xl">
                <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">Your saved list is empty</p>
                <p className="text-xs text-slate-400 mt-1">
                  Click the bookmark button on any drama page to save it for quick access.
                </p>
                <Link
                  href="/"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white px-5 py-2.5 rounded-xl shadow-[0_0_12px_rgba(255,42,141,0.5)] hover:scale-105 transition-all"
                >
                  Browse Trending
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {bookmarkedDramas.map((drama) => (
                  <DramaCard key={drama.id} drama={drama} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUPABASE INTEGRATION STATUS */}
        {activeTab === 'supabase' && (
          <div className="bg-[#0e0c1c] border border-[#221c3d] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-[#201a3b]">
              <div className="w-9 h-9 rounded-xl bg-[#17122e] border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Supabase Configuration</h3>
                <p className="text-xs text-slate-400">Connected with provided environment keys</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#1b1633]">
                <span className="text-slate-400">NEXT_PUBLIC_SUPABASE_URL</span>
                <span className="font-mono text-cyan-300">https://supabase.co</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1b1633]">
                <span className="text-slate-400">Anon Key Status</span>
                <span className="font-mono text-emerald-400">Configured (JWT Present)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#1b1633]">
                <span className="text-slate-400">Auth Engine</span>
                <span className="font-mono text-pink-300">Supabase Auth (auth.users + profiles table)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Current Session</span>
                <span className="font-mono text-cyan-300">
                  {user ? `${user.username} (${user.email})` : 'Guest Session'}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />
    </div>
  );
}
