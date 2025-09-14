import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, TrendingUp, Users, Star } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  change: number;
  level: number;
  trophies: number;
  country: string;
}

export const Leaderboards: React.FC = () => {
  const [category, setCategory] = useState<'global' | 'friends' | 'country'>('friends');
  const [metric, setMetric] = useState<'trophies' | 'playtime' | 'level' | 'completion'>('trophies');

  const leaderboardData: LeaderboardEntry[] = [
    {
      rank: 1,
      username: 'TrophyMaster2024',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
      score: 2847,
      change: 2,
      level: 52,
      trophies: 2847,
      country: 'US'
    },
    {
      rank: 2,
      username: 'GamingLegend',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
      score: 2756,
      change: -1,
      level: 51,
      trophies: 2756,
      country: 'UK'
    },
    {
      rank: 3,
      username: 'ProGamer_X',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      score: 2634,
      change: 1,
      level: 49,
      trophies: 2634,
      country: 'CA'
    },
    {
      rank: 4,
      username: 'You',
      avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100',
      score: 2456,
      change: 3,
      level: 47,
      trophies: 2456,
      country: 'US'
    },
    {
      rank: 5,
      username: 'RetroGamer',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100',
      score: 2398,
      change: -2,
      level: 46,
      trophies: 2398,
      country: 'JP'
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-300" />;
      case 3: return <Medal className="w-6 h-6 text-orange-400" />;
      default: return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBg = (rank: number, isUser: boolean) => {
    if (isUser) return 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500';
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 border-yellow-500/50';
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-300/20 border-gray-400/50';
      case 3: return 'bg-gradient-to-r from-orange-500/20 to-orange-400/20 border-orange-500/50';
      default: return 'bg-gray-700/50 border-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-600 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Leaderboards</h3>
            <p className="text-gray-400 text-sm">Compete with friends and players worldwide</p>
          </div>
        </div>
      </div>

      {/* Category and Metric Selectors */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex bg-gray-700 rounded-lg p-1">
          {(['friends', 'country', 'global'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-yellow-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as any)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="trophies">Total Trophies</option>
          <option value="playtime">Total Playtime</option>
          <option value="level">Player Level</option>
          <option value="completion">Completion Rate</option>
        </select>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboardData.map((entry, index) => {
          const isUser = entry.username === 'You';
          return (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${getRankBg(entry.rank, isUser)}`}
            >
              <div className="flex items-center justify-center w-12 h-12">
                {getRankIcon(entry.rank)}
              </div>
              
              <div className="relative">
                <img
                  src={entry.avatar}
                  alt={entry.username}
                  className="w-12 h-12 rounded-full"
                />
                {isUser && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className={`font-semibold truncate ${isUser ? 'text-indigo-300' : 'text-white'}`}>
                    {entry.username}
                  </h4>
                  <span className="text-xs text-gray-400 bg-gray-600 px-2 py-1 rounded">
                    {entry.country}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Level {entry.level}</span>
                  <span>•</span>
                  <span>{entry.trophies} trophies</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-white">
                  {entry.score.toLocaleString()}
                </div>
                <div className={`text-sm flex items-center space-x-1 ${
                  entry.change > 0 ? 'text-green-400' : 
                  entry.change < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  <TrendingUp className={`w-3 h-3 ${entry.change < 0 ? 'rotate-180' : ''}`} />
                  <span>{Math.abs(entry.change)}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Your Rank Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-lg p-4 border border-indigo-500/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold">Your Performance</h4>
            <p className="text-indigo-300 text-sm">Rank #4 among friends</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 text-sm font-medium">↑ 3 positions</div>
            <div className="text-gray-400 text-xs">This week</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};