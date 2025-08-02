-- Fix vacation packages RLS policies and role synchronization

-- First, drop the duplicate RLS policies
DROP POLICY IF EXISTS "Admins can manage vacation packages" ON public.vacation_packages;
DROP POLICY IF EXISTS "Admins can manage all vacation packages" ON public.vacation_packages;

-- Create a robust admin policy that checks both JWT and profiles table
CREATE POLICY "Admins can manage vacation packages" 
ON public.vacation_packages 
FOR ALL 
TO authenticated
USING (
  -- Check JWT role first (fast), then fallback to profiles table
  (auth.jwt() ->> 'role')::text = 'admin' OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  -- Same check for inserts/updates
  (auth.jwt() ->> 'role')::text = 'admin' OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Ensure the role sync function properly updates JWT claims
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the user's raw_app_meta_data with the role from profiles
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS sync_user_role_trigger ON public.profiles;
CREATE TRIGGER sync_user_role_trigger
AFTER INSERT OR UPDATE OF role ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_role();

-- Update existing admin users to have proper JWT role
DO $$
DECLARE
  admin_user RECORD;
BEGIN
  FOR admin_user IN 
    SELECT id, role FROM public.profiles WHERE role = 'admin'
  LOOP
    UPDATE auth.users
    SET raw_app_meta_data = 
      COALESCE(raw_app_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', admin_user.role)
    WHERE id = admin_user.id;
  END LOOP;
END;
$$;