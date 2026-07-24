Test a skill with 3 prompts to validate quality.

For the specified skill, run these 3 tests:

## Test 1: Stranger Test
Pick a natural prompt that someone unfamiliar with Affitor would type.
Run the skill workflow mentally (or actually invoke it).
Check: is the output usable and valuable?

## Test 2: Chain Test
Take the output from Test 1 and check: would the next skill in the funnel
(S1→S2, S2→S3, etc.) be able to pick up the context and run?
Verify Output Schema fields are present and correctly formatted.

## Test 3: Platform Test
Take the output and verify it works outside Claude:
- Social post → could you paste this on LinkedIn/X right now?
- Blog article → does the Markdown render correctly?
- HTML page → does it display properly in a browser?
- Bio link → does it load and work?

## Report
For each test: PASS / FAIL with specific notes on what worked and what didn't.
Include the test prompts used and a summary of the output quality.
