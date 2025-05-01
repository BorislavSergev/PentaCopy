import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAvailableModelNames } from '../../lib/aiModels';

const ModelSelector = ({ selectedModelName, onModelSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modelNames, setModelNames] = useState([]);
  const dropdownRef = useRef(null);

  // Load available model names
  useEffect(() => {
    const names = getAvailableModelNames();
    setModelNames(names);
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (modelName) => {
    onModelSelect(modelName);
    setIsOpen(false);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[200px] px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center">
          <span className="mr-2">
            <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" 
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>{selectedModelName || 'Select model'}</span>
        </div>
        <span>
          <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1 text-sm"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
          >
            {modelNames.map((name) => (
              <li
                key={name}
                onClick={() => handleSelect(name)}
                className={`px-4 py-2.5 cursor-pointer hover:bg-gray-700 flex items-center ${
                  name === selectedModelName ? 'bg-gray-700 text-white' : 'text-gray-300'
                }`}
                role="option"
                aria-selected={name === selectedModelName}
              >
                {name === selectedModelName && (
                  <svg className="w-4 h-4 mr-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span className={name === selectedModelName ? 'font-medium' : ''}>
                  {name}
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModelSelector; 