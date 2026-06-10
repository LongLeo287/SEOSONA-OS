# Core Web Vitals Remediation

## LCP (Largest Contentful Paint) - Target < 2.5s

### Common Causes
- Large unoptimized images
- Slow server response time (TTFB)
- Render-blocking CSS/JS
- Client-side rendering delays

### Fixes

**1. Image Optimization**
```html
<!-- Before -->
<img src="hero.jpg" alt="Hero">

<!-- After -->
<img
  src="hero.webp"
  alt="Hero"
  width="1200"
  height="600"
  loading="eager"
  fetchpriority="high"
>
```

**2. Preload Critical Assets**
```html
<head>
  <!-- Preload LCP image -->
  <link rel="preload" as="image" href="hero.webp" fetchpriority="high">

  <!-- Preload critical fonts -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

**3. Optimize Server Response (TTFB)**
```javascript
// Use CDN for static assets
// Enable HTTP/2 or HTTP/3
// Implement caching headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  next();
});
```

**4. Remove Render-Blocking Resources**
```html
<!-- Defer non-critical CSS -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>

<!-- Defer JavaScript -->
<script src="app.js" defer></script>
```

**5. Lazy Load Below-Fold Images**
```html
<img
  src="placeholder.jpg"
  data-src="full-image.webp"
  loading="lazy"
  alt="Description"
>
```

## FID/INP (Interaction to Next Paint) - Target < 200ms

### Common Causes
- Heavy JavaScript execution
- Long tasks (>50ms)
- Event handler delays
- Third-party scripts

### Fixes

**1. Code Splitting**
```javascript
// Before: Large bundle
import { heavyFunction } from './heavy-module';

// After: Dynamic import
const handleClick = async () => {
  const { heavyFunction } = await import('./heavy-module');
  heavyFunction();
};
```

**2. Debounce Input Handlers**
```javascript
// Debounce search input
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

input.addEventListener('input', debounce(handleSearch, 300));
```

**3. Use Web Workers for Heavy Tasks**
```javascript
// worker.js
self.addEventListener('message', (e) => {
  const result = heavyComputation(e.data);
  self.postMessage(result);
});

// main.js
const worker = new Worker('worker.js');
worker.postMessage(data);
worker.addEventListener('message', (e) => console.log(e.data));
```

**4. Optimize Event Handlers**
```javascript
// Use passive listeners for scroll/touch
window.addEventListener('scroll', handleScroll, { passive: true });

// Use event delegation
container.addEventListener('click', (e) => {
  if (e.target.matches('.button')) handleClick(e);
});
```

**5. Minimize Third-Party Scripts**
```html
<!-- Load third-party scripts async -->
<script src="analytics.js" async></script>

<!-- Use facade pattern for heavy embeds -->
<div class="youtube-facade" data-video-id="xyz">
  <img src="thumbnail.jpg" alt="Video">
  <button>Play</button>
</div>
```

## CLS (Cumulative Layout Shift) - Target < 0.1

### Common Causes
- Images without dimensions
- Ads/embeds without reserved space
- Web fonts causing FOIT/FOUT
- Dynamically injected content

### Fixes

**1. Set Image Dimensions**
```html
<!-- Always specify width/height -->
<img
  src="image.jpg"
  width="800"
  height="600"
  alt="Description"
>

<!-- Or use aspect-ratio in CSS -->
<style>
.image-container {
  aspect-ratio: 16 / 9;
}
</style>
```

**2. Reserve Space for Ads/Embeds**
```css
.ad-container {
  min-height: 250px; /* Reserve space */
  background: #f0f0f0;
}

.embed-container {
  aspect-ratio: 16 / 9;
  position: relative;
}
```

**3. Optimize Font Loading**
```css
/* Use font-display: swap */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  font-display: swap; /* Prevent invisible text */
}

/* Or use fallback font metrics */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
  size-adjust: 100%;
  ascent-override: 90%;
  descent-override: 22%;
}
```

**4. Avoid Injecting Content Above Existing**
```javascript
// Bad: Prepends content
container.prepend(newElement);

// Good: Append or use placeholder
container.append(newElement);

// Or reserve space with skeleton
<div class="skeleton" style="height: 200px;"></div>
```

**5. Use CSS Transforms for Animations**
```css
/* Bad: Triggers layout shift */
.element {
  animation: slide 0.3s ease;
}
@keyframes slide {
  from { margin-left: 0; }
  to { margin-left: 100px; }
}

/* Good: Uses transform */
.element {
  animation: slide 0.3s ease;
}
@keyframes slide {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

## Testing Tools

### API-Based (PageSpeed Insights)

```bash
node scripts/audit-core-web-vitals.cjs -u https://example.com
```

### Browser-Based (chrome-devtools skill)

```bash
cd .opencode/skills/chrome-devtools/scripts

# Real browser CWV
node performance.js --url https://example.com | jq '.vitals'

# With trace for debugging
node performance.js --url https://example.com --trace trace.json
```

See: `browser-seo-audit-workflow.md` for full workflow.

### In-App Monitoring

```javascript
import {onLCP, onINP, onCLS} from 'web-vitals';
onLCP(console.log);
onINP(console.log);
onCLS(console.log);
```

## Quick Wins Checklist

- [ ] Add width/height to all images
- [ ] Preload LCP image with fetchpriority="high"
- [ ] Use font-display: swap for web fonts
- [ ] Defer non-critical JavaScript
- [ ] Lazy load below-fold images
- [ ] Minify CSS/JS
- [ ] Enable compression (gzip/brotli)
- [ ] Use CDN for static assets
- [ ] Reserve space for ads/embeds
- [ ] Remove unused CSS/JS
