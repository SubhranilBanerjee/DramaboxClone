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
  Video,
  AlertCircle,
  Building2,
  Briefcase,
  Megaphone,
  Sparkles
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
        setError('Please enter your display name.');
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
          showToast('Welcome to YarrowPlay! Account created with 100 Coins.', 'success');
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
    const res = await signIn('demo.viewer@yarrowplay.stream', 'drama123456');
    if (res.success) {
      showToast('Signed in as Demo VIP Viewer!', 'success');
      onClose();
      router.push('/viewer/dashboard');
    } else {
      setError('Demo login failed.');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#151515] border border-[#292929] rounded-2xl p-6 sm:p-7 shadow-[0_10px_40px_rgba(0,0,0,0.9)] max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8F8F98] hover:text-white p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <img
              src="/logo.png"
              alt="YarrowPlay"
              className="w-9 h-9 object-contain"
            />
            <span className="font-extrabold text-base tracking-wider text-white uppercase">
              YARROW<span className="text-[#FF007A]">PLAY</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-xs text-[#8F8F98] mt-1">
            {mode === 'login'
              ? 'Enter your credentials to access your library'
              : 'Select your account type to get started'}
          </p>
        </div>

        {/* In Register mode: Role pill selector matching screenshot */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0d0d0d] border border-[#292929] rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setRole('viewer')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'viewer'
                  ? 'bg-[#FF007A] text-white shadow-[0_2px_12px_rgba(255,0,122,0.4)]'
                  : 'text-[#8F8F98] hover:text-white bg-transparent'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Viewer</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                role === 'creator'
                  ? 'bg-[#FF007A] text-white shadow-[0_2px_12px_rgba(255,0,122,0.4)]'
                  : 'text-[#8F8F98] hover:text-white bg-transparent'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Content Creator</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                DISPLAY NAME
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Vance"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-[#FF007A] focus:ring-1 focus:ring-[#FF007A] transition-all"
                />
              </div>
            </div>
          )}

          {mode === 'register' && isCreator && (
            <div>
              <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
                CREATOR STUDIO NAME
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Neon Rebel Studios"
                  value={studioName}
                  onChange={(e) => setStudioName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-[#FF007A] focus:ring-1 focus:ring-[#FF007A] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
              EMAIL ADDRESS
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#8F8F98] absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#191919] border border-[#292929] rounded-xl text-white placeholder-[#5A5A65] focus:outline-none focus:border-[#FF007A] focus:ring-1 focus:ring-[#FF007A] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8F8F98] uppercase tracking-wider mb-1.5">
              PASSWORD
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

          {/* Primary CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-full text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white shadow-[0_4px_20px_rgba(255,0,122,0.35)] hover:shadow-[0_4px_25px_rgba(255,0,122,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In to YarrowPlay'
              : isCreator
              ? 'Register as Content Creator'
              : 'Register as Viewer'}
          </button>
        </form>

        {/* Quick Demo Login in Sign-In mode */}
        {mode === 'login' && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={handleQuickDemoViewer}
              className="text-[11px] font-semibold text-[#8F8F98] hover:text-[#FF007A] transition-colors inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#FF007A]" /> 1-Click Demo VIP Login
            </button>
          </div>
        )}

        {/* Bottom Toggle Subtext */}
        <div className="mt-5 text-center text-xs text-[#8F8F98]">
          {mode === 'login' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="font-bold text-[#FF007A] hover:underline ml-1"
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="font-bold text-[#FF007A] hover:underline ml-1"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
