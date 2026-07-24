# KI: Talos-Pioneers/ui

## Overview
Talos Pioneers is the frontend application for a blueprint sharing platform for **Arknights Endfield**. The platform allows players to create, share, like, and comment on game blueprints (base designs/builds) using shareable codes that can be pasted directly into the game. Users can organize blueprints into collections, manage game-related facilities and items, and interact with the community through comments and likes.

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 124 files across 25 directories
- **File types:** .vue: 87, .ts: 12, .json: 7, .png: 5, .svg: 3, .yml: 2, .gitignore: 1
- **Key dependencies:** @nuxt/content, @nuxt/eslint, @nuxt/fonts, @nuxt/scripts, @nuxtjs/i18n, @nuxtjs/seo, @sentry/nuxt, @unhead/vue, @vueuse/core, better-sqlite3, class-variance-authority, clsx
- **Dev dependencies:** @tailwindcss/vite, nitro-cloudflare-dev, nitropack, prettier, shadcn-vue, tailwindcss, tw-animate-css, typescript

## Core Capabilities
### Blueprints

- **List Page** (`/blueprints`): Browse and filter published blueprints
- **Detail Page** (`/blueprints/[id]`): View blueprint details, comments, and interactions
- **Create Page** (`/blueprints/create`): Create a new blueprint
- **Edit Page** (`/blueprints/[id]/edit`): Edit an existing blueprint

### Collections

- **List Page** (`/collections`): Browse blueprint collections
- **Detail Page** (`/collections/[id]`): View collection details and blueprints
- **Create Page** (`/collections/create`): Create a new collection
- **Edit Page** (`/collections/[id]/edit`): Edit an existing collection

### Profile

- **Profile Page** (`/profile`): View and edit user profile
- **My Blueprints** (`/profile/blueprints`): Manage user's blueprints
- **My Collections** (`/profile/collections`): Manage user's collections

### Authentication

- **Login** (`/login`): User login with email/password or OAuth
- **Register** (`/register`): User registration

### Additional Features

TBD

## Documentation Sections
- Talos Pioneers Frontend
- Table of Contents
- Tech Stack
- Prerequisites
- Installation & Setup
- 1. Clone the Repository
- 2. Install Dependencies
- 3. Environment Configuration
- 4. Development Server
- Environment Variables
- Required Variables
- Optional Variables
- Development
- Running the Development Server
- Building for Production
- Preview Production Build
- Code Structure
- TypeScript
- Styling
- Features & Pages
- Blueprints
- Collections
- Profile
- Authentication
- Additional Features

## Available Commands
- `npm run build` -- nuxt build
- `npm run dev` -- nuxt dev --dotenv .env.local
- `npm run generate` -- nuxt generate
- `npm run preview` -- npm run build && wrangler dev
- `npm run postinstall` -- nuxt prepare
- `npm run deploy:staging` -- export $(cat ../ui-stag-deployconfig/.env.staging | xargs) && nuxt build && wran
- `npm run deploy:production` -- export $(cat .env.production | xargs) && nuxt build && wrangler deploy
- `npm run cf-typegen` -- wrangler types
- `npm run lint` -- eslint .
- `npm run lint:fix` -- eslint . --fix
- `npm run format` -- prettier --check .
- `npm run format:fix` -- prettier --write . --fix

## Core Structure
```
  .gitignore
  .prettierignore
  .prettierrc
  LICENSE
  README.md
  bun.lockb
  components.json
  env.d.ts
  eslint.config.mjs
  nuxt.config.ts
  package-lock.json
  package.json
  sentry.client.config.ts
  tsconfig.json
  worker-configuration.d.ts
  wrangler.jsonc
  .cursor/
    mcp.json
  .github/
    workflows/
      deploy-production.yml
      deploy-staging.yml
  .vscode/
    settings.json
  app/
    app.vue
    error.vue
    router.options.ts
    assets/
      css/
        tailwind.css
      img/
        button-waves.png
        input-pattern.png
        input-pattern.svg
        logo.svg
        not-found-placeholder.png
        wave-bg.svg
        banners/
          factory1.png
          wuling1.png
      lottie/
        throbber.json
    components/
      ReportButton.vue
      auth/
        LoginDialog.vue
        LoginForm.vue
        ProfileEdit.vue
        RegisterDialog.vue
        RegisterForm.vue
      banners/
        BannerDivider.vue
        BlueprintProfileBanner.vue
        CollectionBanner.vue
        CollectionProfileBanner.vue
        MainBanner.vue
      blueprints/
        BlueprintCard.vue
        BlueprintForm.vue
        BlueprintList.vue
        BlueprintPagination.vue
        DeleteBlueprintDialog.vue
        FacilityList.vue
        ImageDropZone.vue
        ItemList.vue
      collections/
        AddToCollection.vue
        CollectionCard.vue
        CollectionsList.vue
        DeleteCollectionDialog.vue
      comments/
        CommentComposer.vue
        CommentItem.vue
        CommentList.vue
      icons/
        AddBlueprintIcon.vue
        AddCollectionIcon.vue
        BookIcon.vue
        CalendarIcon.vue
        CheckmarkIcon.vue
        ChevronIcon.vue
        ChevronRightIcon.vue
        ClockIcon.vue
        CloseIcon.vue
        CommentsIcon.vue
        CopiesIcon.vue
        CopyIcon.vue
        DiscordIcon.vue
        GoogleIcon.vue
        InfoIcon.vue
        LanguageIcon.vue
        LikesIcon.vue
        LoginIcon.vue
        Logo.vue
        LogoMobileIcon.vue
        MailIcon.vue
        MenuIcon.vue
        PlayIcon.vue
        RegionIcon.vue
        RegionValleyIcon.vue
        RegionWulingIcon.vue
        SearchIcon.vue
        ServerRegionIcon.vue
        ShareIcon.vue
        ThemeDarkIcon.vue
        ThemeLightIcon.vue
        UserIcon.vue
        VerticalElipsis.vue
      navigation/
        Footer.vue
        Header.vue
        LanguageSwitcher.vue
        SignInButton.vue
        ThemeSelector.vu
```

## Quick Start
```bash
git clone <repository-url>
cd frontend
npm install
bun install
cp .env.example .env
npm run dev
```

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
