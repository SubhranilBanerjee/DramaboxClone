'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Coins,
  User,
  Sparkles,
  Plus,
  X,
  Search,
  LogOut,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { useCoinBalance } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { useToast } from './Toast';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const pathname = usePathname();
  const { balance, addCoins } = useCoinBalance();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Discover', href: '/' },
    { label: 'Trending', href: '/#trending' },
    { label: 'Creator Blog', href: '/blog' },
    { label: 'Brand Ads', href: '/vendor/register' },
  ];

  const handleClaimBonus = (amount: number) => {
    addCoins(amount);
    showToast(`Claimed +${amount} Coins successfully!`, 'success');
    setIsTopUpOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    showToast('Signed out successfully.', 'info');
  };

  // Hide the global navbar on the home page – it has its own in-hero nav
  if (pathname === '/') return null;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#070707]/90 backdrop-blur-md border-b border-[#292929]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 sm:gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="YarrowPlay"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain transition-transform group-hover:scale-105"
              />
              <span className="font-extrabold text-base sm:text-lg tracking-wider text-white uppercase flex items-center">
                YARROW<span className="text-[#FF007A] ml-0.5">PLAY</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs font-semibold tracking-wide transition-all ${
                      isActive
                        ? 'text-[#FF007A] font-bold'
                        : 'text-[#8F8F98] hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-[#151515] border border-[#292929] rounded-full px-3 py-1.5 text-xs text-[#8F8F98] focus-within:border-[#FF007A] focus-within:shadow-[0_0_12px_rgba(255,0,122,0.25)] transition-all">
              <Search className="w-3.5 h-3.5 text-[#8F8F98]" />
              <input
                type="text"
                placeholder="Search dramas, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white w-28 xl:w-40 placeholder-[#62626E]"
              />
            </div>

            {/* Coin Balance Pill Button */}
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="flex items-center gap-1.5 bg-[#151515] hover:bg-[#1c1c1c] border border-[#292929] hover:border-[#FF007A] text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              title="Click to manage coins"
            >
              <Coins className="w-3.5 h-3.5 text-[#FFC400] shrink-0" />
              <span className="text-[#FF007A] font-bold">{balance}</span>
              <span className="hidden sm:inline text-[#8F8F98] font-normal">Coins</span>
              <div className="w-4 h-4 rounded-full bg-[#241018] border border-[#FF007A]/50 flex items-center justify-center ml-0.5 text-[#FF007A]">
                <Plus className="w-2.5 h-2.5" />
              </div>
            </button>

            {/* User Profile / Dashboard dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 bg-[#151515] hover:bg-[#1c1c1c] border border-[#292929] hover:border-[#FF007A] px-2.5 py-1.5 rounded-full text-xs font-semibold text-white transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FF007A] text-white font-bold flex items-center justify-center text-[10px]">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.username}</span>
                  <ChevronDown className="w-3 h-3 text-[#8F8F98]" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-52 bg-[#151515] border border-[#292929] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.8)] py-1.5 z-50 text-xs text-white">
                      <div className="px-3 py-2 border-b border-[#292929]">
                        <p className="font-bold truncate text-white">{user.username}</p>
                        <p className="text-[10px] text-[#8F8F98] truncate">{user.email}</p>
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF007A]/15 text-[#FF007A] border border-[#FF007A]/30 capitalize">
                          {user.role}
                        </div>
                      </div>

                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-[#1f1f1f] text-white font-medium"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-[#FF007A]" />
                          Admin QA Panel
                        </Link>
                      )}

                      {user.role === 'creator' && (
                        <Link
                          href="/creator/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-[#1f1f1f] text-white font-medium"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
                          Creator Studio
                        </Link>
                      )}

                      {user.role === 'advertiser' && (
                        <Link
                          href="/advertiser/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-[#1f1f1f] text-white font-medium"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
                          Advertiser Hub
                        </Link>
                      )}

                      <Link
                        href="/viewer/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#1f1f1f] text-white font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-[#8F8F98]" />
                        Viewer Dashboard
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-[#1f1f1f] text-white font-medium"
                      >
                        <User className="w-3.5 h-3.5 text-[#8F8F98]" />
                        My Profile & Wallet
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg font-medium transition-colors text-left border-t border-[#292929] mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Logged Out Actions */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthOpen(true);
                  }}
                  className="text-xs font-semibold text-[#8F8F98] hover:text-white px-2.5 py-1.5 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthOpen(true);
                  }}
                  className="bg-[#FF007A] hover:bg-[#E6006E] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-[0_2px_12px_rgba(255,0,122,0.35)] hover:scale-105 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                  <span>Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        defaultMode={authMode}
      />

      {/* Coin Top-up / Claim Modal */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#151515] border border-[#292929] rounded-2xl p-5 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
            <button
              onClick={() => setIsTopUpOpen(false)}
              className="absolute top-4 right-4 text-[#8F8F98] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-full bg-[#FF007A]/15 border border-[#FF007A]/40 flex items-center justify-center mx-auto mb-2.5 text-[#FF007A]">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
                YARROWPLAY <span className="text-[#FF007A]">COIN STORE</span>
              </h3>
              <p className="text-xs text-[#8F8F98] mt-1">
                Your current balance:{' '}
                <strong className="text-[#FF007A] font-bold">{balance} Coins</strong>
              </p>
            </div>

            <div className="space-y-2 mb-4">
              {/* Daily Free Coins */}
              <div className="border border-[#292929] bg-[#191919] rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" /> Daily Check-in
                  </div>
                  <div className="text-[11px] text-[#8F8F98] mt-0.5">+50 Coins for free</div>
                </div>
                <button
                  onClick={() => handleClaimBonus(50)}
                  className="text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white px-3 py-1.5 rounded-lg transition-all shadow-[0_2px_10px_rgba(255,0,122,0.3)]"
                >
                  Claim Free
                </button>
              </div>

              {/* Tier 1 */}
              <div className="border border-[#292929] bg-[#191919] rounded-xl p-3 flex items-center justify-between hover:border-[#FF007A]/50 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-white">100 Coins</div>
                  <div className="text-[11px] text-[#8F8F98]">Unlock 5 premium episodes</div>
                </div>
                <button
                  onClick={() => handleClaimBonus(100)}
                  className="text-xs font-bold bg-[#262626] hover:bg-[#FF007A] text-white px-3 py-1.5 rounded-lg transition-all"
                >
                  $0.99
                </button>
              </div>

              {/* Tier 2 */}
              <div className="border border-[#FF007A]/60 bg-[#221019] rounded-xl p-3 flex items-center justify-between relative shadow-[0_0_15px_rgba(255,0,122,0.15)]">
                <div className="absolute -top-2 right-3 bg-[#FF007A] text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Popular
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">350 Coins</div>
                  <div className="text-[11px] text-pink-300">Unlock 17+ episodes</div>
                </div>
                <button
                  onClick={() => handleClaimBonus(350)}
                  className="text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white px-3 py-1.5 rounded-lg shadow-[0_2px_10px_rgba(255,0,122,0.35)] transition-all"
                >
                  $2.99
                </button>
              </div>

              {/* Tier 3 */}
              <div className="border border-[#292929] bg-[#191919] rounded-xl p-3 flex items-center justify-between hover:border-[#FF007A]/50 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-white">1000 Coins</div>
                  <div className="text-[11px] text-[#8F8F98]">Unlock multiple full series</div>
                </div>
                <button
                  onClick={() => handleClaimBonus(1000)}
                  className="text-xs font-bold bg-[#262626] hover:bg-[#FF007A] text-white px-3 py-1.5 rounded-lg transition-all"
                >
                  $6.99
                </button>
              </div>
            </div>

            <p className="text-[10px] text-[#8F8F98] text-center">
              (Instant YarrowPlay coin delivery)
            </p>
          </div>
        </div>
      )}
    </>
  );
};
