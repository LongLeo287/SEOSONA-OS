# KI: JamboChen/endfield-calc

## Overview
Repository with 440 files across 35 directories. Primary language: TypeScript (59 files).

## Tech Stack (from code)
- TypeScript (59 files)
- TypeScript (React) (52 files)
- JavaScript (1 files)
- **Total:** 440 files, 35 directories
- **File types:** .png: 204, .json: 97, .ts: 59, .tsx: 52, .md: 11, .yaml: 2, .gif: 2, .svg: 2

## Public API / Exports
- `buildNodeIndex` from `src\lib\aic-cascade.ts`
- `buildDependentsIndex` from `src\lib\aic-cascade.ts`
- `arePrereqsMet` from `src\lib\aic-cascade.ts`
- `canActivate` from `src\lib\aic-cascade.ts`
- `ca` from `src\lib\aic-cascade.ts`
- `GATED_FACILITIES` from `src\lib\aic-research-helpers.ts`
- `ALWAYS_UNLOCKED_FACILITIES` from `src\lib\aic-research-helpers.ts`
- `capKey` from `src\lib\aic-research-helpers.ts`
- `computeUnlockedFacilities` from `src\lib\aic-research-helpers.ts`
- `ProductionMaps` from `src\lib\calculator-types.ts`
- `ItemNode` from `src\lib\calculator-types.ts`
- `RecipeNodeData` from `src\lib\calculator-types.ts`
- `BipartiteGraph` from `src\lib\calculator-types.ts`
- `SCCInfo` from `src\lib\calculator-types.ts`
- `MetastorageFlow` from `src\lib\calculator-types.ts`
- `FlowData` from `src\lib\calculator-types.ts`
- `FlowSolveMetrics` from `src\lib\calculator-types.ts`
- `InvalidSCCInfo` from `src\lib\calculator-types.ts`
- `FlowRect` from `src\lib\edge-fit.ts`
- `ViewportLike` from `src\lib\edge-fit.ts`
- `BACKWARD_ARC_VERTICAL` from `src\lib\edge-fit.ts`
- `BACKWARD_ARC_HORIZONTAL` from `src\lib\edge-fit.ts`
- `edgeBounds` from `src\lib\edge-fit.ts`
- `computeEdgeFitView` from `src\lib\edge-fit.ts`
- `facilityIconUrl` from `src\lib\facility-icons.ts`
- `isMonochromeFacilityIcon` from `src\lib\facility-icons.ts`
- `SearchCandidate` from `src\lib\flow-search.ts`
- `filterSearchCandidates` from `src\lib\flow-search.ts`
- `SpotlightSet` from `src\lib\flow-spotlight.ts`
- `getNeighborhood` from `src\lib\flow-spotlight.ts`

## Dependencies
### Dependencies (from package.json)
- `@bubblyworld/highs-ts`: ^1.2.0
- `@radix-ui/react-collapsible`: ^1.1.12
- `@radix-ui/react-dialog`: ^1.1.15
- `@radix-ui/react-dropdown-menu`: ^2.1.16
- `@radix-ui/react-label`: ^2.1.7
- `@radix-ui/react-select`: ^2.2.6
- `@radix-ui/react-separator`: ^1.1.7
- `@radix-ui/react-slot`: ^1.2.3
- `@radix-ui/react-switch`: ^1.2.6
- `@radix-ui/react-tabs`: ^1.1.13
- `@radix-ui/react-toggle`: ^1.1.10
- `@radix-ui/react-toggle-group`: ^1.1.11
- `@radix-ui/react-tooltip`: ^1.2.8
- `@tailwindcss/vite`: ^4.1.16
- `@xyflow/react`: ^12.9.3
- `class-variance-authority`: ^0.7.1
- `clsx`: ^2.1.1
- `elkjs`: ^0.11.0
- `html-to-image`: ^1.11.13
- `i18next`: ^26.3.0

### Dev Dependencies
- `@eslint/js`: ^10.0.1
- `@types/node`: ^24.6.0
- `@types/pngjs`: ^6.0.5
- `@types/react`: ^19.1.16
- `@types/react-dom`: ^19.1.9
- `@vitejs/plugin-react`: ^6.0.1
- `eslint`: ^10.4.1
- `eslint-plugin-react-hooks`: ^7.1.1
- `eslint-plugin-react-refresh`: ^0.4.22
- `globals`: ^17.6.0
- `i18next-cli`: ^1.58.1
- `knip`: ^6.15.0
- `pngjs`: ^7.0.0
- `tw-animate-css`: ^1.4.0
- `typescript`: ~5.9.3

## Imports Detected in Source
- `@/components`
- `@/data`
- `@/i18n`
- `@/lib`
- `@/types`
- `@bubblyworld/highs-ts`
- `@tailwindcss/vite`
- `@vitejs/plugin-react`
- `@xyflow/react`
- `child_process`
- `fs`
- `path`
- `react`
- `react-i18next`
- `sonner`
- `vitest`

