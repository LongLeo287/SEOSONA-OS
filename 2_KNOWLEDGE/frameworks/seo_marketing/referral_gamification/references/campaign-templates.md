# Campaign Templates

## Email Templates

### 1. Referral Challenge Launch
```
Subject: Earn $500 This Week - Referral Challenge Live

Hi {name},

This week only, we're running a referral leaderboard:
- Refer 1 friend → 100 points
- Refer 3 friends → 300 points + "Advocate" badge
- Refer 5+ friends → 500 points + exclusive prize

You're at #{rank} on the leaderboard.
{referrals_needed} referrals to beat {competitor}!

Your link: {referral_link}

Expires {date} at 11:59 PM.

[View Leaderboard]
```

### 2. Streak Milestone
```
Subject: You're on a {streak_days}-day streak!

Hi {name},

Amazing! +{streak_days × 50} bonus points earned!

Keep it going:
- {action} by tomorrow to extend
- Share your progress

Current: {streak_days} | Best: {best_streak}

[Continue Streak]
```

### 3. Challenge Ending
```
Subject: {hours} hours left in {challenge_name}

Hi {name},

Challenge expires soon!
- Reward: {points} points
- Progress: {progress}%
- Rank: #{rank} of {total}

[Complete Now]
```

### 4. Level Up Notification
```
Subject: You unlocked {feature}!

Hi {name},

You reached Level {level} and unlocked {feature_name}!
Only for Level {level}+ members.

{points_to_next} points to Level {next_level}.

[Explore Feature]
```

## Campaign Calendar

| Week | Focus | Mechanics | Email |
|------|-------|-----------|-------|
| 1 | Launch | Points intro | Welcome |
| 2 | Engagement | Challenges | Reminder |
| 3 | Social | Referrals | Invite |
| 4 | Retention | Streaks | Milestone |

See [challenge-configs.md](challenge-configs.md) for JSON templates.
