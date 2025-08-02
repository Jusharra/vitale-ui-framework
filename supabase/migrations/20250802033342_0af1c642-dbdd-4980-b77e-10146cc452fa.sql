-- Fix existing vacation package booking links
-- Replace example.com domains and generate proper booking links

-- Create a function to generate slugs (similar to frontend generateSlug)
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  IF input_text IS NULL OR trim(input_text) = '' THEN
    RETURN '';
  END IF;
  
  -- Convert to lowercase, replace special chars with hyphens, clean up
  RETURN trim(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          lower(trim(input_text)),
          '[^a-z0-9\s-]', '', 'g'
        ),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    ),
    '-'
  );
END;
$$ LANGUAGE plpgsql;

-- Update vacation packages with proper booking links
UPDATE vacation_packages 
SET booking_link = 'https://vitalehealthconcierge.doctor/book/' || generate_slug(destination_name)
WHERE 
  booking_link IS NULL 
  OR booking_link = '' 
  OR booking_link LIKE '%example.com%'
  OR NOT booking_link LIKE 'https://vitalehealthconcierge.doctor/book/%';

-- Clean up any duplicate /book/ segments in URLs
UPDATE vacation_packages 
SET booking_link = regexp_replace(booking_link, '/book/+', '/book/', 'g')
WHERE booking_link LIKE '%/book//%';

-- Add a comment for tracking
COMMENT ON FUNCTION generate_slug(TEXT) IS 'Generates URL-friendly slugs for vacation package booking links';

-- Show affected rows count
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RAISE NOTICE 'Updated % vacation package booking links', updated_count;
END $$;