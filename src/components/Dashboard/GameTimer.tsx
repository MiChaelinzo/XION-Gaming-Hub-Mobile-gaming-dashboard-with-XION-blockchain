import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, Clock, Zap, Target } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';
import { formatDuration } from '../../utils/timeUtils';

export const GameTimer: React.FC = () => {
  const {
    currentGame,
    isSessionActive,
    isPaused,
    sessionDuration,
    sessionStartTime,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    games
  } = useGameStore();

  const [localDuration, setLocalDuration] = useState(0);
  const [selectedGameId, setSelectedGameId] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSessionActive && !isPaused && sessionStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
        setLocalDuration(duration);
        useGameStore.setState({ sessionDuration: duration });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive, isPaused, sessionStartTime]);

  const handleStartSession = () => {
    const game = games.find(g => g.id === selectedGameId);
    if (game) {
      startSession(game);
    }
  };

  const getSessionStats = () => {
    if (!currentGame) return null;
    
    const hoursPlayed = Math.floor(localDuration / 3600);
    const minutesPlayed = Math.floor((localDuration % 3600) / 60);
    const xpGained = Math.floor(localDuration / 60) * 10; // 10 XP per minute
    
    return { hoursPlayed, minutesPlayed, xpGained };
  };

  const stats = getSessionStats();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl p-6 shadow-xl border border-blue-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Game Session</h3>
            <p className="text-blue-200 text-sm">Track your gaming time</p>
          </div>
        </div>
        
        <AnimatePresence>
          {isSessionActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center space-x-2"
            >
              <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-yellow-400' : 'bg-green-400'} animate-pulse`} />
              <span className="text-sm text-white font-medium">
                {isPaused ? 'Paused' : 'Recording'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isSessionActive ? (
        <div className="space-y-4">
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="w-full bg-blue-800 border border-blue-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select a game to start session</option>
            {games.map(game => (
              <option key={game.id} value={game.id}>
                {game.title} ({game.platform})
              </option>
            ))}
          </select>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartSession}
            disabled={!selectedGameId}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Session</span>
          </motion.button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-white mb-2">
              {currentGame?.title}
            </h4>
            <div className="text-4xl font-bold text-blue-300 mb-2 font-mono">
              {formatDuration(localDuration)}
            </div>
            <p className="text-blue-200 text-sm">Current session</p>
          </div>

          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-800/50 rounded-lg p-3 text-center">
                <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{stats.xpGained}</div>
                <div className="text-xs text-blue-200">XP Gained</div>
              </div>
              <div className="bg-blue-800/50 rounded-lg p-3 text-center">
                <Target className="w-5 h-5 text-green-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{stats.hoursPlayed}h {stats.minutesPlayed}m</div>
                <div className="text-xs text-blue-200">This Session</div>
              </div>
              <div className="bg-blue-800/50 rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <div className="text-lg font-bold text-white">{Math.floor(currentGame?.totalPlaytime! / 60)}h</div>
                <div className="text-xs text-blue-200">Total Time</div>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isPaused ? resumeSession : pauseSession}
              className={`flex-1 ${isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2`}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={endSession}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <Square className="w-4 h-4" />
              <span>End Session</span>
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
};