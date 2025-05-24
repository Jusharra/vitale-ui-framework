/*
  # Add Placement Requests Table

  1. New Tables
    - `placement_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `facility_id` (uuid, optional)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `care_needs` (text)
      - `location` (text)
      - `notes` (text, optional)
      - `urgency_level` (text)
      - `status` (text)
      - `deposit_paid` (boolean)
      - `deposit_amount` (numeric)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      
  2. Security
    - Enable RLS on `placement_requests` table
    - Add policies for authenticated users to create their own requests
    - Add policies for admins to manage all requests
*/

-- Create placement_requests table
CREATE TABLE IF NOT EXISTS placement_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  facility_id uuid,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  care_needs text NOT NULL,
  location text NOT NULL,
  notes text,
  urgency_level text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  deposit_paid boolean DEFAULT false,
  deposit_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE placement_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own placement requests"
  ON placement_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own placement requests"
  ON placement_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all placement requests"
  ON placement_requests
  FOR ALL
  TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_placement_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_placement_requests_updated_at
BEFORE UPDATE ON placement_requests
FOR EACH ROW
EXECUTE FUNCTION update_placement_requests_updated_at();

-- Create index for faster queries
CREATE INDEX idx_placement_requests_user_id ON placement_requests(user_id);
CREATE INDEX idx_placement_requests_facility_id ON placement_requests(facility_id);
CREATE INDEX idx_placement_requests_status ON placement_requests(status);
CREATE INDEX idx_placement_requests_urgency_level ON placement_requests(urgency_level);