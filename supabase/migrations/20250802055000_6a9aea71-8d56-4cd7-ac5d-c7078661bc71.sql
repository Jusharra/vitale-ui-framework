-- Fix the RLS policy for member_rewards to handle JWT synchronization issues
-- Drop the existing admin policy that only checks JWT claims
DROP POLICY IF EXISTS "Admins can manage all rewards" ON member_rewards;

-- Create a more robust admin policy that checks both JWT claims AND profiles table
CREATE POLICY "Admins can manage all rewards" ON member_rewards
FOR ALL
TO authenticated
USING (
  -- Check JWT claims first (fast path when JWT is synced)
  ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
  -- Fallback: Check profiles table directly (handles JWT sync issues)
  (EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
)
WITH CHECK (
  -- Same logic for insert/update operations
  ((auth.jwt() ->> 'role'::text) = 'admin'::text) OR 
  (EXISTS(SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
);