import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Star, Users } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { formatDistanceToNow } from 'date-fns';

export const RecentActivity: React.FC = () => {
  const { trophies, games, friends } = useGameStore();

  const recentActivities = [
    ...(trophies || []).slice(0, 3).map(trophy => ({
      id: trophy.id,
      type: 'trophy' as const,
      title: `Unlocked "${trophy.name}"`,
      subtitle: (games || []).find(g => g.id === trophy.gameId)?.title || 'Unknown Game',
      time: trophy.unlockedAt!,
      icon: Trophy,
      color: trophy.type === 'platinum' ? 'text-purple-400' : 
             trophy.type === 'gold' ? 'text-yellow-400' : 
             trophy.type === 'silver' ? 'text-gray-300' : 'text-orange-400'
    })),
    ...(games || []).slice(0, 2).map(game => ({
      id: `game-${game.id}`,
      type: 'game' as const,
      title: `Played ${game.title}`,
      subtitle: `${Math.floor(game.totalPlaytime / 60)} hours total`,
      time: game.lastPlayed,
      icon: Clock,
      color: 'text-blue-400'
    })),
    {
      id: 'friend-1',
      type: 'social' as const,
      title: 'GamerPro2024 is now online',
      subtitle: 'Playing Call of Duty: MW3',
      time: new Date(Date.now() - 300000),
      icon: Users,
      color: 'text-green-400'
    }
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-600 rounded-lg">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
          <p className="text-gray-400 text-sm">Your latest gaming achievements</p>
        </div>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className={`p-2 rounded-lg ${
              activity.type === 'trophy' ? 'bg-yellow-600/20' :
              activity.type === 'game' ? 'bg-blue-600/20' : 'bg-green-600/20'
            }`}>
              <activity.icon className={`w-5 h-5 ${activity.color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{activity.title}</p>
              <p className="text-gray-400 text-sm truncate">{activity.subtitle}</p>
            </div>
            
            <div className="text-right">
              <p className="text-gray-400 text-xs">
                {formatDistanceToNow(activity.time, { addSuffix: true })}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        View All Activity
      </motion.button>
    </motion.div>
  );
};