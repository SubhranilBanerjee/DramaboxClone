'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Play,
  Bookmark,
  Share2,
  Lock,
  CheckCircle2,
  Star,
  Eye,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { getDramaById, generateEpisodesForDrama } from '@/lib/data';
import { useBookmarks, useUnlockedEpisodes } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { UnlockModal } from '@/components/UnlockModal';
import { Episode } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DramaDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const drama = getDramaById(id);

  if (!drama) {
    notFound();
  }

  const episodes = generateEpisodesForDrama(drama);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { isUnlocked } = useUnlockedEpisodes();
  const { showToast } = useToast();

  const [selectedEpForUnlock, setSelectedEpForUnlock] = useState<Episode | null>(null);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);

  const bookmarked = isBookmarked(drama.id);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Drama link copied to clipboard!', 'success');
    }
  };

  const handleToggleBookmark = () => {
    const newState = toggleBookmark(drama.id);
    showToast(
      newState ? 'Added to My List' : 'Removed from My List',
      'info'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
      {/* Back Button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>
      </div>

      {/* Drama Header Card (Neon Cyber Edition) */}
      <div className="bg-[#0e0c1c] border border-[#261f47] rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(255,42,141,0.15)] relative overflow-hidden">
        {/* Subtle interior glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-600/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-600/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          {/* Poster */}
          <div className="w-full md:w-64 aspect-[3/4] rounded-xl overflow-hidden bg-[#141026] border border-[#2d2554] shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.6)]">
            <img
              src={drama.cover_image_url}
              alt={drama.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#16122d] text-cyan-300 border border-cyan-500/30 text-xs font-bold px-2.5 py-1 rounded-md shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                  {drama.total_episodes} EPISODES
                </span>
                <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />
                  {drama.rating} / 10
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 bg-[#141126] border border-[#231d3d] px-2.5 py-1 rounded-md">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  {drama.views} streams
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {drama.title.split(' ')[0]}{' '}
                <span className="neon-sign-pink">
                  {drama.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {drama.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-[#141026] text-pink-300 border border-pink-500/25 px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-sm text-slate-300 leading-relaxed max-w-3xl pt-2">
                {drama.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1f1938]">
              <Link
                href={`/watch/${drama.id}?ep=1`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-[0_0_20px_rgba(255,42,141,0.6)] hover:shadow-[0_0_30px_rgba(255,42,141,0.9)] hover:scale-105"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Watching Ep. 1
              </Link>

              <button
                onClick={handleToggleBookmark}
                className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                  bookmarked
                    ? 'bg-pink-600 text-white border-pink-500 shadow-[0_0_12px_rgba(255,42,141,0.6)] font-semibold'
                    : 'bg-[#141026] text-slate-300 border-[#261f47] hover:border-pink-500/60 hover:text-pink-300'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Saved to My List' : 'Add to My List'}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-[#141026] text-slate-300 border border-[#261f47] hover:border-cyan-400 hover:text-cyan-300 transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EPISODE SELECTION SECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              EPISODES <span className="neon-text-cyan">LIST</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Episodes 1 to 5 are free. Episodes 6+ unlock with neon coins.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedEpForUnlock(episodes[5]);
              setIsUnlockModalOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 bg-[#141026] border border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,240,255,0.35)] px-4 py-2 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Unlock All Episodes (60 Coins)
          </button>
        </div>

        {/* EPISODE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {episodes.map((ep) => {
            const unlocked = isUnlocked(ep.id, ep.is_premium);

            return (
              <div
                key={ep.id}
                className="border border-[#221c3d] rounded-xl p-4 bg-[#0e0c1c] hover:border-pink-500/60 hover:shadow-[0_0_15px_rgba(255,42,141,0.2)] transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-white bg-[#1a1433] border border-[#2a2152] px-2 py-0.5 rounded">
                    Ep. {ep.episode_number}
                  </span>
                  {unlocked ? (
                    ep.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40 shadow-[0_0_6px_rgba(0,240,255,0.3)]">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 bg-[#141026] px-2 py-0.5 rounded border border-[#241d3d]">
                        Free
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-300 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-500/40 shadow-[0_0_6px_rgba(255,42,141,0.3)]">
                      <Lock className="w-3 h-3 text-pink-400" /> 20 Coins
                    </span>
                  )}
                </div>

                <div className="my-1">
                  <h4 className="text-xs font-semibold text-white line-clamp-1">
                    {ep.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{ep.duration || '01:45'}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1b1633] flex items-center justify-between">
                  {unlocked ? (
                    <Link
                      href={`/watch/${drama.id}?ep=${ep.episode_number}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-200 bg-[#16122d] hover:bg-pink-600 hover:text-white py-2 rounded-lg transition-all hover:shadow-[0_0_12px_rgba(255,42,141,0.5)]"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Watch Now
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedEpForUnlock(ep);
                        setIsUnlockModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-pink-300 bg-pink-950/40 hover:bg-pink-900/60 border border-pink-500/40 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(255,42,141,0.25)]"
                    >
                      <Lock className="w-3.5 h-3.5 text-pink-400" />
                      Unlock Episode
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* UNLOCK MODAL */}
      <UnlockModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        dramaTitle={drama.title}
        dramaId={drama.id}
        episodeNumber={selectedEpForUnlock?.episode_number || 6}
        episodeId={selectedEpForUnlock?.id || episodes[5]?.id}
        allEpisodeIds={episodes.map((e) => e.id)}
        onUnlockSuccess={() => {
          showToast('Episode unlocked! Enjoy watching.', 'success');
        }}
      />
    </div>
  );
}
