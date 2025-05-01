import React from 'react';
import { motion } from 'framer-motion';
import SuggestedPrompts from '../SuggestedPrompts';

const EmptyStateScreen = ({ 
  showSuggestions = true, 
  handlePromptSelect,
  user 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex justify-center mb-6"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Hello, {user?.user_metadata?.full_name || 'there'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 dark:text-gray-300"
          >
            How can I help you today?
          </motion.p>
        </div>
        
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <SuggestedPrompts onPromptSelect={handlePromptSelect} />
          </motion.div>
        )}
        
        {!showSuggestions && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-gray-600 dark:text-gray-400"
          >
            <p>Type a message below to start a conversation</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EmptyStateScreen; 