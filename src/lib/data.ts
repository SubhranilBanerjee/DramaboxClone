import { Drama, Episode } from './types';

// High-reliability public vertical video feeds (mixkit royalty-free vertical video previews)
const SAMPLE_VIDEOS = [
  'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-pink-and-purple-neon-lit-room-41712-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-mysterious-woman-walking-through-a-city-at-night-42289-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-womans-face-with-dramatic-lighting-42288-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-young-man-walking-alone-at-night-down-a-dark-street-41743-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-person-standing-in-front-of-a-car-42296-large.mp4',
  'https://assets.mixkit.co/videos/preview/mixkit-woman-turning-around-and-smiling-in-a-dramatic-lighting-42294-large.mp4',
];

export const INITIAL_DRAMAS: Drama[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    title: "The Billionaire's Secret Heir",
    description: "Five years after being betrayed and cast out into the streets penniless, Lucas returns in disguise as the world's most feared empire CEO. His mission: reclaim his family's lost honor and win back the only woman who believed in him before the world turned cold.",
    cover_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    total_episodes: 24,
    tags: ['Billionaire', 'Revenge', 'Secret Identity', 'Romance'],
    category: 'trending',
    views: '12.8M',
    rating: 9.8,
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    title: 'Revenge of the Discarded Heiress',
    description: "Cast aside by her arrogant fiancé on their wedding eve for her scheming step-sister, Elena reveals her true identity as the anonymous sovereign investor controlling the city's largest conglomerate. Every person who stepped on her must now beg for mercy.",
    cover_image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    total_episodes: 20,
    tags: ['Revenge', 'Strong Female Lead', 'High Society', 'Drama'],
    category: 'revenge',
    views: '9.4M',
    rating: 9.7,
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    title: "CEO's Hidden Contract Bride",
    description: "To save her family's failing apothecary, gentle botanist Clara enters into an ironclad 100-day marriage contract with Alexander Vance, the notoriously cold biotech titan. But when his dark past resurfaces, their fake romance becomes fatally real.",
    cover_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    total_episodes: 22,
    tags: ['Contract Marriage', 'Enemies to Lovers', 'CEO', 'Romance'],
    category: 'romance',
    views: '15.1M',
    rating: 9.9,
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    title: 'Midnight Whispers: Shadows of Greed',
    description: "An elite undercover investigative operative infiltrates the masked high-roller gala of the notorious Blackwood Syndicate, only to discover the cartel's mysterious shadow leader is the childhood sweetheart she thought died a decade ago.",
    cover_image_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    total_episodes: 18,
    tags: ['Suspense', 'Mystery', 'Forbidden Love', 'Thriller'],
    category: 'suspense',
    views: '7.6M',
    rating: 9.6,
  },
  {
    id: 'e5555555-5555-5555-5555-555555555555',
    title: 'The Phoenix Empress Returns',
    description: "Poisoned on the night of her coronation by a treacherous court minister, Warrior Princess Lin wakes up ten years earlier with all her memories intact. Armed with royal foresight and legendary swordcraft, the throne will be hers once more.",
    cover_image_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80',
    total_episodes: 30,
    tags: ['Historical', 'Empress', 'Reincarnation', 'Action'],
    category: 'trending',
    views: '11.2M',
    rating: 9.7,
  },
  {
    id: 'f6666666-6666-6666-6666-666666666666',
    title: 'Double Life: The Undercover Doctor',
    description: "By day he is an underpaid emergency room resident facing condescending surgeons; by night, he is the untouchable martial prodigy sought after by world leaders, quietly guarding the single mother who saved his life as a boy.",
    cover_image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    total_episodes: 20,
    tags: ['Action', 'Medical', 'Protector', 'Suspense'],
    category: 'suspense',
    views: '8.3M',
    rating: 9.5,
  },
  {
    id: 'g7777777-7777-7777-7777-777777777777',
    title: 'The Mistaken Royal Proposal',
    description: "When a coffee barista accidentally spills tea on the reclusive Duke of Kensington at a high-fashion pop-up, a media frenzy forces them to stage an engagement that might just turn into high society's romance of the decade.",
    cover_image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    total_episodes: 25,
    tags: ['Royalty', 'Fake Dating', 'Romance', 'Comedy'],
    category: 'romance',
    views: '6.9M',
    rating: 9.4,
  },
  {
    id: 'h8888888-8888-8888-8888-888888888888',
    title: 'The Silent Wolf of Wall Street',
    description: "Branded a fraud and stripped of his license, genius quant trader Damian builds a clandestine offshore fund to dismantle the corrupt hedge fund syndicate that framed his father.",
    cover_image_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
    total_episodes: 20,
    tags: ['Revenge', 'Financial', 'Genius', 'Drama'],
    category: 'revenge',
    views: '10.5M',
    rating: 9.8,
  }
];

import { getCreatorDramas, getCreatorEpisodes } from './creatorStore';

// Helper to generate episode records for a drama (episodes 1-5 free, 6+ premium)
export function generateEpisodesForDrama(drama: Drama): Episode[] {
  // Check if creator uploaded custom episodes for this drama
  const customEpisodes = getCreatorEpisodes().filter((e) => e.drama_id === drama.id);
  if (customEpisodes.length > 0) {
    return [...customEpisodes].sort((a, b) => a.episode_number - b.episode_number);
  }

  const episodes: Episode[] = [];
  const titles = [
    'The Humiliation at the Gala',
    'Unexpected Encounter',
    'A Mask That Slips',
    'A Contract Signed in Silence',
    'The Truth Behind the Tears',
    'A Storm Gathers in the Dark',
    'The Billionaire Strikes Back',
    'Whispers in the Rain',
    'The False Accusation',
    'Unveiling the Hidden Will',
    'A Stolen Heart',
    'The Rival Appears',
    'Betrayal in the Boardroom',
    'The Midnight Rescue',
    'Tears of the Heiress',
    'A Secret No Longer Kept',
    'The Alliance of Convenience',
    'Facing the Past',
    'Redemption at Sunrise',
    'The Final Retribution',
    'A New Dynasty Begins',
    'The Grand Revelations',
    'Vows Kept in Secret',
    'Everlasting Reign',
    'Epilogue: Peace Restored'
  ];

  for (let i = 1; i <= drama.total_episodes; i++) {
    const videoIndex = (i - 1) % SAMPLE_VIDEOS.length;
    episodes.push({
      id: `${drama.id}-ep-${i}`,
      drama_id: drama.id,
      episode_number: i,
      title: titles[i - 1] || `Chapter ${i}: The Turning Point`,
      video_url: SAMPLE_VIDEOS[videoIndex],
      is_premium: i > 5, // First 5 episodes are free, 6+ are premium
      duration: '01:45',
    });
  }

  return episodes;
}

export function getDramaById(id: string): Drama | undefined {
  const defaultDrama = INITIAL_DRAMAS.find((d) => d.id === id);
  if (defaultDrama) return defaultDrama;
  const creatorDramas = getCreatorDramas();
  return creatorDramas.find((d) => d.id === id);
}

export function getAllDramas(): Drama[] {
  const creatorDramas = getCreatorDramas().filter((d) => d.status === 'verified');
  return [...INITIAL_DRAMAS, ...creatorDramas];
}

