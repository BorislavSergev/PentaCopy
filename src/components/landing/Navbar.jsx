import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm shadow-md py-3' : 'bg-transparent py-5'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className={`w-10 h-10 rounded-xl mr-2 flex items-center justify-center text-white text-xl font-bold ${
                isScrolled ? 'bg-indigo-600' : 'bg-indigo-600/90'
              }`}>P</div>
              <span className={`text-2xl font-bold ${isScrolled ? 'text-indigo-600 dark:text-white' : 'text-white'}`}>
                PentaCopy
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-8">
            <a 
              href="#features" 
              className={`font-medium transition duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className={`font-medium transition duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Pricing
            </a>
            <a 
              href="#testimonials" 
              className={`font-medium transition duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              Testimonials
            </a>
            <a 
              href="#faq" 
              className={`font-medium transition duration-300 ${
                isScrolled 
                  ? 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              FAQ
            </a>
          </div>
          
          {/* Auth buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/chat" 
                  className={`font-medium transition duration-300 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/chat" 
                  className={`py-2 px-5 rounded-lg font-medium transition duration-300 ${
                    isScrolled 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-md'
                  }`}
                >
                  Go to Chat
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`font-medium transition duration-300 ${
                    isScrolled 
                      ? 'text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`py-2 px-5 rounded-lg font-medium transition duration-300 flex items-center ${
                    isScrolled 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-md'
                  }`}
                >
                  <span>Sign Up Free</span>
                  <svg className="ml-1.5 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isScrolled 
                  ? 'text-gray-700 focus:ring-indigo-500 dark:text-white' 
                  : 'text-white focus:ring-white'
              }`}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white dark:bg-gray-800 shadow-lg"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700">Features</a>
          <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700">Pricing</a>
          <a href="#testimonials" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700">Testimonials</a>
          <a href="#faq" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700">FAQ</a>
          
          {isAuthenticated ? (
            <>
              <Link to="/chat" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700">Dashboard</Link>
              <Link to="/chat" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 mt-2">Go to Chat</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-200 dark:hover:bg-gray-700">Login</Link>
              <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 mt-2">Sign Up Free</Link>
            </>
          )}
        </div>
      </motion.div>
    </nav>
  )
}

export default Navbar; 