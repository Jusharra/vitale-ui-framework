-- Create the get_public_partners function to return safe, public partner information with limit parameter
CREATE OR REPLACE FUNCTION public.get_public_partners(p_limit integer DEFAULT 100)
RETURNS TABLE(
  id uuid,
  name text,
  bio text,
  specialties text[],
  specializations text[],
  rating numeric,
  accepting_new_patients boolean,
  verified boolean,
  service_area text,
  profile_image text,
  slug text,
  hourly_rate_display text,
  telehealth_enabled boolean,
  video_consultation boolean,
  in_person_consultation boolean,
  years_experience integer,
  languages text[],
  availability_hours jsonb,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT 
    p.id,
    p.name,
    p.bio,
    p.specialties,
    p.specializations,
    p.rating,
    p.accepting_new_patients,
    p.verified,
    p.service_area,
    p.profile_image,
    p.slug,
    CASE 
      WHEN p.hourly_rate IS NOT NULL THEN '$' || p.hourly_rate::text || '/hr'
      ELSE NULL
    END as hourly_rate_display,
    p.telehealth_enabled,
    p.video_consultation,
    p.in_person_consultation,
    p.years_experience,
    p.languages,
    p.availability_hours,
    p.created_at
  FROM public.partners p
  WHERE p.status = 'active'
    AND p.accepting_new_patients = true
  ORDER BY p.verified DESC, p.rating DESC, p.created_at DESC
  LIMIT p_limit;
$$;