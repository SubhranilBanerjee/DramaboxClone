'use client';

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const STORAGE_KEYS = {
  COIN_BALANCE: 'dramabox_coin_balance',
  UNLOCKED_EPISODES: 'dramabox_unlocked_episodes',
  LIKED_EPISODES: 'dramabox_liked_episodes',
  BOOKMARKS: 'dramabox_bookmarked_dramas',
  USER_ID: 'dramabox_anonymous_user_id',
};

// Event bus for syncing state across components
const eventTarget = typeof window !== 'undefined' ? new EventTarget() : null;

function emitChange(event: string) {
  if (eventTarget) {
    eventTarget.dispatchEvent(new Event(event));
  }
}

export function getUserId(): string {
  if (typeof window === 'undefined') return 'mock-user-id';
  let userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
  return userId;
}

export function getCoinBalance(): number {
  if (typeof window === 'undefined') return 100;
  const stored = localStorage.getItem(STORAGE_KEYS.COIN_BALANCE);
  if (stored !== null) {
    const val = parseInt(stored, 10);
    return isNaN(val) ? 100 : val;
  }
  localStorage.setItem(STORAGE_KEYS.COIN_BALANCE, '100');
  return 100;
}

export function setCoinBalance(newBalance: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.COIN_BALANCE, Math.max(0, newBalance).toString());
  emitChange('coins_changed');
}

export function addCoins(amount: number) {
  const current = getCoinBalance();
  setCoinBalance(current + amount);
}

export function getUnlockedEpisodes(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.UNLOCKED_EPISODES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function isEpisodeUnlocked(episodeId: string, isPremium: boolean): boolean {
  if (!isPremium) return true;
  const unlocked = getUnlockedEpisodes();
  return unlocked.includes(episodeId);
}

export function unlockEpisode(episodeId: string, cost: number = 20): { success: boolean; message: string } {
  const currentCoins = getCoinBalance();
  if (currentCoins < cost) {
    return { success: false, message: `Insufficient coins. You have ${currentCoins} coins, but this episode requires ${cost} coins.` };
  }

  const unlocked = getUnlockedEpisodes();
  if (!unlocked.includes(episodeId)) {
    unlocked.push(episodeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.UNLOCKED_EPISODES, JSON.stringify(unlocked));
    }
  }

  setCoinBalance(currentCoins - cost);
  emitChange('unlocks_changed');

  // Async sync with Supabase (best-effort)
  try {
    const userId = getUserId();
    supabase.from('user_unlocks').insert({ user_id: userId, episode_id: episodeId }).then();
  } catch {
    // Ignore network or setup errors
  }

  return { success: true, message: `Episode unlocked! -${cost} coins` };
}

export function unlockAllEpisodesForDrama(dramaId: string, episodeIds: string[], cost: number = 60): { success: boolean; message: string } {
  const currentCoins = getCoinBalance();
  if (currentCoins < cost) {
    return { success: false, message: `Insufficient coins. You need ${cost} coins to unlock all episodes.` };
  }

  const unlocked = getUnlockedEpisodes();
  const newUnlocked = Array.from(new Set([...unlocked, ...episodeIds]));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.UNLOCKED_EPISODES, JSON.stringify(newUnlocked));
  }

  setCoinBalance(currentCoins - cost);
  emitChange('unlocks_changed');
  return { success: true, message: `All episodes unlocked! -${cost} coins` };
}

export function getLikedEpisodes(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LIKED_EPISODES);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleLikeEpisode(episodeId: string): boolean {
  const liked = getLikedEpisodes();
  const index = liked.indexOf(episodeId);
  let isNowLiked = false;
  if (index >= 0) {
    liked.splice(index, 1);
  } else {
    liked.push(episodeId);
    isNowLiked = true;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.LIKED_EPISODES, JSON.stringify(liked));
  }
  emitChange('likes_changed');
  return isNowLiked;
}

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleBookmark(dramaId: string): boolean {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(dramaId);
  let isBookmarked = false;
  if (index >= 0) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(dramaId);
    isBookmarked = true;
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }
  emitChange('bookmarks_changed');
  return isBookmarked;
}

// React Hook for Coin Balance
export function useCoinBalance() {
  const [balance, setBalance] = useState<number>(100);

  useEffect(() => {
    setBalance(getCoinBalance());
    const handler = () => setBalance(getCoinBalance());
    if (eventTarget) {
      eventTarget.addEventListener('coins_changed', handler);
    }
    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('coins_changed', handler);
      }
    };
  }, []);

  return { balance, addCoins, setCoinBalance };
}

// React Hook for Unlocks
export function useUnlockedEpisodes() {
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    setUnlocked(getUnlockedEpisodes());
    const handler = () => setUnlocked(getUnlockedEpisodes());
    if (eventTarget) {
      eventTarget.addEventListener('unlocks_changed', handler);
    }
    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('unlocks_changed', handler);
      }
    };
  }, []);

  return {
    unlocked,
    isUnlocked: (epId: string, isPremium: boolean) => !isPremium || unlocked.includes(epId),
    unlock: unlockEpisode,
    unlockAll: unlockAllEpisodesForDrama,
  };
}

// React Hook for Likes
export function useLikes() {
  const [liked, setLiked] = useState<string[]>([]);

  useEffect(() => {
    setLiked(getLikedEpisodes());
    const handler = () => setLiked(getLikedEpisodes());
    if (eventTarget) {
      eventTarget.addEventListener('likes_changed', handler);
    }
    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('likes_changed', handler);
      }
    };
  }, []);

  return {
    liked,
    isLiked: (epId: string) => liked.includes(epId),
    toggleLike: toggleLikeEpisode,
  };
}

// React Hook for Bookmarks
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
    const handler = () => setBookmarks(getBookmarks());
    if (eventTarget) {
      eventTarget.addEventListener('bookmarks_changed', handler);
    }
    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('bookmarks_changed', handler);
      }
    };
  }, []);

  return {
    bookmarks,
    isBookmarked: (id: string) => bookmarks.includes(id),
    toggleBookmark,
  };
}
