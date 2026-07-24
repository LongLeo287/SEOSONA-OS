# Anime.js Documentation Snapshot

Date: 2026-06-13

Source: official Anime.js documentation at `https://animejs.com/documentation/getting-started/`

## Why This Source Matters

Anime.js 4.x is a compact JavaScript animation engine that covers imperative UI motion, timelines, scroll-triggered playback, SVG animation, text effects, draggable interactions, layout transitions, utilities, easing systems, WAAPI-powered animations, and engine-level scheduling. It is useful for SEOSONA frontend agents when a UI needs refined interaction without introducing a large motion framework.

The documentation is organized as a practical API map rather than a tutorial-only site, which makes it suitable for skill ingestion. The most important pattern is that Anime.js offers one consistent mental model across timers, animations, timelines, scroll observers, scopes, and utilities: create an instance, configure parameters, control lifecycle methods, and clean up through `revert()` where possible.

## Source Coverage

| Area | Official URL | Operational Value |
| --- | --- | --- |
| Getting started | `https://animejs.com/documentation/getting-started/` | Entry point, migration pointer, install/import/use sections. |
| Installation | `https://animejs.com/documentation/getting-started/installation/` | NPM, CDN, UMD, and direct download options. |
| React usage | `https://animejs.com/documentation/getting-started/using-with-react/` | Uses `createScope()` inside `useEffect()` with cleanup through `scope.revert()`. |
| Timer | `https://animejs.com/documentation/timer/` | Timed callbacks synchronized with Anime.js engine; alternative to ad hoc `setTimeout()` and `setInterval()`. |
| Animation | `https://animejs.com/documentation/animation/` | Core `animate(targets, parameters)` API for DOM, object, CSS, attribute, SVG, keyframe, and callback motion. |
| Timeline | `https://animejs.com/documentation/timeline/` | Sequences animations, timers, labels, callbacks, timelines, and WAAPI animations. |
| Animatable | `https://animejs.com/documentation/animatable/` | Efficient property setters/getters for frequently changing values such as cursor-following or loop-driven values. |
| Draggable | `https://animejs.com/documentation/draggable/` | Pointer drag interactions with container constraints, snap, release physics, and lifecycle callbacks. |
| Layout | `https://animejs.com/documentation/layout/` | Auto-layout transitions between hard-to-animate DOM states such as display, grid, flex, order, enter, and exit. |
| Scope | `https://animejs.com/documentation/scope/` | Component scoping, media-query awareness, defaults sharing, method registration, refresh, and batch cleanup. |
| onScroll | `https://animejs.com/documentation/events/onscroll/` | ScrollObserver for triggering and synchronizing timer, animation, and timeline instances on scroll. |
| SVG | `https://animejs.com/documentation/svg/` | SVG helpers for morphing, drawable line animation, and motion paths. |
| Text | `https://animejs.com/documentation/text/` | Text splitting and scramble effects for typographic motion. |
| Utilities | `https://animejs.com/documentation/utilities/` | Staggering, selection, set/get, cleanup, sync, seeded randomness, clamp, snap, map, damp, and chain utilities. |
| Easings | `https://animejs.com/documentation/easings/` | Built-in eases, cubic Bezier, linear, steps, irregular, and spring functions. |
| WAAPI | `https://animejs.com/documentation/web-animation-api/` | Lightweight `waapi.animate()` API backed by Web Animations API. |
| Engine | `https://animejs.com/documentation/engine/` | Global scheduler for animations, timers, timelines, priority, time unit, speed, fps, precision, pause/resume. |

## Core Mental Model

1. Choose the smallest motion primitive.
   - Use `utils.set()` for immediate state.
   - Use `animate()` for ordinary property motion.
   - Use `createTimeline()` when multiple actions need sequence, labels, relative positions, or shared defaults.
   - Use `createTimer()` when the animation engine should own repeated callbacks.
   - Use `createAnimatable()` when values update frequently.
   - Use `waapi.animate()` for simpler transform/opacity-heavy motion that should remain lightweight.

2. Keep lifecycle explicit.
   - Prefer storing returned instances.
   - Use instance methods such as `play()`, `pause()`, `restart()`, `seek()`, `complete()`, `cancel()`, `reset()`, `refresh()`, and `revert()` when the UI state changes.
   - In component frameworks, scope animations and call `revert()` during teardown.

3. Treat motion as stateful UI behavior.
   - Anime.js is not only decorative animation; it handles drag, scroll sync, layout changes, typography, SVG state, callbacks, and global timing.
   - Motion should be paired with user intent, accessibility, and cleanup.

## API Surface Summary

### Installation And Imports

