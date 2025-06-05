/*
  # Create facility media storage bucket

  1. New Storage Bucket
    - Creates a new bucket called 'facility_media' for storing facility images and videos
  
  2. Security
    - Enables public access to read media files
    - Restricts upload/delete capabilities to authenticated users
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('facility_media', 'facility_media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public access to files (read-only)
CREATE POLICY "Give public access to facility media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'facility_media');

-- Policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload facility media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'facility_media'
  AND auth.role() IN ('authenticated', 'service_role')
);

-- Policy to allow authenticated users to update their own uploads
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

-- Policy to allow authenticated users to delete their own uploads
CREATE POLICY "Allow authenticated users to delete own facility media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'facility_media'
  AND auth.uid() = owner
);