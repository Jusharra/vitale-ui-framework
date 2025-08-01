-- Check if the partners table exists and create a partner record for the current user
-- First, let's verify the table structure
DO $$ 
BEGIN
  -- Check if the table exists and log its structure
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'partners' AND table_schema = 'public') THEN
    RAISE NOTICE 'Partners table exists';
  ELSE
    RAISE EXCEPTION 'Partners table does not exist in public schema';
  END IF;
END $$;

-- Create a partner record for testing (you'll need to replace the user_id with actual user ID)
-- This is just to ensure the structure works
INSERT INTO public.partners (user_id, name, email, status) 
VALUES ('4cd620db-3ba8-489a-bb3f-cc9cf43c0daf', 'Test Partner', 'vitalehealthconcierge@gmail.com', 'active')
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  status = EXCLUDED.status;