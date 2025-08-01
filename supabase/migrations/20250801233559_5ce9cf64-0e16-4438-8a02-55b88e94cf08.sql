-- Create security definer function to get user role from profiles table
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Update partners RLS policy to use the profiles table for admin check
DROP POLICY IF EXISTS "partners_update_own" ON public.partners;

CREATE POLICY "partners_update_own" 
ON public.partners 
FOR UPDATE 
USING ((user_id = auth.uid()) OR (public.get_user_role() = 'admin'))
WITH CHECK ((user_id = auth.uid()) OR (public.get_user_role() = 'admin'));