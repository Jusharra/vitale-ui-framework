-- Secure partners table: remove public read, add safe public RPC
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive public policies if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Public can view active partners') THEN
    DROP POLICY "Public can view active partners" ON public.partners;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='Public can view partners') THEN
    DROP POLICY "Public can view partners" ON public.partners;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='select_own_partners') THEN
    DROP POLICY "select_own_partners" ON public.partners;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='insert_own_partners') THEN
    DROP POLICY "insert_own_partners" ON public.partners;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='partners' AND policyname='partners_update_own') THEN
    DROP POLICY "partners_update_own" ON public.partners;
  END IF;
END $$;

-- Keep existing strict policies (admins manage all, partners manage own) intact
-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_partners_slug ON public.partners(slug);
CREATE INDEX IF NOT EXISTS idx_partners_verified ON public.partners(verified);

-- Create a SECURITY DEFINER function exposing only safe, non-PII fields for public consumption
CREATE OR REPLACE FUNCTION public.get_public_partners(
  p_slug text DEFAULT NULL,
  p_search text DEFAULT NULL,
  p_limit int DEFAULT 50,
  p_specialty text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  slug text,
  name text,
  first_name text,
  credentials text,
  practice_name text,
  specialties text[],
  languages text[],
  specializations text[],
  service_area text,
  hourly_rate numeric,
  bio text,
  accepting_new_patients boolean,
  telehealth_enabled boolean,
  status text,
  profile_image text,
  rating numeric,
  verified boolean
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    id,
    slug,
    name,
    first_name,
    credentials,
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
    verified
  FROM public.partners
  WHERE status = 'active'
    AND (p_slug IS NULL OR slug = p_slug)
    AND (p_specialty IS NULL OR specialties @> ARRAY[p_specialty])
    AND (
      p_search IS NULL OR 
      name ILIKE '%' || p_search || '%' OR 
      (bio IS NOT NULL AND bio ILIKE '%' || p_search || '%') OR 
      (service_area IS NOT NULL AND service_area ILIKE '%' || p_search || '%')
    )
  ORDER BY verified DESC, created_at DESC
  LIMIT COALESCE(p_limit, 50);
$$;

-- Explicitly allow everyone to execute the safe RPC
GRANT EXECUTE ON FUNCTION public.get_public_partners(text, text, integer, text) TO anon, authenticated;
