import React from 'react';
import { motion } from 'framer-motion';
import { STRIPE_PLANS } from '../../lib/stripe';
import SubscriptionCheckout from '../SubscriptionCheckout';

const UpgradePlanCard = ({ 
  subscription,
  billingCycle, 
  setBillingCycle
}) => {
  return (
    <motion.div
      id="upgrade-plans"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Upgrade Your Plan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Choose the plan that best fits your needs
          </p>
        </div>
        
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
              billingCycle === 'monthly'
                ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
              billingCycle === 'yearly'
                ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-400'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Yearly <span className="text-green-500 font-medium">-20%</span>
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(STRIPE_PLANS).map(([key, plan], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              className={`rounded-xl overflow-hidden border relative ${
                subscription?.plan === key 
                  ? 'border-indigo-500 dark:border-indigo-400 shadow-lg' 
                  : 'border-gray-200 dark:border-gray-700 shadow-sm'
              }`}
            >
              {subscription?.plan === key && (
                <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              )}
              
              <div className={`p-6 ${
                subscription?.plan === key 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'bg-white dark:bg-gray-800'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {key === 'BASIC' ? 'For personal use' : key === 'PRO' ? 'For professionals' : 'For businesses'}
                    </p>
                  </div>
                  {subscription?.plan === key && (
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full uppercase font-semibold flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Current
                    </span>
                  )}
                </div>
                
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${billingCycle === 'yearly' ? plan.yearlyPrice : plan.price}
                  </span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    /{billingCycle.replace('ly', '')}
                  </span>
                </div>
                
                <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {billingCycle === 'yearly' 
                    ? (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Save ${((plan.price * 12) - (plan.yearlyPrice * 12)).toFixed(2)} per year
                      </span>
                    ) 
                    : `Billed monthly`
                  }
                </div>
                
                <div className="mt-6 flex items-center">
                  <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {plan.credits.toLocaleString()} credits
                  </span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    per {billingCycle.replace('ly', '')}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      {key === 'BASIC' ? 'Unlimited chat history' : 'Unlimited chat history'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      {key === 'BASIC' ? 'Access to HeadlinesAI' : 'Access to all AI models'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300">
                      {key === 'BASIC' ? 'Email support' : key === 'INTERMEDIATE' ? 'Priority support' : 'Dedicated account manager'}
                    </span>
                  </li>
                  {key !== 'BASIC' && (
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-gray-600 dark:text-gray-300">
                        {key === 'INTERMEDIATE' ? 'Priority queue processing' : 'Custom API integration'}
                      </span>
                    </li>
                  )}
                </ul>
                
                {subscription?.plan === key ? (
                  <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700/30 py-2 rounded-lg">
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                      </svg>
                      Current plan
                    </span>
                  </div>
                ) : (
                  <SubscriptionCheckout 
                    plan={key} 
                    billingCycle={billingCycle}
                    currentPlan={subscription?.plan}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 text-sm text-center">
          <p className="text-gray-700 dark:text-gray-300">
            Need a custom plan? <a href="#" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Contact our sales team</a> for more options.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default UpgradePlanCard; 