# KI: YILS-LIN/short-video-factory

## Overview
短视频工厂，一键生成产品营销与泛内容短视频，AI批量自动剪辑

## Tech Stack (from code)
- TypeScript (30 files)
- Vue.js (9 files)
- JavaScript (1 files)
- **Total:** 65 files, 24 directories
- **File types:** .ts: 30, .vue: 9, .json: 6, .node: 6, .png: 3, .md: 2, .gitignore: 1, .npmrc: 1

## Public API / Exports
- `formatErrorForCopy` from `src\lib\error-copy.ts`
- `copyErrorToClipboard` from `src\lib\error-copy.ts`
- `i18n` from `src\lib\i18n.ts`

## Dependencies
### Dependencies (from package.json)
- `axios`: ^1.11.0
- `better-sqlite3`: 9.6.0
- `ffmpeg-static`: ^5.2.0
- `i18next`: ^25.4.0
- `i18next-fs-backend`: ^2.3.2
- `music-metadata`: ^11.7.3
- `subtitle`: 4.2.2-alpha.0
- `ws`: ^8.18.3

### Dev Dependencies
- `@ai-sdk/openai`: ^3.0.26
- `@mdi/font`: ^7.4.47
- `@types/better-sqlite3`: ^7.6.13
- `@types/node`: ^16.18.126
- `@types/wicg-file-system-access`: ^2023.10.6
- `@types/ws`: ^8.18.1
- `@vitejs/plugin-vue`: ^6.0.0
- `@vueuse/core`: ^13.5.0
- `ai`: ^6.0.77
- `cross-env`: ^7.0.3
- `electron`: ^22.3.27
- `electron-builder`: ^24.13.3
- `i18next-http-backend`: ^3.0.2
- `i18next-vue`: ^5.3.0
- `mitt`: ^3.0.1

## Imports Detected in Source
- `@/store`
- `@mdi/font`
- `@vitejs/plugin-vue`
- `i18next`
- `i18next-http-backend`
- `i18next-vue`
- `node:path`
- `node:url`
- `unocss`
- `virtual:uno.css`
- `vite`
- `vite-plugin-electron`
- `vite-plugin-vue-devtools`
- `vue`
- `vue-toastification`
- `vuetify`
- `~`

## Available Commands
- `npm run dev` -- `cross-env VITE_CJS_IGNORE_WARNING=true vite`
- `npm run build` -- `vue-tsc && cross-env VITE_CJS_IGNORE_WARNING=true vite build && electron-builder`
- `npm run preview` -- `vite preview`
- `npm run format` -- `prettier --write .`
- `npm run preinstall` -- `npx only-allow pnpm`
- `npm run postinstall` -- `node build/scripts/post-install.js`
- `npm run lipo-ffmpeg` -- `node build/scripts/lipo-ffmpeg.js`

## File Structure
```
  .gitignore
  .npmrc
  .nvmdrc
  .prettierrc.json
  CHANGELOG.md
  LICENSE
  README.md
  electron-builder.json5
  index.html
  package.json
  pnpm-lock.yaml
  stylelint.config.js
  tsconfig.json
  tsconfig.node.json
  uno.config.ts
  vite.config.ts
  electron/
    electron-env.d.ts
    ipc.ts
    main.ts
    preload.ts
    types.ts
    ffmpeg/
      index.ts
      types.ts
    i18n/
      common-options.ts
      index.ts
    lib/
      cookie-allow-cross-site.ts
      edge-tts.ts
      is-dev.ts
      request.ts
      stat.ts
      tools.ts
    sqlite/
      index.ts
      types.ts
    tts/
      index.ts
      types.ts
  images/
    ScreenShot.png
    StarHistory.png
  locales/
    en/
      common.json
    zh-CN/
      common.json
  native/
    better-sqlite3/
      better-sqlite3-v9.6.0-electron-v110-darwin-arm64.node
      better-sqlite3-v9.6.0-electron-v110-darwin-x64.node
      better-sqlite3-v9.6.0-electron-v110-linux-x64.node
      better-sqlite3-v9.6.0-electron-v110-win32-arm64.node
      better-sqlite3-v9.6.0-electron-v110-win32-ia32.node
      better-sqlite3-v9.6.0-electron-v110-win32-x64.node
  public/
    icon.png
  src/
    App.vue
    global.d.ts
    main.ts
    vite-env.d.ts
    assets/
      base.scss
    components/
      ActionToastEmbed.vue
      VideoAutoPreview.vue
    layout/
      default.vue
    lib/
      error-copy.ts
      i18n.ts
    router/
      index.ts
      router.d.ts
    store/
      app.ts
      index.ts
    views/
      Home/
        index.vue
        components/
          TextGenerate.vue
          TtsControl.vue
          VideoManage.vue
          VideoRender.vue
```

## Key Source Excerpts
### vite.config.ts
```typescript
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron/simple'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import UnoCSS from 'unocss/vite'
import { version } from './package.json'
import { syncElectronDevServerUrl } from './build/vite-plugins/sync-electron-dev-server-url'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  plugins: [
    syncElectronDevServerUrl(),
    vue(),
    vueDevTools(),
    UnoCSS(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['better-sqlite3'],
            },
          },
        },
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer:
        process.env.NODE_ENV === 'test'
          ? // https://github.com
```

### src/main.ts
```typescript
import 'vuetify/styles/main.sass'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import Toast, { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import 'virtual:uno.css'
import './assets/base.scss'

import { createApp } from 'vue'
import router from './router/index.ts'
import store, { useAppStore } from './store/index.ts'
import App from './App.vue'

import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import i18nInitialized from './lib/i18n.ts'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

const app = createApp(App)

app.use(vuetify)
app.use(Toast, {
  position: 'bottom-left',
  pauseOnFocusLoss: false,
  closeOnClick: false,
} as PluginOptions)
app.use(router)
app.use(store)

// 初始化并应用国际化
i18nInitialized().then(() => {
  app.use(I18NextVue, { i18next })
  app.mount('#app').$nextTick(() => {
    // 测试消息
    window.ipcRenderer.on('main-process-message', (_event, message) => {
      console.log(message)
    })

    // 监听主进程切换语言
    window.ipcRenderer.on('i18n-changeLanguage', (_event, lng) => {
      i18next.changeLanguage(lng)
      useAppStore().updateLocale(lng)
    })
  })
})

```

### src\lib\error-copy.ts
```typescript
export function formatErrorForCopy(message: string, detail: string): string {
  const errorObj = {
    message,
    detail,
    appVersion: __APP_VERSION__,
    timestamp: new Date().toISOString(),
  }

  const formattedJson = JSON.stringify(errorObj, null, 2)

  return ['```json', formattedJson, '```'].join('\n')
}

export async function copyErrorToClipboard(message: string, detail: string): Promise<void> {
  const content = formatErrorForCopy(message, detail)
  await navigator.clipboard.writeText(content)
}

```

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-video` · **Function:** `video-render` · **Fit:** 44/100 · **Auto-apply:** True
- **Evidence:** `ffmpeg`, `render`
- **All scores:** {'seosona-os': 22, 'seosona-video': 44, 'seosona-content': 22, 'seosona-ux-ui': 44, 'seosona-flow': 0}
