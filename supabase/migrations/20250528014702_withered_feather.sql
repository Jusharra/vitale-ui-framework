/*
  # Create payment history table

  1. New Tables
    - `payment_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `stripe_payment_id` (text)
      - `amount` (numeric)
      - `currency` (text)
      - `status` (text)
      - `payment_method` (text)
      - `description` (text)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `payment_history` table
    - Add policy for users to view their own payment history
*/

-- Create payment history table
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

-- Create index on user_id
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);

-- Create index on stripe_payment_id
CREATE INDEX IF NOT EXISTS idx_payment_history_stripe_payment_id ON payment_history(stripe_payment_id);

-- Enable Row Level Security
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own payment history
CREATE POLICY "Users can view their own payment history"
  ON payment_history
  FOR SELECT
  TO public
  USING (user_id = auth.uid());