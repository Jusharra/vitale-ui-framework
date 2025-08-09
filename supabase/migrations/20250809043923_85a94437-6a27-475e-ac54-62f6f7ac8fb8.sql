-- Create marketplace tables for one-time payments

-- 1) Pricing table managed by Admins
CREATE TABLE IF NOT EXISTS public.marketplace_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'usd',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_pricing ENABLE ROW LEVEL SECURITY;

-- Public can view active prices
CREATE POLICY IF NOT EXISTS "Public can view active marketplace pricing"
ON public.marketplace_pricing
FOR SELECT
USING (is_active = true);

-- Admins can manage pricing
CREATE POLICY IF NOT EXISTS "Admins can manage marketplace pricing"
ON public.marketplace_pricing
FOR ALL
USING ((auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_marketplace_pricing_updated_at'
  ) THEN
    CREATE TRIGGER update_marketplace_pricing_updated_at
    BEFORE UPDATE ON public.marketplace_pricing
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Seed default services
INSERT INTO public.marketplace_pricing (service_key, name, description, amount_cents)
VALUES
('pharmacy_delivery', 'Pharmacy Delivery', 'One-time pharmacy delivery request', 2500),
('medical_transport', 'Medical Transport Request', 'One-time medical transport booking request', 4900)
ON CONFLICT (service_key) DO NOTHING;

-- 2) Orders table written by Edge Functions (service role)
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  user_email TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  service_key TEXT NOT NULL,
  provider_type TEXT,
  provider_id UUID,
  provider_name TEXT,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  assigned_partner_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Admins can manage all orders
CREATE POLICY IF NOT EXISTS "Admins can manage marketplace orders"
ON public.marketplace_orders
FOR ALL
USING ((auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Authenticated users can view their own orders (if any)
CREATE POLICY IF NOT EXISTS "Users can view their own marketplace orders"
ON public.marketplace_orders
FOR SELECT
USING (user_id = auth.uid());

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status ON public.marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_created_at ON public.marketplace_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_service_key ON public.marketplace_orders(service_key);

-- Trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_marketplace_orders_updated_at'
  ) THEN
    CREATE TRIGGER update_marketplace_orders_updated_at
    BEFORE UPDATE ON public.marketplace_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;