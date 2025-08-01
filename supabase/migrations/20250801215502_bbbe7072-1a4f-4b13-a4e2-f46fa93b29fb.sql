-- Fix partners table user_id to be proper UUID with foreign key to profiles
-- First drop policies that depend on user_id column

DROP POLICY IF EXISTS "select_own_partners" ON public.partners;
DROP POLICY IF EXISTS "insert_own_partners" ON public.partners;

-- Now update the user_id column type
ALTER TABLE public.partners 
  ALTER COLUMN user_id TYPE UUID USING user_id::UUID;

-- Add foreign key constraint to profiles
ALTER TABLE public.partners 
  ADD CONSTRAINT partners_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update the default value for user_id to properly use auth.uid()
ALTER TABLE public.partners 
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Ensure we have a profile for our existing partner record
INSERT INTO public.profiles (id, full_name, role)
VALUES ('4cd620db-3ba8-489a-bb3f-cc9cf43c0daf', 'Top Dawg', 'partner')
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Recreate the RLS policies with proper UUID handling
CREATE POLICY "select_own_partners" 
ON public.partners 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "insert_own_partners" 
ON public.partners 
FOR INSERT 
WITH CHECK (user_id = auth.uid());