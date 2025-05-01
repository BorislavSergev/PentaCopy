import React, { useRef, forwardRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import { 
  thinkingAnimation, 
  generatingAnimation 
} from '../../utils/chat/animations';
import { createMarkdownHTML } from '../../utils/markdown';

const ChatConversation = forwardRef(({ 
  messages, 
  optimisticMessages, 
  loadingMoreMessages,
  responseGenerationPhase,
  streamingText,
  isSummarizingInBackground,
  hasMoreMessages,
  prefersReducedMotion,
  isMobile
}, messagesEndRef) => {
  const messagesContainerRef = useRef(null);

  // Ensure streamingText is processed with our markdown utility, and handle cyrillic characters explicitly
  const streamingContent = useMemo(() => {
    if (!streamingText) return { __html: '' };
    
    // Check if the text contains Cyrillic (Bulgarian) characters
    const hasCyrillic = /[А-Яа-я]/.test(streamingText);
    
    // For Bulgarian text, ensure proper encoding
    let processedText = streamingText;
    if (hasCyrillic) {
      try {
        // Use special handling for Cyrillic text if needed
        processedText = streamingText
          .replace(/\\n/g, '\n') // Fix escaped newlines
          .replace(/\\"/g, '"'); // Fix escaped quotes
      } catch (e) {
        console.error('Error processing Cyrillic text:', e);
      }
    }
    
    return createMarkdownHTML(processedText);
  }, [streamingText]);

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
    >
      {/* Loading indicator for older messages */}
      {loadingMoreMessages && (
        <div className="flex justify-center py-3 mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-800 px-4 py-2 rounded-lg text-sm text-gray-300 shadow-md"
          >
            Loading older messages...
          </motion.div>
        </div>
      )}

      {/* "Load more" button if there are more messages */}
      {hasMoreMessages && !loadingMoreMessages && (
        <div className="flex justify-center py-3 mb-4">
          <button
            className="bg-gray-800 hover:bg-gray-700 px-5 py-2 rounded-lg text-sm transition-colors text-gray-200 shadow-md"
            onClick={() => {/* This would be handled in the parent */}}
          >
            Load more messages
          </button>
        </div>
      )}

      {/* Message list */}
      <div className="flex flex-col">
        <AnimatePresence>
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id || `msg-${index}`}
              message={message}
              index={index}
              isLast={index === messages.length - 1}
              prefersReducedMotion={prefersReducedMotion}
              isMobile={isMobile}
            />
          ))}

          {/* Optimistic messages (e.g., during loading) */}
          {optimisticMessages.map((message, index) => (
            <ChatMessage
              key={message.id || `optimistic-${index}`}
              message={message}
              index={`optimistic-${index}`}
              isLast={index === optimisticMessages.length - 1}
              prefersReducedMotion={prefersReducedMotion}
              isMobile={isMobile}
            />
          ))}
        </AnimatePresence>

        {/* Response generation phases */}
        {responseGenerationPhase === 'thinking' && (
          <motion.div
            variants={thinkingAnimation}
            initial="initial"
            animate="animate"
            className="py-5 px-4 md:px-8 w-full bg-gray-800 border-b border-gray-700"
          >
            <div className="flex items-center space-x-3 max-w-3xl mx-auto">
              <div className="w-7 h-7 flex items-center justify-center bg-gray-700 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 text-white">
                  <path fill="currentColor" d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity="0.3"/>
                  <path fill="currentColor" d="M20,12h2A10,10,0,0,0,12,2V4A8,8,0,0,1,20,12Z">
                    <animateTransform 
                      attributeName="transform" 
                      attributeType="XML" 
                      type="rotate"
                      dur="1s" 
                      from="0 12 12"
                      to="360 12 12" 
                      repeatCount="indefinite" 
                    />
                  </path>
                </svg>
              </div>
              <span className="text-white font-medium">Thinking...</span>
            </div>
          </motion.div>
        )}

        {responseGenerationPhase === 'generating' && streamingText && (
          <div className="w-full py-5 px-4 md:px-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center mb-4 text-gray-700 dark:text-gray-200">
                <div className="w-7 h-7 mr-3 rounded-full flex items-center justify-center bg-gray-700 dark:bg-gray-600">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="currentColor" fillOpacity="0.2"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-medium">PentaCopy</span>
              </div>
              <div 
                className="prose dark:prose-invert prose-indigo max-w-none text-gray-700 dark:text-gray-200 leading-relaxed prose-sm sm:prose-base"
                lang="auto"
                dir="auto"
                dangerouslySetInnerHTML={streamingContent}
              />
            </div>
          </div>
        )}

        {isSummarizingInBackground && (
          <motion.div
            initial={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="py-1.5 px-3 bg-blue-900/10 text-blue-300 text-xs text-center border-t border-blue-900/20 fixed bottom-16 right-4 rounded-md shadow-md"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="currentColor" opacity="0.3"/>
                <path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.42 3.58-8 8-8z" fill="currentColor">
                  <animateTransform 
                    attributeName="transform" 
                    attributeType="XML" 
                    type="rotate"
                    dur="1s" 
                    from="0 12 12"
                    to="360 12 12" 
                    repeatCount="indefinite" 
                  />
                </path>
              </svg>
              <span>Building context...</span>
            </div>
          </motion.div>
        )}

        {/* Invisible element to use as a scroll-to marker */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
});

ChatConversation.displayName = 'ChatConversation';

export default ChatConversation; 