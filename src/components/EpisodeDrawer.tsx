'use client';

import React from 'react';
import { X, Play, Lock, CheckCircle2 } from 'lucide-react';
import { Episode } from '@/lib/types';
import { useUnlockedEpisodes } from '@/lib/store';

interface EpisodeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dramaTitle: string;
  episodes: Episode[];
  currentEpisodeNumber: number;
  onSelectEpisode: (episodeNumber: number) => void;
  onPromptUnlock: (episode: Episode) => void;
}

export const EpisodeDrawer: React.FC<EpisodeDrawerProps> = ({
  isOpen,
  onClose,
  dramaTitle,
  episodes,
  currentEpisodeNumber,
  onSelectEpisode,
  onPromptUnlock,
}) => {
  const { isUnlocked } = useUnlockedEpisodes();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm sm:max-w-md bg-[#151515] h-full flex flex-col border-l border-[#292929] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#292929]">
          <div>
            <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <span>EPISODES</span>
              <span className="text-[10px] text-[#FF007A] bg-[#FF007A]/15 border border-[#FF007A]/30 px-1.5 py-0.5 rounded font-bold">
                {episodes.length} TOTAL
              </span>
            </h3>
            <p className="text-[11px] text-[#8F8F98] line-clamp-1 mt-0.5">{dramaTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#8F8F98] hover:text-white rounded-md transition-colors"
            aria-label="Close episode drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Episode List Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#222222]">
          {episodes.map((ep) => {
            const unlocked = isUnlocked(ep.id, ep.is_premium);
            const isCurrent = ep.episode_number === currentEpisodeNumber;

            return (
              <div
                key={ep.id}
                onClick={() => {
                  if (unlocked) {
                    onSelectEpisode(ep.episode_number);
                    onClose();
                  } else {
                    onPromptUnlock(ep);
                  }
                }}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#221019] border border-[#FF007A]/50 shadow-[0_2px_12px_rgba(255,0,122,0.15)]'
                    : 'hover:bg-[#1c1c1c]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-[#FF007A] text-white shadow-[0_2px_8px_rgba(255,0,122,0.5)]'
                        : 'bg-[#222222] text-[#8F8F98]'
                    }`}
                  >
                    {isCurrent ? <Play className="w-3 h-3 fill-current" /> : ep.episode_number}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-[#FF007A]' : 'text-white'}`}>
                      Ep. {ep.episode_number}: {ep.title}
                    </p>
                    <p className="text-[10px] text-[#8F8F98]">{ep.duration || '01:45'}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {unlocked ? (
                    ep.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#8F8F98] bg-[#1f1f1f] px-2 py-0.5 rounded border border-[#292929]">
                        Free
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#FF007A] bg-[#FF007A]/10 border border-[#FF007A]/30 px-2 py-0.5 rounded">
                      <Lock className="w-2.5 h-2.5 text-[#FF007A]" /> 20 Coins
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#292929] bg-[#111111] text-[11px] text-[#8F8F98] text-center">
          Episodes 1–5 are free. Premium episodes unlock for 20 coins.
        </div>
      </div>
    </div>
  );
};
