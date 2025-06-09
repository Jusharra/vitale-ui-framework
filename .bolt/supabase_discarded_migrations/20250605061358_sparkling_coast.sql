/*
  # Add additional columns to care_facilities table
  
  1. Changes
    - Add email column
    - Add phone column
    - Add website_url column
    - Add virtual_tour_url column
    - Add operating_hours column
    
  2. Security
    - No changes to RLS policies
*/

-- Add columns to care_facilities table if they don't exist
ALTER TABLE IF EXISTS public.care_facilities 
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS virtual_tour_url text,
  ADD COLUMN IF NOT EXISTS operating_hours text;