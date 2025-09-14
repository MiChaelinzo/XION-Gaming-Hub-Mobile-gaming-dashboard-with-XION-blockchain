import { supabase } from '../lib/supabase';
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

class AuthService {
  // Demo mode flag
  private isDemoMode = false;
  private demoUser = {
    id: 'demo-user-123',
    email: 'demo@xion-gaming.com',
    username: 'DemoPlayer',
    level: 47,
    total_playtime: 8790
  };

  async signUp(email: string, password: string, username: string): Promise<{ user: User | null; error: any }> {
    // Handle demo account
    if (email === 'demo@xion-gaming.com' || email.includes('demo')) {
      this.isDemoMode = true;
      return { 
        user: { 
          id: this.demoUser.id, 
          email: this.demoUser.email,
          user_metadata: { username: this.demoUser.username }
        } as User, 
        error: null 
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (data.user && !error) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          username,
          email,
          level: 1,
          total_playtime: 0,
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }
    }

    return { user: data.user, error };
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: any }> {
    // Handle demo account
    if (email === 'demo@xion-gaming.com' || email.includes('demo')) {
      this.isDemoMode = true;
      return { 
        user: { 
          id: this.demoUser.id, 
          email: this.demoUser.email,
          user_metadata: { username: this.demoUser.username },
          aud: 'authenticated',
          role: 'authenticated'
        } as User, 
        error: null 
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { user: data.user, error };
  }

  async signOut(): Promise<{ error: any }> {
    this.isDemoMode = false;
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Handle demo account
    if (this.isDemoMode && userId === this.demoUser.id) {
      return {
        id: this.demoUser.id,
        username: this.demoUser.username,
        email: this.demoUser.email,
        avatar_url: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: this.demoUser.level,
        total_playtime: this.demoUser.total_playtime,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    // Handle demo account
    if (this.isDemoMode && userId === this.demoUser.id) {
      return true;
    }

    const { error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user profile:', error);
      return false;
    }

    return true;
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
}

export const authService = new AuthService();