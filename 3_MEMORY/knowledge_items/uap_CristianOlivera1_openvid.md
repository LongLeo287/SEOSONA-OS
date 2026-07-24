# KI: CristianOlivera1/openvid

## Overview
[Live Demo](https://openvid.dev) • [Features](#-features) • [Installation](#-quick-start) • [Discord Community](https://discord.gg/aBu5A2tBXb)
</div>

## Architecture & Tech Stack
- Node.js / TypeScript / JavaScript
- **Frameworks:** Next.js
- **Total files:** 121 files across 29 directories
- **File types:** .tsx: 93, .ts: 9, .md: 7, .json: 4, .mjs: 2, .example: 1, .gitignore: 1
- **Key dependencies:** @ffmpeg/core, @ffmpeg/ffmpeg, @ffmpeg/util, @radix-ui/react-dialog, @radix-ui/react-dropdown-menu, @react-three/drei, @react-three/fiber, @supabase/ssr, @supabase/supabase-js, @types/three, atropos, class-variance-authority
- **Dev dependencies:** @iconify/react, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom, eslint, eslint-config-next, shadcn

## Core Capabilities
### Video Input
- **Screen recording** - Capture your screen directly in the browser with no installation required
- **Upload your video** - MP4, WebM, QuickTime, and MKV
- **Drag & drop** - Fast file upload

---

### Mockup Creation
- **Mockups applied to images**
- **3D transformations**
- **Image masking (Mask Image)** for advanced cutouts
- Scale, rotation, perspective, and position adjustments

---

### Visual Customization

**Backgrounds**
- 100+ pre-designed backgrounds
- Custom images or Unsplash
- Solid colors and gradients
- Blur effect (0–100%)

**Effects**
- Dynamic padding
- Rounded corners
- Shadows
- Video rotation and positioning

---

### Canvas & Elements
- **Shapes** - Rectangles, circles, triangles
- **Text** - Custom fonts, colors, and sizes
- **SVG** - Import vector graphics
- **Images** - PNG, JPG, WebP overlays
- **Layers** - Depth control above or below the video

---

### Device Mockups
Add context to your demo with professional frames:
- Safari (macOS)
- Chrome
- Arc
- Samsung

---

### Zoom
- Zoom in/out at specific timeline moments
- Speed and easing control
- **3D Camera Movement** - Tilt and dynamic rotation based on points of interest
- **Adjustable Perspective** - Full control over X and Y axes for depth simulation

---

### Audio
- Multi-track support
- Per-track and master volume control
- Auto-trim based on video duration
- Toggle original video audio

---

### Export

**Quality**
- 4K (3840×2160) @ 30fps
- 2K (2560×1440) @ 30fps
- 1080p (1920×1080) @ 30fps
- 720p (1280×720) @ 30fps
- 480p (720×480) @ 24fps

**Format**
- MP4 (H.264)
- WebM (VP9 with transparent background support)
- GIF
- PNG, WEBP, JPG, AVIF

---

## Documentation Sections
- Features
- Video Input
- Mockup Creation
- Visual Customization
- Canvas & Elements
- Device Mockups
- Zoom
- Audio
- Export
- Technology
- Quick Start
- Install dependencies
- Setup environment
- Add your Supabase credentials
- Start development server
- 💬 Community
- Contributors
- Star History

## Available Commands
- `npm run dev` -- next dev
- `npm run build` -- next build
- `npm run start` -- next start
- `npm run lint` -- eslint

## Core Structure
```
  .env.example
  .gitignore
  LICENSE.md
  README.md
  claude.md
  components.json
  eslint.config.mjs
  i18n.ts
  navigation.ts
  next.config.ts
  package.json
  pnpm-lock.yaml
  postcss.config.mjs
  proxy.ts
  skills-lock.json
  tsconfig.json
  .agents/
    skills/
      3d-web-experience/
        SKILL.md
      gsap/
        SKILL.md
        references/
          effects.md
        scripts/
          extract-audio-data.py
      react-three-fiber/
        SKILL.md
  app/
    favicon.ico
    globals.css
    layout.tsx
    not-found.tsx
    robots.ts
    sitemap.ts
    [locale]/
      layout.tsx
      not-found.tsx
      (auth)/
        layout.tsx
        login/
          page.tsx
      (editor)/
        layout.tsx
        editor/
          loading.tsx
          page.tsx
      (home)/
        layout.tsx
        page.tsx
        donate/
          DonateClient.tsx
          page.tsx
      (legal)/
        layout.tsx
        privacy/
          page.tsx
        terms/
          page.tsx
      auth/
        callback/
          route.ts
    api/
      photos/
        route.ts
    components/
      common/
        Footer.tsx
        Header.tsx
        LanguageSwitcher.tsx
        MobileMenu.tsx
        UserMenu.tsx
      seo/
        StructuredData.tsx
      ui/
        AspectRatioSelect.tsx
        BackgroundColorEditor.tsx
        ExportDropdown.tsx
        ExportImageDropdown.tsx
        ExportOverlay.tsx
        FloatingCameraPreview.tsx
        ImageRecentBackgroundGrid.tsx
        PhotoPickerPopover.tsx
        PlaceholderEditor.tsx
        RecordingOverlay.tsx
        RecordingSetupDialog.tsx
        Skeleton.tsx
        WalpaperSections.tsx
        editor/
          AudioFragmentTrackItem.tsx
          AudioMenu.tsx
          AudioTrimModal.tsx
          CameraMenu.tsx
          CanvasElementsLayer.tsx
          ContextMenu.tsx
          ControlPanel.tsx
          CursorMenu.tsx
          EditorHoverTooltip.tsx
          EditorTopBar.tsx
          ElementsMenu.tsx
          GetMediaMaskStyles.tsx
          HistoryMenu.tsx
          IPhone13ProMax3DViewer.tsx
          ImageCropperModal.tsx
          ImageMaskEditor.tsx
          LabelSidebar.tsx
          Laptop3DViewer.tsx
          LayersPanel.tsx
          MobileControlPanel.tsx
          MobileToolsMenu.tsx
          Mockup2dMenu.tsx
          Mockup3dMenu.tsx
          MockupMenu.tsx
          MotionMenu.tsx
          Phone3DViewer.tsx
          PhotoEditorPlaceholder.tsx
          PlayerControls.tsx
```

## Quick Start
```bash
pnpm install
cp .env.example .env
pnpm dev
```

## Agent Configuration

--- CLAUDE.md ---
# openvid (openvidshot) — Guía del proyecto

> Crea demos y mockups profesionales en segundos, directamente en el navegador.
> Graba la pantalla o sube un video, agrega zooms suaves, mockups de dispositivos, efectos 3D y fondos personalizados, y exporta un demo cinematográfico.

---

## 1. Visión general

openvid es un **editor de video web** orientado a la creación de demos, screencasts y mockups. El repo contiene:

| Carpeta | Rol |
|---|---|
| raíz (`app/`, `components/`, `lib/`, `hooks/`, `types/`) | **Frontend / editor 100% client-side** en Next.js 16 + React 19 + Tailwind 4. Grabación, mockups, zoom 3D, audio, exportación en navegador. |
| `openvid-back/` | Subproyecto auxiliar (opcional) para renderizado headless en servidor. Ver §6. |

El **editor funciona sin backend**: todo se procesa con FFmpeg.wasm / MediaBunny / Canvas 2D / Three.js directamente en el cliente. La carpeta `openvid-back/` se mantiene como referencia/spec pero no es prioritaria para el día a día del editor.

---

## 2. Características principales

### Entrada de video
- **Grabación de pantalla** en el navegador (sin instalación) — `useScreenRecording` / `useScreenCapture` + `RecordingContext` con `MediaRecorder` API.
- **Subida de archivos** (MP4, WebM, QuickTime, MKV) con drag & drop.
- **Screen capture** instantáneo desde la landing (`useScreenCapture`).
- **Biblioteca de videos** persistente en IndexedDB (`openvid-videos-library`) con thumbnails, audio flags, file size, etc.

### Modo editor (Video vs Photo)
- **Editor mode** seleccionado por URL (`?mode=video` o `?mode=photo`) — `useEditorMode`.
- `VIDEO_MODE_CONFIG` y `PHOTO_MODE_CONFIG` (`types/editor-mode.types.ts`) activan/desactivan features: timeline, playerControls, videoClips, audioTracks, zoomFragments, camera, cursor, mockups, background, elements, export.
- **Photo mode**: sube/edita imágenes con mockups, 3D previews, image masking, export como PNG/WEBP/JPG/AVIF.

### Mockups 3D (consolidados en `MockupMenu`)
La lógica de mo


## Analysis Note
> This KI was generated by **enhanced local structural analysis** (no LLM API was available at generation time). It includes full tech stack detection, README parsing, dependency analysis, and feature extraction. For deeper semantic analysis, re-run with an active Gemini or OpenAI API key.
