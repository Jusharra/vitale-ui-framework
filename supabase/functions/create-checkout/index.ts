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

    const { tier, interval = 'month', trial = true, additionalMembers = 0, isGuestCheckout = false } = await req.json();
    logStep("Request body parsed", { tier, interval, trial, additionalMembers, isGuestCheckout });

    let user = null;
    let guestEmail = null;
    
    if (!isGuestCheckout) {
      // Authenticated user flow
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) throw new Error("No authorization header provided");

      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
      if (userError) throw new Error(`Authentication error: ${userError.message}`);
      
      user = userData.user;
      if (!user?.email) throw new Error("User not authenticated or email not available");
      logStep("User authenticated", { userId: user.id, email: user.email });
    } else {
      // Guest checkout flow - we'll collect email in Stripe Checkout
      logStep("Guest checkout initiated");
    }


    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check for existing Stripe customer (only for authenticated users)
    let customerId;
    if (user?.email) {
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing customer", { customerId });
      }
    }

    // Get user's profile to check for assigned partner (only for authenticated users)
    let assignedPartnerId = null;
    if (user?.id) {
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*, assigned_partner_id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        logStep("Profile error", { error: profileError.message });
      }

      assignedPartnerId = profile?.assigned_partner_id;
    }
    let partnerStripeAccount = null;

    // If user has an assigned partner, get their Stripe Connect account and platform subscription status
    let assignedPartner = null;
    if (assignedPartnerId) {
      const { data: partner, error: partnerError } = await supabaseClient
        .from('partners')
        .select('stripe_connect_account_id, revenue_split_percentage, revenue_split_active, platform_subscription_active, full_revenue_eligible')
        .eq('id', assignedPartnerId)
        .single();

      if (!partnerError && partner?.stripe_connect_account_id && partner.revenue_split_active) {
        assignedPartner = partner;
        partnerStripeAccount = partner.stripe_connect_account_id;
        logStep("Partner Stripe account found", { 
          partnerId: assignedPartnerId, 
          accountId: partnerStripeAccount,
          revenueSplit: partner.revenue_split_percentage,
          platformSubscriptionActive: partner.platform_subscription_active,
          fullRevenueEligible: partner.full_revenue_eligible
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

    // Calculate revenue split based on partner's platform subscription status
    let applicationFeeAmount = 0;
    let partnerRevenueAmount = 0;
    
    if (assignedPartner && partnerStripeAccount) {
      // Check if partner has active platform subscription for 100% revenue
      if (assignedPartner.platform_subscription_active && assignedPartner.full_revenue_eligible) {
        // Partner gets 100% of revenue
        applicationFeeAmount = 0;
        partnerRevenueAmount = priceInfo.amount;
        
        logStep("Full revenue share (100%) - Platform subscription active", {
          total: priceInfo.amount,
          platformFee: applicationFeeAmount,
          partnerRevenue: partnerRevenueAmount,
          partnerAccount: partnerStripeAccount
        });
      } else {
        // Standard revenue split: Platform keeps 30%, partner gets 70%
        const platformFeePct = 30;
        applicationFeeAmount = Math.round(priceInfo.amount * (platformFeePct / 100));
        partnerRevenueAmount = priceInfo.amount - applicationFeeAmount;
        
        logStep("Standard revenue split (70/30)", {
          total: priceInfo.amount,
          platformFee: applicationFeeAmount,
          partnerRevenue: partnerRevenueAmount,
          partnerAccount: partnerStripeAccount
        });
      }
    }

    // Create line items: primary membership + family members
    const lineItems = [
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
    ];

    // Add family members line item if applicable
    if (additionalMembers > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { 
            name: "Additional Family Members",
            description: "Additional family members for premium membership"
          },
          unit_amount: 5000, // $50 per additional family member
          recurring: { interval: interval === 'year' ? 'year' : 'month' },
        },
        quantity: additionalMembers,
      });
    }

    // Create checkout session
    const sessionParams: any = {
      customer: customerId,
      customer_email: customerId ? undefined : (user?.email || undefined),
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/member/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/membership`,
      metadata: {
        user_id: user?.id || '',
        tier,
        interval,
        additional_members: additionalMembers.toString(),
        assigned_partner_id: assignedPartnerId || '',
        platform_fee_amount: applicationFeeAmount.toString(),
        partner_revenue_amount: (priceInfo.amount - applicationFeeAmount).toString(),
        is_guest_checkout: isGuestCheckout.toString()
      }
    };

    // For guest checkout, ensure email collection
    if (isGuestCheckout) {
      sessionParams.customer_creation = 'always';
      sessionParams.customer_email = undefined; // Let Stripe collect the email
    }

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

    // Store subscription intent in database (only for authenticated users)
    if (user?.id) {
      await supabaseClient.from('subscriptions').upsert({
        user_id: user.id,
        status: 'pending',
        tier,
        stripe_session_id: session.id,
        additional_members_count: additionalMembers,
        assigned_partner_id: assignedPartnerId,
        platform_fee_amount: applicationFeeAmount,
        partner_revenue_amount: priceInfo.amount - applicationFeeAmount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      
      logStep("Subscription record created");
    } else {
      logStep("Guest checkout - subscription record will be created after payment completion");
    }

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