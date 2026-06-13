-- Migration: Create search_queries table for recording UI and API search events
-- Run this manually in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.search_queries (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  query     text        NOT NULL,
  -- 'ui' = command-menu / community search bar
  -- 'api' = external REST API (/api/search)
  source    text        NOT NULL DEFAULT 'ui',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_search_queries_created_at ON public.search_queries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_queries_source     ON public.search_queries (source);

ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can insert
CREATE POLICY "Allow anonymous insert"
  ON public.search_queries
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read
CREATE POLICY "Allow admin read"
  ON public.search_queries
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.users
      WHERE id = auth.uid()::text
        AND is_admin = true
    )
  );
