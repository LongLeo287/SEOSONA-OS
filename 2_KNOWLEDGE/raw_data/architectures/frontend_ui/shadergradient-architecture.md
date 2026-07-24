# Architecture Extract: shadergradient

## Directory Structure
```text
shadergradient/
    .gitignore
    .npmrc
    .prettierignore
    .prettierrc
    package.json
    pnpm-lock.yaml
    pnpm-workspace.yaml
    README.md
    turbo.json
    .changeset/
        config.json
    .github/
        workflows/
            deploy.yml
    .vscode/
        settings.json
    apps/
        email-previews/
            package.json
            tsconfig.json
            .react-email/
                CHANGELOG.md
                index.mjs
                license.md
                module-punycode.d.ts
                next-env.d.ts
                next.config.mjs
                package-lock.json
                package.json
                postcss.config.js
                readme.md
                tailwind.config.ts
                tsconfig.json
                vitest.config.ts
                emails/
                    .gitkeep
                jsx-runtime/
                    jsx-dev-runtime.js
                scripts/
                    build-preview-server.mts
                    dev.mts
                    fill-caniemail-data.mts
                    seed.mts
                    utils/
                        default-seed/
                            feedback-request.tsx
                            auth/
                                account-confirmation.tsx
                                forgot-password.tsx
                            communications/
                                payment-overdue.tsx
                                team-invite.tsx
                                webhooks-failed.tsx
                            marketing/
                                changelog.tsx
                src/
                    actions/
                        export-single-template.ts
                        get-email-path-from-slug.ts
                        get-emails-directory-metadata-action.ts
                        render-email-by-path.tsx
                        safe-action.ts
                        email-validation/
                            caniemail-data.ts
                            check-compatibility.ts
                            check-images.spec.tsx
                            check-images.ts
                            check-links.spec.tsx
                            check-links.ts
                            get-code-location-from-ast-element.ts
                            quick-fetch.ts
                            __snapshots__/
                                check-images.spec.tsx.snap
                    animated-icons-data/
                        help.json
                        link.json
                        load.json
                        mail.json
                    app/
                        env.ts
                        favicon.ico
                        fonts.ts
                        globals.css
                        layout.tsx
                        page.tsx
                        fonts/
                            SFMono/
                                SFMonoBold.otf
                                SFMonoBoldItalic.otf
                                SFMonoHeavy.otf
                                SFMonoHeavyItalic.otf
                                SFMonoLight.otf
                                SFMonoLightItalic.otf
                                SFMonoMedium.otf
                                SFMonoMediumItalic.otf
                                SFMonoRegular.otf
                                SFMonoRegularItalic.otf
                                SFMonoSemibold.otf
                                SFMonoSemiboldItalic.otf
                        preview/
                            [...slug]/
                                email-frame.tsx
                                error-overlay.tsx
                                page.tsx
                                preview.tsx
                    components/
                        button.tsx
                        code-container.tsx
                        code-snippet.tsx
                        code.tsx
                        heading.tsx
                        index.ts
                        logo.tsx
                        resizable-wrapper.tsx
                        send.tsx
                        shell.tsx
                        text.tsx
                        toolbar.tsx
                        tooltip-content.tsx
                        tooltip.tsx
                        topbar.tsx
                        icons/
                            icon-arrow-down.tsx
                            icon-base.tsx
                            icon-bug.tsx
                            icon-button.tsx
                            icon-check.tsx
                            icon-clipboard.tsx
                            icon-cloud-alert.tsx
                            icon-cloud-check.tsx
                            icon-download.tsx
                            icon-email.tsx
                            icon-file.tsx
                            icon-folder-open.tsx
                            icon-folder.tsx
                            icon-hide-sidebar.tsx
                            icon-image.tsx
                            icon-info.tsx
                            icon-link.tsx
                            icon-loader.tsx
                            icon-monitor.tsx
                            icon-moon.tsx
                            icon-phone.tsx
                            icon-reload.tsx
                            icon-source.tsx
                            icon-stamp.tsx
                            icon-sun.tsx
                            icon-warning.tsx
                        sidebar/
                            file-tree-directory-children.tsx
                            file-tree-directory.tsx
                            file-tree.tsx
                            index.ts
                            sidebar.tsx
                        toolbar/
                            checking-results.tsx
                            code-preview-line-link.tsx
                            compatibility.tsx
                            linter.tsx
                            resend.tsx
                            results-table.tsx
                            results.tsx
                            spam-assassin.tsx
                            toolbar-button.tsx
                            use-cached-state.ts
                        topbar/
                            active-view-toggle-group.tsx
                            emulated-dark-mode-toggle.tsx
                            view-size-controls.tsx
                    contexts/
                        emails.tsx
                        preview.tsx
                        toolbar.tsx
                    hooks/
                        use-clamped-state.ts
                        use-email-rendering-result.ts
                        use-fragment-identifier.ts
                        use-hot-reload.ts
                        use-rendering-metadata.ts
                    utils/
                        cn.ts
                        constants.ts
                        contains-email-template.spec.ts
                        contains-email-template.ts
                        convert-stack-with-sourcemap.ts
                        copy-text-to-clipboard.ts
                        create-jsx-runtime.ts
                        get-email-component.spec.ts
                        get-email-component.ts
                        get-emails-directory-metadata.spec.ts
                        get-emails-directory-metadata.ts
                        get-line-and-column-from-offset.spec.ts
                        get-line-and-column-from-offset.ts
                        index.ts
                        js-email-detection.spec.ts
                        language-map.ts
                        linting.ts
                        load-stream.ts
                        register-spinner-autostopping.ts
                        result.ts
                        run-bundled-code.ts
                        sanitize.ts
                        sleep.ts
                        snake-to-camel.ts
                        static-node-modules-for-vm.ts
                        style-text.ts
                        unreachable.ts
                        caniemail/
                            all-css-properties.ts
                            get-compatibility-stats-for-entry.ts
                            get-css-functions.ts
                            get-css-property-names.ts
                            get-css-property-with-value.ts
                            get-css-unit.ts
                            get-element-attributes.ts
                            get-element-names.ts
                            ast/
                                get-object-variables.spec.ts
                                get-object-variables.ts
                                get-used-style-properties.spec.ts
                                get-used-style-properties.ts
                                __snapshots__/
                                    get-object-variables.spec.ts.snap
                            tailwind/
                                get-tailwind-config.spec.ts
                                get-tailwind-config.ts
                                get-tailwind-metadata.spec.ts
                                get-tailwind-metadata.ts
                                tests/
                                    dummy-email-template.tsx
                                    tailwind.config.ts
                        esbuild/
                            escape-string-for-regex.ts
                            renderring-utilities-exporter.ts
                        testing/
                            js-email-export-default.js
                            js-email-test.js
                            mdx-email-test.js
                            request-response-email.tsx
                            vercel-invite-user.tsx
                        types/
                            as.ts
                            email-template.ts
                            error-object.ts
                            hot-reload-change.ts
                        __snapshots__/
                            get-email-component.spec.ts.snap
            emails/
                ProductUpdateEmail.tsx
                ShaderGradientEmail.tsx
                ShaderGradientUpdateEmail.tsx
            lib/
                emailContent.ts
        example-nextjs-dev/
            .eslintrc.json
            .gitignore
            CHANGELOG.md
            next.config.mjs
            package.json
            postcss.config.mjs
            README.md
            tailwind.config.ts
            tsconfig.json
            app/
                favicon.ico
                globals.css
                layout.tsx
                page.tsx
                customize-simple/
                    page.tsx
                fonts/
                    GeistMonoVF.woff
                    GeistVF.woff
                loop/
                    page.tsx
        examples/
            example-nextjs/
                .editorconfig
                .eslintignore
                .eslintrc
                .gitignore
                .prettierignore
                .prettierrc
                LICENSE
                next-env.d.ts
                next.config.js
                package.json
                postcss.config.js
                README.md
                sandbox.config.json
                tailwind.config.js
                tsconfig.json
                .vscode/
                    settings.json
                app/
                    global.css
                    head.tsx
                    layout.tsx
                    page.tsx
                public/
                    manifest.json
                    icons/
                        favicon.ico
                src/
                    index.d.ts
                    components/
                        canvas/
                            Scene.tsx
                            View.tsx
                        dom/
                            Layout.tsx
                    helpers/
                        global.ts
                        components/
                            Three.tsx
            example-vite-react/
                .gitignore
                eslint.config.js
                index.html
                package-lock.json
                package.json
                pnpm-lock.yaml
                README.md
                tsconfig.app.json
                tsconfig.json
                tsconfig.node.json
                vite.config.ts
                public/
                src/
                    App.css
                    App.tsx
                    index.css
                    main.tsx
                    vite-env.d.ts
                    assets/
        figma-plugin/
            manifest.json
            package.json
            README.md
            tsconfig.json
            webpack.config.js
            src/
                code.ts
                ui.css
                ui.html
                ui.tsx
        framer-plugin/
            .gitignore
            eslint.config.js
            framer.json
            index.html
            package.json
            README.md
            tsconfig.json
            vite.config.ts
            public/
            src/
                App.css
                App.tsx
                main.tsx
                vite-env.d.ts
    assets/
    packages/
        eslint-config-custom/
            index.js
            package.json
        shadergradient/
            .eslintrc.js
            .npmignore
            CHANGELOG.md
            package.json
            pnpm-lock.yaml
            tailwind.config.js
            tsconfig.json
            tsup.config.ts
            tsup.framer.config.ts
            src/
                consts.ts
                FramerControls.ts
                FramerShaderGradient.tsx
                index.ts
                module.d.ts
                presets.ts
                ShaderGradientCanvas.tsx
                types.ts
                hooks/
                    useInView.ts
                ShaderGradient/
                    index.ts
                    ShaderGradient.tsx
                    Axis/
                        Axis.tsx
                        CubicBezierLine.tsx
                        GizmoHelper.tsx
                        GizmoViewport.tsx
                        index.ts
                        Line.tsx
                        mergeRefs.ts
                        OrthographicCamera.tsx
                        useCamera.tsx
                        useFBO.tsx
                    Controls/
                        CameraControl.tsx
                        Controls.tsx
                        index.ts
                        useCameraAnimation.ts
                    Lights/
                        index.ts
                        Lights.tsx
                        Environment/
                            environment-assets.ts
                            EnvironmentMap.tsx
                            index.ts
                            useRGBELoader.ts
                    Mesh/
                        Geometry.tsx
                        index.ts
                        Materials.tsx
                        Mesh.tsx
                    PostProcessing/
                        index.ts
                        PostProcessing.tsx
                        lib/
                            pp/
                                BlendFunction.js
                                HalftonePass.ts
                                HalftoneShader.js
                                Pass.js
                                blending/
                                    BlendFunction.js
                                    BlendMode.js
                                    index.js
                                    glsl/
                                        add/
                                            shader.frag
                                        alpha/
                                            shader.frag
                                        average/
                                            shader.frag
                                        color-burn/
                                            shader.frag
                                        color-dodge/
                                            shader.frag
                                        darken/
                                            shader.frag
                                        difference/
                                            shader.frag
                                        divide/
                                            shader.frag
                                        exclusion/
                                            shader.frag
                                        lighten/
                                            shader.frag
                                        multiply/
                                            shader.frag
                                        negation/
                                            shader.frag
                                        normal/
                                            shader.frag
                                        overlay/
                                            shader.frag
                                        reflect/
                                            shader.frag
                                        screen/
                                            shader.frag
                                        soft-light/
                                            shader.frag
                                        subtract/
                                            shader.frag
                                from-threejs/
                                    postprocessing/
                                        EffectComposer.js
                                        MaskPass.js
                                        Pass.js
                                        RenderPass.js
                                        ShaderPass.js
                                    shaders/
                                        CopyShader.js
                shaders/
                    index.ts
                    shaderMaterial.ts
                    base/
                        fragment.glsl
                        index.ts
                        vertex.glsl
                    cosmic/
                        index.ts
                        plane/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                        sphere/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                        waterPlane/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                    defaults/
                        index.ts
                        plane/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                        sphere/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                        waterPlane/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                    glass/
                        index.ts
                        plane/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                        sphere/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                        waterPlane/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                    positionMix/
                        index.ts
                        plane/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                        sphere/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                        waterPlane/
                            fragment.glsl
                            index.ts
                            vertex.glsl
                utils/
                    color.ts
                    debug.ts
                    index.ts
                    platform.ts
                    live-reload/
                        bootstrap.ts
                        socket.ts
                        useRealtimeComponent.ts
        tailwind-config/
            package.json
            tailwind.config.js
        tsconfig/
            base.json
            nextjs.json
            package.json
            react-library.json
        ui/
            CHANGELOG.md
            package.json
            tailwind.config.js
            tsconfig.json
            tsup.framer.config.ts
            assets/
                email/
                hdr/
                    city.hdr
                    dawn.hdr
                    lobby.hdr
                lib/
                    b64.js
                    GIFEncoder.js
                    LZWEncoder.js
                    NeuQuant.js
                sounds/
            src/
                declarations.d.ts
                index.ts
                README.md
                store.ts
                styles.css
                utils.tsx
                components/
                    index.ts
                    FigmaPlugin/
                        ColorInput.tsx
                        DoubleNumberInput.tsx
                        index.ts
                        InputTitle.tsx
                        NumberInput.tsx
                        RangeSlider.tsx
                        slider.css
                        Slider.tsx
                        SupabaseClient.tsx
                        Test.tsx
                        TripleNumberInput.tsx
                    Shared/
                        BasicControls.tsx
                        index.ts
                        Spacing.tsx
                        TextAnimation.tsx
                        TextHover.tsx
                        ShaderGradientStateless/
                            index.ts
                            ShaderGradientStateless.tsx
                            ShaderGradientStatelessCanvas.tsx
                            useControlValues.ts
                            store/
                                index.ts
                                presetURLs.ts
                                store.ts
                                usePresetToStore.ts
                                useQueryState.ts
                                useSearchParamToStore.ts
                    Web/
                        Button.tsx
                        Icons.tsx
                        index.ts
                        ScrollableBox.tsx
                        SimpleSlider.tsx
                        Spacing.tsx
                        TriggerSection.tsx
                        Customize/
                            CustomizeColorInput.tsx
                            CustomizeRadio.tsx
                            CustomizeRangeSlider.tsx
                            CustomizeSlider.tsx
                            index.ts
                            CustomizeNumberInput/
                                CustomizeNumberInput.tsx
                                index.ts
                hooks/
                    useOnClickOutside.ts
                    usePropState.ts
                overrides/
                    FramerPlugin.tsx
                    index.ts
                    Shared.tsx
                    utils.tsx
                    FigmaPlugin/
                        consts.ts
                        exportGIF.ts
                        exportImage.ts
                        exportVideo.ts
                        FigmaApi.ts
                        Pricing.tsx
                        UI.tsx
                        useDBTable.ts
                        utils.ts
                        lib/
                            color.js
                            constants.js
                            index.js
                            lzwEncode.js
                            palettize.js
                            pnnquant2.js
                            rgb-packing.js
                            stream.js
                            gif.js/
                                LZWEncoder.js
                                TypedNeuQuant.js
                    Web/
                        index.ts
                        Pricing.tsx
                        Scroll.tsx
                        UI.tsx
                        useFPS.ts
                        useMemory.ts
```

