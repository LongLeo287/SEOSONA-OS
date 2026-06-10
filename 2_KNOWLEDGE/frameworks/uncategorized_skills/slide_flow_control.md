# Slide Flow Control (Callbacks)

The `slide` package is an older flow control library that provides simple, consistent conventions for handling callbacks and asynchronous operations.

## Core Concepts
- **Callbacks**: Simple responders. The first argument is always reserved for errors (`er`), because they must always be prepared to handle errors.
- **Actors**: Functions that take action. The last argument is always a callback. They must not throw exceptions; instead, they pass errors to the callback.
  - E.g., `return cb(null, x)` instead of `return x`
  - E.g., `return cb(er)` instead of `throw er`

## Common Patterns
1. **asyncMap**: Useful for mapping over an array asynchronously in parallel, returning all results when complete. E.g., fetching 10 URLs in parallel.
2. **chain**: Used for doing a bunch of things sequentially. If any step fails, the chain stops. It avoids deeply nested inline callbacks ("callback hell"). Results can be tracked via `chain.first` and `chain.last`.
