import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Star, Clock, Trophy, Filter, Search, Plus } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { formatDuration } from '../../utils/timeUtils';

export const GameLibrary: React.FC = () => {
  const { games, updateGame } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'playing' | 'completed' | 'backlog'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'lastPlayed' | 'playtime' | 'rating'>('lastPlayed');

  const filteredGames = games
    .filter(game => {
      const matchesFilter = filter === 'all' || game.status === filter;
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.genre.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'lastPlayed':
          return b.lastPlayed.getTime() - a.lastPlayed.getTime();
        case 'playtime':
          return b.totalPlaytime - a.totalPlaytime;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'playing': return 'bg-green-600';
      case 'completed': return 'bg-blue-600';
      case 'backlog': return 'bg-yellow-600';
      case 'abandoned': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'playing': return 'Currently Playing';
      case 'completed': return 'Completed';
      case 'backlog': return 'In Backlog';
      case 'abandoned': return 'Abandoned';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Game Library</h3>
            <p className="text-gray-400 text-sm">{games.length} games in collection</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="all">All Games</option>
            <option value="playing">Currently Playing</option>
            <option value="completed">Completed</option>
            <option value="backlog">Backlog</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="lastPlayed">Last Played</option>
            <option value="playtime">Playtime</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700 transition-all cursor-pointer border border-gray-600 hover:border-gray-500"
            >
              <div className="flex space-x-4">
                <div className="relative">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  {game.onlineStatus === 'online' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-700" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-semibold truncate">{game.title}</h4>
                    {game.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-sm font-medium">{game.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                    <span>{game.platform}</span>
                    <span>•</span>
                    <span>{game.genre}</span>
                    <span>•</span>
                    <span>{formatDuration(game.totalPlaytime * 60)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(game.status)}`}>
                        {getStatusText(game.status)}
                      </span>
                      {game.multiplayer && (
                        <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded-full text-xs font-medium">
                          Multiplayer
                        </span>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Progress</div>
                      <div className="text-sm font-medium text-white">{game.progress}%</div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-600 rounded-full h-1.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${game.progress}%` }}
                        transition={{ delay: index * 0.1, duration: 1 }}
                        className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredGames.length === 0 && (
        <div className="text-center py-8">
          <Gamepad2 className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No games found matching your criteria</p>
        </div>
      )}
    </motion.div>
  );
};