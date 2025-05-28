/*
  # Add email notification status to placement requests

  1. Changes
    - Add `notification_sent` status to placement_requests status check constraint
    - Add `email_sent` boolean column to track email notification status
*/

-- Add notification_sent to the status check constraint
DO $$ 
BEGIN
  -- Check if the constraint exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'placement_requests_status_check'
  ) THEN
    -- Drop the existing constraint
    ALTER TABLE placement_requests DROP CONSTRAINT IF EXISTS placement_requests_status_check;
  END IF;
  
  -- Add the new constraint with the additional status
  ALTER TABLE placement_requests 
    ADD CONSTRAINT placement_requests_status_check 
    CHECK (status IN ('new', 'in_progress', 'completed', 'cancelled', 'notification_sent'));
END $$;

-- Add email_sent column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'placement_requests' AND column_name = 'email_sent'
  ) THEN
    ALTER TABLE placement_requests ADD COLUMN email_sent BOOLEAN DEFAULT FALSE;
  END IF;
END $$;