import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (step: string, details?: unknown) =>
  console.log(`[CREATE-MARKETPLACE-PAYMENT] ${step}`, details ?? "");

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

    const body = await req.json().catch(() => ({}));
    const service_key = String(body?.service_key || "").trim();
    const provider_type = body?.provider_type ? String(body.provider_type) : null;
    const provider_id = body?.provider_id ? String(body.provider_id) : null;
    const provider_name = body?.provider_name ? String(body.provider_name) : null;
    const customer_name = body?.customer_name ? String(body.customer_name) : null;
    const customer_phone = body?.customer_phone ? String(body.customer_phone) : null;
    const booking_details = body?.booking_details ?? null;

    // Try to resolve authenticated user if token is provided (optional)
    let user_id: string | null = null;
    let user_email: string | null = null;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (anonKey && authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
        const token = authHeader.replace("Bearer ", "");
        const { data: userData } = await authClient.auth.getUser(token);
        user_id = userData.user?.id ?? null;
        user_email = userData.user?.email ?? null;
      } catch (e) {
        console.log("[CREATE-MARKETPLACE-PAYMENT] auth resolution failed");
      }
    }

    if (!service_key) throw new Error("Missing service_key");

    // Two pricing paths:
    // 1) service_booking: derive price from services table and apply member discount
    // 2) default: use marketplace_pricing table (e.g., medical_transport)

    const origin = req.headers.get("origin") || "https://";

    if (service_key === "service_booking") {
      if (!provider_id) throw new Error("Missing service id");

      log("Fetching service for booking", { provider_id });
      const { data: svc, error: svcErr } = await supabase
        .from("services")
        .select("id, name, price, active")
        .eq("id", provider_id)
        .maybeSingle();
      if (svcErr) throw svcErr;
      if (!svc || svc.active === false) throw new Error("Service not available");
      const baseAmountCents = Math.round(Number(svc.price ?? 0) * 100);
      if (!baseAmountCents || baseAmountCents <= 0) throw new Error("Invalid service price");

      // Determine member discount (10%) for premium/vip users
      let finalAmountCents = baseAmountCents;
      if (user_id) {
        const { data: userRow } = await supabase
          .from("users")
          .select("membership_tier")
          .eq("id", user_id)
          .maybeSingle();
        const tier = (userRow as any)?.membership_tier as string | null;
        if (tier && (tier.toLowerCase() === "premium" || tier.toLowerCase() === "vip")) {
          const discount = Math.floor(finalAmountCents * 0.10);
          finalAmountCents = Math.max(0, finalAmountCents - discount);
        }
      }

      log("Creating checkout session (service_booking)", { amount: finalAmountCents });
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${provider_name || svc.name}`,
              },
              unit_amount: finalAmountCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/marketplace?canceled=1`,
        automatic_tax: { enabled: false },
      });

      log("Inserting pending order (service_booking)", { sessionId: session.id });
      const { error: insErr } = await supabase.from("marketplace_orders").insert({
        service_key,
        provider_type: "service",
        provider_id,
        provider_name: provider_name || svc.name,
        amount_cents: finalAmountCents,
        currency: "usd",
        status: "pending",
        stripe_session_id: session.id,
        user_id,
        user_email,
        customer_name,
        customer_phone,
        notes: booking_details ? JSON.stringify({ booking_details }) : null,
      });
      if (insErr) throw insErr;

      return new Response(JSON.stringify({ url: session.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Default path (marketplace_pricing), e.g., medical_transport
    log("Fetching pricing", { service_key });
    const { data: priceRow, error: priceErr } = await supabase
      .from("marketplace_pricing")
      .select("service_key, name, amount_cents, currency, is_active")
      .eq("service_key", service_key)
      .eq("is_active", true)
      .maybeSingle();

    if (priceErr) throw priceErr;
    if (!priceRow) throw new Error("Service not available");

    log("Creating checkout session");
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: priceRow.currency || "usd",
            product_data: {
              name: `${priceRow.name}${provider_name ? ` - ${provider_name}` : ""}`,
            },
            unit_amount: priceRow.amount_cents,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/marketplace?canceled=1`,
      automatic_tax: { enabled: false },
    });

    log("Inserting pending order", { sessionId: session.id });
    const { error: insErr } = await supabase.from("marketplace_orders").insert({
      service_key,
      provider_type,
      provider_id,
      provider_name,
      amount_cents: priceRow.amount_cents,
      currency: priceRow.currency || "usd",
      status: "pending",
      stripe_session_id: session.id,
      user_id,
      user_email,
      customer_name,
      customer_phone,
      notes: booking_details ? JSON.stringify({ booking_details }) : null,
    });
    if (insErr) throw insErr;

    return new Response(JSON.stringify({ url: session.url }), {
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
