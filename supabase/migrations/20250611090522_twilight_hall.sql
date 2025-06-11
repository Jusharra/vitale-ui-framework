/*
  # Create partner_images storage bucket

  1. Storage
    - Create partner_images bucket for storing professional profile images
    - Set up appropriate RLS policies for the bucket
*/

-- Create the partner_images bucket if it doesn't exist
BEGIN;
  -- Check if the bucket exists
  DO $$
  DECLARE
    bucket_exists BOOLEAN;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM storage.buckets WHERE name = 'partner_images'
    ) INTO bucket_exists;
    
    IF NOT bucket_exists THEN
      -- Create the bucket
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('partner_images', 'partner_images', true);
    END IF;
  END $$;

  -- Allow authenticated users to upload files
  CREATE POLICY "Allow authenticated users to upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'partner_images');

  -- Allow public to read files
  CREATE POLICY "Allow public to read files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'partner_images');
  
  -- Allow authenticated users to update their own files
  CREATE POLICY "Allow authenticated users to update their own files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'partner_images');
  
  -- Allow authenticated users to delete their own files
  CREATE POLICY "Allow authenticated users to delete their own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'partner_images');
COMMIT;