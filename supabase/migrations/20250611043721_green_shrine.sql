/*
  # Add slug column to partners table

  1. New Columns
    - `slug` (text) - URL-friendly identifier for partners
  2. Changes
    - Adds unique index on slug column
    - Creates trigger to auto-generate slugs
  3. Security
    - No changes to RLS
*/

-- Add slug column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'partners' AND column_name = 'slug'
  ) THEN
    -- Add the slug column
    ALTER TABLE partners ADD COLUMN slug text;
    
    -- Generate slugs for existing partners
    UPDATE partners 
    SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g'));
    
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
    
    -- Create a unique index on the slug column
    CREATE UNIQUE INDEX IF NOT EXISTS partners_slug_unique ON partners (slug);
  END IF;
END $$;

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

-- Create a trigger to auto-generate slug on insert
DROP TRIGGER IF EXISTS generate_partner_slug_trigger ON partners;
CREATE TRIGGER generate_partner_slug_trigger
BEFORE INSERT ON partners
FOR EACH ROW
WHEN (NEW.slug IS NULL OR NEW.slug = '')
EXECUTE FUNCTION generate_partner_slug();