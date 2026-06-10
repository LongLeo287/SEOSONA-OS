# Tailwind Motion Design

CSS transitions and micro-interaction restrictions.

## 1. Snappy Timing
* Standardize transitions: `duration-200` with `ease-in-out`.
* Active click state: apply scale transforms (e.g., `scale-[0.98]`) for tactile feedback.

## 2. Hardware Acceleration
* Always specify animated attributes (avoid `transition-all` on large nodes).
* Add `will-change-transform` or `will-change-opacity` to prevent lag.
