import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[HANDLE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Initialize Supabase with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        logStep("Webhook signature verified");
      } catch (err) {
        logStep("Webhook signature verification failed", { error: err.message });
        return new Response(`Webhook signature verification failed`, { status: 400 });
      }
    } else {
      // For development/testing without webhook secret
      event = JSON.parse(body);
      logStep("Webhook processed without signature verification (development mode)");
    }

    logStep("Processing webhook event", { type: event.type, id: event.id });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        logStep("Checkout session completed", { sessionId: session.id });

        // Check if this is a partner platform subscription
        if (session.metadata?.subscription_type === 'partner_platform_access') {
          const partnerId = session.metadata?.partner_id;
          
          if (!partnerId) {
            logStep("No partner ID in partner platform session metadata");
            break;
          }

          // Get the subscription from Stripe
          if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            
            // Update partner platform subscription in database
            await supabaseClient.from('partner_platform_subscriptions').upsert({
              partner_id: partnerId,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              subscription_start_date: new Date().toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'partner_id' });

            // Update partner flags
            await supabaseClient
              .from('partners')
              .update({
                platform_subscription_active: true,
                full_revenue_eligible: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', partnerId);

            logStep("Partner platform subscription activated", { 
              partnerId, 
              subscriptionId: subscription.id,
              status: subscription.status 
            });
          }
          break;
        }

        // Handle regular member subscriptions
        const userId = session.metadata?.user_id;
        const tier = session.metadata?.tier;
        const assignedPartnerId = session.metadata?.assigned_partner_id;
        const platformFeeAmount = parseInt(session.metadata?.platform_fee_amount || '0');
        const partnerRevenueAmount = parseInt(session.metadata?.partner_revenue_amount || '0');

        if (!userId) {
          logStep("No user ID in session metadata");
          break;
        }

        // Get the subscription from Stripe
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          // Update subscription in database
          await supabaseClient.from('subscriptions').upsert({
            user_id: userId,
            status: subscription.status,
            tier: tier,
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            assigned_partner_id: assignedPartnerId || null,
            platform_fee_amount: platformFeeAmount,
            partner_revenue_amount: partnerRevenueAmount,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

          logStep("Subscription updated in database", { 
            userId, 
            subscriptionId: subscription.id,
            status: subscription.status 
          });

          // Convert trial to active subscription if applicable
          if (assignedPartnerId) {
            await supabaseClient
              .from('partner_trials')
              .update({ 
                trial_status: 'converted',
                conversion_date: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('profile_id', userId)
              .eq('partner_id', assignedPartnerId)
              .eq('trial_status', 'active');

            logStep("Trial converted to subscription", { userId, partnerId: assignedPartnerId });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        logStep("Subscription updated", { subscriptionId: subscription.id });

        // Find user by customer ID
        const { data: existingSub } = await supabaseClient
          .from('subscriptions')
          .select('user_id, assigned_partner_id')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (existingSub) {
          await supabaseClient
            .from('subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', existingSub.user_id);

          logStep("Subscription status updated", { 
            userId: existingSub.user_id,
            status: subscription.status 
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        logStep("Subscription cancelled", { subscriptionId: subscription.id });

        // Find user by customer ID
        const { data: existingSub } = await supabaseClient
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (existingSub) {
          await supabaseClient
            .from('subscriptions')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', existingSub.user_id);

          logStep("Subscription marked as cancelled", { userId: existingSub.user_id });
        }
        break;
      }

      case 'account.updated': {
        const account = event.data.object;
        logStep("Stripe Connect account updated", { accountId: account.id });

        // Check if onboarding is complete
        if (account.details_submitted && account.charges_enabled && account.payouts_enabled) {
          // Update partner record
          await supabaseClient
            .from('partners')
            .update({
              connect_onboarding_complete: true,
              revenue_split_active: true,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_connect_account_id', account.id);

          logStep("Partner onboarding completed", { accountId: account.id });
        }
        break;
      }

      default:
        logStep("Unhandled webhook event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in handle-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});