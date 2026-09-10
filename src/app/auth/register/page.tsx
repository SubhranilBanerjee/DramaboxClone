'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Video,
  Building2,
  Megaphone,
  CheckCircle2,
  Sparkles,
  Coins,
  Compass,
  Check,
  Globe,
  Phone,
  Film,
  Layers,
  ChevronRight,
  Tv
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { UserRole } from '@/lib/types';

const GENRE_OPTIONS = [
  'Romance & CEO',
  'Billionaire Revenge',
  'Action & Suspense',
  'Fantasy & Werewolf',
  'Sci-Fi Thriller',
  'Historical & Costume',
  'Urban Drama',
  'Romantic Comedy',
];

const SUBTITLE_LANGUAGES = [
  'English',
  'Spanish',
  'Mandarin (Chinese)',
  'Hindi',
  'Japanese',
  'French',
  'Portuguese',
];

const CREATOR_CATEGORIES = [
  { id: 'revenge', label: 'Billionaire Revenge & Drama' },
  { id: 'romance', label: 'CEO & Secret Heir Romance' },
  { id: 'suspense', label: 'Crime Thriller & Suspense' },
  { id: 'action', label: 'Martial Arts & Action' },
  { id: 'scifi', label: 'Urban Fantasy & Sci-Fi' },
];

const ADVERTISER_INDUSTRIES = [
  'Tech & Mobile Apps',
  'Fashion & Luxury',
  'Gaming & Esports',
  'FMCG & Consumer Goods',
  'Finance & Fintech',
  'Entertainment & Streaming',
  'Health & Wellness',
];

