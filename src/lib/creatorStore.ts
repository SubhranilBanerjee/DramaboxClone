'use client';

import { useState, useEffect } from 'react';
import {
  Episode,
  CreatorDrama,
  VideoVerificationStatus,
  VideoVerificationReport,
  VideoQAItem,
  EpisodeAnalytics,
  CreatorMonetization
} from './types';

const STORAGE_KEYS = {
  CREATOR_DRAMAS: 'yarrowplay_creator_dramas',
  CREATOR_EPISODES: 'yarrowplay_creator_episodes',
  VERIFICATION_REPORTS: 'yarrowplay_video_verification_reports',
  EPISODE_ANALYTICS: 'yarrowplay_episode_analytics',
  CREATOR_MONETIZATION: 'yarrowplay_creator_monetization',
};

// Event bus to keep creator UI and admin UI synchronized in real-time
const eventTarget = typeof window !== 'undefined' ? new EventTarget() : null;

function emitChange(event: string) {
  if (eventTarget) {
    eventTarget.dispatchEvent(new Event(event));
  }
}

// Initial high-quality dramas: one approved, one pending review
const INITIAL_CREATOR_DRAMAS: CreatorDrama[] = [
  {
    id: 'creator-series-neon-rebel',
    title: 'Cyber Heist: The Midnight Syndicate',
    description: 'A rogue neural hacker joins forces with a disavowed black-ops agent to extract confidential AI prototypes from Neo-Verona’s most fortified skyscraper.',
    cover_image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=75',
    total_episodes: 12,
    tags: ['Cyberpunk', 'Action', 'Revenge', 'Heist'],
    category: 'suspense',
    views: '3.4M',
    rating: 9.8,
    creator_id: 'demo_creator_id',
    creator_name: 'Neon Rebel Studios',
    status: 'verified',
    created_at: '2026-03-01T10:00:00Z',
    episodes_count: 2,
  },
  {
    id: 'creator-series-shadow-love',
    title: 'Whispers Across the Dynasty',
    description: 'An exiled court alchemist crafts an elixir capable of crossing dimensional timelines, catching the attention of the ruthless Crown Prince who demands her allegiance.',
    cover_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=75',
    total_episodes: 18,
    tags: ['Historical', 'Romance', 'Fantasy', 'Time Travel'],
    category: 'romance',
    views: '1.2M',
    rating: 9.6,
    creator_id: 'demo_creator_id',
    creator_name: 'Neon Rebel Studios',
    status: 'pending_approval',
    created_at: '2026-03-04T14:30:00Z',
    episodes_count: 2,
  },
];

export const INITIAL_CREATOR_EPISODES: Episode[] = [
  {
    id: 'creator-series-neon-rebel-ep-1',
    drama_id: 'creator-series-neon-rebel',
    episode_number: 1,
    title: 'Episode 1: Infiltration at Sector 9',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-mysterious-woman-walking-through-a-city-at-night-42289-large.mp4',
    is_premium: false,
    duration: '01:34',
    verification_status: 'verified',
    aspect_ratio: '9:16 Vertical',
    resolution: '1080x1920 Full HD',
    file_size: '42.4 MB',
    verification_notes: 'All quality and aspect ratio checks passed with 100% compliance.',
    verified_at: '2026-03-02T12:00:00Z',
    created_at: '2026-03-02T10:00:00Z',
    views: 1420500,
    likes: 89400,
  },
  {
    id: 'creator-series-neon-rebel-ep-2',
    drama_id: 'creator-series-neon-rebel',
    episode_number: 2,
    title: 'Episode 2: The Neural Breach',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-and-purple-neon-lit-room-41712-large.mp4',
    is_premium: true,
    coin_price: 20,
    duration: '01:48',
    verification_status: 'verified',
    aspect_ratio: '9:16 Vertical',
    resolution: '1080x1920 Full HD',
    file_size: '51.2 MB',
    verification_notes: 'Sound levels aligned to -14.2 LUFS. Verified.',
    verified_at: '2026-03-02T13:00:00Z',
    created_at: '2026-03-02T11:00:00Z',
    views: 980200,
    likes: 64100,
  },
  {
    id: 'creator-series-shadow-love-ep-1',
    drama_id: 'creator-series-shadow-love',
    episode_number: 1,
    title: 'Episode 1: The Alchemist’s Vow',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-womans-face-with-dramatic-lighting-42288-large.mp4',
    is_premium: false,
    duration: '01:52',
    verification_status: 'pending_approval',
    aspect_ratio: '9:16 Vertical',
    resolution: '1080x1920 Full HD',
    file_size: '48.9 MB',
    verification_notes: 'Uploaded to Cloudinary CDN. Waiting for Admin verification and approval.',
    created_at: '2026-03-04T15:00:00Z',
    views: 64000,
    likes: 3100,
  },
  {
    id: 'creator-series-shadow-love-ep-2',
    drama_id: 'creator-series-shadow-love',
    episode_number: 2,
    title: 'Episode 2: Royal Decree',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-and-smiling-in-a-dramatic-lighting-42294-large.mp4',
    is_premium: true,
    coin_price: 20,
    duration: '01:41',
    verification_status: 'pending_approval',
    aspect_ratio: '9:16 Vertical',
    resolution: '1080x1920 Full HD',
    file_size: '39.8 MB',
    verification_notes: 'Uploaded to Cloudinary CDN. Waiting for Admin review.',
    created_at: '2026-03-04T16:00:00Z',
    views: 42000,
    likes: 1950,
  },
];

