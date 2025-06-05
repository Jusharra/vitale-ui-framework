/*
  # Fix Facility Media Storage Bucket

  1. Changes
    - Creates the facility_media storage bucket if it doesn't exist
    - Sets up proper RLS policies for the bucket
    - Ensures the care_facilities table has images and videos columns
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
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Give public access to facility media'
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
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow authenticated users to upload facility media'
  ) THEN
    CREATE POLICY "Allow authenticated users to upload facility media"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'facility_media'
    );
  END IF;
END $$;

-- Policy to allow authenticated users to update their own uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow authenticated users to update own facility media'
  ) THEN
    CREATE POLICY "Allow authenticated users to update own facility media"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'facility_media'
      AND (auth.uid() = owner OR auth.jwt() ->> 'role' = 'admin')
    )
    WITH CHECK (
      bucket_id = 'facility_media'
      AND (auth.uid() = owner OR auth.jwt() ->> 'role' = 'admin')
    );
  END IF;
END $$;

-- Policy to allow authenticated users to delete their own uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Allow authenticated users to delete own facility media'
  ) THEN
    CREATE POLICY "Allow authenticated users to delete own facility media"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'facility_media'
      AND (auth.uid() = owner OR auth.jwt() ->> 'role' = 'admin')
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