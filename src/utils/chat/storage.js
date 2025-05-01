import { errorLog, debugLog } from './helpers';

// Add app state persistence to prevent reloads when switching tabs
export const saveAppState = (chatId, messages, pendingStatus) => {
  try {
    const appState = {
      chatId,
      messages,
      pendingStatus,
      timestamp: Date.now()
    };
    sessionStorage.setItem('pentacopy_app_state', JSON.stringify(appState));
    debugLog('Saved app state to sessionStorage');
  } catch (error) {
    errorLog('Failed to save app state:', error);
  }
};

export const getAppState = () => {
  try {
    const stateStr = sessionStorage.getItem('pentacopy_app_state');
    return stateStr ? JSON.parse(stateStr) : null;
  } catch (error) {
    errorLog('Failed to get app state:', error);
    return null;
  }
};

// Add a helper function to store metadata separately since database doesn't have the column yet
export const saveMessageMetadata = (messageId, metadata) => {
  try {
    localStorage.setItem(`msg_meta_${messageId}`, JSON.stringify(metadata));
  } catch (error) {
    errorLog('Failed to save message metadata:', error);
  }
};

export const getMessageMetadata = (messageId) => {
  try {
    const metaStr = localStorage.getItem(`msg_meta_${messageId}`);
    return metaStr ? JSON.parse(metaStr) : null;
  } catch (error) {
    console.error('Failed to get message metadata:', error);
    return null;
  }
};

// Local storage functions for message persistence
export const saveToLocalStorage = (chatId, messages, isPending = false) => {
  try {
    localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
    if (isPending !== undefined) {
      updatePendingStatus(chatId, isPending);
    }
    return true;
  } catch (e) {
    console.error('Error saving to localStorage:', e);
    return false;
  }
};

export const loadFromLocalStorage = (chatId) => {
  try {
    const data = localStorage.getItem(`chat_${chatId}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error loading from localStorage:', e);
    return null;
  }
};

export const hasPendingResponse = (chatId) => {
  try {
    return localStorage.getItem(`pending_${chatId}`) === 'true';
  } catch (e) {
    return false;
  }
};

export const updatePendingStatus = (chatId, isPending) => {
  try {
    if (isPending) {
      localStorage.setItem(`pending_${chatId}`, 'true');
    } else {
      localStorage.removeItem(`pending_${chatId}`);
    }
    return true;
  } catch (e) {
    console.error('Error updating pending status:', e);
    return false;
  }
};

export const saveActiveSessions = (sessions) => {
  try {
    localStorage.setItem('active_sessions', JSON.stringify(sessions));
    return true;
  } catch (e) {
    console.error('Error saving active sessions:', e);
    return false;
  }
};

export const getActiveSessions = () => {
  try {
    const data = localStorage.getItem('active_sessions');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error getting active sessions:', e);
    return null;
  }
}; 