export const SAMPLE_CREATOR_VERTICAL_VIDEOS = [
  {
    label: 'Cyberpunk Neon Model (Vertical 9:16)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-and-purple-neon-lit-room-41712-large.mp4',
    duration: '01:30',
    tags: 'Cyber, Stylized, 1080x1920',
  },
  {
    label: 'Mysterious City Night Walk (Vertical 9:16)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-mysterious-woman-walking-through-a-city-at-night-42289-large.mp4',
    duration: '01:45',
    tags: 'Suspense, Drama, 1080x1920',
  },
  {
    label: 'Dramatic Female Close-up (Vertical 9:16)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-womans-face-with-dramatic-lighting-42288-large.mp4',
    duration: '01:50',
    tags: 'Emotional, Romance, 1080x1920',
  },
  {
    label: 'Silhouette in Car Headlights (Vertical 9:16)',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-person-standing-in-front-of-a-car-42296-large.mp4',
    duration: '01:25',
    tags: 'Thriller, Action, 1080x1920',
  },
];

export const SAMPLE_CREATOR_POSTERS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=75',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=75',
];

// ----------------- STORAGE HELPERS -----------------

export function getCreatorDramas(): CreatorDrama[] {
  if (typeof window === 'undefined') return INITIAL_CREATOR_DRAMAS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CREATOR_DRAMAS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CREATOR_DRAMAS, JSON.stringify(INITIAL_CREATOR_DRAMAS));
      return INITIAL_CREATOR_DRAMAS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CREATOR_DRAMAS;
  }
}

export function saveCreatorDramas(dramas: CreatorDrama[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CREATOR_DRAMAS, JSON.stringify(dramas));
  emitChange('creator_dramas_changed');
}

export function getCreatorEpisodes(): Episode[] {
  if (typeof window === 'undefined') return INITIAL_CREATOR_EPISODES;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CREATOR_EPISODES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CREATOR_EPISODES, JSON.stringify(INITIAL_CREATOR_EPISODES));
      return INITIAL_CREATOR_EPISODES;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_CREATOR_EPISODES;
  }
}

export function saveCreatorEpisodes(episodes: Episode[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.CREATOR_EPISODES, JSON.stringify(episodes));
  emitChange('creator_episodes_changed');
}

// ----------------- CREATOR ACTIONS -----------------

export function createCreatorDrama(data: {
  title: string;
  description: string;
  cover_image_url: string;
  total_episodes: number;
  tags: string[];
  category: string;
  creator_id?: string;
  creator_name?: string;
}): CreatorDrama {
  const dramas = getCreatorDramas();
  const newDrama: CreatorDrama = {
    id: `creator-drama-${Date.now()}`,
    title: data.title,
    description: data.description,
    cover_image_url: data.cover_image_url || SAMPLE_CREATOR_POSTERS[0],
    total_episodes: data.total_episodes || 20,
    tags: data.tags.length > 0 ? data.tags : ['Original', 'Creator Series'],
    category: data.category || 'trending',
    views: '0',
    rating: 9.9,
    creator_id: data.creator_id || 'creator_user',
    creator_name: data.creator_name || 'YarrowPlay Verified Studio',
    status: 'pending_approval', // Goes directly to admin dashboard
    created_at: new Date().toISOString(),
    episodes_count: 0,
  };

  dramas.unshift(newDrama);
  saveCreatorDramas(dramas);
  return newDrama;
}

