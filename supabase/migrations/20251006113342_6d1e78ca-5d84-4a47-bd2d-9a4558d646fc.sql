-- Add username column to contacts table
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS username text;

-- Update existing records to extract username from value for common platforms
UPDATE contacts 
SET username = CASE 
  WHEN platform = 'LinkedIn' THEN 'manuthlochana'
  WHEN platform = 'GitHub' THEN 'manuthlochana'
  WHEN platform = 'Email' THEN value
  ELSE value
END
WHERE username IS NULL;