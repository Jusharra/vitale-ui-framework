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

        // Check subscription type from metadata
        const subscriptionType = session.metadata?.subscription_type;

        // Handle partner platform subscription
        if (subscriptionType === 'partner_platform_access') {
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

        // Handle caregiver directory subscription
        if (subscriptionType === 'caregiver_directory') {
          const caregiverId = session.metadata?.user_id;
          
          if (!caregiverId) {
            logStep("No caregiver ID in caregiver subscription metadata");
            break;
          }

          // Get the subscription from Stripe
          if (session.subscription) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            
            // Create caregiver subscription record
            await supabaseClient.from('caregiver_subscriptions').upsert({
              caregiver_id: caregiverId,
              stripe_subscription_id: subscription.id,
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            }, { onConflict: 'caregiver_id' });

            // Enable directory listing for caregiver
            await supabaseClient
              .from('profiles')
              .update({ 
                directory_listing: true,
                updated_at: new Date().toISOString()
              })
              .eq('id', caregiverId)
              .eq('role', 'caregiver');

            logStep("Caregiver directory subscription activated", { 
              caregiverId, 
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
        const isGuestCheckout = session.metadata?.is_guest_checkout === 'true';
        const customerEmail = session.customer_details?.email || session.customer_email;

        // Enhanced validation for essential fields
        if (!customerEmail) {
          logStep("ERROR: No customer email found in session", { sessionId: session.id });
          throw new Error("Customer email is required for subscription processing");
        }

        // For guest checkout, we need to handle user creation differently
        if (isGuestCheckout && !userId) {
          logStep("Guest checkout completed - subscription will be handled by customer email", {
            sessionId: session.id,
            customerEmail: customerEmail
          });
          // For guest checkout, we'd need additional logic to match or create user
          // This is a more complex flow that would require additional implementation
          break;
        }

        if (!userId) {
          logStep("No user ID in session metadata - attempting to handle as guest checkout", {
            sessionId: session.id,
            customerEmail: customerEmail
          });
          
          // Try to find existing user by email for guest checkouts
          const { data: existingUser } = await supabaseClient
            .from('profiles')
            .select('id, email')
            .eq('email', customerEmail)
            .single();
            
          if (!existingUser) {
            logStep("No existing user found for guest checkout email", { customerEmail });
            break;
          }
          
          // Use found user ID
          const foundUserId = existingUser.id;
          logStep("Found existing user for guest checkout", { 
            foundUserId, 
            customerEmail 
          });
        }

        // Get the subscription from Stripe
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          
          logStep("Retrieved Stripe subscription details", {
            subscriptionId: subscription.id,
            customerId: subscription.customer,
            status: subscription.status,
            sessionId: session.id
          });

          // First try to find existing subscription record by session ID
          const { data: existingSubscription, error: findError } = await supabaseClient
            .from('subscriptions')
            .select('*')
            .eq('stripe_session_id', session.id)
            .single();

          if (findError && findError.code !== 'PGRST116') { // PGRST116 = no rows found
            logStep("Error finding subscription by session ID", { error: findError.message });
          }

          const subscriptionData = {
            user_id: userId,
            status: subscription.status,
            tier: tier,
            stripe_customer_id: subscription.customer,
            stripe_subscription_id: subscription.id,
            stripe_session_id: session.id,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            assigned_partner_id: assignedPartnerId || null,
            platform_fee_amount: platformFeeAmount,
            partner_revenue_amount: partnerRevenueAmount,
            updated_at: new Date().toISOString(),
          };

          // Only add email if we have it
          if (customerEmail) {
            subscriptionData.email = customerEmail;
          }

          if (existingSubscription) {
            // Update existing record
            await supabaseClient
              .from('subscriptions')
              .update(subscriptionData)
              .eq('id', existingSubscription.id);
            
            logStep("Updated existing subscription record", { 
              subscriptionRecordId: existingSubscription.id,
              stripeSubscriptionId: subscription.id,
              status: subscription.status
            });
          } else {
            // Create new record (fallback upsert)
            await supabaseClient.from('subscriptions').upsert(subscriptionData, { 
              onConflict: 'user_id' 
            });
            
            logStep("Created/updated subscription record via upsert", {
              userId,
              stripeSubscriptionId: subscription.id,
              status: subscription.status
            });
          }

          logStep("Subscription processing completed successfully", {
            userId, 
            subscriptionId: subscription.id,
            status: subscription.status,
            sessionId: session.id
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

        // Check if this is a caregiver subscription
        const { data: caregiverSub } = await supabaseClient
          .from('caregiver_subscriptions')
          .select('caregiver_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (caregiverSub) {
          // Update caregiver subscription
          await supabaseClient
            .from('caregiver_subscriptions')
            .update({
              status: subscription.status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);

          // If subscription is cancelled or past due, disable directory listing
          if (subscription.status === 'canceled' || subscription.status === 'past_due') {
            await supabaseClient
              .from('profiles')
              .update({ 
                directory_listing: false,
                updated_at: new Date().toISOString()
              })
              .eq('id', caregiverSub.caregiver_id);
          }

          logStep("Caregiver subscription updated", { 
            caregiverId: caregiverSub.caregiver_id,
            status: subscription.status 
          });
        } else {
          // Handle regular member subscriptions
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

            // Sync membership tier in profiles table based on subscription status
            const membershipTier = subscription.status === 'active' ? 'premium' : null;
            await supabaseClient
              .from('profiles')
              .update({
                membership_tier: membershipTier,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingSub.user_id);

            logStep("Subscription and profile updated", { 
              userId: existingSub.user_id,
              status: subscription.status,
              membershipTier
            });
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        logStep("Subscription cancelled", { subscriptionId: subscription.id });

        // Check if this is a caregiver subscription
        const { data: caregiverSub } = await supabaseClient
          .from('caregiver_subscriptions')
          .select('caregiver_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (caregiverSub) {
          // Cancel caregiver subscription and disable directory listing
          await supabaseClient
            .from('caregiver_subscriptions')
            .update({
              status: 'cancelled',
              updated_at: new Date().toISOString()
            })
            .eq('stripe_subscription_id', subscription.id);

          // Disable directory listing
          await supabaseClient
            .from('profiles')
            .update({ 
              directory_listing: false,
              updated_at: new Date().toISOString()
            })
            .eq('id', caregiverSub.caregiver_id);

          logStep("Caregiver subscription cancelled", { caregiverId: caregiverSub.caregiver_id });
        } else {
          // Handle regular member subscriptions
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