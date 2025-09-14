import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Trophy,
  Gamepad2,
  Calendar,
  Target,
  X,
  Shield,
  Zap,
} from 'lucide-react';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'stats', label: 'Statistics', icon: BarChart3, badge: null },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, badge: '2' },
    { id: 'social', label: 'Social', icon: Users, badge: '5' },
    { id: 'library', label: 'Game Library', icon: Gamepad2, badge: null },
    { id: 'trophies', label: 'Trophies', icon: Trophy, badge: '3' },
    { id: 'calendar', label: 'Gaming Calendar', icon: Calendar, badge: null },
    { id: 'goals', label: 'Goals & Challenges', icon: Target, badge: '1' },
    { id: 'blockchain', label: 'Blockchain Stats', icon: Shield, badge: null },
    { id: 'proofs', label: 'zkTLS Proofs', icon: Zap, badge: null },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId);
    onClose();
    // Force a small delay to ensure state updates
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Navigation Drawer */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-gray-900 border-r border-gray-700 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">XION Gaming</h1>
                  <p className="text-sm text-gray-400">Mobile Hub</p>
                </div>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 bg-gray-800 rounded-lg text-white"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto px-2 py-1 rounded-full text-xs font-bold ${
                      item.badge === 'NEW' 
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </motion.button>
              ))}
            </nav>

            {/* User Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-4 border-t border-gray-700"
            >
              <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                <img
                  src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100"
                  alt="Your Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">YourUsername</h4>
                  <p className="text-gray-400 text-sm">Level 47 • Online</p>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};