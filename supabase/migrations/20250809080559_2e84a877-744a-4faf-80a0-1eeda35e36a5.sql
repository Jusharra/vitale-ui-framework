-- Add image columns for pharmacies and transports
ALTER TABLE public.pharmacies
  ADD COLUMN IF NOT EXISTS profile_image text;

ALTER TABLE public.pharmacies
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];

ALTER TABLE public.transports
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];