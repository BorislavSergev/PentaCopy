import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Replace with your actual Supabase URL and anonymous key when ready
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Detect Chrome browser
const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);

// Custom storage implementation that doesn't trigger reloads on change
// With Chrome-specific optimizations
const customStorage = {
  getItem: (key) => {
    try {
      const value = window.localStorage.getItem(key);
      
      // For Chrome, use a more reliable caching mechanism
      if (isChrome && value) {
        // Also cache the value in memory for faster access
        if (!window._authCache) window._authCache = {};
        window._authCache[key] = value;
      }
      
      return value;
    } catch (error) {
      console.error('Error getting auth item from localStorage', error);
      
      // For Chrome, try to recover from memory cache if available
      if (isChrome && window._authCache && window._authCache[key]) {
        return window._authCache[key];
      }
      
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      // Set a flag to indicate we're storing auth data
      window._isStoringAuthData = true;
      
      // For Chrome: First update memory cache to ensure we don't lose data
      if (isChrome) {
        if (!window._authCache) window._authCache = {};
        window._authCache[key] = value;
        
        // Block Chrome's storage event propagation between tabs
        // by setting a timestamp flag
        window.localStorage.setItem('_auth_update_time', Date.now().toString());
      }
      
      // Then update localStorage
      window.localStorage.setItem(key, value);
      
      // Clear the flag after a small delay - longer for Chrome
      setTimeout(() => {
        window._isStoringAuthData = false;
      }, isChrome ? 100 : 50);
    } catch (error) {
      console.error('Error storing auth item in localStorage', error);
      
      // For Chrome: At least keep the memory cache updated
      if (isChrome) {
        if (!window._authCache) window._authCache = {};
        window._authCache[key] = value;
      }
    }
  },
  removeItem: (key) => {
    try {
      // For Chrome, clear memory cache first
      if (isChrome && window._authCache) {
        delete window._authCache[key];
      }
      
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing auth item from localStorage', error);
    }
  }
};

// Create the Supabase client with Chrome-specific settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token',
    storage: customStorage,
    detectSessionInUrl: false,
    // For Chrome, use pkce which is more stable with tab switching
    flowType: isChrome ? 'pkce' : 'implicit'
  }
});

// Add Chrome-specific event listener to prevent tab sync issues
if (isChrome) {
  window.addEventListener('storage', (event) => {
    // Ignore auth token updates to prevent Chrome tab sync reloads
    if (event.key && (
      event.key.includes('supabase.auth.token') ||
      event.key === '_auth_update_time'
    )) {
      event.stopImmediatePropagation();
      return false;
    }
  }, true); // Capture phase
} 