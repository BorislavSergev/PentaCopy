import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { STRIPE_PLANS } from '../lib/stripe';
import SubscriptionCheckout from '../components/SubscriptionCheckout';

export default function Pricing() {
  const [user, setUser] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Pricing Plans
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Upgrade anytime to get more credits and advanced features.
          </p>

          {/* Billing toggle */}
          <div className="mt-12 flex justify-center">
            <div className="relative bg-white rounded-lg p-0.5 flex">
              <button
                type="button"
                className={`${
                  billingCycle === 'monthly' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700'
                } relative py-2 px-6 border border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly billing
              </button>
              <button
                type="button"
                className={`${
                  billingCycle === 'yearly' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-gray-700'
                } ml-0.5 relative py-2 px-6 border border-transparent rounded-md text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly billing
                <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 overflow-hidden lg:flex lg:flex-col lg:justify-between">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">Basic</h2>
              <p className="mt-4 text-gray-500">Start with the essential features.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">$0</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">3 chats per day</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Chat history up to 7 days</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Standard response quality</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {user ? (
                <Link
                  to="/chat"
                  className="block w-full py-3 px-4 rounded-md shadow text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="block w-full py-3 px-4 rounded-md shadow text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign Up for Free
                </Link>
              )}
            </div>
          </div>

          {/* Pro Plan - Highlighted */}
          <div className="bg-white rounded-lg shadow-md ring-2 ring-indigo-600 overflow-hidden lg:flex lg:flex-col lg:justify-between">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">Pro</h2>
              <p className="absolute top-0 -translate-y-1/2 translate-x-1/2 bg-indigo-600 text-white px-3 py-0.5 text-sm font-semibold rounded-full">
                Most Popular
              </p>
              <p className="mt-4 text-gray-500">Perfect for regular users with higher needs.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${billingCycle === 'yearly' ? STRIPE_PLANS.PRO.yearlyPrice : STRIPE_PLANS.PRO.price}
                </span>
                <span className="text-base font-medium text-gray-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">
                    {STRIPE_PLANS.PRO.credits} credits {billingCycle === 'yearly' ? 'per year' : 'per month'}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Unlimited chat history</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Enhanced response quality</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Priority support</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {loading ? (
                <button
                  disabled
                  className="block w-full py-3 px-4 rounded-md shadow text-center text-sm font-medium text-white bg-indigo-400 cursor-not-allowed"
                >
                  Loading...
                </button>
              ) : (
                user ? (
                  <SubscriptionCheckout plan="PRO" billingCycle={billingCycle} />
                ) : (
                  <Link
                    to="/register?plan=pro"
                    className="block w-full py-3 px-4 rounded-md shadow text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Sign Up for Pro
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Business Plan */}
          <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 overflow-hidden lg:flex lg:flex-col lg:justify-between">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900">Business</h2>
              <p className="mt-4 text-gray-500">For power users and teams with high volume needs.</p>
              <p className="mt-8">
                <span className="text-4xl font-extrabold text-gray-900">
                  ${billingCycle === 'yearly' ? STRIPE_PLANS.BUSINESS.yearlyPrice : STRIPE_PLANS.BUSINESS.price}
                </span>
                <span className="text-base font-medium text-gray-500">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">
                    {STRIPE_PLANS.BUSINESS.credits} credits {billingCycle === 'yearly' ? 'per year' : 'per month'}
                  </span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Unlimited chat history</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Premium response quality</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Premium support</span>
                </li>
                <li className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="ml-3 text-base text-gray-500">Advanced analytics</span>
                </li>
              </ul>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              {loading ? (
                <button
                  disabled
                  className="block w-full py-3 px-4 rounded-md shadow text-center text-sm font-medium text-white bg-indigo-400 cursor-not-allowed"
                >
                  Loading...
                </button>
              ) : (
                user ? (
                  <SubscriptionCheckout plan="BUSINESS" billingCycle={billingCycle} />
                ) : (
                  <Link
                    to="/register?plan=business"
                    className="block w-full py-3 px-4 rounded-md shadow text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Sign Up for Business
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center">Frequently asked questions</h2>
          <div className="mt-12 max-w-3xl mx-auto">
            <dl className="space-y-10">
              <div>
                <dt className="text-lg font-medium text-gray-900">What are credits and how do they work?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Credits are used each time you interact with PentaCopy. Different types of interactions may use different amounts of credits depending on complexity and length. Free users receive a limited number of interactions per day, while paid plans include a monthly credit allocation that refreshes at the start of each billing cycle.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">Can I upgrade or downgrade my plan?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, you can change your subscription plan at any time. When upgrading, you'll be charged the prorated difference immediately. When downgrading, your new plan will take effect at the end of your current billing cycle.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">Is there a refund policy?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  We offer a 7-day money-back guarantee for all paid plans. If you're not satisfied with our service, you can request a refund within 7 days of your initial purchase.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium text-gray-900">Do you offer team or enterprise plans?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes, for teams or organizations with specific needs, we offer custom enterprise plans with additional features, dedicated support, and volume discounts. Please contact our sales team at <a href="mailto:sales@pentacopy.com" className="text-indigo-600 hover:text-indigo-500">sales@pentacopy.com</a> for more information.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 