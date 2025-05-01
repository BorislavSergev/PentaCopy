import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Error handling for React rendering
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App crashed:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The application has encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// EMERGENCY FIX: Unregister any existing service workers instead of registering new ones
if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (let registration of registrations) {
      registration.unregister().then(success => {
        console.log('Service worker unregistered:', success);
      });
    }
  }).catch(error => {
    console.error('Service worker unregistration failed:', error);
  });
  
  // Also clear any caches created by service worker
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
    }).catch(error => {
      console.error('Cache deletion failed:', error);
    });
  }
  
  // Add event listener to handle tab visibility using just browser APIs
  document.addEventListener('visibilitychange', () => {
    // When tab becomes visible again
    if (!document.hidden) {
      // Dispatch event so app can update if needed
      window.dispatchEvent(new CustomEvent('app:tabReactivated', { 
        detail: { timestamp: Date.now() } 
      }));
    }
  });
}

// Setup global error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  // Prevent the error from disrupting the entire app if possible
  event.preventDefault();
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Prevent the rejection from disrupting the entire app if possible
  event.preventDefault();
});

// Create root and render app with error boundary
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
