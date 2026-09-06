'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Clapperboard, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react';
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
    const res = await signIn('demo.viewer@dramabox.stream', 'drama123456');
    if (res.success) {
      showToast('Signed in as Demo VIP Member!', 'success');
      router.push('/');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#07060e] relative z-10">
      <div className="w-full max-w-md border border-[#2d2554] rounded-2xl p-6 sm:p-8 bg-[#0e0c1c] shadow-[0_0_40px_rgba(255,42,141,0.2)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Discover
        </Link>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600 to-cyan-400 p-[1px] mx-auto mb-3 shadow-[0_0_15px_rgba(255,42,141,0.6)]">
            <div className="w-full h-full bg-[#0d0b1a] rounded-[11px] flex items-center justify-center">
              <Clapperboard className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            SIGN IN TO <span className="neon-sign-pink">DRAMABOX</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your unlocked episodes, bookmarks, and coin wallet.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
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
                className="w-full pl-9 pr-9 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all"
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
            className="w-full bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,42,141,0.5)] hover:shadow-[0_0_25px_rgba(255,42,141,0.8)] disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#201a3b] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleQuickDemo}
            className="font-semibold text-cyan-300 hover:text-white flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            1-Click Demo Login
          </button>
          <Link
            href="/auth/register"
            className="font-bold text-pink-400 hover:text-pink-300 hover:underline"
          >
            Create account →
          </Link>
        </div>
      </div>
    </div>
  );
}
