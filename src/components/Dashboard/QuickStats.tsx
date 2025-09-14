import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, Target, TrendingUp, Award, Gamepad2 } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { formatDuration } from '../../utils/timeUtils';

export const QuickStats: React.FC = () => {
  const { userStats, games, trophies } = useGameStore();

  const stats = [
    {
      label: 'Total Playtime',
      value: formatDuration(userStats.totalPlaytime * 60),
      icon: Clock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
      change: '+2.5h this week'
    },
    {
      label: 'Games Completed',
      value: userStats.gamesCompleted.toString(),
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
      change: '+2 this month'
    },
    {
      label: 'Total Trophies',
      value: userStats.totalTrophies.toString(),
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20',
      change: '+15 this week'
    },
    {
      label: 'Platinum Trophies',
      value: userStats.platinumTrophies.toString(),
      icon: Award,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
      change: '+1 this month'
    },
    {
      label: 'Current Level',
      value: userStats.level.toString(),
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/20',
      change: '89% to next level'
    },
    {
      label: 'Active Games',
      value: games.filter(g => g.status === 'playing').length.toString(),
      icon: Gamepad2,
      color: 'text-pink-400',
      bgColor: 'bg-pink-600/20',
      change: 'Currently playing'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 hover:border-gray-600 transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.change}</div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-1">{stat.label}</h4>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.random() * 100}%` }}
                transition={{ delay: index * 0.2, duration: 1 }}
                className={`h-2 rounded-full bg-gradient-to-r ${
                  stat.color.includes('blue') ? 'from-blue-500 to-blue-600' :
                  stat.color.includes('green') ? 'from-green-500 to-green-600' :
                  stat.color.includes('yellow') ? 'from-yellow-500 to-yellow-600' :
                  stat.color.includes('purple') ? 'from-purple-500 to-purple-600' :
                  stat.color.includes('orange') ? 'from-orange-500 to-orange-600' :
                  'from-pink-500 to-pink-600'
                }`}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};