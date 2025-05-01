import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe publishable key from environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// API base URL - the server is always on port 4000 in development
const API_URL = 'http://localhost:4000';

// Plan IDs from Stripe - these should match your actual plan IDs in Stripe dashboard
export const STRIPE_PLANS = {
  BASIC: {
    monthly: 'price_1RGO0zIg0JmvmaJzX2MIxfrA', // Replace with actual Stripe price ID
    yearly: 'price_1RGO2XIg0JmvmaJzUckS5uts',    // Replace with actual Stripe price ID
    name: 'Basic',
    price: 67,
    yearlyPrice: 670,
    credits: 600
  }
};

// Function to initialize checkout session
export const createCheckoutSession = async (priceId, userId, billingCycle = 'monthly') => {
  try {
    console.log(`Creating checkout session with priceId: ${priceId}, userId: ${userId}, billingCycle: ${billingCycle}`);
    
    // Call to your backend to create a checkout session
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        billingCycle
      }),
    });
    
    const session = await response.json();
    console.log('Received session from server:', session);
    
    if (!session || !session.id) {
      console.error('Invalid session response:', session);
      throw new Error('No session ID returned from server');
    }
    
    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    console.log('Redirecting to checkout with sessionId:', session.id);
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (error) {
      console.error('Error redirecting to checkout:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Function to handle subscription management
export const manageSubscription = async (userId) => {
  try {
    // Call to your backend to create a customer portal session
    const response = await fetch(`${API_URL}/api/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });
    
    const session = await response.json();
    
    // Redirect to the customer portal
    window.location.href = session.url;
  } catch (error) {
    console.error('Error redirecting to customer portal:', error);
    throw error;
  }
};

export default stripePromise; 