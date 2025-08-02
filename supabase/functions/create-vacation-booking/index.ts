import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingRequest {
  packageId: string;
  packageName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  specialRequests?: string;
  totalAmount: number;
  originalAmount: number;
  discountAmount?: number;
  membershipTier?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user if authenticated
    const authHeader = req.headers.get("Authorization");
    let user = null;
    
    if (authHeader) {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_ANON_KEY") ?? ""
      );
      
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      user = data.user;
    }

    const bookingData: BookingRequest = await req.json();

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: bookingData.guestEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Vacation Package: ${bookingData.packageName}`,
              description: `${bookingData.checkInDate} to ${bookingData.checkOutDate} for ${bookingData.numberOfGuests} guest(s)`,
            },
            unit_amount: Math.round(bookingData.totalAmount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/book/${bookingData.packageId}`,
      metadata: {
        booking_type: "vacation_package",
        package_id: bookingData.packageId,
        user_id: user?.id || "guest",
        check_in_date: bookingData.checkInDate,
        check_out_date: bookingData.checkOutDate,
        number_of_guests: bookingData.numberOfGuests.toString(),
      },
    });

    // Store booking in database with pending status
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { data: booking, error } = await supabaseService
      .from("vacation_bookings")
      .insert({
        user_id: user?.id || null,
        package_id: bookingData.packageId,
        package_name: bookingData.packageName,
        guest_email: bookingData.guestEmail,
        guest_name: bookingData.guestName,
        guest_phone: bookingData.guestPhone,
        check_in_date: bookingData.checkInDate,
        check_out_date: bookingData.checkOutDate,
        number_of_guests: bookingData.numberOfGuests,
        total_amount: bookingData.totalAmount,
        original_amount: bookingData.originalAmount,
        discount_amount: bookingData.discountAmount || 0,
        membership_tier: bookingData.membershipTier,
        special_requests: bookingData.specialRequests,
        stripe_session_id: session.id,
        payment_status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      throw new Error("Failed to create booking record");
    }

    console.log("Vacation booking created:", booking);

    return new Response(JSON.stringify({ url: session.url, bookingId: booking.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-vacation-booking:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});