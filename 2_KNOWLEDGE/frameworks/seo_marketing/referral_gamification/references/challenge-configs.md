# Challenge Configurations

## Loyalty Program
```json
{
  "program": "loyalty",
  "tiers": [
    {"name": "Bronze", "min_points": 0, "multiplier": 1.0},
    {"name": "Silver", "min_points": 500, "multiplier": 1.25},
    {"name": "Gold", "min_points": 2000, "multiplier": 1.5},
    {"name": "Platinum", "min_points": 5000, "multiplier": 2.0}
  ],
  "earning": {
    "purchase": {"points_per_dollar": 10},
    "referral": {"points": 250},
    "review": {"points": 50}
  },
  "streaks": {
    "milestones": [3, 7, 14, 30],
    "multiplier_per_day": 1.1
  }
}
```

## Referral Campaign
```json
{
  "campaign": "referral",
  "duration_days": 30,
  "rewards": {
    "referrer": {"points": 100, "per": "successful_signup"},
    "referee": {"points": 50, "on": "first_purchase"},
    "milestone_3": {"bonus": 200, "badge": "advocate"},
    "milestone_10": {"bonus": 1000, "badge": "champion"}
  },
  "leaderboard": {
    "type": "weekly",
    "prizes": [
      {"rank": 1, "reward": "$500"},
      {"rank": [2, 3], "reward": "$200"},
      {"rank": [4, 10], "reward": "$50"}
    ]
  }
}
```

## Onboarding Flow
```json
{
  "flow": "onboarding",
  "steps": [
    {"action": "complete_profile", "points": 25},
    {"action": "first_purchase", "points": 100, "badge": "first_timer"},
    {"action": "connect_social", "points": 50},
    {"action": "invite_friend", "points": 75, "badge": "networker"},
    {"action": "write_review", "points": 50, "badge": "voice"}
  ],
  "completion_bonus": {"points": 200, "badge": "onboarding_complete"}
}
```

## Rules Engine Template
```json
{
  "rules": [
    {
      "id": "purchase_points",
      "trigger": "purchase_completed",
      "condition": {"amount": {"gte": 0}},
      "action": {"type": "award_points", "formula": "amount * 10"}
    },
    {
      "id": "streak_bonus",
      "trigger": "streak_update",
      "condition": {"streak_days": {"eq": 7}},
      "action": {"type": "award_badge", "badge_id": "week_warrior"}
    },
    {
      "id": "tier_upgrade",
      "trigger": "points_updated",
      "condition": {"total_points": {"gte": 2000}},
      "action": {"type": "upgrade_tier", "new_tier": "silver"}
    }
  ]
}
```
