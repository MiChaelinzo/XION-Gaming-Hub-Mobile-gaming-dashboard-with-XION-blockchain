import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  BarChart3, 
  MessageSquare, 
  Users, 
  Settings, 
  Trophy,
  Gamepad2,
  Bell,
  Search,
  Calendar,
  Target
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
    { id: 'stats', label: 'Statistics', icon: BarChart3, badge: null },
    { id: 'assistant', label: 'AI Assistant', icon: MessageSquare, badge: '2' },
    { id: 'social', label: 'Social', icon: Users, badge: '5' },
    { id: 'library', label: 'Game Library', icon: Gamepad2, badge: null },
    { id: 'trophies', label: 'Trophies', icon: Trophy, badge: '3' },
    { id: 'calendar', label: 'Gaming Calendar', icon: Calendar, badge: null },
    { id: 'goals', label: 'Goals & Challenges', icon: Target, badge: '1' }
  ];

  const bottomItems = [
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '12' },
    { id: 'search', label: 'Search', icon: Search, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col h-full"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">PlayStation</h1>
            <p className="text-sm text-gray-400">Gaming Hub</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        {bottomItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (menuItems.length + index) * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </div>

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
  );
};