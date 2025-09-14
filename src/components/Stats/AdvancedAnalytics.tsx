import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Zap, Target, Trophy } from 'lucide-react';
import { useGameStore } from '../../stores/gameStore';

export const AdvancedAnalytics: React.FC = () => {
  const { weeklyActivity, genreStats, userStats } = useGameStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  const playtimeData = [
    { month: 'Aug', hours: 45, target: 40 },
    { month: 'Sep', hours: 52, target: 45 },
    { month: 'Oct', hours: 38, target: 40 },
    { month: 'Nov', hours: 61, target: 50 },
    { month: 'Dec', hours: 58, target: 55 },
    { month: 'Jan', hours: 67, target: 60 }
  ];

  const trophyProgressData = [
    { week: 'Week 1', bronze: 12, silver: 5, gold: 2, platinum: 0 },
    { week: 'Week 2', bronze: 8, silver: 7, gold: 3, platinum: 1 },
    { week: 'Week 3', bronze: 15, silver: 4, gold: 1, platinum: 0 },
    { week: 'Week 4', bronze: 10, silver: 6, gold: 4, platinum: 1 }
  ];

  const performanceMetrics = [
    { metric: 'Completion Rate', value: userStats.completionRate, target: 80, unit: '%' },
    { metric: 'Session Length', value: userStats.averageSessionLength, target: 120, unit: 'min' },
    { metric: 'Weekly Hours', value: 28.5, target: 25, unit: 'hrs' },
    { metric: 'Trophy Rate', value: 2.3, target: 2.0, unit: '/day' }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Advanced Analytics</h2>
        <div className="flex bg-gray-700 rounded-lg p-1">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={metric.metric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-300 text-sm font-medium">{metric.metric}</h4>
              <TrendingUp className={`w-4 h-4 ${metric.value >= metric.target ? 'text-green-400' : 'text-yellow-400'}`} />
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {metric.value}{metric.unit}
              </div>
              <div className="text-sm text-gray-400">
                Target: {metric.target}{metric.unit}
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  transition={{ delay: index * 0.2, duration: 1 }}
                  className={`h-2 rounded-full ${
                    metric.value >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span>Weekly Activity</span>
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#3B82F6"
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Genre Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-400" />
            <span>Genre Distribution</span>
          </h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genreStats}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="hours"
                label={({ genre, percent }) => `${genre} ${(percent * 100).toFixed(0)}%`}
              >
                {genreStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Monthly Playtime Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Playtime Trends vs Goals</span>
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={playtimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="hours" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#10B981" radius={[4, 4, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Trophy Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span>Trophy Progress (Last 4 Weeks)</span>
        </h3>
        
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={trophyProgressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="week" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
            />
            <Bar dataKey="bronze" stackId="a" fill="#CD7F32" />
            <Bar dataKey="silver" stackId="a" fill="#C0C0C0" />
            <Bar dataKey="gold" stackId="a" fill="#FFD700" />
            <Bar dataKey="platinum" stackId="a" fill="#E5E7EB" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};