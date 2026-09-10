export type UserRole = 'viewer' | 'creator' | 'admin' | 'advertiser';

export interface Profile {
  id: string;
  username: string;
  coin_balance: number;
  role?: UserRole;
  studio_name?: string;
  channel_handle?: string;
  creator_category?: string;
  is_verified?: boolean;
  company_name?: string;
  industry?: string;
  ad_budget?: string;
  contact_phone?: string;
  website_url?: string;
  bio?: string;
  favorite_genres?: string[];
  preferred_language?: string;
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

export type VideoVerificationStatus = 'draft' | 'pending_verification' | 'pending_approval' | 'verified' | 'rejected';

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
  rejection_reason?: string;
  verified_at?: string;
  coin_price?: number;
  views?: number;
  likes?: number;
}

export interface CreatorDrama extends Drama {
  creator_id: string;
  creator_name: string;
  status: 'draft' | 'pending_verification' | 'pending_approval' | 'verified' | 'rejected';
  rejection_reason?: string;
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

export interface EpisodeAnalytics {
  episode_id: string;
  title: string;
  episode_number: number;
  views: number;
  completion_rate: number; // e.g. 78%
  likes: number;
  coins_earned: number;
  usd_earned: number;
}

export interface CreatorMonetization {
  available_balance_usd: number;
  pending_payout_usd: number;
  total_lifetime_usd: number;
  total_coins_earned: number;
  payout_method: 'paypal' | 'bank_transfer' | 'stripe';
  payout_account?: string;
  payout_history: {
    id: string;
    amount_usd: number;
    date: string;
    status: 'completed' | 'processing';
    method: string;
  }[];
}

export interface AdCampaign {
  id: string;
  advertiser_id: string;
  advertiser_name: string;
  company_name: string;
  campaign_name: string;
  target_category: string;
  ad_type: 'video_preroll' | 'in_stream_banner' | 'sponsored_drama';
  budget_total: number;
  budget_spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  media_url?: string;
  status: 'active' | 'scheduled' | 'paused' | 'completed';
  created_at: string;
}
