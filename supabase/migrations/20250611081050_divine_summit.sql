/*
  # Make Partners Table Public

  1. Changes
     - Add policy to allow public users to view partners table
     - This ensures healthcare professionals are visible on the Placements page
  
  2. Security
     - Only allows SELECT operations for public users
     - Maintains existing security for other operations
*/

-- Add policy to allow public users to view partners
CREATE POLICY "Public can view partners" 
ON partners
FOR SELECT 
TO public
USING (status = 'active');