# Magic UI & Bento Grid Patterns

Distilled from `magicui`, `prebuiltui`, and `typeui`.

## 1. Bento Grid Architecture

Bento Grid is a layout style inspired by Japanese Bento boxes, characterized by rounded rectangular or square cells packed tightly together to form a clean, dashboard-like interface.

- **Characteristics:** Cards sit adjacent to one another with minimal, uniform gaps (typically `gap-4` or `gap-6`).
- **Tailwind Implementation:**
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
    <div className="col-span-1 md:col-span-2 p-6 rounded-3xl bg-white shadow-sm border border-slate-100">...</div>
    <div className="col-span-1 p-6 rounded-3xl bg-blue-50">...</div>
    <div className="col-span-1 p-6 rounded-3xl bg-slate-50">...</div>
    <div className="col-span-1 md:col-span-2 p-6 rounded-3xl bg-white shadow-sm border border-slate-100">...</div>
  </div>
  ```

## 2. Magic UI Elements

UI components carrying the "Magic" aesthetic often feature the following effects:

- **Border Beam:** A continuously moving light beam tracing the border of a card.
- **Animated Shiny Text:** Text featuring a horizontal light sweep (Shimmer effect) similar to Apple's design language. Best used for Taglines or new feature announcements.
- **Marquee:** A continuous scrolling text or logo banner. Often used for client logos or testimonials. Must rely on CSS Animations rather than JS to prevent performance bottlenecks.
- **Retro Grid & Dot Backgrounds:** Subtle grid lines or dotted patterns that impart a technical yet refined aesthetic to the background.

## 3. TypeUI & Prebuilt Components

When constructing prebuilt UI components:
- Prioritize reusability by passing `className` through the `cn` utility (Tailwind Merge + Clsx) to allow parent components to override styles safely.
- Leverage Radix UI or similar Headless UI primitives to ensure full Accessibility (a11y) compliance before applying Tailwind classes.
