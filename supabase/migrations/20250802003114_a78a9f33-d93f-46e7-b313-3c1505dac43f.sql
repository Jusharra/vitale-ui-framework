-- Add missing fields to leads table for Quick Intake form synchronization
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS service_needed text,
ADD COLUMN IF NOT EXISTS urgency text;