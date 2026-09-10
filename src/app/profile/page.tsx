'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Coins,
  Sparkles,
  Play,
  Bookmark,
  CheckCircle2,
  Database,
  User,
  LogOut,
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10 text-white">
      {/* Profile Header */}
      <div className="bg-[#151515] border border-[#292929] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-[0_4px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-13 h-13 rounded-2xl bg-[#FF007A] text-white flex items-center justify-center text-lg font-black shadow-[0_2px_12px_rgba(255,0,122,0.4)]">
            {user ? user.username.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white">
                {user ? user.username : 'Guest Viewer'}
              </h1>
              <span className="text-[10px] font-bold bg-[#FF007A]/15 text-[#FF007A] border border-[#FF007A]/30 px-2 py-0.5 rounded-full">
                {user ? 'VIP MEMBER' : 'GUEST'}
              </span>
            </div>
            <p className="text-xs text-[#8F8F98] font-mono mt-0.5">
              {user ? user.email : `Guest ID: ${guestId}`}
            </p>
            {user && (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-medium mt-1.5 transition-colors"
              >
                <LogOut className="w-3 h-3" /> Sign Out
              </button>
            )}
          </div>
        </div>

        {/* Right Action Block */}
        <div className="flex flex-col sm:items-end w-full sm:w-auto gap-2.5 relative z-10">
          {/* Quick Balance Status */}
          <div className="bg-[#191919] border border-[#292929] rounded-xl px-4 py-2 text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
            <div>
              <div className="text-[10px] text-[#8F8F98]">Available Balance</div>
              <div className="text-base font-extrabold text-white flex items-center gap-1.5 justify-end">
                <Coins className="w-4 h-4 text-[#FFC400]" />
                <span className="text-[#FF007A] font-bold">{balance} Coins</span>
              </div>
            </div>
            <button
              onClick={handleClaimDaily}
              className="inline-flex items-center gap-1 bg-[#FF007A] hover:bg-[#E6006E] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-[0_2px_8px_rgba(255,0,122,0.3)] transition-all"
            >
              <Sparkles className="w-3 h-3 text-white" />
              Claim +50 Free
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
                className="text-xs font-semibold text-[#8F8F98] hover:text-white px-3 py-1.5 border border-[#292929] rounded-full transition-colors bg-[#191919]"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setIsAuthOpen(true);
                }}
                className="text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white px-3.5 py-1.5 rounded-full transition-all shadow-[0_2px_8px_rgba(255,0,122,0.3)]"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* COIN PACKAGES */}
      <section className="bg-[#151515] border border-[#292929] rounded-2xl p-5 space-y-3 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
              COIN <span className="text-[#FF007A]">PACKAGES</span>
            </h2>
            <p className="text-[11px] text-[#8F8F98]">
              Unlock drama episodes sequentially or binge full seasons.
            </p>
          </div>
          <span className="text-[10px] text-[#FF007A] font-bold bg-[#FF007A]/10 px-2 py-0.5 rounded-full border border-[#FF007A]/30">
            INSTANT
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Package 1 */}
          <div className="border border-[#292929] bg-[#191919] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#FF007A]/50 transition-all">
            <div>
              <div className="text-[10px] font-semibold text-[#8F8F98] uppercase tracking-wider">Starter</div>
              <div className="text-base font-extrabold text-white mt-0.5">100 Coins</div>
              <div className="text-[11px] text-[#8F8F98] mt-0.5">Unlocks 5 episodes</div>
            </div>
            <button
              onClick={() => {
                addCoins(100);
                showToast('Added 100 Coins to balance!', 'success');
              }}
              className="mt-3 w-full text-xs font-bold bg-[#262626] hover:bg-[#FF007A] text-white py-1.5 rounded-full transition-all"
            >
              $0.99
            </button>
          </div>

          {/* Package 2 */}
          <div className="border border-[#FF007A]/60 bg-[#221019] rounded-xl p-3.5 flex flex-col justify-between relative shadow-[0_0_15px_rgba(255,0,122,0.15)]">
            <div className="absolute -top-2 right-3 bg-[#FF007A] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              Popular
            </div>
            <div>
              <div className="text-[10px] font-semibold text-pink-300 uppercase tracking-wider">Binge Pack</div>
              <div className="text-base font-extrabold text-white mt-0.5">350 Coins</div>
              <div className="text-[11px] text-[#8F8F98] mt-0.5">Unlocks 17+ episodes</div>
            </div>
            <button
              onClick={() => {
                addCoins(350);
                showToast('Added 350 Coins to balance!', 'success');
              }}
              className="mt-3 w-full text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white py-1.5 rounded-full shadow-[0_2px_8px_rgba(255,0,122,0.3)] transition-all"
            >
              $2.99
            </button>
          </div>

          {/* Package 3 */}
          <div className="border border-[#292929] bg-[#191919] rounded-xl p-3.5 flex flex-col justify-between hover:border-[#FF007A]/50 transition-all">
            <div>
              <div className="text-[10px] font-semibold text-[#8F8F98] uppercase tracking-wider">Ultimate</div>
              <div className="text-base font-extrabold text-white mt-0.5">1000 Coins</div>
              <div className="text-[11px] text-[#8F8F98] mt-0.5">Unlimited for multiple series</div>
            </div>
            <button
              onClick={() => {
                addCoins(1000);
                showToast('Added 1000 Coins to balance!', 'success');
              }}
              className="mt-3 w-full text-xs font-bold bg-[#262626] hover:bg-[#FF007A] text-white py-1.5 rounded-full transition-all"
            >
              $6.99
            </button>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="space-y-4">
        <div className="flex border-b border-[#292929] gap-4">
          <button
            onClick={() => setActiveTab('unlocks')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'unlocks'
                ? 'border-[#FF007A] text-[#FF007A]'
                : 'border-transparent text-[#8F8F98] hover:text-white'
            }`}
          >
            Unlocked Episodes ({unlocked.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'bookmarks'
                ? 'border-[#FF007A] text-[#FF007A]'
                : 'border-transparent text-[#8F8F98] hover:text-white'
            }`}
          >
            Saved Watchlist ({bookmarkedDramas.length})
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'supabase'
                ? 'border-[#FF007A] text-[#FF007A]'
                : 'border-transparent text-[#8F8F98] hover:text-white'
            }`}
          >
            Database Status
          </button>
        </div>

        {/* TAB 1: UNLOCKED EPISODES */}
        {activeTab === 'unlocks' && (
          <div>
            {unlockedDetails.length === 0 ? (
              <div className="text-center py-10 bg-[#151515] border border-[#292929] rounded-2xl">
                <Coins className="w-7 h-7 text-[#8F8F98] mx-auto mb-2" />
                <p className="text-xs font-bold text-white">No unlocked premium episodes yet</p>
                <p className="text-[11px] text-[#8F8F98] mt-0.5 max-w-sm mx-auto">
                  Episodes 1–5 are free for all dramas. Unlock premium episodes 6+ to watch exclusive twists!
                </p>
                <Link
                  href="/"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white px-4 py-2 rounded-full shadow-[0_2px_8px_rgba(255,0,122,0.3)] transition-all"
                >
                  Explore Dramas
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {unlockedDetails.map((item) => (
                  item && (
                    <div
                      key={item.id}
                      className="border border-[#292929] rounded-xl p-3 bg-[#151515] flex items-center justify-between gap-3 hover:border-[#FF007A] transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.coverUrl && (
                          <img
                            src={item.coverUrl}
                            alt=""
                            className="w-10 h-12 object-cover rounded-lg shrink-0 border border-[#292929]"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {item.dramaTitle}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium mt-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Ep. {item.epNum} Unlocked
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/watch/${item.dramaId}?ep=${item.epNum}`}
                        className="p-2 rounded-full bg-[#FF007A] text-white hover:bg-[#E6006E] shadow-[0_2px_8px_rgba(255,0,122,0.4)] transition-all shrink-0"
                        aria-label="Play unlocked episode"
                      >
                        <Play className="w-3 h-3 fill-current" />
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
              <div className="text-center py-10 bg-[#151515] border border-[#292929] rounded-2xl">
                <Bookmark className="w-7 h-7 text-[#8F8F98] mx-auto mb-2" />
                <p className="text-xs font-bold text-white">Your saved watchlist is empty</p>
                <p className="text-[11px] text-[#8F8F98] mt-0.5">
                  Click the bookmark button on any drama to add it to your watchlist.
                </p>
                <Link
                  href="/"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white px-4 py-2 rounded-full shadow-[0_2px_8px_rgba(255,0,122,0.3)] transition-all"
                >
                  Browse Trending
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {bookmarkedDramas.map((drama) => (
                  <DramaCard key={drama.id} drama={drama} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SUPABASE STATUS */}
        {activeTab === 'supabase' && (
          <div className="bg-[#151515] border border-[#292929] rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#292929]">
              <div className="w-8 h-8 rounded-xl bg-[#191919] border border-[#292929] flex items-center justify-center text-[#FF007A]">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white">Database & Auth Status</h3>
                <p className="text-[10px] text-[#8F8F98]">YarrowPlay Supabase Backend</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#222222]">
                <span className="text-[#8F8F98]">Backend Engine</span>
                <span className="font-mono text-white">Supabase Client</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#222222]">
                <span className="text-[#8F8F98]">Auth Mode</span>
                <span className="font-mono text-emerald-400">auth.users + localStorage Session</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#8F8F98]">Current Session</span>
                <span className="font-mono text-[#FF007A]">
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
