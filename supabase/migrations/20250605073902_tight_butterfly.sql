/*
  # Add services field to care facilities

  1. New Columns
    - `services` (text[]) - Array of services offered by the facility
  
  2. Changes
    - Add services column to care_facilities table
    - Update existing facilities with empty services array
*/

-- Add services column if it doesn't exist
ALTER TABLE public.care_facilities ADD COLUMN IF NOT EXISTS services text[] DEFAULT '{}';

-- Ensure the table has RLS enabled
ALTER TABLE public.care_facilities ENABLE ROW LEVEL SECURITY;

-- Recreate policies to ensure proper access
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Admins can manage care facilities" ON public.care_facilities;
  DROP POLICY IF EXISTS "Public can view active care facilities" ON public.care_facilities;
  
  -- Create new policies
  CREATE POLICY "Admins can manage care facilities"
    ON public.care_facilities
    FOR ALL
    TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

  CREATE POLICY "Public can view active care facilities"
    ON public.care_facilities
    FOR SELECT
    TO public
    USING (status = 'active');
END $$;