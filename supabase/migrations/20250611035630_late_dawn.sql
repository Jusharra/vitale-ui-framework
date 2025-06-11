/*
  # Update partners table with new fields

  1. Changes
    - Add first_name column
    - Add credentials column
    - Add languages column
    - Add specializations column
    - Add service_area column
    - Add hourly_rate column
    - Add verified column
*/

-- Add new columns to partners table if they don't exist
DO $$
BEGIN
  -- Add first_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE partners ADD COLUMN first_name text;
  END IF;

  -- Add credentials column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'credentials'
  ) THEN
    ALTER TABLE partners ADD COLUMN credentials text;
  END IF;

  -- Add languages column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'languages'
  ) THEN
    ALTER TABLE partners ADD COLUMN languages text[];
  END IF;

  -- Add specializations column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'specializations'
  ) THEN
    ALTER TABLE partners ADD COLUMN specializations text[];
  END IF;

  -- Add service_area column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'service_area'
  ) THEN
    ALTER TABLE partners ADD COLUMN service_area text;
  END IF;

  -- Add hourly_rate column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'hourly_rate'
  ) THEN
    ALTER TABLE partners ADD COLUMN hourly_rate text;
  END IF;

  -- Add verified column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'verified'
  ) THEN
    ALTER TABLE partners ADD COLUMN verified boolean DEFAULT false;
  END IF;
END $$;