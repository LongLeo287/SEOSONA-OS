# Generation Log Template

> **Usage:** Track all Stitch generation calls during Step 6.
> Save as: `projects/<project-name>/generation_log.md`

---

## Project Info

- **Stitch Project ID:** <!-- e.g., 4044680601076201931 -->
- **Project Title:** <!-- e.g., TaskLens v2 -->
- **Device Type:** <!-- Desktop / Mobile / Tablet -->
- **Drawing Mode:** <!-- Interactive / Auto-feed / Script batch -->
- **Started:** <!-- ISO timestamp -->
- **Completed:** <!-- ISO timestamp -->

---

## Generation Log

| # | Screen ID | Screen Name | Stitch Screen ID | Status | Attempts | Notes |
|---|---|---|---|---|---|---|
| 1 | S01 | | | ⏳ Pending | 0 | |
| 2 | S02 | | | ⏳ Pending | 0 | |
| 3 | S03 | | | ⏳ Pending | 0 | |

### Status Legend
- ⏳ Pending — Not yet generated
- 🔄 Generating — In progress
- ✅ Generated — Successfully created
- ✏️ Edited — Modified after initial generation
- ❌ Failed — Generation failed (see notes)
- 🔁 Retrying — Retrying after failure

---

## Edit History

<!-- Track all edit_screens calls -->

| # | Screen ID | Screen Name | Edit Prompt | Result |
|---|---|---|---|---|
| 1 | S01 | | | |

---

## Variant History

<!-- Track all generate_variants calls -->

| # | Screen ID | Screen Name | Variant Prompt | Variants Generated |
|---|---|---|---|---|
| 1 | S01 | | | |

---

## Statistics

- **Total screens:** <!-- e.g., 12 -->
- **Successfully generated:** <!-- e.g., 12 -->
- **Edits applied:** <!-- e.g., 3 -->
- **Variants generated:** <!-- e.g., 2 -->
- **Failed attempts:** <!-- e.g., 1 -->
- **Total generation time:** <!-- e.g., 45 minutes -->
