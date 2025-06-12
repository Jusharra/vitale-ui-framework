/*
  # Services table and policies update
  
  1. New Tables
    - Creates `services` table if it doesn't exist
  2. Security
    - Enables RLS on `services` table
    - Adds policies for service access
  3. Indexes
    - Creates indexes for better query performance
*/

-- Create services table if it doesn't exist
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

-- Enable Row Level Security if not already enabled
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
  -- Check if services_select policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'services_select'
  ) THEN
    CREATE POLICY "services_select" 
      ON services
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Check if lead_view_services policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'lead_view_services'
  ) THEN
    CREATE POLICY "lead_view_services" 
      ON services
      FOR SELECT
      TO authenticated
      USING (active = true);
  END IF;

  -- Check if insert_own_services policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'insert_own_services'
  ) THEN
    CREATE POLICY "insert_own_services" 
      ON services
      FOR INSERT
      TO public
      WITH CHECK (id = uid());
  END IF;

  -- Check if select_own_services policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'select_own_services'
  ) THEN
    CREATE POLICY "select_own_services" 
      ON services
      FOR SELECT
      TO public
      USING (id = uid());
  END IF;
END $$;

-- Create triggers for logging if they don't exist
DO $$
BEGIN
  -- Check if log_services_insert trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'log_services_insert'
  ) THEN
    CREATE TRIGGER log_services_insert
      AFTER INSERT ON services
      FOR EACH ROW
      EXECUTE FUNCTION log_insert();
  END IF;

  -- Check if log_services_update trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'log_services_update'
  ) THEN
    CREATE TRIGGER log_services_update
      AFTER UPDATE ON services
      FOR EACH ROW
      EXECUTE FUNCTION log_update();
  END IF;

  -- Check if log_services_delete trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'log_services_delete'
  ) THEN
    CREATE TRIGGER log_services_delete
      AFTER DELETE ON services
      FOR EACH ROW
      EXECUTE FUNCTION log_delete();
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);