## Available Commands
- `npm run dev` -- `vite`
- `npm run build` -- `tsc -b && vite build`
- `npm run build:beta` -- `tsc -b && vite build --base /endfield-calc/beta/ --outDir dist/beta --emptyOutDi`
- `npm run lint` -- `eslint .`
- `npm run preview` -- `vite preview`
- `npm run knip` -- `knip`
- `npm run test` -- `vitest`
- `npm run extract:ids` -- `bun run scripts/extract-ids.ts`
- `npm run extract:facilities` -- `bun run scripts/extract-facilities.ts`
- `npm run extract:recipes` -- `bun run scripts/extract-recipes.ts`
- `npm run extract:items` -- `bun run scripts/extract-items.ts`
- `npm run extract:metastorage` -- `bun run scripts/extract-metastorage.ts`

## File Structure
```
  .dockerignore
  .gitattributes
  .gitignore
  CLAUDE.md
  CONTRIBUTING.md
  Dockerfile
  LICENSE
  README.md
  README_zh.md
  components.json
  compose.yaml
  eslint.config.js
  i18next.config.ts
  index.html
  knip.json
  nginx.conf
  package.json
  pnpm-lock.yaml
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  .claude/
    rules/
      domain-settings.md
      i18n.md
      mappers.md
      packer.md
      prefill.md
      raws.md
      solver.md
  img/
    table-hover-demo.gif
    tree-comparison.gif
  public/
    logo.svg
    robots.txt
    sitemap.xml
    images/
      loading.png
      no-results.png
      domains/
        deco_domain_1.png
        deco_domain_2.png
      facilities/
        component_mc_1.png
        dismantler_1.png
        filling_powder_mc_1.png
        furnance_1.png
        grinder_1.png
        liquid_clean_gate_1.png
        liquid_cleaner_1.png
        liquid_purifier_1.png
        liquid_recycle_gate_1.png
        loader_1.png
        mix_pool_1.png
        mix_pool_2.png
        planter_1.png
        pump_1.png
        pump_2.png
        seedcollector_1.png
        shaper_1.png
        thickener_1.png
        tools_assebling_mc_1.png
        unloader_1.png
        winder_1.png
        xiranite_oven_1.png
      items/
        item_activity_xiranite_bottle.png
        item_activity_xiranite_cmpt.png
        item_activity_xiranite_enr_bottle.png
        item_activity_xiranite_enr_cmpt.png
        item_activity_xiranite_enr_hulu.png
        item_activity_xiranite_enr_tool.png
        item_activity_xiranite_hulu.png
        item_bottled_food_1.png
        item_bottled_food_2.png
        item_bottled_food_3.png
        item_bottled_food_4.png
        item_bottled_food_5.png
        item_bottled_rec_hp_1.png
        item_bottled_rec_hp_2.png
        item_bottled_rec_hp_3.png
        item_bottled_rec_hp_4.png
        item_bottled_rec_hp_5.png
        item_carbon_enr.png
        item_carbon_enr_powder.png
      
```

## Key Source Excerpts
### vite.config.ts
```typescript
import { defineConfig, type Plugin } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "child_process";
import fs from "fs";

/**
 * Copy the HiGHS WASM blob into Vite's output `assets/` directory.
 *
 * The `@bubblyworld/highs-ts` package's emscripten-bundled wrapper
 * (`build/highs.js`) loads its WASM via
 *
 *     new URL('highs.wasm', import.meta.url).href
 *
 * inside the bundled JS chunk. Vite emits that JS chunk as
 * `dist/assets/highs-<hash>.js`, so the runtime URL resolves to
 * `dist/assets/highs.wasm` — but Vite has no built-in step that
 * copies the WASM file there. This plugin handles that explicitly.
 *
 * Source: `node_modules/@bubblyworld/highs-ts/build/highs.wasm`.
 * Destination: `<outDir>/assets/highs.wasm` (unhashed; the
 * emscripten wrapper's URL lookup requires the literal filename).
 *
 * Runs on `build` only. Dev mode resolves the WASM via Vite's
 * `node_modules` lookup automatically; tests use node's WASM loader
 * the same way.
 */
function copyHighsWasm(): Plugin {
  return {
    name: "copy-highs-wasm",
    apply: "build",
    writeBundle(options) {
      const srcWasm = path.resolve(
        __dirname,
        "node_modules/@bubblyworld/highs-ts/build/highs.wasm",
      );
      const outDir = options.dir ?? "dist";
      const destWasm = path.resolve(outDir, "assets/highs.wasm");
      if (!fs.existsSync(srcWasm)) {
        throw new 
```

