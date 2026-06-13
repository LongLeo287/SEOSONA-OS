-- Migration: Add survey fields to users table and migrate data from waitlist
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS what_describes_you_best TEXT,
ADD COLUMN IF NOT EXISTS what_describes_you_best_other TEXT,
ADD COLUMN IF NOT EXISTS company_size TEXT;

-- Step 2: Migrate data from waitlist to users (match by email)
-- This updates users who have a matching email in the waitlist table
-- Uses the most recent waitlist entry if multiple exist for same email
UPDATE public.users u
SET 
    what_describes_you_best = w.what_describes_you_best,
    what_describes_you_best_other = w.what_describes_you_best_other,
    company_size = w.company_size
FROM (
    SELECT DISTINCT ON (LOWER(email)) 
        LOWER(email) as email_lower,
        what_describes_you_best,
        what_describes_you_best_other,
        company_size
    FROM public.waitlist
    ORDER BY LOWER(email), created_at DESC
) w
WHERE LOWER(u.email) = w.email_lower
AND u.what_describes_you_best IS NULL;

-- Step 3: Verify migration (optional - run separately to check)
-- SELECT 
--     COUNT(*) FILTER (WHERE what_describes_you_best IS NOT NULL) as users_with_survey,
--     COUNT(*) as total_users
-- FROM public.users;











