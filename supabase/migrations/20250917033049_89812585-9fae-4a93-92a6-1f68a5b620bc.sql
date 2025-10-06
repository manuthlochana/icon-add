-- Add icon columns to existing tables
ALTER TABLE public.skills ADD COLUMN icon TEXT;
ALTER TABLE public.contacts ADD COLUMN icon TEXT;

-- Create categories table for skill categories management
CREATE TABLE public.skill_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for skill_categories
CREATE POLICY "Admin can manage skill categories" 
ON public.skill_categories 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Allow public read access to skill categories" 
ON public.skill_categories 
FOR SELECT 
USING (true);

-- Insert default categories
INSERT INTO public.skill_categories (name, icon, display_order) VALUES 
('Programming', 'Code', 1),
('Frameworks', 'Layers', 2),
('Databases', 'Database', 3),
('AI & ML', 'Brain', 4),
('Cybersecurity', 'Shield', 5),
('Creative Tools', 'Palette', 6);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for skill_categories
CREATE TRIGGER update_skill_categories_updated_at
    BEFORE UPDATE ON public.skill_categories
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();