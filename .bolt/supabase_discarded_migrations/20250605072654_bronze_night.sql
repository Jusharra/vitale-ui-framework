/*
  # Add SEO fields to care_facilities table

  1. New Columns
    - `slug` (text, unique) - SEO-friendly URL slug
    - `seo_keywords` (text[]) - Array of keywords for metadata
    - `is_published` column (renamed from status)
  
  2. Changes
    - Adds unique constraint to slug column
    - Updates RLS policies to use status = 'active' for published pages
*/

-- Add slug column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'care_facilities' AND column_name = 'slug'
  ) THEN
    ALTER TABLE public.care_facilities ADD COLUMN slug text;
    
    -- Create a unique index on the slug column
    CREATE UNIQUE INDEX IF NOT EXISTS idx_care_facilities_slug ON public.care_facilities (slug);
    
    -- Update existing records to have a slug based on name
    UPDATE public.care_facilities 
    SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'), '-+', '-', 'g'))
    WHERE slug IS NULL;
    
    -- Make slug NOT NULL after populating existing records
    ALTER TABLE public.care_facilities ALTER COLUMN slug SET NOT NULL;
  END IF;
END $$;

-- Add seo_keywords column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'care_facilities' AND column_name = 'seo_keywords'
  ) THEN
    ALTER TABLE public.care_facilities ADD COLUMN seo_keywords text[] DEFAULT '{}';
  END IF;
END $$;

-- Ensure status column exists and has the right default
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'care_facilities' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.care_facilities ADD COLUMN status text DEFAULT 'draft';
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.care_facilities ENABLE ROW LEVEL SECURITY;

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