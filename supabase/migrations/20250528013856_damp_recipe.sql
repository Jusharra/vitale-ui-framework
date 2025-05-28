/*
  # Add Stripe customer ID to profiles table

  1. Changes
    - Add `stripe_customer_id` column to profiles table
    - Add `membership_tier` column to profiles table
    - Add `trial_status` and `trial_end_date` columns to profiles table
*/

-- Add Stripe customer ID to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id text;
  END IF;
END $$;

-- Add membership tier to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'membership_tier'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership_tier text DEFAULT 'smart';
  END IF;
END $$;

-- Add trial status and end date to profiles table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'trial_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN trial_status text DEFAULT 'inactive';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'trial_end_date'
  ) THEN
    ALTER TABLE profiles ADD COLUMN trial_end_date timestamptz;
  END IF;
END $$;