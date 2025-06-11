/*
  # Create Professional Media Storage Bucket

  1. New Storage Bucket
    - Creates a 'professional_media' storage bucket for professional profile images
    - Configures appropriate RLS policies for the bucket
  
  2. Security
    - Allows authenticated users to upload files to the bucket
    - Allows public access to read files
    - Allows authenticated users to update and delete their own files
*/

-- Create the professional_media bucket if it doesn't exist
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'professional_media'
  ) INTO bucket_exists;
  
  IF NOT bucket_exists THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('professional_media', 'professional_media', true);
  END IF;
END $$;

-- Add RLS policies for the bucket
DO $$
DECLARE
  policy_exists BOOLEAN;
BEGIN
  -- Check if upload policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'allow_authenticated_uploads_professional_media'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow authenticated users to upload files
    CREATE POLICY "allow_authenticated_uploads_professional_media"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'professional_media');
  END IF;

  -- Check if read policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'allow_public_reads_professional_media'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow public to read files
    CREATE POLICY "allow_public_reads_professional_media"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'professional_media');
  END IF;
  
  -- Check if update policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'allow_authenticated_updates_professional_media'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow authenticated users to update their own files
    CREATE POLICY "allow_authenticated_updates_professional_media"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'professional_media');
  END IF;
  
  -- Check if delete policy exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'allow_authenticated_deletes_professional_media'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow authenticated users to delete their own files
    CREATE POLICY "allow_authenticated_deletes_professional_media"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'professional_media');
  END IF;
END $$;