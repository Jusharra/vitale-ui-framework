-- Step 1: Add Stripe Connect fields to existing partners table
ALTER TABLE partners 
ADD COLUMN IF NOT EXISTS stripe_connect_account_id TEXT,
ADD COLUMN IF NOT EXISTS connect_onboarding_complete BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS revenue_split_percentage NUMERIC DEFAULT 70.0,
ADD COLUMN IF NOT EXISTS revenue_split_active BOOLEAN DEFAULT FALSE;

-- Step 2: Add assigned partner to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS assigned_partner_id UUID REFERENCES partners(id);

-- Step 3: Add revenue tracking to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS assigned_partner_id UUID REFERENCES partners(id),
ADD COLUMN IF NOT EXISTS platform_fee_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS partner_revenue_amount NUMERIC DEFAULT 0;

-- Step 4: Create partner_trials table for trial tracking
CREATE TABLE IF NOT EXISTS partner_trials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  trial_start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  trial_end_date TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '14 days',
  trial_status TEXT NOT NULL DEFAULT 'active' CHECK (trial_status IN ('active', 'expired', 'converted')),
  conversion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(partner_id, profile_id)
);

-- Enable RLS on partner_trials
ALTER TABLE partner_trials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for partner_trials
CREATE POLICY "Partners can view their own trials" ON partner_trials
  FOR SELECT USING (partner_id = auth.uid());

CREATE POLICY "Members can view their own trials" ON partner_trials
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "Admins can manage all trials" ON partner_trials
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin');

-- Create updated_at trigger for partner_trials
CREATE OR REPLACE FUNCTION update_partner_trials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_trials_updated_at
  BEFORE UPDATE ON partner_trials
  FOR EACH ROW
  EXECUTE FUNCTION update_partner_trials_updated_at();