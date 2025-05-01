const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from root directory FIRST
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Initialize Stripe with the secret key AFTER environment variables are loaded
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Log environment variables (without sensitive info)
console.log('Environment loaded:');
console.log('- VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Set' : 'Not set');
console.log('- PORT:', process.env.PORT);
console.log('- CLIENT_URL:', process.env.CLIENT_URL);
console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set (hidden)' : 'Not set');

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define plan credit values
const PLAN_CREDITS = {
  'BASIC': 600,
};

// Routes
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, billingCycle } = req.body;
    
    console.log('Received checkout request:', { priceId, userId, billingCycle });

    if (!priceId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if Stripe is properly initialized
    if (!stripe) {
      console.error('Stripe object is not initialized');
      return res.status(500).json({ error: 'Stripe is not initialized' });
    }
    
    // Log Stripe secret key (masked for security)
    const maskKey = process.env.STRIPE_SECRET_KEY ? 
      `${process.env.STRIPE_SECRET_KEY.substring(0, 7)}...${process.env.STRIPE_SECRET_KEY.substring(process.env.STRIPE_SECRET_KEY.length - 4)}` : 
      'not set';
    console.log(`Using Stripe key: ${maskKey}`);

    try {
      // Create a checkout session with Stripe
      console.log('Creating Stripe checkout session with params:', {
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`
      });
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
        client_reference_id: userId,
        metadata: {
          userId,
          billingCycle
        }
      });

      console.log('Created session:', { id: session.id, url: session.url });
      res.json({ id: session.id });
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError);
      return res.status(500).json({ error: stripeError.message });
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-portal-session', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing user ID' });
    }

    // Get customer ID from Supabase
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscriptionError || !subscriptionData?.stripe_customer_id) {
      return res.status(404).json({ error: 'No subscription found for this user' });
    }

    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscriptionData.stripe_customer_id,
      return_url: `${process.env.CLIENT_URL}/account`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/verify-checkout-session', async (req, res) => {
  try {
    const { sessionId, userId } = req.body;
    
    console.log('Verifying checkout session:', { sessionId, userId });

    if (!sessionId || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Retrieve the checkout session from Stripe
      console.log('Retrieving session from Stripe:', sessionId);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('Session retrieved:', { 
        id: session.id, 
        status: session.status,
        paymentStatus: session.payment_status,
        customerId: session.customer,
        subscriptionId: session.subscription 
      });

      // In test mode, we can proceed even if the payment is not 'paid' yet
      // For production, you'd want to check payment_status === 'paid'
      if (!session) {
        console.error('Invalid session');
        return res.status(400).json({ error: 'Invalid session' });
      }

      try {
        // Get the subscription
        console.log('Retrieving subscription:', session.subscription);
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        console.log('Subscription status:', subscription.status);

        // Determine the plan from the subscription
        let planName = 'BASIC';

        // Example of how to map product to plan (this would depend on your Stripe setup)
        // You would need to match this to your actual products in Stripe
        const productId = subscription.items.data[0].price.product;
        const product = await stripe.products.retrieve(productId);
        console.log('Product:', { id: productId, name: product.name });
        
        if (product.name.includes('Pro')) {
          planName = 'PRO';
        } else if (product.name.includes('Business')) {
          planName = 'BUSINESS';
        }

        // Determine billing cycle
        const billingCycle = subscription.items.data[0].price.recurring.interval === 'year' ? 'yearly' : 'monthly';
        console.log('Plan and billing cycle:', { planName, billingCycle });

        // Update user's subscription in Supabase
        console.log('Updating subscription in Supabase');
        const { error: upsertError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            plan: planName,
            status: subscription.status,
            billing_cycle: billingCycle,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (upsertError) {
          console.error('Error updating subscription in database:', upsertError);
          return res.status(500).json({ error: 'Failed to update subscription' });
        }

        // Add credits to the user's profile based on the plan
        if (PLAN_CREDITS[planName]) {
          console.log('Adding credits to user profile');
          try {
            // First get current profile
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('credits, plan')
              .eq('id', userId)
              .single();

            if (profileError) {
              console.error('Error fetching profile:', profileError);
              // If profile doesn't exist, create one
              if (profileError.code === 'PGRST116') {
                console.log('Profile not found, creating new profile');
                const { error: insertError } = await supabase
                  .from('profiles')
                  .insert({
                    id: userId,
                    credits: PLAN_CREDITS[planName],
                    plan: planName,
                    updated_at: new Date().toISOString()
                  });
                
                if (insertError) {
                  console.error('Error creating profile:', insertError);
                } else {
                  console.log(`Created new profile with ${PLAN_CREDITS[planName]} credits`);
                }
              }
            } else {
              // Calculate new credits (existing + plan credits)
              const currentCredits = profileData?.credits || 0;
              const newCredits = currentCredits + PLAN_CREDITS[planName];
              console.log('Credits:', { current: currentCredits, new: newCredits, added: PLAN_CREDITS[planName] });

              // Update profile with new credits and plan
              const { error: updateError } = await supabase
                .from('profiles')
                .update({ 
                  credits: newCredits,
                  plan: planName,
                  updated_at: new Date().toISOString()
                })
                .eq('id', userId);
              
              if (updateError) {
                console.error('Error updating profile credits:', updateError);
              } else {
                console.log(`Updated profile with ${newCredits} credits`);
              }
            }
          } catch (creditError) {
            console.error('Error handling credits:', creditError);
          }
        }

        console.log('Verification successful');
        res.json({ success: true });
      } catch (subscriptionError) {
        console.error('Error processing subscription:', subscriptionError);
        return res.status(500).json({ error: 'Error processing subscription: ' + subscriptionError.message });
      }
    } catch (stripeError) {
      console.error('Error retrieving Stripe session:', stripeError);
      return res.status(500).json({ error: 'Error retrieving Stripe session: ' + stripeError.message });
    }
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionUpdate(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancellation(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handleSuccessfulPayment(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handleFailedPayment(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Helper functions for webhook handlers
async function handleSubscriptionUpdate(subscription) {
  try {
    // Get the customer ID to find the user
    const customerId = subscription.customer;
    
    // Find the user ID in the database using customer ID
    const { data: userData, error: userError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !userData) {
      console.error('Could not find user for subscription update', userError);
      return;
    }

    const userId = userData.user_id;

    // Determine the plan name based on the product
    let planName = 'BASIC';
    const productId = subscription.items.data[0].price.product;
    
    // Fetch product details to determine plan
    const product = await stripe.products.retrieve(productId);
    
    if (product.name.includes('Pro')) {
      planName = 'PRO';
    } else if (product.name.includes('Business')) {
      planName = 'BUSINESS';
    }

    // Determine billing cycle
    const billingCycle = subscription.items.data[0].price.recurring.interval === 'year' ? 'yearly' : 'monthly';

    // Update the subscription in database
    await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        plan: planName,
        billing_cycle: billingCycle,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

  } catch (error) {
    console.error('Error handling subscription update webhook:', error);
  }
}

async function handleSubscriptionCancellation(subscription) {
  try {
    // Get the customer ID to find the user
    const customerId = subscription.customer;
    
    // Find the user in the database using customer ID
    const { data: userData, error: userError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !userData) {
      console.error('Could not find user for subscription cancellation', userError);
      return;
    }

    const userId = userData.user_id;

    // Update the subscription in database
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

  } catch (error) {
    console.error('Error handling subscription cancellation webhook:', error);
  }
}

async function handleSuccessfulPayment(invoice) {
  try {
    // Only process subscription invoices
    if (!invoice.subscription) return;

    // Get the customer ID
    const customerId = invoice.customer;
    console.log('Processing successful payment for customer:', customerId);
    
    // Find the user in the database using customer ID
    const { data: userData, error: userError } = await supabase
      .from('subscriptions')
      .select('user_id, plan')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !userData) {
      console.error('Could not find user for payment success', userError);
      return;
    }

    const userId = userData.user_id;
    const planName = userData.plan;
    console.log(`Found user ${userId} with plan ${planName}`);

    // If this is a renewal invoice, add credits to the user's account
    if (PLAN_CREDITS[planName]) {
      console.log(`Adding ${PLAN_CREDITS[planName]} credits for plan ${planName}`);
      try {
        // Get current profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('credits, plan')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          // If profile doesn't exist, create one
          if (profileError.code === 'PGRST116') {
            console.log('Profile not found, creating new profile');
            const { error: insertError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                credits: PLAN_CREDITS[planName],
                plan: planName,
                updated_at: new Date().toISOString()
              });
            
            if (insertError) {
              console.error('Error creating profile:', insertError);
            } else {
              console.log(`Created new profile with ${PLAN_CREDITS[planName]} credits for recurring payment`);
            }
          }
        } else {
          // Calculate new credits (existing + plan credits)
          const currentCredits = profileData?.credits || 0;
          const newCredits = currentCredits + PLAN_CREDITS[planName];
          console.log('Recurring payment credits:', { 
            userId, 
            current: currentCredits, 
            added: PLAN_CREDITS[planName],
            new: newCredits 
          });

          // Update profile with new credits
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ 
              credits: newCredits,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId);
          
          if (updateError) {
            console.error('Error updating profile credits for recurring payment:', updateError);
          } else {
            console.log(`Updated profile for recurring payment with ${newCredits} credits`);
          }
        }
      } catch (creditError) {
        console.error('Error handling credits for recurring payment:', creditError);
      }
    }
  } catch (error) {
    console.error('Error handling successful payment webhook:', error);
  }
}

async function handleFailedPayment(invoice) {
  try {
    if (!invoice.subscription) return;
    
    // Get the customer ID
    const customerId = invoice.customer;
    
    // Find the user in the database using customer ID
    const { data: userData, error: userError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !userData) {
      console.error('Could not find user for payment failure', userError);
      return;
    }

    const userId = userData.user_id;

    // Update the subscription status in database to reflect payment issues
    await supabase
      .from('subscriptions')
      .update({
        status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

  } catch (error) {
    console.error('Error handling failed payment webhook:', error);
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
}); 