## Core Logic Samples

### `package.json`
```
{
  "name": "shadergradient-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev --parallel",
    "dev:framer": "turbo run dev:framer --parallel",
    "dev:email": "turbo run dev:email --parallel",
    "dev:ui": "turbo run dev:ui --parallel",
    "start": "PORT=8000 turbo run start --parallel",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "changeset": "changeset add",
    "version-packages": "changeset version",
    "release": "turbo run build --filter=@shadergradient/react && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.1",
    "eslint": "^7.32.0",
    "eslint-config-custom": "workspace:*",
    "prettier": "^2.7.1",
    "prettier-plugin-tailwindcss": "^0.1.11",
    "turbo": "^2.1.2",
    "typescript": "5.7.3"
  },
  "packageManager": "pnpm@10.12.4",
  "engines": {
    "node": ">=14.0.0",
    "pnpm": ">=10.2.1"
  },
  "version": "0.0.1"
}
```

### `README.md`
```
# Shader Gradient v2

Customizable 3D, moving gradient for React. The v2 package is lean: it only ships the `ShaderGradient` renderer (and its canvas helper), while the stateless UI pieces now live in the separate `@shadergradient/ui` package.

![Intro](./assets/intro.gif)

# Table of contents

- 📦 [Installation](#installation)
- 📦 [Packages](#packages)
- 💻 [Usage](#usage)
- 📚 [Examples](#examples)
- 🎤 [Conference Talks](#conference-talks)
- 📝 [Contributing](#contributing)
- 🚀 [Future Plan](#future-plan)
- ⚖️ [License](#license)

# Installation

## Figma

[Figma Plugin](https://www.figma.com/community/plugin/1203016883447870818)

## Framer

[Framer Component (Copy this URL and paste it on Framer Canvas)](https://framer.com/m/ShaderGradient-oWuS.js)

## React

Install the core renderer and its peer deps.

```
# with yarn
yarn add @shadergradient/react @react-three/fiber three three-stdlib camera-controls
yarn add -D @types/three

