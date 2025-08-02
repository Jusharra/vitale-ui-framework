-- Add RLS policy to allow guest caregiver application submissions
CREATE POLICY "Allow guest caregiver application submissions" 
ON public.partner_leads 
FOR INSERT 
WITH CHECK (
  application_type = 'caregiver_application' AND 
  status = 'submitted'
);