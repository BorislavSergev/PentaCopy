import React from 'react';
import { motion } from 'framer-motion';
import { createMarkdownHTML } from '../../utils/markdown';

const ChatMessage = ({ message, index, isLast, prefersReducedMotion = false, isMobile = false }) => {
  const isUserMessage = message.role === 'user';
  const messageContent = createMarkdownHTML(message.content || '');
  
  // Animation variants
  const messageVariants = prefersReducedMotion 
    ? { 
        initial: { opacity: 1 },
        animate: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      };

  // Handle pending message state
  if (message.isPending) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full py-4 px-4 md:py-5 md:px-5 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4">
            <div className="animate-pulse flex space-x-2 items-center">
              <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
              <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
              <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
            </div>
            <span className="ml-2">Thinking...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`message-${index}`}
      variants={messageVariants}
      initial="initial"
      animate="animate"
      className={`w-full py-4 md:py-6 px-4 md:px-8 ${isUserMessage ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'} border-b border-gray-200 dark:border-gray-700`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Message header with user or AI icon */}
        <div className="flex items-center mb-3 md:mb-4 text-gray-700 dark:text-gray-200">
          <div className={`w-6 h-6 md:w-7 md:h-7 mr-2 md:mr-3 rounded-full flex items-center justify-center ${isUserMessage ? 'bg-indigo-600' : 'bg-gray-700 dark:bg-gray-600'}`}>
            {isUserMessage ? (
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0.2"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="font-medium text-sm md:text-base">{isUserMessage ? 'You' : 'PentaCopy'}</span>
        </div>

        {/* Message content */}
        <div 
          className="prose dark:prose-invert prose-indigo max-w-none text-gray-700 dark:text-gray-200 leading-relaxed prose-sm sm:prose-base"
          lang="auto"
          dir="auto"
          dangerouslySetInnerHTML={messageContent}
        />
        
        {/* Show model info for AI messages */}
        {!isUserMessage && message.model && (
          <div className="mt-2 md:mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
            <span>Model: {message.modelName || (message.metadata && message.metadata.modelName) || message.model}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage; 