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
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE care_facilities ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage care facilities
CREATE POLICY "Admins can manage care facilities"
  ON care_facilities
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Create policy for public to view active care facilities
CREATE POLICY "Public can view active care facilities"
  ON care_facilities
  FOR SELECT
  TO public
  USING (status = 'active');

-- Create function to create the care_facilities table if it doesn't exist
CREATE OR REPLACE FUNCTION create_care_facilities_table()
RETURNS void AS $$
BEGIN
  -- This function is a placeholder since we're creating the table directly
  -- It's here to provide an RPC endpoint for the client to call if needed
  RETURN;
END;
$$ LANGUAGE plpgsql;