-- Create partner platform subscriptions table
CREATE TABLE public.partner_platform_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'trial',
  trial_start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  trial_end_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '12 months'),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add platform subscription tracking to partners table
ALTER TABLE public.partners 
ADD COLUMN platform_subscription_active BOOLEAN DEFAULT false,
ADD COLUMN full_revenue_eligible BOOLEAN DEFAULT false,
ADD COLUMN platform_trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '12 months');

-- Enable RLS on partner_platform_subscriptions
ALTER TABLE public.partner_platform_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for partner_platform_subscriptions
CREATE POLICY "Partners can view their own platform subscriptions" 
ON public.partner_platform_subscriptions 
FOR SELECT 
USING (partner_id = auth.uid());

CREATE POLICY "Admins can manage all platform subscriptions" 
ON public.partner_platform_subscriptions 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create function to update partner_platform_subscriptions updated_at
CREATE OR REPLACE FUNCTION public.update_partner_platform_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_partner_platform_subscriptions_updated_at
BEFORE UPDATE ON public.partner_platform_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_partner_platform_subscriptions_updated_at();

-- Create function to auto-create platform subscription trial for new partners
CREATE OR REPLACE FUNCTION public.create_partner_platform_trial()
RETURNS TRIGGER AS $$
BEGIN
  -- Create platform subscription trial for new partners
  INSERT INTO public.partner_platform_subscriptions (
    partner_id,
    status,
    trial_start_date,
    trial_end_date
  ) VALUES (
    NEW.id,
    'trial',
    now(),
    now() + interval '12 months'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create platform trials for new partners
CREATE TRIGGER create_partner_platform_trial_trigger
AFTER INSERT ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.create_partner_platform_trial();