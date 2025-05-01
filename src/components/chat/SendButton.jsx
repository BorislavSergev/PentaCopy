import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Create a separate send button component to prevent re-rendering issues
const SendButton = ({ isDisabled, isLoading, isTabActive, onClick, isMobile = false }) => {
  // Use a local state to debounce visual changes and prevent flickering
  const [visuallyDisabled, setVisuallyDisabled] = useState(isDisabled);
  
  // Use an effect to debounce the visual state changes
  useEffect(() => {
    // Only apply debounce when enabling the button to prevent flickering
    if (!isDisabled && visuallyDisabled) {
      // If we're going from disabled to enabled, add a small delay
      const timer = setTimeout(() => {
        setVisuallyDisabled(isDisabled);
      }, 100); // Reduced from 300ms to 100ms for faster visual feedback
      return () => clearTimeout(timer);
    } else {
      // Update immediately for any state change
      setVisuallyDisabled(isDisabled);
    }
  }, [isDisabled, visuallyDisabled]);
  
  return (
    <motion.button
      type="submit" 
      disabled={isDisabled}
      onClick={!isDisabled ? onClick : undefined}
      whileTap={{ scale: 0.95 }}
      className={`absolute right-2 md:right-2.5 bottom-[10px] md:bottom-[12px] p-2 md:p-2.5 rounded-lg text-white 
        ${visuallyDisabled ? 'bg-gray-700 opacity-40 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700'} 
        transition-colors duration-200 ease-in-out flex items-center justify-center shadow-sm`}
      aria-label="Send message"
    >
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ 
            rotate: isTabActive ? 360 : 0,
            opacity: 1
          }}
          transition={{
            rotate: {
              repeat: isTabActive ? Infinity : 0,
              duration: 1,
              ease: "linear"
            },
            opacity: {
              duration: 0.2
            }
          }}
          className={`w-3.5 h-3.5 md:w-4 md:h-4 border-2 border-blue-300 border-opacity-30 border-t-white rounded-full`}
        />
      ) : (
        <svg 
          width={isMobile ? "16" : "18"} 
          height={isMobile ? "16" : "18"} 
          viewBox="0 0 24 24" 
          fill="none" 
          className="text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M7 11L12 6L17 11M12 18V7" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            transform="rotate(90, 12, 12)" 
          />
        </svg>
      )}
    </motion.button>
  );
};

export default SendButton; 