const ADVERTISER_BUDGETS = [
  { id: '$1,000/mo', label: '$1,000 / mo — Starter Tier' },
  { id: '$2,500/mo', label: '$2,500 / mo — Growth Tier' },
  { id: '$5,000/mo', label: '$5,000 / mo — Enterprise Tier' },
  { id: '$15,000+/mo', label: '$15,000+ / mo — Exclusive Series Sponsor' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { showToast } = useToast();

  // Wizard Step State: 1 = Account Credentials & Role, 2 = Role Specific Setup
  const [step, setStep] = useState<1 | 2>(1);

  // Part 1: Account credentials & Role Selection
  const [role, setRole] = useState<UserRole>('viewer');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Part 2: Viewer Specific Fields
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    'Romance & CEO',
    'Billionaire Revenge',
  ]);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Part 2: Creator Specific Fields
  const [studioName, setStudioName] = useState('');
  const [channelHandle, setChannelHandle] = useState('');
  const [creatorCategory, setCreatorCategory] = useState('revenge');
  const [studioBio, setStudioBio] = useState('');
  const [sampleReelUrl, setSampleReelUrl] = useState('');
  const [agreeGuidelines, setAgreeGuidelines] = useState(true);

  // Part 2: Advertiser Specific Fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Tech & Mobile Apps');
  const [adBudget, setAdBudget] = useState('$2,500/mo');
  const [adPlacement, setAdPlacement] = useState('video_preroll');
  const [contactPhone, setContactPhone] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-sync handle when username changes if not set yet
  const handleUsernameChange = (val: string) => {
    setUsername(val);
    if (!channelHandle || channelHandle.startsWith('@')) {
      const sanitized = val.toLowerCase().replace(/[^a-z0-9]/g, '');
      setChannelHandle(sanitized ? `@${sanitized}` : '');
    }
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      if (selectedGenres.length > 1) {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Step 1 Validation & Proceed to Step 2
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your full or display name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    // Default company or studio name from display name if blank
    if (role === 'creator' && !studioName) {
      setStudioName(`${username.trim()} Studios`);
    }
    if (role === 'advertiser' && !companyName) {
      setCompanyName(`${username.trim()} Media`);
    }

    setStep(2);
  };

  // Step 2 Submission
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (role === 'creator') {
      if (!studioName.trim()) {
        setError('Please enter your Creator Studio / Production name.');
        return;
      }
      if (!agreeGuidelines) {
        setError('You must agree to the 9:16 vertical safe-zone standards to publish.');
        return;
      }
    }

    if (role === 'advertiser') {
      if (!companyName.trim()) {
        setError('Please enter your Company / Brand name.');
        return;
      }
    }

    setIsLoading(true);

    let extraData = {};
    if (role === 'viewer') {
      extraData = {
        role: 'viewer',
        favorite_genres: selectedGenres,
        preferred_language: preferredLanguage,
      };
    } else if (role === 'creator') {
      extraData = {
        role: 'creator',
        studio_name: studioName.trim(),
        channel_handle: channelHandle.startsWith('@') ? channelHandle : `@${channelHandle}`,
        creator_category: creatorCategory,
        bio: studioBio.trim() || undefined,
        website_url: sampleReelUrl.trim() || undefined,
      };
    } else if (role === 'advertiser') {
      extraData = {
        role: 'advertiser',
        company_name: companyName.trim(),
        industry,
        ad_budget: adBudget,
        contact_phone: contactPhone.trim() || undefined,
        website_url: websiteUrl.trim() || undefined,
      };
    }

    const res = await signUp(email, password, username, extraData);

    if (res.success) {
      if (role === 'creator') {
        showToast('Creator Studio account activated! Welcome to YarrowPlay Studio.', 'success');
        router.push('/creator/dashboard');
      } else if (role === 'advertiser') {
        showToast('Advertiser account created! Welcome to Brand Campaign Hub.', 'success');
        router.push('/advertiser/dashboard');
      } else {
        showToast('Welcome to YarrowPlay! 100 Starter Coins added to your wallet.', 'success');
        router.push('/viewer/dashboard');
      }
    } else {
      setError(res.error || 'Failed to create account.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] flex items-center justify-center px-4 py-10 bg-[#070707] relative z-10">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF007A]/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl border border-[#292929] rounded-3xl p-6 sm:p-8 bg-[#141414] shadow-[0_15px_60px_rgba(0,0,0,0.9)] relative z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8F8F98] hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-2 mb-2">
            <img
              src="/logo.png"
              alt="YarrowPlay"
              className="w-8 h-8 object-contain"
            />
            <span className="font-extrabold text-base tracking-wider text-white uppercase">
              YARROW<span className="text-[#FF007A]">PLAY</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
            {step === 1 ? 'CREATE YOUR ACCOUNT' : 'PROFILE & PREFERENCES SETUP'}
          </h1>
          <p className="text-xs text-[#8F8F98] mt-1 max-w-md">
            {step === 1
              ? 'Choose your account type and credentials to get started'
              : role === 'viewer'
              ? 'Personalize your vertical streaming preferences and claim your starter coins'
              : role === 'creator'
              ? 'Configure your Creator Studio identity, channel handle, and production category'
              : 'Configure your company brand profile and vertical ad campaign preferences'}
          </p>
        </div>

        {/* ── 2-PART STEPPER INDICATOR ─────────────────────────────────── */}
        <div className="mb-6 p-1.5 bg-[#0d0d0d] border border-[#292929] rounded-2xl flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              step === 1
                ? 'bg-[#1e1e1e] text-white border border-[#383838] shadow-sm'
                : 'text-emerald-400 hover:text-white'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 1 ? 'bg-[#FF007A] text-white' : 'bg-emerald-500/20 text-emerald-400'
              }`}
            >
              {step > 1 ? <Check className="w-3 h-3" /> : '1'}
            </span>
            <span>Part 1: Account & Role</span>
          </button>

          <ChevronRight className="w-4 h-4 text-[#444] shrink-0" />

          <div
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              step === 2
                ? 'bg-[#1e1e1e] text-white border border-[#383838] shadow-sm'
                : 'text-[#666]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                step === 2 ? 'bg-[#FF007A] text-white' : 'bg-[#222] text-[#666]'
              }`}
            >
              2
            </span>
            <span>Part 2: {role === 'viewer' ? 'Preferences' : role === 'creator' ? 'Studio Setup' : 'Brand Profile'}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STEP 1: ACCOUNT CREDENTIALS & 3-WAY ROLE SELECTION             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <form onSubmit={handleProceedToStep2} className="space-y-5">
            {/* 3-Way Role Selector Cards */}
            <div>
              <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-2.5">
                SELECT YOUR USER TYPE *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* 1. Viewer Card */}
                <button
                  type="button"
                  onClick={() => setRole('viewer')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    role === 'viewer'
                      ? 'bg-[#1f101b] border-[#FF007A] shadow-[0_0_20px_rgba(255,0,122,0.25)] ring-1 ring-[#FF007A]'
                      : 'bg-[#181818] border-[#292929] hover:border-[#3d3d3d] text-[#8F8F98]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        role === 'viewer'
                          ? 'bg-[#FF007A] text-white shadow-[0_2px_8px_rgba(255,0,122,0.4)]'
                          : 'bg-[#222] text-[#8F8F98]'
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    {role === 'viewer' && (
                      <span className="w-2 h-2 rounded-full bg-[#FF007A] animate-ping" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase">Viewer</h4>
                    <p className="text-[10px] text-[#8F8F98] mt-1 leading-tight">
                      Stream vertical cliffhangers, unlock episodes with coins
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] font-bold text-[#FF007A]">
                    +100 Starter Coins
                  </div>
                </button>

                {/* 2. Content Creator Card */}
                <button
                  type="button"
                  onClick={() => setRole('creator')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    role === 'creator'
                      ? 'bg-[#1b122c] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)] ring-1 ring-purple-500'
                      : 'bg-[#181818] border-[#292929] hover:border-[#3d3d3d] text-[#8F8F98]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        role === 'creator'
                          ? 'bg-purple-600 text-white shadow-[0_2px_8px_rgba(168,85,247,0.4)]'
                          : 'bg-[#222] text-[#8F8F98]'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                    </div>
                    {role === 'creator' && (
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase">Content Creator</h4>
                    <p className="text-[10px] text-[#8F8F98] mt-1 leading-tight">
                      Upload 9:16 series, video QA lab, earn royalties
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] font-bold text-purple-400">
                    Studio QA Lab Access
                  </div>
                </button>

                {/* 3. Advertiser Card */}
                <button
                  type="button"
                  onClick={() => setRole('advertiser')}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    role === 'advertiser'
                      ? 'bg-[#221a10] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500'
                      : 'bg-[#181818] border-[#292929] hover:border-[#3d3d3d] text-[#8F8F98]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        role === 'advertiser'
                          ? 'bg-amber-500 text-black shadow-[0_2px_8px_rgba(245,158,11,0.4)]'
                          : 'bg-[#222] text-[#8F8F98]'
                      }`}
                    >
                      <Megaphone className="w-4 h-4" />
                    </div>
                    {role === 'advertiser' && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase">Advertiser</h4>
                    <p className="text-[10px] text-[#8F8F98] mt-1 leading-tight">
                      Sponsor vertical reels, target genres, track CTR
                    </p>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-white/5 text-[10px] font-bold text-amber-400">
                    Brand Campaign Hub
                  </div>
                </button>
              </div>
            </div>

            {/* Account Credentials Fields */}
            <div className="space-y-3.5">
              {/* Full Name / Display Name */}
              <div>
                <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                  {role === 'advertiser' ? 'BRAND CONTACT NAME *' : 'DISPLAY NAME *'}
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={role === 'advertiser' ? 'e.g. Marcus Vance' : 'e.g. Alex Vance'}
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-[#FF007A] focus:ring-1 focus:ring-[#FF007A] transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                  {role === 'advertiser' ? 'WORK EMAIL ADDRESS *' : 'EMAIL ADDRESS *'}
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder={role === 'advertiser' ? 'sponsor@apexbrands.com' : 'name@example.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-[#FF007A] focus:ring-1 focus:ring-[#FF007A] transition-all"
                  />
                </div>
              </div>

              {/* Password & Confirm Password in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                    PASSWORD *
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-9 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-[#FF007A] focus:ring-1 focus:ring-[#FF007A] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#8F8F98] hover:text-white p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                    CONFIRM PASSWORD *
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-[#FF007A] focus:ring-1 focus:ring-[#FF007A] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#FF007A] via-[#E6006E] to-[#CC0062] hover:brightness-110 text-white shadow-[0_4px_25px_rgba(255,0,122,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue to Part 2: Setup {role === 'viewer' ? 'Preferences' : role === 'creator' ? 'Creator Studio' : 'Brand Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* STEP 2: ROLE-SPECIFIC SETUP & ONBOARDING                        */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-5">
            {/* Back to Step 1 Button */}
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F8F98] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Details
            </button>

            {/* ── CASE 1: VIEWER ONBOARDING ──────────────────────────── */}
            {role === 'viewer' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#290a1a] to-[#160c18] border border-[#FF007A]/40 flex items-center gap-3 shadow-[0_0_20px_rgba(255,0,122,0.15)]">
                  <div className="w-10 h-10 rounded-xl bg-[#FF007A]/20 border border-[#FF007A]/40 flex items-center justify-center text-[#FF007A] shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                      <span>Starter Bonus Activated</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#FFC400]" />
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      100 Free Starter Coins will be loaded into your account immediately to unlock cliffhangers.
                    </p>
                  </div>
                </div>

                {/* Genre Preferences Chips */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-2">
                    FAVORITE DRAMA GENRES (SELECT ALL THAT APPLY)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GENRE_OPTIONS.map((genre) => {
                      const isSelected = selectedGenres.includes(genre);
                      return (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#FF007A] text-white shadow-[0_2px_12px_rgba(255,0,122,0.4)]'
                              : 'bg-[#191919] text-[#8F8F98] border border-[#292929] hover:border-white/20'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                          <span>{genre}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Subtitle Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      PREFERRED SUBTITLE LANGUAGE
                    </label>
                    <div className="relative flex items-center">
                      <Globe className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                      <select
                        value={preferredLanguage}
                        onChange={(e) => setPreferredLanguage(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-[#FF007A]"
                      >
                        {SUBTITLE_LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="p-2.5 rounded-xl bg-[#191919] border border-[#292929] flex items-center justify-between cursor-pointer">
                      <span className="text-xs font-bold text-white">Auto-advance cliffhangers</span>
                      <input
                        type="checkbox"
                        checked={autoplayNext}
                        onChange={(e) => setAutoplayNext(e.target.checked)}
                        className="w-4 h-4 accent-[#FF007A]"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ── CASE 2: CREATOR ONBOARDING ─────────────────────────── */}
            {role === 'creator' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-[#1b122c] border border-purple-500/40 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Creator Studio & Verification Suite</h4>
                    <p className="text-[11px] text-slate-300">
                      You will receive full access to the 9:16 Vertical QA Simulator and Automated Compliance Scanner.
                    </p>
                  </div>
                </div>

                {/* Studio Name & Handle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      STUDIO / CREATOR NAME *
                    </label>
                    <div className="relative flex items-center">
                      <Building2 className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Neon Rebel Studios"
                        value={studioName}
                        onChange={(e) => setStudioName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      CHANNEL HANDLE *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="@neonrebel"
                      value={channelHandle}
                      onChange={(e) => setChannelHandle(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white font-mono placeholder-[#5A5A65] focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Primary Category */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                    PRIMARY PRODUCTION CATEGORY
                  </label>
                  <select
                    value={creatorCategory}
                    onChange={(e) => setCreatorCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {CREATOR_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bio / Tagline */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                    STUDIO BIO & STORYTELLING STYLE
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. We specialize in fast-paced billionaire revenge cliffhangers with cinematic vertical framing."
                    value={studioBio}
                    onChange={(e) => setStudioBio(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                {/* Sample Reel / Portfolio link */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                    PORTFOLIO OR SAMPLE REEL URL (OPTIONAL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://vimeo.com/your-showreel"
                    value={sampleReelUrl}
                    onChange={(e) => setSampleReelUrl(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Guidelines agreement checkbox */}
                <label className="p-3 rounded-xl bg-[#191919] border border-[#292929] flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeGuidelines}
                    onChange={(e) => setAgreeGuidelines(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-purple-500 shrink-0"
                  />
                  <span className="text-[11px] text-slate-300 leading-snug">
                    I agree to adhere to YarrowPlay 9:16 vertical safe-zone standards and confirm our studio owns the distribution rights for submitted storylines.
                  </span>
                </label>
              </div>
            )}

            {/* ── CASE 3: ADVERTISER ONBOARDING ──────────────────────── */}
            {role === 'advertiser' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-2xl bg-[#221a10] border border-amber-500/40 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Native Vertical Sponsorship Network</h4>
                    <p className="text-[11px] text-slate-300">
                      Reach hyper-engaged streamers with non-intrusive 9:16 vertical pre-rolls and in-stream brand cliffhangers.
                    </p>
                  </div>
                </div>

                {/* Company Name & Sector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      COMPANY / BRAND NAME *
                    </label>
                    <div className="relative flex items-center">
                      <Building2 className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Global Brands"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      INDUSTRY / SECTOR
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-amber-400"
                    >
                      {ADVERTISER_INDUSTRIES.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget & Placement */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      ESTIMATED MONTHLY AD BUDGET
                    </label>
                    <select
                      value={adBudget}
                      onChange={(e) => setAdBudget(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-amber-400"
                    >
                      {ADVERTISER_BUDGETS.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      PREFERRED AD FORMAT
                    </label>
                    <select
                      value={adPlacement}
                      onChange={(e) => setAdPlacement(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="video_preroll">9:16 Video Pre-Roll (Non-skippable)</option>
                      <option value="sponsored_drama">In-Stream Sponsored Reel</option>
                      <option value="in_stream_banner">Brand Cliffhanger Banner</option>
                    </select>
                  </div>
                </div>

                {/* Contact Phone & Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      BUSINESS PHONE NUMBER
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 019-2834"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                      COMPANY WEBSITE
                    </label>
                    <div className="relative flex items-center">
                      <Globe className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                      <input
                        type="url"
                        placeholder="https://apexbrands.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Complete Registration Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full mt-2 py-3.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                role === 'viewer'
                  ? 'bg-gradient-to-r from-[#FF007A] to-[#D60066] hover:brightness-110 shadow-[0_4px_25px_rgba(255,0,122,0.4)]'
                  : role === 'creator'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110 shadow-[0_4px_25px_rgba(168,85,247,0.4)]'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 hover:brightness-110 text-slate-950 font-black shadow-[0_4px_25px_rgba(245,158,11,0.4)]'
              }`}
            >
              {isLoading ? (
                'Setting Up Account...'
              ) : role === 'viewer' ? (
                <>
                  <Coins className="w-4 h-4" />
                  <span>Claim 100 Starter Coins & Enter Viewer Hub</span>
                </>
              ) : role === 'creator' ? (
                <>
                  <Video className="w-4 h-4" />
                  <span>Activate Studio & Open Creator Dashboard</span>
                </>
              ) : (
                <>
                  <Megaphone className="w-4 h-4 text-slate-950" />
                  <span className="text-slate-950 font-black">Register Brand & Launch Campaign Hub</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-[#222222] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8F8F98] gap-2">
          <span>
            Already have an account?{' '}
            <Link href="/auth/login" className="font-bold text-[#FF007A] hover:underline ml-1">
              Sign In
            </Link>
          </span>

          <div className="flex items-center gap-3">
            <Link href="/viewer/dashboard" className="hover:text-white transition-colors">
              Viewer Hub
            </Link>
            <span>•</span>
            <Link href="/creator/dashboard" className="hover:text-white transition-colors">
              Creator Studio
            </Link>
            <span>•</span>
            <Link href="/advertiser/dashboard" className="hover:text-white transition-colors">
              Advertiser Hub
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
