# KI: ancsemi/Haven

## Overview
> **Your server. Your rules. No cloud. No accounts with Big Tech. No one reading your messages.**

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Total files:** 128 files across 20 directories
- **File types:** .js: 40, .json: 14, .svg: 11, .md: 10, .html: 9, .yml: 6, .mp3: 5

## Core Capabilities
| Category | What You Get |
|----------|-------------|
| **Chat** | Real-time messaging, image uploads (paste/drag/drop) with click-to-enlarge lightbox, typing indicators, message editing, replies, emoji reactions, @mentions with autocomplete, `:emoji` autocomplete, message pinning (admin) |
| **Voice** | Peer-to-peer audio chat, per-user volume sliders, mute/deafen, join/leave audio cues, talking indicators, click usernames for profile/DM |
| **Screen Share** | Multi-stream screen sharing with tiled grid layout, per-user video tiles, one-click close |
| **Channels** | Hierarchical channels with sub-channels, private (invite-only) sub-channels with 🔒 indicator, channel topics |
| **Join Codes** | Per-channel invite codes with admin controls: public/private visibility, static/dynamic mode, time-based or join-based auto-rotation, manual rotation |
| **Avatars** | Upload profile pictures (including animated GIFs!), choose avatar shape (circle/square/hexagon/diamond), per-user shapes visible to everyone |
| **Formatting** | **Bold**, *italic*, ~~strikethrough~~, `code`, \|\|spoilers\|\|, auto-linked URLs, fenced code blocks with language labels, blockquotes |
| **Link Previews** | Automatic OG metadata previews for shared URLs with title, description, and thumbnail |
| **GIF Search** | GIPHY-powered GIF picker — search and send GIFs inline (admin-configurable API key) |
| **Direct Messages** | Private 1-on-1 conversations — click 💬 on any user in the member list |
| **User Status** | Online, Away, Do Not Disturb, Invisible — with custom status text and auto-away after 5 min idle |
| **File Sharing** | Upload and share PDFs, documents, audio, video, archives (up to 25 MB) with inline players |
| **Persistent Unread** | Server-tracked read state — unread badges survive page refreshes and reconnects |
| **Slash Commands** | `/shrug`, `/tableflip`, `/roll 2d20`, `/flip`, `/me`, `/spoiler`, `/tts`, and more — type `/` to see them all |
| **Search** | Search messages in any c

## Documentation Sections
- ⬡ HAVEN — Private Chat That Lives On Your Machine
- 🖥️ NEW — Haven Desktop (Beta)
- 📱 Amni-Haven Android — Now on Google Play!
- 🌐 Try Haven — No Download Required
- NEW in v2.0.0 — Import Your Discord History
- Quick Start — Docker (Recommended)
- Quick Start — Windows (No Docker)
- Quick Start — Linux / macOS (No Docker)
- Who Is This For?
- Why Not Discord?
- Features
- 🌐 Translations (i18n)
- ⚠️ Translation Quality
- Contributing a Translation

## Core Structure
```
  .dockerignore
  .editorconfig
  .env.example
  .gitattributes
  .gitignore
  CHANGELOG.md
  Dockerfile
  GUIDE.md
  Install Haven.bat
  Install Haven.ps1
  LICENSE
  README.md
  Start Haven.bat
  desktop-directive.md
  docker-compose.yml
  docker-entrypoint.sh
  donor-order.json
  donors.json
  install-node.ps1
  install.sh
  master-setup.iss
  package-lock.json
  package.json
  server.js
  setup-ssl.ps1
  setup.iss
  start.sh
  zeabur.yaml
  .github/
    FUNDING.yml
    workflows/
      docker-publish.yml
      release.yml
      translations-autovalidate.yml
  docs/
    CROSS-PLATFORM-GAMEPLAN.md
    index.html
    index_clean.html
    livekit-sfu-plan.md
    server-list-sync.md
    stickers-scope.md
    support.html
    examples/
      haven-traefik-coturn/
        .env.example
        README.md
        docker-compose.yml
  haven-push-relay/
    .firebaserc
    .gitignore
    README.md
    firebase.json
    package.json
    server.js
    functions/
      index.js
      package.json
  installer/
    index.html
    server.js
  plugins/
    MessageTimestamps.plugin.js
  public/
    app.html
    favicon.svg
    icon-192.svg
    icon-512.svg
    index.html
    manifest.webmanifest
    sw.js
    css/
      music.css
      style.css
      voice.css
    games/
      bird-avatar.png
      flappy.html
      flappy.js
      flash-game.js
      flash.html
      io-games.html
      io-games.js
    js/
      app.js
      app.js.bak
      auth.js
      e2e.js
      i18n.js
      modmode.js
      modmode.js.bak
      modmode.v3.bak
      modmode.v4.bak
      notifications.js
      password-eye.js
      plugin-loader.js
      rnnoise-processor.js
      rnnoise.wasm
      servers.js
      theme-init.js
      theme.js
      voice.js
      modules/
        app-admin.js
        app-channels.js
        app-context.js
        app-media.js
        app-messages.js
        app-platform.js
        app-socket.js
        app-ui.js
        app-users.js
        app-utilities.js
        app-voice.js
        stream-debug.js
    locales/
      de.json
      en.json
      es.json
      fr.json
      pl.json
      ru.json
      zh.json
    sounds/
      aol_door_close.mp3
      aol_door_open.mp3
      aol_filesdone.mp3
      aol_got_mail.mp3
      aol_message.mp3
    starter-stickers/
      check.svg
      eyes.svg
      fire.svg
      heart.svg
      laugh.svg
      nope.svg
      party.svg
      thumbs-up.svg
    uploads/
      .gitkeep
  scripts/
    fix-emoji-encoding.py
    fix_soun
```

## Quick Start
```bash
docker pull ghcr.io/ancsemi/haven:latest
docker run -d -p 3000:3000 -v haven_data:/data ghcr.io/ancsemi/haven:latest
git clone https://github.com/ancsemi/Haven.git
cd Haven
docker compose up -d
git clone https://github.com/ancsemi/Haven.git
cd Haven
docker compose up -d
docker compose pull
docker compose up -d --force-recreate
```

## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
