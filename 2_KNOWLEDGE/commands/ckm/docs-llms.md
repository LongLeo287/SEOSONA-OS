---
description: 💡💡💡 Generate llms.txt based on the current codebase
argument-hint: [additional-prompts]
---

Read and analyze `docs/` directory as the source of truth for documentation.
Generate `llms.txt` file following this format example: https://docs.polar.sh/llms.txt
Put it in the public directory so it can be accessed by the public.

## Additional requests
<additional_requests>
  $ARGUMENTS
</additional_requests>
