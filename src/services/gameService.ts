import { supabase } from '../lib/supabase';
import { Game, GameSession, Achievement } from '../types';
import { v4 as uuidv4 } from 'uuid';

class GameService {
  // Demo mode flag
  private isDemoMode = false;
  
  private demoGames: Game[] = [
    {
      id: '1',
      title: 'Spider-Man 2',
      platform: 'PS5',
      genre: 'Action',
      coverImage: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=300',
      totalPlaytime: 2340,
      lastPlayed: new Date('2024-01-15'),
      status: 'playing',
      progress: 75,
      rating: 9,
      difficulty: 'Medium',
      multiplayer: false
    },
    {
      id: '2',
      title: 'Call of Duty: MW3',
      platform: 'PS5',
      genre: 'FPS',
      coverImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=300',
      totalPlaytime: 4560,
      lastPlayed: new Date('2024-01-14'),
      status: 'playing',
      progress: 45,
      rating: 8,
      difficulty: 'Hard',
      multiplayer: true
    },
    {
      id: '3',
      title: 'The Last of Us Part II',
      platform: 'PS5',
      genre: 'Action',
      coverImage: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=300',
      totalPlaytime: 1890,
      lastPlayed: new Date('2024-01-10'),
      status: 'completed',
      progress: 100,
      rating: 10,
      difficulty: 'Hard',
      multiplayer: false
    }
  ];
  
  private demoAchievements: Achievement[] = [
    {
      id: '1',
      name: 'Web-Slinger',
      description: 'Complete your first web-swinging combo',
      type: 'bronze',
      rarity: 85.2,
      unlockedAt: new Date('2024-01-15T14:30:00'),
      gameId: '1',
      icon: '🕷️'
    },
    {
      id: '2',
      name: 'Hero of New York',
      description: 'Save the city from certain doom',
      type: 'gold',
      rarity: 23.7,
      unlockedAt: new Date('2024-01-14T20:15:00'),
      gameId: '1',
      icon: '🏆'
    },
    {
      id: '3',
      name: 'Survivor',
      description: 'Complete the game on Survivor difficulty',
      type: 'platinum',
      rarity: 5.1,
      unlockedAt: new Date('2024-01-10T22:45:00'),
      gameId: '3',
      icon: '💎'
    }
  ];
  async getUserGames(userId: string): Promise<Game[]> {
    // Handle demo account
    if (userId === 'demo-user-123') {
      this.isDemoMode = true;
      return this.demoGames;
    }

    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', userId)
      .order('last_played', { ascending: false });

    if (error) {
      console.error('Error fetching games:', error);
      return [];
    }

    return data.map(this.mapDatabaseGameToGame);
  }

