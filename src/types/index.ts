export interface Game {
  id: string;
  title: string;
  platform: string;
  genre: string;
  coverImage: string;
  totalPlaytime: number;
  lastPlayed: Date;
  status: 'playing' | 'completed' | 'backlog' | 'abandoned';
  progress: number;
  rating?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
  multiplayer?: boolean;
  onlineStatus?: 'online' | 'offline' | 'away';
}

export interface Trophy {
  id: string;
  name: string;
  description: string;
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  rarity: number;
  unlockedAt?: Date;
  gameId: string;
  icon: string;
}

export interface GameSession {
  id: string;
  gameId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  achievements: string[];
  notes?: string;
}

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  currentGame?: string;
  lastSeen: Date;
  mutualGames: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  unlockedAt: Date;
  gameId: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  gameContext?: string;
  type?: 'text' | 'tip' | 'strategy' | 'warning';
}

export interface UserStats {
  totalPlaytime: number;
  gamesCompleted: number;
  totalTrophies: number;
  platinumTrophies: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionLength: number;
  favoriteGenre: string;
  completionRate: number;
}

export interface WeeklyActivity {
  day: string;
  hours: number;
  games: number;
}

export interface GenreStats {
  genre: string;
  hours: number;
  games: number;
  completion: number;
}