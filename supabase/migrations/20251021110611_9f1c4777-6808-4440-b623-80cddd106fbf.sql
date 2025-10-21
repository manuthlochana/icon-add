-- Fix critical security issues: Implement proper role-based access control
-- Fixed version that handles storage policy dependencies

-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Create user_roles table (separate from profiles to avoid recursion)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create SECURITY DEFINER function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Migrate existing admin users from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'admin'::app_role
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Drop old RLS policies that query profiles table
DROP POLICY IF EXISTS "Admin can manage projects" ON public.projects;
DROP POLICY IF EXISTS "Admin can manage skills" ON public.skills;
DROP POLICY IF EXISTS "Admin can manage skill categories" ON public.skill_categories;
DROP POLICY IF EXISTS "Admin can manage education" ON public.education;
DROP POLICY IF EXISTS "Admin can manage contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admin can view messages" ON public.messages;
DROP POLICY IF EXISTS "Admin can delete messages" ON public.messages;

-- 7. Drop storage policies that depend on profiles.role column
DROP POLICY IF EXISTS "Admin can upload profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete profile pictures" ON storage.objects;

-- 8. Create new RLS policies using has_role function
CREATE POLICY "Admin can manage projects" ON public.projects
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage skills" ON public.skills
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage skill categories" ON public.skill_categories
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage education" ON public.education
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can manage contacts" ON public.contacts
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can view messages" ON public.messages
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can delete messages" ON public.messages
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 9. Recreate storage policies using has_role function
CREATE POLICY "Admin can upload profile pictures" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-pictures' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin can update profile pictures" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'profile-pictures' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admin can delete profile pictures" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-pictures' AND
  public.has_role(auth.uid(), 'admin')
);

-- 10. Add proper UPDATE and DELETE policies to profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Prevent profile deletion by regular users
CREATE POLICY "Only admins can delete profiles" ON public.profiles
FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- 11. Restrict access to user_roles table (only admins can view)
CREATE POLICY "Only admins can view roles" ON public.user_roles
FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- No INSERT/UPDATE/DELETE policies - only database admins should modify roles manually

-- 12. Remove role column from profiles table (no longer needed)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- 13. Update the handle_new_user function to not set role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$function$;