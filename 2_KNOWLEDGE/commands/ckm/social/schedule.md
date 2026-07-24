---
description: 💡 Schedule social media posts
argument-hint: [period]
---

Create a social media schedule for optimal posting times.

<period>$ARGUMENTS</period>

## Periods
- `week` - Weekly schedule
- `month` - Monthly content calendar
- `campaign [name]` - Campaign-specific schedule

## Workflow

1. **Gather Content**
   - Scan `content/social/` for pending posts
   - If empty, ask user for content topics

2. **Timing Analysis**
   - Use `social-media-manager` agent for optimal times
   - Activate `social-media` skill for platform data
   - Consider:
     - Platform peak hours
     - Audience timezone
     - Content type best times

3. **Create Schedule**
   - Distribute content across period
   - Balance platform coverage
   - Avoid posting conflicts
   - Generate calendar view

4. **Output**
   - Schedule → `assets/posts/schedule-{period}.md`
   - Calendar export (if needed)

## Agents Used
- `social-media-manager` - Scheduling strategy

## Skills Used
- `social-media` - Platform timing data
- `assets-organizing` - Standardized output paths

## Output
- Schedule → `assets/posts/schedule-{period}.md`
- Calendar → `assets/posts/calendar-{period}.md`

## Examples
```
/social/schedule week
/social/schedule month
/social/schedule campaign "Product Launch"
```
