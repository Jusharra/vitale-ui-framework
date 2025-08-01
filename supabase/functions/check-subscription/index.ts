import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Initialize Supabase with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");

    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check for Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      
      // Update subscription record
      await supabaseClient.from("subscriptions").upsert({
        user_id: user.id,
        status: 'inactive',
        tier: null,
        stripe_customer_id: null,
        current_period_end: null,
        cancel_at_period_end: false,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({ 
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        assigned_partner: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;
    let stripeSubscriptionId = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      stripeSubscriptionId = subscription.id;
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Determine tier from price amount
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      // Map amount to tier (Vitalé has single premium tier)
      subscriptionTier = "premium";
      
      logStep("Active subscription found", { 
        subscriptionId: subscription.id, 
        endDate: subscriptionEnd,
        tier: subscriptionTier,
        amount 
      });
    } else {
      logStep("No active subscription found");
    }

    // Get user's profile and assigned partner info
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select(`
        *,
        assigned_partner_id,
        partners:assigned_partner_id (
          id,
          name,
          email,
          specializations,
          revenue_split_active
        )
      `)
      .eq('id', user.id)
      .single();

    // Check for trial status
    let trialStatus = null;
    if (profile?.assigned_partner_id) {
      const { data: trial } = await supabaseClient
        .from('partner_trials')
        .select('*')
        .eq('profile_id', user.id)
        .eq('partner_id', profile.assigned_partner_id)
        .eq('trial_status', 'active')
        .single();
      
      if (trial) {
        trialStatus = {
          trial_end_date: trial.trial_end_date,
          trial_status: trial.trial_status
        };
      }
    }

    // Update subscription record in database
    await supabaseClient.from("subscriptions").upsert({
      user_id: user.id,
      status: hasActiveSub ? 'active' : 'inactive',
      tier: subscriptionTier,
      stripe_customer_id: customerId,
      stripe_subscription_id: stripeSubscriptionId,
      current_period_end: subscriptionEnd,
      cancel_at_period_end: hasActiveSub ? subscriptions.data[0].cancel_at_period_end : false,
      assigned_partner_id: profile?.assigned_partner_id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    logStep("Subscription record updated", { 
      subscribed: hasActiveSub, 
      subscriptionTier,
      assignedPartner: profile?.assigned_partner_id 
    });

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      assigned_partner: profile?.partners || null,
      trial_status: trialStatus,
      cancel_at_period_end: hasActiveSub ? subscriptions.data[0].cancel_at_period_end : false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});