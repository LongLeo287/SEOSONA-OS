-- Migration: Add onboarding survey fields to users table
-- Run this in Supabase SQL Editor

-- Add new columns for onboarding data
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_referral TEXT,
ADD COLUMN IF NOT EXISTS primary_coding_agent TEXT,
ADD COLUMN IF NOT EXISTS primary_coding_agent_other TEXT,
ADD COLUMN IF NOT EXISTS onboarding_industry TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Create index for filtering users by onboarding completion
CREATE INDEX IF NOT EXISTS idx_users_onboarding_completed_at 
ON public.users (onboarding_completed_at);

-- Create index for analytics queries by survey fields
CREATE INDEX IF NOT EXISTS idx_users_primary_coding_agent 
ON public.users (primary_coding_agent);

CREATE INDEX IF NOT EXISTS idx_users_onboarding_industry 
ON public.users (onboarding_industry);

CREATE INDEX IF NOT EXISTS idx_users_onboarding_referral 
ON public.users (onboarding_referral);