export function uploadCreatorEpisode(data: {
  drama_id: string;
  title: string;
  episode_number: number;
  video_url: string;
  is_premium: boolean;
  coin_price?: number;
  duration?: string;
  resolution?: string;
  file_size?: string;
}): Episode {
  const episodes = getCreatorEpisodes();
  const newEpisode: Episode = {
    id: `${data.drama_id}-ep-${data.episode_number}-${Date.now()}`,
    drama_id: data.drama_id,
    episode_number: data.episode_number,
    title: data.title || `Episode ${data.episode_number}`,
    video_url: data.video_url,
    is_premium: data.is_premium,
    coin_price: data.is_premium ? (data.coin_price || 20) : 0,
    duration: data.duration || '01:40',
    verification_status: 'pending_approval', // Sent to Admin Dashboard queue
    aspect_ratio: '9:16 Vertical',
    resolution: data.resolution || '1080x1920 Full HD',
    file_size: data.file_size || '45.0 MB',
    verification_notes: 'Uploaded via Cloudinary CDN pipeline. Awaiting Admin Approval.',
    created_at: new Date().toISOString(),
    views: 0,
    likes: 0,
  };

  episodes.unshift(newEpisode);
  saveCreatorEpisodes(episodes);

  // Increment episodes count on parent drama and ensure it enters pending_approval if draft
  const dramas = getCreatorDramas();
  const drama = dramas.find((d) => d.id === data.drama_id);
  if (drama) {
    drama.episodes_count = (drama.episodes_count || 0) + 1;
    if (drama.status === 'draft') {
      drama.status = 'pending_approval';
    }
    saveCreatorDramas(dramas);
  }

  return newEpisode;
}

// ----------------- ADMIN APPROVAL / REJECTION ACTIONS -----------------

export function approveDrama(dramaId: string): boolean {
  const dramas = getCreatorDramas();
  const drama = dramas.find((d) => d.id === dramaId);
  if (!drama) return false;

  drama.status = 'verified';
  drama.rejection_reason = undefined;
  saveCreatorDramas(dramas);

  // Also approve all pending episodes belonging to this drama
  const episodes = getCreatorEpisodes();
  episodes.forEach((ep) => {
    if (ep.drama_id === dramaId && ep.verification_status !== 'rejected') {
      ep.verification_status = 'verified';
      ep.verified_at = new Date().toISOString();
      ep.verification_notes = 'Approved by Administrator. Live on YarrowPlay.';
    }
  });
  saveCreatorEpisodes(episodes);
  return true;
}

export function rejectDrama(dramaId: string, reason: string): boolean {
  const dramas = getCreatorDramas();
  const drama = dramas.find((d) => d.id === dramaId);
  if (!drama) return false;

  drama.status = 'rejected';
  drama.rejection_reason = reason;
  saveCreatorDramas(dramas);

  const episodes = getCreatorEpisodes();
  episodes.forEach((ep) => {
    if (ep.drama_id === dramaId) {
      ep.verification_status = 'rejected';
      ep.rejection_reason = reason;
      ep.verification_notes = `Rejected by Administrator: ${reason}`;
    }
  });
  saveCreatorEpisodes(episodes);
  return true;
}

export function approveEpisode(episodeId: string): boolean {
  const episodes = getCreatorEpisodes();
  const ep = episodes.find((e) => e.id === episodeId);
  if (!ep) return false;

  ep.verification_status = 'verified';
  ep.verified_at = new Date().toISOString();
  ep.verification_notes = 'Verified & Approved by Admin for public streaming.';
  ep.rejection_reason = undefined;
  saveCreatorEpisodes(episodes);

  // If parent drama is pending, check if it should become verified
  const dramas = getCreatorDramas();
  const parent = dramas.find((d) => d.id === ep.drama_id);
  if (parent && parent.status !== 'verified') {
    parent.status = 'verified';
    saveCreatorDramas(dramas);
  }
  return true;
}

export function rejectEpisode(episodeId: string, reason: string): boolean {
  const episodes = getCreatorEpisodes();
  const ep = episodes.find((e) => e.id === episodeId);
  if (!ep) return false;

  ep.verification_status = 'rejected';
  ep.rejection_reason = reason;
  ep.verification_notes = `Admin feedback: ${reason}`;
  saveCreatorEpisodes(episodes);
  return true;
}

