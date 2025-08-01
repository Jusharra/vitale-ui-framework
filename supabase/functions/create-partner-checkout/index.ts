import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-PARTNER-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Partner platform checkout initiated");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
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

    // Check if user is a partner
    const { data: partner, error: partnerError } = await supabaseClient
      .from('partners')
      .select('id, name, email, stripe_connect_account_id')
      .eq('id', user.id)
      .single();

    if (partnerError || !partner) {
      throw new Error("User is not a registered partner");
    }
    logStep("Partner verified", { partnerId: partner.id, partnerName: partner.name });

    // Check if partner already has an active platform subscription
    const { data: existingSubscription } = await supabaseClient
      .from('partner_platform_subscriptions')
      .select('*')
      .eq('partner_id', partner.id)
      .eq('status', 'active')
      .single();

    if (existingSubscription) {
      return new Response(JSON.stringify({ 
        error: "Partner already has an active platform subscription" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Get or create Stripe customer
    const customers = await stripe.customers.list({ 
      email: partner.email || user.email, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing Stripe customer found", { customerId });
    } else {
      const customer = await stripe.customers.create({
        email: partner.email || user.email,
        name: partner.name,
        metadata: {
          partner_id: partner.id,
          user_id: user.id
        }
      });
      customerId = customer.id;
      logStep("New Stripe customer created", { customerId });
    }

    // Create checkout session for partner platform subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Partner Platform Access",
              description: "Premium partner platform with 100% revenue share"
            },
            unit_amount: 100000, // $1,000.00
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 365, // 12-month trial for first 100 partners
        metadata: {
          partner_id: partner.id,
          subscription_type: "partner_platform_access"
        }
      },
      success_url: `${req.headers.get("origin")}/professional/earnings?success=true`,
      cancel_url: `${req.headers.get("origin")}/professional/earnings?canceled=true`,
      metadata: {
        partner_id: partner.id,
        subscription_type: "partner_platform_access"
      }
    });

    logStep("Stripe checkout session created", { sessionId: session.id });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-partner-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});