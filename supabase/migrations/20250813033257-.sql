-- Harden member_rewards access: remove public/broad read, keep owner/admin only
ALTER TABLE public.member_rewards ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'member_rewards' 
      AND policyname = 'Public can view available rewards'
  ) THEN
    DROP POLICY "Public can view available rewards" ON public.member_rewards;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'member_rewards' 
      AND policyname = 'Members can view available rewards'
  ) THEN
    DROP POLICY "Members can view available rewards" ON public.member_rewards;
  END IF;
END $$;

-- Ensure strict policies remain or are created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'member_rewards' 
      AND policyname = 'Members can manage their own rewards'
  ) THEN
    CREATE POLICY "Members can manage their own rewards"
    ON public.member_rewards
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING (profile_id = auth.uid())
    WITH CHECK (profile_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'member_rewards' 
      AND policyname = 'Admins can manage all rewards'
  ) THEN
    CREATE POLICY "Admins can manage all rewards"
    ON public.member_rewards
    AS PERMISSIVE
    FOR ALL
    TO authenticated
    USING ((auth.jwt() ->> 'role') = 'admin' OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    ))
    WITH CHECK ((auth.jwt() ->> 'role') = 'admin' OR EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    ));
  END IF;
END $$;

-- Helpful index for owner lookups
CREATE INDEX IF NOT EXISTS idx_member_rewards_profile_id ON public.member_rewards(profile_id);
