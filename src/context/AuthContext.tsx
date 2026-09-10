'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getCoinBalance, setCoinBalance } from '@/lib/store';
import { UserRole } from '@/lib/types';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
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

export interface SignUpExtra {
  role?: UserRole;
  studio_name?: string;
  channel_handle?: string;
  creator_category?: string;
  company_name?: string;
  industry?: string;
  ad_budget?: string;
  contact_phone?: string;
  website_url?: string;
  bio?: string;
  favorite_genres?: string[];
  preferred_language?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  isCreator: boolean;
  isAdvertiser: boolean;
  isViewer: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, username: string, extra?: SignUpExtra) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'yarrowplay_auth_user';
const LOCAL_STORAGE_USERS_DB = 'yarrowplay_registered_users';

// Hardcoded Admin Credentials
export const ADMIN_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@yarrowplay.stream',
  password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Admin@YarrowPlay2026!',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        // First, check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            role: session.user.user_metadata?.role || 'viewer',
            studio_name: session.user.user_metadata?.studio_name,
            channel_handle: session.user.user_metadata?.channel_handle,
            creator_category: session.user.user_metadata?.creator_category,
            company_name: session.user.user_metadata?.company_name,
            industry: session.user.user_metadata?.industry,
            ad_budget: session.user.user_metadata?.ad_budget,
            contact_phone: session.user.user_metadata?.contact_phone,
            website_url: session.user.user_metadata?.website_url,
            bio: session.user.user_metadata?.bio,
            favorite_genres: session.user.user_metadata?.favorite_genres,
            preferred_language: session.user.user_metadata?.preferred_language,
            is_verified: session.user.user_metadata?.is_verified ?? (session.user.user_metadata?.role === 'creator' || session.user.user_metadata?.role === 'admin'),
            created_at: session.user.created_at,
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authUser));
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local storage if Supabase credentials are placeholder or offline
      }

      // Check local storage fallback
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          }
        }
      }
      setLoading(false);
    }

    initAuth();

    // Listen to Supabase auth state change if available
    try {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'User',
            role: session.user.user_metadata?.role || 'viewer',
            studio_name: session.user.user_metadata?.studio_name,
            channel_handle: session.user.user_metadata?.channel_handle,
            creator_category: session.user.user_metadata?.creator_category,
            company_name: session.user.user_metadata?.company_name,
            industry: session.user.user_metadata?.industry,
            ad_budget: session.user.user_metadata?.ad_budget,
            contact_phone: session.user.user_metadata?.contact_phone,
            website_url: session.user.user_metadata?.website_url,
            bio: session.user.user_metadata?.bio,
            favorite_genres: session.user.user_metadata?.favorite_genres,
            preferred_language: session.user.user_metadata?.preferred_language,
            is_verified: session.user.user_metadata?.is_verified ?? (session.user.user_metadata?.role === 'creator' || session.user.user_metadata?.role === 'admin'),
            created_at: session.user.created_at,
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authUser));
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    } catch {
      // Ignore listener error if Supabase client cannot establish socket
    }
  }, []);

  // SIGN UP
  const signUp = async (
    email: string,
    password: string,
    username: string,
    extra?: SignUpExtra
  ) => {
    setLoading(true);
    let supabaseSuccess = false;
    let registeredUser: AuthUser | null = null;
    const role: UserRole = extra?.role || 'viewer';
    const isCreator = role === 'creator';
    const isAdvertiser = role === 'advertiser';
    const isAdmin = role === 'admin';

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role,
            studio_name: extra?.studio_name,
            channel_handle: extra?.channel_handle,
            creator_category: extra?.creator_category,
            company_name: extra?.company_name,
            industry: extra?.industry,
            ad_budget: extra?.ad_budget,
            contact_phone: extra?.contact_phone,
            website_url: extra?.website_url,
            bio: extra?.bio,
            favorite_genres: extra?.favorite_genres,
            preferred_language: extra?.preferred_language,
            is_verified: isCreator || isAdmin,
          },
        },
      });

      if (!error && data?.user) {
        supabaseSuccess = true;
        registeredUser = {
          id: data.user.id,
          email: data.user.email || email,
          username: username || email.split('@')[0],
          role,
          studio_name: extra?.studio_name,
          channel_handle: extra?.channel_handle,
          creator_category: extra?.creator_category,
          company_name: extra?.company_name,
          industry: extra?.industry,
          ad_budget: extra?.ad_budget,
          contact_phone: extra?.contact_phone,
          website_url: extra?.website_url,
          bio: extra?.bio,
          favorite_genres: extra?.favorite_genres,
          preferred_language: extra?.preferred_language,
          is_verified: isCreator || isAdmin,
          created_at: new Date().toISOString(),
        };

        // Also upsert profile row in Supabase
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: username,
          coin_balance: 100,
        });
      }
    } catch {
      // Supabase remote call failed / placeholder URL
    }

    // Fallback registration simulation if Supabase is unavailable
    if (!supabaseSuccess) {
      const usersDb = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_DB) || '[]');
      const existing = usersDb.find((u: { email: string }) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        setLoading(false);
        return { success: false, error: 'An account with this email already exists.' };
      }

      registeredUser = {
        id: 'user_' + Math.random().toString(36).substring(2, 12),
        email,
        username: username || email.split('@')[0],
        role,
        studio_name: extra?.studio_name || (isCreator ? username : undefined),
        channel_handle: extra?.channel_handle || (isCreator ? `@${username.toLowerCase().replace(/\s+/g, '')}` : undefined),
        creator_category: extra?.creator_category || (isCreator ? 'romance' : undefined),
        company_name: extra?.company_name || (isAdvertiser ? username : undefined),
        industry: extra?.industry || (isAdvertiser ? 'Entertainment & Media' : undefined),
        ad_budget: extra?.ad_budget || (isAdvertiser ? '$2,500/mo' : undefined),
        contact_phone: extra?.contact_phone,
        website_url: extra?.website_url,
        bio: extra?.bio,
        favorite_genres: extra?.favorite_genres || (role === 'viewer' ? ['Romance & CEO', 'Billionaire Revenge'] : undefined),
        preferred_language: extra?.preferred_language || 'English',
        is_verified: isCreator || isAdmin,
        created_at: new Date().toISOString(),
      };

      usersDb.push({
        ...registeredUser,
        password, // In mock local storage
      });
      localStorage.setItem(LOCAL_STORAGE_USERS_DB, JSON.stringify(usersDb));
    }

    if (registeredUser) {
      setUser(registeredUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(registeredUser));
      if (getCoinBalance() < 100) {
        setCoinBalance(100);
      }
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, error: 'Failed to create account. Please check your credentials.' };
  };

  // SIGN IN
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    let authenticatedUser: AuthUser | null = null;

    // 1. Check Hardcoded Admin Credentials
    if (
      email.toLowerCase().trim() === ADMIN_CREDENTIALS.email.toLowerCase().trim() &&
      password === ADMIN_CREDENTIALS.password
    ) {
      authenticatedUser = {
        id: 'admin_primary_id',
        email: ADMIN_CREDENTIALS.email,
        username: 'Chief Admin',
        role: 'admin',
        studio_name: 'YarrowPlay Operations & Content Review',
        is_verified: true,
        created_at: new Date().toISOString(),
      };
      setUser(authenticatedUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authenticatedUser));
      setLoading(false);
      return { success: true };
    }

    // 2. Try Supabase Auth
    let supabaseSuccess = false;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        supabaseSuccess = true;
        authenticatedUser = {
          id: data.user.id,
          email: data.user.email || email,
          username: data.user.user_metadata?.username || email.split('@')[0],
          role: data.user.user_metadata?.role || 'viewer',
          studio_name: data.user.user_metadata?.studio_name,
          channel_handle: data.user.user_metadata?.channel_handle,
          creator_category: data.user.user_metadata?.creator_category,
          company_name: data.user.user_metadata?.company_name,
          industry: data.user.user_metadata?.industry,
          ad_budget: data.user.user_metadata?.ad_budget,
          is_verified: data.user.user_metadata?.is_verified ?? (data.user.user_metadata?.role === 'creator'),
          created_at: data.user.created_at,
        };
      }
    } catch {
      // Supabase remote call failed / offline
    }

    // 3. Fallback sign in simulation
    if (!supabaseSuccess) {
      const usersDb = JSON.parse(localStorage.getItem(LOCAL_STORAGE_USERS_DB) || '[]');
      const found = usersDb.find(
        (u: { email: string; password?: string }) =>
          u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (found) {
        authenticatedUser = {
          id: found.id,
          email: found.email,
          username: found.username,
          role: found.role || 'viewer',
          studio_name: found.studio_name,
          channel_handle: found.channel_handle,
          creator_category: found.creator_category,
          company_name: found.company_name,
          industry: found.industry,
          ad_budget: found.ad_budget,
          contact_phone: found.contact_phone,
          website_url: found.website_url,
          bio: found.bio,
          favorite_genres: found.favorite_genres,
          preferred_language: found.preferred_language,
          is_verified: found.is_verified ?? (found.role === 'creator' || found.role === 'admin'),
          created_at: found.created_at,
        };
      } else {
        // Dynamic demo user detection based on email naming
        const isDemoCreator = email.includes('creator') || email === 'creator.studio@yarrowplay.stream';
        const isDemoAdvertiser = email.includes('advertiser') || email.includes('vendor') || email === 'partner@apexbrands.com';
        const isDemoAdmin = email.includes('admin');

        let detectedRole: UserRole = 'viewer';
        if (isDemoAdmin) detectedRole = 'admin';
        else if (isDemoCreator) detectedRole = 'creator';
        else if (isDemoAdvertiser) detectedRole = 'advertiser';

        authenticatedUser = {
          id: isDemoCreator ? 'creator_demo_id' : isDemoAdvertiser ? 'advertiser_demo_id' : isDemoAdmin ? 'admin_demo_id' : 'user_' + Math.random().toString(36).substring(2, 12),
          email,
          username: isDemoAdmin ? 'YarrowPlay Admin' : isDemoCreator ? 'Neon Rebel Studios' : isDemoAdvertiser ? 'Apex Global Media' : email.split('@')[0],
          role: detectedRole,
          studio_name: isDemoCreator ? 'Neon Rebel Studios' : undefined,
          channel_handle: isDemoCreator ? '@neonrebel' : undefined,
          creator_category: isDemoCreator ? 'suspense' : undefined,
          company_name: isDemoAdvertiser ? 'Apex Global Media Inc.' : undefined,
          industry: isDemoAdvertiser ? 'Consumer Tech & Mobile Gaming' : undefined,
          ad_budget: isDemoAdvertiser ? '$5,000/mo' : undefined,
          is_verified: isDemoCreator || isDemoAdmin,
          created_at: new Date().toISOString(),
        };
      }
    }

    if (authenticatedUser) {
      setUser(authenticatedUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authenticatedUser));
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, error: 'Invalid email or password.' };
  };

  // SIGN OUT
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  };

  const isAdmin = user?.role === 'admin';
  const isCreator = user?.role === 'creator';
  const isAdvertiser = user?.role === 'advertiser';
  const isViewer = !user || user.role === 'viewer';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        isCreator,
        isAdvertiser,
        isViewer,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
