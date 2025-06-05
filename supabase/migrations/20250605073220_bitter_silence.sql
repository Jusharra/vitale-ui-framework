/*
  # Add slug column to care facilities

  1. Changes
    - Add slug column to care_facilities table
    - Make slug unique to prevent duplicates
    - Add function to generate unique slugs
    - Add trigger to auto-generate slugs
    - Backfill existing records with slugs

  2. Security
    - No changes to RLS policies needed
*/

-- Add slug column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'care_facilities' 
    AND column_name = 'slug'
  ) THEN
    ALTER TABLE care_facilities 
    ADD COLUMN slug text;

    -- Add unique constraint
    CREATE UNIQUE INDEX care_facilities_slug_key ON care_facilities (slug);
    ALTER TABLE care_facilities ADD CONSTRAINT care_facilities_slug_unique UNIQUE USING INDEX care_facilities_slug_key;
  END IF;
END $$;

-- Create function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_facility_slug(facility_name text)
RETURNS text AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 1;
BEGIN
  -- Convert name to lowercase and replace spaces/special chars with hyphens
  base_slug := lower(regexp_replace(facility_name, '[^a-zA-Z0-9]+', '-', 'g'));
  -- Remove leading/trailing hyphens
  base_slug := trim(both '-' from base_slug);
  
  -- Start with base slug
  new_slug := base_slug;
  
  -- Keep trying until we find a unique slug
  WHILE EXISTS (SELECT 1 FROM care_facilities WHERE slug = new_slug) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter::text;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate slugs
CREATE OR REPLACE FUNCTION auto_generate_facility_slug()
RETURNS trigger AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_unique_facility_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'auto_generate_facility_slug_trigger'
  ) THEN
    CREATE TRIGGER auto_generate_facility_slug_trigger
    BEFORE INSERT OR UPDATE OF name
    ON care_facilities
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_facility_slug();
  END IF;
END $$;

-- Backfill existing records with slugs
UPDATE care_facilities 
SET slug = generate_unique_facility_slug(name)
WHERE slug IS NULL OR slug = '';