  async addGame(userId: string, gameData: Omit<Game, 'id'>): Promise<Game | null> {
    // Handle demo account
    if (userId === 'demo-user-123') {
      const newGame = { ...gameData, id: uuidv4() };
      this.demoGames.push(newGame);
      return newGame;
    }

    const { data, error } = await supabase
      .from('games')
      .insert({
        id: uuidv4(),
        user_id: userId,
        title: gameData.title,
        platform: gameData.platform,
        genre: gameData.genre,
        cover_image: gameData.coverImage,
        total_playtime: gameData.totalPlaytime,
        last_played: gameData.lastPlayed.toISOString(),
        status: gameData.status,
        progress: gameData.progress,
        rating: gameData.rating,
        difficulty: gameData.difficulty,
        multiplayer: gameData.multiplayer || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding game:', error);
      return null;
    }

    return this.mapDatabaseGameToGame(data);
  }

  async updateGame(gameId: string, updates: Partial<Game>): Promise<boolean> {
    // Handle demo account
    if (this.isDemoMode) {
      const gameIndex = this.demoGames.findIndex(g => g.id === gameId);
      if (gameIndex !== -1) {
        this.demoGames[gameIndex] = { ...this.demoGames[gameIndex], ...updates };
        return true;
      }
      return false;
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.title) updateData.title = updates.title;
    if (updates.platform) updateData.platform = updates.platform;
    if (updates.genre) updateData.genre = updates.genre;
    if (updates.coverImage) updateData.cover_image = updates.coverImage;
    if (updates.totalPlaytime !== undefined) updateData.total_playtime = updates.totalPlaytime;
    if (updates.lastPlayed) updateData.last_played = updates.lastPlayed.toISOString();
    if (updates.status) updateData.status = updates.status;
    if (updates.progress !== undefined) updateData.progress = updates.progress;
    if (updates.rating !== undefined) updateData.rating = updates.rating;
    if (updates.difficulty) updateData.difficulty = updates.difficulty;
    if (updates.multiplayer !== undefined) updateData.multiplayer = updates.multiplayer;

    const { error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', gameId);

    if (error) {
      console.error('Error updating game:', error);
      return false;
    }

    return true;
  }

  async deleteGame(gameId: string): Promise<boolean> {
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', gameId);

    if (error) {
      console.error('Error deleting game:', error);
      return false;
    }

    return true;
  }

  async startGameSession(userId: string, gameId: string): Promise<string | null> {
    const sessionId = uuidv4();
    const { error } = await supabase
      .from('game_sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        game_id: gameId,
        start_time: new Date().toISOString(),
        duration: 0,
      });

    if (error) {
      console.error('Error starting game session:', error);
      return null;
    }

    return sessionId;
  }

  async endGameSession(sessionId: string, duration: number, notes?: string): Promise<boolean> {
    const { error } = await supabase
      .from('game_sessions')
      .update({
        end_time: new Date().toISOString(),
        duration,
        notes,
      })
      .eq('id', sessionId);

    if (error) {
      console.error('Error ending game session:', error);
      return false;
    }

    return true;
  }

  async getUserSessions(userId: string, limit = 50): Promise<GameSession[]> {
    const { data, error } = await supabase
      .from('game_sessions')
      .select(`
        *,
        games (
          title,
          cover_image
        )
      `)
      .eq('user_id', userId)
      .order('start_time', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching game sessions:', error);
      return [];
    }

    return data.map(session => ({
      id: session.id,
      gameId: session.game_id,
      startTime: new Date(session.start_time),
      endTime: session.end_time ? new Date(session.end_time) : undefined,
      duration: session.duration,
      achievements: [],
      notes: session.notes,
    }));
  }

  async addAchievement(userId: string, achievement: Omit<Achievement, 'id' | 'unlockedAt'>): Promise<Achievement | null> {
    const { data, error } = await supabase
      .from('achievements')
      .insert({
        id: uuidv4(),
        user_id: userId,
        game_id: achievement.gameId,
        name: achievement.name,
        description: achievement.description,
        type: achievement.type,
        rarity: achievement.rarity,
        icon: achievement.icon,
        unlocked_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding achievement:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type,
      rarity: data.rarity,
      unlockedAt: new Date(data.unlocked_at),
      gameId: data.game_id,
      icon: data.icon,
    };
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    // Handle demo account
    if (userId === 'demo-user-123') {
      this.isDemoMode = true;
      return this.demoAchievements;
    }

    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data.map(achievement => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      type: achievement.type,
      rarity: achievement.rarity,
      unlockedAt: new Date(achievement.unlocked_at),
      gameId: achievement.game_id,
      icon: achievement.icon,
    }));
  }

  private mapDatabaseGameToGame(dbGame: any): Game {
    return {
      id: dbGame.id,
      title: dbGame.title,
      platform: dbGame.platform,
      genre: dbGame.genre,
      coverImage: dbGame.cover_image,
      totalPlaytime: dbGame.total_playtime,
      lastPlayed: new Date(dbGame.last_played),
      status: dbGame.status,
      progress: dbGame.progress,
      rating: dbGame.rating,
      difficulty: dbGame.difficulty,
      multiplayer: dbGame.multiplayer,
    };
  }
}

export const gameService = new GameService();