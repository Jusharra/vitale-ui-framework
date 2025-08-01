import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Initialize Supabase with service role for secure operations
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

    const { tier, interval = 'month', trial = true } = await req.json();
    logStep("Request body parsed", { tier, interval, trial });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Get user's profile to check for assigned partner
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*, assigned_partner_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logStep("Profile error", { error: profileError.message });
    }

    let assignedPartnerId = profile?.assigned_partner_id;
    let partnerStripeAccount = null;

    // If user has an assigned partner, get their Stripe Connect account
    if (assignedPartnerId) {
      const { data: partner, error: partnerError } = await supabaseClient
        .from('partners')
        .select('stripe_connect_account_id, revenue_split_percentage, revenue_split_active')
        .eq('id', assignedPartnerId)
        .single();

      if (!partnerError && partner?.stripe_connect_account_id && partner.revenue_split_active) {
        partnerStripeAccount = partner.stripe_connect_account_id;
        logStep("Partner Stripe account found", { 
          partnerId: assignedPartnerId, 
          accountId: partnerStripeAccount,
          revenueSplit: partner.revenue_split_percentage 
        });
      }
    }

    // Define pricing based on tier and interval
    const pricing = {
      premium: {
        month: { amount: 129700, trial_days: trial ? 14 : 0 }, // $1,297
        year: { amount: 1556400, trial_days: trial ? 14 : 0 }   // $15,564
      }
    };

    const priceInfo = pricing[tier as keyof typeof pricing]?.[interval as keyof typeof pricing.premium];
    if (!priceInfo) throw new Error(`Invalid tier or interval: ${tier}, ${interval}`);

    logStep("Pricing determined", priceInfo);

    // Calculate revenue split if partner is involved
    let applicationFeeAmount = 0;
    if (partnerStripeAccount) {
      const partnerRevenuePct = 70; // Default 70% to partner
      const platformFeePct = 30;   // 30% to platform
      applicationFeeAmount = Math.round(priceInfo.amount * (platformFeePct / 100));
      logStep("Revenue split calculated", { 
        total: priceInfo.amount,
        partnerShare: priceInfo.amount - applicationFeeAmount,
        platformShare: applicationFeeAmount
      });
    }

    // Create checkout session
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: `Vitalé ${tier.charAt(0).toUpperCase() + tier.slice(1)} Membership`,
              description: "Elite healthcare concierge with dedicated physician partnership"
            },
            unit_amount: priceInfo.amount,
            recurring: { interval: interval === 'year' ? 'year' : 'month' },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/member/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/membership`,
      metadata: {
        user_id: user.id,
        tier,
        interval,
        assigned_partner_id: assignedPartnerId || '',
        platform_fee_amount: applicationFeeAmount.toString(),
        partner_revenue_amount: (priceInfo.amount - applicationFeeAmount).toString()
      }
    };

    // Add trial period if applicable
    if (priceInfo.trial_days > 0) {
      sessionParams.subscription_data = {
        trial_period_days: priceInfo.trial_days,
      };
    }

    // Add Stripe Connect application fee if partner involved
    if (partnerStripeAccount && applicationFeeAmount > 0) {
      sessionParams.payment_intent_data = {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: partnerStripeAccount,
        },
      };
    }

    logStep("Creating Stripe session", { 
      hasPartner: !!partnerStripeAccount,
      applicationFee: applicationFeeAmount,
      trialDays: priceInfo.trial_days 
    });

    const session = await stripe.checkout.sessions.create(sessionParams);

    logStep("Stripe session created", { sessionId: session.id, url: session.url });

    // Store subscription intent in database
    await supabaseClient.from('subscriptions').upsert({
      user_id: user.id,
      status: 'pending',
      tier,
      stripe_session_id: session.id,
      assigned_partner_id: assignedPartnerId,
      platform_fee_amount: applicationFeeAmount,
      partner_revenue_amount: priceInfo.amount - applicationFeeAmount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    logStep("Subscription record created");

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});