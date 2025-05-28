/*
  # Create Transport Tables

  1. New Tables
    - `transports` - Stores transport provider information
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `service_area` (text)
      - `services` (text)
      - `available_24_7` (boolean, default false)
      - `wheelchair_accessible` (boolean, default true)
      - `status` (text, default 'active')
      - `insurance_accepted` (text)
      - `profile_image` (text)
      - `rating` (numeric, default 5.0)
      - `created_at` (timestamptz, default now())
      - `created_by` (uuid, references auth.users)
  2. Security
    - Enable RLS on `transports` table
    - Add policies for authenticated users to insert transport providers
    - Add policies for authenticated users to update their own transport providers
    - Add policies for public to view transport providers
*/

-- Create transports table
CREATE TABLE IF NOT EXISTS transports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  service_area text,
  services text,
  available_24_7 boolean DEFAULT false,
  wheelchair_accessible boolean DEFAULT true,
  status text DEFAULT 'active',
  insurance_accepted text,
  profile_image text,
  rating numeric DEFAULT 5.0,
  created_at timestamptz DEFAULT now(),
  created_by uuid DEFAULT auth.uid() REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE transports ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Authenticated users can insert transport providers"
  ON transports
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their own transport providers"
  ON transports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Everyone can view transport providers"
  ON transports
  FOR SELECT
  TO public
  USING (true);