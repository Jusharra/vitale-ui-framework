/*
  # Add social media URLs to partners table

  1. Changes
    - Add Instagram, YouTube, TikTok, and LinkedIn URL columns to partners table
*/

-- Add social media URL columns to partners table
ALTER TABLE IF EXISTS public.partners 
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS youtube_url text,
ADD COLUMN IF NOT EXISTS tiktok_url text,
ADD COLUMN IF NOT EXISTS linkedin_url text;