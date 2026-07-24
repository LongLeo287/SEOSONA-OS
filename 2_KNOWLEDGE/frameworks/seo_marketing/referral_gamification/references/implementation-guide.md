# Implementation Guide

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │────▶│  API Layer   │────▶│  Engine     │
│  (Web/App)  │     │  (REST/WS)   │     │  (Rules)    │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                    │
                    ┌──────▼──────┐      ┌──────▼──────┐
                    │   Cache     │      │  Database   │
                    │   (Redis)   │      │  (Postgres) │
                    └─────────────┘      └─────────────┘
```

## API Endpoints

```
POST /api/gamification/action
Body: { "action": "purchase", "amount": 50 }
Response: { "points_earned": 500, "new_total": 2500, "badges_earned": [] }

GET /api/gamification/status
Response: { "points": 2500, "tier": "silver", "streak": 7, "badges": [...] }

GET /api/gamification/leaderboard?type=weekly&limit=10
Response: { "leaderboard": [...], "user_rank": 15 }

POST /api/gamification/challenge/join
Body: { "challenge_id": "weekly_spender" }
Response: { "joined": true, "target": 5, "expires_at": "..." }
```

## Caching Strategy (Redis)

```
# User status (TTL: 5 min)
user:{id}:status → { points, tier, streak }

# Leaderboard (TTL: 1 min top 100)
leaderboard:weekly → sorted set

# Rate limiting
user:{id}:actions:{type}:count → daily count
```

## Scaling Checklist

- [ ] Database: Connection pooling, read replicas
- [ ] Cache: Redis cluster, TTL optimization
- [ ] API: Rate limiting (100 req/sec/user)
- [ ] Batch: Leaderboard refresh off-peak
- [ ] Queue: Async notifications
- [ ] Monitoring: Anomaly alerts

See [database-schema.md](database-schema.md) for SQL schemas.
