/*
  # Fix Placement Requests RLS Policies

  1. Security Changes
    - Enable RLS on placement_requests table
    - Add policy for public users to create placement requests
    - Add policy for users to view their own requests
    - Add policy for admins to manage all requests

  2. Changes
    - Drop existing policies if they exist
    - Create new policies with proper security checks
*/

-- Enable RLS on placement_requests table
ALTER TABLE public.placement_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public users can create placement requests" ON public.placement_requests;
DROP POLICY IF EXISTS "Users can view their own placement requests" ON public.placement_requests;
DROP POLICY IF EXISTS "Admins can manage all placement requests" ON public.placement_requests;

-- Create policy for public users to create placement requests
CREATE POLICY "Public users can create placement requests"
ON public.placement_requests
FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for users to view their own placement requests
CREATE POLICY "Users can view their own placement requests"
ON public.placement_requests
FOR SELECT
TO public
USING (
  (user_id = auth.uid()) OR 
  (email = (current_setting('request.jwt.claims', true)::json->>'email'))
);

-- Create policy for admins to manage all placement requests
CREATE POLICY "Admins can manage all placement requests"
ON public.placement_requests
FOR ALL
TO authenticated
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);