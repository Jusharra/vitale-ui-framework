/*
  # Update specific user to admin role

  1. Changes
    - Updates the role for user cbc0a19f-d1d1-452e-8941-8f4d3e621eab to 'admin' in profiles table
    - Updates the JWT claims in auth.users to reflect the admin role
*/

-- Update the user's role in the profiles table
UPDATE public.profiles
SET role = 'admin'
WHERE id = 'cbc0a19f-d1d1-452e-8941-8f4d3e621eab';

-- Update the user's JWT claims in auth.users
UPDATE auth.users
SET raw_app_meta_data = 
  COALESCE(raw_app_meta_data, '{}'::jsonb) || 
  jsonb_build_object('role', 'admin')
WHERE id = 'cbc0a19f-d1d1-452e-8941-8f4d3e621eab';