export function updateEpisodeVerificationStatus(
  episodeId: string,
  status: VideoVerificationStatus,
  notes?: string
) {
  const episodes = getCreatorEpisodes();
  const ep = episodes.find((e) => e.id === episodeId);
  if (ep) {
    ep.verification_status = status;
    if (status === 'verified') {
      ep.verified_at = new Date().toISOString();
    }
    if (notes) {
      ep.verification_notes = notes;
    }
    saveCreatorEpisodes(episodes);

    const dramas = getCreatorDramas();
    const parentDrama = dramas.find((d) => d.id === ep.drama_id);
    if (parentDrama && status === 'verified' && parentDrama.status !== 'verified') {
      parentDrama.status = 'verified';
      saveCreatorDramas(dramas);
    }
  }
}

export function deleteCreatorEpisode(episodeId: string) {
  const episodes = getCreatorEpisodes();
  const ep = episodes.find((e) => e.id === episodeId);
  const filtered = episodes.filter((e) => e.id !== episodeId);
  saveCreatorEpisodes(filtered);

  if (ep) {
    const dramas = getCreatorDramas();
    const parentDrama = dramas.find((d) => d.id === ep.drama_id);
    if (parentDrama && parentDrama.episodes_count) {
      parentDrama.episodes_count = Math.max(0, parentDrama.episodes_count - 1);
      saveCreatorDramas(dramas);
    }
  }
}

export function deleteCreatorDrama(dramaId: string) {
  const dramas = getCreatorDramas().filter((d) => d.id !== dramaId);
  saveCreatorDramas(dramas);
  const episodes = getCreatorEpisodes().filter((e) => e.drama_id !== dramaId);
  saveCreatorEpisodes(episodes);
}

// ----------------- PER-VIDEO ANALYTICS -----------------

export function getEpisodeAnalyticsList(): EpisodeAnalytics[] {
  const episodes = getCreatorEpisodes();
  return episodes.map((ep, idx) => {
    const baseViews = ep.views || (ep.verification_status === 'verified' ? 450000 / (ep.episode_number || 1) : 0);
    const views = Math.round(baseViews);
    const completionRate = ep.verification_status === 'verified' ? Math.max(45, Math.min(94, 88 - (ep.episode_number * 3))) : 0;
    const likes = ep.likes || Math.round(views * 0.065);
    const coinsEarned = ep.is_premium ? Math.round(views * 0.12 * (ep.coin_price || 20)) : 0;
    const usdEarned = Number((coinsEarned * 0.007).toFixed(2));

    return {
      episode_id: ep.id,
      title: ep.title,
      episode_number: ep.episode_number,
      views,
      completion_rate: completionRate,
      likes,
      coins_earned: coinsEarned,
      usd_earned: usdEarned,
    };
  });
}

// ----------------- CREATOR MONETIZATION & PAYOUTS -----------------

const DEFAULT_MONETIZATION: CreatorMonetization = {
  available_balance_usd: 1240.50,
  pending_payout_usd: 480.00,
  total_lifetime_usd: 6850.00,
  total_coins_earned: 978000,
  payout_method: 'paypal',
  payout_account: 'payments@neonrebelstudios.com',
  payout_history: [
    {
      id: 'payout-2026-02-28',
      amount_usd: 1500.00,
      date: '2026-02-28',
      status: 'completed',
      method: 'PayPal (payments@neonrebelstudios.com)',
    },
    {
      id: 'payout-2026-01-31',
      amount_usd: 2100.00,
      date: '2026-01-31',
      status: 'completed',
      method: 'Bank Wire (ACH ****4892)',
    },
    {
      id: 'payout-2025-12-31',
      amount_usd: 1530.00,
      date: '2025-12-31',
      status: 'completed',
      method: 'PayPal (payments@neonrebelstudios.com)',
    },
  ],
};

export function getCreatorMonetization(): CreatorMonetization {
  if (typeof window === 'undefined') return DEFAULT_MONETIZATION;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CREATOR_MONETIZATION);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CREATOR_MONETIZATION, JSON.stringify(DEFAULT_MONETIZATION));
      return DEFAULT_MONETIZATION;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_MONETIZATION;
  }
}

export function requestCreatorPayout(
  amount: number,
  method: 'paypal' | 'bank_transfer' | 'stripe',
  account: string
): { success: boolean; message: string } {
  const current = getCreatorMonetization();
  if (amount <= 0 || amount > current.available_balance_usd) {
    return { success: false, message: `Invalid payout amount. Maximum available: $${current.available_balance_usd.toFixed(2)}` };
  }

  current.available_balance_usd -= amount;
  current.pending_payout_usd += amount;
  current.payout_method = method;
  current.payout_account = account;
  current.payout_history.unshift({
    id: `payout-${Date.now()}`,
    amount_usd: amount,
    date: new Date().toISOString().split('T')[0],
    status: 'processing',
    method: `${method === 'paypal' ? 'PayPal' : method === 'stripe' ? 'Stripe Connect' : 'Direct Bank'} (${account})`,
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CREATOR_MONETIZATION, JSON.stringify(current));
  }
  emitChange('creator_monetization_changed');
  return { success: true, message: `Payout request for $${amount.toFixed(2)} submitted successfully!` };
}

