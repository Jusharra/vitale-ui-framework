import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ONBOARD-PARTNER] ${step}${detailsStr}`);
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
    if (!user) throw new Error("User not authenticated");

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      throw new Error("Unauthorized: Admin access required");
    }

    const { partnerId } = await req.json();
    if (!partnerId) throw new Error("Partner ID is required");

    logStep("Request validated", { partnerId, adminId: user.id });

    // Get partner details
    const { data: partner, error: partnerError } = await supabaseClient
      .from('partners')
      .select('*')
      .eq('id', partnerId)
      .single();

    if (partnerError || !partner) {
      throw new Error("Partner not found");
    }

    // Check if partner already has Stripe Connect account
    if (partner.stripe_connect_account_id && partner.connect_onboarding_complete) {
      throw new Error("Partner already has completed Stripe Connect onboarding");
    }

    logStep("Partner found", { 
      partnerName: partner.name, 
      email: partner.email,
      existingAccount: partner.stripe_connect_account_id 
    });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    let accountId = partner.stripe_connect_account_id;

    // Create Stripe Connect account if it doesn't exist
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: partner.email,
        business_type: 'individual', // or 'company' based on partner type
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          partner_id: partnerId,
          partner_name: partner.name,
        }
      });

      accountId = account.id;
      logStep("Stripe Connect account created", { accountId });

      // Update partner with Stripe Connect account ID
      await supabaseClient
        .from('partners')
        .update({ 
          stripe_connect_account_id: accountId,
          updated_at: new Date().toISOString()
        })
        .eq('id', partnerId);

      logStep("Partner updated with Stripe account ID");
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${req.headers.get("origin")}/admin/care-teams?refresh=true&partner_id=${partnerId}`,
      return_url: `${req.headers.get("origin")}/admin/care-teams?success=true&partner_id=${partnerId}`,
      type: 'account_onboarding',
    });

    logStep("Account link created", { url: accountLink.url });

    return new Response(JSON.stringify({ 
      onboarding_url: accountLink.url,
      account_id: accountId 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in onboard-partner", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});