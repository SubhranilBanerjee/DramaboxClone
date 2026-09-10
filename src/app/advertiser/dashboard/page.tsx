'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  TrendingUp,
  Eye,
  MousePointerClick,
  DollarSign,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Building2,
  Sliders,
  Sparkles,
  ExternalLink,
  Target,
  Smartphone
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { AdCampaign } from '@/lib/types';

const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'camp-1',
    advertiser_id: 'advertiser_demo_id',
    advertiser_name: 'Marcus Vance',
    company_name: 'Apex Global Media',
    campaign_name: 'Cyberpunk Sneaker Drop - 9:16 Reel Sponsor',
    target_category: 'Suspense & Action',
    ad_type: 'video_preroll',
    budget_total: 3000,
    budget_spent: 2150,
    impressions: 742000,
    clicks: 34100,
    ctr: 4.59,
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-and-purple-neon-lit-room-41712-large.mp4',
    status: 'active',
    created_at: '2026-03-01T10:00:00Z',
  },
  {
    id: 'camp-2',
    advertiser_id: 'advertiser_demo_id',
    advertiser_name: 'Marcus Vance',
    company_name: 'Apex Global Media',
    campaign_name: 'Luxury Fragrance - Romance Drama In-Stream',
    target_category: 'Romance & Billionaire',
    ad_type: 'sponsored_drama',
    budget_total: 2000,
    budget_spent: 1270,
    impressions: 540000,
    clicks: 21800,
    ctr: 4.03,
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-womans-face-with-dramatic-lighting-42288-large.mp4',
    status: 'active',
    created_at: '2026-03-03T12:00:00Z',
  },
];

