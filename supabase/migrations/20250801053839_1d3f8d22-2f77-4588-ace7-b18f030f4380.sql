-- Initialize subscription records for all existing users who don't have them
INSERT INTO subscriptions (id, user_id, email, subscribed, subscription_tier, updated_at, created_at)
SELECT 
  gen_random_uuid(),
  auth_users.id,
  auth_users.email,
  false,
  NULL,
  now(),
  now()
FROM auth.users auth_users
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions 
  WHERE subscriptions.user_id = auth_users.id
)
ON CONFLICT (user_id) DO NOTHING;