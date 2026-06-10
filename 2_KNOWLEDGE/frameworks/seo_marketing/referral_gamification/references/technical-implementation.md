# Technical Implementation

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  referral_code VARCHAR(14) UNIQUE,
  referred_by_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_referral_code ON users(referral_code);
```

### Referrals Table
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrer_id UUID REFERENCES users(id),
  referee_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, converted, paid
  reward_amount DECIMAL(10,2),
  conversion_timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_referrer ON referrals(referrer_id);
```

### Tracking Table
```sql
CREATE TABLE referral_clicks (
  id UUID PRIMARY KEY,
  referral_code VARCHAR(14),
  ip_address INET,
  device_fingerprint VARCHAR(255),
  click_timestamp TIMESTAMP DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE
);
```

## API Endpoints

```
POST /api/referrals/generate
  → { referral_code, referral_url, share_urls }

GET /api/users/:id/referrals
  → { referrals: [], stats: { total, converted, pending } }

POST /api/referrals/apply
  Body: { referral_code, email }
  → { success, message, discount_applied }

POST /api/referrals/:id/convert
  → { success, reward_issued }
```

## Referral Code Generation

```javascript
// Generate unique 10-char alphanumeric code
function generateReferralCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
```

## Attribution Tracking

**Cookie-Based (Web):**
```javascript
// On referral link click
const urlParams = new URLSearchParams(window.location.search);
const refCode = urlParams.get('ref');
if (refCode) {
  document.cookie = `ref=${refCode}; max-age=${90*24*60*60}; path=/`;
}
```

**Attribution Window:** 30-90 days typical (longer for enterprise sales cycles)

## URL Patterns

- Direct: `https://app.com?ref=ABC123`
- UTM: `?utm_source=referral&utm_campaign=user123`
- Subdomain: `https://invite.app.com/ABC123`

## Mobile Considerations

- **Android:** Play Install Referrer API
- **iOS:** SKAdNetwork (privacy-limited)
- **Deep linking:** Firebase Dynamic Links for deferred attribution
