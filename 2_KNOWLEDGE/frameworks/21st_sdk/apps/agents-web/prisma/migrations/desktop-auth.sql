-- Desktop authentication tables for Electron app OAuth-like flow

-- One-time auth codes (short-lived, for deep link transfer)
CREATE TABLE IF NOT EXISTS desktop_auth_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_desktop_auth_codes_code ON desktop_auth_codes(code);
CREATE INDEX IF NOT EXISTS idx_desktop_auth_codes_user_id ON desktop_auth_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_desktop_auth_codes_expires_at ON desktop_auth_codes(expires_at);

-- Desktop sessions (long-lived tokens)
CREATE TABLE IF NOT EXISTS desktop_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(64) UNIQUE NOT NULL,
    refresh_token VARCHAR(64) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ,
    device_info TEXT,
    revoked_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_desktop_sessions_user_id ON desktop_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_desktop_sessions_token ON desktop_sessions(token);
CREATE INDEX IF NOT EXISTS idx_desktop_sessions_refresh_token ON desktop_sessions(refresh_token);
CREATE INDEX IF NOT EXISTS idx_desktop_sessions_expires_at ON desktop_sessions(expires_at);

-- Cleanup function for expired auth codes
CREATE OR REPLACE FUNCTION cleanup_expired_desktop_auth_codes()
RETURNS void AS $$
BEGIN
    DELETE FROM desktop_auth_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
