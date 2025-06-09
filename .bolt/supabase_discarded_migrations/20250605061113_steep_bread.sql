/*
  # Add missing columns to care_facilities table

  1. Changes
    - Adds email, phone, website, hours, and virtual_tour_url columns to care_facilities table
    - Uses a direct SQL approach instead of PL/pgSQL DO blocks
*/

-- Add missing columns to care_facilities table
ALTER TABLE public.care_facilities ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.care_facilities ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.care_facilities ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.care_facilities ADD COLUMN IF NOT EXISTS hours text;
ALTER TABLE public.care_facilities ADD COLUMN IF NOT EXISTS virtual_tour_url text;

-- Ensure the table exists and has RLS enabled
ALTER TABLE IF EXISTS public.care_facilities ENABLE ROW LEVEL SECURITY;

-- Recreate policies to ensure proper access
DROP POLICY IF EXISTS "Admins can manage care facilities" ON public.care_facilities;
CREATE POLICY "Admins can manage care facilities"
  ON public.care_facilities
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

DROP POLICY IF EXISTS "Public can view active care facilities" ON public.care_facilities;
CREATE POLICY "Public can view active care facilities"
  ON public.care_facilities
  FOR SELECT
  TO public
  USING (status = 'active');