-- Enable RLS and secure access to vacation_bookings
ALTER TABLE public.vacation_bookings ENABLE ROW LEVEL SECURITY;

-- Admins can manage all bookings
CREATE POLICY "Admins can manage all vacation bookings"
ON public.vacation_bookings
FOR ALL
USING ((auth.jwt() ->> 'role') = 'admin')
WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Users can view their own bookings
CREATE POLICY "Users can view their own vacation bookings"
ON public.vacation_bookings
FOR SELECT
USING (user_id = auth.uid());

-- Users can create their own bookings (client-side inserts)
CREATE POLICY "Users can create their own vacation bookings"
ON public.vacation_bookings
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Users can update their own bookings
CREATE POLICY "Users can update their own vacation bookings"
ON public.vacation_bookings
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Only admins can delete
CREATE POLICY "Admins can delete any vacation booking"
ON public.vacation_bookings
FOR DELETE
USING ((auth.jwt() ->> 'role') = 'admin');

-- Helpful index for session lookups
CREATE INDEX IF NOT EXISTS idx_vacation_bookings_stripe_session_id
  ON public.vacation_bookings (stripe_session_id);

-- RPC to fetch a single booking by Stripe session id (bypasses RLS but returns minimal fields)
CREATE OR REPLACE FUNCTION public.get_vacation_booking_by_session(p_session_id text)
RETURNS TABLE(
  booking_reference text,
  package_name text,
  guest_name text,
  guest_email text,
  check_in_date date,
  check_out_date date,
  number_of_guests integer,
  total_amount numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT 
    booking_reference,
    package_name,
    guest_name,
    guest_email,
    check_in_date,
    check_out_date,
    number_of_guests,
    total_amount
  FROM public.vacation_bookings
  WHERE stripe_session_id = p_session_id
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Allow calling the function from client
GRANT EXECUTE ON FUNCTION public.get_vacation_booking_by_session(text) TO anon, authenticated;