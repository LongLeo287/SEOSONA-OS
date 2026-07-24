# Directory Structure Rules

## Root Structure

```
assets/
├── articles/          # Blog articles with images
├── banners/           # Campaign banners
├── designs/           # Design files (UI, mockups)
├── generated/         # AI-generated content
├── infographics/      # Data visualizations
├── logos/             # Brand logos
├── posts/             # Social media posts
├── reports/           # All marketing reports (see Reports section)
├── storyboards/       # Video storyboards
├── transcripts/       # Video/audio transcripts
├── videos/            # Video files
└── writing-styles/    # Writing style guides
```

## Self-Contained Folder Pattern

Use for multi-file assets that belong together.

### Articles
```
assets/articles/{date}-{slug}/
├── {slug}.md           # Main content
└── images/
    └── {slug}/
        ├── hero.png
        ├── comparison.png
        └── ...
```

### Storyboards
```
assets/storyboards/{date}-{slug}/
├── storyboard.md       # Human-readable
├── storyboard.json     # Machine-readable
├── scene-01-start.png
├── scene-01-end.png
├── scene-02-start.png
└── ...
```

### Videos
```
assets/videos/{date}-{slug}/
├── master.mp4          # Final output
├── scene-01.mp4
├── scene-02.mp4
├── concat.txt          # FFmpeg concat list
├── captions.srt        # Subtitles (optional)
└── analysis-*.md       # Quality reports
```

### Designs
```
assets/designs/{project}/
├── mockup-desktop.png
├── mockup-mobile.png
├── components/
│   ├── button.png
│   └── card.png
└── exports/
    ├── final-1x.png
    └── final-2x.png
```

## Flat File Pattern

Use for single-file assets.

### Transcripts
```
assets/transcripts/
├── video-title-one.md
├── video-title-two.md
└── interview-guest-name.md
```

### Writing Styles
```
assets/writing-styles/
├── default.md
├── technical.md
└── casual.md
```

### Infographics
```
assets/infographics/
├── 251222-market-stats.png
├── 251223-user-journey.svg
└── 251224-comparison-chart.png
```

## Platform-Specific Pattern

Use for platform-targeted content.

### Social Posts
```
assets/posts/
├── twitter/
│   ├── 251222-product-launch.png
│   └── 251223-tip-thread.png
├── linkedin/
│   ├── 251222-case-study.png
│   └── 251223-announcement.png
└── instagram/
    ├── 251222-carousel-01.png
    └── 251222-carousel-02.png
```

### Banners
```
assets/banners/
├── black-friday/
│   ├── hero-1920x1080.png
│   ├── sidebar-300x600.png
│   └── mobile-640x100.png
└── product-launch/
    ├── email-header.png
    └── social-cover.png
```

## Creation Order

1. Check if parent directory exists
2. Create directory structure first
3. Generate/write files
4. Verify all files created

## Reports Structure

All marketing reports go in `assets/reports/` with category subfolders:

```
assets/reports/
├── analytics/         # GA4, traffic, conversion reports
│   ├── 251225-ga4-monthly.md
│   └── 251225-traffic-analysis.md
├── seo/               # SEO audits, keyword research, rankings
│   ├── 251225-site-audit.md
│   └── 251225-keyword-gaps.md
├── social/            # Social media performance reports
│   ├── 251225-linkedin-performance.md
│   └── 251225-twitter-engagement.md
├── campaigns/         # Campaign performance, post-mortems
│   ├── 251225-launch-postmortem.md
│   └── 251225-q4-campaign-report.md
├── performance/       # Channel & funnel performance
│   ├── 251225-weekly-performance.md
│   └── 251225-monthly-marketing.md
├── ads/               # Paid advertising reports
│   ├── 251225-google-ads-report.md
│   └── 251225-meta-ads-report.md
├── email/             # Email campaign analytics
│   ├── 251225-newsletter-performance.md
│   └── 251225-drip-analysis.md
├── funnels/           # Funnel analysis and audits
│   ├── 251225-signup-funnel.md
│   └── 251225-checkout-optimization.md
└── content/           # Content audits and reviews
    ├── 251225-blog-audit.md
    └── 251225-content-performance.md
```

**Report Naming:** `{date}-{descriptive-slug}.md`
- Date format: `YYMMDD` or `YYMMDD-HHmm`
- Use kebab-case for slug
- Include report type in slug (audit, report, analysis, performance)

## .gitkeep Files

Empty directories should contain `.gitkeep` to preserve structure in git.
