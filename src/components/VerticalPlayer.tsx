'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Share2,
  List,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Lock,
  Coins,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { Drama, Episode } from '@/lib/types';
import { useLikes, useUnlockedEpisodes, useCoinBalance } from '@/lib/store';
import { useToast } from './Toast';
import { EpisodeDrawer } from './EpisodeDrawer';
import { UnlockModal } from './UnlockModal';

interface VerticalPlayerProps {
  drama: Drama;
  episodes: Episode[];
  initialEpisodeNumber?: number;
}

export const VerticalPlayer: React.FC<VerticalPlayerProps> = ({
  drama,
  episodes,
  initialEpisodeNumber = 1,
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const { liked, isLiked, toggleLike } = useLikes();
  const { isUnlocked } = useUnlockedEpisodes();
  const { balance, addCoins } = useCoinBalance();

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(() => {
    const idx = episodes.findIndex((e) => e.episode_number === initialEpisodeNumber);
    return idx >= 0 ? idx : 0;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState<boolean>(false);
  const [selectedEpForUnlock, setSelectedEpForUnlock] = useState<Episode | null>(null);
  const [showSynopsis, setShowSynopsis] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentEpisode = episodes[currentEpisodeIndex] || episodes[0];
  const isPremiumLocked = currentEpisode
    ? currentEpisode.is_premium && !isUnlocked(currentEpisode.id, currentEpisode.is_premium)
    : false;

  // Touch swipe support for mobile
  const touchStartY = useRef<number>(0);

  // Sync URL query on episode change
  useEffect(() => {
    if (currentEpisode) {
      window.history.replaceState(null, '', `/watch/${drama.id}?ep=${currentEpisode.episode_number}`);
    }
  }, [currentEpisode, drama.id]);

  // Handle Play/Pause and Lock states
  useEffect(() => {
    if (isPremiumLocked) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      setVideoError(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(() => {
              // Browser autoplay policy might require mute
              setIsMuted(true);
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            });
        }
      }
    }
  }, [currentEpisodeIndex, isPremiumLocked]);

  const handleNextEpisode = useCallback(() => {
    if (currentEpisodeIndex < episodes.length - 1) {
      setCurrentEpisodeIndex((prev) => prev + 1);
    } else {
      showToast('You have reached the final episode of this series!', 'info');
    }
  }, [currentEpisodeIndex, episodes.length, showToast]);

  const handlePrevEpisode = useCallback(() => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex((prev) => prev - 1);
    }
  }, [currentEpisodeIndex]);

  // Keyboard navigation (ArrowUp, ArrowDown, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNextEpisode();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrevEpisode();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextEpisode, handlePrevEpisode]);

  const togglePlayPause = () => {
    if (isPremiumLocked) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 1;
      setCurrentTime(cur);
      setDuration(dur);
      setProgress((cur / dur) * 100);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPremiumLocked || !videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * (videoRef.current.duration || 0);
    videoRef.current.currentTime = newTime;
    setProgress(pos * 100);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!', 'success');
      }).catch(() => {
        showToast('Share link ready: ' + url, 'info');
      });
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    // Swipe threshold of 50px
    if (deltaY > 50) {
      handleNextEpisode(); // Swiped up -> Next
    } else if (deltaY < -50) {
      handlePrevEpisode(); // Swiped down -> Prev
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-[#07060e] flex items-center justify-center py-2 sm:py-6 px-2 sm:px-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8">
        
        {/* PLAYER CONTAINER (True 9:16 Vertical Reel Frame with Neon Glow) */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full max-w-[390px] h-[82vh] max-h-[820px] bg-black rounded-2xl overflow-hidden border border-[#261f44] shadow-[0_0_35px_rgba(255,42,141,0.25)] flex items-center justify-center select-none"
        >
          {/* Top Bar Overlay */}
          <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white">
            <Link
              href={`/drama/${drama.id}`}
              className="p-1.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:text-pink-400 hover:border-pink-500 transition-all border border-white/20"
              aria-label="Back to Drama details"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="text-center px-2">
              <span className="text-[11px] font-medium uppercase tracking-widest text-white/80">
                Episode {currentEpisode?.episode_number} of {episodes.length}
              </span>
            </div>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors border border-white/20"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Video Stream Element */}
          <video
            ref={videoRef}
            key={currentEpisode?.id}
            src={currentEpisode?.video_url}
            loop={false}
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleNextEpisode}
            onError={() => setVideoError(true)}
            onClick={togglePlayPause}
            className={`w-full h-full object-cover cursor-pointer transition-all duration-300 ${
              isPremiumLocked ? 'blur-md brightness-50' : ''
            }`}
          />

          {/* Backup Canvas / Fallback for network timeouts */}
          {videoError && !isPremiumLocked && (
            <div
              onClick={togglePlayPause}
              className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black flex flex-col items-center justify-center p-6 text-center text-white cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center mb-4 animate-pulse">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
              <h4 className="text-base font-semibold">{currentEpisode?.title}</h4>
              <p className="text-xs text-gray-400 mt-1">Tap screen to restart playback</p>
            </div>
          )}

          {/* Play/Pause Center Splash Indicator */}
          {!isPlaying && !isPremiumLocked && (
            <div
              onClick={togglePlayPause}
              className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            >
              <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* RIGHT-SIDE ACTION SIDEBAR (Reel / TikTok Style) */}
          <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4">
            {/* Like Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => toggleLike(currentEpisode.id)}
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                  isLiked(currentEpisode.id)
                    ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_20px_rgba(255,42,141,0.9)]'
                    : 'bg-black/50 border-white/20 text-white hover:border-pink-500/70 hover:shadow-[0_0_10px_rgba(255,42,141,0.4)]'
                }`}
                aria-label="Like episode"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isLiked(currentEpisode.id) ? 'fill-current' : ''
                  }`}
                />
              </button>
              <span className="text-[10px] text-white font-medium mt-1 drop-shadow-xs">
                {isLiked(currentEpisode.id) ? 'Liked' : 'Like'}
              </span>
            </div>

            {/* Episode List Drawer Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] flex items-center justify-center transition-all"
                aria-label="Episodes list"
              >
                <List className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-white font-medium mt-1 drop-shadow-xs">
                Episodes
              </span>
            </div>

            {/* Share Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleShare}
                className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:border-pink-500 hover:text-pink-300 hover:shadow-[0_0_12px_rgba(255,42,141,0.4)] flex items-center justify-center transition-all"
                aria-label="Share episode"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <span className="text-[10px] text-white font-medium mt-1 drop-shadow-xs">
                Share
              </span>
            </div>
          </div>

          {/* BOTTOM OVERLAY INFO & PROGRESS BAR */}
          <div className="absolute bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-black/95 via-black/50 to-transparent text-white">
            <div className="pr-14">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-pink-500/30 text-pink-300 border border-pink-500/50 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs shadow-[0_0_8px_rgba(255,42,141,0.4)]">
                  EP {currentEpisode?.episode_number}
                </span>
                <h3 className="text-sm font-semibold truncate drop-shadow-xs">
                  {drama.title}
                </h3>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1 font-medium">
                {currentEpisode?.title}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div
                onClick={handleSeek}
                className="w-full h-1 bg-white/20 hover:h-2 rounded-full cursor-pointer transition-all relative overflow-hidden"
              >
                <div
                  className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(255,42,141,0.8)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                <span className="text-cyan-300 font-mono">{formatTime(currentTime)}</span>
                <span className="font-mono">{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* PAYWALL OVERLAY (Triggered when episode is locked) */}
          {isPremiumLocked && (
            <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-500/60 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(255,42,141,0.4)]">
                <Lock className="w-7 h-7 text-pink-400" />
              </div>

              <span className="text-[11px] font-bold uppercase tracking-widest text-pink-400 filter drop-shadow-[0_0_4px_rgba(255,42,141,0.8)]">
                PREMIUM EPISODE
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Episode {currentEpisode.episode_number} is Locked
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-[260px] line-clamp-2">
                Unlock with coins to keep watching the dramatic twists of {drama.title}.
              </p>

              {/* Coin Balance Pill */}
              <div className="mt-4 flex items-center gap-2 bg-[#120f26] border border-cyan-500/40 px-3 py-1.5 rounded-full text-xs shadow-[0_0_10px_rgba(0,240,255,0.25)]">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Your Balance: <strong className="neon-text-cyan">{balance} Coins</strong></span>
              </div>

              {/* Unlock Actions */}
              <div className="mt-5 w-full max-w-xs space-y-2">
                <button
                  onClick={() => {
                    setSelectedEpForUnlock(currentEpisode);
                    setIsUnlockModalOpen(true);
                  }}
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs hover:from-pink-500 hover:to-purple-500 transition-all shadow-[0_0_20px_rgba(255,42,141,0.6)] flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Coins className="w-4 h-4 text-amber-300" />
                  Unlock for 20 Coins
                </button>

                <button
                  onClick={() => {
                    addCoins(50);
                    showToast('+50 Daily Coins added!', 'success');
                  }}
                  className="w-full bg-[#16122d] border border-cyan-500/40 text-cyan-300 font-medium py-2 px-4 rounded-xl text-xs hover:bg-[#201a40] transition-colors flex items-center justify-center gap-1.5 hover:shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Claim +50 Free Coins
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP SIDEBAR / COMPANION PANEL (Neon Dark Edition) */}
        <div className="hidden lg:flex flex-col w-80 bg-[#0e0c1c] border border-[#221c3d] rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          {/* Series Meta */}
          <div className="flex items-start gap-3 pb-4 border-b border-[#1f1938]">
            <img
              src={drama.cover_image_url}
              alt={drama.title}
              className="w-16 h-20 object-cover rounded-lg border border-[#2e2652] shrink-0"
            />
            <div>
              <h2 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                {drama.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {drama.total_episodes} Total Episodes
              </p>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {drama.tags.slice(0, 2).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-[#16122b] text-pink-300 border border-pink-500/25 px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Episode Controls */}
          <div className="py-4 border-b border-[#1f1938]">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Quick Navigation
            </h4>
            <div className="flex gap-2">
              <button
                onClick={handlePrevEpisode}
                disabled={currentEpisodeIndex === 0}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-[#261f47] bg-[#120f26] rounded-lg text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-cyan-400/50 disabled:opacity-40 transition-all"
              >
                <ChevronUp className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={handleNextEpisode}
                disabled={currentEpisodeIndex === episodes.length - 1}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-xs font-semibold hover:from-pink-500 hover:to-purple-500 shadow-[0_0_12px_rgba(255,42,141,0.5)] disabled:opacity-40 transition-all"
              >
                Next <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Tip: Press Up/Down arrow keys or spacebar
            </p>
          </div>

          {/* Current Episode Synopsis */}
          <div className="py-4 border-b border-[#1f1938] flex-1">
            <h4 className="text-xs font-semibold text-white mb-1">
              Ep. {currentEpisode?.episode_number}: {currentEpisode?.title}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {drama.description}
            </p>
          </div>

          {/* All Episodes Drawer Trigger */}
          <div className="pt-4">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full flex items-center justify-between p-3 border border-[#28214a] hover:border-pink-500/70 hover:shadow-[0_0_15px_rgba(255,42,141,0.25)] rounded-xl text-xs font-semibold text-white transition-all bg-[#131026]"
            >
              <span className="flex items-center gap-2">
                <List className="w-4 h-4 text-cyan-400" />
                Browse All {episodes.length} Episodes
              </span>
              <span className="text-pink-400">View</span>
            </button>
          </div>
        </div>

      </div>

      {/* EPISODE LIST DRAWER */}
      <EpisodeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        dramaTitle={drama.title}
        episodes={episodes}
        currentEpisodeNumber={currentEpisode?.episode_number || 1}
        onSelectEpisode={(epNum) => {
          const idx = episodes.findIndex((e) => e.episode_number === epNum);
          if (idx >= 0) setCurrentEpisodeIndex(idx);
        }}
        onPromptUnlock={(ep) => {
          setSelectedEpForUnlock(ep);
          setIsUnlockModalOpen(true);
        }}
      />

      {/* UNLOCK MODAL */}
      <UnlockModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        dramaTitle={drama.title}
        dramaId={drama.id}
        episodeNumber={selectedEpForUnlock?.episode_number || currentEpisode?.episode_number || 1}
        episodeId={selectedEpForUnlock?.id || currentEpisode?.id}
        allEpisodeIds={episodes.map((e) => e.id)}
        onUnlockSuccess={() => {
          // If unlocking the currently selected episode, trigger play
          if (selectedEpForUnlock && selectedEpForUnlock.id !== currentEpisode.id) {
            const idx = episodes.findIndex((e) => e.id === selectedEpForUnlock.id);
            if (idx >= 0) setCurrentEpisodeIndex(idx);
          }
          setIsPlaying(true);
        }}
      />
    </div>
  );
};
