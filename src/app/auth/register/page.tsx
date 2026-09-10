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
  Video,
  Building2,
  AtSign,
  Film
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
  const [showPassword, setShowPassword] = useState(false);

  // Creator specific fields
  const [studioName, setStudioName] = useState('');
  const [creatorCategory, setCreatorCategory] = useState('revenge');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCreator = role === 'creator';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Please enter your display name.');
      return;
    }
    if (isCreator && !studioName.trim()) {
      setError('Please enter your Studio or Creator brand name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
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
            channel_handle: `@${username.toLowerCase().replace(/\s+/g, '')}`,
            creator_category: creatorCategory,
          }
        : { role: 'viewer' }
    );

    if (res.success) {
      if (isCreator) {
        showToast('Creator Studio account activated! Welcome to YarrowPlay Studio.', 'success');
        router.push('/creator/dashboard');
      } else {
        showToast('Welcome to YarrowPlay! Account created with 100 Starter Coins.', 'success');
        router.push('/');
      }
    } else {
      setError(res.error || 'Failed to create account.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-[#070707] relative z-10">
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
            CREATE ACCOUNT
          </h1>
          <p className="text-xs text-[#8F8F98] mt-1">
            Select your account type to get started
          </p>
        </div>

        {/* Account Role Switcher Pill Tabs matching screenshot */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#0d0d0d] border border-[#292929] rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setRole('viewer')}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              !isCreator
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
            className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              isCreator
                ? 'bg-[#FF007A] text-white shadow-[0_2px_12px_rgba(255,0,122,0.4)]'
                : 'text-[#8F8F98] hover:text-white bg-transparent'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Content Creator</span>
          </button>
        </div>

        {error && (
          <div className="mb-3.5 p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Display Name */}
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

          {/* Studio Name (Creator only) */}
          {isCreator && (
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

          {/* Email Address */}
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

          {/* Password */}
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

          {/* Submit Action Pill Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-full text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white shadow-[0_4px_20px_rgba(255,0,122,0.35)] hover:shadow-[0_4px_25px_rgba(255,0,122,0.5)] transition-all disabled:opacity-50"
          >
            {isLoading
              ? 'Creating Account...'
              : isCreator
              ? 'Register as Content Creator'
              : 'Register as Viewer'}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#8F8F98]">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-bold text-[#FF007A] hover:underline ml-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
