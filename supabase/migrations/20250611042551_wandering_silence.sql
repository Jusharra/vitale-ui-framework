/*
  # Add slug column to partners table

  1. New Columns
    - `slug` (text, unique) - URL-friendly identifier for partner profiles
  
  2. Data Migration
    - Generate slugs for existing partners based on their names
    - Ensure uniqueness by appending numbers if needed
  
  3. Security
    - Add index for performance on slug lookups
*/

-- Add the slug column
ALTER TABLE partners ADD COLUMN IF NOT EXISTS slug text;

-- Create a function to generate unique slugs
CREATE OR REPLACE FUNCTION generate_unique_slug(input_name text, table_name text DEFAULT 'partners')
RETURNS text AS $$
DECLARE
    base_slug text;
    final_slug text;
    counter integer := 1;
BEGIN
    -- Generate base slug from name
    base_slug := lower(trim(regexp_replace(input_name, '[^a-zA-Z0-9\s-]', '', 'g')));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := regexp_replace(base_slug, '-+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    -- Start with the base slug
    final_slug := base_slug;
    
    -- Check if slug exists and increment if needed
    WHILE EXISTS (
        SELECT 1 FROM partners WHERE slug = final_slug
    ) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Generate slugs for existing partners that don't have one
UPDATE partners 
SET slug = generate_unique_slug(name)
WHERE slug IS NULL AND name IS NOT NULL;

-- Add unique constraint
ALTER TABLE partners ADD CONSTRAINT partners_slug_unique UNIQUE (slug);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_partners_slug ON partners(slug);

-- Drop the helper function as it's no longer needed
DROP FUNCTION IF EXISTS generate_unique_slug(text, text);