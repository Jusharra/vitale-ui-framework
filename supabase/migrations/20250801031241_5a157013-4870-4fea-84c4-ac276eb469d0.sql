-- Create family groups table
CREATE TABLE public.family_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  primary_member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  group_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create family members table
CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL REFERENCES public.family_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_type TEXT NOT NULL DEFAULT 'additional', -- 'primary' or 'additional'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'pending'
  joined_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(family_group_id, user_id)
);

-- Add family-related columns to subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS family_group_id UUID REFERENCES public.family_groups(id);
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS additional_members_count INTEGER DEFAULT 0;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS family_member_price DECIMAL(10,2) DEFAULT 50.00;

-- Enable RLS
ALTER TABLE public.family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for family_groups
CREATE POLICY "Primary members can manage their family group" 
ON public.family_groups 
FOR ALL 
USING (primary_member_id = auth.uid())
WITH CHECK (primary_member_id = auth.uid());

CREATE POLICY "Admins can manage all family groups" 
ON public.family_groups 
FOR ALL 
USING ((auth.jwt() ->> 'role') = 'admin');

-- RLS Policies for family_members
CREATE POLICY "Family members can view their group" 
ON public.family_members 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  family_group_id IN (
    SELECT id FROM public.family_groups WHERE primary_member_id = auth.uid()
  )
);

CREATE POLICY "Primary members can manage family members" 
ON public.family_members 
FOR ALL 
USING (
  family_group_id IN (
    SELECT id FROM public.family_groups WHERE primary_member_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all family members" 
ON public.family_members 
FOR ALL 
USING ((auth.jwt() ->> 'role') = 'admin');

-- Create triggers for updated_at
CREATE TRIGGER update_family_groups_updated_at
BEFORE UPDATE ON public.family_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_family_members_updated_at
BEFORE UPDATE ON public.family_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();