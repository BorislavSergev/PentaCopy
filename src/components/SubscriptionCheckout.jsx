import { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { createCheckoutSession, STRIPE_PLANS } from '../lib/stripe';
import { supabase } from '../lib/supabase';

export default function SubscriptionCheckout({ plan, billingCycle = 'monthly', onSuccess, currentPlan }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();

  const handleSubscribe = async () => {
    if (!stripe) {
      // Stripe.js hasn't loaded yet
      setError("Stripe hasn't loaded yet. Please try again in a moment.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Starting subscription process for plan ${plan} with ${billingCycle} billing`);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('You must be logged in to subscribe');
      }

      console.log(`User authenticated: ${user.id}`);

      // Get the price ID based on the selected plan and billing cycle
      const selectedPlan = STRIPE_PLANS[plan.toUpperCase()];
      if (!selectedPlan) {
        throw new Error(`Invalid plan selected: ${plan}`);
      }

      const priceId = selectedPlan[billingCycle];
      if (!priceId) {
        throw new Error(`No price ID found for ${plan} with ${billingCycle} billing`);
      }

      console.log(`Selected price ID: ${priceId}`);

      // Create checkout session and redirect to Stripe
      await createCheckoutSession(priceId, user.id, billingCycle);
      
      // The above function will redirect to Stripe Checkout
      // If successful, the onSuccess callback will be called after returning from Stripe
      
    } catch (error) {
      console.error('Error subscribing:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4h2V9H9zm0-1h2V7H9v1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {currentPlan === plan ? (
        <div className="w-full py-3 px-4 rounded-lg text-sm font-medium text-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
          Current Plan
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubscribe}
          disabled={loading || !stripe}
          className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-sm font-medium transition-colors duration-300 ${
            plan === 'PRO' 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Subscribe to {plan} ({billingCycle})
            </>
          )}
        </motion.button>
      )}
    </div>
  );
} 