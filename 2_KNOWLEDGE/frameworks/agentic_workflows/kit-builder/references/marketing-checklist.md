# Marketing Kit Checklist

Status map for ClaudeKit Marketing capabilities.

## Asset Structure

```
assets/
├── articles/       # Long-form (blog, technical)
├── posts/          # Social posts
├── banners/        # Email, landing, ads, social
├── designs/        # Campaigns, print, web
├── infographic/    # Visual flows, charts
├── storyboards/    # Video scripts
├── videos/         # Generated videos
└── writing-styles/ # AI copywriting refs
```

## Skills Status

| Skill | Status | Notes |
|-------|--------|-------|
| design | ✅ | Routes to brand/design-system/ui |
| brand | ✅ | Logo, fonts, colors |
| design-system | ✅ | Tokens, component specs |
| copywriting | ✅ | Formulas, templates |
| content-marketing | ✅ | Blog, audit, strategy |
| email | ✅ | Templates, deliverability |
| social | ✅ | Platform-specific |

### Pending Skills

| Skill | Priority | Components |
|-------|----------|------------|
| automation-flows | High | Email sequences, triggers |
| image-layering | Medium | Replicate qwen model |

## Commands Status

### Content Commands
| Command | Status | Purpose |
|---------|--------|---------|
| /write:blog | ✅ | SEO blog post |
| /write:cro | ✅ | CRO optimization |
| /write:enhance | ✅ | Content enhancement |
| /write:blog:youtube | TODO | YouTube → blog |

### Design Commands
| Command | Status | Purpose |
|---------|--------|---------|
| /design:generate | ✅ | AI image gen |
| /slides:create | ✅ | HTML/JS slides |
| /design:youtube-infographic | TODO | YT → infographic |

### Social Commands
| Command | Status | Purpose |
|---------|--------|---------|
| /social | ✅ | Generate social |
| /social:schedule | TODO | Schedule posts |
| /social:youtube | TODO | YT → social |

## Integrations Status

| Integration | Status | API |
|-------------|--------|-----|
| Google Drive | TODO | Google APIs |
| Cloudflare R2 | TODO | R2 SDK |
| X (Twitter) | TODO | Twitter API v2 |
| Facebook Page | TODO | Graph API |
| YouTube | TODO | YouTube Data API |
| TikTok | TODO | TikTok API |

## Building New Components

### For TODO Items

1. **New Skill**
   ```bash
   python .opencode/skills/kit-builder/scripts/init_component.py skill {name}
   ```

2. **New Command**
   ```bash
   python .opencode/skills/kit-builder/scripts/init_component.py command {name}
   ```

3. **Add to Agent**
   - Edit `.opencode/agents/{agent}.md`
   - Add skill activation note
   - Add examples for new capability

## Natural User Workflows

### Content Creator Flow
```
1. Research topic (researcher agent)
2. Create outline (/write:blog)
3. Write draft (content-creator agent)
4. Optimize SEO (seo-specialist agent)
5. Create images (/design:generate)
6. Review (content-reviewer agent)
7. Publish (manual or scheduled)
```

### Campaign Flow
```
1. Plan campaign (campaign-manager agent)
2. Create content (content-creator agent)
3. Design assets (/design:generate)
4. Write emails (email-wizard agent)
5. Schedule social (TODO: /social:schedule)
6. Track analytics (analytics-analyst agent)
```

### Social Media Flow
```
1. Generate post (/social)
2. Create visuals (/design:generate)
3. Schedule posts (TODO)
4. Engage community (community-manager agent)
```
