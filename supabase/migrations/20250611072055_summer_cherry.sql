/*
  # Add slug generation function and trigger for partners table
  
  This migration adds:
  1. A function to generate slugs from partner names
  2. A trigger to automatically generate slugs for new partners
  3. Updates existing partners with missing slugs
  4. Creates a unique index on the slug column
*/

-- Create a function to generate a slug from the name
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
    counter INT := 1;
  BEGIN
    WHILE EXISTS (SELECT 1 FROM partners WHERE slug = NEW.slug) LOOP
      NEW.slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update existing partners with missing slugs
UPDATE partners 
SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Handle potential duplicate slugs by appending a number
WITH duplicates AS (
  SELECT slug, COUNT(*) 
  FROM partners 
  GROUP BY slug 
  HAVING COUNT(*) > 1
)
UPDATE partners p
SET slug = p.slug || '-' || p.id::text
FROM duplicates d
WHERE p.slug = d.slug;

-- Create a unique index on the slug column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'partners_slug_unique'
  ) THEN
    CREATE UNIQUE INDEX partners_slug_unique ON partners (slug);
  END IF;
END $$;

-- Create a trigger to auto-generate slug on insert if it doesn't exist
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
EXCEPTION
  WHEN undefined_table THEN
    -- If pg_trigger doesn't exist in this version, try a different approach
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.triggers
      WHERE trigger_name = 'generate_partner_slug_trigger'
      AND event_object_table = 'partners'
    ) THEN
      CREATE TRIGGER generate_partner_slug_trigger
      BEFORE INSERT ON partners
      FOR EACH ROW
      WHEN (NEW.slug IS NULL OR NEW.slug = '')
      EXECUTE FUNCTION generate_partner_slug();
    END IF;
END $$;