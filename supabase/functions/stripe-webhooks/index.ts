
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

// This function verifies that the webhook came from Stripe
const verifyStripeSignature = async (req: Request, stripeWebhookSecret: string) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) throw new Error('No Stripe signature found');
  
  const body = await req.text();
  
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2023-10-16",
  });
  
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    );
    return { event, rawBody: body };
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }
};

serve(async (req) => {
  // This webhook should be called by Stripe, so we don't need CORS headers
  
  try {
    // Use environment variable for webhook secret
    const stripeWebhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!stripeWebhookSecret) {
      throw new Error("STRIPE_WEBHOOK_SECRET is not set");
    }
    
    // Verify the webhook signature
    const { event } = await verifyStripeSignature(req, stripeWebhookSecret);
    
    // Initialize Supabase client with service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
      { auth: { persistSession: false } }
    );
    
    console.log(`Processing webhook event: ${event.type}`);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        if (session.mode === 'subscription') {
          // Handle new subscription
          const customerId = session.customer;
          const subscriptionId = session.subscription;
          
          // Get subscription details from Stripe
          const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
            apiVersion: "2023-10-16",
          });
          
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          
          // Get the tier from metadata
          const tier = subscription.metadata?.tier || 'smart';
          
          // Find user by Stripe customer ID
          const { data: userData, error: userError } = await supabaseClient
            .from("users")
            .select("id")
            .eq("stripe_customer_id", customerId)
            .single();
            
          if (userError) {
            console.error(`Error finding user for customer ${customerId}:`, userError);
            throw new Error(`Error finding user for customer ${customerId}`);
          }
          
          // Update the user's membership tier and trial status
          await supabaseClient
            .from("users")
            .update({
              membership_tier: tier,
              trial_status: 'completed',
              updated_at: new Date().toISOString()
            })
            .eq("id", userData.id);
            
          // Create or update subscription record
          const subscriptionData = {
            user_id: userData.id,
            stripe_subscription_id: subscription.id,
            tier: tier,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          // Check if subscription record exists
          const { data: existingSub } = await supabaseClient
            .from("subscriptions")
            .select("id")
            .eq("stripe_subscription_id", subscription.id)
            .maybeSingle();
            
          if (existingSub) {
            // Update existing record
            await supabaseClient
              .from("subscriptions")
              .update(subscriptionData)
              .eq("id", existingSub.id);
          } else {
            // Create new record
            await supabaseClient
              .from("subscriptions")
              .insert(subscriptionData);
          }
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        // Get the tier from metadata
        const tier = subscription.metadata?.tier || 'smart';
        
        // Find user by Stripe subscription ID
        const { data: subData, error: subError } = await supabaseClient
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();
          
        if (subError) {
          console.error(`Error finding subscription ${subscription.id}:`, subError);
          throw new Error(`Error finding subscription ${subscription.id}`);
        }
        
        // Update subscription record
        await supabaseClient
          .from("subscriptions")
          .update({
            status: subscription.status,
            tier: tier,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", subscription.id);
          
        // Update user's membership tier
        await supabaseClient
          .from("users")
          .update({
            membership_tier: tier,
            updated_at: new Date().toISOString()
          })
          .eq("id", subData.user_id);
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Find user by Stripe subscription ID
        const { data: subData, error: subError } = await supabaseClient
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscription.id)
          .single();
          
        if (subError) {
          console.error(`Error finding subscription ${subscription.id}:`, subError);
          throw new Error(`Error finding subscription ${subscription.id}`);
        }
        
        // Update subscription record
        await supabaseClient
          .from("subscriptions")
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", subscription.id);
          
        // Downgrade user to 'smart' tier
        await supabaseClient
          .from("users")
          .update({
            membership_tier: 'smart',
            updated_at: new Date().toISOString()
          })
          .eq("id", subData.user_id);
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const subscriptionId = invoice.subscription;
        
        // Find subscription by Stripe subscription ID
        const { data: subData, error: subError } = await supabaseClient
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_subscription_id", subscriptionId)
          .single();
          
        if (subError) {
          console.error(`Error finding subscription ${subscriptionId}:`, subError);
          break;
        }
        
        // Optional: Create a notification in a notifications table
        // This is just a placeholder - you would need to create this table
        try {
          await supabaseClient
            .from("notifications")
            .insert({
              user_id: subData.user_id,
              type: 'payment_failed',
              message: 'Your latest payment failed. Please update your payment method.',
              created_at: new Date().toISOString()
            });
        } catch (error) {
          console.error("Notification table might not exist yet:", error);
        }
        break;
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
