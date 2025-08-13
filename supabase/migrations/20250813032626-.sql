-- Secure vacation_bookings by tightening RLS policies
-- 1) Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.vacation_bookings ENABLE ROW LEVEL SECURITY;

-- 2) Drop insecure or overly-permissive policies
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'vacation_bookings' 
      AND policyname = 'Users can view their own bookings'
  ) THEN
    DROP POLICY "Users can view their own bookings" ON public.vacation_bookings;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'vacation_bookings' 
      AND policyname = 'Users can create bookings'
  ) THEN
    DROP POLICY "Users can create bookings" ON public.vacation_bookings;
  END IF;
END $$;

-- 3) Create safe, least-privilege policies
-- Admins can manage all bookings (idempotent: only create if not existing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'vacation_bookings' 
      AND policyname = 'Admins can manage all vacation bookings'
  ) THEN
    CREATE POLICY "Admins can manage all vacation bookings"
    ON public.vacation_bookings
    AS PERMISSIVE
    FOR ALL
    TO authenticated, anon
    USING ((auth.jwt() ->> 'role') = 'admin')
    WITH CHECK ((auth.jwt() ->> 'role') = 'admin');
  END IF;
END $$;

-- Members can select their own bookings by user_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'vacation_bookings' 
      AND policyname = 'Users can view their own vacation bookings'
  ) THEN
    CREATE POLICY "Users can view their own vacation bookings"
    ON public.vacation_bookings
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());
  END IF;
END $$;

-- Members can also view by matching their profile email (for legacy rows without user_id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'vacation_bookings' 
      AND policyname = 'Users can view bookings via email match'
  ) THEN
    CREATE POLICY "Users can view bookings via email match"
    ON public.vacation_bookings
    AS PERMISSIVE
    FOR SELECT
    TO authenticated
    USING (
      guest_email = (
        SELECT email FROM public.profiles WHERE id = auth.uid()
      )
    );
  END IF;
END $$;

-- Members can create their own bookings if inserting from client (service role bypasses RLS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'vacation_bookings' 
      AND policyname = 'Users can create their own vacation bookings'
  ) THEN
    CREATE POLICY "Users can create their own vacation bookings"
    ON public.vacation_bookings
    AS PERMISSIVE
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Members can update their own bookings (optional; keep as-is if already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'vacation_bookings' 
      AND policyname = 'Users can update their own vacation bookings'
  ) THEN
    CREATE POLICY "Users can update their own vacation bookings"
    ON public.vacation_bookings
    AS PERMISSIVE
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- 4) Helpful indexes for policy lookups and RPC
CREATE INDEX IF NOT EXISTS idx_vacation_bookings_user_id ON public.vacation_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_vacation_bookings_guest_email ON public.vacation_bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_vacation_bookings_stripe_session ON public.vacation_bookings(stripe_session_id);
