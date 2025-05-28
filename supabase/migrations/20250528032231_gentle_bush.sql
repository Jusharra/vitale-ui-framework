/*
  # Add facility tours table

  1. New Tables
    - `facility_tours`
      - `id` (uuid, primary key)
      - `facility_id` (uuid, foreign key to care_facilities)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `tour_date` (timestamp with time zone)
      - `tour_type` (text)
      - `notes` (text)
      - `status` (text)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `facility_tours` table
    - Add policy for authenticated users to insert tours
    - Add policy for users to view their own tours
    - Add policy for admins to manage all tours
*/

-- Create facility_tours table
CREATE TABLE IF NOT EXISTS facility_tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id uuid REFERENCES care_facilities(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  tour_date timestamp with time zone NOT NULL,
  tour_type text NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add status check constraint
ALTER TABLE facility_tours
  ADD CONSTRAINT facility_tours_status_check
  CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'));

-- Add tour_type check constraint
ALTER TABLE facility_tours
  ADD CONSTRAINT facility_tours_tour_type_check
  CHECK (tour_type IN ('in-person', 'virtual'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_facility_tours_facility_id ON facility_tours(facility_id);
CREATE INDEX IF NOT EXISTS idx_facility_tours_user_id ON facility_tours(user_id);
CREATE INDEX IF NOT EXISTS idx_facility_tours_tour_date ON facility_tours(tour_date);
CREATE INDEX IF NOT EXISTS idx_facility_tours_status ON facility_tours(status);

-- Enable Row Level Security
ALTER TABLE facility_tours ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own tours"
  ON facility_tours
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own tours"
  ON facility_tours
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all tours"
  ON facility_tours
  FOR ALL
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_facility_tours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_facility_tours_updated_at
BEFORE UPDATE ON facility_tours
FOR EACH ROW
EXECUTE FUNCTION update_facility_tours_updated_at();