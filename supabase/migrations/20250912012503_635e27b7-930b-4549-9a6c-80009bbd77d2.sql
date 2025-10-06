-- Only add missing pieces to existing schema

-- Update projects table to add missing columns
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS technologies text[],
ADD COLUMN IF NOT EXISTS link text;

-- Insert initial data only if tables are empty
INSERT INTO public.skills (category, name) 
SELECT * FROM (VALUES
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
  ('Creative Tools', 'Figma')
) AS v(category, name)
WHERE NOT EXISTS (SELECT 1 FROM public.skills LIMIT 1);

-- Insert initial projects data
INSERT INTO public.projects (title, description, technologies, link) 
SELECT * FROM (VALUES
  ('AI Personal Assistant', 'An intelligent chatbot powered by advanced AI that can help with various tasks, answer questions, and provide personalized assistance.', ARRAY['Python', 'OpenAI API', 'FastAPI', 'React'], 'https://github.com/manuthlochana'),
  ('Simple Chat App', 'A real-time messaging application with modern UI/UX design, featuring instant messaging, user authentication, and responsive design.', ARRAY['React', 'Node.js', 'Socket.io', 'MongoDB'], 'https://github.com/manuthlochana'),
  ('After Effects Motion Pack', 'A collection of professional motion graphics templates and animations for video production and creative projects.', ARRAY['After Effects', 'JavaScript', 'Motion Graphics'], 'https://github.com/manuthlochana'),
  ('Thunder Storm Studio Works', 'Portfolio showcasing various creative and technical projects including web development, AI applications, and multimedia content.', ARRAY['React', 'TypeScript', 'Creative Suite'], 'https://github.com/manuthlochana')
) AS v(title, description, technologies, link)
WHERE NOT EXISTS (SELECT 1 FROM public.projects LIMIT 1);

-- Insert initial education data
INSERT INTO public.education (course, status, institution, description) 
SELECT * FROM (VALUES
  ('Bachelor of Information Technology', 'Completed', 'University of Technology', 'Comprehensive study of software development, database systems, and network technologies.'),
  ('AI & Machine Learning Certification', 'In Progress', 'Stanford Online', 'Advanced coursework in artificial intelligence, deep learning, and neural networks.'),
  ('Cybersecurity Fundamentals', 'Completed', 'CISSP Institute', 'Foundation course covering network security, threat analysis, and security protocols.'),
  ('Full Stack Web Development', 'Completed', 'FreeCodeCamp', 'Intensive bootcamp covering modern web technologies and development practices.')
) AS v(course, status, institution, description)
WHERE NOT EXISTS (SELECT 1 FROM public.education LIMIT 1);

-- Insert initial contacts data
INSERT INTO public.contacts (platform, value) 
SELECT * FROM (VALUES
  ('LinkedIn', 'https://linkedin.com/in/manuthlochana'),
  ('GitHub', 'https://github.com/manuthlochana'),
  ('Email', 'hello@manuthlochana.dev')
) AS v(platform, value)
WHERE NOT EXISTS (SELECT 1 FROM public.contacts LIMIT 1);