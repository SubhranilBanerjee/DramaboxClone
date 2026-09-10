'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  User,
  ShieldCheck,
  Video,
  Megaphone,
  BookOpen,
  Calendar,
  Sparkles
} from 'lucide-react';
import { getBlogById, toggleLikeBlog, BlogPost } from '@/lib/blogStore';
import { useToast } from '@/components/Toast';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const blogId = params?.id as string;

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (blogId) {
      const found = getBlogById(blogId);
      if (found) {
        setBlog(found);
        setLikes(found.likes_count);
      }
    }
  }, [blogId]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4">
        <BookOpen className="w-12 h-12 text-slate-600 mb-4" />
        <h2 className="text-xl font-bold mb-2">Article Not Found</h2>
        <p className="text-xs text-slate-400 mb-6">The article you are looking for does not exist or has been moved.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog Feed
        </Link>
      </div>
    );
  }

  const handleLike = () => {
    const updated = toggleLikeBlog(blog.id);
    setLikes(updated);
    showToast('Liked this article!', 'success');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'info');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-purple-400" /> Admin
          </span>
        );
      case 'creator':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full">
            <Video className="w-3 h-3 text-pink-400" /> Creator
          </span>
        );
      case 'advertiser':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
            <Megaphone className="w-3 h-3 text-amber-400" /> Advertiser
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
            <User className="w-3 h-3 text-cyan-400" /> Community Viewer
          </span>
        );
    }
  };

  return (
    <article className="min-h-screen bg-[#09090b] text-white pb-20">
      {/* Top Header */}
      <div className="border-b border-[#201a3b] bg-[#0d0a1c]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All Articles
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 bg-rose-950/40 border border-rose-500/40 hover:border-rose-400 text-rose-300 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              <span>{likes}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-[#17122e] border border-[#2b2255] hover:border-cyan-400 text-slate-300 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-pink-600/90 text-white px-3 py-0.5 rounded-full uppercase tracking-wider">
              {blog.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {blog.read_time}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
            {blog.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            {blog.excerpt}
          </p>

          {/* Author Card */}
          <div className="flex items-center justify-between py-4 border-y border-[#201a3b]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(255,42,141,0.5)]">
                {blog.author_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{blog.author_name}</span>
                  {getRoleBadge(blog.author_role)}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  Published {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#261f49] shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4 pt-4">
          {blog.content}
        </div>

        {/* Tags */}
        <div className="pt-8 border-t border-[#201a3b] flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Topics:</span>
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-[#141028] border border-[#271f4e] text-cyan-300 px-3 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="mt-10 p-5 sm:p-7 rounded-2xl bg-[#151515] border border-[#292929] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 justify-center sm:justify-start">
              <Sparkles className="w-4 h-4 text-[#FF007A]" /> Have a story or analysis to share?
            </h3>
            <p className="text-xs text-[#8F8F98]">
              Join thousands of vertical filmmakers and screenwriters contributing to YarrowPlay.
            </p>
          </div>
          <Link
            href="/blog"
            className="bg-[#FF007A] hover:bg-[#E6006E] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-[0_4px_16px_rgba(255,0,122,0.35)] transition-all whitespace-nowrap"
          >
            Write a Story
          </Link>
        </div>
      </div>
    </article>
  );
}
