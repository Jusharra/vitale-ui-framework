/*
  # Fix partners table slug generation

  1. Changes
    - Modify the generate_partner_slug function to properly handle slug generation
    - Fix syntax errors in the previous implementation
*/

-- Check if the slug column exists and create it if it doesn't
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'slug'
  ) THEN
    ALTER TABLE partners ADD COLUMN slug text;
  END IF;
END $$;

-- Create or replace the function to generate a slug from the name
CREATE OR REPLACE FUNCTION generate_partner_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- If slug is already provided, use it
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;
  
  -- Generate a base slug from the name
  NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]', '-', 'g'));
  
  -- Check for duplicates and append a number if needed
  DECLARE
    base_slug TEXT := NEW.slug;
    final_slug TEXT := base_slug;
    counter INT := 1;
  BEGIN
    WHILE EXISTS (SELECT 1 FROM partners WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    NEW.slug := final_slug;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to auto-generate slug on insert if it doesn't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'generate_partner_slug_trigger'
  ) THEN
    CREATE TRIGGER generate_partner_slug_trigger
    BEFORE INSERT ON partners
    FOR EACH ROW
    WHEN (NEW.slug IS NULL OR NEW.slug = '')
    EXECUTE FUNCTION generate_partner_slug();
  END IF;
END $$;

-- Create a unique index on the slug column if it doesn't already exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'partners_slug_unique'
  ) THEN
    CREATE UNIQUE INDEX partners_slug_unique ON partners (slug);
  END IF;
END $$;

-- Update existing partners without slugs
UPDATE partners 
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Fix any duplicate slugs by appending the id
WITH duplicates AS (
  SELECT slug, COUNT(*) 
  FROM partners 
  GROUP BY slug 
  HAVING COUNT(*) > 1
)
UPDATE partners p
SET slug = p.slug || '-' || p.id
FROM duplicates d
WHERE p.slug = d.slug;