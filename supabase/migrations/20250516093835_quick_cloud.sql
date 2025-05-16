/*
  # Fix Professional Dashboard Access

  1. Changes
    - Updates role for specific users to 'professional'
    - Ensures JWT claims are properly set
  2. Security
    - No changes to RLS policies
*/

-- Update specific users to have professional role
UPDATE public.profiles
SET role = 'professional'
WHERE id IN (
  'c349a285-bc2c-494b-902b-7e35358a495d',
  '4cd620db-3ba8-489a-bb3f-cc9cf43c0daf'
);

-- Ensure the JWT claims are updated for these users
UPDATE auth.users
SET raw_app_meta_data = 
  CASE WHEN raw_app_meta_data IS NULL THEN 
    jsonb_build_object('role', 'professional')
  ELSE
    jsonb_set(raw_app_meta_data, '{role}', '"professional"')
  END
WHERE id IN (
  'c349a285-bc2c-494b-902b-7e35358a495d',
  '4cd620db-3ba8-489a-bb3f-cc9cf43c0daf'
);

-- Verify the changes by selecting the updated users
-- This is just for verification and doesn't modify anything
SELECT id, role FROM public.profiles 
WHERE id IN (
  'c349a285-bc2c-494b-902b-7e35358a495d',
  '4cd620db-3ba8-489a-bb3f-cc9cf43c0daf'
);