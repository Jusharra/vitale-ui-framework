/*
  # Fix Row-Level Security for Placement Requests Table

  1. Changes
    - Updates the RLS policies for the placement_requests table to allow public users to insert records
    - Adds a policy to allow authenticated users to view their own placement requests
    - Ensures admins can manage all placement requests

  This migration addresses the 42501 error: "new row violates row-level security policy for table placement_requests"
*/

-- First, check if the table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'placement_requests') THEN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can create their own placement requests" ON public.placement_requests;
    DROP POLICY IF EXISTS "Users can view their own placement requests" ON public.placement_requests;
    DROP POLICY IF EXISTS "Admins can manage all placement requests" ON public.placement_requests;
    
    -- Create new policies
    
    -- Allow public users to insert placement requests
    CREATE POLICY "Public users can create placement requests" 
    ON public.placement_requests 
    FOR INSERT 
    TO public 
    WITH CHECK (true);
    
    -- Allow users to view their own placement requests
    CREATE POLICY "Users can view their own placement requests" 
    ON public.placement_requests 
    FOR SELECT 
    TO public 
    USING (user_id = auth.uid() OR email = current_setting('request.jwt.claims', true)::json->>'email');
    
    -- Allow admins to manage all placement requests
    CREATE POLICY "Admins can manage all placement requests" 
    ON public.placement_requests 
    FOR ALL 
    TO authenticated 
    USING (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    )
    WITH CHECK (
      (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
    );
  END IF;
END $$;