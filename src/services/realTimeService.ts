import { supabase } from '../lib/supabase';

class RealTimeService {
  private subscriptions: Map<string, any> = new Map();

  subscribeToUserGames(userId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel(`user_games_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'games',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`user_games_${userId}`, subscription);
    return subscription;
  }

  subscribeToUserAchievements(userId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel(`user_achievements_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'achievements',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`user_achievements_${userId}`, subscription);
    return subscription;
  }

  subscribeToGameSessions(userId: string, callback: (payload: any) => void) {
    const subscription = supabase
      .channel(`user_sessions_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    this.subscriptions.set(`user_sessions_${userId}`, subscription);
    return subscription;
  }

  unsubscribe(key: string) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      supabase.removeChannel(subscription);
      this.subscriptions.delete(key);
    }
  }

  unsubscribeAll() {
    this.subscriptions.forEach((subscription, key) => {
      supabase.removeChannel(subscription);
    });
    this.subscriptions.clear();
  }
}

export const realTimeService = new RealTimeService();