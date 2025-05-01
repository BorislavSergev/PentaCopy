import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

// API base URL - the server is always on port 4000 in development
const API_URL = 'http://localhost:4000';

export default function SubscriptionSuccess() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Get the session ID and plan from the URL
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        
        console.log('Verifying session ID:', sessionId);
        
        if (!sessionId) {
          throw new Error('Invalid session ID');
        }
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // If no user is logged in, redirect to login
          navigate('/login');
          return;
        }
        
        console.log('User authenticated:', user.id);
        
        // Call your backend to verify the session and update the user's subscription
        // In a real implementation, this would be handled by a webhook
        // This is just for demonstration purposes
        try {
          console.log('Calling API to verify checkout session');
          const response = await fetch(`${API_URL}/api/verify-checkout-session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sessionId,
              userId: user.id,
            }),
          });
          
          console.log('API response status:', response.status);
          
          if (!response.ok) {
            let errorMessage = 'Failed to verify checkout session';
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (e) {
              console.error('Error parsing error response:', e);
            }
            throw new Error(errorMessage);
          }
          
          const data = await response.json();
          console.log('Verification successful:', data);
          
          // Redirect to chat page after successful subscription
          setTimeout(() => {
            navigate('/chat');
          }, 5000); // Redirect after 5 seconds
        } catch (apiError) {
          console.error('API error:', apiError);
          throw apiError;
        }
        
      } catch (error) {
        console.error('Error verifying subscription:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    verifySession();
  }, [navigate, location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Subscription Successful!</h2>
          
          {loading ? (
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-indigo-500 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-left">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4h2V9H9zm0-1h2V7H9v1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <p className="mt-4">
                    <Link to="/account" className="text-indigo-600 hover:text-indigo-500">
                      Go to Account Settings
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-green-100 h-24 w-24 flex items-center justify-center mx-auto mb-6">
                <svg className="h-12 w-12 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              
              <p className="text-lg text-gray-600 mb-8">
                Thank you for subscribing to PentaCopy! Your payment was successful and your account has been upgraded.
              </p>
              
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/chat" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue to Chat
                </Link>
                
                <Link 
                  to="/account" 
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  View Account Settings
                </Link>
              </div>
              
              <p className="mt-6 text-sm text-gray-500">
                You will be redirected to the chat page automatically in a few seconds...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 