import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileSection = ({ user }) => {
  const navigate = useNavigate();
  
  if (!user) return null;
  
  return (
    <div className="mt-auto border-t border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-gray-900">
      <div 
        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors group"
        onClick={() => navigate('/account')}
        role="button"
        tabIndex={0}
        aria-label="Go to account settings"
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
              {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]">
              {user.user_metadata?.full_name || user.email || 'User'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
              {user.email}
            </span>
          </div>
        </div>
        <div className="text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection; 