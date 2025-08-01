-- Add unique constraint on user_id to prevent duplicate partner records
ALTER TABLE public.partners ADD CONSTRAINT partners_user_id_unique UNIQUE (user_id);

-- Create a partner record for the current user
INSERT INTO public.partners (user_id, name, email, status) 
VALUES ('4cd620db-3ba8-489a-bb3f-cc9cf43c0daf', 'Top Dawg', 'vitalehealthconcierge@gmail.com', 'active')
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  status = EXCLUDED.status;