export default function AdvertiserDashboardPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [campaigns, setCampaigns] = useState<AdCampaign[]>(INITIAL_CAMPAIGNS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  // New Campaign Form State
  const [campName, setCampName] = useState('');
  const [targetCategory, setTargetCategory] = useState('Romance & CEO');
  const [adType, setAdType] = useState<AdCampaign['ad_type']>('video_preroll');
  const [budgetTotal, setBudgetTotal] = useState('1500');

  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + c.budget_spent, 0);
  const avgCtr = (totalClicks / Math.max(1, totalImpressions)) * 100;

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) {
      showToast('Please provide a campaign name.', 'error');
      return;
    }

    const budget = parseFloat(budgetTotal) || 1000;
    const newCamp: AdCampaign = {
      id: `camp-${Date.now()}`,
      advertiser_id: user?.id || 'demo_ad_id',
      advertiser_name: user?.username || 'Brand Advertiser',
      company_name: user?.company_name || 'Partner Brand',
      campaign_name: campName.trim(),
      target_category: targetCategory,
      ad_type: adType,
      budget_total: budget,
      budget_spent: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      media_url: 'https://assets.mixkit.co/videos/preview/mixkit-mysterious-woman-walking-through-a-city-at-night-42289-large.mp4',
      status: 'active',
      created_at: new Date().toISOString(),
    };

    setCampaigns([newCamp, ...campaigns]);
    showToast('New vertical ad campaign launched successfully!', 'success');
    setIsCreateModalOpen(false);
    setCampName('');
  };

  return (
    <div className="min-h-screen bg-[#080711] text-white pb-20">
      {/* Header Banner */}
      <div className="border-b border-[#241c42] bg-gradient-to-r from-[#19102c] via-[#100d24] to-[#080711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                ADVERTISER & BRAND VENDOR PORTAL
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>{user?.company_name || 'Brand Partner'}</span>
                <span className="text-amber-400">Campaign Manager</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Track full-screen vertical impressions, click-through rates, and targeted category sponsorships across DramaBox releases.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-600 hover:from-amber-400 hover:to-pink-500 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all hover:scale-105 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Launch New Campaign</span>
            </button>
          </div>

          {/* Metric Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-[#120f26] border border-amber-500/30">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                <span>Total Impressions</span>
                <Eye className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {totalImpressions.toLocaleString()}
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">9:16 portrait video views</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#120f26] border border-cyan-500/30">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-bold mb-1">
                <span>Direct Clicks</span>
                <MousePointerClick className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {totalClicks.toLocaleString()}
              </div>
              <div className="text-[10px] text-cyan-300 mt-1">Website & app downloads</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#120f26] border border-pink-500/30">
              <div className="flex items-center justify-between text-xs text-pink-400 font-bold mb-1">
                <span>Average CTR</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-pink-300">
                {avgCtr.toFixed(2)}%
              </div>
              <div className="text-[10px] text-emerald-400 mt-1">3.2x above industry standard</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#120f26] border border-emerald-500/30">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-1">
                <span>Budget Invested</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-300">
                ${totalSpent.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Of total allocated budget</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Campaign Management */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-[#0e0c1c] border border-[#271f49] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-amber-400" /> Active Brand Sponsorship Campaigns ({campaigns.length})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time performance of your sponsored vertical storylines and video ads.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#231b42] text-slate-400 font-semibold">
                  <th className="pb-3">Campaign Name</th>
                  <th className="pb-3">Target Category</th>
                  <th className="pb-3">Ad Format</th>
                  <th className="pb-3">Budget Spent</th>
                  <th className="pb-3">Impressions</th>
                  <th className="pb-3">Clicks</th>
                  <th className="pb-3">CTR</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1638]">
                {campaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-[#130f26] transition-colors">
                    <td className="py-3.5 font-bold text-white max-w-[200px] truncate">
                      <div>{camp.campaign_name}</div>
                      <div className="text-[10px] text-slate-500 font-normal">ID: {camp.id}</div>
                    </td>
                    <td className="py-3.5 text-slate-300">{camp.target_category}</td>
                    <td className="py-3.5 text-slate-400 capitalize">
                      {camp.ad_type.replace(/_/g, ' ')}
                    </td>
                    <td className="py-3.5 font-mono text-emerald-400 font-bold">
                      ${camp.budget_spent.toLocaleString()} / ${camp.budget_total.toLocaleString()}
                    </td>
                    <td className="py-3.5 font-mono text-cyan-300 font-bold">
                      {camp.impressions.toLocaleString()}
                    </td>
                    <td className="py-3.5 font-mono text-amber-300">
                      {camp.clicks.toLocaleString()}
                    </td>
                    <td className="py-3.5 font-mono text-pink-300 font-bold">
                      {camp.ctr ? `${camp.ctr}%` : '0%'}
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                        {camp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Creative Showcase & Mock Demo */}
        <div className="p-6 rounded-2xl bg-[#0e0c1c] border border-[#271f49] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_35px_rgba(245,158,11,0.1)]">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> Native Vertical Mobile Experience
            </span>
            <h3 className="text-lg font-black text-white">How Your Ads Look on DramaBox</h3>
            <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
              DramaBox native vertical sponsorships appear as seamless 9:16 high-definition reels during cliffhanger transitions, with interactive call-to-action cards directly below the video frame.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPreviewVideo(campaigns[0]?.media_url || null)}
              className="bg-[#1b1436] hover:bg-[#251b4d] border border-amber-500/40 text-amber-300 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-amber-400" /> Preview Sample Ad Reel
            </button>
          </div>
        </div>
      </div>

      {/* ── CREATE CAMPAIGN MODAL ──────────────────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative bg-[#0e0c1c] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-[0_0_50px_rgba(245,158,11,0.25)]">
            <div className="border-b border-[#241c42] pb-3">
              <h3 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-400" /> Launch Vertical Ad Campaign
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your target genre and budget allocation.
              </p>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Fashion Vertical Drop 2026"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Target Genre
                  </label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Romance & CEO">Romance & CEO Sagas</option>
                    <option value="Suspense & Action">Suspense & Action</option>
                    <option value="Billionaire Revenge">Billionaire Revenge</option>
                    <option value="All Platform Releases">All Platform Releases</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Ad Format
                  </label>
                  <select
                    value={adType}
                    onChange={(e) => setAdType(e.target.value as AdCampaign['ad_type'])}
                    className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="video_preroll">9:16 Video Pre-Roll</option>
                    <option value="sponsored_drama">In-Stream Sponsored Reel</option>
                    <option value="in_stream_banner">Brand Cliffhanger Banner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Campaign Budget (USD) *
                </label>
                <input
                  type="number"
                  min="200"
                  value={budgetTotal}
                  onChange={(e) => setBudgetTotal(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#271f4b] rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIDEO AD PREVIEW MODAL ─────────────────────────────────────── */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative bg-[#0e0c1c] border border-amber-500/40 rounded-3xl p-4 sm:p-6 max-w-sm w-full flex flex-col items-center shadow-[0_0_40px_rgba(245,158,11,0.25)]">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕ Close
            </button>
            <h3 className="text-sm font-bold text-white mb-2">9:16 Vertical Reel Ad Demo</h3>
            <div className="w-64 aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 relative">
              <video src={previewVideo} controls autoPlay className="w-full h-full object-cover" />
            </div>
            <p className="text-[11px] text-amber-300 mt-2 text-center font-semibold">
              Sponsored brand message overlay with 1-click checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
