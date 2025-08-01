-- Fix partner data relationships: Update user_id field to link partners with auth users
-- First, update existing partners where user_id is NULL but we can match by email or name
UPDATE partners 
SET user_id = auth_users.id::text
FROM auth.users auth_users
JOIN profiles ON profiles.id = auth_users.id
WHERE partners.user_id IS NULL 
  AND profiles.role = 'partner'
  AND (partners.email = auth_users.email OR partners.id = auth_users.id);

-- Create partner records for users with partner role who don't have partner records yet
INSERT INTO partners (id, user_id, name, email, status, created_at)
SELECT 
  profiles.id,
  profiles.id::text,
  COALESCE(profiles.full_name, auth_users.email),
  auth_users.email,
  'active',
  now()
FROM profiles
JOIN auth.users auth_users ON auth_users.id = profiles.id
WHERE profiles.role = 'partner'
  AND NOT EXISTS (
    SELECT 1 FROM partners 
    WHERE partners.user_id = profiles.id::text 
       OR partners.id = profiles.id
  )
ON CONFLICT (id) DO NOTHING;