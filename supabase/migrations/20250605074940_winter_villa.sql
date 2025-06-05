/*
  # Add services column to care_facilities table

  1. Changes
    - Add services column to care_facilities table
    - Set default value to empty array
    - Make column nullable
    - Add comment explaining purpose

  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - Safe to run multiple times
*/

DO $$ 
BEGIN
  -- Add services column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'care_facilities' 
    AND column_name = 'services'
  ) THEN
    ALTER TABLE care_facilities
    ADD COLUMN services text[] DEFAULT '{}';

    -- Add comment explaining column purpose
    COMMENT ON COLUMN care_facilities.services IS 'Array of service IDs offered by this facility';
  END IF;
END $$;