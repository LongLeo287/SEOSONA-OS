# templates — List Available Templates

Browse playbook templates for creating new playbooks.

## When to Use

User wants to see what expert-strategized templates are available before creating a playbook.

## Process

### Default: `templates`

1. Load local templates via `scripts/template-loader.cjs list`.
2. Read each template JSON from `templates/` directory.
3. Display table:
   ```
   Available Playbook Templates

   ID                   Name                    Stages   Duration    Tags
   product-hunt-launch  Product Hunt Launch      5        6 weeks    launch, PH
   content-engine       Content Engine           4        ongoing    SEO, content
   campaign-sprint      Campaign Sprint          3        2 weeks    campaign
   saas-launch          SaaS Go-to-Market        6        8 weeks    SaaS, launch
   ```
4. For each template, show brief description and step count.
5. Suggest: `Run /ckm:play create <name> --template <id> to start.`

### Browse: `templates --browse`

1. Display message: "Community template marketplace coming soon. Currently using local templates only."
2. Show local templates (same as default).
3. Note: future MCP integration will allow browsing community-contributed templates.

## Error Handling

- No templates found in `templates/` → report error, check installation.
- Template JSON invalid → skip it, warn user, show valid ones.
- Schema validation fails → note which template has issues.