- NPM install uses `animejs`.
- Main module imports support named imports such as `animate`, `createTimeline`, `createScope`, `createDraggable`, `stagger`, `spring`, `waapi`, and utilities.
- Standalone subpaths exist for narrower imports such as `animejs/animation`, `animejs/timeline`, `animejs/timer`, `animejs/draggable`, `animejs/scope`, `animejs/svg`, `animejs/text`, `animejs/utils`, and `animejs/waapi`.
- CDN and UMD modes are supported, but SEOSONA production frontend agents should prefer package-manager installs inside build-based apps.

### Animation

`animate(targets, parameters)` is the standard API for animating target property values. Targets may include selectors, DOM elements, JavaScript objects, or arrays. Animatable properties include CSS properties, CSS transforms, CSS variables, object properties, HTML attributes, and SVG attributes. Tween value types include numbers, units, relative values, colors, CSS variables, and function-based values.

Operational guidance:

- Prefer transforms and opacity for high-frequency visual motion.
- Use keyframes when a property needs multiple steps.
- Use function-based values when values depend on target index or runtime state.
- Use callbacks for UI synchronization, not for heavy work inside every frame.
- Use `modifier` for constrained or formatted output values.

### Timeline

`createTimeline(parameters)` synchronizes animations, timers, callbacks, labels, WAAPI animations, and nested timelines. A timeline can add animations or timers, call functions, label positions, sync other timelines, and use relative time positions.

Operational guidance:

- Use timeline defaults for shared duration, ease, and delay.
- Use labels for named semantic beats, not only raw offsets.
- Use relative positions for overlap and choreography.
- Keep long timelines inspectable by grouping related steps.

### Timer

`createTimer(parameters)` schedules timed callbacks on the Anime.js engine. It is useful when callbacks must remain aligned with animation playback, loop state, frame rate, or engine speed.

Operational guidance:

- Prefer timers over `setInterval()` when visual playback and callback cadence must stay aligned.
- Use `frameRate` to reduce callback frequency for UI counters or logs.
- Clean up timers when component scope ends.

### Animatable

`createAnimatable(targets, parameters)` creates efficient property functions that can get current values and animate to new values. It is ideal for pointer movement, cursor-following, continuous input, and animation loops where calling `animate()` repeatedly would be wasteful.

Operational guidance:

- Use for hot paths and pointer interactions.
- Restrict property calls to numbers or numeric arrays.
- Recompute bounds on resize or scroll before mapping pointer values.

### Draggable

`createDraggable(target, parameters)` adds draggable behavior to DOM elements. It supports axes, snap, modifiers, map-to behavior, trigger/container settings, friction, release mass/stiffness/damping, velocity limits, drag thresholds, scroll thresholds, cursors, lifecycle callbacks, and methods such as enable, disable, setX, setY, animateInView, scrollInView, stop, reset, revert, and refresh.

Operational guidance:

- Use container constraints for bounded UI elements.
- Use snap for grids, cards, knobs, and controls.
- Use release physics sparingly for polished tactile feel.
- Call `refresh()` when container or target geometry changes.

### Layout

`createLayout(root, parameters)` animates between layout states, including display, flex direction, grid settings, DOM order, enter/exit, parent swaps, and modal/dialog states. It records old and new states, then animates the difference.

Operational guidance:

- Use `layout.update(cb)` for most UI changes because it wraps recording and mutation together.
- Keep layout roots narrow so measuring and animation remain predictable.
- Use staggered layout delay when multiple child elements move.
- Check common gotchas around display, DOM order, and dynamic content.

### Scope

`createScope(parameters)` groups instances under a root, shares defaults, reacts to media queries, registers methods, keeps time, refreshes, and reverts in batch. It is the preferred integration point for React and other component frameworks.

Operational guidance:

- In React, create a scope in `useEffect()`, pass a root ref, register methods through `self.add()`, and return `scope.current.revert()`.
- Use media queries such as `prefers-reduced-motion` to change or disable motion.
- Keep selectors local to the root to avoid cross-component leakage.

### ScrollObserver

`onScroll(parameters)` triggers or synchronizes timers, animations, and timelines on scroll. It can be passed to `autoplay`, can use a container/target/debug/axis/repeat settings, supports thresholds, method-name sync, playback progress sync, smooth/eased scroll modes, callbacks, and lifecycle methods.

Operational guidance:

- Use `debug` during implementation and remove or disable it for production.
- Choose threshold semantics before writing motion code.
- Prefer progress-sync scroll animation only when users can still read content comfortably.

### SVG

The SVG API includes `morphTo`, `createDrawable`, and `createMotionPath`. These help with morphing shapes, drawing lines, and moving elements along SVG paths.

Operational guidance:

- Use SVG motion for diagrams, product hero accents, progress paths, icon transitions, and illustrative UI.
- Keep SVG dimensions and viewBox stable.
- Test reduced-motion alternatives for long path or morph sequences.

### Text

