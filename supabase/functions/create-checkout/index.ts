import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import Stripe from 'https://esm.sh/stripe@14.22.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse the request body
    const { tier, interval = 'month', price, trial = false } = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get the user's profile to check if they already have a Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      return new Response(JSON.stringify({ error: 'Error fetching user profile' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create or retrieve a Stripe customer
    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;

      // Update the user's profile with the Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Define the price ID based on tier and interval
    // In a real app, you would store these in a database or environment variables
    const priceMap = {
      smart: {
        month: 'price_1OvXXXXXXXXXXXXXXXXXXXXX', // Replace with actual price IDs
        year: 'price_1OvYYYYYYYYYYYYYYYYYYYYY',
      },
      core: {
        month: 'price_1OvZZZZZZZZZZZZZZZZZZZZZ',
        year: 'price_1OvAAAAAAAAAAAAAAAAAAAAAA',
      },
      vip: {
        month: 'price_1OvBBBBBBBBBBBBBBBBBBBBB',
        year: 'price_1OvCCCCCCCCCCCCCCCCCCCCCC',
      },
    };

    // For demo purposes, we'll use a test price ID if the mapped one isn't available
    const priceId = priceMap[tier]?.[interval] || Deno.env.get('STRIPE_PRICE_ID') || 'price_1Q';

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: trial
        ? {
            trial_period_days: 14,
            metadata: {
              user_id: user.id,
              tier,
            },
          }
        : {
            metadata: {
              user_id: user.id,
              tier,
            },
          },
      success_url: `${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/dashboard/membership?success=true`,
      cancel_url: `${Deno.env.get('SITE_URL') || 'http://localhost:8080'}/dashboard/membership?canceled=true`,
      metadata: {
        user_id: user.id,
        tier,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});