/*
  # Fix Placement Requests RLS Policy

  1. Changes
     - Safely adds a public insert policy for placement_requests table if it doesn't exist
     - Ensures RLS is enabled on the table

  This migration handles the case where the policy might already exist by checking
  first and only creating it if needed.
*/

-- Ensure the table has RLS enabled
ALTER TABLE IF EXISTS public.placement_requests ENABLE ROW LEVEL SECURITY;

-- Add a public insert policy for placement requests only if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'placement_requests' 
    AND policyname = 'Public users can create placement requests'
  ) THEN
    CREATE POLICY "Public users can create placement requests"
      ON public.placement_requests
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END
$$;