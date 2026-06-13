# Animation & Micro-Interactions

Synthesized knowledge from `anime.js` and `pattern-craft`.

## 1. Principles of Natural Motion

Motion in UI design should never be entirely linear, as nothing in the physical world starts or stops instantaneously.
- **Easing (Acceleration/Deceleration):** Always employ Easing Curves. It is recommended to use `ease-out` for entering objects (start fast, end slow) and `ease-in` for exiting objects.
- **Spring Physics:** Utilize spring physics to create a more organic feel than traditional easing by simulating mass, friction, and tension. This is particularly effective for Popups, Modals, and Drag-and-Drop interfaces.

## 2. Micro-Interactions

Micro-interactions are subtle feedback mechanisms that spark user "Delight."
- **Buttons:** Upon hover, in addition to a color transition, incorporate a smooth, slight translation (e.g., `translate-y-[-2px]`) or a deeper shadow. Upon click (active state), the button should feel "pressed" into the surface (e.g., `scale-95`).
- **Immediate Feedback:** Any user action (touch, swipe, click) must trigger an immediate visual response (under 100ms).

## 3. Staggering Animations

When animating a list or grid of elements (such as Menu items or Cards), avoid revealing them simultaneously. Instead, employ Staggering.
- **Stagger:** Each element appears with a slight delay relative to the preceding element (e.g., 50ms). This creates a smooth "wave" or "flow" effect, effortlessly guiding the user's eye downwards.
- *Anime.js Syntax Example:* `anime({ targets: '.list-item', opacity: 1, translateY: 0, delay: anime.stagger(100) })`

## 4. Performance Optimization

- **The Golden Rule:** Only animate two CSS properties: `transform` (translate, scale, rotate) and `opacity`. NEVER animate properties that trigger Layout Thrashing, such as `width`, `height`, `margin`, `padding`, `top`, or `left`.
- **Hardware Acceleration:** Enable hardware acceleration by adding `will-change-transform` or using `translate3d(0,0,0)` on heavily animated elements to offload work to the GPU.
