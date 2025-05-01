import React, { useRef, useEffect } from 'react';
import SendButton from './SendButton';

const ChatInput = ({ 
  prompt, 
  setPrompt, 
  loading, 
  uiLoading, 
  isTabActive, 
  handleSendPrompt,
  handleSendButtonClick,
  credits,
  isMobile = false
}) => {
  const inputTextareaRef = useRef(null);

  // Auto-resize the textarea as content changes
  useEffect(() => {
    const textarea = inputTextareaRef.current;
    if (!textarea) return;

    const resizeTextarea = () => {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, isMobile ? 150 : 200); // Limit max height, smaller on mobile
      textarea.style.height = `${newHeight}px`;
    };

    // Set initial height
    resizeTextarea();

    // Add event listener for input changes
    textarea.addEventListener('input', resizeTextarea);

    return () => {
      textarea.removeEventListener('input', resizeTextarea);
    };
  }, [prompt, isMobile]);

  // Handle keyboard shortcuts
  const handleKeyDown = (e) => {
    // Only proceed if not currently loading
    if (loading || uiLoading) return;

    // Enter without shift to send
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim()) {
        handleSendPrompt(e);
      }
    }
  };

  // Determine if the button should be disabled
  const isButtonDisabled = loading || !prompt.trim();

  return (
    <div className="relative px-2 md:px-4 py-2 md:py-3">
      <form onSubmit={handleSendPrompt} className="relative">
        <div className="relative flex items-center">
          <textarea
            ref={inputTextareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message PentaCopy..."
            className="w-full py-3 md:py-3.5 px-3 md:px-4 pr-12 border border-gray-700 bg-gray-800 rounded-xl focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 resize-none min-h-[50px] md:min-h-[56px] max-h-[150px] md:max-h-[200px] transition-all duration-200 text-white placeholder-gray-400 shadow-md text-sm"
            disabled={loading}
            rows={1}
            style={{
              height: isMobile ? '50px' : '56px',
            }}
          />
          <SendButton 
            isDisabled={isButtonDisabled}
            isLoading={uiLoading}
            isTabActive={isTabActive}
            onClick={handleSendButtonClick}
            isMobile={isMobile}
          />
        </div>
      </form>

      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 border border-gray-600 rounded">Enter</kbd>
            <span className="mx-1">to send,</span>
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 border border-gray-600 rounded">Shift+Enter</kbd>
            <span className="mx-1">for new line</span>
          </span>
          <span className="sm:hidden">
            <kbd className="px-1.5 py-0.5 text-xs bg-gray-700 border border-gray-600 rounded">Enter</kbd>
            <span className="mx-1">to send</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 