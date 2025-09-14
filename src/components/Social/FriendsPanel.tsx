import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageCircle, Gamepad2, UserPlus, Search, Crown, Zap } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { formatDistanceToNow } from 'date-fns';

export const FriendsPanel: React.FC = () => {
  const { friends, onlineFriends } = useGameStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

  const filteredFriends = friends
    .filter(friend => {
      const matchesSearch = friend.username.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
                           (filter === 'online' && friend.status === 'online') ||
                           (filter === 'offline' && friend.status !== 'online');
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Online friends first, then by last seen
      if (a.status === 'online' && b.status !== 'online') return -1;
      if (a.status !== 'online' && b.status === 'online') return 1;
      return b.lastSeen.getTime() - a.lastSeen.getTime();
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-600 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Friends</h3>
            <p className="text-gray-400 text-sm">
              {onlineFriends.length} of {friends.length} online
            </p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors"
        >
          <UserPlus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="flex space-x-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="all">All</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Online Friends Quick View */}
      {onlineFriends.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-green-400" />
            <span>Currently Online</span>
          </h4>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {onlineFriends.map((friend) => (
              <motion.div
                key={friend.id}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-600 transition-colors min-w-[120px]"
              >
                <div className="relative mb-2">
                  <img
                    src={friend.avatar}
                    alt={friend.username}
                    className="w-12 h-12 rounded-full mx-auto"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-gray-700`} />
                </div>
                <p className="text-white text-xs font-medium text-center truncate">
                  {friend.username}
                </p>
                {friend.currentGame && (
                  <p className="text-gray-400 text-xs text-center truncate">
                    {friend.currentGame}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        <AnimatePresence>
          {filteredFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
              className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all cursor-pointer"
            >
              <div className="relative">
                <img
                  src={friend.avatar}
                  alt={friend.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-gray-700`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-white font-medium truncate">{friend.username}</h4>
                  {friend.mutualGames > 10 && (
                    <Crown className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                
                <div className="text-sm text-gray-400">
                  {friend.status === 'online' && friend.currentGame ? (
                    <span className="text-green-400">Playing {friend.currentGame}</span>
                  ) : (
                    <span>Last seen {formatDistanceToNow(friend.lastSeen, { addSuffix: true })}</span>
                  )}
                </div>
                
                <div className="text-xs text-gray-500">
                  {friend.mutualGames} mutual games
                </div>
              </div>
              
              <div className="flex space-x-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                </motion.button>
                
                {friend.status === 'online' && friend.currentGame && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    <Gamepad2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredFriends.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No friends found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filter</p>
        </div>
      )}
    </motion.div>
  );
};