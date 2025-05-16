/*
  # Add transport providers

  1. New Data
    - Add sample transport providers to the `transports` table
  2. Security
    - Ensure RLS is enabled on the transports table
    - Add policies for public access to transport providers
*/

-- First, ensure the transports table exists and has RLS enabled
ALTER TABLE IF EXISTS public.transports ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to view transport providers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'transports' AND policyname = 'Everyone can view transport providers'
    ) THEN
        CREATE POLICY "Everyone can view transport providers" 
        ON public.transports 
        FOR SELECT 
        TO public
        USING (true);
    END IF;
END
$$;

-- Insert sample transport providers if they don't exist
INSERT INTO public.transports (name, email, phone, service_area, services, available_24_7, wheelchair_accessible, status, rating)
VALUES
  ('MediRide Express', 'dispatch@medirideexpress.com', '(555) 123-4567', 'Downtown and Suburbs', 'Non-emergency medical transport, wheelchair service, stretcher service', true, true, 'active', 4.8),
  ('CarePlus Transport', 'bookings@careplus.com', '(555) 234-5678', 'Metro Area', 'Medical appointments, hospital discharge, dialysis transport', false, true, 'active', 4.7),
  ('Mobility Solutions', 'info@mobilitysolutions.com', '(555) 345-6789', 'City-wide', 'Wheelchair transport, senior transport, medical appointments', true, true, 'active', 4.9),
  ('SafeJourney Medical', 'dispatch@safejourney.com', '(555) 456-7890', 'Regional', 'Long-distance medical transport, airport medical assistance, wheelchair service', false, true, 'active', 4.6),
  ('VIP Health Transit', 'vip@healthtransit.com', '(555) 567-8901', 'Premium Service Area', 'Luxury medical transport, private ambulance, concierge service', true, true, 'active', 5.0)
ON CONFLICT (id) DO NOTHING;