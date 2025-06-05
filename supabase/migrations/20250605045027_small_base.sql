/*
  # Facility Media Storage and Management

  1. New Storage
    - Creates a facility_media storage bucket for facility images and videos
    - Sets up appropriate access policies for the bucket
  
  2. Table Updates
    - Adds images and videos array columns to care_facilities table
    - Adds CRUD policies for admin users
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

-- Create CRUD policies for admin users on care_facilities table
DO $$
BEGIN
  -- Check if the table exists first
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'care_facilities') THEN
    -- Enable RLS if not already enabled
    ALTER TABLE care_facilities ENABLE ROW LEVEL SECURITY;
    
    -- Create policies if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'care_facilities' AND policyname = 'Admins can manage care facilities'
    ) THEN
      CREATE POLICY "Admins can manage care facilities"
        ON care_facilities
        FOR ALL
        TO authenticated
        USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
        WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
    END IF;
    
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'care_facilities' AND policyname = 'Public can view active care facilities'
    ) THEN
      CREATE POLICY "Public can view active care facilities"
        ON care_facilities
        FOR SELECT
        TO public
        USING (status = 'active');
    END IF;
  END IF;
END $$;