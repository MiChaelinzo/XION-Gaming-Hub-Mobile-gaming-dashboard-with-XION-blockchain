import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Shield, Smartphone, Fingerprint, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { useXion } from '../../hooks/useXion';

export const WalletConnection: React.FC = () => {
  const { 
    isConnected, 
    walletAddress, 
    loading, 
    biometricsEnabled, 
    connectWallet, 
    disconnectWallet, 
    authenticateWithBiometrics 
  } = useXion();
  
  const [showBiometrics, setShowBiometrics] = useState(false);

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success && biometricsEnabled) {
      setShowBiometrics(true);
    }
  };

  const handleBiometricSetup = async () => {
    await authenticateWithBiometrics();
    setShowBiometrics(false);
  };

  if (isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-600 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">XION Wallet Connected</h3>
              <p className="text-green-300 text-sm">Dave Mobile Toolkit Active</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={disconnectWallet}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Disconnect
          </motion.button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Wallet Address:</span>
            <span className="text-white font-mono">
              {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">Network:</span>
            <span className="text-blue-300">XION Testnet</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">zkTLS Status:</span>
            <div className="flex items-center space-x-1 text-green-400">
              <Shield className="w-4 h-4" />
              <span>Active</span>
            </div>
          </div>

          {biometricsEnabled && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Biometrics:</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => authenticateWithBiometrics()}
                className="flex items-center space-x-1 text-purple-400 hover:text-purple-300"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Authenticate</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Mobile Features */}
        <div className="mt-4 pt-4 border-t border-green-500/30">
          <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
            <Smartphone className="w-4 h-4" />
            <span>Mobile Features</span>
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-blue-600/20 rounded p-2 text-center">
              <Zap className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-blue-300">Fast Transactions</div>
            </div>
            <div className="bg-purple-600/20 rounded p-2 text-center">
              <Shield className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              <div className="text-purple-300">zkTLS Proofs</div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-gray-700 text-center"
      >
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Connect XION Wallet</h3>
          <p className="text-gray-400 text-sm">
            Connect your XION wallet using Dave Mobile Toolkit to access blockchain features
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <Shield className="w-5 h-5 text-green-400" />
            <span>Zero-knowledge proofs for gaming sessions</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-300">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <span>Mobile-optimized wallet experience</span>
          </div>
          {biometricsEnabled && (
            <div className="flex items-center space-x-3 text-sm text-gray-300">
              <Fingerprint className="w-5 h-5 text-purple-400" />
              <span>Biometric authentication support</span>
            </div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              <span>Connect XION Wallet</span>
            </>
          )}
        </motion.button>

        <p className="text-xs text-gray-500 mt-3">
          Powered by XION Dave Mobile Toolkit
        </p>
      </motion.div>

      {/* Biometric Setup Modal */}
      <AnimatePresence>
        {showBiometrics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Fingerprint className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Enable Biometric Security</h3>
                <p className="text-gray-400 text-sm">
                  Secure your wallet with biometric authentication for enhanced mobile security
                </p>
              </div>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBiometrics(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Skip for Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBiometricSetup}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Enable Biometrics
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};