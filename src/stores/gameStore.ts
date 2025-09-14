import { create } from 'zustand';
import { Game, GameSession, Achievement, Friend, UserStats, WeeklyActivity, GenreStats } from '../types';
import { gameService } from '../services/gameService';
import { realTimeService } from '../services/realTimeService';

interface GameStore {
  // Game Management
  games: Game[];
  currentGame: Game | null;
  currentSession: GameSession | null;
  currentSessionId: string | null;
  
  // Stats and Analytics
  userStats: UserStats;
  weeklyActivity: WeeklyActivity[];
  genreStats: GenreStats[];
  achievements: Achievement[];
  
  // Social Features
  friends: Friend[];
  onlineFriends: Friend[];
  
  // Session Management
  sessionStartTime: Date | null;
  sessionDuration: number;
  isSessionActive: boolean;
  isPaused: boolean;
  
  // User Management
  userId: string | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  startSession: (game: Game) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  addGame: (game: Game) => void;
  updateGame: (gameId: string, updates: Partial<Game>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  addFriend: (friend: Friend) => void;
  updateUserStats: () => void;
  loadUserData: (userId: string) => Promise<void>;
  setUserId: (userId: string | null) => void;
  initializeWithDemoData: () => void;
}

// Initial mock data for new users
const getInitialGames = (): Game[] => [
  {
    id: '1',
    title: 'Spider-Man 2',
    platform: 'PS5',
    genre: 'Action',
    coverImage: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=300',
    totalPlaytime: 2340, // minutes
    lastPlayed: new Date('2024-01-15'),
    status: 'playing',
    progress: 75,
    rating: 9,
    difficulty: 'Medium',
    multiplayer: false,
    onlineStatus: 'offline'
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
    multiplayer: true,
    onlineStatus: 'online'
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
    multiplayer: false,
    onlineStatus: 'offline'
  }
];

const getInitialAchievements = (): Achievement[] => [
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

const getInitialFriends = (): Friend[] => [
  {
    id: '1',
    username: 'GamerPro2024',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'online',
    currentGame: 'Call of Duty: MW3',
    lastSeen: new Date(),
    mutualGames: 12
  },
  {
    id: '2',
    username: 'TrophyHunter',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'away',
    currentGame: 'Spider-Man 2',
    lastSeen: new Date(Date.now() - 300000),
    mutualGames: 8
  },
  {
    id: '3',
    username: 'RetroGamer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    status: 'offline',
    lastSeen: new Date(Date.now() - 3600000),
    mutualGames: 15
  }
];

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State
  games: [],
  currentGame: null,
  currentSession: null,
  currentSessionId: null,
  userId: null,
  loading: false,
  error: null,
  userStats: {
    totalPlaytime: 8790, // minutes
    gamesCompleted: 23,
    totalTrophies: 342,
    platinumTrophies: 8,
    level: 47,
    currentStreak: 12,
    longestStreak: 28,
    averageSessionLength: 145,
    favoriteGenre: 'Action',
    completionRate: 78.5
  },
  weeklyActivity: [
    { day: 'Mon', hours: 2.5, games: 2 },
    { day: 'Tue', hours: 4.2, games: 3 },
    { day: 'Wed', hours: 1.8, games: 1 },
    { day: 'Thu', hours: 3.7, games: 2 },
    { day: 'Fri', hours: 5.1, games: 4 },
    { day: 'Sat', hours: 6.8, games: 3 },
    { day: 'Sun', hours: 4.3, games: 2 }
  ],
  genreStats: [
    { genre: 'Action', hours: 156, games: 12, completion: 85 },
    { genre: 'RPG', hours: 234, games: 8, completion: 92 },
    { genre: 'FPS', hours: 89, games: 6, completion: 67 },
    { genre: 'Adventure', hours: 123, games: 9, completion: 78 },
    { genre: 'Sports', hours: 45, games: 4, completion: 55 }
  ],
  achievements: [],
  friends: [],
  onlineFriends: getInitialFriends().filter(f => f.status === 'online'),
  sessionStartTime: null,
  sessionDuration: 0,
  isSessionActive: false,
  isPaused: false,

  // Actions
  initializeWithDemoData: () => {
    set({
      games: getInitialGames(),
      achievements: getInitialAchievements(),
      friends: getInitialFriends(),
      onlineFriends: getInitialFriends().filter(f => f.status === 'online'),
      userId: 'demo-user-123'
    });
  },

  setUserId: (userId: string | null) => {
    set({ userId });
    
    if (userId) {
      // Always load demo data when user is set
      set({
        games: getInitialGames(),
        achievements: getInitialAchievements(),
        friends: getInitialFriends(),
        onlineFriends: getInitialFriends().filter(f => f.status === 'online')
      });
    } else {
      // Clear data when user logs out
      set({
        games: [],
        achievements: [],
        friends: [],
        onlineFriends: []
      });
    }
  },

  startSession: async (game: Game) => {
    const now = new Date();
    const state = get();
    
    if (!state.userId) return;
    
    const sessionId = await gameService.startGameSession(state.userId, game.id);
    
    if (!sessionId) {
      set({ error: 'Failed to start game session' });
      return;
    }
    
    set({
      currentGame: game,
      currentSessionId: sessionId,
      sessionStartTime: now,
      isSessionActive: true,
      isPaused: false,
      sessionDuration: 0,
      currentSession: {
        id: Date.now().toString(),
        gameId: game.id,
        startTime: now,
        duration: 0,
        achievements: []
      }
    });
  },

  pauseSession: () => {
    set({ isPaused: true });
  },

  resumeSession: () => {
    set({ isPaused: false });
  },

  endSession: async () => {
    const state = get();
    if (state.currentGame && state.sessionStartTime && state.currentSessionId) {
      // End session in database
      await gameService.endGameSession(state.currentSessionId, state.sessionDuration);
      
      // Update game playtime
      await gameService.updateGame(state.currentGame.id, {
        totalPlaytime: state.currentGame.totalPlaytime + Math.floor(state.sessionDuration / 60),
        lastPlayed: new Date()
      });
      
      const updatedGames = state.games.map(game => 
        game.id === state.currentGame!.id 
          ? { 
              ...game, 
              totalPlaytime: game.totalPlaytime + Math.floor(state.sessionDuration / 60),
              lastPlayed: new Date()
            }
          : game
      );
      
      set({
        games: updatedGames,
        currentGame: null,
        currentSession: null,
        currentSessionId: null,
        sessionStartTime: null,
        sessionDuration: 0,
        isSessionActive: false,
        isPaused: false
      });
    }
  },

  addGame: async (game: Game) => {
    const state = get();
    if (!state.userId) return;
    
    const newGame = await gameService.addGame(state.userId, game);
    if (newGame) {
      set(state => ({
        games: [...state.games, newGame]
      }));
    }
  },

  updateGame: async (gameId: string, updates: Partial<Game>) => {
    const success = await gameService.updateGame(gameId, updates);
    if (success) {
      set(state => ({
        games: state.games.map(game => 
          game.id === gameId ? { ...game, ...updates } : game
        )
      }));
    }
  },

  unlockAchievement: async (achievement: Achievement) => {
    const state = get();
    if (!state.userId) return;
    
    const newAchievement = await gameService.addAchievement(state.userId, achievement);
    if (newAchievement) {
      set(state => ({
        achievements: [...state.achievements, newAchievement]
      }));
    }
  },

  addFriend: (friend: Friend) => {
    set(state => ({
      friends: [...state.friends, friend]
    }));
  },

  updateUserStats: () => {
    const state = get();
    const totalPlaytime = state.games.reduce((sum, game) => sum + game.totalPlaytime, 0);
    const completedGames = state.games.filter(game => game.status === 'completed').length;
    
    set(state => ({
      userStats: {
        ...state.userStats,
        totalPlaytime,
        gamesCompleted: completedGames,
        totalTrophies: state.achievements.length
      }
    }));
  },

  loadUserData: async (userId: string) => {
    set({ loading: true, error: null });
    
    try {
      // Load user's games
      const games = await gameService.getUserGames(userId);
      
      // Load user's achievements
      const achievements = await gameService.getUserAchievements(userId);
      
      // Set up real-time subscriptions
      realTimeService.subscribeToUserGames(userId, (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        set(state => {
          let updatedGames = [...state.games];
          
          switch (eventType) {
            case 'INSERT':
              updatedGames.push(gameService.mapDatabaseGameToGame(newRecord));
              break;
            case 'UPDATE':
              updatedGames = updatedGames.map(game => 
                game.id === newRecord.id ? gameService.mapDatabaseGameToGame(newRecord) : game
              );
              break;
            case 'DELETE':
              updatedGames = updatedGames.filter(game => game.id !== oldRecord.id);
              break;
          }
          
          return { games: updatedGames };
        });
      });
      
      realTimeService.subscribeToUserAchievements(userId, (payload) => {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        set(state => {
          let updatedAchievements = [...state.achievements];
          
          switch (eventType) {
            case 'INSERT':
              updatedAchievements.push({
                id: newRecord.id,
                name: newRecord.name,
                description: newRecord.description,
                type: newRecord.type,
                rarity: newRecord.rarity,
                unlockedAt: new Date(newRecord.unlocked_at),
                gameId: newRecord.game_id,
                icon: newRecord.icon,
              });
              break;
            case 'DELETE':
              updatedAchievements = updatedAchievements.filter(achievement => achievement.id !== oldRecord.id);
              break;
          }
          
          return { achievements: updatedAchievements };
        });
      });
      
      set({ 
        games, 
        achievements,
        friends: getInitialFriends(), // TODO: Implement real friends system
        onlineFriends: getInitialFriends().filter(f => f.status === 'online'),
        loading: false 
      });
      
      // Update user stats
      get().updateUserStats();
      
    } catch (error) {
      console.error('Error loading user data:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to load user data',
        loading: false 
      });
    }
  }
}));