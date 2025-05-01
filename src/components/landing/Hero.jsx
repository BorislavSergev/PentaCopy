import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const Hero = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    
    checkAuth();
  }, []);

  return (
    <section className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white py-28 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              opacity: Math.random() * 0.3,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 mb-10 md:mb-0 md:pr-12"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-100">
              The AI Assistant That Evolves With You
            </h1>
            <p className="text-xl mb-8 text-indigo-100 max-w-xl leading-relaxed">
              PentaCopy leverages advanced AI to help you create content, answer questions, and solve problems with unprecedented accuracy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Link to="/chat" className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-xl hover:bg-indigo-50 shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center justify-center">
                  <span>Go to Chat</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              ) : (
                <Link to="/register" className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-xl hover:bg-indigo-50 shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center justify-center">
                  <span>Get Started Free</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              )}
              <Link to="#features" className="bg-transparent border-2 border-white font-semibold py-3 px-8 rounded-xl hover:bg-white hover:text-indigo-700 transition duration-300 flex items-center justify-center">
                <span>See Features</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </Link>
            </div>
            
            <div className="mt-10 text-indigo-100 flex items-center space-x-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Free tier available</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-1/2 relative"
          >
            <div className="relative z-10 bg-white/10 backdrop-blur-sm p-2 rounded-2xl shadow-2xl border border-white/20">
              <div className="w-full bg-gray-900 rounded-xl overflow-hidden shadow-lg">
                <div className="h-8 bg-gray-800 flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                <div className="p-4 pb-8 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-semibold">P</div>
                    <div className="bg-gray-800 text-white p-3 rounded-2xl rounded-tl-none">
                      <p className="text-sm">How can I help improve my website's SEO?</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 font-semibold">A</div>
                    <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tl-none">
                      <p className="text-sm">Here are 5 key strategies to improve your website's SEO:</p>
                      <ul className="mt-2 text-sm space-y-1 list-disc pl-4">
                        <li>Optimize your content with relevant keywords</li>
                        <li>Improve page loading speed</li>
                        <li>Create high-quality backlinks</li>
                        <li>Ensure mobile-friendly design</li>
                        <li>Use descriptive meta tags and URLs</li>
                      </ul>
                      <div className="flex justify-end mt-2">
                        <button className="bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors duration-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600 rounded-full opacity-50 blur-xl"></div>
          </motion.div>
        </div>
      </div>

      {/* CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }
      `}</style>
    </section>
  )
}

export default Hero; 