import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar_url: string | null;
          level: number;
          total_playtime: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          email: string;
          avatar_url?: string | null;
          level?: number;
          total_playtime?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          avatar_url?: string | null;
          level?: number;
          total_playtime?: number;
          updated_at?: string;
        };
      };
      games: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          platform: string;
          genre: string;
          cover_image: string;
          total_playtime: number;
          last_played: string;
          status: 'playing' | 'completed' | 'backlog' | 'abandoned';
          progress: number;
          rating: number | null;
          difficulty: string | null;
          multiplayer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          platform: string;
          genre: string;
          cover_image: string;
          total_playtime?: number;
          last_played?: string;
          status?: 'playing' | 'completed' | 'backlog' | 'abandoned';
          progress?: number;
          rating?: number | null;
          difficulty?: string | null;
          multiplayer?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          platform?: string;
          genre?: string;
          cover_image?: string;
          total_playtime?: number;
          last_played?: string;
          status?: 'playing' | 'completed' | 'backlog' | 'abandoned';
          progress?: number;
          rating?: number | null;
          difficulty?: string | null;
          multiplayer?: boolean;
          updated_at?: string;
        };
      };
      game_sessions: {
        Row: {
          id: string;
          user_id: string;
          game_id: string;
          start_time: string;
          end_time: string | null;
          duration: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          game_id: string;
          start_time: string;
          end_time?: string | null;
          duration?: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          game_id?: string;
          start_time?: string;
          end_time?: string | null;
          duration?: number;
          notes?: string | null;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          game_id: string;
          name: string;
          description: string;
          type: 'bronze' | 'silver' | 'gold' | 'platinum';
          rarity: number;
          icon: string;
          unlocked_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          game_id: string;
          name: string;
          description: string;
          type: 'bronze' | 'silver' | 'gold' | 'platinum';
          rarity: number;
          icon: string;
          unlocked_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          game_id?: string;
          name?: string;
          description?: string;
          type?: 'bronze' | 'silver' | 'gold' | 'platinum';
          rarity?: number;
          icon?: string;
          unlocked_at?: string;
        };
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: 'pending' | 'accepted' | 'blocked';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: 'pending' | 'accepted' | 'blocked';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: 'pending' | 'accepted' | 'blocked';
        };
      };
    };
  };
}