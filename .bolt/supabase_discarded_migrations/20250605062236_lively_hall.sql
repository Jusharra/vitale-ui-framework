-- Create care_facilities table if it doesn't exist
CREATE TABLE IF NOT EXISTS care_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  care_type text NOT NULL,
  price_range text NOT NULL,
  spots_available integer DEFAULT 0,
  amenities text[],
  image_url text,
  status text DEFAULT 'active',
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Add the missing columns
  images text[] DEFAULT '{}',
  videos text[] DEFAULT '{}',
  email text,
  phone text,
  website text,
  hours text,
  virtual_tour_url text
);

-- Enable Row Level Security
ALTER TABLE care_facilities ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage care facilities
DO $$
BEGIN
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
END $$;

-- Create policy for public to view active care facilities
DO $$
BEGIN
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
END $$;

-- Insert sample data if the table is empty
INSERT INTO care_facilities (
  name, 
  description, 
  location, 
  care_type, 
  price_range, 
  spots_available, 
  amenities, 
  image_url, 
  status, 
  featured,
  images,
  videos,
  email,
  phone,
  website,
  hours,
  virtual_tour_url
)
SELECT
  'Sunset Gardens Memory Care',
  'Specialized memory care facility with 24/7 support, secure environment, and personalized care plans.',
  'San Mateo County, CA',
  'Memory Care',
  '$6,500/month',
  3,
  ARRAY['24/7 Care', 'Secure Environment', 'Memory Programs'],
  'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
  'active',
  true,
  ARRAY['https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg'],
  ARRAY[]::text[],
  'info@sunsetgardens.com',
  '(555) 123-4567',
  'https://www.sunsetgardens.com',
  'Open 24/7 for tours by appointment',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
WHERE NOT EXISTS (SELECT 1 FROM care_facilities LIMIT 1);

-- Create function to create the care_facilities table if it doesn't exist
CREATE OR REPLACE FUNCTION create_care_facilities_table()
RETURNS void AS $$
BEGIN
  -- This function is a placeholder since we're creating the table directly
  -- It's here to provide an RPC endpoint for the client to call if needed
  RETURN;
END;
$$ LANGUAGE plpgsql;