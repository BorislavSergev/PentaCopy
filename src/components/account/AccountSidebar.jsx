import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AccountSidebar = ({ user, profile, sidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  // Navigation links with icons
  const navigationLinks = [
    {
      name: 'Chat',
      path: '/chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
        </svg>
      ),
      current: location.pathname === '/chat'
    },
    {
      name: 'Account',
      path: '/account',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      ),
      current: location.pathname === '/account'
    }
  ];

  // Sidebar animation
  const sidebarVariants = {
    hidden: { x: -256 },
    visible: { 
      x: 0, 
      transition: { 
        type: 'spring',
        stiffness: 300, 
        damping: 30 
      } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className={`w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col flex-shrink-0 fixed md:static inset-y-0 left-0 z-20 h-full ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0'
      }`}
    >
      {/* Logo and title */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold mr-2">P</div>
            <span className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PentaCopy</span>
          </div>
        </div>
      </div>
      
      {/* Navigation Links - Using flex-grow to push user profile to bottom */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-4">Navigation</h3>
        <nav className="space-y-1">
          {navigationLinks.map((item) => (
            <Link 
              key={item.name}
              to={item.path} 
              className={`flex items-center px-3 py-2 rounded-md ${
                item.current 
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 font-medium' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className={`mr-3 ${item.current ? 'text-indigo-500' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      {/* User Profile Section - At bottom with mt-auto */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-3 flex-1 truncate">
            <div className="text-sm font-medium truncate">{user?.email?.split('@')[0] || 'User'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{profile?.credits || 0} credits</div>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme} 
            title="Toggle Theme"
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
          >
            {theme === 'dark' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSidebar; 