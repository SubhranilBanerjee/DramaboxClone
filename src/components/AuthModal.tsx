'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Clapperboard,
  Sparkles,
  AlertCircle,
  Video,
  Building2,
  Briefcase,
  ShieldCheck,
  Megaphone
} from 'lucide-react';
import { useAuth, ADMIN_CREDENTIALS } from '@/context/AuthContext';
import { useToast } from './Toast';
import { UserRole } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
  defaultRole = 'viewer',
}) => {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [studioName, setStudioName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Consumer Tech & Apps');
  const [adBudget, setAdBudget] = useState('$2,500/mo');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isCreator = role === 'creator';
  const isAdvertiser = role === 'advertiser';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (mode === 'register') {
      if (!username.trim()) {
        setError('Please enter a username.');
        setIsLoading(false);
        return;
      }
      if (isCreator && !studioName.trim()) {
        setError('Please enter your Studio name.');
        setIsLoading(false);
        return;
      }
      if (isAdvertiser && !companyName.trim()) {
        setError('Please enter your Company / Brand name.');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setIsLoading(false);
        return;
      }

      const res = await signUp(
        email,
        password,
        username,
        isCreator
          ? {
              role: 'creator',
              studio_name: studioName.trim(),
              creator_category: 'suspense',
            }
          : isAdvertiser
          ? {
              role: 'advertiser',
              company_name: companyName.trim(),
              industry: industry,
              ad_budget: adBudget,
            }
          : { role: 'viewer' }
      );

      if (res.success) {
        if (isCreator) {
          showToast('Creator Studio registered! Redirecting to Studio...', 'success');
          onClose();
          router.push('/creator/dashboard');
        } else if (isAdvertiser) {
          showToast('Advertiser account created! Redirecting to Vendor Portal...', 'success');
          onClose();
          router.push('/advertiser/dashboard');
        } else {
          showToast('Welcome to DramaBox! Account created with 100 Coins.', 'success');
          onClose();
          router.push('/viewer/dashboard');
        }
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } else {
      const res = await signIn(email, password);
      if (res.success) {
        showToast('Successfully signed in!', 'success');
        onClose();
        if (email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase().trim()) {
          router.push('/admin');
        } else if (email.includes('creator')) {
          router.push('/creator/dashboard');
        } else if (email.includes('advertiser') || email.includes('vendor')) {
          router.push('/advertiser/dashboard');
        }
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    }

    setIsLoading(false);
  };

  const handleQuickDemoViewer = async () => {
    setIsLoading(true);
    setError(null);
    const res = await signIn('demo.viewer@dramabox.stream', 'drama123456');
    if (res.success) {
      showToast('Signed in as Demo VIP Viewer!', 'success');
      onClose();
      router.push('/viewer/dashboard');
    } else {
      setError('Demo login failed.');
    }
    setIsLoading(false);
  };

  const handleQuickDemoCreator = async () => {
    setIsLoading(true);
    setError(null);
    const res = await signIn('creator.studio@dramabox.stream', 'studio123456');
    if (res.success) {
      showToast('Signed in as Demo Creator Studio!', 'success');
      onClose();
      router.push('/creator/dashboard');
    } else {
      setError('Creator demo login failed.');
    }
    setIsLoading(false);
  };

  const handleQuickDemoAdmin = async () => {
    setIsLoading(true);
    setError(null);
    const res = await signIn(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    if (res.success) {
      showToast('Signed in as System Administrator!', 'success');
      onClose();
      router.push('/admin');
    } else {
      setError('Admin login failed.');
    }
    setIsLoading(false);
  };

  const handleQuickDemoAdvertiser = async () => {
    setIsLoading(true);
    setError(null);
    const res = await signIn('partner@apexbrands.com', 'advertiser123');
    if (res.success) {
      showToast('Signed in as Demo Advertiser / Brand Vendor!', 'success');
      onClose();
      router.push('/advertiser/dashboard');
    } else {
      setError('Advertiser demo login failed.');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0e0c1c] border border-[#2d2554] rounded-2xl p-6 sm:p-7 shadow-[0_0_40px_rgba(255,42,141,0.25)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(255,42,141,0.5)] mb-2.5">
            <div className="w-full h-full bg-[#0d0b1a] rounded-[10px] flex items-center justify-center">
              {isAdvertiser && mode === 'register' ? (
                <Megaphone className="w-5 h-5 text-amber-400" />
              ) : isCreator && mode === 'register' ? (
                <Video className="w-5 h-5 text-pink-400" />
              ) : (
                <Clapperboard className="w-5 h-5 text-pink-400" />
              )}
            </div>
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            {mode === 'login'
              ? 'WELCOME BACK'
              : isAdvertiser
              ? 'VENDOR / ADVERTISER'
              : isCreator
              ? 'JOIN AS CREATOR'
              : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {mode === 'login'
              ? 'Sign in to access your custom dashboard and library'
              : isAdvertiser
              ? 'Sponsor vertical reels and reach millions of active viewers'
              : isCreator
              ? 'Upload vertical reels to Cloudinary and monetize views'
              : 'Join DramaBox and claim 100 Free Starter Coins'}
          </p>
        </div>

        {/* Mode Toggle (Sign In vs Register) */}
        <div className="flex border-b border-[#221c3d] mb-4">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 transition-all ${
              mode === 'login'
                ? 'border-pink-500 neon-text-pink font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 transition-all ${
              mode === 'register'
                ? 'border-cyan-400 neon-text-cyan font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* In Register mode: 3-Way Role switcher */}
        {mode === 'register' && (
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#141026] border border-[#261f47] rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setRole('viewer')}
              className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                role === 'viewer'
                  ? 'bg-[#1e173d] text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" /> Viewer
            </button>
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                role === 'creator'
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_8px_rgba(255,42,141,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3 h-3 text-pink-200" /> Creator
            </button>
            <button
              type="button"
              onClick={() => setRole('advertiser')}
              className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                role === 'advertiser'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Megaphone className="w-3 h-3 text-amber-200" /> Advertiser
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && isCreator && (
            <div>
              <label className="block text-[11px] font-medium text-pink-300 mb-1">
                Creator Studio Name
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-pink-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Rebel Studios"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#141026] border border-pink-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 transition-all"
                />
              </div>
            </div>
          )}

          {mode === 'register' && isAdvertiser && (
            <>
              <div>
                <label className="block text-[11px] font-medium text-amber-300 mb-1">
                  Brand / Company Name
                </label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 text-amber-400 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Global Media"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-[#141026] border border-amber-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white focus:outline-none"
                  >
                    <option value="Tech & Apps">Tech & Mobile Apps</option>
                    <option value="Fashion & Beauty">Fashion & Beauty</option>
                    <option value="Gaming & Esports">Gaming & Esports</option>
                    <option value="FMCG & Beverages">FMCG & Beverages</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">Monthly Budget</label>
                  <select
                    value={adBudget}
                    onChange={(e) => setAdBudget(e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white focus:outline-none"
                  >
                    <option value="$1,000/mo">$1,000 / mo</option>
                    <option value="$2,500/mo">$2,500 / mo</option>
                    <option value="$5,000/mo">$5,000 / mo</option>
                    <option value="$10,000+/mo">$10,000+ / mo</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-medium text-slate-300 mb-1">
                Account Username
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. NeonVIP"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              {isAdvertiser && mode === 'register' ? 'Business Work Email' : 'Email Address'}
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder={isAdvertiser ? 'sponsor@yourbrand.com' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-500 hover:text-slate-300 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,42,141,0.5)] hover:shadow-[0_0_25px_rgba(255,42,141,0.8)] disabled:opacity-50"
          >
            {isLoading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In to DramaBox'
              : isAdvertiser
              ? 'Register Advertiser / Vendor'
              : isCreator
              ? 'Register Creator Studio'
              : 'Create Viewer Account (+100 Coins)'}
          </button>
        </form>

        {/* Quick Demo Shortcuts for All 4 Roles */}
        <div className="mt-4 pt-3 border-t border-[#201a3b] space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 text-center font-bold">
            ⚡ 1-Click Role Testing:
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={handleQuickDemoViewer}
              disabled={isLoading}
              className="py-1.5 px-2 rounded-lg border border-cyan-500/30 bg-[#121026] text-cyan-300 hover:border-cyan-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Viewer
            </button>
            <button
              type="button"
              onClick={handleQuickDemoCreator}
              disabled={isLoading}
              className="py-1.5 px-2 rounded-lg border border-pink-500/40 bg-[#190f2b] text-pink-300 hover:border-pink-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all shadow-[0_0_10px_rgba(255,42,141,0.2)]"
            >
              <Video className="w-3 h-3 text-pink-400" />
              Creator
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              disabled={isLoading}
              className="py-1.5 px-2 rounded-lg border border-purple-500/50 bg-[#1e1338] text-purple-300 hover:border-purple-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all shadow-[0_0_10px_rgba(168,85,247,0.3)]"
            >
              <ShieldCheck className="w-3 h-3 text-purple-400" />
              Admin
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdvertiser}
              disabled={isLoading}
              className="py-1.5 px-2 rounded-lg border border-amber-500/40 bg-[#24170d] text-amber-300 hover:border-amber-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]"
            >
              <Megaphone className="w-3 h-3 text-amber-400" />
              Advertiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
