-- Initialize subscription records for all existing users who don't have them
-- First check if any subscriptions exist, then insert for users without them
INSERT INTO subscriptions (user_id, tier, status, created_at, updated_at)
SELECT 
  auth_users.id,
  'premium',
  'inactive',
  now(),
  now()
FROM auth.users auth_users
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions 
  WHERE subscriptions.user_id = auth_users.id
);