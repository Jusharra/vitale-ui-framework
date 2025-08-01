-- Enhanced approval system using existing partner_leads table

-- Add enum for application statuses if not exists
DO $$ BEGIN
    CREATE TYPE application_status AS ENUM (
        'submitted', 
        'under_review', 
        'info_requested', 
        'resubmitted',
        'approved', 
        'rejected'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update partner_leads table to support enhanced approval workflow
ALTER TABLE partner_leads 
ADD COLUMN IF NOT EXISTS application_type text DEFAULT 'partner_application',
ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS work_history jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS licenses jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS professional_references jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS insurance_info jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS service_areas text[],
ADD COLUMN IF NOT EXISTS detailed_bio text,
ADD COLUMN IF NOT EXISTS uploaded_documents jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS admin_notes text,
ADD COLUMN IF NOT EXISTS info_requests jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS last_status_change timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS reviewed_by uuid,
ADD COLUMN IF NOT EXISTS application_score integer DEFAULT 0;

-- Add foreign key constraint for reviewed_by separately
DO $$ BEGIN
    ALTER TABLE partner_leads 
    ADD CONSTRAINT fk_partner_leads_reviewed_by 
    FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update RLS policies for enhanced approval workflow
DROP POLICY IF EXISTS "Admins full access to partner leads" ON partner_leads;
DROP POLICY IF EXISTS "Members access own leads" ON partner_leads;

-- Create comprehensive RLS policies
CREATE POLICY "Admins can manage all applications" 
ON partner_leads 
FOR ALL 
TO authenticated
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Users can view their own applications" 
ON partner_leads 
FOR SELECT 
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own applications" 
ON partner_leads 
FOR INSERT 
TO authenticated
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own applications" 
ON partner_leads 
FOR UPDATE 
TO authenticated
USING (profile_id = auth.uid() AND status IN ('info_requested', 'submitted'))
WITH CHECK (profile_id = auth.uid());

-- Create trigger to track status changes
CREATE OR REPLACE FUNCTION track_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update last_status_change when status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.last_status_change = now();
    
    -- Add status change to metadata
    NEW.metadata = COALESCE(NEW.metadata, '{}'::jsonb) || 
      jsonb_build_object(
        'status_history', 
        COALESCE(NEW.metadata->'status_history', '[]'::jsonb) || 
        jsonb_build_array(
          jsonb_build_object(
            'status', NEW.status,
            'changed_at', now(),
            'changed_by', auth.uid()
          )
        )
      );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for status tracking
DROP TRIGGER IF EXISTS application_status_change_trigger ON partner_leads;
CREATE TRIGGER application_status_change_trigger
  BEFORE UPDATE ON partner_leads
  FOR EACH ROW
  EXECUTE FUNCTION track_application_status_change();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_partner_leads_status ON partner_leads(status);
CREATE INDEX IF NOT EXISTS idx_partner_leads_application_type ON partner_leads(application_type);
CREATE INDEX IF NOT EXISTS idx_partner_leads_last_status_change ON partner_leads(last_status_change);
CREATE INDEX IF NOT EXISTS idx_partner_leads_reviewed_by ON partner_leads(reviewed_by);