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
      router.push('/');
    } else {
      setError(res.error || 'Invalid email or password.');
    }
    setIsLoading(false);
  };

  const handleQuickDemo = async () => {
    setIsLoading(true);
    const res = await signIn('demo.viewer@yarrowplay.stream', 'drama123456');
    if (res.success) {
      showToast('Signed in as Demo VIP Member!', 'success');
      router.push('/');
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

        <div className="mt-4 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-[#8F8F98]">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="font-semibold text-white hover:text-[#FF007A] flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
            1-Click Demo Login
          </button>
          <Link
            href="/auth/register"
            className="font-bold text-[#FF007A] hover:underline"
          >
            Create account →
          </Link>
        </div>
      </div>
    </div>
  );
}
