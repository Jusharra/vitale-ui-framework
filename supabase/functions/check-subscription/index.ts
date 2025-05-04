
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Get Stripe API Key from environment
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe API key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get user from our users table
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      throw new Error("User not found");
    }

    // Check if user is in trial
    let isTrialing = false;
    if (userData.trial_status === 'active' && userData.trial_end_date) {
      const trialEndDate = new Date(userData.trial_end_date);
      isTrialing = trialEndDate > new Date();
    }

    // Check if user has a Stripe customer ID
    if (!userData.stripe_customer_id) {
      // No Stripe customer ID, they are either in trial or unsubscribed
      return new Response(
        JSON.stringify({
          subscription: null,
          isTrialing,
          membership_tier: userData.membership_tier,
          trial_ends_at: userData.trial_end_date,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: userData.stripe_customer_id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // No active subscription
      return new Response(
        JSON.stringify({
          subscription: null,
          isTrialing,
          membership_tier: userData.membership_tier,
          trial_ends_at: userData.trial_end_date,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const subscription = subscriptions.data[0];
    
    // Get the subscription tier from metadata
    let tier = "smart";
    if (subscription.metadata?.tier) {
      tier = subscription.metadata.tier;
    }

    // Update user record with current membership tier from subscription
    await supabase
      .from("users")
      .update({
        membership_tier: tier,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    // Update or insert into subscriptions table
    const subscriptionData = {
      user_id: user.id,
      stripe_subscription_id: subscription.id,
      tier,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    };

    // Check if the subscription record exists
    const { data: existingSubscription } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("stripe_subscription_id", subscription.id)
      .maybeSingle();

    if (existingSubscription) {
      await supabase
        .from("subscriptions")
        .update(subscriptionData)
        .eq("id", existingSubscription.id);
    } else {
      await supabase
        .from("subscriptions")
        .insert(subscriptionData);
    }

    // Return subscription data
    return new Response(
      JSON.stringify({
        subscription: {
          id: subscription.id,
          status: subscription.status,
          tier,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        },
        isTrialing,
        membership_tier: tier,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
