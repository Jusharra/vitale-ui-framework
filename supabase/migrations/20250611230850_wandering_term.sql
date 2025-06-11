/*
  # Fix Care Facilities RLS and Storage Policies

  1. Tables
    - Ensure care_facilities table exists with proper structure
    - Fix RLS policies to work with current auth system
    
  2. Storage
    - Create facility_media bucket if it doesn't exist
    - Set up proper storage policies
    
  3. Security
    - Update RLS policies to use proper role checking
    - Ensure admins can manage facilities
    - Allow public to view active facilities
*/

-- Create care_facilities table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  care_type text NOT NULL,
  price_range text NOT NULL,
  spots_available integer DEFAULT 0,
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  videos text[] DEFAULT '{}',
  image_url text,
  status text DEFAULT 'draft',
  featured boolean DEFAULT false,
  phone text,
  email text,
  website text,
  hours text,
  virtual_tour_url text,
  services text[] DEFAULT '{}',
  slug text UNIQUE,
  seo_keywords text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE care_facilities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage care facilities" ON care_facilities;
DROP POLICY IF EXISTS "Public can view active care facilities" ON care_facilities;
DROP POLICY IF EXISTS "Allow only active published pages" ON care_facilities;

-- Create new RLS policies that work with the current auth system
CREATE POLICY "Admins can manage care facilities"
  ON care_facilities
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public can view active care facilities"
  ON care_facilities
  FOR SELECT
  TO public
  USING (status = 'active');

-- Create storage bucket for facility media if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('facility_media', 'facility_media', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Admins can upload facility media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view facility media" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete facility media" ON storage.objects;

-- Create storage policies for facility_media bucket
CREATE POLICY "Admins can upload facility media"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'facility_media' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Public can view facility media"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'facility_media');

CREATE POLICY "Admins can delete facility media"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'facility_media' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add constraint for status values
ALTER TABLE care_facilities 
DROP CONSTRAINT IF EXISTS care_facilities_status_check;

ALTER TABLE care_facilities 
ADD CONSTRAINT care_facilities_status_check 
CHECK (status IN ('active', 'draft', 'archived'));

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_care_facilities_status ON care_facilities(status);
CREATE INDEX IF NOT EXISTS idx_care_facilities_featured ON care_facilities(featured);
CREATE INDEX IF NOT EXISTS idx_care_facilities_slug ON care_facilities(slug);