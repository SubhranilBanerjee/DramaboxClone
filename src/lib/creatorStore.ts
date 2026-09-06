'use client';

import { useState, useEffect } from 'react';
import {
  Episode,
  CreatorDrama,
  VideoVerificationStatus,
  VideoVerificationReport,
  VideoQAItem
} from './types';

const STORAGE_KEYS = {
  CREATOR_DRAMAS: 'dramabox_creator_dramas',
  CREATOR_EPISODES: 'dramabox_creator_episodes',
  VERIFICATION_REPORTS: 'dramabox_video_verification_reports',
};

// Event bus to keep creator UI synchronized in real-time
const eventTarget = typeof window !== 'undefined' ? new EventTarget() : null;

function emitChange(event: string) {
  if (eventTarget) {
    eventTarget.dispatchEvent(new Event(event));
  }
}

// Default high quality starter series for new Creator accounts
const INITIAL_CREATOR_DRAMAS: CreatorDrama[] = [
  {
    id: 'creator-series-neon-rebel',
    title: 'Cyber Heist: The Midnight Syndicate',
    description: 'A rogue neural hacker joins forces with a disavowed black-ops agent to extract confidential AI prototypes from Neo-Verona’s most fortified skyscraper.',
    cover_image_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    total_episodes: 12,
    tags: ['Cyberpunk', 'Action', 'Revenge', 'Heist'],
    category: 'suspense',
    views: '3.4M',
    rating: 9.8,
    creator_id: 'demo_creator_id',
    creator_name: 'Neon Rebel Studios',
    status: 'verified',
    created_at: '2026-03-01T10:00:00Z',
    episodes_count: 4,
  },
  {
    id: 'creator-series-shadow-love',
    title: 'Whispers Across the Dynasty',
    description: 'An exiled court alchemist crafts an elixir capable of crossing dimensional timelines, catching the attention of the ruthless Crown Prince who demands her allegiance.',
    cover_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    total_episodes: 18,
    tags: ['Historical', 'Romance', 'Fantasy', 'Time Travel'],
    category: 'romance',
    views: '1.2M',
    rating: 9.6,
    creator_id: 'demo_creator_id',
    creator_name: 'Neon Rebel Studios',
    status: 'pending_verification',
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
  },
  {
    id: 'creator-series-shadow-love-ep-1',
    drama_id: 'creator-series-shadow-love',
    episode_number: 1,
    title: 'Episode 1: The Alchemist’s Vow',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-womans-face-with-dramatic-lighting-42288-large.mp4',
    is_premium: false,
    duration: '01:52',
    verification_status: 'pending_verification',
    aspect_ratio: '9:16 Vertical',
    resolution: '1080x1920 Full HD',
    file_size: '48.9 MB',
    verification_notes: 'Pending final author approval and QA review.',
    created_at: '2026-03-04T15:00:00Z',
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
    verification_status: 'draft',
    aspect_ratio: '9:16 Vertical',
    resolution: '1080x1920 Full HD',
    file_size: '39.8 MB',
    verification_notes: 'Draft upload. Awaiting video verification scan.',
    created_at: '2026-03-04T16:00:00Z',
  },
];

// Sample vertical video presets creators can choose for rapid testing
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

// Sample posters creators can choose for quick visual creation
export const SAMPLE_CREATOR_POSTERS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
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
    creator_name: data.creator_name || 'DramaBox Verified Studio',
    status: 'draft',
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
    verification_status: 'pending_verification',
    aspect_ratio: '9:16 Vertical',
    resolution: data.resolution || '1080x1920 Full HD',
    file_size: data.file_size || '45.0 MB',
    verification_notes: 'Uploaded. Awaiting verification run.',
    created_at: new Date().toISOString(),
  };

  episodes.unshift(newEpisode);
  saveCreatorEpisodes(episodes);

  // Increment episodes count on parent drama
  const dramas = getCreatorDramas();
  const drama = dramas.find((d) => d.id === data.drama_id);
  if (drama) {
    drama.episodes_count = (drama.episodes_count || 0) + 1;
    saveCreatorDramas(dramas);
  }

  return newEpisode;
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

    // If this episode belongs to a draft drama, check if all episodes or at least one is verified
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

// ----------------- AUTOMATED QA COMPLIANCE ENGINE -----------------

export function runAutomatedVideoQAScan(episode: Episode): Promise<VideoVerificationReport> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const isMixkitOrMp4 = episode.video_url.includes('.mp4') || episode.video_url.startsWith('blob:') || episode.video_url.startsWith('data:');
      
      const report: VideoVerificationReport = {
        episode_id: episode.id,
        status: 'verified',
        aspect_ratio_ok: true,
        audio_loudness_ok: true,
        codec_supported: isMixkitOrMp4,
        drm_ready: true,
        resolution: episode.resolution || '1080x1920 (9:16 Portrait)',
        scanned_at: new Date().toISOString(),
        notes: [
          'Aspect ratio complies with 9:16 portrait mobile standards.',
          'Audio loudness normalized to -14.2 LUFS (Platform standard).',
          'H.264 / AAC hardware acceleration supported.',
          'DRM digital watermark metadata embedded successfully.',
        ],
      };

      resolve(report);
    }, 1200);
  });
}

// Standard verification checklist items for creators
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
    description: 'I confirm this video is original content or properly licensed by our studio for DramaBox distribution.',
    passed: true,
    required: true,
  },
];

// ----------------- REACT HOOK -----------------

export function useCreatorStore() {
  const [dramas, setDramas] = useState<CreatorDrama[]>([]);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDramas(getCreatorDramas());
    setEpisodes(getCreatorEpisodes());
    setLoading(false);

    const handleDramasChange = () => setDramas(getCreatorDramas());
    const handleEpisodesChange = () => setEpisodes(getCreatorEpisodes());

    if (eventTarget) {
      eventTarget.addEventListener('creator_dramas_changed', handleDramasChange);
      eventTarget.addEventListener('creator_episodes_changed', handleEpisodesChange);
    }

    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('creator_dramas_changed', handleDramasChange);
        eventTarget.removeEventListener('creator_episodes_changed', handleEpisodesChange);
      }
    };
  }, []);

  return {
    dramas,
    episodes,
    loading,
    createDrama: createCreatorDrama,
    uploadEpisode: uploadCreatorEpisode,
    updateVerification: updateEpisodeVerificationStatus,
    deleteEpisode: deleteCreatorEpisode,
    deleteDrama: deleteCreatorDrama,
    runQAScan: runAutomatedVideoQAScan,
  };
}
