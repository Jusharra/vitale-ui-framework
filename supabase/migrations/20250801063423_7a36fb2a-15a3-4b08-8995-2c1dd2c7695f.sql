-- Add stripe_customer_id column to subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Create index for better webhook performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);