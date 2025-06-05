import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@14.22.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response(JSON.stringify({ error: 'No Stripe signature found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );
    } catch (err) {
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get the customer ID and user ID from the session
        const customerId = session.customer;
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier || 'smart';
        
        if (userId && customerId) {
          // Update the user's profile with the Stripe customer ID and membership tier
          await supabase
            .from('profiles')
            .update({ 
              stripe_customer_id: customerId,
              membership_tier: tier,
              trial_status: 'inactive' // If they've completed checkout, they're no longer in trial
            })
            .eq('id', userId);
            
          // Create or update the subscription record
          const subscriptionId = session.subscription;
          if (subscriptionId) {
            // Get subscription details from Stripe
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            
            await supabase
              .from('subscriptions')
              .upsert({
                id: subscriptionId,
                user_id: userId,
                stripe_subscription_id: subscriptionId,
                tier: tier,
                status: subscription.status,
                current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                cancel_at_period_end: subscription.cancel_at_period_end,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }, { onConflict: 'id' });
          }
        }
        break;
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Find the user with this Stripe customer ID
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, membership_tier')
          .eq('stripe_customer_id', customerId);
          
        if (profiles && profiles.length > 0) {
          const userId = profiles[0].id;
          const tier = subscription.metadata?.tier || profiles[0].membership_tier || 'smart';
          
          // Update the subscription record
          await supabase
            .from('subscriptions')
            .upsert({
              id: subscription.id,
              user_id: userId,
              stripe_subscription_id: subscription.id,
              tier: tier,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' });
            
          // If the subscription status changed, update the user's membership tier
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            await supabase
              .from('profiles')
              .update({ 
                membership_tier: tier,
                trial_status: subscription.status === 'trialing' ? 'active' : 'inactive',
                trial_end_date: subscription.trial_end 
                  ? new Date(subscription.trial_end * 1000).toISOString() 
                  : null
              })
              .eq('id', userId);
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Find the user with this Stripe customer ID
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId);
          
        if (profiles && profiles.length > 0) {
          const userId = profiles[0].id;
          
          // Update the subscription record
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString()
            })
            .eq('id', subscription.id);
            
          // Downgrade the user to the basic tier
          await supabase
            .from('profiles')
            .update({ 
              membership_tier: 'smart',
              trial_status: 'inactive',
              trial_end_date: null
            })
            .eq('id', userId);
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;
        
        if (customerId && subscriptionId) {
          // Find the user with this Stripe customer ID
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId);
            
          if (profiles && profiles.length > 0) {
            const userId = profiles[0].id;
            
            // Record the payment in the payment_history table
            await supabase
              .from('payment_history')
              .insert({
                user_id: userId,
                stripe_payment_id: invoice.id,
                amount: invoice.amount_paid,
                currency: invoice.currency,
                status: 'succeeded',
                payment_method: invoice.payment_method_types?.[0] || 'card',
                description: invoice.description || 'Subscription payment',
              });
          }
        }
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        
        if (customerId) {
          // Find the user with this Stripe customer ID
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_customer_id', customerId);
            
          if (profiles && profiles.length > 0) {
            const userId = profiles[0].id;
            
            // Record the failed payment
            await supabase
              .from('payment_history')
              .insert({
                user_id: userId,
                stripe_payment_id: invoice.id,
                amount: invoice.amount_due,
                currency: invoice.currency,
                status: 'failed',
                payment_method: invoice.payment_method_types?.[0] || 'card',
                description: 'Failed subscription payment',
              });
          }
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});