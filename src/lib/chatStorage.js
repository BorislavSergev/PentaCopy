/**
 * Enhanced utility functions for chat persistence using localStorage
 */

/**
 * Saves chat messages to localStorage
 * @param {string} chatId - The ID of the chat
 * @param {Array} messages - Array of chat messages
 * @param {boolean} isPending - Whether there's a pending AI response
 */
export const saveToLocalStorage = (chatId, messages, isPending = false) => {
  if (!chatId) return;
  
  try {
    // Save last viewed chat
    localStorage.setItem('lastChatId', chatId);
    
    // Save messages for this chat
    localStorage.setItem(`chat_${chatId}`, JSON.stringify({
      messages: messages || [],
      timestamp: Date.now(),
      isPending
    }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Loads chat messages from localStorage
 * @param {string} chatId - The ID of the chat to load
 * @returns {Object|null} - Object containing messages and pending status, or null if not found
 */
export const loadFromLocalStorage = (chatId) => {
  if (!chatId) return null;
  
  try {
    const chatData = localStorage.getItem(`chat_${chatId}`);
    if (chatData) {
      const parsed = JSON.parse(chatData);
      return parsed.messages;
    }
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
  }
  
  return null;
};

/**
 * Checks if there is a pending AI response for a chat
 * @param {string} chatId - The ID of the chat to check
 * @returns {boolean} - True if there is a pending response, false otherwise
 */
export const hasPendingResponse = (chatId) => {
  if (!chatId) return false;
  
  try {
    const chatData = localStorage.getItem(`chat_${chatId}`);
    if (chatData) {
      const parsed = JSON.parse(chatData);
      return parsed.isPending || false;
    }
  } catch (error) {
    console.error('Failed to check pending status:', error);
  }
  
  return false;
};

/**
 * Updates the pending status of a chat
 * @param {string} chatId - The ID of the chat
 * @param {boolean} isPending - Whether there's a pending AI response
 */
export const updatePendingStatus = (chatId, isPending) => {
  if (!chatId) return;
  
  try {
    const chatData = localStorage.getItem(`chat_${chatId}`);
    if (chatData) {
      const parsed = JSON.parse(chatData);
      parsed.isPending = isPending;
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(parsed));
      console.log(`Updated pending status for chat ${chatId}: ${isPending}`);
    }
  } catch (error) {
    console.error('Failed to update pending status:', error);
  }
};

/**
 * Gets the ID of the last viewed chat from localStorage
 * @returns {string|null} - The ID of the last viewed chat or null
 */
export const getLastViewedChat = () => {
  return localStorage.getItem('lastChatId');
};

/**
 * Saves all active chats information to help with recovery
 * @param {Array} chatSessions - Array of chat session objects
 */
export const saveActiveSessions = (chatSessions) => {
  if (!chatSessions || !Array.isArray(chatSessions)) return;
  
  try {
    localStorage.setItem('activeSessions', JSON.stringify({
      sessions: chatSessions.map(s => ({
        id: s.id,
        title: s.title || s.displayTitle,
        lastAccessed: Date.now()
      })),
      timestamp: Date.now()
    }));
    
    console.log(`Saved ${chatSessions.length} active sessions to localStorage`);
  } catch (error) {
    console.error('Failed to save active sessions:', error);
  }
};

/**
 * Gets all active chat sessions from localStorage
 * @returns {Array} - Array of chat session objects or empty array
 */
export const getActiveSessions = () => {
  try {
    const sessionsData = localStorage.getItem('activeSessions');
    if (sessionsData) {
      const parsed = JSON.parse(sessionsData);
      return parsed.sessions || [];
    }
  } catch (error) {
    console.error('Failed to get active sessions:', error);
  }
  
  return [];
};

/**
 * Clears all saved chat data from localStorage
 */
export const clearStoredChats = () => {
  try {
    // Get all keys in localStorage 
    const keys = Object.keys(localStorage);
    
    // Filter keys that match our chat pattern
    const chatKeys = keys.filter(key => key.startsWith('chat_'));
    
    // Delete each chat
    chatKeys.forEach(key => localStorage.removeItem(key));
    
    // Also remove the last viewed chat and active sessions
    localStorage.removeItem('lastChatId');
    localStorage.removeItem('activeSessions');
    
    console.log(`Cleared ${chatKeys.length} stored chats from localStorage`);
  } catch (error) {
    console.error('Failed to clear chats from localStorage:', error);
  }
}; 