import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  level: number;
  total_playtime: number;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Demo user data
  const demoUser = {
    id: 'demo-user-123',
    email: 'demo@xion-gaming.com',
    user_metadata: { username: 'DemoPlayer' },
    aud: 'authenticated',
    role: 'authenticated'
  } as User;

  const demoProfile: UserProfile = {
    id: 'demo-user-123',
    username: 'DemoPlayer',
    email: 'demo@xion-gaming.com',
    avatar_url: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100',
    level: 47,
    total_playtime: 8790,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  useEffect(() => {
    // Initialize with no user
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Handle demo account
      if (email.includes('demo') || email === 'demo@xion-gaming.com') {
        setUser(demoUser);
        setProfile(demoProfile);
        setLoading(false);
        return true;
      }
      
      // For non-demo accounts, you could integrate with real auth service here
      setError('Only demo account is available');
      setLoading(false);
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      // Handle demo account
      if (email.includes('demo') || email === 'demo@xion-gaming.com') {
        setUser(demoUser);
        setProfile(demoProfile);
        setLoading(false);
      return true;
      }
      
      // For non-demo accounts
      setError('Only demo account is available');
      setLoading(false);
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
      return false;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setUser(null);
      setProfile(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {    
    try {
      setError(null);
      if (profile) {
        setProfile({ ...profile, ...updates });
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };
};