-- Check current RLS policies for vacation_packages table
CREATE POLICY "Admins can manage all vacation packages" 
ON vacation_packages 
FOR ALL 
TO authenticated 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text) 
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Allow public to view active vacation packages
CREATE POLICY "Public can view active vacation packages" 
ON vacation_packages 
FOR SELECT 
TO anon, authenticated 
USING (LOWER(status) = 'active');

-- Enable RLS on vacation_packages if not already enabled
ALTER TABLE vacation_packages ENABLE ROW LEVEL SECURITY;