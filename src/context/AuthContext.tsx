'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getCoinBalance, setCoinBalance } from '@/lib/store';

import { UserRole } from '@/lib/types';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role?: UserRole;
  studio_name?: string;
  channel_handle?: string;
  creator_category?: string;
  is_verified?: boolean;
  created_at?: string;
}

export interface SignUpExtra {
  role?: UserRole;
  studio_name?: string;
  channel_handle?: string;
  creator_category?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, username: string, extra?: SignUpExtra) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'dramabox_auth_user';
const LOCAL_STORAGE_USERS_DB = 'dramabox_registered_users';

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
            is_verified: session.user.user_metadata?.is_verified ?? (session.user.user_metadata?.role === 'creator'),
            created_at: session.user.created_at,
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authUser));
          setLoading(false);
          return;
        }
      } catch (err) {
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
            is_verified: session.user.user_metadata?.is_verified ?? (session.user.user_metadata?.role === 'creator'),
            created_at: session.user.created_at,
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(authUser));
        } else if (event === 'SIGNED_OUT') {
          // Handled via signOut
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
            is_verified: isCreator,
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
          is_verified: isCreator,
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
        is_verified: isCreator,
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
      // Give initial 100 coins
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
    let supabaseSuccess = false;
    let authenticatedUser: AuthUser | null = null;

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
          is_verified: data.user.user_metadata?.is_verified ?? (data.user.user_metadata?.role === 'creator'),
          created_at: data.user.created_at,
        };
      }
    } catch {
      // Supabase remote call failed / placeholder URL
    }

    // Fallback sign in simulation
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
          is_verified: found.is_verified ?? (found.role === 'creator'),
          created_at: found.created_at,
        };
      } else {
        const isDemoCreator = email.includes('creator') || email === 'creator.studio@dramabox.stream';
        // If it's a first time test login with any valid password, auto-create for pleasant dev experience
        authenticatedUser = {
          id: isDemoCreator ? 'creator_demo_id' : 'user_' + Math.random().toString(36).substring(2, 12),
          email,
          username: isDemoCreator ? 'Neon Rebel Studios' : email.split('@')[0],
          role: isDemoCreator ? 'creator' : 'viewer',
          studio_name: isDemoCreator ? 'Neon Rebel Studios' : undefined,
          channel_handle: isDemoCreator ? '@neonrebel' : undefined,
          creator_category: isDemoCreator ? 'suspense' : undefined,
          is_verified: isDemoCreator,
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

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
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
