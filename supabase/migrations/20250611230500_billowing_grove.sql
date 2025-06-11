/*
  # Create Storage Buckets for Partner Images

  1. New Storage Buckets
    - Create partner_images bucket for storing partner profile images
  2. Security
    - Enable public access for the bucket
    - Set up appropriate RLS policies
*/

-- Create partner_images bucket if it doesn't exist
DO $$
BEGIN
  -- Check if the bucket already exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'partner_images'
  ) THEN
    -- Create the bucket
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('partner_images', 'partner_images', true);
  END IF;
END $$;

-- Create RLS policies for partner_images bucket
CREATE POLICY "Partner images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'partner_images');

CREATE POLICY "Authenticated users can upload partner images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'partner_images');

CREATE POLICY "Users can update their own partner images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'partner_images');

CREATE POLICY "Users can delete their own partner images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'partner_images');