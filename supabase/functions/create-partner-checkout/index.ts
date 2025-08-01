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

    // Validate environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not configured");
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceKey) {
      logStep("ERROR: Supabase configuration missing");
      throw new Error("Supabase configuration is incomplete");
    }

    logStep("Environment variables validated");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Initialize Supabase with service role
    const supabaseClient = createClient(
      supabaseUrl,
      supabaseServiceKey,
      { auth: { persistSession: false } }
    );

    // Validate authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("ERROR: No authorization header provided");
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      logStep("ERROR: Authentication failed", { error: userError.message });
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.email) {
      logStep("ERROR: User not authenticated or email not available");
      throw new Error("User not authenticated or email not available");
    }
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Verify user has partner role and get profile data
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logStep("ERROR: Failed to fetch user profile", { error: profileError.message });
      throw new Error(`Failed to fetch user profile: ${profileError.message}`);
    }

    if (profile?.role !== 'partner') {
      logStep("ERROR: User does not have partner role", { 
        userId: user.id, 
        currentRole: profile?.role 
      });
      throw new Error("User does not have partner role");
    }

    logStep("User confirmed as partner", { userId: user.id, fullName: profile.full_name });

    // Step 1: Verify database connection and table accessibility
    try {
      logStep("Verifying database connection and partners table access");
      const { data: tableTest, error: tableTestError } = await supabaseClient
        .from('partners')
        .select('count')
        .limit(1);
      
      if (tableTestError) {
        logStep("ERROR: Database connection or table access failed", { 
          error: tableTestError.message,
          code: tableTestError.code,
          hint: tableTestError.hint
        });
        throw new Error(`Database access verification failed: ${tableTestError.message}`);
      }
      
      logStep("Database connection verified successfully", { tableAccessible: true });
    } catch (dbTestError) {
      logStep("CRITICAL ERROR: Cannot access partners table", { 
        error: dbTestError.message,
        userId: user.id,
        userType: typeof user.id
      });
      throw new Error(`Database connectivity issue: ${dbTestError.message}`);
    }

    // Step 2: Partner record lookup with proper UUID handling
    let partner = null;
    logStep("Starting partner lookup", { 
      userId: user.id, 
      userIdType: typeof user.id
    });
    
    try {
      const { data: existingPartner, error: partnerQueryError } = await supabaseClient
        .from('partners')
        .select('id, name, email, stripe_connect_account_id, user_id')
        .eq('user_id', user.id) // Direct UUID comparison
        .maybeSingle();

      if (partnerQueryError) {
        logStep("ERROR: Failed to query partner record", { error: partnerQueryError.message });
        throw new Error(`Failed to query partner record: ${partnerQueryError.message}`);
      }

      if (existingPartner) {
        partner = existingPartner;
        logStep("Existing partner found", { partnerId: partner.id, partnerName: partner.name });
      } else {
        // Create new partner record with proper UUID
        logStep("Creating new partner record", { 
          userId: user.id,
          email: user.email 
        });
        
        const { data: newPartner, error: createError } = await supabaseClient
          .from('partners')
          .insert({
            user_id: user.id, // Direct UUID assignment
            name: profile.full_name || user.email?.split('@')[0] || 'Partner',
            email: user.email,
            status: 'pending'
          })
          .select('id, name, email, stripe_connect_account_id, user_id')
          .single();

        if (createError) {
          logStep("ERROR: Failed to create partner record", { error: createError.message });
          throw new Error(`Failed to create partner record: ${createError.message}`);
        }

        if (!newPartner) {
          logStep("ERROR: Partner record creation returned no data");
          throw new Error("Partner record creation failed - no data returned");
        }

        partner = newPartner;
        logStep("New partner record created", { partnerId: newPartner.id });
      }
    } catch (partnerError) {
      logStep("ERROR: Partner record operation failed", { error: partnerError.message });
      throw new Error(`Partner setup failed: ${partnerError.message}`);
    }

    if (!partner) {
      logStep("ERROR: No partner record available after lookup/creation");
      throw new Error("Partner setup is incomplete");
    }

    logStep("Partner verified successfully", { 
      partnerId: partner.id, 
      partnerName: partner.name,
      partnerEmail: partner.email 
    });

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