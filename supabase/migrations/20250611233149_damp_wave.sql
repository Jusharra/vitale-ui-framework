/*
  # Storage Buckets and Policies for Media Files

  1. New Storage Buckets
    - `facility_media` - For facility images and videos
    - `partner_images` - For partner profile images
    - `professional_media` - For professional profile media

  2. Security
    - Enable RLS on storage.objects
    - Add policies for admins, partners, and public access
    - Set appropriate file size limits and MIME types
*/

-- Create facility_media bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'facility_media') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'facility_media',
      'facility_media',
      true,
      52428800, -- 50MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/mov', 'video/avi']
    );
  END IF;
END $$;

-- Create partner_images bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'partner_images') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'partner_images',
      'partner_images',
      true,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;
END $$;

-- Create professional_media bucket if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'professional_media') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'professional_media',
      'professional_media',
      true,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    );
  END IF;
END $$;

-- Enable RLS on storage.objects if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'storage' AND c.relname = 'objects' AND c.relrowsecurity = true
  ) THEN
    ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  -- Facility media policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admins can upload facility media') THEN
    DROP POLICY "Admins can upload facility media" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admins can update facility media') THEN
    DROP POLICY "Admins can update facility media" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admins can delete facility media') THEN
    DROP POLICY "Admins can delete facility media" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public can view facility media') THEN
    DROP POLICY "Public can view facility media" ON storage.objects;
  END IF;
  
  -- Partner images policies
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admins can upload partner images') THEN
    DROP POLICY "Admins can upload partner images" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admins can update partner images') THEN
    DROP POLICY "Admins can update partner images" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admins can delete partner images') THEN
    DROP POLICY "Admins can delete partner images" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public can view partner images') THEN
    DROP POLICY "Public can view partner images" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Partners can upload their own images') THEN
    DROP POLICY "Partners can upload their own images" ON storage.objects;
  END IF;
  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Partners can update their own images') THEN
    DROP POLICY "Partners can update their own images" ON storage.objects;
  END IF;
END $$;

-- Create new policies
-- Policy for admins to upload facility media
CREATE POLICY "Admins can upload facility media 2"
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

-- Policy for admins to update facility media
CREATE POLICY "Admins can update facility media 2"
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

-- Policy for admins to delete facility media
CREATE POLICY "Admins can delete facility media 2"
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

-- Policy for public to view facility media
CREATE POLICY "Public can view facility media 2"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'facility_media');

-- Policy for admins to upload partner images
CREATE POLICY "Admins can upload partner images 2"
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

-- Policy for admins to update partner images
CREATE POLICY "Admins can update partner images 2"
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

-- Policy for admins to delete partner images
CREATE POLICY "Admins can delete partner images 2"
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

-- Policy for public to view partner images
CREATE POLICY "Public can view partner images 2"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'partner_images');

-- Policy for partners to upload their own images
CREATE POLICY "Partners can upload their own images 2"
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

-- Policy for partners to update their own images
CREATE POLICY "Partners can update their own images 2"
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

-- Add social media URL columns to partners table if they don't exist
DO $$
BEGIN
  -- Check if columns exist and add them if they don't
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'instagram_url') THEN
    ALTER TABLE public.partners ADD COLUMN instagram_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'youtube_url') THEN
    ALTER TABLE public.partners ADD COLUMN youtube_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'tiktok_url') THEN
    ALTER TABLE public.partners ADD COLUMN tiktok_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'linkedin_url') THEN
    ALTER TABLE public.partners ADD COLUMN linkedin_url text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'partners' AND column_name = 'facebook_url') THEN
    ALTER TABLE public.partners ADD COLUMN facebook_url text;
  END IF;
END $$;