import { Game, Trophy } from '../types';

export const calculateCompletionRate = (games: Game[]): number => {
  if (games.length === 0) return 0;
  const completedGames = games.filter(game => game.status === 'completed').length;
  return (completedGames / games.length) * 100;
};

export const getTrophyValue = (type: string): number => {
  switch (type) {
    case 'platinum': return 300;
    case 'gold': return 90;
    case 'silver': return 30;
    case 'bronze': return 15;
    default: return 0;
  }
};

export const calculateTrophyScore = (trophies: Trophy[]): number => {
  return trophies.reduce((total, trophy) => total + getTrophyValue(trophy.type), 0);
};

export const getGameDifficulty = (game: Game): string => {
  if (game.difficulty) return game.difficulty;
  
  // Estimate difficulty based on completion rate and genre
  if (game.progress < 30 && game.genre === 'RPG') return 'Hard';
  if (game.progress > 80) return 'Easy';
  return 'Medium';
};

export const getRecommendedPlaytime = (game: Game): number => {
  // Estimate based on genre and current progress
  const baseHours = {
    'RPG': 60,
    'Action': 25,
    'FPS': 15,
    'Adventure': 30,
    'Sports': 20,
    'Racing': 15
  };
  
  const base = baseHours[game.genre as keyof typeof baseHours] || 25;
  return Math.floor(base * (100 - game.progress) / 100);
};

export const generateGameTips = (game: Game): string[] => {
  const tips = {
    'Action': [
      'Master the dodge timing to avoid taking unnecessary damage',
      'Upgrade your abilities early to make combat more manageable',
      'Explore thoroughly to find hidden collectibles and upgrades'
    ],
    'RPG': [
      'Don\'t rush the main story - side quests often provide valuable experience',
      'Manage your inventory regularly to avoid missing important items',
      'Experiment with different character builds to find your playstyle'
    ],
    'FPS': [
      'Learn the map layouts to gain a tactical advantage',
      'Practice your aim in training modes before competitive matches',
      'Communication with teammates is crucial for success'
    ]
  };
  
  return tips[game.genre as keyof typeof tips] || [
    'Take breaks regularly to avoid fatigue',
    'Save your progress frequently',
    'Don\'t be afraid to adjust difficulty settings'
  ];
};