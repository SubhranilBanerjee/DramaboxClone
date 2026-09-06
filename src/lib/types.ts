export type UserRole = 'viewer' | 'creator';

export interface Profile {
  id: string;
  username: string;
  coin_balance: number;
  role?: UserRole;
  studio_name?: string;
  channel_handle?: string;
  creator_category?: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface Drama {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  total_episodes: number;
  tags: string[];
  created_at?: string;
  category?: 'trending' | 'romance' | 'revenge' | 'suspense' | 'costume' | 'action' | 'scifi' | string;
  views?: string;
  rating?: number;
  creator_id?: string;
  creator_name?: string;
}

export type VideoVerificationStatus = 'draft' | 'pending_verification' | 'verified' | 'rejected';

export interface Episode {
  id: string;
  drama_id: string;
  episode_number: number;
  title: string;
  video_url: string;
  is_premium: boolean;
  duration?: string;
  created_at?: string;
  verification_status?: VideoVerificationStatus;
  aspect_ratio?: string;
  resolution?: string;
  file_size?: string;
  verification_notes?: string;
  verified_at?: string;
  coin_price?: number;
}

export interface CreatorDrama extends Drama {
  creator_id: string;
  creator_name: string;
  status: 'draft' | 'pending_verification' | 'verified';
  episodes_count?: number;
}

export interface VideoQAItem {
  id: string;
  label: string;
  description: string;
  passed: boolean;
  required: boolean;
}

export interface VideoVerificationReport {
  episode_id: string;
  status: VideoVerificationStatus;
  aspect_ratio_ok: boolean;
  audio_loudness_ok: boolean;
  codec_supported: boolean;
  drm_ready: boolean;
  resolution: string;
  scanned_at: string;
  notes: string[];
}

export interface UserUnlock {
  id: string;
  user_id: string;
  episode_id: string;
  created_at?: string;
}

