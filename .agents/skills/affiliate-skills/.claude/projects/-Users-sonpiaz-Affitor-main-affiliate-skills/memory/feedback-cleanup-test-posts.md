---
name: feedback-cleanup-test-posts
description: Always delete test messages after verifying API works — especially Telegram, Discord, social platforms
type: feedback
---

After testing API posting (Telegram, Discord, X, LinkedIn, etc.), ALWAYS delete the test message immediately after confirming success.

**Why:** Son noticed test messages left on Telegram and Discord channels — looks unprofessional and clutters real content.

**How to apply:**
1. Send test message → verify 200 response
2. Capture message ID from response
3. Immediately call delete API with that message ID
4. Only then proceed with the real post
