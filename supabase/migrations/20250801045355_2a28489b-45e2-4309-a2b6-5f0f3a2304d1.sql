-- Fix remaining security definer functions with search path vulnerabilities

CREATE OR REPLACE FUNCTION public.update_users_from_auth()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Update existing users with emails from auth.users
  UPDATE public.users
  SET email = au.email
  FROM auth.users au
  WHERE public.users.id = au.id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  code text;
  code_exists boolean;
BEGIN
  -- Only generate code if it doesn't exist
  IF NEW.referral_code IS NULL THEN
    LOOP
      -- Generate a random 8-character alphanumeric code
      code := substring(md5(random()::text) from 1 for 8);
      
      -- Check if code already exists
      SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE referral_code = code
      ) INTO code_exists;
      
      -- Exit loop if code is unique
      EXIT WHEN NOT code_exists;
    END LOOP;
    
    NEW.referral_code := code;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_referred_count()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Only update if invitee_joined changed from false to true
  IF NEW.invitee_joined = true AND (OLD.invitee_joined = false OR OLD.invitee_joined IS NULL) THEN
    -- Increment referred_count for the inviter
    UPDATE public.profiles
    SET 
      referred_count = referred_count + 1,
      -- Set referral_reward_earned to true if referred_count reaches 5
      referral_reward_earned = CASE WHEN referred_count + 1 >= 5 THEN true ELSE referral_reward_earned END
    WHERE id = NEW.inviter_id;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_resources_updated_at()
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

CREATE OR REPLACE FUNCTION public.update_partner_offers_updated_at()
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

CREATE OR REPLACE FUNCTION public.is_vip_member(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND membership_tier = 'vip'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_vip_member_for_telehealth()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Check if the member is a VIP
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = NEW.member_id AND membership_tier = 'vip'
  ) THEN
    RAISE EXCEPTION 'Only VIP members can schedule telehealth sessions';
  END IF;
  RETURN NEW;
END;
$function$;