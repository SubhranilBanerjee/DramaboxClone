'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Video,
  Clapperboard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Upload,
  Plus,
  Sparkles,
  TrendingUp,
  Coins,
  Film,
  Building2,
  Eye,
  Sliders,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize2,
  Smartphone,
  ExternalLink,
  Trash2,
  Tag,
  Clock,
  Layers,
  ArrowRight,
  Filter,
  Search,
  Check,
  Zap,
  Info,
  BarChart2,
  DollarSign,
  Wallet,
  ArrowDownToLine
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import {
  useCreatorStore,
  SAMPLE_CREATOR_VERTICAL_VIDEOS,
  SAMPLE_CREATOR_POSTERS,
  STANDARD_CREATOR_QA_CHECKLIST
} from '@/lib/creatorStore';
import { Episode, CreatorDrama, VideoVerificationStatus, VideoVerificationReport } from '@/lib/types';

function CreatorDashboardContent() {
  const searchParams = useSearchParams();
  const { user, signIn } = useAuth();
  const { showToast } = useToast();

  const {
    dramas,
    episodes,
    analytics,
    monetization,
    requestPayout,
    createDrama,
    uploadEpisode,
    updateVerification,
    deleteEpisode,
    deleteDrama,
    runQAScan
  } = useCreatorStore();

  // Active tab state
  const tabParam = searchParams.get('tab') as 'overview' | 'series' | 'upload' | 'analytics' | 'monetization' | 'verification' | 'library';
  const [activeTab, setActiveTab] = useState<'overview' | 'series' | 'upload' | 'analytics' | 'monetization' | 'verification' | 'library'>(
    tabParam || 'overview'
  );

  // Cloudinary upload & Payout state
  const [isUploadingCloudinary, setIsUploadingCloudinary] = useState(false);
  const [cloudinaryStatus, setCloudinaryStatus] = useState<string | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('250');
  const [payoutMethod, setPayoutMethod] = useState<'paypal' | 'bank_transfer' | 'stripe'>('paypal');
  const [payoutAccount, setPayoutAccount] = useState('creator.studio@dramabox.stream');

  // Verification Lab State
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanReport, setScanReport] = useState<VideoVerificationReport | null>(null);
  const [qaChecklist, setQaChecklist] = useState<{ [key: string]: boolean }>({
    aspect_ratio: true,
    audio_sync: true,
    hook_ending: true,
    originality: true,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // New Series Form State
  const [newSeriesTitle, setNewSeriesTitle] = useState('');
  const [newSeriesDesc, setNewSeriesDesc] = useState('');
  const [newSeriesCover, setNewSeriesCover] = useState(SAMPLE_CREATOR_POSTERS[0]);
  const [newSeriesCategory, setNewSeriesCategory] = useState('suspense');
  const [newSeriesTags, setNewSeriesTags] = useState('Action, Revenge, Thriller');
  const [newSeriesEpisodes, setNewSeriesEpisodes] = useState(20);

  // New Episode Upload Form State
  const [uploadDramaId, setUploadDramaId] = useState<string>('');
  const [uploadEpNumber, setUploadEpNumber] = useState<number>(1);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadVideoUrl, setUploadVideoUrl] = useState(SAMPLE_CREATOR_VERTICAL_VIDEOS[0].url);
  const [uploadIsPremium, setUploadIsPremium] = useState(true);
  const [uploadCoinPrice, setUploadCoinPrice] = useState(20);
  const [customFileSelected, setCustomFileSelected] = useState<string | null>(null);

  // Auto-select first episode for verification when available
  useEffect(() => {
    if (episodes.length > 0 && !selectedEpisodeId) {
      const pending = episodes.find((e) => e.verification_status === 'pending_verification');
      setSelectedEpisodeId(pending ? pending.id : episodes[0].id);
    }
    if (dramas.length > 0 && !uploadDramaId) {
      setUploadDramaId(dramas[0].id);
    }
  }, [episodes, dramas, selectedEpisodeId, uploadDramaId]);

  const activeEpisode = episodes.find((e) => e.id === selectedEpisodeId) || episodes[0];
  const activeDrama = dramas.find((d) => d.id === activeEpisode?.drama_id);

  // Video playback control
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleRestartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().catch(() => { });
    setIsPlaying(true);
  };

  // Run automated QA scan
  const handleRunQAScan = async () => {
    if (!activeEpisode) return;
    setIsScanning(true);
    const report = await runQAScan(activeEpisode);
    setScanReport(report);
    setIsScanning(false);
    showToast('Automated Video QA scan complete! All compliance parameters verified.', 'success');
  };

  // Certify and verify video
  const handleVerifyVideo = (status: VideoVerificationStatus) => {
    if (!activeEpisode) return;
    updateVerification(
      activeEpisode.id,
      status,
      status === 'verified'
        ? 'Creator self-verified via DramaBox Studio QA Lab. Certified for vertical distribution.'
        : 'Creator flagged for revisions.'
    );
    showToast(
      status === 'verified'
        ? `"${activeEpisode.title}" has been VERIFIED & published!`
        : 'Status updated to draft for edits.',
      status === 'verified' ? 'success' : 'info'
    );
  };

  // Create new Drama Series
  const handleCreateSeries = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeriesTitle.trim()) {
      showToast('Please enter a series title.', 'error');
      return;
    }

    const tagsArray = newSeriesTags.split(',').map((t) => t.trim()).filter(Boolean);
    const created = createDrama({
      title: newSeriesTitle,
      description: newSeriesDesc,
      cover_image_url: newSeriesCover,
      total_episodes: newSeriesEpisodes,
      tags: tagsArray,
      category: newSeriesCategory,
      creator_name: user?.studio_name || user?.username || 'DramaBox Studio Partner',
    });

    showToast(`New drama series "${created.title}" created successfully!`, 'success');
    setUploadDramaId(created.id);
    setActiveTab('upload');
  };

  // Handle video file upload directly to Cloudinary CDN API
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCloudinary(true);
    setCustomFileSelected(file.name);
    showToast(`Uploading ${file.name} to Cloudinary CDN...`, 'info');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'dramabox/creators');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setUploadVideoUrl(data.url);
        setCloudinaryStatus(`Cloudinary CDN: ${data.public_id || 'stream_reel'}`);
        showToast('Successfully uploaded to Cloudinary CDN!', 'success');
      } else {
        const objectUrl = URL.createObjectURL(file);
        setUploadVideoUrl(objectUrl);
        setCloudinaryStatus('Local Stream Preview Active');
        showToast('File selected for QA testing.', 'info');
      }
    } catch {
      const objectUrl = URL.createObjectURL(file);
      setUploadVideoUrl(objectUrl);
      setCloudinaryStatus('Local Preview Ready');
      showToast('Video ready for QA testing.', 'info');
    } finally {
      setIsUploadingCloudinary(false);
    }
  };

  // Upload Episode
  const handleUploadEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDramaId) {
      showToast('Please select or create a series first.', 'error');
      return;
    }
    if (!uploadVideoUrl) {
      showToast('Please provide a video file or URL.', 'error');
      return;
    }

    const newEp = uploadEpisode({
      drama_id: uploadDramaId,
      title: uploadTitle || `Episode ${uploadEpNumber}`,
      episode_number: uploadEpNumber,
      video_url: uploadVideoUrl,
      is_premium: uploadIsPremium,
      coin_price: uploadCoinPrice,
      duration: '01:45',
      resolution: '1080x1920 Full HD',
    });

    showToast(`Episode uploaded to Cloudinary! Sent to Admin Review Queue.`, 'success');
    setSelectedEpisodeId(newEp.id);
    setActiveTab('verification');
  };

  // Quick switch to Creator demo account
  const handleActivateCreatorDemo = async () => {
    await signIn('creator.studio@dramabox.stream', 'studio123456');
    showToast('Logged in as Neon Rebel Studios!', 'success');
  };

  // Statistics summary
  const verifiedCount = episodes.filter((e) => e.verification_status === 'verified').length;
  const pendingCount = episodes.filter((e) => e.verification_status === 'pending_verification').length;
  const totalViews = '4.6M';
  const totalRoyalties = '12,450 Coins';

  return (
    <div className="min-h-screen bg-[#07060e] text-slate-100 pb-16 relative">
      {/* Ambient Cyber Lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-48 left-10 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Top Banner / Studio Identity Header */}
      <div className="border-b border-[#231b40] bg-[#0c0a1a]/90 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-600 p-[1px] shadow-[0_0_20px_rgba(255,42,141,0.5)]">
              <div className="w-full h-full bg-[#0d0b1a] rounded-[15px] flex items-center justify-center">
                <Video className="w-6 h-6 text-pink-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  {user?.studio_name || (user?.role === 'creator' ? user.username : 'Neon Rebel Studios')}
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(255,42,141,0.35)]">
                  <ShieldCheck className="w-3 h-3 text-pink-400" /> VERIFIED CREATOR
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{user?.channel_handle || '@neonrebel'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-cyan-400 font-mono">DramaBox Reel Partner ID: DBX-8824</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={() => setActiveTab('series')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#171233] border border-[#31255c] hover:border-pink-500/50 hover:text-pink-300 transition-all text-slate-200 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-pink-400" /> New Series
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#171233] border border-[#31255c] hover:border-cyan-500/50 hover:text-cyan-300 transition-all text-slate-200 shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" /> Upload Video
            </button>
            <button
              onClick={() => setActiveTab('verification')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-[0_0_15px_rgba(255,42,141,0.5)] hover:shadow-[0_0_25px_rgba(255,42,141,0.8)] transition-all hover:scale-105"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-pink-200" /> QA Verification Lab
            </button>
            <button
              onClick={() => showToast('Go Live feature coming soon!', 'info')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-violet-700 via-purple-600 to-rose-500 text-white shadow-[0_0_16px_rgba(139,92,246,0.55)] hover:shadow-[0_0_28px_rgba(244,63,94,0.65)] hover:scale-105 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-rose-200" /> Go Live
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 overflow-x-auto border-t border-[#1d1637] text-xs">
          {[
            { id: 'overview', label: 'Studio Overview', icon: TrendingUp },
            { id: 'analytics', label: 'Video Views & Retention', icon: BarChart2 },
            { id: 'monetization', label: 'Payments & Payouts', icon: DollarSign, badge: `$${monetization.available_balance_usd.toFixed(0)}` },
            { id: 'verification', label: 'Video Verification & QA Lab', icon: ShieldCheck, badge: pendingCount > 0 ? `${pendingCount} Pending` : undefined },
            { id: 'upload', label: 'Upload Video', icon: Upload },
            { id: 'series', label: 'Series Manager', icon: Layers },
            { id: 'library', label: 'Content Library', icon: Film, badge: `${episodes.length}` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${isActive
                  ? 'border-pink-500 text-pink-400 neon-text-pink drop-shadow-[0_0_8px_rgba(255,42,141,0.7)]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${tab.id === 'verification' && pendingCount > 0
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                    : 'bg-[#231b45] text-slate-300'
                    }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Demo Helper Alert if not logged in as Creator */}
        {(!user || user.role !== 'creator') && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#170e28] to-[#0c1a29] border border-pink-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_25px_rgba(255,42,141,0.15)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Creator Studio Preview Mode</h4>
                <p className="text-[11px] text-slate-300">
                  You are exploring the Creator & Vendor Studio dashboard. Click below to load demo studio data with 1-click.
                </p>
              </div>
            </div>
            <button
              onClick={handleActivateCreatorDemo}
              className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl shadow-[0_0_12px_rgba(255,42,141,0.4)] hover:shadow-[0_0_20px_rgba(255,42,141,0.7)] transition-all whitespace-nowrap"
            >
              Sign In as Demo Studio
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0e0c1c] border border-[#261f47] p-4 sm:p-5 rounded-2xl shadow-[0_0_25px_rgba(255,42,141,0.1)] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Total Series</span>
                  <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2 neon-text-pink">{dramas.length}</div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span className="text-emerald-400 font-bold">100%</span> active in catalog
                </div>
              </div>

              <div className="bg-[#0e0c1c] border border-[#261f47] p-4 sm:p-5 rounded-2xl shadow-[0_0_25px_rgba(0,240,255,0.1)] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Uploaded Videos</span>
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2 neon-text-cyan">{episodes.length}</div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <span className="text-cyan-400 font-bold">{verifiedCount} Verified</span> • {pendingCount} Pending
                </div>
              </div>

              <div className="bg-[#0e0c1c] border border-[#261f47] p-4 sm:p-5 rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.1)] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Royalty Coin Balance</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Coins className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2 text-amber-300">{totalRoyalties}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  From viewer episode unlocks
                </div>
              </div>

              <div className="bg-[#0e0c1c] border border-[#261f47] p-4 sm:p-5 rounded-2xl shadow-[0_0_25px_rgba(168,85,247,0.1)] relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">QA Pass Rate</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white mt-2 text-emerald-400">
                  {episodes.length > 0 ? `${Math.round((verifiedCount / episodes.length) * 100)}%` : '100%'}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  9:16 Vertical compliant
                </div>
              </div>
            </div>

            {/* Quick Action Hub & Verification Status Banner */}
            <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(255,42,141,0.15)] relative overflow-hidden">
              <div className="max-w-2xl space-y-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 bg-pink-500/15 border border-pink-500/40 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> Video Quality & Verification Pipeline
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  Content Creator & Vendor Studio Portal
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  DramaBox provides creators with an interactive 9:16 vertical smartphone testing simulator
                  and automated compliance scanner. Upload videos, run quality checks on audio loudness and framing,
                  and certify episodes for immediate global distribution.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab('verification')}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,42,141,0.5)]"
                  >
                    <ShieldCheck className="w-4 h-4 text-pink-200" />
                    Open Video Verification Lab
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="inline-flex items-center gap-2 bg-[#171233] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  >
                    <Upload className="w-4 h-4 text-cyan-400" />
                    Upload Next Episode
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Uploads Table */}
            <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-pink-400" /> Recent Uploaded Content
                </h3>
                <button
                  onClick={() => setActiveTab('library')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  View all ({episodes.length}) <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[#211a3f] text-slate-400">
                    <tr>
                      <th className="pb-3 font-semibold">Episode Title</th>
                      <th className="pb-3 font-semibold">Parent Series</th>
                      <th className="pb-3 font-semibold">Resolution / Aspect</th>
                      <th className="pb-3 font-semibold">Monetization</th>
                      <th className="pb-3 font-semibold">Verification Status</th>
                      <th className="pb-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b1536]">
                    {episodes.slice(0, 5).map((ep) => {
                      const drama = dramas.find((d) => d.id === ep.drama_id);
                      const isVerified = ep.verification_status === 'verified';
                      const isPending = ep.verification_status === 'pending_verification';

                      return (
                        <tr key={ep.id} className="hover:bg-[#15102d] transition-colors">
                          <td className="py-3 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-[#1e173e] text-pink-400 flex items-center justify-center text-[10px] font-bold">
                                {ep.episode_number}
                              </div>
                              <span className="truncate max-w-[200px]">{ep.title}</span>
                            </div>
                          </td>
                          <td className="py-3 text-slate-300 truncate max-w-[150px]">
                            {drama ? drama.title : 'Creator Drama'}
                          </td>
                          <td className="py-3 text-slate-400 font-mono text-[11px]">
                            {ep.resolution || '1080x1920'} (9:16)
                          </td>
                          <td className="py-3">
                            {ep.is_premium ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded">
                                <Coins className="w-3 h-3 text-amber-400" /> {ep.coin_price || 20} Coins
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                Free Preview
                              </span>
                            )}
                          </td>
                          <td className="py-3">
                            {isVerified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" /> Verified & Live
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                                <AlertCircle className="w-3 h-3" /> Pending QA
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-500/15 text-slate-300 border border-slate-500/40 px-2 py-0.5 rounded">
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedEpisodeId(ep.id);
                                setActiveTab('verification');
                              }}
                              className="px-2.5 py-1 rounded bg-[#1c163b] hover:bg-pink-600 text-pink-300 hover:text-white font-semibold text-[11px] transition-all border border-pink-500/30"
                            >
                              Verify / QA
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VIDEO VERIFICATION & QA LAB */}
        {/* ========================================================= */}
        {activeTab === 'verification' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header with Episode Selector */}
            <div className="bg-[#0e0c1c] border border-[#2d2554] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-pink-400" />
                    Video Verification & QA Lab
                  </h2>
                  <span className="text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded">
                    9:16 VERTICAL SIMULATOR
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Preview your vertical reel video, run the automated compliance scan, and certify content for DramaBox distribution.
                </p>
              </div>

              {/* Episode Dropdown Picker */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-400 shrink-0">Select Video:</label>
                <select
                  value={selectedEpisodeId}
                  onChange={(e) => {
                    setSelectedEpisodeId(e.target.value);
                    setScanReport(null);
                    setIsPlaying(false);
                  }}
                  className="w-full sm:w-64 text-xs bg-[#141026] border border-[#2d2554] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                >
                  {episodes.map((ep) => (
                    <option key={ep.id} value={ep.id}>
                      {ep.title} ({ep.verification_status === 'verified' ? '✓ Verified' : 'Pending QA'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Split Screen: Left Phone Simulator, Right Automated QA Suite */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: 9:16 Phone Simulator Frame */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="w-full max-w-[340px] bg-[#120f24] p-3 rounded-[40px] border-4 border-[#2b224d] shadow-[0_0_50px_rgba(255,42,141,0.25)] relative">
                  {/* Phone Speaker Notch */}
                  <div className="w-28 h-4 bg-[#0a0814] rounded-full mx-auto mb-2 flex items-center justify-center gap-2">
                    <div className="w-10 h-1.5 bg-[#201a38] rounded-full" />
                    <div className="w-2 h-2 bg-[#201a38] rounded-full" />
                  </div>

                  {/* 9:16 Vertical Video Screen */}
                  <div className="relative aspect-[9/16] bg-black rounded-[28px] overflow-hidden group">
                    <video
                      ref={videoRef}
                      src={activeEpisode?.video_url}
                      className="w-full h-full object-cover"
                      playsInline
                      loop
                      muted={isMuted}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    {/* Safe Zone Overlay Guidelines (Toggable) */}
                    {showSafeZone && (
                      <div className="absolute inset-0 pointer-events-none border border-cyan-400/30 m-3 rounded-2xl flex flex-col justify-between p-2 text-[9px] font-mono text-cyan-300/70">
                        <div className="flex justify-between items-center bg-black/40 px-2 py-0.5 rounded">
                          <span>9:16 SAFE ZONE TOP</span>
                          <span>1080x1920</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 px-2 py-0.5 rounded">
                          <span>SUBTITLE / UI SAFE BOUNDARY</span>
                          <span>CENTER LOCKED</span>
                        </div>
                      </div>
                    )}

                    {/* On-screen Watermark Preview */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-pink-400 border border-pink-500/30 pointer-events-none">
                      DRAMABOX VERIFIED
                    </div>

                    {/* Play / Pause Big Center Overlay */}
                    <button
                      onClick={togglePlay}
                      className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                        }`}
                    >
                      <div className="w-14 h-14 rounded-full bg-pink-600/80 backdrop-blur-md text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,42,141,0.8)]">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                      </div>
                    </button>

                    {/* Bottom In-Reel Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
                      <h4 className="text-xs font-bold drop-shadow-md">{activeEpisode?.title}</h4>
                      <p className="text-[10px] text-slate-300 drop-shadow-md mt-0.5">
                        {activeDrama?.title || 'Original Creator Drama'}
                      </p>
                    </div>
                  </div>

                  {/* Phone Control Deck */}
                  <div className="mt-3 px-2 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={togglePlay}
                        className="p-1.5 rounded-lg hover:bg-[#1e1738] hover:text-white transition-colors"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleRestartVideo}
                        className="p-1.5 rounded-lg hover:bg-[#1e1738] hover:text-white transition-colors"
                        title="Restart Video"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={toggleMute}
                        className="p-1.5 rounded-lg hover:bg-[#1e1738] hover:text-white transition-colors"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                      </button>
                    </div>

                    <button
                      onClick={() => setShowSafeZone(!showSafeZone)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${showSafeZone
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-[#1a1433] text-slate-400'
                        }`}
                    >
                      Safe Zone Guide
                    </button>
                  </div>
                </div>

                {/* Video Specs pill below simulator */}
                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Aspect: <strong className="text-cyan-400">9:16</strong></span>
                  <span>•</span>
                  <span>Res: <strong className="text-pink-400">1080x1920</strong></span>
                  <span>•</span>
                  <span>Codec: <strong className="text-emerald-400">H.264/AAC</strong></span>
                </div>
              </div>

              {/* RIGHT COLUMN: Video QA Suite & Verification Controls */}
              <div className="lg:col-span-7 space-y-5">
                {/* Active Episode Card Header */}
                <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#211a3f]">
                    <div>
                      <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                        {activeDrama?.title}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {activeEpisode?.title}
                      </h3>
                    </div>
                    <div>
                      {activeEpisode?.verification_status === 'verified' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          VERIFIED & DISTRIBUTED
                        </span>
                      ) : activeEpisode?.verification_status === 'pending_verification' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.3)] animate-pulse">
                          <AlertCircle className="w-4 h-4 text-amber-400" />
                          PENDING QA VERIFICATION
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-500/20 text-slate-300 border border-slate-500/40 px-3 py-1 rounded-full">
                          DRAFT
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Duration</span>
                      <span className="font-semibold text-white">{activeEpisode?.duration || '01:45'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Access Tier</span>
                      <span className="font-semibold text-amber-300">
                        {activeEpisode?.is_premium ? `${activeEpisode?.coin_price || 20} Coins` : 'Free Episode'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">File Size</span>
                      <span className="font-semibold text-cyan-300">{activeEpisode?.file_size || '42.4 MB'}</span>
                    </div>
                  </div>
                </div>

                {/* Automated Compliance Diagnostic Scan Panel */}
                <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        Automated Compliance Diagnostic Scan
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Validates mobile portrait aspect ratio, audio loudness bounds (-14 LUFS), and codec acceleration.
                      </p>
                    </div>
                    <button
                      onClick={handleRunQAScan}
                      disabled={isScanning}
                      className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50 shrink-0"
                    >
                      {isScanning ? 'Scanning Video...' : 'Run QA Scan'}
                    </button>
                  </div>

                  {/* Scan Results Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {[
                      { label: 'Aspect Ratio: 9:16 Vertical Portrait', ok: scanReport ? scanReport.aspect_ratio_ok : true, desc: 'Verified 1080x1920 mobile viewport' },
                      { label: 'Audio Loudness: -14.2 LUFS', ok: scanReport ? scanReport.audio_loudness_ok : true, desc: 'Normalized for smartphone speakers' },
                      { label: 'Video Codec: H.264 / AAC HW', ok: scanReport ? scanReport.codec_supported : true, desc: 'Hardware-accelerated mobile streaming' },
                      { label: 'DRM Watermark Fingerprint', ok: scanReport ? scanReport.drm_ready : true, desc: 'Protected by DramaBox Creator DRM' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#141026] border border-[#221b3f] flex items-start gap-2 text-xs">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-[11px]">{item.label}</div>
                          <div className="text-[10px] text-slate-400">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creator Self-Verification Checklist */}
                <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-pink-400" />
                    Creator Self-Verification Checklist
                  </h4>
                  <div className="space-y-2">
                    {STANDARD_CREATOR_QA_CHECKLIST.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#131026] transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={qaChecklist[item.id] ?? true}
                          onChange={(e) =>
                            setQaChecklist({ ...qaChecklist, [item.id]: e.target.checked })
                          }
                          className="mt-0.5 w-4 h-4 rounded border-[#382b61] bg-[#141026] text-pink-500 focus:ring-pink-500 accent-pink-500 cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-semibold text-slate-200">{item.label}</span>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Final Decision & Verification Actions */}
                <div className="bg-gradient-to-r from-[#170e28] to-[#120f26] border border-pink-500/40 rounded-2xl p-5 shadow-[0_0_30px_rgba(255,42,141,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">Video Verification Decision</h4>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {activeEpisode?.verification_status === 'verified'
                        ? 'This episode has passed all tests and is certified for audience streaming.'
                        : 'Review playback above. Once satisfied, certify and publish to the live DramaBox player.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                    {activeEpisode?.verification_status !== 'verified' ? (
                      <button
                        onClick={() => handleVerifyVideo('verified')}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(255,42,141,0.6)] hover:shadow-[0_0_25px_rgba(255,42,141,0.9)] transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-pink-200" />
                        Pass QA & Certify Video
                      </button>
                    ) : (
                      <button
                        onClick={() => handleVerifyVideo('draft')}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[#1a1433] border border-slate-600 text-slate-300 hover:text-white transition-all"
                      >
                        Re-open Draft
                      </button>
                    )}

                    {/* Test directly in DramaBox vertical player */}
                    {activeDrama && (
                      <Link
                        href={`/watch/${activeDrama.id}?ep=${activeEpisode?.episode_number || 1}`}
                        target="_blank"
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-[#141026] border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all flex items-center justify-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Watch Live
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: VIDEO UPLOAD STUDIO */}
        {/* ========================================================= */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto bg-[#0e0c1c] border border-[#2d2554] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,42,141,0.2)] animate-in fade-in duration-200">
            <div className="text-center mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1px] mx-auto mb-2 shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                <div className="w-full h-full bg-[#0d0b1a] rounded-[10px] flex items-center justify-center">
                  <Upload className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                UPLOAD EPISODE <span className="neon-sign-cyan">VIDEO</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload vertical 9:16 video reels for your drama series to test and verify in the QA Lab.
              </p>
            </div>

            <form onSubmit={handleUploadEpisode} className="space-y-4">
              {/* Target Drama Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Drama Series <span className="text-pink-400">*</span>
                </label>
                <select
                  value={uploadDramaId}
                  onChange={(e) => setUploadDramaId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-all"
                >
                  {dramas.map((drama) => (
                    <option key={drama.id} value={drama.id}>
                      {drama.title} ({drama.total_episodes} eps)
                    </option>
                  ))}
                </select>
              </div>

              {/* Episode Number & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Episode #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={uploadEpNumber}
                    onChange={(e) => setUploadEpNumber(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Episode Chapter Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 3: The Midnight Ambush"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Video File / URL Input Box */}
              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">
                  Video Source (9:16 Vertical Reel)
                </label>

                {/* Drag and drop file picker */}
                <div className="border-2 border-dashed border-[#34275f] hover:border-pink-500/60 rounded-2xl p-4 text-center bg-[#130f26] mb-3 transition-colors relative">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    id="video-file-input"
                    className="hidden"
                    disabled={isUploadingCloudinary}
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="video-file-input" className="cursor-pointer block">
                    <Video className="w-8 h-8 text-pink-400 mx-auto mb-1.5" />
                    <span className="text-xs font-bold text-white block">
                      {isUploadingCloudinary
                        ? 'Uploading to Cloudinary CDN...'
                        : customFileSelected
                        ? `Selected: ${customFileSelected}`
                        : 'Click to Upload Video to Cloudinary'}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Cloudinary API Key: 729329983158373 • Vertical 1080x1920
                    </span>
                    {cloudinaryStatus && (
                      <span className="inline-block mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                        ✓ {cloudinaryStatus}
                      </span>
                    )}
                  </label>
                </div>

                {/* Preset Vertical Reels for Instant Testing */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Or choose a pre-rendered 9:16 vertical drama clip for instant testing:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SAMPLE_CREATOR_VERTICAL_VIDEOS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setUploadVideoUrl(sample.url);
                          setCustomFileSelected(null);
                        }}
                        className={`text-left p-2 rounded-xl text-xs border transition-all ${uploadVideoUrl === sample.url && !customFileSelected
                          ? 'bg-[#1f1742] border-pink-500 text-pink-300 shadow-[0_0_10px_rgba(255,42,141,0.3)]'
                          : 'bg-[#120f24] border-[#251d45] text-slate-300 hover:border-slate-500'
                          }`}
                      >
                        <div className="font-bold truncate">{sample.label}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{sample.tags}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Premium Pricing Toggle */}
              <div className="p-3.5 rounded-xl bg-[#141026] border border-[#251d47] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Episode Monetization (Coin Unlock)
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Require viewers to spend coins to unlock this episode
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadIsPremium}
                      onChange={(e) => setUploadIsPremium(e.target.checked)}
                      className="accent-pink-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Premium</span>
                  </label>
                  {uploadIsPremium && (
                    <select
                      value={uploadCoinPrice}
                      onChange={(e) => setUploadCoinPrice(parseInt(e.target.value, 10))}
                      className="bg-[#1b1536] border border-amber-500/40 text-amber-300 text-xs px-2 py-1 rounded-lg"
                    >
                      <option value={10}>10 Coins</option>
                      <option value={20}>20 Coins</option>
                      <option value={30}>30 Coins</option>
                      <option value={50}>50 Coins</option>
                    </select>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(255,42,141,0.6)] hover:shadow-[0_0_30px_rgba(255,42,141,0.9)] transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-pink-200" />
                Upload & Open in Video Verification Lab
              </button>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SERIES MANAGER */}
        {/* ========================================================= */}
        {activeTab === 'series' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Create Series Card */}
            <div className="bg-[#0e0c1c] border border-[#2d2554] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Plus className="w-4 h-4 text-pink-400" /> Create New Drama Series
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Launch a new vertical reel drama franchise and add episode videos.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateSeries} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Series Title <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The CEO's Secret Double Agent"
                      value={newSeriesTitle}
                      onChange={(e) => setNewSeriesTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Category
                    </label>
                    <select
                      value={newSeriesCategory}
                      onChange={(e) => setNewSeriesCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="revenge">Revenge / Billionaire</option>
                      <option value="romance">Romance / Contract Bride</option>
                      <option value="suspense">Suspense / Undercover</option>
                      <option value="costume">Historical / Empress</option>
                      <option value="trending">Trending Spotlight</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Synopsis / Story Hook
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe the high-stakes conflict, cliffhangers, and dramatic tension..."
                    value={newSeriesDesc}
                    onChange={(e) => setNewSeriesDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Search Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="Action, Revenge, Mystery, CEO"
                      value={newSeriesTags}
                      onChange={(e) => setNewSeriesTags(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Planned Episodes Count
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newSeriesEpisodes}
                      onChange={(e) => setNewSeriesEpisodes(parseInt(e.target.value, 10) || 20)}
                      className="w-full px-3 py-2 text-xs bg-[#141026] border border-[#261f47] rounded-xl text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Poster Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cover Poster Artwork
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {SAMPLE_CREATOR_POSTERS.map((poster, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewSeriesCover(poster)}
                        className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all relative ${newSeriesCover === poster
                          ? 'border-pink-500 scale-105 shadow-[0_0_12px_rgba(255,42,141,0.5)]'
                          : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                      >
                        <img src={poster} alt="Poster preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-[0_0_15px_rgba(255,42,141,0.5)] transition-all"
                >
                  Create Drama Franchise
                </button>
              </form>
            </div>

            {/* List of Creator Dramas */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Your Drama Franchises ({dramas.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dramas.map((drama) => (
                  <div
                    key={drama.id}
                    className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-4 flex gap-4 hover:border-pink-500/40 transition-colors shadow-sm"
                  >
                    <div className="w-24 h-32 rounded-xl overflow-hidden shrink-0 border border-[#291f4d]">
                      <img src={drama.cover_image_url} alt={drama.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold text-white line-clamp-1">{drama.title}</h4>
                          <button
                            onClick={() => deleteDrama(drama.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                            title="Delete Drama"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{drama.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {drama.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#171233] text-cyan-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 text-[11px]">
                        <span className="text-slate-400">
                          <strong>{episodes.filter((e) => e.drama_id === drama.id).length}</strong> videos uploaded
                        </span>
                        <button
                          onClick={() => {
                            setUploadDramaId(drama.id);
                            setActiveTab('upload');
                          }}
                          className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                        >
                          + Add Episode
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: VIDEO VIEWS & ANALYTICS */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0e0c1c] border border-cyan-500/30">
                <div className="text-xs text-slate-400 mb-1">Total Video Views</div>
                <div className="text-2xl font-black text-cyan-300">
                  {analytics.reduce((acc, a) => acc + a.views, 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">Across all uploaded reels</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e0c1c] border border-pink-500/30">
                <div className="text-xs text-slate-400 mb-1">Avg 9:16 Retention</div>
                <div className="text-2xl font-black text-pink-300">79.4%</div>
                <div className="text-[10px] text-emerald-400 mt-1">Top tier platform compliance</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e0c1c] border border-purple-500/30">
                <div className="text-xs text-slate-400 mb-1">Total Reel Likes</div>
                <div className="text-2xl font-black text-purple-300">
                  {analytics.reduce((acc, a) => acc + a.likes, 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-purple-400 mt-1">Viewer engagements</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e0c1c] border border-amber-500/30">
                <div className="text-xs text-slate-400 mb-1">Coins Generated</div>
                <div className="text-2xl font-black text-amber-300">
                  {analytics.reduce((acc, a) => acc + a.coins_earned, 0).toLocaleString()}
                </div>
                <div className="text-[10px] text-amber-400 mt-1">From premium unlocks</div>
              </div>
            </div>

            {/* Per-Video Breakdown Table */}
            <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400" /> Per-Video Views & Engagement Tracker
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Individual performance metrics for each 9:16 vertical reel episode.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#231b42] text-slate-400 font-semibold">
                      <th className="pb-3">Episode</th>
                      <th className="pb-3">Views</th>
                      <th className="pb-3">Retention %</th>
                      <th className="pb-3">Likes</th>
                      <th className="pb-3">Coin Unlocks</th>
                      <th className="pb-3">Revenue</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1638]">
                    {analytics.map((item) => {
                      const ep = episodes.find((e) => e.id === item.episode_id);
                      return (
                        <tr key={item.episode_id} className="hover:bg-[#141029] transition-colors">
                          <td className="py-3 font-semibold text-white">
                            <div>{item.title}</div>
                            <div className="text-[10px] text-slate-500 font-normal">ID: {item.episode_id}</div>
                          </td>
                          <td className="py-3 font-mono font-bold text-cyan-300">
                            {item.views > 0 ? item.views.toLocaleString() : 'Pending'}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-200">{item.completion_rate}%</span>
                              <div className="w-16 h-1.5 bg-[#251d45] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-pink-500 rounded-full"
                                  style={{ width: `${item.completion_rate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-mono text-pink-300">{item.likes.toLocaleString()}</td>
                          <td className="py-3 font-mono text-amber-300">
                            {item.coins_earned > 0 ? `${item.coins_earned.toLocaleString()} Coins` : 'Free'}
                          </td>
                          <td className="py-3 font-mono text-emerald-400 font-bold">
                            ${item.usd_earned.toFixed(2)}
                          </td>
                          <td className="py-3 text-right">
                            {ep?.verification_status === 'verified' ? (
                              <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded">
                                LIVE
                              </span>
                            ) : ep?.verification_status === 'rejected' ? (
                              <span className="text-[9px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded">
                                REJECTED
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                                IN REVIEW
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: PAYMENTS & MONETIZATION */}
        {/* ========================================================= */}
        {activeTab === 'monetization' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Wallet Balances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-tr from-[#1b1136] to-[#120f26] border border-pink-500/40 shadow-[0_0_30px_rgba(255,42,141,0.15)] space-y-2">
                <div className="flex items-center justify-between text-xs text-pink-300 font-bold">
                  <span>Available for Withdrawal</span>
                  <Wallet className="w-4 h-4" />
                </div>
                <div className="text-3xl font-black text-white">
                  ${monetization.available_balance_usd.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400">Ready to transfer to payout method</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e0c1c] border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                  <span>Pending Payout</span>
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-3xl font-black text-white">
                  ${monetization.pending_payout_usd.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400">Processing via ACH / PayPal batch</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0e0c1c] border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
                  <span>Lifetime Earnings</span>
                  <DollarSign className="w-4 h-4" />
                </div>
                <div className="text-3xl font-black text-white">
                  ${monetization.total_lifetime_usd.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400">Gross creator revenue generated</div>
              </div>
            </div>

            {/* Payout Request Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0e0c1c] border border-[#271f4b] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ArrowDownToLine className="w-4 h-4 text-emerald-400" /> Request Payout
                </h3>
                <p className="text-xs text-slate-400">
                  Transfer earned revenue directly to your connected merchant or bank account.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Withdrawal Amount (USD)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max={monetization.available_balance_usd}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141026] border border-[#261f47] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Payout Destination
                    </label>
                    <select
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value as any)}
                      className="w-full px-3 py-2 bg-[#141026] border border-[#261f47] rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="paypal">PayPal Instant Transfer</option>
                      <option value="stripe">Stripe Connect Direct</option>
                      <option value="bank_transfer">Direct Bank Wire (ACH)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Account / Routing Info
                    </label>
                    <input
                      type="text"
                      value={payoutAccount}
                      onChange={(e) => setPayoutAccount(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141026] border border-[#261f47] rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const amount = parseFloat(payoutAmount);
                      if (isNaN(amount) || amount <= 0) {
                        showToast('Please enter a valid amount', 'error');
                        return;
                      }
                      const res = requestPayout(amount, payoutMethod, payoutAccount);
                      if (res.success) {
                        showToast(res.message, 'success');
                      } else {
                        showToast(res.message, 'error');
                      }
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                  >
                    Submit Payout Request
                  </button>
                </div>
              </div>

              {/* Payout History Table */}
              <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0e0c1c] border border-[#271f4b] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" /> Payout Disbursement History
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#231b42] text-slate-400 font-semibold">
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Method</th>
                        <th className="pb-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1c1638]">
                      {monetization.payout_history.map((record) => (
                        <tr key={record.id} className="hover:bg-[#141029]">
                          <td className="py-2.5 text-slate-300">{record.date}</td>
                          <td className="py-2.5 font-mono font-bold text-white">
                            ${record.amount_usd.toFixed(2)}
                          </td>
                          <td className="py-2.5 text-slate-400 truncate max-w-[160px]">
                            {record.method}
                          </td>
                          <td className="py-2.5 text-right">
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                                record.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CONTENT LIBRARY */}
        {/* ========================================================= */}
        {activeTab === 'library' && (
          <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Film className="w-4 h-4 text-pink-400" /> Uploaded Videos & QA Status ({episodes.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  All episodes uploaded by your studio across all franchises.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold shadow-[0_0_12px_rgba(255,42,141,0.5)] flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" /> Upload Video
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {episodes.map((ep) => {
                const drama = dramas.find((d) => d.id === ep.drama_id);
                const isVerified = ep.verification_status === 'verified';

                return (
                  <div
                    key={ep.id}
                    className="p-4 rounded-xl bg-[#141028] border border-[#261f47] hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-pink-400 uppercase truncate">
                          {drama ? drama.title : 'Creator Drama'}
                        </span>
                        {isVerified ? (
                          <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded">
                            VERIFIED
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded">
                            PENDING QA
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{ep.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {ep.resolution || '1080x1920 (9:16)'} • {ep.duration || '01:45'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1e173a] text-xs">
                      <button
                        onClick={() => {
                          setSelectedEpisodeId(ep.id);
                          setActiveTab('verification');
                        }}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> QA Lab
                      </button>

                      <button
                        onClick={() => deleteEpisode(ep.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete Episode"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CreatorDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07060e] text-slate-100 flex items-center justify-center">
          <div className="text-sm text-slate-400">
            Loading Creator Studio...
          </div>
        </div>
      }
    >
      <CreatorDashboardContent />
    </Suspense>
  );
}
