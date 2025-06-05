-- Add missing columns to care_facilities table
DO $$ 
BEGIN
  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'care_facilities' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.care_facilities ADD COLUMN email text;
  END IF;

  -- Add phone column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'care_facilities' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.care_facilities ADD COLUMN phone text;
  END IF;

  -- Add website column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'care_facilities' AND column_name = 'website'
  ) THEN
    ALTER TABLE public.care_facilities ADD COLUMN website text;
  END IF;

  -- Add hours column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'care_facilities' AND column_name = 'hours'
  ) THEN
    ALTER TABLE public.care_facilities ADD COLUMN hours text;
  END IF;

  -- Add virtual_tour_url column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'care_facilities' AND column_name = 'virtual_tour_url'
  ) THEN
    ALTER TABLE public.care_facilities ADD COLUMN virtual_tour_url text;
  END IF;
END $$;