### src\lib\aic-cascade.ts
```typescript
/**
 * Pure helpers for AIC tech-tree cascading.
 *
 * Behaviour contract for the menu UI (Step 1 of the AIC Plan feature):
 *
 *   - **`toggleNode` is strict.** Clicking a node whose prereqs are unmet
 *     is a no-op via `toggleNode`; this gates the Plan tab (`AicNodeRow`),
 *     where locked rows render disabled. Toggling OFF a node that's a
 *     prereq of other researched nodes also deactivates them (see
 *     `cascadeDeactivate`).
 *   - **Bulk "Activate all" actions cascade silently.** Activating a set of
 *     target nodes pulls in every transitive prereq via `cascadeActivate`.
 *     The UI surfaces the resulting count delta in a toast.
 *   - **The Limits cap-raise rows opt into per-row cascade-on-click.** They
 *     route an unresearched click through `activateNodes` (`cascadeActivate`)
 *     instead of `toggleNode`, so clicking a faded (prereq-unmet) row pulls
 *     its prereqs in rather than no-op'ing. Unchecking still uses
 *     `toggleNode` -> `cascadeDeactivate`.
 *   - **Default-unlocked nodes (`alreadyUnlocked: true`) cannot be
 *     deactivated.** `cascadeDeactivate` skips them.
 *
 * All helpers are deterministic and side-effect free; UI code wires them
 * to React state.
 */

import type { AicNode, AicTechId } from "@/types/aic";

/**
 * Index nodes by id for O(1) lookup.
 */
export function buildNodeIndex(
  nodes: readonly AicNode[],
): ReadonlyMap<AicTechId, AicNode> {
  return new Map(nodes.map((n) => [n.id, n]));
}

/**
 * Reverse adjacency
```

### src\lib\aic-research-helpers.ts
```typescript
/**
 * Pure derivation helpers backing `useDomainSettings` (and the AIC
 * sub-state it composes).
 *
 * Split out from the hook file so they can be unit-tested without a DOM
 * environment. The hook composes these with React state, memoisation, and
 * localStorage I/O.
 */

import { aicGroups, aicNodes, facilityBaseCaps, recipesByTech } from "@/data/aic-plans";
import type { AicGroupId, AicNode, AicTechId, FacilityBaseCap } from "@/types/aic";
import type { DomainId } from "@/types/domain";
import type { Facility, FacilityId, Recipe, RecipeId } from "@/types";
import { FacilityId as FacilityIdEnum } from "@/types/constants";

/**
 * Facilities the AIC tree gates via an `unlock` action node. Built once
 * at module load — anything in `FacilityId` NOT in this set is implicitly
 * always-unlocked (e.g. `xiranite_oven_1`, whose upstream unlock node is
 * an action-type-0 placeholder filtered out by `extract:aic`).
 */
export const GATED_FACILITIES: ReadonlySet<FacilityId> = (() => {
  const out = new Set<FacilityId>();
  for (const node of aicNodes) {
    if (node.action.kind !== "unlock") continue;
    out.add(node.action.facilityId);
    for (const extra of node.additionalFacilities) out.add(extra);
  }
  return out;
})();

/**
 * Facilities always available regardless of research, precomputed at
 * module load from the `FacilityId` enum.
 */
export const ALWAYS_UNLOCKED_FACILITIES: ReadonlySet<FacilityId> = (() => {
  const out = new Set<FacilityId>();
  for (const id of Obje
```

## Agent Configuration
### CLAUDE.md
# CLAUDE.md

Instructions for Claude Code in this repository. Deeper, file-scoped invariants live in `.claude/rules/` and load only when you touch matching files.

## Project

Endfield Calc is a production-chain calculator for *Arknights: Endfield* — single-page React + TypeScript, deployed to GitHub Pages at `/endfield-calc/`. Computes resource requirements, production ratios, and facility counts for potentially circular production loops.

## Commands

```bash
pnpm install                 # Install dependencies
pnpm dev                     # Dev server
pnpm run build               # tsc -b then Vite build
pnpm run lint                # ESLint
pnpm vitest run              # Run all Vitest tests
pnpm vitest run <path>       # Run a single test file
pnpm run knip                # Detect unused code/exports
pnpm run extract:all         # Run every extractor in dependency order (recommended)
pnpm run extract:ids         # Refresh src/types/constants.ts (Item/Recipe/FacilityId enums) + orphan-guard
pnpm run extract:facilities  # Refresh src/data/facilities.ts + public/locales/{lang}/facility.json
pnpm run extract:recipes     # Refresh src/data/recipes.ts + public/locales/{lang}/recipe.json
pnpm run extract:items       # Refresh src/data/items.ts + public/locales/{lang}/item.json
pnpm run extract:metastorage # Refresh src/data/metastorage.ts (TTV caps + per-item costs)
pnpm run extract:structures  # Refresh src/data/region-subsystems.ts + public/locales/{lang}/structure.json
pnpm r

## Analysis Method
> Factual code-based structural analysis. All data extracted directly from source files. No README. No assumptions.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `seo` · **Fit:** 41/100 · **Auto-apply:** False
- **Evidence:** `sitemap`, `robots`
- **All scores:** {'seosona-os': 41, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 33, 'seosona-flow': 0}
