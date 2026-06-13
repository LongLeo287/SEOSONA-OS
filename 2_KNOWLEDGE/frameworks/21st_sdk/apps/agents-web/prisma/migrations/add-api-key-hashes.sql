CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.api_keys
  ADD COLUMN IF NOT EXISTS key_hash text,
  ADD COLUMN IF NOT EXISTS key_prefix text;

ALTER TABLE public.an_api_keys
  ADD COLUMN IF NOT EXISTS key_hash text,
  ADD COLUMN IF NOT EXISTS key_prefix text;

ALTER TABLE public.api_keys
  ALTER COLUMN key DROP NOT NULL;

ALTER TABLE public.an_api_keys
  ALTER COLUMN key DROP NOT NULL;

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS api_keys_key_hash_key
  ON public.api_keys USING btree (key_hash);

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS an_api_keys_key_hash_key
  ON public.an_api_keys USING btree (key_hash);

CREATE OR REPLACE FUNCTION public.create_api_key(
  user_id text,
  plan public.api_plan DEFAULT 'free'::public.api_plan,
  requests_limit integer DEFAULT 1000
)
RETURNS public.api_keys
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  raw_key text;
  created_key public.api_keys;
BEGIN
  raw_key := encode(gen_random_bytes(32), 'hex');

  INSERT INTO public.api_keys (
    key,
    key_hash,
    key_prefix,
    user_id,
    plan,
    requests_limit
  )
  VALUES (
    raw_key,
    encode(digest(raw_key, 'sha256'), 'hex'),
    left(raw_key, 12),
    $1,
    COALESCE($2, 'free'::public.api_plan),
    COALESCE($3, 1000)
  )
  RETURNING * INTO created_key;

  RETURN created_key;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_api_key(api_key text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  key_row public.api_keys;
  next_count integer;
  remaining integer;
BEGIN
  SELECT *
  INTO key_row
  FROM public.api_keys
  WHERE key_hash = encode(digest(api_key, 'sha256'), 'hex')
     OR key = api_key
  LIMIT 1;

  IF key_row.id IS NULL THEN
    RETURN json_build_object('valid', false, 'error', 'Invalid API key');
  END IF;

  IF key_row.is_active IS FALSE THEN
    RETURN json_build_object('valid', false, 'error', 'API key is inactive');
  END IF;

  IF key_row.expires_at IS NOT NULL AND key_row.expires_at < now() THEN
    RETURN json_build_object('valid', false, 'error', 'API key has expired');
  END IF;

  IF COALESCE(key_row.requests_count, 0) >= COALESCE(key_row.requests_limit, 1000) THEN
    RETURN json_build_object('valid', false, 'error', 'API usage limit exceeded');
  END IF;

  next_count := COALESCE(key_row.requests_count, 0) + 1;
  remaining := GREATEST(COALESCE(key_row.requests_limit, 1000) - next_count, 0);

  UPDATE public.api_keys
  SET
    last_used_at = now(),
    requests_count = next_count
  WHERE id = key_row.id;

  RETURN json_build_object(
    'valid', true,
    'api_key_id', key_row.id,
    'user_id', key_row.user_id,
    'team_id', key_row.team_id,
    'plan', COALESCE(key_row.plan::text, 'free'),
    'requests_remaining', remaining
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.check_api_key_v2(api_key text)
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.check_api_key(api_key);
$$;
