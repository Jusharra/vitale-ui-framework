-- Fix the remaining security definer functions with search path issues

CREATE OR REPLACE FUNCTION public.update_telehealth_session_updated_at()
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

CREATE OR REPLACE FUNCTION public.update_media_assets_updated_at()
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

CREATE OR REPLACE FUNCTION public.log_auth_event()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.logs (
    user_id,
    action,
    table_name,
    metadata
  ) VALUES (
    NEW.id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'login'
      WHEN TG_OP = 'DELETE' THEN 'logout'
      ELSE TG_OP::text
    END,
    'auth.sessions',
    jsonb_build_object(
      'event', TG_OP,
      'user_email', (SELECT email FROM auth.users WHERE id = NEW.id)
    )
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.logs (
    user_id,
    action,
    table_name,
    record_id,
    metadata
  ) VALUES (
    auth.uid(),
    'delete',
    TG_TABLE_NAME,
    OLD.id,
    jsonb_build_object(
      'old_data', row_to_json(OLD)::jsonb
    )
  );
  RETURN OLD;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_insert()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.logs (
    user_id,
    action,
    table_name,
    record_id,
    metadata
  ) VALUES (
    auth.uid(),
    'create',
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object(
      'new_data', row_to_json(NEW)::jsonb
    )
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_symptom_submission_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  -- Only log if status changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.triage_activity_logs (
      submission_id,
      action,
      user_id,
      user_name,
      details,
      timestamp
    ) VALUES (
      NEW.id,
      'Status Changed',
      auth.uid(),
      (SELECT full_name FROM public.profiles WHERE id = auth.uid()),
      format('Status changed from %s to %s', OLD.status, NEW.status),
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.logs (
    user_id,
    action,
    table_name,
    record_id,
    metadata
  ) VALUES (
    auth.uid(),
    'update',
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object(
      'old_data', row_to_json(OLD)::jsonb,
      'new_data', row_to_json(NEW)::jsonb,
      'changed_fields', (
        SELECT jsonb_object_agg(key, value)
        FROM jsonb_each(row_to_json(NEW)::jsonb)
        WHERE NOT (row_to_json(OLD)::jsonb ? key AND row_to_json(OLD)::jsonb->key = value)
      )
    )
  );
  RETURN NEW;
END;
$function$;