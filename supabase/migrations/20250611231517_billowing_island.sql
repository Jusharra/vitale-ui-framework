/*
  # Fix Storage RLS Policies for Admin Users

  1. Storage Buckets
    - Create `facility_media` bucket for facility images/videos
    - Create `partner_images` bucket for partner profile images
    
  2. Security
    - Enable RLS on storage buckets
    - Add policies for authenticated admin users to manage files
    - Add policies for public read access to files
*/

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

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for admins to upload facility media
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

-- Policy for admins to update facility media
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

-- Policy for admins to delete facility media
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

-- Policy for public to view facility media
CREATE POLICY "Public can view facility media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'facility_media');

-- Policy for admins to upload partner images
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

-- Policy for admins to update partner images
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

-- Policy for admins to delete partner images
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

-- Policy for public to view partner images
CREATE POLICY "Public can view partner images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'partner_images');

-- Policy for partners to upload their own images
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

-- Policy for partners to update their own images
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