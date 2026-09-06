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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0e0c1c] h-full flex flex-col border-l border-[#261f47] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#201a3b]">
          <div>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <span>EPISODES</span>
              <span className="text-[10px] text-pink-400 bg-pink-500/20 border border-pink-500/40 px-2 py-0.5 rounded">
                {episodes.length} TOTAL
              </span>
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{dramaTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md transition-colors"
            aria-label="Close episode drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Episode List Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#1b1633]">
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
                className={`py-3 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#181333] border border-pink-500/60 shadow-[0_0_15px_rgba(255,42,141,0.25)]'
                    : 'hover:bg-[#141026]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-pink-600 text-white shadow-[0_0_10px_rgba(255,42,141,0.8)]'
                        : 'bg-[#1a1538] text-slate-300'
                    }`}
                  >
                    {isCurrent ? <Play className="w-3.5 h-3.5 fill-current" /> : ep.episode_number}
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isCurrent ? 'neon-text-pink' : 'text-white'}`}>
                      Ep. {ep.episode_number}: {ep.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{ep.duration || '01:45'}</p>
                  </div>
                </div>

                <div className="shrink-0">
                  {unlocked ? (
                    ep.is_premium ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 bg-[#16122b] px-2 py-0.5 rounded border border-[#261e47]">
                        Free
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-300 bg-pink-950/60 border border-pink-500/40 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(255,42,141,0.3)]">
                      <Lock className="w-3 h-3 text-pink-400" /> 20 Coins
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#201a3b] bg-[#090814] text-xs text-slate-400 text-center">
          Episodes 1–5 are free. Premium episodes unlock for 20 coins.
        </div>
      </div>
    </div>
  );
};
