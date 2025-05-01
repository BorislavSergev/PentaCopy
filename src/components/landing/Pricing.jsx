import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const PricingCard = ({ title, price, yearlyPrice, credits, features, isPopular, isMonthly }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border ${
      isPopular ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' : 'border-gray-200 dark:border-gray-700'
    } relative hover:transform hover:scale-105 transition-all duration-300`}
  >
    {isPopular && (
      <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 text-sm font-semibold">
        Most Popular
      </div>
    )}
    
    <div className="p-8">
      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
      
      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">${isMonthly ? price : yearlyPrice}</span>
        <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>
      </div>
      
      {isMonthly ? (
        <p className="text-gray-600 dark:text-gray-300 mb-6">or ${yearlyPrice}/month billed annually</p>
      ) : (
        <p className="text-gray-600 dark:text-gray-300 mb-6">billed annually (${(yearlyPrice * 12).toFixed(2)}/year)</p>
      )}
      
      <div className="mb-6 flex items-center">
        <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <span className="text-gray-700 dark:text-gray-300 text-sm">Credits/month</span>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{credits.toLocaleString()}</p>
        </div>
      </div>
      
      <ul className="mb-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span className="text-gray-600 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link 
        to="/register" 
        className={`block text-center py-3 px-6 rounded-xl font-medium transition duration-300 ${
          isPopular 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        Get Started
      </Link>
    </div>
  </motion.div>
);

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  const plans = [
    {
      title: "Basic",
      price: 9.99,
      yearlyPrice: 7.99,
      credits: 1000,
      features: [
        "Access to Gemini AI",
        "Chat history for 30 days",
        "Email support",
        "Dark mode support"
      ],
      isPopular: false
    },
    {
      title: "Pro",
      price: 19.99,
      yearlyPrice: 16.99,
      credits: 5000,
      features: [
        "Everything in Basic",
        "Access to all AI models",
        "Priority support",
        "Unlimited chat history"
      ],
      isPopular: true
    },
    {
      title: "Business",
      price: 49.99,
      yearlyPrice: 42.99,
      credits: 15000,
      features: [
        "Everything in Pro",
        "Team collaboration tools",
        "Dedicated account manager",
        "Custom AI model fine-tuning"
      ],
      isPopular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute -bottom-48 -left-48 opacity-10 dark:opacity-5" width="800" height="800" fill="none">
          <circle cx="400" cy="400" r="400" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#6366F1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <svg className="absolute -top-48 -right-48 opacity-10 dark:opacity-5" width="800" height="800" fill="none">
          <circle cx="400" cy="400" r="400" fill="url(#paint1_radial)" />
          <defs>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(400 400) rotate(90) scale(400)">
              <stop stopColor="#6366F1" />
              <stop offset="1" stopColor="#6366F1" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full inline-block mb-4">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that works for you and start creating amazing content today.
            </p>
          </motion.div>
          
          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`py-2 px-6 rounded-lg text-sm font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`py-2 px-6 rounded-lg text-sm font-medium transition flex items-center ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-gray-700 shadow text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Yearly
              <span className="ml-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-400 text-xs py-0.5 px-1.5 rounded-full whitespace-nowrap">Save 20%</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard 
              key={index} 
              {...plan} 
              isMonthly={billingCycle === 'monthly'} 
            />
          ))}
        </div>
        
        {/* Credit Explainer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <h3 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white text-center">How Credits Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">1. Choose Your Plan</h4>
              <p className="text-gray-600 dark:text-gray-300">Each plan comes with a monthly allocation of credits that refresh with your billing cycle.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">2. Use Your Credits</h4>
              <p className="text-gray-600 dark:text-gray-300">Each chat interaction uses a small number of credits based on the length and complexity of your request.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">3. Track Usage</h4>
              <p className="text-gray-600 dark:text-gray-300">Monitor your credit usage in real-time through your account dashboard.</p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <Link to="/register" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition duration-200">
              <span>Learn more about our credit system</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Pricing; 