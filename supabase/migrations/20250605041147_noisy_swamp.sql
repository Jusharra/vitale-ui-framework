-- Create payment_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_id text,
  amount numeric NOT NULL,
  currency text DEFAULT 'usd',
  status text NOT NULL,
  payment_method text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text,
  tier text DEFAULT 'smart' NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add RLS to payment_history
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Add RLS to subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own payment history (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payment_history' AND policyname = 'Users can view their own payment history'
  ) THEN
    CREATE POLICY "Users can view their own payment history"
      ON payment_history
      FOR SELECT
      TO public
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Create policy for users to view their own subscriptions (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'subscriptions' AND policyname = 'Users can view their own subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own subscriptions"
      ON subscriptions
      FOR SELECT
      TO public
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Add columns to profiles table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'membership_tier') THEN
    ALTER TABLE profiles ADD COLUMN membership_tier text DEFAULT 'smart';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'trial_status') THEN
    ALTER TABLE profiles ADD COLUMN trial_status text DEFAULT 'inactive';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'profiles' AND column_name = 'trial_end_date') THEN
    ALTER TABLE profiles ADD COLUMN trial_end_date timestamptz;
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_payment_id ON payment_history(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);