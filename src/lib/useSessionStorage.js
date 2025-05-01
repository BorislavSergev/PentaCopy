import { useState, useEffect } from 'react';

/**
 * A custom hook that works like useState but persists the state in sessionStorage
 * to prevent state loss when switching tabs or refreshing the page
 * 
 * @param {string} key - The key to store the state under in sessionStorage
 * @param {any} initialValue - The initial value if nothing is found in sessionStorage
 * @returns {[any, function]} - A stateful value and a function to update it
 */
function useSessionStorage(key, initialValue) {
  // Create initial state based on sessionStorage or provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Try to get from sessionStorage by key
      const item = window.sessionStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to sessionStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to sessionStorage
      if (valueToStore === undefined) {
        window.sessionStorage.removeItem(key);
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.storageArea === window.sessionStorage && e.key === key) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing sessionStorage key "${key}":`, error);
        }
      }
    };
    
    // Listen for storage events to sync state across tabs
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);
  
  return [storedValue, setValue];
}

export default useSessionStorage; 