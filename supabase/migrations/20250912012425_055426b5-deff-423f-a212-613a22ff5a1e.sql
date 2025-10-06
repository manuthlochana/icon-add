-- Create the complete schema for the portfolio website

-- Skills table
CREATE TABLE public.skills (
  id bigserial PRIMARY KEY,
  category text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Projects table  
CREATE TABLE public.projects (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  description text,
  technologies text[],
  link text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Education table
CREATE TABLE public.education (
  id bigserial PRIMARY KEY,
  course text NOT NULL,
  status text NOT NULL,
  institution text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE public.messages (
  id bigserial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Contacts table
CREATE TABLE public.contacts (
  id bigserial PRIMARY KEY,
  platform text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Profiles table for user management
CREATE TABLE public.profiles (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'user',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-pictures', 'profile-pictures', true);

-- RLS Policies for Skills
CREATE POLICY "Allow public read access to skills" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage skills" ON public.skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Projects
CREATE POLICY "Allow public read access to projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Education
CREATE POLICY "Allow public read access to education" ON public.education
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage education" ON public.education
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Messages
CREATE POLICY "Allow public message submission" ON public.messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view messages" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can delete messages" ON public.messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Contacts
CREATE POLICY "Allow public read access to contacts" ON public.contacts
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage contacts" ON public.contacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage policies for profile pictures
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-pictures');

CREATE POLICY "Admin can upload avatars" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile-pictures' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can update avatars" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile-pictures' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin can delete avatars" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-pictures' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial data for skills
INSERT INTO public.skills (category, name) VALUES
  ('Programming', 'Python'),
  ('Programming', 'JavaScript'),
  ('Programming', 'TypeScript'),
  ('Programming', 'Java'),
  ('Programming', 'C++'),
  ('Frameworks', 'React'),
  ('Frameworks', 'Node.js'),
  ('Frameworks', 'Express.js'),
  ('Frameworks', 'FastAPI'),
  ('Frameworks', 'Django'),
  ('Databases', 'PostgreSQL'),
  ('Databases', 'MongoDB'),
  ('Databases', 'MySQL'),
  ('Databases', 'Redis'),
  ('AI & ML', 'TensorFlow'),
  ('AI & ML', 'PyTorch'),
  ('AI & ML', 'Scikit-learn'),
  ('AI & ML', 'OpenAI API'),
  ('AI & ML', 'Langchain'),
  ('Cybersecurity', 'Network Security'),
  ('Cybersecurity', 'Penetration Testing'),
  ('Cybersecurity', 'Security Auditing'),
  ('Creative Tools', 'After Effects'),
  ('Creative Tools', 'Premiere Pro'),
  ('Creative Tools', 'Photoshop'),
  ('Creative Tools', 'Figma');

-- Insert initial data for projects
INSERT INTO public.projects (title, description, technologies, link) VALUES
  ('AI Personal Assistant', 'An intelligent chatbot powered by advanced AI that can help with various tasks, answer questions, and provide personalized assistance.', ARRAY['Python', 'OpenAI API', 'FastAPI', 'React'], 'https://github.com/manuthlochana'),
  ('Simple Chat App', 'A real-time messaging application with modern UI/UX design, featuring instant messaging, user authentication, and responsive design.', ARRAY['React', 'Node.js', 'Socket.io', 'MongoDB'], 'https://github.com/manuthlochana'),
  ('After Effects Motion Pack', 'A collection of professional motion graphics templates and animations for video production and creative projects.', ARRAY['After Effects', 'JavaScript', 'Motion Graphics'], 'https://github.com/manuthlochana'),
  ('Thunder Storm Studio Works', 'Portfolio showcasing various creative and technical projects including web development, AI applications, and multimedia content.', ARRAY['React', 'TypeScript', 'Creative Suite'], 'https://github.com/manuthlochana');

-- Insert initial data for education
INSERT INTO public.education (course, status, institution, description) VALUES
  ('Bachelor of Information Technology', 'Completed', 'University of Technology', 'Comprehensive study of software development, database systems, and network technologies.'),
  ('AI & Machine Learning Certification', 'In Progress', 'Stanford Online', 'Advanced coursework in artificial intelligence, deep learning, and neural networks.'),
  ('Cybersecurity Fundamentals', 'Completed', 'CISSP Institute', 'Foundation course covering network security, threat analysis, and security protocols.'),
  ('Full Stack Web Development', 'Completed', 'FreeCodeCamp', 'Intensive bootcamp covering modern web technologies and development practices.');

-- Insert initial data for contacts
INSERT INTO public.contacts (platform, value) VALUES
  ('LinkedIn', 'https://linkedin.com/in/manuthlochana'),
  ('GitHub', 'https://github.com/manuthlochana'),
  ('Email', 'hello@manuthlochana.dev');