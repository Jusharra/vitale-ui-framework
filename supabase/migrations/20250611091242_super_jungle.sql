/*
  # Create Partner Images Storage Bucket

  1. Storage
    - Creates the 'partner_images' storage bucket if it doesn't exist
    - Sets up appropriate access policies for the bucket
  
  This migration creates a storage bucket for partner profile images and
  configures the necessary policies to allow proper access control.
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

-- Add RLS policies for the bucket
DO $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  -- Check and create upload policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to upload files'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $policy$
      CREATE POLICY "Allow authenticated users to upload files"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'partner_images');
    $policy$;
  END IF;

  -- Check and create read policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow public to read files'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $policy$
      CREATE POLICY "Allow public to read files"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'partner_images');
    $policy$;
  END IF;
  
  -- Check and create update policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to update their own files'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $policy$
      CREATE POLICY "Allow authenticated users to update their own files"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (bucket_id = 'partner_images');
    $policy$;
  END IF;
  
  -- Check and create delete policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Allow authenticated users to delete their own files'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    EXECUTE $policy$
      CREATE POLICY "Allow authenticated users to delete their own files"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (bucket_id = 'partner_images');
    $policy$;
  END IF;
END $$;