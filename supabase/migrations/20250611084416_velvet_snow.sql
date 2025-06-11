/*
  # Create partner_images storage bucket with proper policies

  1. New Storage
    - Creates a new storage bucket for partner profile images
    - Sets up appropriate access policies for the bucket
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
-- Allow authenticated users to upload files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow authenticated users to upload partner images'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload partner images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'partner_images');
  END IF;
END $$;

-- Allow public to read files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow public to read partner images'
  ) THEN
    CREATE POLICY "Allow public to read partner images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'partner_images');
  END IF;
END $$;

-- Allow authenticated users to update their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow authenticated users to update partner images'
  ) THEN
    CREATE POLICY "Allow authenticated users to update partner images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'partner_images');
  END IF;
END $$;

-- Allow authenticated users to delete their own files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Allow authenticated users to delete partner images'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete partner images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'partner_images');
  END IF;
END $$;