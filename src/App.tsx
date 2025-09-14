import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { MobileHeader } from './components/Mobile/MobileHeader';
import { MobileNavigation } from './components/Mobile/MobileNavigation';
import { GameTimer } from './components/Dashboard/GameTimer';
import { QuickStats } from './components/Dashboard/QuickStats';
import { RecentActivity } from './components/Dashboard/RecentActivity';
import { GameLibrary } from './components/Dashboard/GameLibrary';
import { AdvancedAnalytics } from './components/Stats/AdvancedAnalytics';
import { TrophyShowcase } from './components/Stats/TrophyShowcase';
import { AIGameAssistant } from './components/Assistant/AIGameAssistant';
import { FriendsPanel } from './components/Social/FriendsPanel';
import { Leaderboards } from './components/Social/Leaderboards';
import { GamingCalendar } from './components/Features/GamingCalendar';
import { GoalsAndChallenges } from './components/Features/GoalsAndChallenges';
import { BlockchainStats } from './components/Blockchain/BlockchainStats';
import { ZkTLSProofs } from './components/Blockchain/ZkTLSProofs';
import { WalletConnection } from './components/Blockchain/WalletConnection';
import { useGameStore } from './stores/gameStore';
import { useXion } from './hooks/useXion';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSessionActive, sessionDuration, initializeWithDemoData } = useGameStore();
  const { isConnected: isXionConnected } = useXion();

  // Initialize with demo data on app start
  useEffect(() => {
    initializeWithDemoData();
  }, [initializeWithDemoData]);

  // Show XION wallet connection for blockchain features
  const showXionConnection = activeTab === 'blockchain' || activeTab === 'proofs';
  const requiresXion = showXionConnection && !isXionConnected;

  const renderMainContent = () => {
    // Show XION connection for blockchain features
    if (requiresXion) {
      return (
        <div className="max-w-md mx-auto">
          <WalletConnection />
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <QuickStats />
              </div>
              <div>
                <GameTimer />
              </div>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <RecentActivity />
              <FriendsPanel />
            </div>
            
            <GameLibrary />
          </div>
        );
      
      case 'stats':
        return (
          <div className="space-y-6">
            <AdvancedAnalytics />
            <TrophyShowcase />
          </div>
        );
      
      case 'assistant':
        return (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <AIGameAssistant />
            </div>
            <div className="space-y-6">
              <RecentActivity />
            </div>
          </div>
        );
      
      case 'social':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <FriendsPanel />
              <Leaderboards />
            </div>
          </div>
        );
      
      case 'library':
        return <GameLibrary />;
      
      case 'trophies':
        return <TrophyShowcase />;
      
      case 'calendar':
        return <GamingCalendar />;
      
      case 'goals':
        return <GoalsAndChallenges />;
      
      case 'blockchain':
        return <BlockchainStats />;
      
      case 'proofs':
        return (
          <div className="space-y-6">
            <ZkTLSProofs />
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-400 text-lg">Feature coming soon...</p>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Gaming Dashboard';
      case 'stats': return 'Statistics';
      case 'assistant': return 'AI Assistant';
      case 'social': return 'Social Hub';
      case 'library': return 'Game Library';
      case 'trophies': return 'Trophy Showcase';
      case 'calendar': return 'Gaming Calendar';
      case 'goals': return 'Goals & Challenges';
      case 'blockchain': return 'Blockchain Stats';
      case 'proofs': return 'zkTLS Proofs';
      default: return 'XION Gaming Hub';
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Welcome back! Ready for another gaming session?';
      case 'stats': return 'Analyze your gaming performance and progress';
      case 'assistant': return 'Get personalized gaming advice and strategies';
      case 'social': return 'Connect with friends and compete on leaderboards';
      case 'library': return 'Manage your game collection and progress';
      case 'trophies': return 'Showcase your achievements and trophies';
      case 'calendar': return 'Plan your gaming sessions and events';
      case 'goals': return 'Set and track your gaming objectives';
      case 'blockchain': return 'View your XION blockchain statistics';
      case 'proofs': return 'Manage your zero-knowledge gaming proofs';
      default: return 'Your mobile gaming companion';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#F9FAFB',
            border: '1px solid #374151'
          }
        }}
      />
      
      {/* Mobile Header */}
      <MobileHeader 
        onMenuToggle={() => setIsMenuOpen(true)}
        title={getPageTitle()}
        subtitle={getPageSubtitle()}
      />
      
      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {/* Session Status Indicator */}
        <AnimatePresence>
          {isSessionActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mb-4 flex items-center space-x-3 bg-green-600/20 border border-green-500/50 rounded-lg px-4 py-2"
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <div className="text-green-300">
                <div className="text-sm font-medium">Session Active</div>
                <div className="text-xs">
                  {Math.floor(sessionDuration / 3600)}h {Math.floor((sessionDuration % 3600) / 60)}m
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderMainContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;