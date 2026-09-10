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
      newState ? 'Added to Watchlist' : 'Removed from Watchlist',
      'info'
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
      {/* Back Button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8F8F98] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Discover
        </Link>
      </div>

      {/* Drama Header Card */}
      <div className="bg-[#151515] border border-[#292929] rounded-2xl p-5 sm:p-7 shadow-[0_4px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          {/* Poster */}
          <div className="w-full md:w-56 aspect-[2/3] rounded-xl overflow-hidden bg-[#0d0d0d] border border-[#292929] shrink-0">
            <img
              src={drama.cover_image_url}
              alt={drama.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#1c1c1c] text-white border border-[#292929] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {drama.total_episodes} EPISODES
                </span>
                <span className="text-xs font-bold text-[#FFC400] bg-[#FFC400]/10 border border-[#FFC400]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#FFC400]" />
                  {drama.rating} / 10
                </span>
                <span className="text-xs text-[#8F8F98] flex items-center gap-1 bg-[#1c1c1c] border border-[#292929] px-2.5 py-0.5 rounded-full">
                  <Eye className="w-3 h-3 text-[#8F8F98]" />
                  {drama.views} streams
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                {drama.title}
              </h1>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-1.5">
                {drama.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold bg-[#1c1c1c] text-[#FF007A] border border-[#FF007A]/25 px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-[#8F8F98] leading-relaxed pt-1 max-w-2xl">
                {drama.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-[#222222]">
              <Link
                href={`/watch/${drama.id}?ep=1`}
                className="inline-flex items-center justify-center gap-2 bg-[#FF007A] hover:bg-[#E6006E] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-[0_4px_16px_rgba(255,0,122,0.35)] hover:scale-105"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play Episode 1
              </Link>

              <button
                onClick={handleToggleBookmark}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all ${
                  bookmarked
                    ? 'bg-[#FF007A] text-white border-[#FF007A] shadow-[0_2px_12px_rgba(255,0,122,0.35)]'
                    : 'bg-[#191919] text-[#8F8F98] border-[#292929] hover:border-[#FF007A] hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
                {bookmarked ? 'Saved to List' : 'Add to List'}
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-semibold bg-[#191919] text-[#8F8F98] border border-[#292929] hover:border-[#FF007A] hover:text-white transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EPISODE SELECTION SECTION */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              EPISODES <span className="text-[#FF007A]">LIST</span>
            </h2>
            <p className="text-[11px] text-[#8F8F98]">
              Episodes 1 to 5 are free. Episodes 6+ unlock with coins.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedEpForUnlock(episodes[5]);
              setIsUnlockModalOpen(true);
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#151515] border border-[#292929] hover:border-[#FF007A] px-3.5 py-1.5 rounded-full transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
            Unlock All Episodes (60 Coins)
          </button>
        </div>

        {/* EPISODE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {episodes.map((ep) => {
            const unlocked = isUnlocked(ep.id, ep.is_premium);

            return (
              <div
                key={ep.id}
                className="border border-[#292929] rounded-xl p-3 bg-[#151515] hover:border-[#FF007A] transition-all flex flex-col justify-between"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold text-white bg-[#1c1c1c] border border-[#292929] px-2 py-0.5 rounded">
                    Ep. {ep.episode_number}
                  </span>
                  {unlocked ? (
                    ep.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#8F8F98] bg-[#1c1c1c] px-2 py-0.5 rounded border border-[#292929]">
                        Free
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF007A] bg-[#FF007A]/10 px-2 py-0.5 rounded border border-[#FF007A]/30">
                      <Lock className="w-2.5 h-2.5 text-[#FF007A]" /> 20 Coins
                    </span>
                  )}
                </div>

                <div className="my-1">
                  <h4 className="text-xs font-semibold text-white line-clamp-1">
                    {ep.title}
                  </h4>
                  <p className="text-[10px] text-[#8F8F98] mt-0.5">{ep.duration || '01:45'}</p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#222222] flex items-center justify-between">
                  {unlocked ? (
                    <Link
                      href={`/watch/${drama.id}?ep=${ep.episode_number}`}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#191919] hover:bg-[#FF007A] py-1.5 rounded-lg transition-all"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Watch Now
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedEpForUnlock(ep);
                        setIsUnlockModalOpen(true);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1 text-xs font-bold text-[#FF007A] bg-[#FF007A]/10 hover:bg-[#FF007A] hover:text-white border border-[#FF007A]/30 py-1.5 rounded-lg transition-all"
                    >
                      <Lock className="w-3 h-3 text-current" />
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
          showToast('Episode unlocked! Enjoy watching on YarrowPlay.', 'success');
        }}
      />
    </div>
  );
}
