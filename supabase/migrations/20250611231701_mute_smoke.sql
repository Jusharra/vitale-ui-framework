-- Create facility_media bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'facility_media',
  'facility_media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/mov', 'video/avi']
)
ON CONFLICT (id) DO NOTHING;

-- Create partner_images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'partner_images',
  'partner_images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies only if they don't exist
DO $$
BEGIN
  -- Policy for admins to upload facility media
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload facility media'
  ) THEN
    CREATE POLICY "Admins can upload facility media"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'facility_media' AND
      (
        (auth.jwt() ->> 'role') = 'admin' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'admin'
        )
      )
    );
  END IF;

  -- Policy for admins to update facility media
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can update facility media'
  ) THEN
    CREATE POLICY "Admins can update facility media"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'facility_media' AND
      (
        (auth.jwt() ->> 'role') = 'admin' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'admin'
        )
      )
    )
    WITH CHECK (
      bucket_id = 'facility_media' AND
      (
        (auth.jwt() ->> 'role') = 'admin' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'admin'
        )
      )
    );
  END IF;

  -- Policy for admins to delete facility media
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete facility media'
  ) THEN
    CREATE POLICY "Admins can delete facility media"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'facility_media' AND
      (
        (auth.jwt() ->> 'role') = 'admin' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'admin'
        )
      )
    );
  END IF;

  -- Policy for public to view facility media
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view facility media'
  ) THEN
    CREATE POLICY "Public can view facility media"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'facility_media');
  END IF;

  -- Policy for admins to upload partner images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can upload partner images'
  ) THEN
    CREATE POLICY "Admins can upload partner images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'partner_images' AND
      (
        (auth.jwt() ->> 'role') = 'admin' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'admin'
        )
      )
    );
  END IF;

  -- Policy for admins to update partner images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can update partner images'
  ) THEN
    CREATE POLICY "Admins can update partner images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'partner_images' AND
      (
        (auth.jwt() ->> 'role') = 'admin' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'admin'
        )
      )
    )
    WITH CHECK (
      bucket_id = 'partner_images' AND
      (
        (auth.jwt() ->> 'role') = 'admin' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'admin'
        )
      )
    );
  END IF;

  -- Policy for admins to delete partner images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Admins can delete partner images'
  ) THEN
    CREATE POLICY "Admins can delete partner images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'partner_images' AND
      (
        (auth.jwt() ->> 'role') = 'admin' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'admin'
        )
      )
    );
  END IF;

  -- Policy for public to view partner images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view partner images'
  ) THEN
    CREATE POLICY "Public can view partner images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'partner_images');
  END IF;

  -- Policy for partners to upload their own images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Partners can upload their own images'
  ) THEN
    CREATE POLICY "Partners can upload their own images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'partner_images' AND
      (
        (auth.jwt() ->> 'role') = 'partner' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'partner'
        )
      )
    );
  END IF;

  -- Policy for partners to update their own images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Partners can update their own images'
  ) THEN
    CREATE POLICY "Partners can update their own images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'partner_images' AND
      (
        (auth.jwt() ->> 'role') = 'partner' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'partner'
        )
      )
    )
    WITH CHECK (
      bucket_id = 'partner_images' AND
      (
        (auth.jwt() ->> 'role') = 'partner' OR
        auth.uid() IN (
          SELECT id FROM public.profiles WHERE role = 'partner'
        )
      )
    );
  END IF;
END $$;