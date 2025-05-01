import { useState, useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import StripeProvider from './components/StripeProvider'
import { ThemeProvider } from './context/ThemeContext'

// Landing page components
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Pricing from './pages/Pricing'

// Authenticated components
import Chat from './pages/app/Chat'
import ChatHistory from './pages/app/ChatHistory'
import AccountSettings from './pages/app/AccountSettings'
import SubscriptionSuccess from './pages/app/SubscriptionSuccess'
import SubscriptionCancel from './pages/app/SubscriptionCancel'

// Diagnostic tools
import DiagnosticPage from './pages/DiagnosticPage'

// Loading component
const LoadingScreen = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
  </div>
)

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatSessions, setChatSessions] = useState([])
  const [lastActive, setLastActive] = useState(Date.now())

  // EMERGENCY FIX: Unregister service worker on mount
  useEffect(() => {
    // Immediately unregister service worker if it exists
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          console.log('Unregistering service worker...');
          registration.unregister();
        });
      });
    }
    
    // Clear any reload counters
    sessionStorage.removeItem('reload_counter');
    sessionStorage.removeItem('last_reload_time');
    sessionStorage.removeItem('service_worker_disabled');
    
    // Check if running in Chrome
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    
    // Prevent automatic reloads for token refresh - with Chrome-specific handling
    const handleStorageChange = (event) => {
      // For Chrome, we need more aggressive prevention of reloads
      if (isChrome) {
        // If this is a Supabase auth token update or our custom timestamp flag
        if (event.key && (
          event.key.includes('supabase.auth.token') || 
          event.key === '_auth_update_time' ||
          event.key.includes('pentacopy')
        )) {
          console.log('Preventing Chrome reload for storage event:', event.key);
          event.stopImmediatePropagation();
          
          // Extra step for Chrome: schedule a check to see if we need to update UI
          // without reloading - this will use the new token silently
          if (event.key.includes('supabase.auth.token') && !window._isStoringAuthData) {
            setTimeout(() => {
              console.log('Checking if session needs silent refresh...');
              if (supabase && supabase.auth) {
                supabase.auth.getSession().then(() => {
                  console.log('Session refreshed silently');
                });
              }
            }, 200);
          }
          
          return false;
        }
      } else {
        // Non-Chrome browsers: simpler handling
        if (event.key && event.key.includes('supabase.auth.token') && window._isStoringAuthData) {
          event.stopImmediatePropagation();
          return false;
        }
      }
    };
    
    // Use capture phase to catch event early
    window.addEventListener('storage', handleStorageChange, true);
    
    // Flag to detect if we're returning from another tab
    window._isReturningFromOtherTab = false;
    
    return () => {
      window.removeEventListener('storage', handleStorageChange, true);
    };
  }, []);

  // Store the app state in sessionStorage to persist between tab switches
  const saveAppState = () => {
    try {
      const appState = {
        timestamp: Date.now(),
        lastPath: window.location.pathname,
        sessionExists: !!session
      };
      sessionStorage.setItem('pentacopy_app_state', JSON.stringify(appState));
    } catch (error) {
      console.error('Failed to save app state:', error);
    }
  };

  // Function to keep the tab alive by periodic pings
  useEffect(() => {
    // Check if running in Chrome
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent);
    
    // Create a background sync controller
    if (!window._bgSyncController) {
      window._bgSyncController = {
        lastSync: Date.now(),
        syncInterval: 30000, // 30 seconds
        isSyncing: false,
        enabled: true
      };
    }
    
    // Background sync function to update data even when tab is not active
    const backgroundSync = async () => {
      if (!window._bgSyncController.enabled || window._bgSyncController.isSyncing) {
        return;
      }
      
      try {
        window._bgSyncController.isSyncing = true;
        const now = Date.now();
        const timeSinceLast = now - window._bgSyncController.lastSync;
        
        // Only sync if it's been at least the sync interval since last sync
        if (timeSinceLast >= window._bgSyncController.syncInterval) {
          console.log('Background sync running...');
          
          // If we have a session, silently refresh it
          if (session) {
            try {
              // Create a silent, non-blocking session refresh using a Promise
              // This prevents the page from reloading during token refresh
              window._isStoringAuthData = true; // Flag to prevent storage event handling
              
              // Use a timeout to make this completely non-blocking
              setTimeout(async () => {
                try {
                  // Silent session refresh that won't trigger page reload
                  const { data, error } = await supabase.auth.getSession();
                  
                  if (error) {
                    console.error('Silent session refresh error:', error);
                  } else {
                    console.log('Session refreshed silently in background');
                  }
                  
                  // Dispatch event for components to update their data if needed
                  window.dispatchEvent(new CustomEvent('app:backgroundSync', {
                    detail: {
                      timestamp: now,
                      isTabActive: !document.hidden
                    }
                  }));
                } catch (refreshError) {
                  console.error('Error in background session refresh:', refreshError);
                } finally {
                  window._isStoringAuthData = false;
                }
              }, 0);
              
              window._bgSyncController.lastSync = now;
            } catch (sessionError) {
              console.error('Failed to setup background refresh:', sessionError);
            }
          }
        }
      } catch (error) {
        console.error('Background sync error:', error);
      } finally {
        window._bgSyncController.isSyncing = false;
      }
    };
    
    // Ping every 20 seconds to keep the tab alive
    const keepAliveInterval = setInterval(() => {
      setLastActive(Date.now());
      
      // Run background sync regardless of tab visibility
      backgroundSync();
      
      // Use the Page Visibility API to check if the page is visible
      if (!document.hidden) {
        // Update the session storage timestamp
        try {
          const stateStr = sessionStorage.getItem('pentacopy_app_state');
          if (stateStr) {
            const state = JSON.parse(stateStr);
            state.timestamp = Date.now();
            sessionStorage.setItem('pentacopy_app_state', JSON.stringify(state));
          }
        } catch (e) {
          console.error('Error updating timestamp:', e);
        }
      }
    }, isChrome ? 15000 : 20000); // More frequent for Chrome
    
    // Also add a specific listener for visibility changes to sync immediately when returning to tab
    const handleVisChange = () => {
      if (!document.hidden) {
        // Force an immediate background sync when tab becomes visible
        backgroundSync();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisChange);
    
    return () => {
      clearInterval(keepAliveInterval);
      document.removeEventListener('visibilitychange', handleVisChange);
    };
  }, [session, lastActive]);

  useEffect(() => {
    console.log('App: Initializing authentication'); // Add logging for debugging
    
    // Check active sessions and set state
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('App: Initial session check complete', session ? 'Session found' : 'No session'); // Add logging
      setSession(session);
      setLoading(false);
      
      // Save initial app state
      if (session) {
        saveAppState();
      }
    }).catch(error => {
      console.error('App: Error getting session:', error);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('App: Auth state changed', _event, session ? 'Session exists' : 'No session'); // Add logging
        
        // Skip updates for token refresh events to prevent reloads
        if (_event === 'TOKEN_REFRESHED') {
          console.log('App: Token refreshed, maintaining current session state');
          return;
        }
        
        // Only update session state if it actually changed
        // This prevents unnecessary re-renders and potential reloads
        setSession(prevSession => {
          if (!prevSession && !session) return prevSession; // Both null, no change
          if (!prevSession && session) return session; // New session created
          if (prevSession && !session) return null; // Session destroyed
          
          // Compare session objects to avoid unnecessary updates
          if (prevSession && session && 
              prevSession.user.id === session.user.id) {
            // Keep using the existing session to avoid unnecessary re-renders
            return prevSession;
          }
          
          // Session actually changed
          return session;
        });
        
        // Also save app state when auth changes
        if (session) {
          saveAppState();
        }
      }
    );

    return () => {
      console.log('App: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [])

  // Function to handle new chat creation
  const handleCreateNewChat = (newSession) => {
    if (newSession) {
      console.log('New chat session created:', newSession.id);
      // Update local state with the new chat session
      setChatSessions(prevSessions => [newSession, ...prevSessions]);
      
      // Save app state after creating a new chat
      saveAppState();
      return true;
    }
    return false;
  }

  // Function to save messages (can be implemented later if needed)
  const handleSaveMessages = (chatId, messages) => {
    console.log(`Saving ${messages.length} messages for chat ${chatId}`);
    // Implementation can be added here if needed
    return true;
  }

  // Simplified tab visibility handler without service worker
  useEffect(() => {
    // Create a flag to track if we're switching tabs - specifically for Chrome
    if (!window._tabSwitchState) {
      window._tabSwitchState = { 
        inputValues: {}, 
        lastActive: Date.now(),
        isReturningFromOtherTab: false,
        isChrome: /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent)
      };
    }

    // Chrome-specific tab freeze prevention
    if (window._tabSwitchState.isChrome) {
      // Set a periodic ping to prevent Chrome from freezing the tab
      const chromePingInterval = setInterval(() => {
        if (!document.hidden) {
          // Tiny operation to keep tab alive
          window._tabSwitchState.lastPing = Date.now();
        }
      }, 5000);
      
      // Clear interval on unmount
      return () => clearInterval(chromePingInterval);
    }

    // Function to save all input values before tab switch - enhanced for Chrome
    const saveFormState = () => {
      // Save all React controlled inputs by dispatching custom event
      window.dispatchEvent(new CustomEvent('pentacopy:saveInputs', {}));
      
      // Also directly capture DOM input values as backup
      const inputs = document.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (input.id || input.name) {
          const key = input.id || input.name;
          window._tabSwitchState.inputValues[key] = input.value;
        }
      });
      
      // Chrome-specific: Use localStorage instead of sessionStorage for better tab state preservation
      try {
        localStorage.setItem('pentacopy_input_state', JSON.stringify(window._tabSwitchState.inputValues));
        localStorage.setItem('pentacopy_tab_state_timestamp', Date.now().toString());
      } catch (e) {
        console.error('Error saving input state:', e);
      }
    };

    // Function to restore input values after tab switch - enhanced for Chrome
    const restoreFormState = () => {
      // First try to get from memory
      const savedInputs = window._tabSwitchState.inputValues;
      
      // If not in memory, try localStorage (works better in Chrome)
      if (Object.keys(savedInputs).length === 0) {
        try {
          const storedState = localStorage.getItem('pentacopy_input_state');
          if (storedState) {
            Object.assign(savedInputs, JSON.parse(storedState));
          }
        } catch (e) {
          console.error('Error restoring input state:', e);
        }
      }
      
      // Apply saved values to inputs with Chrome-specific workarounds
      setTimeout(() => {
        // First dispatch event for React-controlled components
        window.dispatchEvent(new CustomEvent('pentacopy:restoreInputs', {
          detail: { savedInputs }
        }));
        
        // Then try to directly set input values
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
          if ((input.id || input.name) && input.type !== 'password') {
            const key = input.id || input.name;
            if (savedInputs[key] !== undefined) {
              input.value = savedInputs[key];
              
              // Trigger input event to notify React components
              const event = new Event('input', { bubbles: true });
              input.dispatchEvent(event);
              
              // For Chrome, also trigger change event
              const changeEvent = new Event('change', { bubbles: true });
              input.dispatchEvent(changeEvent);
            }
          }
        });
      }, 100); // Slightly longer delay for Chrome
    };

    // Function to handle tab visibility changes - enhanced for Chrome
    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      
      if (isVisible) {
        // When tab becomes visible again (Chrome tab switch)
        const now = Date.now();
        const timeSinceLastActive = now - lastActive;
        setLastActive(now);
        
        // Mark that we're returning from another tab
        window._tabSwitchState.isReturningFromOtherTab = true;
        
        // Chrome-specific: Check if we need to refresh the auth session
        if (timeSinceLastActive > 300000) { // 5 minutes
          // Only refresh auth if needed, but don't reload the page
          try {
            console.log('Refreshing auth session after long inactivity');
            supabase.auth.getSession().then(({ data }) => {
              // Just refresh the session object, don't update state
              console.log('Auth session refreshed silently');
            });
          } catch (e) {
            console.error('Error refreshing auth session:', e);
          }
        }
        
        // Restore form state - important for Chrome tab switching
        restoreFormState();
        
        // Try to restore from session storage with Chrome-specific behavior
        try {
          // Chrome-specific: force read from localStorage
          window.dispatchEvent(new CustomEvent('pentacopy:tabactivated'));
          
          const stateStr = sessionStorage.getItem('pentacopy_app_state');
          if (stateStr) {
            const state = JSON.parse(stateStr);
            
            // If the user is on the same path and we have a session,
            // refresh data but don't reload
            if (state.lastPath === window.location.pathname && state.sessionExists) {
              // Dispatch event so components can update their state if needed
              window.dispatchEvent(new CustomEvent('app:tabReactivated', { 
                detail: { 
                  timeSinceLastActive,
                  timestamp: now 
                } 
              }));
            }
          }
        } catch (error) {
          console.error('Failed to restore app state:', error);
        }
      } else {
        // When tab becomes hidden (switching to another tab in Chrome)
        saveAppState();
        
        // Save form state before switching tabs - crucial for Chrome
        saveFormState();
        
        // Update last active time
        window._tabSwitchState.lastActive = Date.now();
      }
    };

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Chrome-specific: Listen for tab discard signals
    if (navigator.scheduling && navigator.scheduling.isInputPending) {
      document.addEventListener('freeze', saveFormState);
      document.addEventListener('resume', restoreFormState);
    }
    
    // Chrome-specific: Handle page unload more aggressively
    const handleBeforeUnload = (e) => {
      // Save state but don't prevent navigation
      saveAppState();
      
      // Also save form state
      saveFormState();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Simpler pageshow handler for tab switching
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        // Page was loaded from cache (back button or tab switch)
        setLastActive(Date.now());
        
        // If returning from a different tab
        if (window._tabSwitchState && window._tabSwitchState.isReturningFromOtherTab) {
          // Restore form state
          restoreFormState();
          window._tabSwitchState.isReturningFromOtherTab = false;
        }
        
        // Dispatch custom event for components to handle
        window.dispatchEvent(new CustomEvent('app:pageshow', { 
          detail: { 
            persisted: true,
            isReturningFromOtherTab: true
          } 
        }));
      }
    });
    
    // Special handler for popstate (browser back/forward)
    window.addEventListener('popstate', () => {
      // Restore form state
      setTimeout(restoreFormState, 100);
    });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', restoreFormState);
      if (navigator.scheduling && navigator.scheduling.isInputPending) {
        document.removeEventListener('freeze', saveFormState);
        document.removeEventListener('resume', restoreFormState);
      }
    };
  }, [lastActive]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) return <LoadingScreen />
    if (!session) return <Navigate to="/login" replace />
    return children
  }

  // Error boundary for Stripe Provider
  const ErrorFallback = ({ error }) => (
    <div className="flex flex-col items-center justify-center h-screen p-6 bg-red-50 dark:bg-red-900">
      <h2 className="text-xl font-semibold text-red-600 dark:text-red-300 mb-4">
        Payment system error: {error?.message || 'Unknown error'}
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Please refresh the page or try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  );

  return (
    <ThemeProvider>
      <Suspense fallback={<LoadingScreen />}>
        <StripeProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/pricing" element={<Pricing />} />
              
              {/* Diagnostic page - publicly accessible for testing */}
              <Route path="/diagnostic" element={<DiagnosticPage />} />

              {/* Protected routes */}
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat createNewChat={handleCreateNewChat} saveMessages={handleSaveMessages} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat/:chatId" 
                element={
                  <ProtectedRoute>
                    <Chat createNewChat={handleCreateNewChat} saveMessages={handleSaveMessages} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/history" 
                element={
                  <ProtectedRoute>
                    <ChatHistory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <AccountSettings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Stripe webhook callback routes */}
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </StripeProvider>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
