-- Fix RLS policies for services table to allow public access

-- Drop incorrect policies that don't make sense for services table
DROP POLICY IF EXISTS "insert_own_services" ON services;
DROP POLICY IF EXISTS "select_own_services" ON services;

-- Add public policy to view active services (for marketplace)
CREATE POLICY "Public can view active services"
  ON services
  FOR SELECT
  TO public
  USING (active = true);

-- Update admin policy for full management
DROP POLICY IF EXISTS "services_select" ON services;
CREATE POLICY "Admins can manage all services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Keep the existing authenticated user view policy as backup
-- (lead_view_services policy already exists and is fine)