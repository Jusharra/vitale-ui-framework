/*
  # Role Management and JWT Claims

  1. New Functions
    - `sync_user_role()` - Syncs profile role to JWT claims
    - `role()` - Gets the current user's role from JWT claims
  
  2. Triggers
    - Sync user role when profile is updated
  
  3. Schema Updates
    - Ensure profiles table has role column
*/

-- Create a function to sync the role from profiles to JWT claims
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's JWT claims with the role from profiles
  PERFORM
    auth.set_claim(
      NEW.id,
      'role',
      NEW.role::text
    );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to sync the role when a profile is updated
DROP TRIGGER IF EXISTS sync_user_role_trigger ON public.profiles;
CREATE TRIGGER sync_user_role_trigger
AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_role();

-- Update existing profiles to ensure roles are synced to JWT claims
DO $$
DECLARE
  profile_record RECORD;
BEGIN
  -- For each profile, update the JWT claims
  FOR profile_record IN SELECT * FROM public.profiles WHERE role IS NOT NULL LOOP
    PERFORM
      auth.set_claim(
        profile_record.id,
        'role',
        profile_record.role::text
      );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

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

-- Update any RLS policies that might be using auth.users.role to use auth.jwt() -> 'role' instead
-- Example (you'll need to adapt this to your actual policies):
CREATE OR REPLACE FUNCTION public.role()
RETURNS TEXT AS $$
  SELECT coalesce(
    (auth.jwt() ->> 'role')::text,
    'member'
  )
$$ LANGUAGE SQL STABLE;

-- Add a comment explaining the role function
COMMENT ON FUNCTION public.role() IS 'Gets the role of the currently authenticated user from JWT claims';