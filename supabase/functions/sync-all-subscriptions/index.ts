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

    // Get all profiles with stripe customer IDs that might need syncing
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, email, stripe_customer_id')
      .not('stripe_customer_id', 'is', null);

    if (profilesError) {
      throw new Error(`Failed to fetch profiles: ${profilesError.message}`);
    }

    if (!profiles || profiles.length === 0) {
      logStep("No profiles with Stripe customer IDs found");
      return new Response(JSON.stringify({ message: "No profiles to sync", synced: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("Found profiles to sync", { count: profiles.length });

    let syncedCount = 0;
    const errors: any[] = [];

    // Process each profile
    for (const profile of profiles) {
      try {
        logStep("Processing profile", { profileId: profile.id, email: profile.email });

        // Get current subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: "active",
          limit: 1,
        });

        const hasActiveSub = subscriptions.data.length > 0;
        let subscriptionTier = null;
        let subscriptionEnd = null;
        let cancelAtPeriodEnd = false;

        if (hasActiveSub) {
          const subscription = subscriptions.data[0];
          subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
          cancelAtPeriodEnd = subscription.cancel_at_period_end || false;

          // Determine subscription tier from price
          const priceId = subscription.items.data[0].price.id;
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
            profileId: profile.id, 
            tier: subscriptionTier, 
            endDate: subscriptionEnd,
            cancelAtPeriodEnd 
          });
        } else {
          logStep("No active subscription found", { profileId: profile.id });
        }

        // Update the subscriptions table
        const { error: upsertError } = await supabaseClient
          .from('subscriptions')
          .upsert({
            user_id: profile.id,
            status: hasActiveSub ? 'active' : 'inactive',
            tier: subscriptionTier,
            current_period_end: subscriptionEnd,
            cancel_at_period_end: cancelAtPeriodEnd,
            updated_at: new Date().toISOString(),
          }, { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          });

        if (upsertError) {
          logStep("Failed to update subscription", { profileId: profile.id, error: upsertError.message });
          errors.push({ profileId: profile.id, error: upsertError.message });
        } else {
          syncedCount++;
          logStep("Successfully synced", { profileId: profile.id, hasActiveSub, tier: subscriptionTier });
        }

        // Small delay to avoid hitting Stripe rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logStep("Error processing profile", { profileId: profile.id, error: errorMessage });
        errors.push({ profileId: profile.id, error: errorMessage });
      }
    }

    logStep("Sync completed", { 
      totalProfiles: profiles.length, 
      synced: syncedCount, 
      errors: errors.length 
    });

    return new Response(JSON.stringify({
      message: "Sync completed",
      totalProfiles: profiles.length,
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