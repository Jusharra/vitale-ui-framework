import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation utilities
const validateEmail = (email: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required and must be a string' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  if (email.length > 254) {
    return { isValid: false, error: 'Email address too long' };
  }

  return { isValid: true, sanitizedValue: email.toLowerCase().trim() };
};

const validateTier = (tier: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
  const allowedTiers = ['premium'];
  
  if (!tier || typeof tier !== 'string') {
    return { isValid: false, error: 'Tier is required and must be a string' };
  }

  if (!allowedTiers.includes(tier)) {
    return { isValid: false, error: 'Invalid subscription tier' };
  }

  return { isValid: true, sanitizedValue: tier };
};

const validateInterval = (interval: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
  const allowedIntervals = ['month', 'year'];
  
  if (!interval || typeof interval !== 'string') {
    return { isValid: false, error: 'Interval is required and must be a string' };
  }

  if (!allowedIntervals.includes(interval)) {
    return { isValid: false, error: 'Invalid billing interval' };
  }

  return { isValid: true, sanitizedValue: interval };
};

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const checkRateLimit = (identifier: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000): { isValid: boolean; error?: string } => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.resetTime < now) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return { isValid: true };
  }

  if (entry.count >= maxRequests) {
    return { isValid: false, error: `Rate limit exceeded. Try again in ${Math.ceil((entry.resetTime - now) / 1000)} seconds.` };
  }

  entry.count++;
  rateLimitStore.set(identifier, entry);
  return { isValid: true };
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

    // Security: Rate limiting
    const rateLimitId = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimitCheck = checkRateLimit(rateLimitId, 10, 15 * 60 * 1000); // 10 requests per 15 minutes
    if (!rateLimitCheck.isValid) {
      return new Response(
        JSON.stringify({ error: rateLimitCheck.error }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    // Initialize Supabase with service role for secure operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Security: Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      logStep('JSON Parse Error', { error: error.message });
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { tier, interval = 'month', trial = true, additionalMembers = 0, isGuestCheckout = false } = requestBody;
    
    // Security: Input validation
    const tierValidation = validateTier(tier);
    if (!tierValidation.isValid) {
      return new Response(
        JSON.stringify({ error: tierValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const intervalValidation = validateInterval(interval);
    if (!intervalValidation.isValid) {
      return new Response(
        JSON.stringify({ error: intervalValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    logStep("Request body parsed and validated", { tier: tierValidation.sanitizedValue, interval: intervalValidation.sanitizedValue, trial, additionalMembers, isGuestCheckout });

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
      success_url: `${req.headers.get("origin")}/dashboard/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
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

    // For guest checkout, Stripe will automatically collect email and create customer
    // No need to specify customer_creation in subscription mode

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
      try {
        const subscriptionData = {
          user_id: user.id,
          status: 'pending',
          tier,
          stripe_customer_id: customerId,
          stripe_subscription_id: session.id,  // Use session.id as the stripe_subscription_id
          additional_members_count: additionalMembers,
          assigned_partner_id: assignedPartnerId,
          platform_fee_amount: applicationFeeAmount,
          partner_revenue_amount: priceInfo.amount - applicationFeeAmount,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: upsertError } = await supabaseClient
          .from('subscriptions')
          .upsert(subscriptionData, { 
            onConflict: 'stripe_subscription_id'  // Use unique constraint on stripe_subscription_id
          });
        
        if (upsertError) {
          logStep("ERROR: Failed to create subscription record", {
            error: upsertError,
            userId: user.id,
            sessionId: session.id
          });
          throw new Error(`Subscription record creation failed: ${upsertError.message}`);
        }
        
        logStep("Subscription record created successfully", {
          userId: user.id,
          sessionId: session.id,
          tier
        });
      } catch (dbError) {
        logStep("CRITICAL ERROR: Database operation failed in create-checkout", {
          error: dbError.message,
          userId: user.id,
          sessionId: session.id
        });
        throw dbError;
      }
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