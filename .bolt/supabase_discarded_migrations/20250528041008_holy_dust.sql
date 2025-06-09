/*
  # Fix Placement Requests RLS Policy

  1. Changes
     - Add a public insert policy for placement_requests table
     - Allow anonymous users to create placement requests
     - Ensure proper RLS policies for placement requests

  2. Security
     - Enable public access for creating placement requests
     - Maintain existing security policies
*/

-- Add a public insert policy for placement requests
CREATE POLICY "Public users can create placement requests"
  ON public.placement_requests
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure the table has RLS enabled
ALTER TABLE public.placement_requests ENABLE ROW LEVEL SECURITY;