# with npm
npm i @shadergradient/react @react-three/fiber three three-stdlib camera-controls
npm i -D @types/three

# with pnpm
pnpm add @shadergradient/react @react-three/fiber three three-stdlib camera-controls
pnpm add -D @types/three
```

Need the stateless control surfaces? Pull them from the `@shadergradient/ui` package (ESM build used by Framer/Figma), not from `@shadergradient/react`.

### Compatibility matrix

`@shadergradient/react` itself works on React 18 or 19, but the right `@react-three/fiber` version depends on your environment. **For Next.js 15 App Router specifically**, you must use R3F v9 + React 19 — R3F v8 is structurally incompatible with the App Router's vendored React 19 canary (see [#138](https://github.com/ruucm/shadergradient/issues/138) for the full trace).

| Environment                           | React          | @react-three/fiber   | three       |
| ------------------------------------- | -------------- | -------------------- | ----------- |
| **Next 15 — App Router**              | `^19.0.0`      | `^9.0.0`             | `>=0.158.0` |
| Next 14 / Next 15 Pages / Vite / etc. | `^18` or `^19` | matching `8.x`/`9.x` | `>=0.158.0` |

No `next.config` aliases or `transpilePackages` entries are required when you stay on these combinations.

# Packages

- `@shadergradient/react`
  - Ships only the renderer: `ShaderGradient` and `ShaderGradientCanvas`.
  - No built-in store or controls. Use your own state or pair with `@shadergradient/ui`.
- `@shadergradient/ui`
  - Stateless UI/control components extracted from the core package for Framer/Figma usage.
  - Not published to npm; consumed as an ESM bundle (see `packages/ui`).
- `shadergradient-old`
  - Legacy v1 package that bundled store + UI. Keep using this only if you rely on the old with-store build.

# Usage

Drop `ShaderGradient` inside `ShaderGradientCanvas` and drive it with props or a query string.

```tsx
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

