
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

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse request body
    const { tier, interval, price, trial = false } = await req.json();
    
    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Check if customer already exists
    let customerId;
    const { data: userData } = await supabase
      .from("users")
      .select("stripe_customer_id, trial_status, trial_end_date")
      .eq("id", user.id)
      .single();
      
    const isInTrial = userData?.trial_status === 'active' && 
                      userData?.trial_end_date && 
                      new Date(userData.trial_end_date) > new Date();
      
    if (userData?.stripe_customer_id) {
      customerId = userData.stripe_customer_id;
    } else {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
      
      // Update user record with Stripe customer ID
      await supabase
        .from("users")
        .update({ stripe_customer_id: customer.id })
        .eq("id", user.id);
    }

    // Define product names based on tier
    const productNames = {
      smart: "Smart Access Membership",
      core: "Core Concierge Membership",
      vip: "VIP Executive Membership"
    };

    // Create pricing info based on tier and interval
    const priceData = {
      currency: "usd",
      unit_amount: price * 100, // Convert to cents
      recurring: {
        interval: interval === "yearly" ? "year" : "month",
      },
      product_data: {
        name: productNames[tier as keyof typeof productNames],
        metadata: {
          tier,
        },
      },
    };

    // Set up subscription trial if user is eligible
    const trialPeriodDays = (isInTrial && trial) ? 14 : undefined;
    const trialEnd = userData?.trial_end_date ? new Date(userData.trial_end_date).getTime() / 1000 : undefined;

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("Origin") || "https://vitalehealth.app"}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("Origin") || "https://vitalehealth.app"}/dashboard/membership`,
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier,
        },
        trial_period_days: trialPeriodDays,
        trial_end: trialEnd,
      },
      metadata: {
        user_id: user.id,
        tier,
      },
    });

    // Return the checkout URL
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
