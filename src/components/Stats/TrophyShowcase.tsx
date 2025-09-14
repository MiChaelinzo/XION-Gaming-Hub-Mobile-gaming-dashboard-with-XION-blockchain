import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Star, Filter, Search, Calendar } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { formatDistanceToNow } from 'date-fns';

export const TrophyShowcase: React.FC = () => {
  const { trophies = [], games = [] } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'platinum'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'rarity' | 'alphabetical'>('recent');

  const filteredTrophies = trophies
    .filter(trophy => {
      const matchesFilter = filter === 'all' || trophy.type === filter;
      const matchesSearch = trophy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trophy.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0);
        case 'rarity':
          return a.rarity - b.rarity;
        case 'alphabetical':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const getTrophyColor = (type: string) => {
    switch (type) {
      case 'platinum': return 'from-purple-500 to-purple-700';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'bronze': return 'from-orange-400 to-orange-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityColor = (rarity: number) => {
    if (rarity < 10) return 'text-purple-400';
    if (rarity < 25) return 'text-yellow-400';
    if (rarity < 50) return 'text-blue-400';
    if (rarity < 75) return 'text-green-400';
    return 'text-gray-400';
  };

  const trophyStats = {
    total: trophies.length,
    platinum: trophies.filter(t => t.type === 'platinum').length,
    gold: trophies.filter(t => t.type === 'gold').length,
    silver: trophies.filter(t => t.type === 'silver').length,
    bronze: trophies.filter(t => t.type === 'bronze').length,
    averageRarity: trophies.reduce((sum, t) => sum + t.rarity, 0) / trophies.length
  };

  return (
    <div className="space-y-6">
      {/* Trophy Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: trophyStats.total, color: 'text-white', bg: 'bg-gray-700' },
          { label: 'Platinum', value: trophyStats.platinum, color: 'text-purple-400', bg: 'bg-purple-900/30' },
          { label: 'Gold', value: trophyStats.gold, color: 'text-yellow-400', bg: 'bg-yellow-900/30' },
          { label: 'Silver', value: trophyStats.silver, color: 'text-gray-300', bg: 'bg-gray-700/50' },
          { label: 'Bronze', value: trophyStats.bronze, color: 'text-orange-400', bg: 'bg-orange-900/30' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.bg} rounded-lg p-4 text-center border border-gray-600`}
          >
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search trophies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">All Trophies</option>
          <option value="platinum">Platinum</option>
          <option value="gold">Gold</option>
          <option value="silver">Silver</option>
          <option value="bronze">Bronze</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="recent">Most Recent</option>
          <option value="rarity">Rarity</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Trophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredTrophies.map((trophy, index) => {
            const game = games.find(g => g.id === trophy.gameId);
            return (
              <motion.div
                key={trophy.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${getTrophyColor(trophy.type)} flex items-center justify-center text-2xl shadow-lg`}>
                    {trophy.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-white font-semibold truncate">{trophy.name}</h4>
                      <span className={`text-xs font-medium ${getRarityColor(trophy.rarity)}`}>
                        {trophy.rarity.toFixed(1)}%
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {trophy.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{game?.title}</span>
                      {trophy.unlockedAt && (
                        <span className="text-gray-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDistanceToNow(trophy.unlockedAt, { addSuffix: true })}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredTrophies.length === 0 && (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No trophies found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};