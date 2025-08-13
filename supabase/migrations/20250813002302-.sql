-- Secure partners table and restrict public exposure of sensitive columns

-- 1) Enable RLS on partners (safe if already enabled)
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- 2) RLS policies
DO $$
BEGIN
  -- Admins can manage all partners
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'partners' AND policyname = 'Admins can manage all partners'
  ) THEN
    CREATE POLICY "Admins can manage all partners"
    ON public.partners
    FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
  END IF;

  -- Partners can view their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'partners' AND policyname = 'Partners can view their own profile'
  ) THEN
    CREATE POLICY "Partners can view their own profile"
    ON public.partners
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;

  -- Partners can update their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'partners' AND policyname = 'Partners can update their own profile'
  ) THEN
    CREATE POLICY "Partners can update their own profile"
    ON public.partners
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;

  -- Partners can insert their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'partners' AND policyname = 'Partners can insert their own profile'
  ) THEN
    CREATE POLICY "Partners can insert their own profile"
    ON public.partners
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
  END IF;

  -- Public can view active partners (row-level), column-level access will be restricted below to avoid leaking sensitive data
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'partners' AND policyname = 'Public can view active partners'
  ) THEN
    CREATE POLICY "Public can view active partners"
    ON public.partners
    FOR SELECT
    TO public
    USING (status = 'active');
  END IF;
END $$;

-- 3) Column-level privileges: restrict anon role to a safe subset of columns only
-- Note: We keep full access for the "authenticated" role to avoid breaking admin tooling and partner self-management flows.
-- Sensitive columns (email, phone, practice_address, user_id, social/stripe internals, doxy url, etc.) are intentionally excluded for anon.

-- Revoke any broad privileges first for anon
REVOKE ALL ON public.partners FROM anon;

-- Grant explicit read access to only non-sensitive columns for anon
GRANT SELECT (
  id,
  slug,
  name,
  practice_name,
  specialties,
  languages,
  specializations,
  service_area,
  hourly_rate,
  bio,
  accepting_new_patients,
  telehealth_enabled,
  status,
  profile_image,
  rating,
  verified,
  credentials
) ON public.partners TO anon;

-- Ensure the authenticated role retains read access (column-level) to all columns (default in Supabase), but add an explicit grant for safety
GRANT SELECT ON public.partners TO authenticated;