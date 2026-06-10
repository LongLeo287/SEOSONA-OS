# create — Create New Playbook

Create a marketing playbook from an expert template.

## When to Use

User wants to start a new marketing initiative with structured, expert-guided steps.

## Process

1. **Parse Arguments** — extract `<name>` and optional `--template <id>` from args.

2. **Template Selection**
   - If `--template <id>` given: load template via `scripts/template-loader.cjs load <id>`. Validate against `templates/_schema.json`. Error if not found — list available templates.
   - If no template: run `scripts/template-loader.cjs list` to show available templates. Present table (id, name, stages, estimated duration, tags). Ask user to pick one via `AskUserQuestion`.

3. **Gather Required Inputs**
   - Read template's `required_inputs` array.
   - For each input: prompt user via `AskUserQuestion` with the input's label, description, and example value.
   - Validate inputs against template constraints (e.g., required fields, enum values).

4. **Goal Targets** (optional)
   - Show template's default goal targets (e.g., traffic: 10K, signups: 500).
   - Ask user: keep defaults or customize? If customize, prompt for each metric target.

5. **Create Manifest**
   - Generate slug from name (lowercase, hyphenated).
   - Run `scripts/manifest.cjs create --name "<name>" --template <id> --slug <slug>`.
   - Pass user inputs and goal targets as JSON.

6. **Create Workspace**
   - Create directories:
     - `data/playbooks/{slug}/research/`
     - `data/playbooks/{slug}/content/`
     - `data/playbooks/{slug}/reports/`

7. **Display Result**
   - Show playbook name, template used, total steps, goal targets.
   - Show first stage name and its ready steps.

8. **Suggest Next** — output: `Run /ckm:play next {slug} to begin your first step.`

## Error Handling

- Template not found → list available templates with IDs.
- Name already exists → show existing playbook status, suggest different name or `/ckm:play reset`.
- Template validation fails → show specific schema errors from `scripts/template-loader.cjs`.
- Workspace creation fails → check file permissions, report path.
