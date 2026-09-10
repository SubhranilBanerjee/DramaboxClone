'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  PenSquare,
  Sparkles,
  Heart,
  Clock,
  User,
  Search,
  X,
  Image as ImageIcon,
  Tag,
  Share2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Video,
  Megaphone
} from 'lucide-react';
import { useBlogs, BlogPost } from '@/lib/blogStore';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { AuthModal } from '@/components/AuthModal';

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
];

const CATEGORIES: BlogPost['category'][] = [
  'Production Insights',
  'Creator Tips',
  'Industry Trends',
  'Behind The Scenes',
  'Reviews',
];

export default function BlogPage() {
  const { blogs, createPost, likePost } = useBlogs();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<BlogPost['category']>('Production Insights');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0]);
  const [tagsInput, setTagsInput] = useState('VerticalCinema, Directing');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleOpenWrite = () => {
    if (!user) {
      showToast('Please sign in or register to publish a blog post.', 'info');
      setIsAuthModalOpen(true);
      return;
    }
    setIsWriteModalOpen(true);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim() || !content.trim()) {
      showToast('Please provide a title and story content.', 'error');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    createPost({
      title: title.trim(),
      excerpt: excerpt.trim() || content.slice(0, 160) + '...',
      content: content.trim(),
      category: category,
      cover_image: coverImage,
      tags: tags.length > 0 ? tags : ['YarrowPlay'],
      author_id: user.id,
      author_name: user.username || 'YarrowPlay Contributor',
      author_role: user.role || 'viewer',
    });

    showToast('Your story has been published successfully!', 'success');
    setIsWriteModalOpen(false);
    setTitle('');
    setContent('');
    setExcerpt('');
  };

  const handleLike = (blogId: string) => {
    likePost(blogId);
    showToast('Liked this article!', 'success');
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const featuredBlog = blogs[0];

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
            <User className="w-3 h-3 text-cyan-400" /> Viewer
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* ── HEADER & HERO ──────────────────────────────────────────────── */}
      <div className="border-b border-[#201a38] bg-gradient-to-b from-[#141026] to-[#09090b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-[#FF007A]/15 border border-[#FF007A]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#FF007A]">
                <BookOpen className="w-3.5 h-3.5 text-[#FF007A]" />
                YARROWPLAY EDITORIAL & CREATOR STORIES
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
                The Vertical <span className="neon-text-pink">Cinema Gazette</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Discover filmmaking breakdowns, screenwriting secrets, vertical reel trends, and monetization insights written by creators, advertisers, and community members.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={handleOpenWrite}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,42,141,0.5)] hover:shadow-[0_0_30px_rgba(255,42,141,0.8)] transition-all hover:scale-105"
              >
                <PenSquare className="w-4 h-4" />
                <span>Write a Story</span>
              </button>

              {!user && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center justify-center gap-2 border border-slate-700 bg-slate-900/60 hover:border-slate-500 text-slate-300 hover:text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all"
                >
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-6 border-t border-[#1e173d]">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {['All', ...CATEGORIES].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-pink-600 text-white shadow-[0_0_12px_rgba(255,42,141,0.4)]'
                      : 'bg-[#15112a] border border-[#271f4b] text-slate-400 hover:text-white hover:border-slate-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative flex items-center min-w-[240px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, tags, authors..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#120e24] border border-[#271f4b] rounded-full text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-500 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* FEATURED STORY (Only when on 'All' category and no search) */}
        {selectedCategory === 'All' && !searchQuery && featuredBlog && (
          <div className="relative group overflow-hidden rounded-2xl border border-[#291f4f] bg-[#0e0c1c] shadow-[0_0_35px_rgba(168,85,247,0.15)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 h-64 sm:h-96 relative overflow-hidden">
                <img
                  src={featuredBlog.cover_image}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-transparent to-[#0e0c1c]" />
                <span className="absolute top-4 left-4 bg-pink-600/90 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-[0_0_12px_rgba(255,42,141,0.6)]">
                  Featured Story
                </span>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-3">
                  {getRoleBadge(featuredBlog.author_role)}
                  <span className="text-xs text-slate-400 font-medium">
                    {featuredBlog.read_time}
                  </span>
                </div>

                <Link
                  href={`/blog/${featuredBlog.id}`}
                  className="block text-2xl sm:text-3xl font-black text-white hover:text-pink-400 transition-colors leading-tight"
                >
                  {featuredBlog.title}
                </Link>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {featuredBlog.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#231b45]">
                  <div className="text-xs text-slate-400">
                    By <strong className="text-slate-200">{featuredBlog.author_name}</strong>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(featuredBlog.id)}
                      className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors bg-rose-950/30 px-2.5 py-1 rounded-full border border-rose-500/30"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500" />
                      <span>{featuredBlog.likes_count}</span>
                    </button>
                    <Link
                      href={`/blog/${featuredBlog.id}`}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARTICLES GRID */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              {selectedCategory === 'All' ? 'Latest Stories' : `${selectedCategory} Articles`}
              <span className="text-xs font-normal text-slate-400">({filteredBlogs.length})</span>
            </h2>
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-[#2b2255] rounded-2xl bg-[#0e0c1c]">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-bold text-slate-300">No stories found</p>
              <p className="text-xs text-slate-500 mt-1">Be the first to write an article in this topic!</p>
              <button
                onClick={handleOpenWrite}
                className="mt-4 inline-flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
              >
                <PenSquare className="w-3.5 h-3.5" /> Write Story Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="bg-[#0e0c1c] border border-[#261f49] hover:border-pink-500/50 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,42,141,0.2)] hover:-translate-y-1"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-pink-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {blog.category}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        {getRoleBadge(blog.author_role)}
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {blog.read_time}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${blog.id}`}
                        className="block text-base font-bold text-white hover:text-pink-400 transition-colors line-clamp-2"
                      >
                        {blog.title}
                      </Link>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1f193c] flex items-center justify-between text-xs">
                      <span className="text-slate-400 truncate max-w-[140px]">
                        {blog.author_name}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleLike(blog.id)}
                          className="flex items-center gap-1 text-rose-400 hover:text-rose-300 p-1"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500" />
                          <span className="text-[11px] font-semibold">{blog.likes_count}</span>
                        </button>
                        <Link
                          href={`/blog/${blog.id}`}
                          className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
                        >
                          Read &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── WRITE BLOG MODAL / STUDIO ─────────────────────────────────── */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#0d0b1a] border border-[#30255c] rounded-2xl shadow-[0_0_50px_rgba(255,42,141,0.3)] max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#231b42] flex items-center justify-between bg-[#120e26]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                  <PenSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Create Blog Story</h3>
                  <p className="text-[11px] text-slate-400">
                    Publishing as: <strong className="text-cyan-300">{user?.username}</strong> ({user?.role})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-[#1b1536] p-1 rounded-lg border border-[#2b2154]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('write')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      activeTab === 'write' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      activeTab === 'preview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Preview
                  </button>
                </div>
                <button
                  onClick={() => setIsWriteModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handlePublish} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {activeTab === 'write' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Story Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 5 Cinematography Tricks for Vertical Reel Storytelling"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#141026] border border-[#291f4e] rounded-xl text-white font-semibold text-sm focus:outline-none focus:border-pink-500 focus:shadow-[0_0_12px_rgba(255,42,141,0.3)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as BlogPost['category'])}
                        className="w-full px-3 py-2 bg-[#141026] border border-[#291f4e] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. VerticalCinema, Production, Lighting"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full px-3 py-2 bg-[#141026] border border-[#291f4e] rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  {/* Cover Image Picker */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Cover Banner (Pick Preset or Enter URL)
                    </label>
                    <div className="grid grid-cols-6 gap-2 mb-2">
                      {PRESET_COVERS.map((imgUrl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCoverImage(imgUrl)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            coverImage === imgUrl ? 'border-pink-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#141026] border border-[#291f4e] rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Short Summary / Excerpt
                    </label>
                    <input
                      type="text"
                      placeholder="One-sentence teaser describing the article..."
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full px-3 py-2 bg-[#141026] border border-[#291f4e] rounded-xl text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Article Content (Markdown or Text) *
                    </label>
                    <textarea
                      required
                      rows={9}
                      placeholder="Write your article here... You can use headings (##), bullet points, and bold text."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full p-3 bg-[#141026] border border-[#291f4e] rounded-xl text-xs sm:text-sm text-slate-200 font-mono focus:outline-none focus:border-pink-500 focus:shadow-[0_0_12px_rgba(255,42,141,0.25)] leading-relaxed"
                    />
                  </div>
                </>
              ) : (
                /* LIVE PREVIEW */
                <div className="space-y-4">
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-[#2b2154]">
                    <img src={coverImage} alt={title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{title || 'Your Story Title Here'}</h2>
                  <p className="text-sm text-pink-300 font-medium italic">{excerpt}</p>
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                    {content || 'Start writing content to see preview...'}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#231b42] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-[0_0_15px_rgba(255,42,141,0.5)] hover:shadow-[0_0_25px_rgba(255,42,141,0.8)] transition-all"
                >
                  Publish Article Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode="login"
      />
    </div>
  );
}
