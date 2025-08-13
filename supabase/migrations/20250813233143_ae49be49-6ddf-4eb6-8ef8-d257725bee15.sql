-- Clean up and simplify RLS policies on partners table to ensure public access

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Partners can view own data" ON public.partners;
DROP POLICY IF EXISTS "Partners can update own data" ON public.partners;
DROP POLICY IF EXISTS "Admin full access to partners" ON public.partners;
DROP POLICY IF EXISTS "Admins can manage partners" ON public.partners;
DROP POLICY IF EXISTS "Public can view active partners" ON public.partners;
DROP POLICY IF EXISTS "Authenticated users can view partners" ON public.partners;
DROP POLICY IF EXISTS "Partners can manage own profile" ON public.partners;

-- Create a single, clear public read policy for active partners
CREATE POLICY "Public can view active partner profiles" 
ON public.partners 
FOR SELECT 
TO public
USING (status = 'active');

-- Allow partners to update their own profiles
CREATE POLICY "Partners can update own profile" 
ON public.partners 
FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Allow partners to insert their own profiles
CREATE POLICY "Partners can insert own profile" 
ON public.partners 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow admins full access
CREATE POLICY "Admins have full access to partners" 
ON public.partners 
FOR ALL 
TO authenticated
USING ((auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() ->> 'role') = 'admin');