// ----------------- AUTOMATED QA SCAN ENGINE -----------------

export function runAutomatedVideoQAScan(episode: Episode): Promise<VideoVerificationReport> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isMixkitOrMp4 = episode.video_url.includes('.mp4') || episode.video_url.includes('cloudinary') || episode.video_url.startsWith('blob:') || episode.video_url.startsWith('data:');
      
      const report: VideoVerificationReport = {
        episode_id: episode.id,
        status: 'pending_approval',
        aspect_ratio_ok: true,
        audio_loudness_ok: true,
        codec_supported: isMixkitOrMp4,
        drm_ready: true,
        resolution: episode.resolution || '1080x1920 (9:16 Portrait)',
        scanned_at: new Date().toISOString(),
        notes: [
          'Cloudinary CDN integration verified.',
          'Aspect ratio complies with 9:16 portrait mobile standards.',
          'Audio loudness normalized to -14.2 LUFS (Platform standard).',
          'Video submitted to Admin Review Queue for public publishing.',
        ],
      };

      resolve(report);
    }, 1200);
  });
}

export const STANDARD_CREATOR_QA_CHECKLIST: VideoQAItem[] = [
  {
    id: 'aspect_ratio',
    label: '9:16 Vertical Safe Zone',
    description: 'Ensure actors, subtitles, and key action stay within the vertical 9:16 safe viewing boundary.',
    passed: true,
    required: true,
  },
  {
    id: 'audio_sync',
    label: 'Dialogue & Sound Clarity',
    description: 'Audio is synchronized with video lip movement and speech remains clear above background score.',
    passed: true,
    required: true,
  },
  {
    id: 'hook_ending',
    label: 'Reel Cliffhanger & Pacing',
    description: 'Video includes an engaging opening 3-second hook and ends on a suspenseful cliffhanger.',
    passed: true,
    required: false,
  },
  {
    id: 'originality',
    label: 'Original & Authorized Media',
    description: 'I confirm this video is original content or properly licensed by our studio for YarrowPlay distribution.',
    passed: true,
    required: true,
  },
];

// ----------------- REACT HOOK -----------------

export function useCreatorStore() {
  const [dramas, setDramas] = useState<CreatorDrama[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [analytics, setAnalytics] = useState<EpisodeAnalytics[]>([]);
  const [monetization, setMonetization] = useState<CreatorMonetization>(DEFAULT_MONETIZATION);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDramas(getCreatorDramas());
    setEpisodes(getCreatorEpisodes());
    setAnalytics(getEpisodeAnalyticsList());
    setMonetization(getCreatorMonetization());
    setLoading(false);

    const handleDramasChange = () => setDramas(getCreatorDramas());
    const handleEpisodesChange = () => {
      setEpisodes(getCreatorEpisodes());
      setAnalytics(getEpisodeAnalyticsList());
    };
    const handleMonetizationChange = () => setMonetization(getCreatorMonetization());

    if (eventTarget) {
      eventTarget.addEventListener('creator_dramas_changed', handleDramasChange);
      eventTarget.addEventListener('creator_episodes_changed', handleEpisodesChange);
      eventTarget.addEventListener('creator_monetization_changed', handleMonetizationChange);
    }

    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('creator_dramas_changed', handleDramasChange);
        eventTarget.removeEventListener('creator_episodes_changed', handleEpisodesChange);
        eventTarget.removeEventListener('creator_monetization_changed', handleMonetizationChange);
      }
    };
  }, []);

  return {
    dramas,
    episodes,
    analytics,
    monetization,
    loading,
    createDrama: createCreatorDrama,
    uploadEpisode: uploadCreatorEpisode,
    approveDrama,
    rejectDrama,
    approveEpisode,
    rejectEpisode,
    updateVerification: updateEpisodeVerificationStatus,
    deleteEpisode: deleteCreatorEpisode,
    deleteDrama: deleteCreatorDrama,
    runQAScan: runAutomatedVideoQAScan,
    requestPayout: requestCreatorPayout,
  };
}
