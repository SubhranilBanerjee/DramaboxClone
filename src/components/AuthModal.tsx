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
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isCreator = role === 'creator';

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
          : { role: 'viewer' }
      );

      if (res.success) {
        if (isCreator) {
          showToast('Creator Studio registered! Redirecting to Dashboard...', 'success');
          onClose();
          router.push('/creator/dashboard');
        } else {
          showToast('Welcome to DramaBox! Account created with 100 Coins.', 'success');
          onClose();
        }
      } else {
        setError(res.error || 'Failed to create account.');
      }
    } else {
      const res = await signIn(email, password);
      if (res.success) {
        showToast('Successfully signed in!', 'success');
        onClose();
        if (email.includes('creator')) {
          router.push('/creator/dashboard');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0e0c1c] border border-[#2d2554] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,42,141,0.25)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-cyan-400 p-[1px] shadow-[0_0_15px_rgba(255,42,141,0.5)] mb-3">
            <div className="w-full h-full bg-[#0d0b1a] rounded-[10px] flex items-center justify-center">
              {isCreator && mode === 'register' ? (
                <Video className="w-5 h-5 text-pink-400" />
              ) : (
                <Clapperboard className="w-5 h-5 text-pink-400" />
              )}
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {mode === 'login' ? 'WELCOME BACK' : isCreator ? 'JOIN AS CREATOR' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Sign in to access your unlocked episodes and studio features'
              : isCreator
              ? 'Upload vertical reels, run QA video verification & monetize'
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
            className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
              mode === 'login'
                ? 'border-pink-500 neon-text-pink'
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
            className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
              mode === 'register'
                ? 'border-cyan-400 neon-text-cyan'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Register
          </button>
        </div>

        {/* In Register mode: Role switcher */}
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#141026] border border-[#261f47] rounded-xl mb-4">
            <button
              type="button"
              onClick={() => setRole('viewer')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                !isCreator
                  ? 'bg-[#1e173d] text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" /> Viewer
            </button>
            <button
              type="button"
              onClick={() => setRole('creator')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isCreator
                  ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_12px_rgba(255,42,141,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3 h-3 text-pink-200" /> Creator / Vendor
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && isCreator && (
            <div>
              <label className="block text-xs font-medium text-pink-300 mb-1">
                Studio / Vendor Name
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

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Username
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
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
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
            className="w-full mt-3 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,42,141,0.5)] hover:shadow-[0_0_25px_rgba(255,42,141,0.8)] disabled:opacity-50"
          >
            {isLoading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In to DramaBox'
              : isCreator
              ? 'Register Creator Studio'
              : 'Create Account (+100 Coins)'}
          </button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="mt-4 pt-3.5 border-t border-[#201a3b] space-y-2">
          <div className="text-[11px] text-slate-400 text-center font-medium">Quick Demo Testing:</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={handleQuickDemoViewer}
              disabled={isLoading}
              className="py-1.5 px-2.5 rounded-lg border border-cyan-500/30 bg-[#121026] text-cyan-300 hover:border-cyan-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Demo Viewer
            </button>
            <button
              type="button"
              onClick={handleQuickDemoCreator}
              disabled={isLoading}
              className="py-1.5 px-2.5 rounded-lg border border-pink-500/40 bg-[#190f2b] text-pink-300 hover:border-pink-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all shadow-[0_0_10px_rgba(255,42,141,0.2)]"
            >
              <Video className="w-3 h-3 text-pink-400" />
              Demo Creator
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
