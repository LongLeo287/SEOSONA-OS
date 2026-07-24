---
description: Check Marketing Dashboard server status
argument-hint: []
---

# Command: /dashboard:check

Verify the status of Marketing Dashboard servers.

## Description

Checks if the Marketing Dashboard frontend and backend servers are running and healthy. Useful for troubleshooting before running `/dashboard`.

## Usage

```bash
/dashboard:check
```

## Workflow

### Step 1: Check Backend Server (Port 3457)

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3457/health 2>/dev/null || echo "offline"
```

**Expected responses:**
- `200` → Backend running and healthy
- `offline` → Backend not running

### Step 2: Check Frontend Server (Port 5173)

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173 2>/dev/null || echo "offline"
```

**Expected responses:**
- `200` → Frontend running (dev mode)
- `offline` → Frontend not running (or production mode serving from backend)

### Step 3: Check Process Status

```bash
# Check for running node processes
pgrep -fl "node.*marketing-dashboard" 2>/dev/null || echo "no processes"
```

### Step 4: Report Status

Generate status table:

| Component | Port | Status | URL |
|-----------|------|--------|-----|
| Backend API | 3457 | {status} | http://localhost:3457 |
| Frontend | 5173 | {status} | http://localhost:5173 |
| Health | 3457 | {status} | http://localhost:3457/health |

### Step 5: Provide Recommendations

**If offline:**
```
Dashboard is not running.

To start: /dashboard
To start manually:
  cd .claude/skills/marketing-dashboard
  ./start.sh
```

**If running:**
```
Dashboard is healthy!

Frontend: http://localhost:5173
API: http://localhost:3457

To stop: /dashboard stop
```

## Output Example

```
Dashboard Status Check
━━━━━━━━━━━━━━━━━━━━━━

Backend API (3457):  ● Online
Frontend (5173):     ● Online
Health Check:        ● Healthy

Access: http://localhost:5173
```

## Related Commands

- `/dashboard` - Start the dashboard
- `/dashboard stop` - Stop all servers
- `/dashboard build` - Build for production
