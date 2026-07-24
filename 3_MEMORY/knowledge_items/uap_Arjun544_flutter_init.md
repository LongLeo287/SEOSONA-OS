# KI: Arjun544/flutter_init

## Overview
**No installation required.** Open **[flutterinit.com](https://flutterinit.com)** and generate.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Next.js
- **Total files:** 114 files across 36 directories
- **File types:** .tsx: 56, .ts: 27, .json: 7, .hbs: 6, .gitignore: 3, .md: 3, .yml: 3
- **Key dependencies:** @base-ui/react, @hugeicons/core-free-icons, @hugeicons/react, @supabase/supabase-js, @vercel/analytics, border-beam, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, gray-matter
- **Dev dependencies:** @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, @vitest/ui, bun-types, eslint, eslint-config-next

## Documentation Sections
- 🏛️ What is FlutterInit?
- 🔄 How It Works
- 📦 What's Inside the Generated Project?
- ⚡ Quick Start
- 🛠️ Prerequisites
- To use a generated project
- To run FlutterInit locally (contributors only)
- 🧩 Support Matrix
- 🤖 AI-Ready From Day One
- ✍️ Blog & Guides
- 📚 Documentation
- 🗺️ Roadmap
- 🧑‍💻 Running FlutterInit Locally (Contributors)
- or
- Unit + integration (Layer 1)
- Dart validation on generated output (Layer 2)
- Full pre-flight check
- Generate guide file trees
- 💻 Tech Stack
- 🛠️ Built By

## Available Commands
- `npm run dev` -- next dev
- `npm run build` -- next build
- `npm run start` -- next start
- `npm run lint` -- eslint
- `npm run test` -- vitest
- `npm run test:unit` -- vitest run --config vitest.config.ts tests/unit/
- `npm run test:integration` -- vitest run --config vitest.config.ts tests/integration/
- `npm run test:layer1` -- npm run test:unit && npm run test:integration
- `npm run test:layer2` -- bun scripts/validate-dart.ts --mode critical
- `npm run test:tier3` -- bun tests/e2e/run-matrix.ts
- `npm run test:preflight` -- npm run test:layer1 && npm run test:layer2
- `npm run generate:guide-trees` -- bun scripts/generate-guide-trees.ts

## Core Structure
```
  .gitignore
  CONTRIBUTING.md
  README.md
  bun.lock
  components.json
  eslint.config.mjs
  next.config.ts
  package-lock.json
  package.json
  postcss.config.mjs
  skills-lock.json
  tsconfig.json
  vitest.config.ts
  vitest.e2e.config.ts
  .github/
    workflows/
      test-tier1.yml
      test-tier2.yml
      test-tier3.yml
  app/
    favicon.ico
    globals.css
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
    actions/
      pub.ts
    api/
      dev/
        sync-config/
          route.ts
      generate/
        route.ts
      stats/
        route.ts
      track/
        route.ts
    blog/
      layout.tsx
      page.tsx
      [...slug]/
        page.tsx
      components/
        AuthorByline.tsx
        BlogFilters.tsx
        FeaturedPost.tsx
        GuideConfigBlock.tsx
        MDXComponents.tsx
        PostCard.tsx
        RelatedPosts.tsx
        TableOfContents.tsx
        TagPill.tsx
    components/
      JsonLd.tsx
      landing/
        CliCommand.tsx
        Footer.tsx
        GitHubStars.tsx
        HeroSection.tsx
        MobileNodePattern.tsx
        Navbar.tsx
        NodePattern.tsx
        StatsSection.tsx
        StatsShowcase.tsx
        WhyFlutterInit.tsx
        bento/
          FeatureCard.tsx
          bento-hover-context.tsx
          previews/
            AIReadyPreview.tsx
            ArchitecturePreview.tsx
            GlobalReachPreview.tsx
            PerformancePreview.tsx
            ProductionReadyPreview.tsx
            RapidPrototypingPreview.tsx
            TechStackPreview.tsx
            ZeroBoilerplatePreview.tsx
          stats/
            BarBreakdown.tsx
            CountStat.tsx
            SparklineStat.tsx
            StatCardShell.tsx
      wizard/
        PackageInfoPanel.tsx
        StepContent.tsx
        SummaryItem.tsx
        ToggleRow.tsx
        WizardShell.tsx
        steps/
          ArchitectureStep.tsx
          BackendStep.tsx
          BasicsStep.tsx
          GenerateStep.tsx
          IconsStep.tsx
          LocalizationStep.tsx
          MiscStep.tsx
          NavigationStep.tsx
          StateStep.tsx
          ThemeStep.tsx
    create/
      page.tsx
    lib/
      analytics/
        trackGeneration.ts
      config/
        schema.ts
      generator/
        handlebars.ts
        index.ts
      state/
        useWizardStore.tsx
      supabase/
        server.ts
  assets/
    hero.png
  cli/
    .gitignore
    README.md
    bun.lock
    bunfig.toml
    package.json
    tsconf
```

## Quick Start
```bash
cd your_project_name
flutter pub get
flutter run
git clone https://github.com/Arjun544/flutter_init.git
cd flutter_init
bun install
bun run dev
npm run dev
npm run test:layer1
npm run test:layer2
```

## Agent Configuration

--- CONTRIBUTING.md ---
# Contributing to FlutterInit

Welcome! 🚀 We're thrilled you want to help us evolve FlutterInit. Our goal is to eliminate "initial drag" and provide an elite scaffolding experience for Flutter developers worldwide.

## Project Philosophy

FlutterInit is built on the principle of **Contribution-Based Evolution**. We don't just want a static tool; we want an engine that grows alongside the Flutter ecosystem. We value architect-level contributions that prioritize clean code, performance, and best practices.

## Ways to Contribute

1. **New Architectural Patterns**: Add support for MVC, Bloc-Clean, or your specialized team structure by adding a new `architecture` flag and its corresponding overlay.
2. **Web Dashboard Improvements**: Enhance the Next.js wizard UI to make project configuration even more intuitive.
3. **Internal Logic Refinement**: Optimize the `generator/` to handle more complex layered merges or conditional file generation.
4. **Documentation**: Clarify the onboarding experience or add deep-dive guides for advanced project structures.

## Local Setup

We use **Bun** for ultra-fast package management and script execution.

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Arjun544/flutter_init.git
   cd flutter_init
   ```

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Run Dev Server**:
   ```bash
   bun run dev
   ```
   *The dashboard will be active at `http://localhost:3000`.*

---

## Branch Naming Convention

Please follow these naming standards for your branches:
- `feat/feature-name` (New features/templates)
- `fix/bug-fix-description` (Bug fixes)
- `docs/doc-updates` (Improvements to markdown)
- `perf/optimization` (Performance enhancements)

## Development Workflow

We provide a specialized dev loop for template creation that provides "Hot Reload" for your scaffolds.

### The Template Dev Loop
1. Open your terminal and run:
   ```bash
   bun run --watch scripts/template-dev.ts
   ```
2. The script will watch 


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
