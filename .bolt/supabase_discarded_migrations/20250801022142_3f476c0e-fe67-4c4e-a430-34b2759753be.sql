-- Add caregiver role to existing user role enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'user_role' AND e.enumlabel = 'caregiver') THEN
        ALTER TYPE user_role ADD VALUE 'caregiver';
    END IF;
END $$;

-- Extend profiles table for caregiver-specific data
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS directory_listing boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS vetting_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS specialties text[],
ADD COLUMN IF NOT EXISTS availability jsonb,
ADD COLUMN IF NOT EXISTS hourly_rate numeric,
ADD COLUMN IF NOT EXISTS years_experience integer,
ADD COLUMN IF NOT EXISTS certifications text[];

-- Add constraint for vetting_status values
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'profiles_vetting_status_check'
    ) THEN
        ALTER TABLE profiles 
        ADD CONSTRAINT profiles_vetting_status_check 
        CHECK (vetting_status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Create caregiver_subscriptions table to track subscription status
CREATE TABLE IF NOT EXISTS public.caregiver_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on caregiver_subscriptions
ALTER TABLE public.caregiver_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for caregiver_subscriptions
CREATE POLICY "Caregivers can view their own subscriptions" 
ON public.caregiver_subscriptions 
FOR SELECT 
USING (caregiver_id = auth.uid());

CREATE POLICY "Admins can manage all caregiver subscriptions" 
ON public.caregiver_subscriptions 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Update trigger for caregiver_subscriptions
CREATE OR REPLACE FUNCTION public.update_caregiver_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists and create new one
DROP TRIGGER IF EXISTS update_caregiver_subscriptions_updated_at ON public.caregiver_subscriptions;
CREATE TRIGGER update_caregiver_subscriptions_updated_at
BEFORE UPDATE ON public.caregiver_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_caregiver_subscriptions_updated_at();

-- Add RLS policy for caregivers to update their own profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Caregivers can update their own profiles'
    ) THEN
        CREATE POLICY "Caregivers can update their own profiles" 
        ON public.profiles 
        FOR UPDATE 
        USING (id = auth.uid() AND role = 'caregiver')
        WITH CHECK (id = auth.uid() AND role = 'caregiver');
    END IF;
END $$;