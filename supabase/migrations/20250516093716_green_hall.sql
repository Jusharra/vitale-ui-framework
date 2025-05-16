-- Create a function to sync the role from profiles to JWT claims
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's JWT claims with the role from profiles
  -- Using auth.jwt() instead of auth.set_claim which doesn't exist
  -- This will update the role in the user's metadata instead
  UPDATE auth.users
  SET raw_app_meta_data = 
    CASE WHEN raw_app_meta_data IS NULL THEN 
      jsonb_build_object('role', NEW.role)
    ELSE
      jsonb_set(raw_app_meta_data, '{role}', to_jsonb(NEW.role))
    END
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to sync the role when a profile is updated
DROP TRIGGER IF EXISTS sync_user_role_trigger ON public.profiles;
CREATE TRIGGER sync_user_role_trigger
AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_role();

-- Ensure the profiles table has a role column with a default value
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'member';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles to ensure roles are synced to JWT claims
-- Fixed to use direct UPDATE instead of auth.set_claim
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  FOR profile_record IN SELECT * FROM public.profiles WHERE role IS NOT NULL
  LOOP
    UPDATE auth.users
    SET raw_app_meta_data = 
      CASE WHEN raw_app_meta_data IS NULL THEN 
        jsonb_build_object('role', profile_record.role)
      ELSE
        jsonb_set(raw_app_meta_data, '{role}', to_jsonb(profile_record.role))
      END
    WHERE id = profile_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get the current user's role from JWT claims
CREATE OR REPLACE FUNCTION public.role()
RETURNS TEXT AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claims', true)::json->>'role', ''),
    'member'
  )
$$ LANGUAGE SQL STABLE;

-- Add a comment explaining the role function
COMMENT ON FUNCTION public.role() IS 'Gets the role of the currently authenticated user from JWT claims';