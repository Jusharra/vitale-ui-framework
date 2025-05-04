
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
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      // Use env variables for the URL and service role key
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );
    
    // Parse request body
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId in request body' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Check if requesting user is actually an admin
    const authHeader = req.headers.get('Authorization')?.split(' ')[1];
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    const { data: { user: requestingUser } } = await supabaseAdmin.auth.getUser(authHeader);
    
    if (!requestingUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Check if requesting user is an admin
    const { data: requestingUserData, error: userRoleError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', requestingUser.id)
      .single();
    
    if (userRoleError || requestingUserData?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin role required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }
    
    // Generate a password reset link
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: (await supabaseAdmin.auth.admin.getUserById(userId)).data.user?.email || '',
    });
    
    if (error) {
      throw error;
    }
    
    // Return the success response
    return new Response(
      JSON.stringify({ 
        message: 'Password reset email sent successfully',
        data: { success: true }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
