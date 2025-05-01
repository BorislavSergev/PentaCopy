/**
 * Helper functions for chat UI and data management
 */

/**
 * Format date to a user-friendly string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if date is today
  if (date.toDateString() === now.toDateString()) {
    return formatTime(date);
  }
  
  // Check if date is yesterday
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${formatTime(date)}`;
  }
  
  // Check if date is within the last 7 days
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  if (date > oneWeekAgo) {
    return `${date.toLocaleDateString('en-US', { weekday: 'long' })}, ${formatTime(date)}`;
  }
  
  // Default format for older dates
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Format time in 12-hour format
 * @param {Date} date - Date object
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  
  return `${hours}:${minutesStr} ${ampm}`;
};

/**
 * Truncate text to a certain length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get local storage item with error handling
 * @param {string} key - Local storage key
 * @returns {any} Parsed JSON value or null if not found/invalid
 */
export const getLocalStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Set local storage item with error handling
 * @param {string} key - Local storage key
 * @param {any} value - Value to store (will be JSON stringified)
 */
export const setLocalStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Debug mode - set to true to enable debug logging
export const DEBUG = process.env.NODE_ENV === 'development';

// Debug logger that only logs in debug mode
export const debugLog = (...args) => {
  if (DEBUG) {
    console.log(...args);
  }
};

// Replace direct console.error calls with a conditional version
export const errorLog = (...args) => {
  if (DEBUG) {
    console.error(...args);
  }
};

// Flag to track if tab is being refreshed vs. closed
// This should be at the module level outside any component
export const setBeforeUnloadFlag = () => {
  sessionStorage.setItem('IS_REFRESHING', 'true');
};

// Flag to prevent unnecessary reloads when tab visibility changes
export const setVisibilityChangeFlag = () => {
  // Check if this is the first page load
  const hasLoadedBefore = sessionStorage.getItem('HAS_LOADED_BEFORE');
  
  // Only set the visibility change flag if the page has been loaded before
  if (hasLoadedBefore) {
    sessionStorage.setItem('IS_VISIBILITY_CHANGE', 'true');
    
    // Clear this flag after a short time 
    setTimeout(() => {
      sessionStorage.removeItem('IS_VISIBILITY_CHANGE');
    }, 1000);
  }
};

// Flag to track when the page has been properly loaded
export const markPageLoaded = () => {
  sessionStorage.setItem('HAS_LOADED_BEFORE', 'true');
};

// Helper function to check if object is the same
export const isEqualObjects = (obj1, obj2) => {
  // Handle null/undefined cases
  if (obj1 === obj2) return true;
  if (!obj1 || !obj2) return false;
  
  // For arrays of objects (like chat sessions), compare by IDs
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    // If lengths differ, they're different
    if (obj1.length !== obj2.length) return false;
    
    // For chat sessions, compare by ID and updated timestamp only
    if (obj1.length > 0 && obj1[0] && 'id' in obj1[0]) {
      // Create maps for quick ID lookup
      const map1 = new Map(obj1.map(item => [item.id, item]));
      
      // Check if all items in obj2 exist in obj1 with same ID
      return obj2.every(item => {
        const item1 = map1.get(item.id);
        return item1 != null;
      });
    }
    
    // Default array comparison
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
  
  // Default object comparison
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

// Add these helper functions for debouncing
export const debounce = (func, wait) => {
  let timeout;
  
  const debouncedFunction = function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
  
  // Add a cancel method
  debouncedFunction.cancel = function() {
    clearTimeout(timeout);
  };
  
  return debouncedFunction;
}; 