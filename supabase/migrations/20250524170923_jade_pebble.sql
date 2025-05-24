/*
  # Create blog posts table

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `slug` (text, unique, not null)
      - `content` (text, not null)
      - `excerpt` (text)
      - `featured_image` (text)
      - `author_id` (uuid, references auth.users)
      - `category` (text)
      - `status` (text, not null)
      - `meta_title` (text)
      - `meta_description` (text)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `published_at` (timestamptz)
  
  2. Security
    - Enable RLS on `blog_posts` table
    - Add policy for admins to manage blog posts
    - Add policy for public to view published blog posts
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  author_id uuid REFERENCES auth.users(id),
  category text,
  status text NOT NULL DEFAULT 'draft',
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage all blog posts
CREATE POLICY "Admins can manage all blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING ((jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((jwt() ->> 'role'::text) = 'admin'::text);

-- Create policy for public to view published blog posts
CREATE POLICY "Public can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO public
  USING (status = 'published');

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_blog_posts_updated_at();