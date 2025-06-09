/*
  # Add contact information columns to care_facilities table

  1. Changes
    - Add email column for facility contact email
    - Add phone column for facility contact phone
    - Add website column for facility website URL
    - Add hours column for operating hours
    - Add virtual_tour_url column for virtual tour links
    
  2. Security
    - Maintains existing RLS policies
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  -- Add email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facilities' AND column_name = 'email'
  ) THEN
    ALTER TABLE care_facilities ADD COLUMN email text;
  END IF;

  -- Add phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facilities' AND column_name = 'phone'
  ) THEN
    ALTER TABLE care_facilities ADD COLUMN phone text;
  END IF;

  -- Add website column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facilities' AND column_name = 'website'
  ) THEN
    ALTER TABLE care_facilities ADD COLUMN website text;
  END IF;

  -- Add hours column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facilities' AND column_name = 'hours'
  ) THEN
    ALTER TABLE care_facilities ADD COLUMN hours text;
  END IF;

  -- Add virtual_tour_url column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facilities' AND column_name = 'virtual_tour_url'
  ) THEN
    ALTER TABLE care_facilities ADD COLUMN virtual_tour_url text;
  END IF;
END $$;