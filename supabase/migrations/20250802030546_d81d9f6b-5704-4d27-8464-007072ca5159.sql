-- Create site_media storage bucket for general media throughout the site
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site_media',
  'site_media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage all site media
CREATE POLICY "Admins can manage all site media"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'site_media' AND
  (
    (auth.jwt() ->> 'role') = 'admin' OR
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  )
)
WITH CHECK (
  bucket_id = 'site_media' AND
  (
    (auth.jwt() ->> 'role') = 'admin' OR
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  )
);

-- Policy for authenticated users to upload site media
CREATE POLICY "Authenticated users can upload site media"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site_media');

-- Policy for public to view site media
CREATE POLICY "Public can view site media"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'site_media');