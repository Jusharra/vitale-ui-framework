/*
  # Add California and Texas Counties

  1. New Tables
    - `counties` table to store county information
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `state` (text, not null)
      - `description` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `counties` table
    - Add policy for public read access
    - Add policy for admin management
  
  3. Data
    - Insert California and Texas counties
*/

-- Create counties table
CREATE TABLE IF NOT EXISTS counties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  state text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE counties ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view counties"
  ON counties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can manage counties"
  ON counties
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Insert California counties
INSERT INTO counties (name, state, description) VALUES
  ('San Mateo County', 'California', 'Located in the San Francisco Bay Area, known for its affluent communities including Atherton, Menlo Park, and Hillsborough.'),
  ('Marin County', 'California', 'Located north of San Francisco, known for its natural beauty and upscale communities like Tiburon, Ross, and Mill Valley.'),
  ('Santa Clara County', 'California', 'Home to Silicon Valley, including wealthy communities like Los Altos Hills, Palo Alto, and Saratoga.'),
  ('San Francisco County', 'California', 'A consolidated city-county known for its iconic landmarks, diverse neighborhoods, and tech industry.'),
  ('Contra Costa County', 'California', 'Located in the East Bay region, featuring upscale communities like Alamo, Danville, and Orinda.'),
  ('Alameda County', 'California', 'East Bay county including Berkeley, Oakland, and the Tri-Valley area.'),
  ('Alpine County', 'California', 'California''s least populous county, known for its mountainous terrain and outdoor recreation.'),
  ('Napa County', 'California', 'Famous for its wine country, vineyards, and luxury resorts.'),
  ('Santa Cruz County', 'California', 'Coastal county known for its beaches, redwood forests, and the city of Santa Cruz.'),
  ('Orange County', 'California', 'Southern California county known for its beaches, theme parks, and affluent communities like Newport Beach and Laguna Beach.'),
  ('Placer County', 'California', 'Located in the Sierra Nevada mountains and foothills, includes part of Lake Tahoe.'),
  ('El Dorado County', 'California', 'Located in the Sierra Nevada and Gold Country, known for its natural beauty and historic sites.'),
  ('Ventura County', 'California', 'Coastal county northwest of Los Angeles, known for its agriculture and suburban communities.'),
  ('Sonoma County', 'California', 'Known for its wineries, coastal scenery, and the city of Santa Rosa.'),
  ('San Benito County', 'California', 'Located in the Coast Range Mountains, known for its rural character and Pinnacles National Park.'),
  ('Santa Barbara County', 'California', 'Coastal county known for its Mediterranean climate, wineries, and the city of Santa Barbara.'),
  ('San Diego County', 'California', 'Southern California county known for its mild climate, beaches, and the city of San Diego.'),
  ('Monterey County', 'California', 'Coastal county known for Monterey Bay, Big Sur, and the Monterey Peninsula.'),
  ('San Luis Obispo County', 'California', 'Central Coast county known for its wineries, beaches, and the city of San Luis Obispo.'),
  ('Los Angeles County', 'California', 'The most populous county in the United States, home to Los Angeles and many diverse communities.');

-- Insert Texas counties
INSERT INTO counties (name, state, description) VALUES
  ('Travis County', 'Texas', 'Home to Austin, the state capital, known for its tech industry, music scene, and cultural attractions.'),
  ('Collin County', 'Texas', 'Located north of Dallas, includes affluent communities like Plano, Frisco, and McKinney.'),
  ('Tarrant County', 'Texas', 'Home to Fort Worth and surrounding communities, known for its cultural district and Western heritage.'),
  ('Williamson County', 'Texas', 'Located north of Austin, includes growing communities like Round Rock, Georgetown, and Cedar Park.'),
  ('Fort Bend County', 'Texas', 'Southwest of Houston, one of the fastest-growing and most diverse counties in Texas.'),
  ('Montgomery County', 'Texas', 'North of Houston, includes The Woodlands and Conroe, known for its rapid growth and master-planned communities.'),
  ('Denton County', 'Texas', 'North of Dallas-Fort Worth, home to the University of North Texas and Texas Woman''s University.'),
  ('Harris County', 'Texas', 'The most populous county in Texas, containing most of Houston and its suburbs.'),
  ('Dallas County', 'Texas', 'Home to Dallas and many of its inner suburbs, the economic center of North Texas.'),
  ('Bexar County', 'Texas', 'Home to San Antonio, known for the Alamo, River Walk, and military installations.');

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_counties_state ON counties(state);