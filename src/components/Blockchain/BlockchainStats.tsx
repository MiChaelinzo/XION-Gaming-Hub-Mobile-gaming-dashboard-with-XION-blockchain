import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Trophy, TrendingUp, Wallet, Lock, CheckCircle, Clock } from 'lucide-react';
import { useXion } from '../../hooks/useXion';
import { xionService } from '../../services/xionService';

export const BlockchainStats: React.FC = () => {
  const { isConnected, walletAddress, transactions } = useXion();
  const [stats, setStats] = useState({
    totalAchievements: 0,
    verifiedProofs: 0,
    chainTransactions: 0,
    reputationScore: 0,
    stakingRewards: 0,
    nftTrophies: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadBlockchainStats();
    }
  }, [isConnected, walletAddress]);

  const loadBlockchainStats = async () => {
    try {
      setLoading(true);
      
      const playerStats = await xionService.getPlayerStats(walletAddress!);
      
      if (playerStats) {
        setStats({
          totalAchievements: playerStats.achievements,
          verifiedProofs: playerStats.verifiedProofs,
          chainTransactions: playerStats.transactions,
          reputationScore: playerStats.reputation,
          stakingRewards: playerStats.stakingRewards,
          nftTrophies: playerStats.nftTrophies
        });
      }
      
    } catch (error) {
      console.error('Failed to load blockchain stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Achievements',
      value: stats.totalAchievements,
      icon: Trophy,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20',
      change: '+3 this week'
    },
    {
      label: 'Verified Proofs',
      value: stats.verifiedProofs,
      icon: Shield,
      color: 'text-green-400',
      bgColor: 'bg-green-600/20',
      change: '+2 this week'
    },
    {
      label: 'Chain Transactions',
      value: stats.chainTransactions,
      icon: Zap,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/20',
      change: '+12 this month'
    },
    {
      label: 'Reputation Score',
      value: stats.reputationScore.toFixed(1),
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/20',
      change: '+0.3 this month'
    },
    {
      label: 'Staking Rewards',
      value: `${stats.stakingRewards} XION`,
      icon: Wallet,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/20',
      change: '+0.15 today'
    },
    {
      label: 'NFT Trophies',
      value: stats.nftTrophies,
      icon: Lock,
      color: 'text-pink-400',
      bgColor: 'bg-pink-600/20',
      change: '+1 this week'
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'achievement': return Trophy;
      case 'proof': return Shield;
      case 'reward': return Wallet;
      default: return Zap;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Shield className="w-16 h-16 text-gray-500" />
        <h3 className="text-xl font-semibold text-white">Connect Your Wallet</h3>
        <p className="text-gray-400 text-center">
          Connect your XION wallet to view blockchain statistics and verified achievements
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
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
            
            <h4 className="text-white font-semibold">{stat.label}</h4>
          </motion.div>
        ))}
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700"
      >
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Zap className="w-6 h-6 text-blue-400" />
          <span>Recent Blockchain Activity</span>
        </h3>

        <div className="space-y-4">
          {transactions.slice(0, 5).map((tx, index) => {
            const Icon = getTransactionIcon(tx.type);
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium">{tx.description}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>Hash: {tx.hash.slice(0, 12)}...</span>
                    <span>•</span>
                    <span>{tx.timestamp.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">{tx.value}</div>
                  <div className={`text-sm flex items-center space-x-1 ${getStatusColor(tx.status)}`}>
                    {tx.status === 'confirmed' ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    <span className="capitalize">{tx.status}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>No transactions yet. Start gaming to see your blockchain activity!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Wallet Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/50"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold mb-2">Connected Wallet</h4>
            <p className="text-blue-300 font-mono text-sm">{walletAddress}</p>
            <p className="text-gray-400 text-sm mt-1">XION Testnet</p>
          </div>
          <div className="text-right">
            <div className="text-green-400 text-sm font-medium">✓ Verified</div>
            <div className="text-gray-400 text-xs">zkTLS Enabled</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};