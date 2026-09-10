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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-sm sm:max-w-md bg-[#151515] border border-[#292929] rounded-2xl p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.85)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8F8F98] hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF007A]/15 border border-[#FF007A]/40 flex items-center justify-center text-[#FF007A]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Unlock Episode <span className="text-[#FF007A]">{episodeNumber}</span>
            </h2>
            <p className="text-xs text-[#8F8F98] line-clamp-1">{dramaTitle}</p>
          </div>
        </div>

        {/* Current Balance Bar */}
        <div className="flex items-center justify-between bg-[#191919] border border-[#292929] rounded-xl px-3.5 py-2.5 mb-4">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#FFC400]" />
            <span className="text-xs font-medium text-[#8F8F98]">Your Coin Balance</span>
          </div>
          <span className="text-xs font-bold text-[#FF007A]">{balance} Coins</span>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-4">
          {/* Single Episode Option */}
          <div
            onClick={handleUnlockSingle}
            className={`cursor-pointer border rounded-xl p-3 transition-all flex items-center justify-between bg-[#191919] ${
              hasEnoughForSingle
                ? 'border-[#292929] hover:border-[#FF007A] hover:shadow-[0_2px_12px_rgba(255,0,122,0.2)]'
                : 'border-[#222222] opacity-50'
            }`}
          >
            <div>
              <div className="text-xs font-bold text-white">Episode {episodeNumber} Only</div>
              <div className="text-[11px] text-[#8F8F98]">Instant HD vertical reel access</div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[#FF007A]">{singleCost} Coins</span>
              <button
                disabled={!hasEnoughForSingle}
                className="block mt-1 text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white px-3 py-1 rounded-full transition-all disabled:opacity-40 shadow-[0_2px_8px_rgba(255,0,122,0.3)]"
              >
                Unlock
              </button>
            </div>
          </div>

          {/* Bundle Option */}
          {allEpisodeIds.length > 0 && (
            <div
              onClick={handleUnlockBundle}
              className={`relative cursor-pointer border rounded-xl p-3 transition-all flex items-center justify-between bg-gradient-to-r from-[#200d17] to-[#151515] ${
                hasEnoughForBundle
                  ? 'border-[#FF007A]/60 shadow-[0_2px_16px_rgba(255,0,122,0.15)] hover:border-[#FF007A]'
                  : 'border-[#222222] opacity-50'
              }`}
            >
              <div className="absolute -top-2 right-3 bg-[#FF007A] text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                Best Value
              </div>
              <div>
                <div className="text-xs font-bold text-white">Unlock Entire Series</div>
                <div className="text-[11px] text-[#8F8F98]">All {allEpisodeIds.length} episodes unlocked</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#FF007A]">{bundleCost} Coins</span>
                <button
                  disabled={!hasEnoughForBundle}
                  className="block mt-1 text-xs font-bold bg-[#FF007A] hover:bg-[#E6006E] text-white px-3 py-1 rounded-full transition-all disabled:opacity-40 shadow-[0_2px_8px_rgba(255,0,122,0.4)]"
                >
                  Unlock All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Free Top-up Action */}
        <div className="pt-3 border-t border-[#292929] flex items-center justify-between">
          <div className="text-xs text-[#8F8F98]">Need more coins?</div>
          <button
            onClick={handleClaimFreeCoins}
            className="flex items-center gap-1.5 text-xs font-semibold text-white hover:text-[#FF007A] border border-[#292929] hover:border-[#FF007A] px-3 py-1.5 rounded-full transition-all bg-[#191919]"
          >
            <Sparkles className="w-3 h-3 text-[#FF007A]" />
            Claim +50 Free Coins
          </button>
        </div>
      </div>
    </div>
  );
};