function App() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0 }}
      pixelDensity={1.5}
      fov={45}
    >
      <ShaderGradient cDistance={32} cPolarAngle={125} />
    </ShaderGradientCanvas>
  )
}
```

Load settings from a URL (for example, one copied from [shadergradient.co/customize](https://www.shadergradient.co/customize)):

```tsx
<ShaderGradientCanvas>
  <ShaderGradient
    control='query'
    urlString='https://www.shadergradient.co/customize?animate=on&cDistance=3.6&cPolarAngle=90&color1=%2352ff89&color2=%23dbba95&color3=%23d0bce1&lightType=3d&shader=defaults&type=plane&uFrequency=5.5&uSpeed=0.4&uStrength=4'
  />
</ShaderGradientCanvas>
```

### Available Gradient Properties (Types)

```ts
type MeshT = {
  type?: 'plane' | 'sphere' | 'waterPlane'
  animate?: 'on' | 'off'
  uTime?: number
  uSpeed?: number
  uStrength?: number
  uDensity?: number
  uFrequency?: number
  uAmplitude?: number
  range?: 'enabled' | 'disabled' | string
  rangeStart?: number
  rangeEnd?: number
  loop?: 'on' | 'off'
  loopDuration?: number
  positionX?: number
  positionY?: number
  positionZ?: number
  rotationX?: number
  rotationY?: number
  rotationZ?: number
  color1?: string
  color2?: string
  color3?: string
  reflection?: number
  wireframe?: boolean
  shader?: string
  rotSpringOption?: any
  posSpringOption?: any
}

