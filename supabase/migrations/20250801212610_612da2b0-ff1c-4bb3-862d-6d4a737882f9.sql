-- Drop the function that's causing the conflict temporarily
DROP FUNCTION IF EXISTS public.generate_partner_slug() CASCADE;

-- Now add the unique constraint on user_id
ALTER TABLE public.partners ADD CONSTRAINT partners_user_id_unique UNIQUE (user_id);

-- Create a partner record for the current user
INSERT INTO public.partners (user_id, name, email, status) 
VALUES ('4cd620db-3ba8-489a-bb3f-cc9cf43c0daf', 'Top Dawg', 'vitalehealthconcierge@gmail.com', 'active')
ON CONFLICT (user_id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  status = EXCLUDED.status;

-- Recreate the function without the problematic reference
CREATE OR REPLACE FUNCTION public.generate_partner_slug()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  -- If slug is already provided, use it
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;
  
  -- Generate a base slug from the name
  NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]', '-', 'g'));
  
  -- Check for duplicates and append a number if needed
  DECLARE
    base_slug TEXT := NEW.slug;
    final_slug TEXT := base_slug;
    counter INT := 1;
  BEGIN
    WHILE EXISTS (SELECT 1 FROM public.partners WHERE slug = final_slug AND id != NEW.id) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    NEW.slug := final_slug;
  END;
  
  RETURN NEW;
END;
$$;