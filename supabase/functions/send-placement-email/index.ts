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
    const { requestId } = await req.json();
    
    if (!requestId) {
      return new Response(
        JSON.stringify({ error: 'Missing requestId in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Fetch the placement request details
    const { data: requestData, error: requestError } = await supabase
      .from('placement_requests')
      .select(`
        *,
        facility:facility_id (
          id,
          name,
          email
        )
      `)
      .eq('id', requestId)
      .single();
    
    if (requestError) {
      throw new Error(`Error fetching placement request: ${requestError.message}`);
    }
    
    if (!requestData) {
      throw new Error('Placement request not found');
    }
    
    // Prepare email data
    const adminEmail = 'admin@vitalehealth.com'; // Replace with your admin email
    const facilityEmail = requestData.facility?.email;
    
    // Send email to admin
    await sendEmail({
      to: adminEmail,
      subject: `New Placement Request: ${requestData.full_name}`,
      body: `
        <h2>New Placement Request</h2>
        <p><strong>Name:</strong> ${requestData.full_name}</p>
        <p><strong>Email:</strong> ${requestData.email}</p>
        <p><strong>Phone:</strong> ${requestData.phone}</p>
        <p><strong>Care Needs:</strong> ${requestData.care_needs}</p>
        <p><strong>Location:</strong> ${requestData.location}</p>
        <p><strong>Urgency Level:</strong> ${requestData.urgency_level}</p>
        <p><strong>Notes:</strong> ${requestData.notes || 'None'}</p>
        ${requestData.facility ? `<p><strong>Requested Facility:</strong> ${requestData.facility.name}</p>` : ''}
        <p><strong>Status:</strong> ${requestData.status}</p>
        <p><strong>Deposit Paid:</strong> ${requestData.deposit_paid ? 'Yes' : 'No'}</p>
        <p><strong>Deposit Amount:</strong> $${requestData.deposit_amount}</p>
      `
    });
    
    // Send email to facility if available
    if (facilityEmail) {
      await sendEmail({
        to: facilityEmail,
        subject: `New Placement Request from Vitalé Health Concierge`,
        body: `
          <h2>New Placement Request</h2>
          <p>A new placement request has been submitted for your facility through Vitalé Health Concierge.</p>
          <p><strong>Name:</strong> ${requestData.full_name}</p>
          <p><strong>Care Needs:</strong> ${requestData.care_needs}</p>
          <p><strong>Urgency Level:</strong> ${requestData.urgency_level}</p>
          <p>Our placement team will be in touch shortly to discuss this potential resident.</p>
          <p>Thank you for being a valued partner with Vitalé Health Concierge.</p>
        `
      });
    }
    
    // Update the request to mark emails as sent
    await supabase
      .from('placement_requests')
      .update({ 
        status: 'notification_sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Notification emails sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error sending notification emails:', error);
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
  //     from: { email: 'notifications@vitalehealth.com', name: 'Vitalé Health Concierge' },
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