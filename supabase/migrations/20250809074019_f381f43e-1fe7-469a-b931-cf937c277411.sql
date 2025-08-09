-- Add feature image support for pharmacies and transports
-- Safe, idempotent migration
ALTER TABLE public.pharmacies
  ADD COLUMN IF NOT EXISTS profile_image text,
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];

ALTER TABLE public.transports
  ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}'::text[];