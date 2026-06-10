# Database Schema (PostgreSQL)

## Core Tables

```sql
-- Users & Points
CREATE TABLE user_gamification (
  user_id UUID PRIMARY KEY,
  total_points INT DEFAULT 0,
  current_tier VARCHAR(20) DEFAULT 'bronze',
  streak_days INT DEFAULT 0,
  streak_last_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_user_tier ON user_gamification(current_tier);
CREATE INDEX idx_user_points ON user_gamification(total_points DESC);

-- Point Transactions
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_gamification(user_id),
  points INT NOT NULL,
  reason VARCHAR(50) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_tx_user ON point_transactions(user_id, created_at DESC);

-- Badges
CREATE TABLE user_badges (
  user_id UUID REFERENCES user_gamification(user_id),
  badge_id VARCHAR(50) NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Challenges
CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_gamification(user_id),
  challenge_id VARCHAR(50) NOT NULL,
  progress INT DEFAULT 0,
  target INT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  expires_at TIMESTAMP,
  completed_at TIMESTAMP
);
CREATE INDEX idx_challenge_user ON user_challenges(user_id, status);
```

## Leaderboard View

```sql
-- Materialized for performance (refresh hourly)
CREATE MATERIALIZED VIEW leaderboard_weekly AS
SELECT
  user_id,
  SUM(points) as weekly_points,
  RANK() OVER (ORDER BY SUM(points) DESC) as rank
FROM point_transactions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY user_id;

CREATE UNIQUE INDEX idx_lb_user ON leaderboard_weekly(user_id);
CREATE INDEX idx_lb_rank ON leaderboard_weekly(rank);
```

## Badge Definitions

```sql
CREATE TABLE badge_definitions (
  badge_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(30), -- achievement, milestone, social, seasonal
  rarity VARCHAR(20), -- common, rare, epic, legendary
  icon_url VARCHAR(255),
  unlock_condition JSONB
);
```

## Tier Definitions

```sql
CREATE TABLE tier_definitions (
  tier_id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  min_points INT NOT NULL,
  multiplier DECIMAL(3,2) DEFAULT 1.0,
  benefits JSONB
);

INSERT INTO tier_definitions VALUES
('bronze', 'Bronze', 0, 1.0, '{"free_shipping": false}'),
('silver', 'Silver', 500, 1.25, '{"free_shipping": true}'),
('gold', 'Gold', 2000, 1.5, '{"free_shipping": true, "priority_support": true}'),
('platinum', 'Platinum', 5000, 2.0, '{"free_shipping": true, "priority_support": true, "exclusive_events": true}');
```
