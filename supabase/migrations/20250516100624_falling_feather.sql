/*
  # Fix Profiles Table RLS Policies

  1. Security
    - Enable RLS on profiles table
    - Add policies for users to manage their own profiles
    - Add policy for admins to manage all profiles
  2. Automation
    - Create trigger to automatically create profiles for new users
*/

-- First, ensure RLS is enabled on profiles table
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows users to insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create a policy that allows users to select their own profile
CREATE POLICY "Users can select their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Create a policy that allows users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create a policy that allows admins to manage all profiles
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_app_meta_data->>'role', 'member')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a profile when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();