type GradientT = MeshT & {
  control?: 'query' | 'props'
  isFigmaPlugin?: boolean
  smoothTime?: number
  cAzimuthAngle?: number
  cPolarAngle?: number
  cDistance?: number
  cameraZoom?: number
  lightType?: '3d' | 'env'
  brightness?: number
  envPreset?: 'city' | 'dawn' | 'lobby'
  grain?: 'on' | 'off'
  grainBlending?: number
  zoomOut?: boolean
  toggleAxis?: boolean
  hoverState?: string
  enableTransition?: boolean
  enableCameraUpdate?: boolean
  urlString?: string
  onCameraUpdate?: (updates: Partial<GradientT>) => void
}
```

`ShaderGradientCanvas` also accepts `pixelDensity`, `fov`, `envBasePath`, GL overrides (`preserveDrawingBuffer`, `powerPreference`), and lazy-load controls (`lazyLoad`, `threshold`, `rootMargin`).

# Examples

- CRA Starter: [CodeSandbox](https://codesandbox.io/p/sandbox/github/ruucm/shadergradient/tree/main/apps/example-cra?file=%2Fsrc%2FApp.tsx)
- Next.js Starter (App Router): [CodeSandbox](https://codesandbox.io/p/sandbox/github/ruucm/shadergradient/tree/main/apps/example-nextjs-approuter)
- Next.js Starter: [CodeSandbox](https://codesandbox.io/p/sandbox/github/ruucm/shadergradient/tree/main/apps/example-nextjs)
- Vite + React 19 Starter: [CodeSandbox](https://codesandbox.io/p/sandbox/github/ruucm/shadergradient/tree/main/apps/examples/example-vite-react)

Figma and Framer demos still use the UI package internally:

- [Figma GIF Example](https://framer.com/projects/shadergradient-co-package-origin--zugKWPH3hb4TzPLbtN8y-aV7Di?node=v1ySO756L)
- [Framer Remix (Login required)](https://framer.com/projects/new?duplicate=sJitbgOn6on6Savojbyk)

# Conference Talks

[![FEConf 2024 ShaderGradient](./assets/feconf.png)](https://www.youtube.com/watch?v=CSChpoiRTIY)

# Contributing

## Setup

```
pnpm install
```

## Start development

```
pnpm dev
```

## Release

```
pnpm changeset
pnpm version-packages
```

then commit changes (message like v1.x.x)

```sh
# Release to npm
pnpm release

