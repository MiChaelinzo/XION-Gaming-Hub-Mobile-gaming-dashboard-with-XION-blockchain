import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Eye, Download, CheckCircle, AlertCircle, Clock, Zap, Lock } from 'lucide-react';
import { useXion } from '../../hooks/useXion';
import { ZkTLSProof } from '../../services/xionService';

export const ZkTLSProofs: React.FC = () => {
  const { isConnected, createGameProof, verifyAchievement, getAllProofs } = useXion();
  const [proofs, setProofs] = useState<ZkTLSProof[]>([]);
  const [selectedProof, setSelectedProof] = useState<ZkTLSProof | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      loadProofs();
    }
  }, [isConnected]);

  const loadProofs = async () => {
    try {
      setLoading(true);
      
      const allProofs = await getAllProofs();
      setProofs(allProofs);
    } catch (error) {
      console.error('Failed to load proofs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateNewProof = async () => {
    try {
      setIsGenerating(true);
      
      const gameData = {
        gameId: 'current-game',
        startTime: new Date(Date.now() - 1800000), // 30 minutes ago
        endTime: new Date(),
        achievements: ['session_complete'],
        stats: {
          playtime: 1800,
          score: 12500
        }
      };

      const proof = await createGameProof(gameData);
      
      if (proof) {
        setProofs(prev => [proof, ...prev]);
      }
    } catch (error) {
      console.error('Failed to generate proof:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDuration = (start: Date, end: Date) => {
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    return `${duration} minutes`;
  };

  const getGameName = (gameId: string) => {
    const gameNames: { [key: string]: string } = {
      'spiderman-2': 'Spider-Man 2',
      'cod-mw3': 'Call of Duty: MW3',
      'current-game': 'Current Session'
    };
    return gameNames[gameId] || gameId;
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Shield className="w-16 h-16 text-gray-500" />
        <h3 className="text-xl font-semibold text-white">Connect Your Wallet</h3>
        <p className="text-gray-400 text-center">
          Connect your XION wallet to view and generate zkTLS proofs
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Generate Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">zkTLS Proofs</h2>
          <p className="text-gray-400">Zero-knowledge proofs of your gaming sessions</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateNewProof}
          disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Generate Proof</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Proofs List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {proofs.map((proof, index) => (
          <motion.div
            key={proof.sessionId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-colors cursor-pointer"
            onClick={() => setSelectedProof(proof)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {getGameName(proof.gameData.gameId)}
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Session ID: {proof.sessionId.slice(-8)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-medium">{proof.verified ? 'Verified' : 'Pending'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">
                  {formatDuration(proof.gameData.startTime, proof.gameData.endTime)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Achievements:</span>
                <span className="text-white">{proof.gameData.achievements.length}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Generated:</span>
                <span className="text-white">{formatTimestamp(proof.timestamp)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-mono">
                  {proof.signature.slice(0, 20)}...
                </span>
                <Eye className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {proofs.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Proofs Generated</h3>
          <p className="text-gray-400 mb-4">
            Generate your first zkTLS proof to verify your gaming sessions
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateNewProof}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Generate First Proof
          </motion.button>
        </div>
      )}

      {/* Proof Detail Modal */}
      <AnimatePresence>
        {selectedProof && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedProof(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl border border-gray-700 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">zkTLS Proof Details</h3>
                <button
                  onClick={() => setSelectedProof(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Game Info */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Game Session</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Game:</span>
                      <span className="text-white ml-2">
                        {getGameName(selectedProof.gameData.gameId)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Player:</span>
                      <span className="text-white ml-2 font-mono">
                        {selectedProof.gameData.playerId.slice(0, 12)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Start Time:</span>
                      <span className="text-white ml-2">
                        {selectedProof.gameData.startTime.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">End Time:</span>
                      <span className="text-white ml-2">
                        {selectedProof.gameData.endTime.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Achievements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProof.gameData.achievements.map((achievement, index) => (
                      <span
                        key={index}
                        className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-sm"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Session Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {Object.entries(selectedProof.gameData.stats).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-400 capitalize">{key}:</span>
                        <span className="text-white ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cryptographic Proof */}
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-3">Cryptographic Proof</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Signature:</span>
                      <div className="bg-gray-800 rounded p-2 mt-1">
                        <code className="text-green-400 text-xs font-mono break-all">
                          {selectedProof.signature}
                        </code>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm">Merkle Root:</span>
                      <div className="bg-gray-800 rounded p-2 mt-1">
                        <code className="text-blue-400 text-xs font-mono break-all">
                          {selectedProof.merkleRoot}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Proof</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => verifyAchievement(selectedProof)}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Verify Proof</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Verify on Chain
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