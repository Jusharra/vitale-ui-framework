-- Fix partners table user_id to be proper UUID with foreign key to profiles

-- First, update the user_id column type and add foreign key constraint
ALTER TABLE public.partners 
  ALTER COLUMN user_id TYPE UUID USING user_id::UUID,
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