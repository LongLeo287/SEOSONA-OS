# Analytics Events Schema

## Core Events

### points_awarded
```yaml
user_id: string
points_amount: integer
reason: enum[purchase, referral, challenge, engagement, bonus]
multiplier: float
total_after: integer
```

### badge_earned
```yaml
user_id: string
badge_id: string
badge_category: enum[achievement, milestone, social, seasonal]
badge_rarity: enum[common, rare, epic, legendary]
```

### challenge_started / challenge_completed
```yaml
user_id: string
challenge_id: string
challenge_type: enum[daily, weekly, monthly, special]
target: integer
time_to_complete_seconds: integer  # completed only
```

### streak_updated
```yaml
user_id: string
streak_days: integer
streak_type: enum[login, purchase, engagement]
is_milestone: boolean
freeze_used: boolean
```

### tier_changed
```yaml
user_id: string
old_tier: string
new_tier: string
total_points: integer
```

### leaderboard_viewed
```yaml
user_id: string
leaderboard_type: enum[daily, weekly, monthly, alltime, friends]
user_rank: integer
```

## JavaScript Implementation

```javascript
// GA4 / Segment tracking
analytics.track('points_awarded', {
  user_id: user.id,
  points_amount: 500,
  reason: 'purchase',
  multiplier: 1.5,
  new_total: 2500
});

analytics.track('badge_earned', {
  user_id: user.id,
  badge_id: 'first_purchase',
  badge_rarity: 'common'
});

analytics.track('streak_milestone', {
  user_id: user.id,
  streak_days: 7,
  streak_type: 'login'
});
```

## Dashboard KPIs

- **Top Level:** engagement_lift, retention_rate, conversion_lift, revenue_impact
- **Feature:** points_daily, badge_earn_rate, challenge_completion, leaderboard_views
- **Risk:** churn_rate, over_engagement, negative_feedback
