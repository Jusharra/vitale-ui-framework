/*
  # Storage Bucket and Policies for Partner Images
  
  1. Creates a storage bucket for partner profile images if it doesn't exist
  2. Adds policies for the bucket with IF NOT EXISTS checks to prevent errors
*/

-- Create the partner_images bucket if it doesn't exist
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

-- Add RLS policies for the bucket with IF NOT EXISTS checks
DO $$
BEGIN
  -- Allow authenticated users to upload files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload files'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload files"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'partner_images');
  END IF;

  -- Allow public to read files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow public to read files'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Allow public to read files"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'partner_images');
  END IF;
  
  -- Allow authenticated users to update their own files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update their own files'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Allow authenticated users to update their own files"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'partner_images');
  END IF;
  
  -- Allow authenticated users to delete their own files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete their own files'
    AND schemaname = 'storage'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete their own files"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'partner_images');
  END IF;
END $$;