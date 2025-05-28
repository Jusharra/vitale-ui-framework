// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase_oauth

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const { 
      facilityId, 
      userId, 
      fullName, 
      email, 
      phone, 
      tourDate, 
      tourType, 
      notes 
    } = await req.json();
    
    // Validate required fields
    if (!facilityId || !fullName || !email || !phone || !tourDate || !tourType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Fetch the facility details
    const { data: facilityData, error: facilityError } = await supabase
      .from('care_facilities')
      .select('name, email')
      .eq('id', facilityId)
      .single();
    
    if (facilityError) {
      throw new Error(`Error fetching facility: ${facilityError.message}`);
    }
    
    // Insert the tour into the database
    const { data: tourData, error: tourError } = await supabase
      .from('facility_tours')
      .insert({
        facility_id: facilityId,
        user_id: userId,
        full_name: fullName,
        email: email,
        phone: phone,
        tour_date: tourDate,
        tour_type: tourType,
        notes: notes,
        status: 'scheduled'
      })
      .select()
      .single();
    
    if (tourError) {
      throw new Error(`Error creating tour: ${tourError.message}`);
    }
    
    // Send email notifications
    const adminEmail = 'admin@vitalehealth.com'; // Replace with your admin email
    const facilityEmail = facilityData?.email;
    
    // Send email to admin
    await sendEmail({
      to: adminEmail,
      subject: `New Facility Tour Scheduled: ${facilityData.name}`,
      body: `
        <h2>New Facility Tour Scheduled</h2>
        <p><strong>Facility:</strong> ${facilityData.name}</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Tour Date:</strong> ${new Date(tourDate).toLocaleString()}</p>
        <p><strong>Tour Type:</strong> ${tourType}</p>
        <p><strong>Notes:</strong> ${notes || 'None'}</p>
      `
    });
    
    // Send email to facility if available
    if (facilityEmail) {
      await sendEmail({
        to: facilityEmail,
        subject: `New Tour Request from Vitalé Health Concierge`,
        body: `
          <h2>New Tour Request</h2>
          <p>A new tour has been scheduled for your facility through Vitalé Health Concierge.</p>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Tour Date:</strong> ${new Date(tourDate).toLocaleString()}</p>
          <p><strong>Tour Type:</strong> ${tourType}</p>
          <p><strong>Notes:</strong> ${notes || 'None'}</p>
          <p>Please contact the visitor to confirm this appointment.</p>
          <p>Thank you for being a valued partner with Vitalé Health Concierge.</p>
        `
      });
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Tour scheduled successfully',
        tour: tourData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error scheduling tour:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Helper function to send email
// In a production environment, you would use a proper email service like SendGrid, Mailgun, etc.
async function sendEmail({ to, subject, body }: { to: string, subject: string, body: string }) {
  // This is a placeholder for actual email sending logic
  // In a real implementation, you would use an email service API
  
  // For example, with SendGrid:
  // const apiKey = Deno.env.get('SENDGRID_API_KEY');
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${apiKey}`,
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{ to: [{ email: to }] }],
  //     from: { email: 'tours@vitalehealth.com', name: 'Vitalé Health Concierge' },
  //     subject,
  //     content: [{ type: 'text/html', value: body }],
  //   }),
  // });
  
  // For now, we'll just log the email details
  console.log(`Email would be sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Return a mock success response
  return { success: true };
}