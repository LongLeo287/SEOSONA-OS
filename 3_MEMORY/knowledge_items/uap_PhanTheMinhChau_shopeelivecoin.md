# KI: PhanTheMinhChau/shopeelivecoin

## Overview
This project appears to be a web application displaying live shopping events, likely for Shopee. The application fetches data from a Google Script API and dynamically renders cards with event information including shop name, coin rewards, countdown timers, and links to the live streams.  The `zalo.js` file suggests integration or monitoring related to Zalo messaging platform.

## Tech Stack (from code)
- **JavaScript:** The primary language used for all `.js` files (`script.js`, `scripttui.js`, `middleware.js`, `zalo.js`).
- **HTML:** Used for structuring the web pages (`index.html`, `ad.html`, etc.).
- **CSS:**  Used for styling the application (`style.css`, `base.css`, etc.).
- **Node.js (implied):** The presence of a `package.json` file indicates usage with Node.js and npm package management.
- **Vercel Edge Functions:** The `middleware.js` file imports from `@vercel/edge`, indicating the use of Vercel's edge functions for middleware.

```file:package.json
{
  "private": true,
  "dependencies": {
    "@vercel/edge": "^0.1.2"
  }
}
```

## Public API / Exports
The code does not explicitly define public APIs or exports in a traditional module sense. However, the following functions are defined and used within the JavaScript files:

- `middleware(req)` (in `middleware.js`): This function appears to be middleware for Vercel Edge Functions, setting HTTP headers.
- `formatCountdown(timeDifference)` (in `script.js` and `scripttui.js`):  Formats a time difference into a human-readable countdown string.
- `fetchData()` (in `script.js` and `scripttui.js`): Fetches data from the Google Script API and updates the UI.
- `updateCountdowns()` (in `script.js` and `scripttui.js`): Updates the countdown timers on the displayed cards.
- `zlog(msg)` (in `zalo.js`):  Logs messages to a panel within the application, likely for debugging or monitoring.

## Dependencies
Based on `package.json`:

- `@vercel/edge`: Version 0.1.2. This is used for Vercel Edge Functions.

```file:package.json
{
  "private": true,
  "dependencies": {
    "@vercel/edge": "^0.1.2"
  }
}
```

## Architecture Patterns
- **Fetch and Render:** The application follows a fetch-and-render pattern. Data is fetched from an external API (Google Script), processed, and then dynamically rendered into the HTML DOM. This is evident in `script.js` and `scripttui.js`.
- **Modular JavaScript (limited):** While not strictly modular, the code separates concerns with different `.js` files for specific functionalities (e.g., `middleware.js`, `script.js`, `zalo.js`).
- **Event-Driven Updates:** The countdown timers are updated periodically using `setInterval`, demonstrating an event-driven approach to updating the UI.

## Relevance to SEOSONA OS
This project's code could benefit SEOSONA OS in several ways:

- **Live Event Display Component:**  The core functionality of displaying live shopping events with countdown timers and shop information can be adapted as a reusable component within SEOSONA OS. This would allow for integration of live commerce features into the platform.
- **API Integration Patterns:** The code demonstrates how to fetch data from external APIs (Google Script in this case) and dynamically update a UI.  These patterns could be applied to integrate with other services or data sources within SEOSONA OS.
- **Zalo Integration Insights:** The `zalo.js` file provides insights into potential integration strategies with Zalo, which could be valuable for expanding SEOSONA OS's reach and functionality in regions where Zalo is popular.  The logging mechanism implemented in this file could also serve as a template for debugging or monitoring purposes within the platform.


## UAP Routing (auto-classified)
- **System:** `seosona-os` · **Function:** `reference` · **Fit:** 0/100 · **Auto-apply:** False
- **Evidence:** none (kept as reference)
- **All scores:** {'seosona-os': 0, 'seosona-video': 0, 'seosona-content': 0, 'seosona-ux-ui': 0, 'seosona-flow': 0}
