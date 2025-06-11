-- Check if the slug column exists and add it if it doesn't
DO $$ 
BEGIN
  -- Check if the slug column exists
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
-- This is defined outside the DO block to avoid the DECLARE syntax error
CREATE OR REPLACE FUNCTION generate_partner_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INT := 1;
BEGIN
  -- If slug is already provided, use it
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;
  
  -- Generate a base slug from the name
  NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]', '-', 'g'));
  
  -- Check for duplicates and append a number if needed
  base_slug := NEW.slug;
  final_slug := base_slug;
  
  WHILE EXISTS (SELECT 1 FROM partners WHERE slug = final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if the trigger already exists and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
    WHERE pg_class.relname = 'partners' 
    AND pg_trigger.tgname = 'generate_partner_slug_trigger'
  ) THEN
    -- Create a trigger to auto-generate slug on insert
    EXECUTE 'CREATE TRIGGER generate_partner_slug_trigger
    BEFORE INSERT ON partners
    FOR EACH ROW
    WHEN (NEW.slug IS NULL OR NEW.slug = '''')
    EXECUTE FUNCTION generate_partner_slug()';
  END IF;
END $$;