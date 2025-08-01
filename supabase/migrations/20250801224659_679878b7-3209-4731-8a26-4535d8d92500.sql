-- Add admin INSERT policy for partners table to allow admins to create partner records for any user
CREATE POLICY "Admins can insert partner records" 
ON partners 
FOR INSERT 
TO authenticated
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Update existing admin policy to be more comprehensive
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
CREATE POLICY "Admins can manage all profiles" 
ON profiles 
FOR ALL 
TO authenticated
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);