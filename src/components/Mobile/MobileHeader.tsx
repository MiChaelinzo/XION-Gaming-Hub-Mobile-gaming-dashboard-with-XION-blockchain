import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, User } from 'lucide-react';

interface MobileHeaderProps {
  onMenuToggle: () => void;
  title: string;
  subtitle?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onMenuToggle, title, subtitle }) => {

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between"
    >
      <div className="flex items-center space-x-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMenuToggle}
          className="p-2 bg-gray-800 rounded-lg text-white"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2">
          <User className="w-4 h-4 text-blue-400" />
          <span className="text-white text-sm font-medium">DemoPlayer</span>
          <span className="text-gray-400 text-xs">Lv.47</span>
        </div>

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gray-800 rounded-lg text-white relative"
        >
          <Bell className="w-4 h-4" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </div>
        </motion.button>
      </div>
    </motion.header>
  );
};