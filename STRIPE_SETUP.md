# Stripe Integration Setup Guide for PentaCopy

This guide will walk you through the process of setting up Stripe for the PentaCopy application.

## Prerequisites

1. A Stripe account (you can sign up at [stripe.com](https://stripe.com))
2. The PentaCopy application code
3. Supabase account with configured tables (see below)

## Stripe Account Setup

1. Sign in to your Stripe Dashboard: [dashboard.stripe.com](https://dashboard.stripe.com)
2. Ensure you're in test mode (toggle in the top-right corner should say "Test mode")

## Creating Products and Prices

1. Navigate to Products in your Stripe Dashboard
2. Create the following products with their respective prices:

### Basic Plan
- **Product Name**: Basic Plan
- **Prices**:
  - Monthly: $9.99/month
  - Yearly: $7.99/month (billed annually at $95.88)
- **Set your own Product ID or use Stripe's auto-generated ID**

### Pro Plan
- **Product Name**: Pro Plan
- **Prices**:
  - Monthly: $19.99/month
  - Yearly: $16.99/month (billed annually at $203.88)
- **Set your own Product ID or use Stripe's auto-generated ID**

### Business Plan
- **Product Name**: Business Plan
- **Prices**:
  - Monthly: $49.99/month
  - Yearly: $42.99/month (billed annually at $515.88)
- **Set your own Product ID or use Stripe's auto-generated ID**

## Updating Stripe Configuration

After creating your products and prices, update the Stripe price IDs in the application:

1. Open `pentacopy/src/lib/stripe.js`
2. Replace the placeholder price IDs with your actual Stripe price IDs:

```javascript
export const STRIPE_PLANS = {
  BASIC: {
    monthly: 'price_basic_monthly', // Replace with actual Stripe price ID
    yearly: 'price_basic_yearly',    // Replace with actual Stripe price ID
    name: 'Basic',
    price: 9.99,
    yearlyPrice: 7.99,
    credits: 1000
  },
  // ... and so on for PRO and BUSINESS plans
};
```

## Setting Up Webhooks

Stripe webhooks are necessary to handle subscription events:

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Click "Add endpoint"
3. For the endpoint URL, enter your server's webhook URL (e.g., `https://your-server.com/webhook` or use a tool like ngrok for local testing)
4. Select the following events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. After creating the webhook, you'll see a signing secret. Copy this value.
7. Add the signing secret to your server's `.env` file as `STRIPE_WEBHOOK_SECRET`.

## Supabase Database Setup

Create the following tables in your Supabase database:

### Subscriptions Table
```sql
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  billing_cycle TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX subscriptions_user_id_idx ON public.subscriptions(user_id);
CREATE INDEX subscriptions_stripe_customer_id_idx ON public.subscriptions(stripe_customer_id);
```

### Profiles Table (if not already created)
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX profiles_id_idx ON public.profiles(id);
```

## Environment Configuration

1. Configure your environment variables:
   - Copy the `server/.env.example` file to `server/.env`
   - Fill in the required values:
     - `STRIPE_SECRET_KEY`: Your Stripe secret key
     - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
     - `STRIPE_WEBHOOK_SECRET`: Your webhook signing secret
     - `VITE_SUPABASE_URL`: Your Supabase URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `CLIENT_URL`: Your frontend application URL

2. Make sure the frontend environment also has the Stripe publishable key:
   - In your frontend project root, ensure `.env` or `.env.local` has:
     - `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key`

## Running the Server

1. Navigate to the server directory: `cd pentacopy/server`
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`

The server should now be running and listening for Stripe webhook events.

## Testing the Integration

1. Use Stripe's test cards to simulate payments:
   - Success: `4242 4242 4242 4242`
   - Failure: `4000 0000 0000 0002`
2. Enter any future expiration date, any 3-digit CVC, and any billing address
3. After a successful test payment, verify that:
   - The subscription is created in your Supabase `subscriptions` table
   - Credits are added to the user's profile

## Going Live

When you're ready to go live:

1. Complete Stripe's account activation process
2. Switch to live mode in your Stripe dashboard
3. Update your environment variables with live keys
4. Update your webhook endpoint to point to your production server
5. Test thoroughly with small transactions before full launch

## Support and Troubleshooting

If you encounter issues:
- Check the server logs for error messages
- Verify webhook events in the Stripe Dashboard (Developers > Webhooks > Select your endpoint > Recent events)
- Ensure your firewall allows incoming connections to your webhook endpoint
- Confirm your Stripe API keys are correctly configured 