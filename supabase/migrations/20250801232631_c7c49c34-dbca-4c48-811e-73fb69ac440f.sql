-- Fix the partners RLS policy to allow proper updates
-- The issue is that the policy checks id = auth.uid() instead of user_id = auth.uid()

DROP POLICY IF EXISTS "partners_update_own" ON public.partners;

CREATE POLICY "partners_update_own" 
ON public.partners 
FOR UPDATE 
USING ((user_id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text))
WITH CHECK ((user_id = auth.uid()) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text));