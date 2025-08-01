import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-ALL-SUBSCRIPTIONS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Background sync started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    // Use service role key to access all user data
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Get all subscriptions that might need syncing (including those without stripe_customer_id)
    const { data: subscriptions, error: subscriptionsError } = await supabaseClient
      .from('subscriptions')
      .select('id, user_id, stripe_customer_id, stripe_subscription_id, status, tier, current_period_end, cancel_at_period_end, email');

    if (subscriptionsError) {
      throw new Error(`Failed to fetch subscriptions: ${subscriptionsError.message}`);
    }

    if (!subscriptions || subscriptions.length === 0) {
      logStep("No subscriptions found");
      return new Response(JSON.stringify({ message: "No subscriptions to sync", synced: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Found subscriptions to sync", { count: subscriptions.length });

    let syncedCount = 0;
    const errors: any[] = [];

    // Process each subscription
    for (const subscription of subscriptions) {
      try {
        logStep("Processing subscription", { userId: subscription.user_id, customerId: subscription.stripe_customer_id, email: subscription.email });

        let customerId = subscription.stripe_customer_id;
        
        // If no stripe_customer_id, try to find customer by email
        if (!customerId && subscription.email) {
          logStep("No customer ID found, searching by email", { email: subscription.email });
          const customers = await stripe.customers.list({ 
            email: subscription.email, 
            limit: 1 
          });
          
          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
            logStep("Found customer by email", { customerId, email: subscription.email });
          } else {
            logStep("No Stripe customer found for email", { email: subscription.email });
          }
        }

        let hasActiveSub = false;
        let subscriptionTier = null;
        let subscriptionEnd = null;
        let cancelAtPeriodEnd = false;
        let stripeSubscriptionId = null;

        // Only query Stripe if we have a customer ID
        if (customerId) {
          const stripeSubscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            limit: 1,
          });

          hasActiveSub = stripeSubscriptions.data.length > 0;

          if (hasActiveSub) {
            const stripeSubscription = stripeSubscriptions.data[0];
            stripeSubscriptionId = stripeSubscription.id;
            subscriptionEnd = new Date(stripeSubscription.current_period_end * 1000).toISOString();
            cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end || false;

            // Determine subscription tier from price
            const priceId = stripeSubscription.items.data[0].price.id;
            const price = await stripe.prices.retrieve(priceId);
            const amount = price.unit_amount || 0;
            
            if (amount <= 999) {
              subscriptionTier = "basic";
            } else if (amount <= 1999) {
              subscriptionTier = "premium";
            } else {
              subscriptionTier = "vip";
            }

            logStep("Active subscription found", { 
              userId: subscription.user_id, 
              subscriptionId: stripeSubscriptionId,
              tier: subscriptionTier, 
              endDate: subscriptionEnd,
              cancelAtPeriodEnd 
            });
          } else {
            logStep("No active subscription found", { userId: subscription.user_id, customerId });
          }
        } else {
          logStep("No customer ID available, marking as inactive", { userId: subscription.user_id, email: subscription.email });
        }

        // Get user email from auth.users
        const { data: authUser } = await supabaseClient.auth.admin.getUserById(subscription.user_id);
        const userEmail = authUser?.user?.email;

        // Prepare update data with proper null handling
        const updateData: any = {
          user_id: subscription.user_id,
          stripe_customer_id: customerId, // Use the found customer ID
          stripe_subscription_id: stripeSubscriptionId,
          status: hasActiveSub ? 'active' : 'inactive',
          tier: subscriptionTier,
          current_period_end: subscriptionEnd,
          cancel_at_period_end: cancelAtPeriodEnd,
          updated_at: new Date().toISOString(),
        };

        // Only add email if we found it
        if (userEmail) {
          updateData.email = userEmail;
        }

        // Update the subscriptions table
        const { error: upsertError } = await supabaseClient
          .from('subscriptions')
          .upsert(updateData, { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          });

        if (upsertError) {
          logStep("Failed to update subscription", { userId: subscription.user_id, error: upsertError.message });
          errors.push({ userId: subscription.user_id, error: upsertError.message });
        } else {
          syncedCount++;
          logStep("Successfully synced", { userId: subscription.user_id, hasActiveSub, tier: subscriptionTier });
        }

        // Small delay to avoid hitting Stripe rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep("Error processing subscription", { userId: subscription.user_id, error: errorMessage });
        errors.push({ userId: subscription.user_id, error: errorMessage });
      }
    }

    logStep("Sync completed", { 
      totalSubscriptions: subscriptions.length, 
      synced: syncedCount, 
      errors: errors.length 
    });

    return new Response(JSON.stringify({
      message: "Sync completed",
      totalSubscriptions: subscriptions.length,
      synced: syncedCount,
      errors: errors.length > 0 ? errors : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in sync-all-subscriptions", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});