/*
  # Create Facility Media Storage Bucket

  1. New Storage Bucket
    - `facility_media` - Stores images and videos for care facilities
  
  2. Security
    - Public read access for all files
    - Authenticated users can upload files
    - Users can only update/delete their own uploads
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('facility_media', 'facility_media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to files (read-only)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Give public access to facility media'
  ) THEN
    CREATE POLICY "Give public access to facility media"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'facility_media');
  END IF;
END $$;

-- Policy to allow authenticated users to upload files
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Allow authenticated users to upload facility media'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload facility media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'facility_media'
      AND auth.role() IN ('authenticated', 'service_role')
    );
  END IF;
END $$;

-- Policy to allow authenticated users to update their own uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Allow authenticated users to update own facility media'
  ) THEN
    CREATE POLICY "Allow authenticated users to update own facility media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'facility_media'
      AND auth.uid() = owner
    )
    WITH CHECK (
      bucket_id = 'facility_media'
      AND auth.uid() = owner
    );
  END IF;
END $$;

-- Policy to allow authenticated users to delete their own uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND policyname = 'Allow authenticated users to delete own facility media'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete own facility media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'facility_media'
      AND auth.uid() = owner
    );
  END IF;
END $$;

-- Add media columns to care_facilities table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'care_facilities' AND column_name = 'images') THEN
    ALTER TABLE care_facilities ADD COLUMN images text[] DEFAULT '{}';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'care_facilities' AND column_name = 'videos') THEN
    ALTER TABLE care_facilities ADD COLUMN videos text[] DEFAULT '{}';
  END IF;
END $$;