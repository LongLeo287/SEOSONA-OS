# Architecture Extract: html-anything

## Directory Structure
```text
html-anything/
    .gitignore
    AGENTS.md
    CLAUDE.md
    CONTRIBUTING.md
    CONTRIBUTING.zh-CN.md
    LICENSE
    package.json
    pnpm-lock.yaml
    pnpm-workspace.yaml
    PROGRESS.md
    README.md
    README.zh-CN.md
    .github/
        workflows/
            ci.yml
    docs/
        cover.html
        assets/
        pr-assets/
            history-versions/
        screenshots/
            skills/
    e2e/
        AGENTS.md
        package.json
        playwright.config.ts
        tsconfig.json
        scripts/
            playwright.ts
        ui/
            deploy-control.spec.ts
            export-menu.test.ts
            host-validation.spec.ts
    next/
        next.config.ts
        package.json
        postcss.config.mjs
        tsconfig.json
        vitest.config.ts
        public/
        src/
            middleware.ts
            app/
                favicon.ico
                globals.css
                layout.tsx
                page.tsx
                api/
                    agents/
                        route.ts
                    convert/
                        route.ts
                    deploy/
                        route.ts
                        config/
                            route.ts
                    draft/
                        route.ts
                    marketplace/
                        route.ts
                        install/
                            route.ts
                        packages/
                            [id]/
                                route.ts
                        _lib/
                            host-guard.ts
                            __tests__/
                                host-guard.test.ts
                    templates/
                        route.ts
                        [id]/
                            example/
                                route.ts
                            preview/
                                route.ts
            components/
                ai-prompt-bar.tsx
                convert-chip.tsx
                deck-viewer.tsx
                deploy-control.tsx
                drafts-menu.tsx
                editor-pane.tsx
                export-menu.tsx
                formats-gallery.tsx
                history-pane.tsx
                layout-mode-toggle.tsx
                preview-pane.tsx
                samples-gallery.tsx
                settings-modal.tsx
                tasks-sidebar.tsx
                template-picker.tsx
                toolbar.tsx
                welcome-modal.tsx
            lib/
                deck.ts
                drafts.ts
                extract-html.ts
                hyperframes.ts
                i18n.ts
                store.ts
                use-autosave.ts
                use-convert.ts
                use-deploy.ts
                use-draft.ts
                use-upload.ts
                agents/
                    argv.ts
                    detect.ts
                    invoke.ts
                    __tests__/
                        argv.test.ts
                deploy/
                    config.ts
                    url-check.ts
                    vercel.ts
                export/
                    bilibili.ts
                    bluesky.ts
                    clipboard.ts
                    deck.ts
                    download.ts
                    image.ts
                    markdown-roundtrip.ts
                    mastodon.ts
                    notion.ts
                    remotion.ts
                    wechat.ts
                    zhihu.ts
                    __tests__/
                        bilibili.test.ts
                        markdown-roundtrip.test.ts
                        mastodon.test.ts
                        notion.test.ts
                history/
                    db.test.ts
                    db.ts
                    is-current.test.ts
                    is-current.ts
                parsers/
                    auto.ts
                    file.ts
                security/
                    host-validation.test.ts
                    host-validation.ts
                skills/
                    install.ts
                    paths.ts
                    registry.ts
                    __tests__/
                        api.test.ts
                        cross-device.test.ts
                        install-rejections.test.ts
                        install.test.ts
                        loader-merge.test.ts
                        paths.test.ts
                        preflight.test.ts
                        spec.test.ts
                templates/
                    index.ts
                    loader.ts
                    scenarios.ts
                    shared.ts
                    skills/
                        article-magazine/
                            example.html
                            example.md
                            SKILL.md
                        blog-post/
                            example.html
                            SKILL.md
                        card-twitter/
                            example.html
                            example.md
                            SKILL.md
                        card-xiaohongshu/
                            example.html
                            example.md
                            SKILL.md
                        competitive-teardown/
                            example.html
                            example.md
                            SKILL.md
                            assets/
                                analyst-dossier.html
                                radar-map.html
                                war-room-grid.html
                        dashboard/
                            example.html
                            SKILL.md
                        data-report/
                            example.html
                            example.md
                            SKILL.md
                        dating-web/
                            example.html
                            SKILL.md
                        deck-blueprint/
                            example.html
                            SKILL.md
                        deck-course-module/
                            example.html
                            SKILL.md
                        deck-dir-key-nav/
                            example.html
                            SKILL.md
                        deck-graphify-dark/
                            example.html
                            SKILL.md
                        deck-guizang-editorial/
                            example.html
                            example.md
                            SKILL.md
                        deck-hermes-cyber/
                            example.html
                            SKILL.md
                        deck-magazine-web/
                            example.html
                            SKILL.md
                        deck-obsidian-claude/
                            example.html
                            SKILL.md
                        deck-open-slide-canvas/
                            example.html
                            example.md
                            SKILL.md
                        deck-pitch/
                            example.html
                            SKILL.md
                        deck-presenter-mode/
                            example.html
                            SKILL.md
                        deck-product-launch/
                            example.html
                            SKILL.md
                        deck-replit/
                            example.html
                            example.md
                            SKILL.md
                        deck-safety-alert/
                            example.html
                            SKILL.md
                        deck-simple/
                            example.html
                            SKILL.md
                        deck-swiss-international/
                            example.html
                            example.md
                            SKILL.md
                        deck-tech-sharing/
                            example.html
                            SKILL.md
                        deck-xhs-pastel/
                            example.html
                            SKILL.md
                        deck-xhs-post/
                            example.html
                            SKILL.md
                        deck-xhs-white/
                            example.html
                            SKILL.md
                        digital-eguide/
                            example.html
                            SKILL.md
                        doc-kami-parchment/
                            example.html
                            example.md
                            SKILL.md
                        docs-page/
                            example.html
                            SKILL.md
                        email-marketing/
                            example.html
                            SKILL.md
                        eng-runbook/
                            example.html
                            SKILL.md
                        exec-briefing-memo/
                            example.html
                            example.md
                            SKILL.md
                            assets/
                                board-memo.html
                                board-paper.html
                                decision-command.html
                        experiment-readout/
                            example.html
                            example.md
                            SKILL.md
                            assets/
                                growth-console.html
                                lab-notebook.html
                                product-readout.html
                        finance-report/
                            example.html
                            SKILL.md
                        flowai-team-dashboard/
                            example.html
                            SKILL.md
                        frame-data-chart-nyt/
                            example.html
                            example.md
                            SKILL.md
                        frame-flowchart-sticky/
                            example.html
                            example.md
                            SKILL.md
                        frame-glitch-title/
                            example.html
                            example.md
                            SKILL.md
                        frame-light-leak-cinema/
                            example.html
                            example.md
                            SKILL.md
                        frame-liquid-bg-hero/
                            example.html
                            example.md
                            SKILL.md
                        frame-logo-outro/
                            example.html
                            example.md
                            SKILL.md
                        frame-macos-notification/
                            example.html
                            example.md
                            SKILL.md
                        gamified-app/
                            example.html
                            SKILL.md
                        hr-onboarding/
                            example.html
                            SKILL.md
                        invoice/
                            example.html
                            SKILL.md
                        kanban-board/
                            example.html
                            SKILL.md
                        live-dashboard/
                            example.html
                            SKILL.md
                        magazine-poster/
                            example.html
                            SKILL.md
                        meeting-notes/
                            example.html
                            SKILL.md
                        mobile-app/
                            example.html
                            SKILL.md
                        mobile-onboarding/
                            example.html
                            SKILL.md
                        mockup-device-3d/
                            example.html
                            example.md
                            SKILL.md
                        motion-frames/
                            example.html
                            SKILL.md
                        pm-spec/
                            example.html
                            SKILL.md
                        poster-hero/
                            example.html
                            example.md
                            SKILL.md
                        ppt-keynote/
                            example.html
                            example.md
                            SKILL.md
                        pricing-page/
                            example.html
                            SKILL.md
                        prototype-web/
                            example.html
                            example.md
                            SKILL.md
                        resume-modern/
                            example.html
                            example.md
                            SKILL.md
                        saas-landing/
                            example.html
                            SKILL.md
                        social-carousel/
                            example.html
                            SKILL.md
                        social-media-dashboard/
                            example.html
                            SKILL.md
                        social-media-matrix/
                            example.html
                            SKILL.md
                        social-reddit-card/
                            example.html
                            example.md
                            SKILL.md
                        social-spotify-card/
                            example.html
                            example.md
                            SKILL.md
                        social-x-post-card/
                            example.html
                            example.md
                            SKILL.md
                        sprite-animation/
                            example.html
                            SKILL.md
                        team-okrs/
                            example.html
                            SKILL.md
                        vfx-text-cursor/
                            example.html
                            example.md
                            SKILL.md
                        video-hyperframes/
                            example.html
                            example.md
                            SKILL.md
                        waitlist-page/
                            example.html
                            SKILL.md
                        web-proto-brutalist/
                            example.html
                            SKILL.md
                        web-proto-editorial/
                            example.html
                            SKILL.md
                        web-proto-soft/
                            example.html
                            SKILL.md
                        weekly-update/
                            example.html
                            SKILL.md
                        wireframe-sketch/
                            example.html
                            SKILL.md
                    __tests__/
                        refresh.test.ts
                __tests__/
                    extract-html.test.ts
    scripts/
        guard.ts
```

