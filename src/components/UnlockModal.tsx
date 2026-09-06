'use client';

import React from 'react';
import { Lock, Coins, Sparkles, X, Check } from 'lucide-react';
import { useCoinBalance } from '@/lib/store';
import { useToast } from './Toast';

interface UnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  dramaTitle: string;
  dramaId: string;
  episodeNumber: number;
  episodeId: string;
  allEpisodeIds?: string[];
  onUnlockSuccess: () => void;
}

export const UnlockModal: React.FC<UnlockModalProps> = ({
  isOpen,
  onClose,
  dramaTitle,
  dramaId,
  episodeNumber,
  episodeId,
  allEpisodeIds = [],
  onUnlockSuccess,
}) => {
  const { balance, addCoins } = useCoinBalance();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const singleCost = 20;
  const bundleCost = 60;
  const hasEnoughForSingle = balance >= singleCost;
  const hasEnoughForBundle = balance >= bundleCost;

  const handleUnlockSingle = () => {
    if (!hasEnoughForSingle) {
      showToast('Not enough coins. Claim free coins below!', 'error');
      return;
    }
    const { unlockEpisode } = require('@/lib/store');
    const res = unlockEpisode(episodeId, singleCost);
    if (res.success) {
      showToast(`Episode ${episodeNumber} unlocked!`, 'success');
      onUnlockSuccess();
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleUnlockBundle = () => {
    if (!hasEnoughForBundle) {
      showToast('Not enough coins. Claim free coins below!', 'error');
      return;
    }
    const { unlockAllEpisodesForDrama } = require('@/lib/store');
    const res = unlockAllEpisodesForDrama(dramaId, allEpisodeIds, bundleCost);
    if (res.success) {
      showToast(`All remaining episodes unlocked!`, 'success');
      onUnlockSuccess();
      onClose();
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleClaimFreeCoins = () => {
    addCoins(50);
    showToast('+50 Daily Coins added to your balance!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0e0c1c] border border-[#2d2554] rounded-2xl p-6 sm:p-7 shadow-[0_0_40px_rgba(255,42,141,0.25)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-pink-500/20 border border-pink-500/50 flex items-center justify-center text-pink-400 shadow-[0_0_15px_rgba(255,42,141,0.4)]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Unlock Episode <span className="neon-text-pink">{episodeNumber}</span>
            </h2>
            <p className="text-xs text-slate-400 line-clamp-1">{dramaTitle}</p>
          </div>
        </div>

        {/* Current Balance Bar */}
        <div className="flex items-center justify-between bg-[#141026] border border-[#261f47] rounded-xl px-4 py-2.5 mb-5 shadow-[inset_0_0_12px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" />
            <span className="text-xs font-medium text-slate-300">Your Coin Balance</span>
          </div>
          <span className="text-sm font-bold neon-text-cyan">{balance} Coins</span>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-5">
          {/* Single Episode Option */}
          <div
            onClick={handleUnlockSingle}
            className={`cursor-pointer border rounded-xl p-3.5 transition-all flex items-center justify-between bg-[#120f26] ${
              hasEnoughForSingle
                ? 'border-[#2c2452] hover:border-pink-500/80 hover:shadow-[0_0_15px_rgba(255,42,141,0.25)]'
                : 'border-[#1e1938] opacity-50'
            }`}
          >
            <div>
              <div className="text-sm font-bold text-white">Episode {episodeNumber} Only</div>
              <div className="text-xs text-slate-400">Immediate HD streaming access</div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-pink-400">{singleCost} Coins</span>
              <button
                disabled={!hasEnoughForSingle}
                className="block mt-1 text-xs font-bold bg-pink-600 hover:bg-pink-500 text-white px-3 py-1 rounded-md transition-colors disabled:opacity-40 shadow-[0_0_10px_rgba(255,42,141,0.4)]"
              >
                Unlock
              </button>
            </div>
          </div>

          {/* Bundle Option */}
          {allEpisodeIds.length > 0 && (
            <div
              onClick={handleUnlockBundle}
              className={`relative cursor-pointer border rounded-xl p-3.5 transition-all flex items-center justify-between bg-gradient-to-r from-[#171131] to-[#0f172a] ${
                hasEnoughForBundle
                  ? 'border-cyan-500/60 shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:border-cyan-400'
                  : 'border-[#1e1938] opacity-50'
              }`}
            >
              <div className="absolute -top-2 right-3 bg-gradient-to-r from-pink-500 to-cyan-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-[0_0_8px_rgba(0,240,255,0.6)]">
                Best Value • 60% OFF
              </div>
              <div>
                <div className="text-sm font-bold text-white">Unlock Entire Series</div>
                <div className="text-xs text-slate-300">Access all {allEpisodeIds.length} episodes forever</div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold neon-text-cyan">{bundleCost} Coins</span>
                <button
                  disabled={!hasEnoughForBundle}
                  className="block mt-1 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3 py-1 rounded-md transition-colors disabled:opacity-40 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                >
                  Unlock All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Free Top-up Action */}
        <div className="pt-3 border-t border-[#201a3b] flex items-center justify-between">
          <div className="text-xs text-slate-400">Need more coins?</div>
          <button
            onClick={handleClaimFreeCoins}
            className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 px-3 py-1.5 rounded-lg transition-colors hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] bg-[#121026]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Claim +50 Free Coins
          </button>
        </div>
      </div>
    </div>
  );
};
