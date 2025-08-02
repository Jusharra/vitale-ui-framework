-- Create vacation_bookings table
CREATE TABLE public.vacation_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  package_id UUID NOT NULL,
  package_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  number_of_guests INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  original_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  membership_tier TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  booking_reference TEXT UNIQUE NOT NULL DEFAULT CONCAT('VB-', UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))),
  special_requests TEXT,
  booking_status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vacation_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own bookings" 
ON public.vacation_bookings 
FOR SELECT 
USING (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "Users can create bookings" 
ON public.vacation_bookings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can manage all bookings" 
ON public.vacation_bookings 
FOR ALL 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create trigger for updated_at
CREATE TRIGGER update_vacation_bookings_updated_at
BEFORE UPDATE ON public.vacation_bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();