import React from 'react';
import { motion } from 'framer-motion';
import { STRIPE_PLANS } from '../../lib/stripe';

const SubscriptionManagementCard = ({ 
  subscription, 
  profile, 
  handleManageSubscription,
  formatDate,
  scrollToPlans
}) => {
  // Get plan display info
  const getPlanInfo = () => {
    if (!subscription || !subscription.plan || subscription.plan === 'None') {
      return { name: 'Free (No Plan)', price: 0, billing_cycle: 'monthly' };
    }
    
    const plan = Object.values(STRIPE_PLANS).find(p => p.name.toUpperCase() === subscription.plan.toUpperCase());
    if (!plan) return { name: subscription.plan, price: 'Custom', billing_cycle: subscription.billing_cycle || 'monthly' };
    
    return {
      name: plan.name,
      price: subscription.billing_cycle === 'yearly' ? plan.yearlyPrice : plan.price,
      billing_cycle: subscription.billing_cycle || 'monthly'
    };
  };

  const planInfo = getPlanInfo();
  const needsSubscription = !subscription || subscription.plan === 'None';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Subscription Management</h2>
      </div>
      
      <div className="p-6">
        {!needsSubscription ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{planInfo.name} Plan</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      ${planInfo.price}/{planInfo.billing_cycle}
                    </p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full uppercase font-semibold">
                    Active
                  </div>
                </div>
                
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Billing Cycle</span>
                    <span className="font-medium capitalize">{planInfo.billing_cycle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Next Billing Date</span>
                    <span className="font-medium">{formatDate(subscription.current_period_end)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Credits per {planInfo.billing_cycle}</span>
                    <span className="font-medium">
                      {STRIPE_PLANS[subscription.plan]?.credits.toLocaleString() || 'Custom'}
                    </span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleManageSubscription}
                  className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Manage Subscription
                </motion.button>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Need More Credits?</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Consider upgrading your plan to get more credits and features. Compare all our plans below.
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToPlans}
                  className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-indigo-600 dark:border-indigo-400 text-sm font-medium rounded-lg text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Compare Plans
                </motion.button>
              </div>
            </div>
            
            <div className="mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Credit Usage Breakdown</h3>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Credits Used</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {100 - Math.round((profile?.credits / STRIPE_PLANS[subscription.plan]?.credits) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${100 - Math.round((profile?.credits / STRIPE_PLANS[subscription.plan]?.credits) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {STRIPE_PLANS[subscription.plan]?.credits - profile?.credits} used
                      </span>
                      <span>
                        {profile?.credits} remaining
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center py-2">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Credits</div>
                      <div className="text-lg font-semibold">{STRIPE_PLANS[subscription.plan]?.credits.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="text-xs text-gray-500 dark:text-gray-400">Renews In</div>
                      <div className="text-lg font-semibold">
                        {Math.ceil((new Date(subscription.current_period_end).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-indigo-300 dark:border-indigo-700 p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-4">
                  <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Subscription</h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-md mx-auto">
                  You currently don't have an active subscription plan. Subscribe now to get credits and access premium features.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    A subscription plan gives you a monthly or yearly allocation of credits to use in our app, along with premium features and support options.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={scrollToPlans}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Choose a Subscription Plan
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubscriptionManagementCard; 