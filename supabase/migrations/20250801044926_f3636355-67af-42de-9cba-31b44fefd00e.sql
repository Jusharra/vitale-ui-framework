-- Critical Security Fixes - Phase 1 (Fixed): RLS Policies and Database Schema

-- 1. Add missing RLS policies for unprotected tables

-- media_asset_permissions policies
CREATE POLICY "Users can manage their own media permissions"
  ON public.media_asset_permissions
  FOR ALL
  USING (
    asset_id IN (
      SELECT id FROM public.media_assets WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    asset_id IN (
      SELECT id FROM public.media_assets WHERE profile_id = auth.uid()
    )
  );

-- referrals table policies (create the table first)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invitee_email TEXT NOT NULL,
  invitee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invitee_joined BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Fixed policies - remove the column reference issue
CREATE POLICY "Users can view own invitations and referrals"
  ON public.referrals
  FOR SELECT
  USING (inviter_id = auth.uid());

CREATE POLICY "Users can create referrals as inviter"
  ON public.referrals
  FOR INSERT
  WITH CHECK (inviter_id = auth.uid());

CREATE POLICY "Users can update their own referrals"
  ON public.referrals
  FOR UPDATE
  USING (inviter_id = auth.uid())
  WITH CHECK (inviter_id = auth.uid());

-- reports table policies (create if needed)
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON public.reports
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all reports"
  ON public.reports
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Users can create their own reports"
  ON public.reports
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- telehealth_sessions table policies (create if needed)
CREATE TABLE IF NOT EXISTS public.telehealth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.telehealth_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their own telehealth sessions"
  ON public.telehealth_sessions
  FOR SELECT
  USING (member_id = auth.uid());

CREATE POLICY "Providers can view their assigned sessions"
  ON public.telehealth_sessions
  FOR SELECT
  USING (provider_id = auth.uid());

CREATE POLICY "Admins can manage all telehealth sessions"
  ON public.telehealth_sessions
  FOR ALL
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- 2. Fix database function security vulnerabilities
CREATE OR REPLACE FUNCTION public.update_vacation_packages_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_blog_posts_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_facility_tours_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;