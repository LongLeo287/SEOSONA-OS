-- Migration: Add banner image URLs and CTA URL to announcement_campaigns
-- Run this in Supabase SQL Editor

-- Add banner image URL (light theme)
ALTER TABLE announcement_campaigns 
ADD COLUMN IF NOT EXISTS banner_image_url TEXT;

-- Add banner image URL (dark theme, optional - falls back to light)
ALTER TABLE announcement_campaigns 
ADD COLUMN IF NOT EXISTS banner_image_url_dark TEXT;

-- Add CTA URL - where "Let's go" button leads
ALTER TABLE announcement_campaigns 
ADD COLUMN IF NOT EXISTS cta_url TEXT;

-- Optional: Update existing campaigns with default Canvas URLs
-- UPDATE announcement_campaigns 
-- SET 
--     banner_image_url = '/canvas-announcement/banner-light.webp',
--     banner_image_url_dark = '/canvas-announcement/banner-dark.webp',
--     cta_url = '/canvas'
-- WHERE banner_image_url IS NULL;

