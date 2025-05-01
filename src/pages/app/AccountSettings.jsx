import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { manageSubscription, STRIPE_PLANS } from '../../lib/stripe';
import { useTheme } from '../../context/ThemeContext';

// Import components
import AccountSidebar from '../../components/account/AccountSidebar';
import UserProfileCard from '../../components/account/UserProfileCard';
import SubscriptionManagementCard from '../../components/account/SubscriptionManagementCard';
import PaymentHistorySection from '../../components/account/PaymentHistorySection';
import UpgradePlanCard from '../../components/account/UpgradePlanCard';
import AccountManagementCard from '../../components/account/AccountManagementCard';

export default function AccountSettings() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const itemsPerPage = 5;
  const upgradePlansRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUser(user);
          
          // Fetch user's profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profileError) throw profileError;
          setProfile(profileData);
          
          // Fetch user's subscription
          const { data: subscriptionData, error: subscriptionError } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .order('current_period_end', { ascending: false })
            .limit(1)
            .maybeSingle();
          
          // Create mock payment history regardless of subscription status
          const mockPaymentHistory = [
            { 
              id: '1', 
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), 
              amount: subscriptionData?.billing_cycle === 'yearly' ? 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.yearlyPrice * 12 : 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.price || 67, 
              status: 'paid',
              description: `${subscriptionData?.plan || 'Free'} Plan - ${subscriptionData?.billing_cycle || 'monthly'} subscription` 
            },
            { 
              id: '2', 
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), 
              amount: subscriptionData?.billing_cycle === 'yearly' ? 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.yearlyPrice * 12 : 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.price || 67, 
              status: 'paid',
              description: `${subscriptionData?.plan || 'Free'} Plan - ${subscriptionData?.billing_cycle || 'monthly'} subscription` 
            },
            { 
              id: '3', 
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), 
              amount: subscriptionData?.billing_cycle === 'yearly' ? 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.yearlyPrice * 12 : 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.price || 67, 
              status: 'paid',
              description: `${subscriptionData?.plan || 'Free'} Plan - ${subscriptionData?.billing_cycle || 'monthly'} subscription` 
            },
            { 
              id: '4', 
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120), 
              amount: subscriptionData?.billing_cycle === 'yearly' ? 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.yearlyPrice * 12 : 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.price || 67, 
              status: 'paid',
              description: `${subscriptionData?.plan || 'Free'} Plan - ${subscriptionData?.billing_cycle || 'monthly'} subscription` 
            },
            { 
              id: '5', 
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 150), 
              amount: subscriptionData?.billing_cycle === 'yearly' ? 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.yearlyPrice * 12 : 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.price || 67, 
              status: 'paid',
              description: `${subscriptionData?.plan || 'Free'} Plan - ${subscriptionData?.billing_cycle || 'monthly'} subscription` 
            },
            { 
              id: '6', 
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180), 
              amount: subscriptionData?.billing_cycle === 'yearly' ? 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.yearlyPrice * 12 : 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.price || 67, 
              status: 'failed',
              description: `${subscriptionData?.plan || 'Free'} Plan - ${subscriptionData?.billing_cycle || 'monthly'} subscription` 
            },
            { 
              id: '7', 
              date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 210), 
              amount: subscriptionData?.billing_cycle === 'yearly' ? 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.yearlyPrice * 12 : 
                STRIPE_PLANS[subscriptionData?.plan || 'BASIC']?.price || 67, 
              status: 'paid',
              description: `${subscriptionData?.plan || 'Free'} Plan - ${subscriptionData?.billing_cycle || 'monthly'} subscription` 
            },
          ];
          
          setPaymentHistory(mockPaymentHistory);
          setTotalPages(Math.ceil(mockPaymentHistory.length / itemsPerPage));
          
          if (!subscriptionError && subscriptionData) {
            setSubscription(subscriptionData);
          } else {
            setSubscription(null);
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);

  // Handle managing existing subscription
  const handleManageSubscription = async () => {
    try {
      if (!user) return;
      await manageSubscription(user.id);
    } catch (error) {
      console.error('Error managing subscription:', error);
      setError(error.message);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Handle scroll to upgrade plans section
  const scrollToPlans = () => {
    if (upgradePlansRef.current) {
      upgradePlansRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white overflow-hidden">
      {/* Sidebar */}
      <AccountSidebar user={user} profile={profile} sidebarOpen={sidebarOpen} />
      
      {/* Overlay for mobile menu */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="md:hidden mr-3 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Toggle sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Account Settings</h1>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={scrollToPlans}
                className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-full shadow-sm transition-colors duration-300"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upgrade Plan
              </button>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 pb-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-[50vh]">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading your account information...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6 max-w-4xl mx-auto rounded-md shadow-sm">
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
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* User Profile Card */}
              <UserProfileCard user={user} profile={profile} />
              
              {/* Subscription Management Card */}
              <SubscriptionManagementCard 
                subscription={subscription} 
                profile={profile} 
                handleManageSubscription={handleManageSubscription}
                formatDate={formatDate}
                scrollToPlans={scrollToPlans} 
              />
              
              {/* Payment History Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold">Billing History</h2>
                </div>
                
                <div className="p-6">
                  <PaymentHistorySection 
                    paymentHistory={paymentHistory}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                    formatDate={formatDate}
                    itemsPerPage={itemsPerPage}
                  />
                </div>
              </motion.div>
              
              {/* Plan Comparison */}
              <div ref={upgradePlansRef}>
                <UpgradePlanCard 
                  subscription={subscription}
                  billingCycle={billingCycle}
                  setBillingCycle={setBillingCycle}
                />
              </div>
              
              {/* Account Management */}
              <AccountManagementCard />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}