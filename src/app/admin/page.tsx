'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Pause,
  Eye,
  AlertTriangle,
  Film,
  Video,
  Sparkles,
  Users,
  Search,
  ExternalLink,
  MessageSquare,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAuth, ADMIN_CREDENTIALS } from '@/context/AuthContext';
import { useCreatorStore } from '@/lib/creatorStore';
import { useToast } from '@/components/Toast';
import { CreatorDrama, Episode } from '@/lib/types';

export default function AdminDashboardPage() {
  const { user, isAdmin, signIn } = useAuth();
  const { dramas, episodes, approveDrama, rejectDrama, approveEpisode, rejectEpisode } = useCreatorStore();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'queue' | 'approved' | 'rejected' | 'users'>('queue');
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<{ id: string; type: 'drama' | 'episode'; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Filter queues
  const pendingDramas = dramas.filter((d) => d.status === 'pending_approval' || d.status === 'pending_verification');
  const pendingEpisodes = episodes.filter((e) => e.verification_status === 'pending_approval' || e.verification_status === 'pending_verification');
  const totalPending = pendingDramas.length + pendingEpisodes.length;

  const approvedDramas = dramas.filter((d) => d.status === 'verified');
  const rejectedDramas = dramas.filter((d) => d.status === 'rejected');

  const handleQuickAdminLogin = async () => {
    setIsSigningIn(true);
    const res = await signIn(ADMIN_CREDENTIALS.email, ADMIN_CREDENTIALS.password);
    if (res.success) {
      showToast('Logged in as Administrator!', 'success');
    } else {
      showToast('Failed to sign in as admin.', 'error');
    }
    setIsSigningIn(false);
  };

  const handleApproveDrama = (dramaId: string, title: string) => {
    approveDrama(dramaId);
    showToast(`"${title}" approved! It is now live on the Home page.`, 'success');
  };

  const handleApproveEpisode = (epId: string, title: string) => {
    approveEpisode(epId);
    showToast(`Episode "${title}" approved for public playback!`, 'success');
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    const reason = rejectReason.trim() || 'Content does not meet DramaBox 9:16 vertical quality guidelines.';

    if (rejectModalItem.type === 'drama') {
      rejectDrama(rejectModalItem.id, reason);
      showToast(`Drama "${rejectModalItem.title}" rejected.`, 'info');
    } else {
      rejectEpisode(rejectModalItem.id, reason);
      showToast(`Episode "${rejectModalItem.title}" rejected.`, 'info');
    }

    setRejectModalItem(null);
    setRejectReason('');
  };

  // If user is not authenticated as admin, show secure admin lock screen
  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] bg-[#080711] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0e0c1c] border border-purple-500/40 rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.25)] text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/50 text-purple-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-black text-white uppercase tracking-wider">
              ADMINISTRATOR <span className="neon-text-purple">ACCESS REQUIRED</span>
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              This dashboard is restricted to DramaBox Content Reviewers and Admins to approve/reject creator video uploads before they appear on the Home page.
            </p>
          </div>

          {/* Hardcoded Credentials Notice Box */}
          <div className="p-4 rounded-xl bg-[#140e29] border border-purple-500/30 text-left space-y-1.5 font-mono text-xs">
            <div className="text-[11px] text-purple-300 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Hardcoded Admin Credentials (.env):
            </div>
            <div className="text-slate-300">
              <span className="text-slate-500">Email:</span> {ADMIN_CREDENTIALS.email}
            </div>
            <div className="text-slate-300">
              <span className="text-slate-500">Password:</span> {ADMIN_CREDENTIALS.password}
            </div>
          </div>

          <button
            onClick={handleQuickAdminLogin}
            disabled={isSigningIn}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSigningIn ? 'Authenticating Admin...' : '1-Click Sign In as Administrator'}</span>
          </button>

          <Link href="/" className="inline-block text-xs text-slate-500 hover:text-slate-300">
            &larr; Return to Home Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080711] text-white pb-20">
      {/* Top Header */}
      <div className="border-b border-[#241c42] bg-[#0e0c1c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/40 text-purple-300 px-3 py-1 rounded-full text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                DRAMABOX CONTENT MODERATION & TRUST ENGINE
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                ADMIN <span className="neon-text-purple">APPROVAL DASHBOARD</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Review vertical reel submissions from Cloudinary CDN. Only approved works are published to the public Home Page feed.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 bg-[#17122b] border border-[#2e2354] hover:border-purple-400 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Live Home Page
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-[#130f26] border border-amber-500/30">
              <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-1">
                <span>Pending Reviews</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{totalPending}</div>
              <div className="text-[11px] text-slate-400 mt-1">Awaiting approval</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#130f26] border border-emerald-500/30">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold mb-1">
                <span>Approved (Live)</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{approvedDramas.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">Streaming on Home page</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#130f26] border border-rose-500/30">
              <div className="flex items-center justify-between text-xs text-rose-400 font-semibold mb-1">
                <span>Rejected Works</span>
                <XCircle className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">{rejectedDramas.length}</div>
              <div className="text-[11px] text-slate-400 mt-1">Feedback dispatched</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#130f26] border border-cyan-500/30">
              <div className="flex items-center justify-between text-xs text-cyan-400 font-semibold mb-1">
                <span>Platform Streams</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">4.6M</div>
              <div className="text-[11px] text-slate-400 mt-1">Cloudinary CDN edge delivery</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 mt-8 border-b border-[#241c42] pb-px">
            <button
              onClick={() => setActiveTab('queue')}
              className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'queue'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" /> Approval Queue ({totalPending})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'approved'
                  ? 'border-emerald-500 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Approved Dramas ({approvedDramas.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'rejected'
                  ? 'border-rose-500 text-rose-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <XCircle className="w-4 h-4" /> Rejected Archive ({rejectedDramas.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── TAB 1: APPROVAL QUEUE ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'queue' && (
          <div className="space-y-8">
            {/* Submissions Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-400" /> Pending Drama Series Submissions
                </h2>
                <span className="text-xs text-slate-400">Requires review before appearing on Home</span>
              </div>

              {pendingDramas.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0e0c1c] border border-dashed border-[#281f4a] text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-200">No Pending Drama Series</p>
                  <p className="text-xs text-slate-400">All submitted dramas have been reviewed and approved or rejected.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingDramas.map((drama) => (
                    <div
                      key={drama.id}
                      className="p-5 rounded-2xl bg-[#0e0c1c] border border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)] flex flex-col justify-between space-y-4"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-white/10 relative">
                          <img src={drama.cover_image_url} alt={drama.title} className="w-full h-full object-cover" />
                          <span className="absolute top-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded">
                            PENDING
                          </span>
                        </div>

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                            Studio: {drama.creator_name}
                          </div>
                          <h3 className="text-base font-bold text-white leading-tight">{drama.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-2">{drama.description}</p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {drama.tags.map((tag) => (
                              <span key={tag} className="text-[10px] bg-[#1a1436] text-slate-300 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Review details */}
                      <div className="p-3 bg-[#130f24] rounded-xl border border-[#241c42] text-xs text-slate-300 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Category:</span>
                          <span className="font-semibold text-white uppercase">{drama.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Uploaded:</span>
                          <span>{new Date(drama.created_at || '').toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="text-amber-400 font-bold">Waiting for Admin Approval</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => handleApproveDrama(drama.id, drama.title)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Publish to Home</span>
                        </button>
                        <button
                          onClick={() => setRejectModalItem({ id: drama.id, type: 'drama', title: drama.title })}
                          className="bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pending Episodes Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-purple-400" /> Pending Cloudinary Video Episodes ({pendingEpisodes.length})
                </h2>
              </div>

              {pendingEpisodes.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0e0c1c] border border-dashed border-[#281f4a] text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-slate-200">No Pending Episode Videos</p>
                  <p className="text-xs text-slate-400">All creator vertical videos have been verified.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingEpisodes.map((ep) => (
                    <div
                      key={ep.id}
                      className="p-4 rounded-2xl bg-[#0e0c1c] border border-[#271f49] hover:border-purple-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setPreviewVideoUrl(ep.video_url)}
                          className="w-12 h-16 rounded-lg bg-slate-950 border border-purple-500/50 flex items-center justify-center relative group overflow-hidden shrink-0"
                          title="Click to preview vertical video"
                        >
                          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                          </div>
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{ep.title}</span>
                            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full">
                              Pending Review
                            </span>
                            {ep.is_premium && (
                              <span className="text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.2 rounded-full">
                                Premium ({ep.coin_price} Coins)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-3">
                            <span>Series ID: {ep.drama_id}</span>
                            <span>Aspect: {ep.aspect_ratio || '9:16 Vertical'}</span>
                            <span>Duration: {ep.duration || '01:40'}</span>
                            <span>Res: {ep.resolution || '1080x1920 Full HD'}</span>
                          </div>
                          <p className="text-[11px] text-cyan-300 mt-1 truncate max-w-lg">
                            CDN: {ep.video_url}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setPreviewVideoUrl(ep.video_url)}
                          className="px-3 py-2 bg-[#1b1436] hover:bg-[#251d4d] border border-[#31255e] text-cyan-300 rounded-xl text-xs font-bold flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview Reel
                        </button>
                        <button
                          onClick={() => handleApproveEpisode(ep.id, ep.title)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => setRejectModalItem({ id: ep.id, type: 'episode', title: ep.title })}
                          className="px-3 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: APPROVED DRAMAS (LIVE ON HOME) ──────────────────────── */}
        {activeTab === 'approved' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Approved Dramas Live on Home Page
                </h2>
                <p className="text-xs text-slate-400">These creator series are publicly accessible and visible in the discover feed.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedDramas.map((drama) => (
                <div
                  key={drama.id}
                  className="p-4 rounded-2xl bg-[#0e0c1c] border border-emerald-500/40 flex flex-col justify-between space-y-4"
                >
                  <div className="flex gap-4">
                    <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden bg-slate-950 shrink-0">
                      <img src={drama.cover_image_url} alt={drama.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        LIVE & APPROVED
                      </span>
                      <h3 className="text-sm font-bold text-white truncate mt-1">{drama.title}</h3>
                      <p className="text-[11px] text-slate-400">{drama.creator_name}</p>
                      <p className="text-[11px] text-slate-400">{drama.total_episodes} Episodes • Rating: {drama.rating}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#221a42]">
                    <Link
                      href={`/watch/${drama.id}?ep=1`}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      Watch Live &rarr;
                    </Link>
                    <button
                      onClick={() => setRejectModalItem({ id: drama.id, type: 'drama', title: drama.title })}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Unpublish / Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: REJECTED ARCHIVE ─────────────────────────────────────── */}
        {activeTab === 'rejected' && (
          <div className="space-y-6">
            <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" /> Rejected Works & Feedback
            </h2>

            {rejectedDramas.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#0e0c1c] border border-dashed border-[#281f4a] text-center space-y-2">
                <p className="text-xs text-slate-400">No dramas are currently marked as rejected.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rejectedDramas.map((drama) => (
                  <div
                    key={drama.id}
                    className="p-4 rounded-2xl bg-[#0e0c1c] border border-rose-500/30 flex items-center justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-bold text-white">{drama.title}</h3>
                      <p className="text-xs text-rose-300 mt-1">
                        Reason: {drama.rejection_reason || 'Guidelines not met'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleApproveDrama(drama.id, drama.title)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                    >
                      Re-Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── VIDEO PREVIEW MODAL ─────────────────────────────────────────── */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative bg-[#0e0c1c] border border-purple-500/40 rounded-3xl p-4 sm:p-6 max-w-sm w-full flex flex-col items-center shadow-[0_0_40px_rgba(168,85,247,0.3)]">
            <button
              onClick={() => setPreviewVideoUrl(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-xs font-bold"
            >
              ✕ Close
            </button>
            <h3 className="text-sm font-bold text-white mb-3">Vertical Reel 9:16 Preview</h3>
            <div className="w-64 aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
              <video src={previewVideoUrl} controls autoPlay className="w-full h-full object-cover" />
            </div>
            <p className="text-[11px] text-slate-400 mt-3 text-center">
              Cloudinary multi-bitrate portrait video playback test
            </p>
          </div>
        </div>
      )}

      {/* ── REJECTION REASON MODAL ──────────────────────────────────────── */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative bg-[#0e0c1c] border border-rose-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-[0_0_40px_rgba(244,63,94,0.25)]">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">
                Reject Submission: {rejectModalItem.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300">
              Provide constructive feedback for the creator explaining why this submission cannot be approved for public streaming:
            </p>

            <textarea
              rows={4}
              placeholder="e.g. Video resolution does not meet 1080x1920 portrait standard, or audio levels exceed acceptable LUFS thresholds."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 bg-[#141026] border border-[#2a1f49] rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-sans"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
