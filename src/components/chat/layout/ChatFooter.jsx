import React from 'react';
import ChatInput from '../ChatInput';

const ChatFooter = ({
  prompt,
  setPrompt,
  loading,
  uiLoading,
  isTabActive,
  handleSendPrompt,
  handleSendButtonClick,
  credits,
  selectedModelName,
}) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto shadow-[0_-1px_3px_rgba(0,0,0,0.05)] dark:shadow-[0_-1px_3px_rgba(0,0,0,0.3)]">
      <div className="px-4 py-3 max-w-5xl mx-auto">
        <ChatInput
          prompt={prompt}
          setPrompt={setPrompt}
          loading={loading}
          uiLoading={uiLoading}
          isTabActive={isTabActive}
          handleSendPrompt={handleSendPrompt}
          handleSendButtonClick={handleSendButtonClick}
          credits={credits}
        />
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
          <div className="flex items-center">
            <svg className="w-3 h-3 mr-1 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Using {selectedModelName}</span>
          </div>
          <div className="text-xs italic">AI responses may contain inaccuracies</div>
        </div>
      </div>
    </div>
  );
};

export default ChatFooter; 