The text API includes `splitText` and `scrambleText`. `splitText` can split lines, words, and characters, preserve accessibility, include spaces, use custom classes/wrappers/clones/templates, add effects, refresh, and revert. `scrambleText` supports text replacement, character sets, cursor, reveal and settle behavior, delay, duration, perturbation, direction, seed, and change callbacks.

Operational guidance:

- Use split text for hero typography, counters, reveal sequences, and editorial transitions.
- Use `addEffect()` when line splitting depends on font loading or resize.
- Keep `accessible` enabled unless a strong reason exists.
- Avoid excessive per-character animation in long prose.

### Utilities

Utilities cover stagger, query helpers, get/set, inline style cleanup, remove, sync, keepTime, random, seeded random, randomPick, shuffle, round, clamp, snap, wrap, mapRange, lerp, damp, padding helpers, angle conversion, and chainable utilities.

Operational guidance:

- Use `stagger()` for multi-target timing and value distribution.
- Use `createSeededRandom()` when the same generative motion must be reproducible.
- Use `clamp`, `snap`, `mapRange`, `lerp`, and `damp` for interaction mapping and smoothing.
- Use `cleanInlineStyles()` or `revert()` to avoid stale inline CSS.

### Easings

Easing options include built-in eases, cubic Bezier, linear, steps, irregular, and spring. Easing functions apply to `ease`, `playbackEase`, and stagger easing.

Operational guidance:

- Use simple ease strings for routine UI.
- Use spring for tactile release, drag, button, or small component response.
- Use cubic Bezier when matching a brand-specific motion curve.
- Avoid over-bouncy motion in dense operational dashboards.

### WAAPI

`waapi.animate(targets, parameters)` offers a smaller Web Animations API-backed alternative for many common animation needs. Anime.js improves the native WAAPI ergonomics through sensible defaults, multi-target animation, default units, function-based values, individual transforms, individual property params, and spring/custom easing support.

Operational guidance:

- Prefer WAAPI for lightweight transform/opacity motion when the API surface is enough.
- Use standard `animate()` when JS-only features, richer callbacks, or Anime.js-specific lifecycle behavior is required.
- Know API differences such as iterations, direction, easing, finished behavior, and ease conversion.

### Engine

The engine drives and synchronizes animation, timer, and timeline instances. It exposes global parameters such as time unit, speed, fps, precision, pause-on-hidden behavior, update, pause, resume, properties, and defaults. Execution order follows instance addition order unless controlled with priority.

Operational guidance:

- Use priority only when tick order matters.
- Avoid global engine changes inside reusable components unless scoped and documented.
- Consider pause-on-hidden behavior for performance and predictable tab restoration.

## SEOSONA Integration Patterns

### Pattern 1: Component-Safe React Motion

Use `createScope({ root })` inside `useEffect()`, declare all instances inside `.add()`, register external methods with `self.add()`, and return `scope.current.revert()`. This prevents orphaned animations after unmount and keeps selectors scoped.

### Pattern 2: Scroll-Activated Editorial Blocks

Use `onScroll()` as the `autoplay` value for motion that should trigger when a section enters view. Combine with simple transforms, opacity, and clear thresholds. Use `debug` only while implementing.

### Pattern 3: Rich Data/SEO UI Motion

Use `createTimeline()` for KPI reveals, chart sequencing, or report transitions. Use `stagger()` for repeated metric cards. Keep motion under 300-800ms for utility interfaces.

### Pattern 4: Interactive Tool Surfaces

Use `createAnimatable()` for pointer-following previews, cursor smoothing, knobs, sliders, and visual inspectors. Use `createDraggable()` for drag handles, reorderable cards, and physics-backed control surfaces.

### Pattern 5: SVG Knowledge Diagrams

Use SVG helpers for path drawing, motion paths, and morphing in explainers and architecture diagrams. Pair with the `html-artifact-design` skill when creating standalone visual artifacts.

### Pattern 6: Text Motion For Hero And Content Hooks

Use `splitText()` and `scrambleText()` for short display text, hero headlines, campaign pages, and interactive visual explainers. Avoid heavy text animation in long article bodies.

## Guardrails

- Respect `prefers-reduced-motion`; use `createScope()` media queries or app-level motion settings.
- Avoid animating layout-heavy properties continuously; prefer transforms where possible.
- Do not leave animations running after unmount.
- Do not rely on global selectors inside component trees.
- Do not use scroll-driven motion that blocks reading or creates motion sickness.
- Keep motion purposeful: clarify state, continuity, affordance, hierarchy, or delight.

## Candidate Skill Upgrade

Create `frontend_engineering/animejs_motion_orchestration` as a SEOSONA skill for building frontend motion with Anime.js, choosing between `animate`, `createTimeline`, `createScope`, `createDraggable`, `createLayout`, `onScroll`, SVG/text helpers, utilities, easings, WAAPI, and engine controls.
