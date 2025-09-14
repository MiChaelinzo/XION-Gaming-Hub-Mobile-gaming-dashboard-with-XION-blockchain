import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Clock, Trophy, Zap, CheckCircle, XCircle, Calendar, Gamepad2, Users } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  completed: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  game: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  participants: number;
  timeLimit: number; // hours
  reward: string;
  progress: number;
  active: boolean;
}

export const GoalsAndChallenges: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'goals' | 'challenges'>('goals');
  const [showAddGoal, setShowAddGoal] = useState(false);

  const goals: Goal[] = [
    {
      id: '1',
      title: 'Daily Gaming Session',
      description: 'Play games for at least 2 hours today',
      type: 'daily',
      target: 120,
      current: 85,
      unit: 'minutes',
      deadline: new Date(2024, 0, 16),
      reward: '50 XP',
      difficulty: 'easy',
      completed: false
    },
    {
      id: '2',
      title: 'Trophy Hunter',
      description: 'Unlock 10 trophies this week',
      type: 'weekly',
      target: 10,
      current: 7,
      unit: 'trophies',
      deadline: new Date(2024, 0, 21),
      reward: 'Rare Avatar',
      difficulty: 'medium',
      completed: false
    },
    {
      id: '3',
      title: 'Platinum Collector',
      description: 'Earn 2 platinum trophies this month',
      type: 'monthly',
      target: 2,
      current: 1,
      unit: 'platinums',
      deadline: new Date(2024, 0, 31),
      reward: 'Exclusive Theme',
      difficulty: 'hard',
      completed: false
    }
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Speed Run Challenge',
      description: 'Complete Spider-Man 2 main story in under 15 hours',
      game: 'Spider-Man 2',
      difficulty: 'hard',
      participants: 1247,
      timeLimit: 168, // 1 week
      reward: 'Golden Web Trophy',
      progress: 65,
      active: true
    },
    {
      id: '2',
      title: 'Multiplayer Domination',
      description: 'Win 50 matches in Call of Duty: MW3',
      game: 'Call of Duty: MW3',
      difficulty: 'medium',
      participants: 3892,
      timeLimit: 336, // 2 weeks
      reward: 'Elite Operator Skin',
      progress: 32,
      active: true
    },
    {
      id: '3',
      title: 'Perfect Completion',
      description: 'Complete The Last of Us Part II with 100% collectibles',
      game: 'The Last of Us Part II',
      difficulty: 'extreme',
      participants: 567,
      timeLimit: 720, // 1 month
      reward: 'Platinum Badge + 1000 XP',
      progress: 100,
      active: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'hard': return 'text-orange-400 bg-orange-900/30';
      case 'extreme': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'text-blue-400 bg-blue-900/30';
      case 'weekly': return 'text-purple-400 bg-purple-900/30';
      case 'monthly': return 'text-green-400 bg-green-900/30';
      case 'custom': return 'text-orange-400 bg-orange-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-gray-700 rounded-lg p-1">
          {(['goals', 'challenges'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddGoal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add {activeTab === 'goals' ? 'Goal' : 'Challenge'}</span>
        </motion.button>
      </div>

      {/* Goals Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'goals' && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-semibold">{goal.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(goal.type)}`}>
                        {goal.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(goal.difficulty)}`}>
                        {goal.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">{goal.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {goal.deadline.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Trophy className="w-4 h-4" />
                        <span>{goal.reward}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {goal.current}/{goal.target}
                    </div>
                    <div className="text-sm text-gray-400">{goal.unit}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      transition={{ delay: index * 0.2, duration: 1 }}
                      className={`h-2 rounded-full ${
                        goal.current >= goal.target ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gray-800 rounded-xl p-6 border ${
                  challenge.active ? 'border-purple-500/50' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-white font-semibold">{challenge.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </span>
                      {challenge.active ? (
                        <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-900/30 text-gray-400 rounded-full text-xs font-medium">
                          Completed
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">{challenge.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-300">
                        <Gamepad2 className="w-4 h-4" />
                        <span>{challenge.game}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-400">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants.toLocaleString()} players</span>
                      </div>
                      <div className="flex items-center space-x-1 text-orange-400">
                        <Clock className="w-4 h-4" />
                        <span>{Math.floor(challenge.timeLimit / 24)} days left</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      {challenge.progress}%
                    </div>
                    <div className="text-sm text-gray-400">Complete</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-yellow-400 font-medium">
                      Reward: {challenge.reward}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${challenge.progress}%` }}
                      transition={{ delay: index * 0.2, duration: 1 }}
                      className={`h-2 rounded-full ${
                        challenge.progress >= 100 ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                    />
                  </div>
                </div>
                
                {challenge.active && (
                  <div className="mt-4 flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                    >
                      Leave Challenge
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showAddGoal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddGoal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <h3 className="text-xl font-bold text-white mb-4">Create New Goal</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Goal Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter goal title..."
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your goal..."
                    rows={3}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="extreme">Extreme</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddGoal(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Create Goal
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};