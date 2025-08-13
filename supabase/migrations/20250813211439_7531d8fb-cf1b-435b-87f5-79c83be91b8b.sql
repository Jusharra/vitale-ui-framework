-- Create the get_public_partners function with only existing columns
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
  consultation_fee_display text,
  telehealth_enabled boolean,
  video_consultation boolean,
  in_person_consultation boolean,
  languages text[],
  virtual_appointment_preferences jsonb,
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
      WHEN p.consultation_fee IS NOT NULL AND p.consultation_fee > 0 
      THEN '$' || p.consultation_fee::text || '/consultation'
      ELSE 'Contact for pricing'
    END as consultation_fee_display,
    p.telehealth_enabled,
    p.video_consultation,
    p.in_person_consultation,
    p.languages,
    p.virtual_appointment_preferences,
    p.created_at
  FROM public.partners p
  WHERE p.status = 'active'
    AND p.accepting_new_patients = true
  ORDER BY p.verified DESC, p.rating DESC, p.created_at DESC
  LIMIT p_limit;
$$;