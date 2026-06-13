-- Announcement Campaigns System Migration
-- Run this in Supabase SQL Editor

-- Create enum for announcement event types
CREATE TYPE announcement_event_type AS ENUM (
    'shown',
    'clicked_lets_go',
    'clicked_remind_later',
    'closed'
);

-- Create announcement_campaigns table
CREATE TABLE announcement_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 0,
    -- Banner image URLs
    banner_image_url TEXT,           -- Light theme image URL
    banner_image_url_dark TEXT,      -- Dark theme image URL (optional, falls back to light)
    -- CTA (Call To Action) URL - where "Let's go" button leads
    cta_url TEXT,
    -- Targeting
    target_pages TEXT[] NOT NULL DEFAULT '{}',
    target_roles TEXT[] NOT NULL DEFAULT '{}',
    target_plans TEXT[] NOT NULL DEFAULT '{}',
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- If table already exists, add columns:
-- ALTER TABLE announcement_campaigns ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
-- ALTER TABLE announcement_campaigns ADD COLUMN IF NOT EXISTS banner_image_url_dark TEXT;
-- ALTER TABLE announcement_campaigns ADD COLUMN IF NOT EXISTS cta_url TEXT;

-- Create announcement_messages table
CREATE TABLE announcement_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES announcement_campaigns(id) ON DELETE CASCADE,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create announcement_events table
CREATE TABLE announcement_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    campaign_id UUID NOT NULL REFERENCES announcement_campaigns(id) ON DELETE CASCADE,
    event_type announcement_event_type NOT NULL,
    page_source TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for announcement_campaigns
CREATE INDEX idx_announcement_campaigns_is_active ON announcement_campaigns(is_active);
CREATE INDEX idx_announcement_campaigns_priority ON announcement_campaigns(priority DESC);
CREATE INDEX idx_announcement_campaigns_dates ON announcement_campaigns(starts_at, ends_at);

-- Indexes for announcement_messages
CREATE INDEX idx_announcement_messages_campaign_id ON announcement_messages(campaign_id);
CREATE INDEX idx_announcement_messages_sort_order ON announcement_messages(sort_order);

-- Indexes for announcement_events
CREATE INDEX idx_announcement_events_user_id ON announcement_events(user_id);
CREATE INDEX idx_announcement_events_campaign_id ON announcement_events(campaign_id);
CREATE INDEX idx_announcement_events_event_type ON announcement_events(event_type);
CREATE INDEX idx_announcement_events_created_at ON announcement_events(created_at DESC);
CREATE INDEX idx_announcement_events_campaign_event ON announcement_events(campaign_id, event_type);

-- Updated_at trigger for campaigns
CREATE OR REPLACE FUNCTION update_announcement_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_announcement_campaigns_updated_at
    BEFORE UPDATE ON announcement_campaigns
    FOR EACH ROW
    EXECUTE FUNCTION update_announcement_campaigns_updated_at();

-- =====================================================
-- Campaign 1: Magic Chat users
-- Shows: Magic Chat upgrade + common messages
-- =====================================================
INSERT INTO announcement_campaigns (id, name, description, is_active, priority, target_pages, target_roles, target_plans)
VALUES (
    gen_random_uuid(),
    'Introducing Canvas',
    'Visual frontend development where each frame is a branch. Build on your real codebase with AI that understands your patterns.',
    true,
    100,
    ARRAY['magic-chat'],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[]
);

DO $$
DECLARE
    campaign_uuid UUID;
BEGIN
    SELECT id INTO campaign_uuid FROM announcement_campaigns WHERE name = 'Introducing Canvas' AND 'magic-chat' = ANY(target_pages) LIMIT 1;
    
    -- 1. Magic Chat upgrade message (unique to magic-chat)
    INSERT INTO announcement_messages (campaign_id, icon, title, description, sort_order)
    VALUES (
        campaign_uuid,
        'MagicChatPlusIcon',
        'Magic Chat, but way more powerful',
        'Create multiple component ideas side by side, or connect your GitHub repo and work directly on your real codebase',
        0
    );
    
    -- 2. AI-powered design research
    INSERT INTO announcement_messages (campaign_id, icon, title, description, sort_order)
    VALUES (
        campaign_uuid,
        'AIResearchIcon',
        'AI-powered design research',
        'AI studies your favorite apps and 21st components to suggest implementations that match your taste',
        1
    );
    
    -- 3. Everyone can contribute
    INSERT INTO announcement_messages (campaign_id, icon, title, description, sort_order)
    VALUES (
        campaign_uuid,
        'ContributeIcon',
        'Everyone can contribute',
        'Non-technical teammates can make changes and create PRs - engineers just review and merge',
        2
    );
    
    -- 4. Each frame is a branch
    INSERT INTO announcement_messages (campaign_id, icon, title, description, sort_order)
    VALUES (
        campaign_uuid,
        'BranchIcon',
        'Each frame is a branch',
        'Work on your actual repository - each variant becomes a local branch with a live preview',
        3
    );
END $$;

-- =====================================================
-- Campaign 2: Community users
-- Shows: Share live previews + common messages
-- =====================================================
INSERT INTO announcement_campaigns (id, name, description, is_active, priority, target_pages, target_roles, target_plans)
VALUES (
    gen_random_uuid(),
    'Introducing Canvas',
    'Visual frontend development where each frame is a branch. Build on your real codebase with AI that understands your patterns.',
    true,
    100,
    ARRAY['community'],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[]
);

DO $$
DECLARE
    campaign_uuid UUID;
BEGIN
    SELECT id INTO campaign_uuid FROM announcement_campaigns WHERE name = 'Introducing Canvas' AND 'community' = ANY(target_pages) LIMIT 1;
    
    -- 1. AI-powered design research
    INSERT INTO announcement_messages (campaign_id, icon, title, description, sort_order)
    VALUES (
        campaign_uuid,
        'AIResearchIcon',
        'AI-powered design research',
        'AI studies your favorite apps and 21st components to suggest implementations that match your taste',
        0
    );
    
    -- 2. Everyone can contribute
    INSERT INTO announcement_messages (campaign_id, icon, title, description, sort_order)
    VALUES (
        campaign_uuid,
        'ContributeIcon',
        'Everyone can contribute',
        'Non-technical teammates can make changes and create PRs - engineers just review and merge',
        1
    );
    
    -- 3. Share live previews (unique to community)
    INSERT INTO announcement_messages (campaign_id, icon, title, description, sort_order)
    VALUES (
        campaign_uuid,
        'LinkIcon',
        'Share live previews',
        'Share preview links with colleagues and clients instantly - no deployment needed',
        2
    );
    
    -- 4. Each frame is a branch
    INSERT INTO announcement_messages (campaign_id, icon, title, description, sort_order)
    VALUES (
        campaign_uuid,
        'BranchIcon',
        'Each frame is a branch',
        'Work on your actual repository - each variant becomes a local branch with a live preview',
        3
    );
END $$;

-- Grant necessary permissions (adjust based on your RLS setup)
-- ALTER TABLE announcement_campaigns ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE announcement_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE announcement_events ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Anyone can read active campaigns" ON announcement_campaigns
--     FOR SELECT USING (is_active = true);

-- CREATE POLICY "Anyone can read campaign messages" ON announcement_messages
--     FOR SELECT USING (true);

-- CREATE POLICY "Users can insert their own events" ON announcement_events
--     FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Admins can manage all" ON announcement_campaigns
--     FOR ALL USING (
--         EXISTS (SELECT 1 FROM users WHERE id = auth.uid()::text AND is_admin = true)
--     );

