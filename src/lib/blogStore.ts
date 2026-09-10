'use client';

import { useState, useEffect } from 'react';
import { UserRole } from './types';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: 'Production Insights' | 'Behind The Scenes' | 'Reviews' | 'Creator Tips' | 'Industry Trends';
  tags: string[];
  author_id: string;
  author_name: string;
  author_role: UserRole;
  read_time: string;
  likes_count: number;
  created_at: string;
}

const STORAGE_KEY = 'yarrowplay_blogs';

const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How Vertical 9:16 Cinema is Rewriting Streaming in 2026',
    slug: 'vertical-cinema-revolution-2026',
    excerpt: 'Hollywood directors are pivoting to vertical cinematography. Learn how mobile-first aspect ratios create unprecedented audience intimacy and 90%+ completion rates.',
    content: `Vertical video was once considered a novelty restricted to casual social media feeds. Today, it represents the fastest-growing frontier in global entertainment production.

### The Physics of Intimacy
When a viewer holds their smartphone in vertical orientation, the frame fills their entire field of vision without horizontal dead space. Eye-tracking analytics reveal that viewers maintain 3.2x higher emotional engagement during vertical close-ups compared to conventional widescreen ratios.

### Cinematography Secrets for 9:16
1. **Vertical Composition Triads**: Instead of horizontal symmetry, place primary emotional focal points in the upper-third vertical safe zone.
2. **Dynamic Pacing**: Every vertical reel must trigger a high-stakes dramatic revelation within the first 3.5 seconds.
3. **Audio Mastering**: Mobile phone stereo speakers necessitate dialogue normalization centered between -14 and -16 LUFS.

At YarrowPlay, our Cloudinary-powered CDN pipeline encodes vertical reels in multi-bitrate H.264 / AV1 streams, ensuring instant playback on 5G mobile networks worldwide.`,
    cover_image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    category: 'Production Insights',
    tags: ['Cinematography', 'MobileStreaming', 'Innovation'],
    author_id: 'creator_demo_id',
    author_name: 'Elena Rostova (Neon Rebel Studios)',
    author_role: 'creator',
    read_time: '4 min read',
    likes_count: 342,
    created_at: '2026-03-05T10:00:00Z',
  },
  {
    id: 'blog-2',
    title: 'The 3-Second Rule: Crafting Unskippable Micro-Drama Hooks',
    slug: 'three-second-rule-micro-drama-hooks',
    excerpt: 'The anatomy of viral cliffhangers: Breakdowns of opening scenes that drove over 10 million episode unlocks in our highest-grossing romance and revenge dramas.',
    content: `In standard feature filmmaking, a screenwriter has 10 pages to establish the world. In the vertical reel economy, you have exactly three seconds.

### Anatomy of an Unskippable Opening
- **Visual Contrast**: Immediate high-contrast lighting (neon backlights, shattering glass, a torn marriage contract).
- **Dialogue with Stakes**: Avoid greeting or filler conversation. Open *in media res* with high-stake ultimatums.
- **The Micro-Cliffhanger**: Always end every 90-second chapter on an unresolved moral question or shocking plot twist.

Creators who implement this formula consistently report an 80%+ episode 1-to-2 conversion rate, leading to superior coin monetization across the platform.`,
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    category: 'Creator Tips',
    tags: ['Screenwriting', 'Storytelling', 'Monetization'],
    author_id: 'admin_primary_id',
    author_name: 'YarrowPlay Editorial Team',
    author_role: 'admin',
    read_time: '3 min read',
    likes_count: 512,
    created_at: '2026-03-03T14:20:00Z',
  },
  {
    id: 'blog-3',
    title: 'Why Advertisers & Brands are Flocking to Sponsored Micro-Series',
    slug: 'advertisers-sponsoring-vertical-dramas',
    excerpt: 'How global brands are replacing traditional 30-second skippable ads with seamless product placements and branded vertical reel storylines.',
    content: `Consumer ad-blindness has made traditional pre-roll and mid-roll commercials obsolete. In contrast, branded storylines woven directly into vertical dramas yield a 4.8x higher brand recall rate.

Through the new YarrowPlay Advertiser Vendor Portal, brands can sponsor specific genres—such as high-fashion romance or luxury automotive thrillers—ensuring direct exposure to millions of daily engaged streamers without interrupting the cinematic experience.`,
    cover_image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    category: 'Industry Trends',
    tags: ['Advertising', 'Brands', 'Sponsorship'],
    author_id: 'advertiser_demo_id',
    author_name: 'Marcus Vance (Apex Global Media)',
    author_role: 'advertiser',
    read_time: '5 min read',
    likes_count: 289,
    created_at: '2026-03-02T11:45:00Z',
  },
];

const eventTarget = typeof window !== 'undefined' ? new EventTarget() : null;

export function getBlogs(): BlogPost[] {
  if (typeof window === 'undefined') return INITIAL_BLOGS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BLOGS));
      return INITIAL_BLOGS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_BLOGS;
  }
}

export function saveBlogs(blogs: BlogPost[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
  if (eventTarget) {
    eventTarget.dispatchEvent(new Event('blogs_changed'));
  }
}

export function getBlogById(idOrSlug: string): BlogPost | undefined {
  const blogs = getBlogs();
  return blogs.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
}

export function createBlogPost(post: {
  title: string;
  excerpt: string;
  content: string;
  category: BlogPost['category'];
  cover_image?: string;
  tags?: string[];
  author_id: string;
  author_name: string;
  author_role: UserRole;
}): BlogPost {
  const blogs = getBlogs();
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const words = post.content.split(/\s+/).length;
  const readMinutes = Math.max(1, Math.ceil(words / 180));

  const newPost: BlogPost = {
    id: `blog-${Date.now()}`,
    title: post.title,
    slug: `${slug}-${Date.now().toString(36)}`,
    excerpt: post.excerpt || post.content.slice(0, 160) + '...',
    content: post.content,
    cover_image:
      post.cover_image ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    category: post.category || 'Production Insights',
    tags: post.tags && post.tags.length > 0 ? post.tags : ['YarrowPlay', 'Storytelling'],
    author_id: post.author_id,
    author_name: post.author_name,
    author_role: post.author_role,
    read_time: `${readMinutes} min read`,
    likes_count: 1,
    created_at: new Date().toISOString(),
  };

  blogs.unshift(newPost);
  saveBlogs(blogs);
  return newPost;
}

export function toggleLikeBlog(blogId: string): number {
  const blogs = getBlogs();
  const blog = blogs.find((b) => b.id === blogId);
  if (blog) {
    blog.likes_count = (blog.likes_count || 0) + 1;
    saveBlogs(blogs);
    return blog.likes_count;
  }
  return 0;
}

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBlogs(getBlogs());
    setLoading(false);

    const handleUpdate = () => setBlogs(getBlogs());
    if (eventTarget) {
      eventTarget.addEventListener('blogs_changed', handleUpdate);
    }
    return () => {
      if (eventTarget) {
        eventTarget.removeEventListener('blogs_changed', handleUpdate);
      }
    };
  }, []);

  return {
    blogs,
    loading,
    createPost: createBlogPost,
    likePost: toggleLikeBlog,
  };
}
