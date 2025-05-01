import React from 'react';
import { motion } from 'framer-motion';

const UserProfileCard = ({ user, profile }) => {
  // Calculate member duration
  const getMemberDuration = () => {
    const createdAt = new Date(user?.created_at || Date.now());
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      
      if (remainingMonths === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      }
      return `${years} year${years > 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  };

  const MotionIcon = ({ delay, children }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className="absolute"
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-semibold">User Profile</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Member for {getMemberDuration()}
        </span>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
          <div className="relative mb-6 md:mb-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <MotionIcon delay={0.2}>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-400 opacity-40"></div>
              </MotionIcon>
              <MotionIcon delay={0.3}>
                <div className="absolute -bottom-3 -left-1 w-4 h-4 rounded-full bg-indigo-400 opacity-40"></div>
              </MotionIcon>
              <MotionIcon delay={0.4}>
                <div className="absolute top-2 -left-3 w-3 h-3 rounded-full bg-pink-400 opacity-40"></div>
              </MotionIcon>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.email?.split('@')[0] || 'User'}
                </div>
                <div className="text-gray-500 dark:text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  {user?.email}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 py-2 px-4 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
                Edit Profile
              </motion.button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-sm">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Credits</div>
                <div className="flex items-center mt-2">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.credits || 0}</span>
                  <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">Available to use</span>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-sm">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Usage Statistics</div>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{profile?.usage || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Credits used this month</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200 dark:bg-gray-600"></div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{profile?.conversations || 0}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total conversations</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserProfileCard; 