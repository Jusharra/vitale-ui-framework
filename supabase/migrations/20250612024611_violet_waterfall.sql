/*
  # Add Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `description` (text)
      - `category` (text)
      - `price` (numeric)
      - `duration` (text)
      - `image_url` (text)
      - `active` (boolean, default true)
      - `created_at` (timestamptz, default now())
  2. Security
    - Enable RLS on `services` table
    - Add policies for authenticated users to select services
    - Add policies for public users to insert their own services
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  price numeric,
  duration text,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "services_select" 
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "lead_view_services" 
  ON services
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "insert_own_services" 
  ON services
  FOR INSERT
  TO public
  WITH CHECK (id = uid());

CREATE POLICY "select_own_services" 
  ON services
  FOR SELECT
  TO public
  USING (id = uid());

-- Create triggers for logging
CREATE TRIGGER log_services_insert
  AFTER INSERT ON services
  FOR EACH ROW
  EXECUTE FUNCTION log_insert();

CREATE TRIGGER log_services_update
  AFTER UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION log_update();

CREATE TRIGGER log_services_delete
  AFTER DELETE ON services
  FOR EACH ROW
  EXECUTE FUNCTION log_delete();

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Create index on active status for faster filtering
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);