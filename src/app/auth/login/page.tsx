'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await signIn(email, password);
    if (res.success) {
      showToast('Successfully signed in!', 'success');
      const lower = email.toLowerCase().trim();
      if (lower.includes('admin')) {
        router.push('/admin');
      } else if (lower.includes('creator') || lower.includes('studio')) {
        router.push('/creator/dashboard');
      } else if (lower.includes('advertiser') || lower.includes('vendor') || lower.includes('partner') || lower.includes('brand')) {
        router.push('/advertiser/dashboard');
      } else {
        router.push('/viewer/dashboard');
      }
    } else {
      setError(res.error || 'Invalid email or password.');
    }
    setIsLoading(false);
  };

  const handleQuickDemoViewer = async () => {
    setIsLoading(true);
    const res = await signIn('demo.viewer@yarrowplay.stream', 'drama123456');
    if (res.success) {
      showToast('Signed in as Demo VIP Member!', 'success');
      router.push('/viewer/dashboard');
    }
    setIsLoading(false);
  };

  const handleQuickDemoCreator = async () => {
    setIsLoading(true);
    const res = await signIn('creator.studio@yarrowplay.stream', 'studio123456');
    if (res.success) {
      showToast('Signed in as Demo Creator Studio!', 'success');
      router.push('/creator/dashboard');
    }
    setIsLoading(false);
  };

  const handleQuickDemoAdvertiser = async () => {
    setIsLoading(true);
    const res = await signIn('partner@apexbrands.com', 'partner123456');
    if (res.success) {
      showToast('Signed in as Demo Brand Advertiser!', 'success');
      router.push('/advertiser/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#070707] relative z-10">
      <div className="w-full max-w-sm sm:max-w-md border border-[#292929] rounded-2xl p-6 sm:p-7 bg-[#151515] shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8F8F98] hover:text-white mb-5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

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

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
            SIGN IN
          </h1>
          <p className="text-xs text-[#8F8F98] mt-1">
            Access your unlocked episodes, watchlist, and coin wallet.
          </p>
        </div>

        {error && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-full text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white shadow-[0_4px_20px_rgba(255,0,122,0.35)] hover:shadow-[0_4px_25px_rgba(255,0,122,0.5)] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In to YarrowPlay'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#222222] space-y-3 text-xs text-[#8F8F98]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#666]">Demo Accounts:</span>
            <Link
              href="/auth/register"
              className="font-bold text-[#FF007A] hover:underline"
            >
              Create account →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={handleQuickDemoViewer}
              className="px-2 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2d2d2d] text-[10px] font-bold text-white hover:text-[#FF007A] transition-all text-center"
            >
              VIP Viewer
            </button>
            <button
              type="button"
              onClick={handleQuickDemoCreator}
              className="px-2 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2d2d2d] text-[10px] font-bold text-purple-300 hover:text-purple-200 transition-all text-center"
            >
              Creator Studio
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdvertiser}
              className="px-2 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#222] border border-[#2d2d2d] text-[10px] font-bold text-amber-300 hover:text-amber-200 transition-all text-center"
            >
              Advertiser
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
