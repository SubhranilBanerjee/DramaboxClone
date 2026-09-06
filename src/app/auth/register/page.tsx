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
  Clapperboard,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Video,
  CheckCircle2,
  ShieldCheck,
  Film,
  Building2,
  AtSign,
  Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { UserRole } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState<UserRole>('viewer');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Creator & Vendor specific fields
  const [studioName, setStudioName] = useState('');
  const [channelHandle, setChannelHandle] = useState('');
  const [creatorCategory, setCreatorCategory] = useState('revenge');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCreator = role === 'creator';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your desired username.');
      return;
    }
    if (isCreator && !studioName.trim()) {
      setError('Please enter your Studio or Creator brand name.');
      return;
    }
    if (isCreator && !agreedToTerms) {
      setError('Please accept the Creator Distribution & Video Verification agreement.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const res = await signUp(
      email,
      password,
      username,
      isCreator
        ? {
            role: 'creator',
            studio_name: studioName.trim(),
            channel_handle: channelHandle.trim()
              ? channelHandle.startsWith('@')
                ? channelHandle.trim()
                : `@${channelHandle.trim()}`
              : `@${username.toLowerCase().replace(/\s+/g, '')}`,
            creator_category: creatorCategory,
          }
        : { role: 'viewer' }
    );

    if (res.success) {
      if (isCreator) {
        showToast('Creator Studio account activated! Welcome to DramaBox Studio.', 'success');
        router.push('/creator/dashboard');
      } else {
        showToast('Welcome to DramaBox! Account created with 100 Starter Coins.', 'success');
        router.push('/');
      }
    } else {
      setError(res.error || 'Failed to create account.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-[#07060e] relative z-10">
      {/* Cyber ambient glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-pink-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg border border-[#2d2554] rounded-2xl p-6 sm:p-8 bg-[#0e0c1c] shadow-[0_0_45px_rgba(255,42,141,0.2)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-cyan-400 p-[1px] mx-auto mb-3 shadow-[0_0_20px_rgba(255,42,141,0.5)]">
            <div className="w-full h-full bg-[#0d0b1a] rounded-[11px] flex items-center justify-center">
              {isCreator ? (
                <Video className="w-6 h-6 text-pink-400" />
              ) : (
                <Clapperboard className="w-6 h-6 text-cyan-400" />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            {isCreator ? (
              <>
                CREATOR & VENDOR <span className="neon-sign-pink">STUDIO</span>
              </>
            ) : (
              <>
                CREATE AN <span className="neon-sign-cyan">ACCOUNT</span>
              </>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isCreator
              ? 'Upload your vertical reel series, verify video compliance & monetize your content'
              : 'Join DramaBox and instantly claim 100 Free Starter Coins to unlock episodes!'}
          </p>
        </div>

        {/* Account Role Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#141026] border border-[#261f47] rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('viewer')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              !isCreator
                ? 'bg-[#1e173d] text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Viewer Account</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('creator')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              isCreator
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(255,42,141,0.5)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-pink-300" />
            <span>Creator / Vendor</span>
          </button>
        </div>

        {/* Creator Benefit Callout */}
        {isCreator && (
          <div className="mb-5 p-3 rounded-xl bg-[#170e28] border border-pink-500/30 text-xs text-slate-300 space-y-1.5 shadow-[0_0_15px_rgba(255,42,141,0.15)]">
            <div className="font-bold text-pink-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-pink-400" /> Creator Studio Privileges
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Includes access to the <strong>Video Verification QA Lab</strong> with 9:16 vertical simulator,
              automated audio/codec compliance scanning, coin unlock monetization, and instant publishing.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Studio Name (Creator only) */}
          {isCreator && (
            <div className="animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-pink-300 mb-1">
                Studio / Creator Brand Name <span className="text-pink-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-pink-400/70 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Rebel Studios, Dragonfire Media"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-pink-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 focus:shadow-[0_0_12px_rgba(255,42,141,0.3)] transition-all"
                />
              </div>
            </div>
          )}

          {/* Account Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isCreator ? 'Lead Creator Username' : 'Username'}
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                placeholder={isCreator ? 'e.g. director_alex' : 'e.g. NeonReel'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
              />
            </div>
          </div>

          {/* Creator Channel Handle & Genre (Creator only) */}
          {isCreator && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Channel Handle
                </label>
                <div className="relative flex items-center">
                  <AtSign className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="@neonreels"
                    value={channelHandle}
                    onChange={(e) => setChannelHandle(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Primary Genre
                </label>
                <div className="relative flex items-center">
                  <Film className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                  <select
                    value={creatorCategory}
                    onChange={(e) => setCreatorCategory(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all"
                  >
                    <option value="revenge">Revenge / Billionaire</option>
                    <option value="romance">Romance / Contract Love</option>
                    <option value="suspense">Suspense / Mystery</option>
                    <option value="costume">Historical / Martial Arts</option>
                    <option value="scifi">Cyberpunk / Sci-Fi</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder={isCreator ? 'studio@productions.stream' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
              />
            </div>
          </div>

          {/* Portfolio or Website (Creator only) */}
          {isCreator && (
            <div className="animate-in fade-in duration-200">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Portfolio or Showreel URL <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative flex items-center">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="url"
                  placeholder="https://vimeo.com/your-studio"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>
          )}

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="6+ chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Creator Terms Checkbox */}
          {isCreator && (
            <div className="flex items-start gap-2.5 pt-2 animate-in fade-in duration-200">
              <input
                id="creator-agreement"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#382b61] bg-[#141026] text-pink-500 focus:ring-pink-500 accent-pink-500 cursor-pointer"
              />
              <label htmlFor="creator-agreement" className="text-[11px] text-slate-400 leading-relaxed cursor-pointer">
                I agree to the <span className="text-pink-400 font-semibold">DramaBox Creator & Vendor Distribution Terms</span>.
                I certify that all uploaded videos are original productions or legally licensed, and will be certified through the QA Verification Lab.
              </label>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              isCreator
                ? 'bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(255,42,141,0.6)] hover:shadow-[0_0_30px_rgba(255,42,141,0.9)] hover:scale-[1.01]'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] hover:scale-[1.01]'
            } disabled:opacity-50`}
          >
            {isCreator ? (
              <>
                <Video className="w-4 h-4 text-pink-200" />
                {isLoading ? 'Creating Creator Studio...' : 'Register as Creator & Open Studio'}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-900" />
                {isLoading ? 'Creating Account...' : 'Register & Claim 100 Coins'}
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#201a3b] flex items-center justify-between text-xs text-slate-400">
          <span>Already have an account?</span>
          <Link href="/auth/login" className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline">
            Sign in here →
          </Link>
        </div>
      </div>
    </div>
  );
}
