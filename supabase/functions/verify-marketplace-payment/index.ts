import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (step: string, details?: unknown) =>
  console.log(`[VERIFY-MARKETPLACE-PAYMENT] ${step}`, details ?? "");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase env not set");
    if (!stripeSecret) throw new Error("Stripe secret key is not set");

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });
    const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });

    // Accept either JSON body { session_id } or query param
    const url = new URL(req.url);
    let session_id = url.searchParams.get("session_id");
    if (!session_id) {
      const body = await req.json().catch(() => ({}));
      session_id = body?.session_id;
    }

    if (!session_id) throw new Error("Missing session_id");

    log("Retrieving checkout session", { session_id });
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ verified: false, status: session.payment_status }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const email = session.customer_details?.email ?? null;
    const paymentIntentId = typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

    log("Updating order to paid");
    const { data: order, error: updErr } = await supabase
      .from("marketplace_orders")
      .update({
        status: "paid",
        user_email: email,
        stripe_payment_intent: paymentIntentId,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_session_id", session_id)
      .select()
      .maybeSingle();

    if (updErr) throw updErr;

    // Optional: Assign to a partner with an active platform subscription
    if (order && !order.assigned_partner_id) {
      log("Attempting partner assignment");
      const { data: partner, error: partnerErr } = await supabase
        .from("partners")
        .select("id")
        .eq("status", "active")
        .eq("platform_subscription_active", true)
        .limit(1)
        .maybeSingle();

      if (!partnerErr && partner?.id) {
        await supabase
          .from("marketplace_orders")
          .update({ assigned_partner_id: partner.id, updated_at: new Date().toISOString() })
          .eq("id", order.id);
      }
    }

    return new Response(JSON.stringify({ verified: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log("ERROR", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
