-- Critical Security Fixes - Core RLS and Function Security

-- 1. Fix the most critical function security vulnerabilities first
-- Update remaining security definer functions to have proper search path

CREATE OR REPLACE FUNCTION public.update_partner_trials_updated_at()
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

CREATE OR REPLACE FUNCTION public.create_partner_platform_trial()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_placement_requests_updated_at()
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

CREATE OR REPLACE FUNCTION public.update_partner_platform_subscriptions_updated_at()
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

CREATE OR REPLACE FUNCTION public.update_caregiver_subscriptions_updated_at()
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

CREATE OR REPLACE FUNCTION public.generate_partner_slug()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- If slug is already provided, use it
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;
  
  -- Generate a base slug from the name
  NEW.slug := LOWER(REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9]', '-', 'g'));
  
  -- Check for duplicates and append a number if needed
  DECLARE
    base_slug TEXT := NEW.slug;
    final_slug TEXT := base_slug;
    counter INT := 1;
  BEGIN
    WHILE EXISTS (SELECT 1 FROM partners WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    NEW.slug := final_slug;
  END;
  
  RETURN NEW;
END;
$function$;

-- 2. Add missing RLS policies for existing tables that need protection
-- Only add policies for tables that exist and need them

-- media_asset_permissions - only if table exists and needs policy
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'media_asset_permissions') THEN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_asset_permissions' AND policyname = 'Users can manage their own media permissions') THEN
            EXECUTE 'CREATE POLICY "Users can manage their own media permissions" ON public.media_asset_permissions FOR ALL USING (asset_id IN (SELECT id FROM public.media_assets WHERE profile_id = auth.uid())) WITH CHECK (asset_id IN (SELECT id FROM public.media_assets WHERE profile_id = auth.uid()))';
        END IF;
    END IF;
END
$$;