'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Megaphone,
  Building2,
  Mail,
  Lock,
  User,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Smartphone,
  Eye,
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

export default function VendorRegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { showToast } = useToast();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [industry, setIndustry] = useState('Tech & Mobile Apps');
  const [budget, setBudget] = useState('$2,500/mo');
  const [objective, setObjective] = useState('In-Stream Sponsored Reel');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !password) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsLoading(true);

    const res = await signUp(
      email,
      password,
      contactName || companyName,
      {
        role: 'advertiser',
        company_name: companyName.trim(),
        industry: industry,
        ad_budget: budget,
      }
    );

    if (res.success) {
      showToast('Advertiser account created! Welcome to YarrowPlay Ads.', 'success');
      router.push('/advertiser/dashboard');
    } else {
      showToast(res.error || 'Registration failed.', 'error');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080711] text-white pb-20">
      {/* Hero Header */}
      <div className="border-b border-[#231b40] bg-gradient-to-b from-[#19102f] via-[#100d24] to-[#080711]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#FF007A]/15 border border-[#FF007A]/30 text-[#FF007A] px-3.5 py-1 rounded-full text-xs font-bold tracking-wide">
            <Megaphone className="w-3.5 h-3.5" />
            YARROWPLAY BRAND SPONSORSHIP & VENDOR PORTAL
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Reach Millions of Streamers with <span className="neon-text-pink">Native Vertical Ads</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Integrate your brand natively into high-engagement vertical micro-series. Tap into 90%+ completion rates and immersive 9:16 mobile full-screen storytelling.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-[#120f26] border border-[#271f49] space-y-1">
              <div className="text-pink-400 font-bold text-sm flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" /> 9:16 Full Screen
              </div>
              <p className="text-[11px] text-slate-400">Zero border distractions. Native mobile format designed for Gen-Z & millennials.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#120f26] border border-[#271f49] space-y-1">
              <div className="text-amber-400 font-bold text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> 4.8x Higher Recall
              </div>
              <p className="text-[11px] text-slate-400">Sponsored story integration and branded cliffhangers outperform standard display ads.</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#120f26] border border-[#271f49] space-y-1">
              <div className="text-cyan-400 font-bold text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Real-time Analytics
              </div>
              <p className="text-[11px] text-slate-400">Track impressions, link clicks, CTR, and conversions in your dedicated portal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form Card */}
      <div className="max-w-xl mx-auto px-4 -mt-6">
        <div className="bg-[#0e0c1c] border border-[#2d2554] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] space-y-6">
          <div className="border-b border-[#201a3b] pb-4">
            <h2 className="text-lg font-black uppercase text-white tracking-wide flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" /> Advertiser & Vendor Onboarding
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Create your brand account to launch targeted vertical reel sponsorships immediately.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Company / Brand Name *
              </label>
              <div className="relative flex items-center">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Brands"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Contact Person *
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Marcus Vance"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Industry / Sector
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Tech & Mobile Apps">Tech & Mobile Apps</option>
                  <option value="Fashion & Luxury">Fashion & Luxury</option>
                  <option value="Gaming & Esports">Gaming & Entertainment</option>
                  <option value="FMCG & Beverages">FMCG & Beverages</option>
                  <option value="Finance & Fintech">Finance & Fintech</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Business Work Email *
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="sponsor@brand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Monthly Ad Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="$1,000/mo">$1,000 / month (Starter)</option>
                  <option value="$2,500/mo">$2,500 / month (Growth)</option>
                  <option value="$5,000/mo">$5,000 / month (Enterprise)</option>
                  <option value="$15,000+/mo">$15,000+ / month (Exclusive Series Sponsor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Primary Objective
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="In-Stream Sponsored Reel">In-Stream Sponsored Reel</option>
                  <option value="Pre-Roll Video Brand Ad">Pre-Roll 9:16 Video Ad</option>
                  <option value="Custom Storyline Integration">Custom Storyline Integration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Password *
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? 'Creating Vendor Account...' : 'Register Advertiser Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-[#201a3b] text-center text-xs text-slate-400">
            Already registered as an Advertiser?{' '}
            <Link href="/" className="text-amber-400 hover:underline font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
