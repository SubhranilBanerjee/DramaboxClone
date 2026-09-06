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
  Clapperboard,
  LogOut,
  ChevronDown
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
    { label: 'Revenge', href: '/#revenge' },
    { label: 'Romance', href: '/#romance' },
    { label: 'Suspense', href: '/#suspense' },
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

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0c0a18]/90 backdrop-blur-md border-b border-[#221c3d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand (Styled like the "ICONIC" Neon Sign) */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-cyan-400 p-[1px] shadow-[0_0_12px_rgba(255,42,141,0.6)]">
                <div className="w-full h-full bg-[#0d0b1a] rounded-[7px] flex items-center justify-center">
                  <Clapperboard className="w-4 h-4 text-pink-400 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white uppercase flex items-center">
                DRAMA
                <span className="neon-sign-pink font-black ml-1 tracking-widest text-pink-400">
                  BOX
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-sm font-medium transition-all ${
                      isActive
                        ? 'neon-text-cyan font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.7)]'
                        : 'text-slate-400 hover:text-pink-400 hover:drop-shadow-[0_0_6px_rgba(255,42,141,0.6)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-[#131127] border border-[#262046] rounded-full px-3.5 py-1.5 text-xs text-slate-300 focus-within:border-cyan-400 focus-within:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <input
                type="text"
                placeholder="Search dramas, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-white w-32 xl:w-44 placeholder-slate-500"
              />
            </div>

            {/* Neon Coin Balance Pill Button */}
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="flex items-center gap-1.5 bg-[#141126] hover:bg-[#1a1633] border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,240,255,0.35)] text-slate-100 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              title="Click to manage coins"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
              <span className="neon-text-cyan font-bold">{balance}</span>
              <span className="hidden sm:inline text-slate-400 font-normal">Coins</span>
              <div className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center ml-0.5 text-cyan-300">
                <Plus className="w-2.5 h-2.5" />
              </div>
            </button>

            {/* AUTH / PROFILE SECTION */}
            {user ? (
              /* Logged In User Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2.5 pr-2 rounded-full border border-pink-500/40 hover:border-pink-400 hover:shadow-[0_0_12px_rgba(255,42,141,0.35)] transition-all bg-[#141126] text-xs font-semibold text-white"
                >
                  <span className="max-w-[90px] truncate text-slate-200">{user.username}</span>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold shadow-[0_0_8px_rgba(255,42,141,0.5)]">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-[#100e21] border border-[#2f2756] rounded-xl shadow-[0_0_25px_rgba(0,0,0,0.8)] p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2 border-b border-[#231d42]">
                        <p className="text-xs font-bold text-white truncate">{user.username}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-[#1a1636] rounded-lg font-medium transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        My Profile & Wallet
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-950/40 rounded-lg font-medium transition-colors text-left"
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
                  className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthOpen(true);
                  }}
                  className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-[0_0_12px_rgba(255,42,141,0.5)] hover:shadow-[0_0_20px_rgba(255,42,141,0.8)] hover:scale-105 flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-cyan-300" />
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

      {/* Coin Top-up / Claim Modal (Neon Dark Edition) */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-[#0e0c1c] border border-[#2d2554] rounded-2xl p-6 shadow-[0_0_35px_rgba(255,42,141,0.2)]">
            <button
              onClick={() => setIsTopUpOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 border border-pink-500/40 flex items-center justify-center mx-auto mb-3 text-pink-400 shadow-[0_0_15px_rgba(255,42,141,0.3)]">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">
                DRAMABOX <span className="neon-text-pink">COIN STORE</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your current balance:{' '}
                <strong className="neon-text-cyan font-bold">{balance} Coins</strong>
              </p>
            </div>

            <div className="space-y-2.5 mb-5">
              {/* Daily Free Coins */}
              <div className="border border-cyan-500/30 bg-[#091522] rounded-xl p-3 flex items-center justify-between shadow-[0_0_12px_rgba(0,240,255,0.15)]">
                <div>
                  <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Daily Check-in
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">+50 Coins for free</div>
                </div>
                <button
                  onClick={() => handleClaimBonus(50)}
                  className="text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1.5 rounded-lg transition-all shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                >
                  Claim Free
                </button>
              </div>

              {/* Tier 1 */}
              <div className="border border-[#262046] bg-[#121024] rounded-xl p-3 flex items-center justify-between hover:border-pink-500/50 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-white">100 Coins</div>
                  <div className="text-[11px] text-slate-400">Unlock 5 premium episodes</div>
                </div>
                <button
                  onClick={() => handleClaimBonus(100)}
                  className="text-xs font-semibold bg-[#221c3d] hover:bg-pink-600 text-white px-3 py-1.5 rounded-lg transition-all hover:shadow-[0_0_10px_rgba(255,42,141,0.5)]"
                >
                  $0.99
                </button>
              </div>

              {/* Tier 2 */}
              <div className="border border-pink-500/60 bg-[#16122d] rounded-xl p-3 flex items-center justify-between relative shadow-[0_0_18px_rgba(255,42,141,0.2)]">
                <div className="absolute -top-2 right-3 bg-pink-500 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-[0_0_8px_rgba(255,42,141,0.6)]">
                  Most Popular
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">350 Coins</div>
                  <div className="text-[11px] text-pink-300">Unlock 17+ episodes</div>
                </div>
                <button
                  onClick={() => handleClaimBonus(350)}
                  className="text-xs font-semibold bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-1.5 rounded-lg shadow-[0_0_12px_rgba(255,42,141,0.5)] hover:scale-105 transition-all"
                >
                  $2.99
                </button>
              </div>

              {/* Tier 3 */}
              <div className="border border-[#262046] bg-[#121024] rounded-xl p-3 flex items-center justify-between hover:border-cyan-500/50 transition-colors">
                <div>
                  <div className="text-xs font-semibold text-white">1000 Coins</div>
                  <div className="text-[11px] text-slate-400">Unlock multiple full dramas</div>
                </div>
                <button
                  onClick={() => handleClaimBonus(1000)}
                  className="text-xs font-semibold bg-[#221c3d] hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg transition-all hover:shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                >
                  $6.99
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center">
              (Mock payment sandbox: instant neon coin delivery)
            </p>
          </div>
        </div>
      )}
    </>
  );
};