## Core Logic Samples

### `package.json`
```
{
  "name": "@html-anything/workspace",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "packageManager": "pnpm@10.33.2",
  "devDependencies": {
    "tsx": "^4.22.1"
  }
}
```

### `e2e\package.json`
```
{
  "name": "@html-anything/e2e",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "type": "module",
  "scripts": {
    "test": "playwright test -c playwright.config.ts",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "playwright:clean": "tsx scripts/playwright.ts clean"
  },
  "devDependencies": {
    "@playwright/test": "^1.60.0",
    "@types/node": "^20",
    "jszip": "^3.10.1",
    "tsx": "^4.22.1",
    "typescript": "^5"
  }
}
```

### `e2e\playwright.config.ts`
```
import { defineConfig, devices } from "@playwright/test";

const webPort = Number(process.env.HTML_ANYTHING_E2E_PORT) || 3317;
const baseURL = `http://127.0.0.1:${webPort}`;

export default defineConfig({
  testDir: "./ui",
  outputDir: "./ui/reports/test-results",
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 7_500,
  },
  reporter: process.env.CI
    ? [
        ["github"],
        ["list"],
        ["html", { open: "never", outputFolder: "./ui/reports/playwright-html-report" }],
        ["json", { outputFile: "./ui/reports/results.json" }],
        ["junit", { outputFile: "./ui/reports/junit.xml" }],
      ]
    : [
        ["list"],
        ["html", { open: "never", outputFolder: "./ui/reports/playwright-html-report" }],
      ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `pnpm -F @html-anything/next build && pnpm -F @html-anything/next exec next start -p ${webPort}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
```

### `e2e\tsconfig.json`
```
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["playwright.config.ts", "scripts/**/*.ts", "ui/**/*.ts"],
  "exclude": ["node_modules", "ui/reports", "ui/test-results"]
}
```

### `e2e\scripts\playwright.ts`
```
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const e2eDir = path.resolve(scriptDir, "..");
const uiDir = path.join(e2eDir, "ui");

type Command = () => Promise<void>;

const commands: Record<string, Command> = {
  clean: cleanArtifacts,
  help: async () => printUsage(),
};

const commandName = process.argv[2] ?? "help";
const command = commands[commandName];

if (command == null) {
  console.error(`Unknown e2e Playwright helper command: ${commandName}`);
  printUsage();
  process.exitCode = 1;
} else {
  await command();
}

async function cleanArtifacts(): Promise<void> {
  const reportsDir = path.join(uiDir, "reports");
  const targets = [
    path.join(uiDir, "test-results"),
    path.join(reportsDir, "test-results"),
    path.join(reportsDir, "playwright-html-report"),
    path.join(reportsDir, "results.json"),
    path.join(reportsDir, "junit.xml"),
    path.join(uiDir, ".DS_Store"),
  ];

  await Promise.all(targets.map((target) => rm(target, { recursive: true, force: true })));
  await mkdir(path.join(reportsDir, "test-results"), { recursive: true });

  console.log("Cleaned e2e UI Playwright artifacts.");
}

function printUsage(): void {
  console.log(`Usage: tsx scripts/playwright.ts <command>

Commands:
  clean    Remove e2e UI Playwright runtime data and reports
  help     Show this help
`);
}
```

### `e2e\ui\deploy-control.spec.ts`
```
import { expect, test, type Page } from "@playwright/test";

const STORE_KEY = "html-everything-store";

const generatedHtml = `<!doctype html>
<html>
  <head><title>Deploy Fixture</title></head>
  <body><main><h1>Deploy Fixture</h1></main></body>
</html>`;

async function seedStore(page: Page) {
  const now = 1_700_000_000_000;
  const task = {
    id: "task_deploy_ui",
    name: "Deploy UI fixture",
    content: "Deploy UI fixture",
    format: "html",
    templateId: "article-magazine",
    html: generatedHtml,
    status: "done",
    log: [],
    stats: { outputBytes: generatedHtml.length, deltaCount: 1 },
    createdAt: now,
    updatedAt: now,
  };

  await page.addInitScript(
    ({ key, taskFixture }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          state: {
            tasks: [taskFixture],
            activeTaskId: taskFixture.id,
            selectedAgent: "test-agent",
            agentModels: {},
            agentBinOverrides: {},
            welcomeAck: true,
            sidebarCollapsed: false,
            locale: "en",
            layoutMode: "split",
          },
          version: 7,
        }),
      );
    },
    {
      key: STORE_KEY,
      taskFixture: task,
    },
  );
}

test.describe("Deploy control", () => {
  test("dismisses the latest deploy result without deleting history", async ({
    page,
  }) => {
    await seedStore(page);

    await page.route("**/api/deploy/config?provider=vercel", (route) =>
      route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ configured: true }),
      }),
    );
    await page.route("**/api/deploy", async (route, request) => {
      if (request.method() !== "POST") {
        await route.continue();
        return;
      }
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          providerId: "vercel",
          url: "https://deploy-fixture.vercel.app",
          deploymentId: "dpl_fixture",
          target: "production",
          status: "ready",
        }),
      });
    });

    await page.goto("/");

    const publishButton = page.getByRole("button", { name: /publish/i });
    await expect(publishButton).toBeEnabled();

    await publishButton.click();

    await expect(page.getByText("Live at")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "https://deploy-fixture.vercel.app" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "Dismiss" }).click();

    await expect(page.getByText("Live at")).toHaveCount(0);
    await page.getByTitle("Past deployments").click();
    await expect(
      page.getByRole("link", { name: "https://deploy-fixture.vercel.app" }),
    ).toBeVisible();
  });
});
```

### `e2e\ui\export-menu.test.ts`
```
import { expect, test, type Page } from "@playwright/test";
import JSZip from "jszip";
import { readFile } from "node:fs/promises";

type SeedOptions = {
  html: string;
  content?: string;
  locale?: "en" | "zh-CN";
};

const STORE_KEY = "html-everything-store";

const plainHtml = `<!doctype html>
<html>
  <head><title>Plain Export</title></head>
  <body><main><h1>Plain Export</h1><p>No video frames here.</p></main></body>
</html>`;

const hyperframesHtml = `<!doctype html>
<html>
  <head>
    <title>Sample Reel</title>
    <style>body { margin: 0; background: #101827; color: white; }</style>
  </head>
  <body class="deck-shell" style="font-family: Inter, sans-serif;">
    <section class="frame active" data-duration="2000" data-transition="fade">
      <h1>Opening Frame</h1>
      <!-- frame:1 duration:2000 transition:fade -->
    </section>
    <section class="frame" data-duration="3000" data-transition="cut">
      <h1>Closing Frame</h1>
      <!-- frame:2 duration:3000 transition:cut -->
    </section>
    <!-- HYPERFRAMES_META: {"frames":[{"i":1,"duration":2000,"transition":"fade","scene":"Opening"},{"i":2,"duration":3000,"transition":"cut","scene":"Closing"}]} -->
  </body>
</html>`;

async function seedStore(page: Page, opts: SeedOptions) {
  const now = 1_700_000_000_000;
  const task = {
    id: "task_export_ui",
    name: "Export UI fixture",
    content: opts.content ?? "Export UI fixture",
    format: "html",
    templateId: "video-hyperframes",
    html: opts.html,
    status: "done",
    log: [],
    stats: { outputBytes: opts.html.length, deltaCount: 1 },
    createdAt: now,
    updatedAt: now,
  };

  await page.addInitScript(
    ({ key, taskFixture, locale }) => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          state: {
            tasks: [taskFixture],
            activeTaskId: taskFixture.id,
            selectedAgent: "test-agent",
            agentModels: {},
            welcomeAck: true,
            sidebarCollapsed: false,
            locale,
            layoutMode: "split",
          },
          version: 5,
        }),
      );
    },
    {
      key: STORE_KEY,
      taskFixture: task,
      locale: opts.locale ?? "en",
    },
  );
}

test.describe("Export menu", () => {
  test("keeps Remotion hidden for regular HTML exports", async ({ page }) => {
    await seedStore(page, { html: plainHtml });

    await page.goto("/");
    const exportButton = page.getByRole("button", { name: /export/i });
    await expect(exportButton).toBeEnabled();

    await exportButton.click();
    const menu = page.getByTestId("export-menu");

    await expect(menu.getByText("Copy to platform")).toBeVisible();
    await expect(menu.getByRole("button", { name: /HTML source/ })).toBeVisible();
    await expect(menu.getByRole("button", { name: /\.html single file/ })).toBeVisible();
    await expect(menu.getByText(/Hyperframes/)).toHaveCount(0);
    await expect(menu.getByRole("button", { name: /Remotion project/ })).toHaveCount(0);
  });

  test("exports a Hyperframes Remotion project zip from the UI", async ({ page }) => {
    await seedStore(page, { html: hyperframesHtml });

    await page.goto("/");
    await page.getByRole("button", { name: /export/i }).click();
    const menu = page.getByTestId("export-menu");

    await expect(menu.getByText("Hyperframes · 2 frames")).toBeVisible();
    const remotionButton = menu.getByRole("button", { name: /Remotion project \(\.zip\)/ });
    await expect(remotionButton).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await remotionButton.click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/^sample-reel-remotion-\d+\.zip$/);

    const downloadPath = await download.path();
    expect(downloadPath).toBeTruthy();
    const zip = await JSZip.loadAsync(await readFile(downloadPath!));

    expect(Object.keys(zip.files).sort()).toEqual(
      expect.arrayContaining([
        "README.md",
        "hyperframes.html",
        "hyperframes.meta.json",
        "package.json",
        "public/frames/frame-01.html",
        "public/frames/frame-02.html",
        "remotion.config.ts",
        "src/Frame.tsx",
        "src/Root.tsx",
        "src/Video.tsx",
        "src/index.ts",
        "tsconfig.json",
      ]),
    );

    const rootTsx = await zip.file("src/Root.tsx")!.async("string");
    const videoTsx = await zip.file("src/Video.tsx")!.async("string");
    const frameTsx = await zip.file("src/Frame.tsx")!.async("string");
    const frameOne = await zip.file("public/frames/frame-01.html")!.async("string");
    const readme = await zip.file("README.md")!.async("string");

    expect(rootTsx).toContain("durationInFrames={138}");
    expect(frameTsx).toContain('staticFile(src)');
    expect(videoTsx).toContain("TransitionSeries.Transition");
    expect(videoTsx).toContain("presentation={fade()}");
    expect(videoTsx).toContain('durationInFrames: 60, transition: "fade", scene: "Opening"');
    expect(videoTsx).toContain('durationInFrames: 90, transition: "cut", scene: "Closing"');
    expect(frameOne).toContain('<section class="frame active" data-duration="2000">');
    expect(frameOne).toContain("Opening Frame");
    expect(readme).toContain("2 frames");
    expect(readme).toContain("Cross-fades use");

    await expect(page.getByText(/Remotion project zipped/)).toBeVisible();
  });

  test("shows the Hyperframes export affordance in Chinese locale", async ({ page }) => {
    await seedStore(page, { html: hyperframesHtml, locale: "zh-CN" });

    await page.goto("/");
    await page.getByRole("button", { name: /导出/ }).click();
    const menu = page.getByTestId("export-menu");

    await expect(menu.getByText("Hyperframes · 共 2 帧")).toBeVisible();
    await expect(menu.getByRole("button", { name: /Remotion 项目 \(\.zip\)/ })).toBeVisible();
  });
});
```

### `e2e\ui\host-validation.spec.ts`
```
/**
 * End-to-end verification that the API surface refuses requests whose `Host`
 * header isn't on the loopback allowlist. The exact rebinding attack we are
 * defending against would deliver these requests from a real browser tab
 * after a DNS flip; here we use a raw `request.fetch` so we can forge the
 * header directly.
 *
 * The Playwright webServer in `e2e/playwright.config.ts` runs
 * `next start -p 3317`, which binds to every interface by default. The
 * default `baseURL` resolves to `127.0.0.1:3317` — the loopback path. To
 * exercise the rejection path we override the `Host` header to attacker-
 * controlled values while still dialing the real loopback IP.
 *
 * The accept-loopback tests prove the default dev path keeps working —
 * gating on Host must not break the common case where the user opens
 * `http://localhost:3317/` in a browser on their own machine.
 */
import { test, expect, request as playwrightRequest } from "@playwright/test";

const API_PATHS = [
  "/api/agents",
  "/api/templates",
  "/api/deploy/config?provider=vercel",
] as const;

// Matches the `webServer.url` in e2e/playwright.config.ts (port 3317). Used as
// a fallback when the `baseURL` fixture is undefined — exactOptionalPropertyTypes
// rejects passing `string | undefined` to newContext's `baseURL?: string`.
const DEFAULT_BASE_URL = "http://127.0.0.1:3317";

test.describe("API host-header validation", () => {
  test("accepts loopback Host (127.0.0.1) — default dev path", async ({ baseURL }) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: baseURL ?? DEFAULT_BASE_URL,
      extraHTTPHeaders: { Host: "127.0.0.1:3317" },
    });
    for (const p of API_PATHS) {
      const r = await ctx.get(p);
      // Any 2xx / 4xx that ISN'T 403 from this middleware passes — the route
      // may legitimately 400 (missing query / not configured) but it should
      // not be the host-rejection 403.
      if (r.status() === 403) {
        const body = await r.json().catch(() => ({}));
        expect(body.error, `loopback host rejected on ${p}: ${JSON.stringify(body)}`).not.toBe(
          "Host not allowed",
        );
      }
    }
    await ctx.dispose();
  });

  test("accepts localhost Host — default dev path", async ({ baseURL }) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: baseURL ?? DEFAULT_BASE_URL,
      extraHTTPHeaders: { Host: "localhost:3317" },
    });
    const r = await ctx.get("/api/agents");
    expect(r.status()).not.toBe(403);
    await ctx.dispose();
  });

  test("rejects attacker.example Host on every API path", async ({ baseURL }) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: baseURL ?? DEFAULT_BASE_URL,
      extraHTTPHeaders: { Host: "attacker.example" },
    });
    for (const p of API_PATHS) {
      const r = await ctx.get(p);
      expect(r.status(), `${p} should reject attacker.example`).toBe(403);
      const body = await r.json();
      expect(body.error).toBe("Host not allowed");
    }
    await ctx.dispose();
  });

  test("rejects POST /api/convert with attacker Host (RCE vector)", async ({ baseURL }) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: baseURL ?? DEFAULT_BASE_URL,
      extraHTTPHeaders: { Host: "attacker.example" },
    });
    const r = await ctx.post("/api/convert", {
      data: { agent: "claude", templateId: "deck-swiss-international", content: "ignore" },
    });
    expect(r.status(), "POST /api/convert must reject forged Host (RCE vector)").toBe(403);
    await ctx.dispose();
  });

  test("rejects PUT /api/deploy/config with attacker Host (token-write vector)", async ({
    baseURL,
  }) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: baseURL ?? DEFAULT_BASE_URL,
      extraHTTPHeaders: { Host: "attacker.example" },
    });
    const r = await ctx.put("/api/deploy/config?provider=vercel", {
      data: { token: "attacker-token" },
    });
    expect(r.status()).toBe(403);
    await ctx.dispose();
  });

  test("rejects subdomain-tricks (localhost.attacker.example)", async ({ baseURL }) => {
    const ctx = await playwrightRequest.newContext({
      baseURL: baseURL ?? DEFAULT_BASE_URL,
      extraHTTPHeaders: { Host: "localhost.attacker.example" },
    });
    const r = await ctx.get("/api/agents");
    expect(r.status()).toBe(403);
    await ctx.dispose();
  });

  test("rejects empty Host", async ({ baseURL }) => {
    // A single space is deterministically transmitted; per RFC 7230 the
    // receiving parser strips the surrounding OWS and the server sees an
    // empty `host`. The validator's `stripPort.trim()` reduces it to "" and
    // `isAllowedHost("")` returns false → 403. An empty-string value would
    // be at the mercy of Playwright's header-serialization behavior (it may
    // drop the entry, in which case the request goes out with the default
    // loopback Host and the test passes for the wrong reason).
    const ctx = await playwrightRequest.newContext({
      baseURL: baseURL ?? DEFAULT_BASE_URL,
      extraHTTPHeaders: { Host: " " },
    });
    const r = await ctx.get("/api/agents");
    // Some HTTP stacks reject empty Host headers themselves with 400 before
    // it reaches middleware. Either 400 or 403 is acceptable; the key
    // invariant is "no 200".
    expect([400, 403]).toContain(r.status());
    await ctx.dispose();
  });
});
```

### `next\next.config.ts`
```
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

### `next\package.json`
```
{
  "name": "@html-anything/next",
  "version": "0.1.0",
  "private": true,
  "license": "Apache-2.0",
  "scripts": {
    "dev": "next",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "diff": "^9.0.0",
    "dompurify": "^3.4.2",
    "highlight.js": "^11.11.1",
    "idb": "^8.0.3",
    "jszip": "^3.10.1",
    "juice": "^11.1.1",
    "lucide-react": "^1.14.0",
    "marked": "^18.0.3",
    "modern-screenshot": "^4.7.0",
    "next": "16.2.6",
    "papaparse": "^5.5.3",
    "pptxgenjs": "^4.0.1",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "xlsx": "^0.18.5",
    "zustand": "^5.0.13"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/dompurify": "^3.2.0",
    "@types/node": "^20",
    "@types/papaparse": "^5.5.2",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "fake-indexeddb": "^6.2.5",
    "happy-dom": "^20.9.0",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^4.1.6"
  }
}
```
