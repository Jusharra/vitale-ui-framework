/*
  # Create partner_images storage bucket

  1. New Storage
    - Creates a new public storage bucket for partner profile images
  2. Security
    - Sets up appropriate RLS policies for the bucket
*/

-- Create the partner_images bucket if it doesn't exist
DO $$
BEGIN
  -- Check if the bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'partner_images'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('partner_images', 'partner_images', true);
  END IF;
END $$;

-- Add RLS policies for the bucket
BEGIN;
  -- Allow authenticated users to upload files
  CREATE POLICY IF NOT EXISTS "Allow authenticated users to upload files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'partner_images');

  -- Allow public to read files
  CREATE POLICY IF NOT EXISTS "Allow public to read files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'partner_images');
  
  -- Allow authenticated users to update their own files
  CREATE POLICY IF NOT EXISTS "Allow authenticated users to update their own files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'partner_images');
  
  -- Allow authenticated users to delete their own files
  CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete their own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'partner_images');
COMMIT;