# Release it as ES Module (Hosted by GitHub Pages)
git push origin main
```

# Future Plan

- [x] Detatch framer-motion peer depenency (Seperate UI & Store Package)
- [x] Figma GIF Support
- [ ] More Shaders (Metalic, Glass, etc.)
- [x] Three.js version upgrade
- [x] Separate framer component bundles & shader gradient bundles
- [ ] Separate shader codes as a separate package, and make it reusable for JS, Vue, etc.
- [x] Framer Plugin
- [ ] Webflow Support
- [ ] Wix Support

# License

MIT © [ruucm](https://github.com/ruucm), [stone-skipper](https://github.com/stone-skipper)
```

### `turbo.json`
```
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "dev:framer": {
      "cache": false,
      "persistent": true
    },
    "dev:email": {
      "cache": false,
      "persistent": true
    },
    "dev:ui": {
      "cache": false,
      "persistent": true
    },
    "start": {
      "cache": false
    },
    "clean": {
      "cache": false
    }
  },
  "globalEnv": ["NODE_ENV"]
}
```

### `.changeset\config.json`
```
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### `.vscode\settings.json`
```
{
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

### `apps\email-previews\package.json`
```
{
  "name": "email-previews",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev:email": "email dev --dir ./emails --port 3005",
    "build": "email build --dir ./emails",
    "start": "email start",
    "export": "email export --dir ./emails"
  },
  "dependencies": {
    "@react-email/components": "1.0.1",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-email": "5.0.6"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "18.2.73",
    "@types/react-dom": "18.2.23",
    "typescript": "5.7.3"
  }
}
```

### `apps\email-previews\tsconfig.json`
```
{
  "compilerOptions": {
    "target": "ES2019",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "types": ["node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["emails", "lib", "react-email.config.ts"]
}
```

### `apps\email-previews\.react-email\CHANGELOG.md`
```
# @react-email/preview-server

## 5.0.6

### Patch Changes

- f2bb9e9: add missing favicon
- 1d14411: fix multiple lockfile warning during email build

## 5.0.5

### Patch Changes

- d89af46: Broken links to React lines of code in the toolbar

## 5.0.4

### Patch Changes

- 1d35e37: fix file names and extensions not being used in download

## 5.0.3

### Patch Changes

- 4861354: move most dependencies to devDependencies
- 7ab924c: fix unwanted dependency installation when typescript's not installed

## 5.0.2

### Patch Changes

- e0b7efa: fix sidebar misalignment with the topbar
- 872f33b: fix scrolling not working on email frame right after resizing

## 5.0.1

### Patch Changes

- 37b405b: Update link for Resend
- 56a696f: Increases the sleep time between bulk templates import to avoid exceeding the default API rate limit of 2 requests per second

## 5.0.0

### Major Changes

- 442f5b6: only check compatibility with tailwindcss@4

### Minor Changes

- 161083a: Integrate with Templates API so users can easily turn React Email templates into actual Resend templates
- 95c7417: Dark mode switcher emulating email client color inversion

### Patch Changes

- c6fa03e: improve color inversion code, don't remount iframe
- b6b027c: advise `npx` to run email setup command
- 18bc11a: fix compatibility checking not woring with inline object styles, and not working on properties such as `justifyContent`/`justify-content`
- e1ef323: improve reading flow for resend integration setup instructions
- 1b3176e: fallback to not text coloring for Node.js < 20
- f43f1ce: show separate timings for bundling/rendering an email template
- 397e98c: darken the canvas background when dark mode is enabled
- ef8702b: ui improvements
- 75d651b: reduce margins bellow buttons
- Updated dependencies [1e76981]
- Updated dependencies [442f5b6]
- Updated dependencies [2452b7d]
  - @react-email/tailwind@2.0.0

## 5.0.0-canary.12

### Patch Changes

- ef8702b: ui improvements

## 5.0.0-canary.11

### Patch Changes

- 75d651b: reduce margins bellow buttons

## 5.0.0-canary.10

### Patch Changes

- 397e98c: darken the canvas background when dark mode is enabled

## 5.0.0-canary.9

### Patch Changes

- e1ef323: improve reading flow for resend integration setup instructions

## 5.0.0-canary.8

### Patch Changes

- b6b027c: advise `npx` to run email setup command

## 5.0.0-canary.7

### Minor Changes

- 161083a: Integrate with Templates API so users can easily turn React Email templates into actual Resend templates

### Patch Changes

- f43f1ce: show separate timings for bundling/rendering an email template

## 5.0.0-canary.6

### Patch Changes

- c6fa03e: improve color inversion code, don't remount iframe
  - @react-email/tailwind@2.0.0-canary.4

## 5.0.0-canary.5

### Patch Changes

- @react-email/tailwind@2.0.0-canary.3

## 5.0.0-canary.4

### Patch Changes

- Updated dependencies [1e76981]
  - @react-email/tailwind@2.0.0-canary.2

## 5.0.0-canary.3

### Minor Changes

- 95c7417: Dark mode switcher emulating email client color inversion

## 5.0.0-canary.2

### Patch Changes

- 1b3176e: fallback to not text coloring for Node.js < 20

## 5.0.0-canary.1

### Patch Changes

- 18bc11a: fix compatibility checking not woring with inline object styles, and not working on properties such as `justifyContent`/`justify-content`

## 5.0.0-canary.0

### Major Changes

- 442f5b6: only check compatibility with tailwindcss@4

### Patch Changes

- Updated dependencies [442f5b6]
  - @react-email/tailwind@2.0.0-canary.1

## 4.3.2

### Patch Changes

- f38ed50: fix imports of files with implicit extensions, and secondary segment like `.spec` failing to hot reload

## 4.3.1

### Patch Changes

- c4d149e: make everything in the global for the UI available to email contexts using a Proxy

## 4.3.0

### Minor Changes

- c0f6ec2: Added resize snapping, refined UI and improved presets

## 4.2.12

## 4.2.11

### Patch Changes

- 0700b91: fix data-source-\* attributes in the html code view

## 4.2.10

### Patch Changes

- ffdb3a0: Update nextjs to 15.5.2

## 4.2.9

### Patch Changes

- 1e53b4c: use `styleText` from `node:util` instead of `chalk`

## 4.2.8

## 4.2.7

### Patch Changes

- 6997a9e: fix broken file tree animation on built preview server

## 4.2.6

### Patch Changes

- d3cc64d: use unformmated markup to send emails, and to render into the iframe

## 4.2.5

## 4.2.4

### Patch Changes

- 57b8bb8: fix custom JSX runtime trying to be run as ESM on ESM projects

## 4.2.3

## 4.2.2

## 4.2.1

### Patch Changes

- c273405: pin all dependencies to avoid compatibility issues of the built preview server

## 4.2.0

### Minor Changes

- e52818c: add custom error handling for prettier's syntax errors

## 4.1.3

### Patch Changes

- 09d7d9d: improved method of resolving tailwind configs when checking compatibility

## 4.1.2

### Patch Changes

- a8f4796: fix rendering utilities exporter plugin not running for symlinks

## 4.1.1

## 4.1.0

### Patch Changes

- e173b44: Use the same version for the preview-server and react-email
- e33be94: fix range rounded borders, tearing when selecting different lines
- 87b9601: infinte fetches due to improper effect dependency

## 4.1.0-canary.12

### Patch Changes

- e33be94: fix range rounded borders, tearing when selecting different lines
- 87b9601: infinte fetches due to improper effect dependency

## 4.1.0-canary.11

### Patch Changes

- 272b21e: fix the forced `color-scheme: dark` for the preview

## 4.1.0-canary.10

### Patch Changes

- caa4a31: fix hot reloading with collapsed directories

## 4.1.0-canary.9

### Patch Changes

- 40fb596: Use the same version for the preview-server and react-email

## 1.0.0-canary.1

### Patch Changes

- efb4db2: fix `<svg>` not being flagged as incompatible
```

### `apps\email-previews\.react-email\license.md`
```
Copyright 2024 Plus Five Five, Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### `apps\email-previews\.react-email\module-punycode.d.ts`
```
declare module 'module-punycode' {
  export * from 'node:punycode';
}
```
