-- Fix existing partner records by linking them to user profiles
-- Update partner records that have null user_id by matching email addresses
UPDATE partners 
SET user_id = profiles.id::text
FROM profiles 
WHERE partners.email = (
  SELECT email FROM auth.users WHERE id = profiles.id
) 
AND partners.user_id IS NULL
AND profiles.role = 'partner';

-- Create partner records for partner role users who don't have partner table entries
INSERT INTO partners (
  id,
  user_id,
  name,
  email,
  status,
  verified
)
SELECT 
  p.id,
  p.id::text,
  p.full_name,
  au.email,
  'pending',
  false
FROM profiles p
JOIN auth.users au ON au.id = p.id
WHERE p.role = 'partner' 
AND NOT EXISTS (
  SELECT 1 FROM partners pt 
  WHERE pt.user_id = p.id::text OR pt.id = p.id
);