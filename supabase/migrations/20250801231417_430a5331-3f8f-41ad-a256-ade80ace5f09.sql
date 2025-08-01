-- Add email column to profiles table and populate it from auth.users
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Create function to populate email from auth.users
CREATE OR REPLACE FUNCTION public.populate_profile_emails()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Update profiles table with emails from auth.users
  UPDATE public.profiles
  SET email = au.email
  FROM auth.users au
  WHERE public.profiles.id = au.id
  AND public.profiles.email IS NULL;
END;
$$;

-- Execute the function to populate existing emails
SELECT public.populate_profile_emails();

-- Create trigger to auto-populate email for new profiles
CREATE OR REPLACE FUNCTION public.handle_profile_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Get email from auth.users for the new profile
  SELECT email INTO NEW.email
  FROM auth.users
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new profile inserts
DROP TRIGGER IF EXISTS on_profile_created_populate_email ON public.profiles;
CREATE TRIGGER on_profile_created_populate_email
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_email();

-- Insert sample partner application data for testing
INSERT INTO public.partner_leads (
  profile_id,
  status,
  application_type,
  education,
  work_history,
  certifications,
  licenses,
  professional_references,
  insurance_info,
  service_areas,
  detailed_bio,
  admin_notes,
  application_score,
  source
) VALUES 
-- Sample application 1 - Pending review
(
  (SELECT id FROM auth.users LIMIT 1),
  'submitted',
  'partner_application',
  '[{"degree": "Doctor of Medicine", "institution": "Harvard Medical School", "year": "2018", "gpa": "3.8"}]'::jsonb,
  '[{"position": "Resident Physician", "company": "Mayo Clinic", "startDate": "2018", "endDate": "2021", "description": "Internal Medicine Residency"}]'::jsonb,
  '[{"name": "Board Certified Internal Medicine", "issuer": "ABIM", "year": "2021", "expiryDate": "2031"}]'::jsonb,
  '[{"type": "Medical License", "state": "California", "number": "MD123456", "expiryDate": "2025-12-31"}]'::jsonb,
  '[{"name": "Dr. Sarah Johnson", "relationship": "Supervising Physician", "contact": "sarah.johnson@mayoclinic.org", "phone": "(555) 123-4567"}]'::jsonb,
  '{"malpractice": {"provider": "Medical Protective", "policyNumber": "MP789123", "coverage": "$2,000,000"}, "liability": {"provider": "Same", "coverage": "$1,000,000"}}'::jsonb,
  ARRAY['Los Angeles County', 'Orange County'],
  'Experienced internal medicine physician with 3 years of clinical experience. Passionate about preventive care and patient education.',
  'Strong application with excellent references.',
  85,
  'website'
);

-- Add profile data for the sample application if needed
INSERT INTO public.profiles (id, full_name, first_name, role)
SELECT id, 'Dr. John Smith', 'John', 'member'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
LIMIT 1
ON CONFLICT (id) DO UPDATE SET
  full_name = 'Dr. John Smith',
  first_name = 'John';