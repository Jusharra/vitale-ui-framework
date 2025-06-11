/*
  # Create partner_images storage bucket
  
  1. New Storage Bucket
    - Creates a public 'partner_images' bucket for storing partner profile images
  2. Security
    - Adds policies for upload, read, update, and delete operations
    - Allows authenticated users to upload, update, and delete their own files
    - Allows public read access to all files in the bucket
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
DO $$
BEGIN
  -- Allow authenticated users to upload files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow authenticated users to upload files'
  ) THEN
    EXECUTE format('
      CREATE POLICY "Allow authenticated users to upload files"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = ''partner_images'')
    ');
  END IF;

  -- Allow public to read files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow public to read files'
  ) THEN
    EXECUTE format('
      CREATE POLICY "Allow public to read files"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = ''partner_images'')
    ');
  END IF;
  
  -- Allow authenticated users to update their own files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow authenticated users to update their own files'
  ) THEN
    EXECUTE format('
      CREATE POLICY "Allow authenticated users to update their own files"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = ''partner_images'')
    ');
  END IF;
  
  -- Allow authenticated users to delete their own files
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow authenticated users to delete their own files'
  ) THEN
    EXECUTE format('
      CREATE POLICY "Allow authenticated users to delete their own files"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = ''partner_images'')
    ');
  END IF;
END $$;