import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Error component that's shown when Stripe fails to load
const StripeError = ({ error }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
    <strong className="font-bold">Payment system error:</strong>
    <span className="block sm:inline"> {error?.message || 'Could not load payment system.'}</span>
    <p className="mt-2">Please try refreshing the page. If the problem persists, contact support.</p>
  </div>
);

// Stripe provider component to provide Stripe context to child components
export default function StripeProvider({ children }) {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  useEffect(() => {
    // Check if Stripe loaded successfully
    if (stripePromise) {
      stripePromise
        .then(() => {
          setStripeLoaded(true);
        })
        .catch((error) => {
          console.error('Stripe failed to load:', error);
          setStripeError(error);
        });
    } else {
      // Handle missing Stripe key
      setStripeError(new Error('Stripe configuration is missing.'));
    }
  }, []);

  // Show error when Stripe fails to load
  if (stripeError) {
    return <StripeError error={stripeError} />;
  }

  // Return Elements provider with Stripe instance
  return (
    <Elements stripe={stripePromise} options={{ locale: 'en' }}>
      {children}
    </Elements>
  );
} 