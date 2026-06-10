# Mobile SEO Checklist

Google uses **mobile-first indexing** (2025). Mobile version is primary for ranking.

## Viewport Configuration

### Required Meta Tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Rules:**
- Place in `<head>`
- Don't use `maximum-scale` or `user-scalable=no` (accessibility issue)
- Test on real devices

### Common Mistakes
```html
<!-- ❌ BAD: Fixed width -->
<meta name="viewport" content="width=600">

<!-- ❌ BAD: Disables zoom -->
<meta name="viewport" content="width=device-width, user-scalable=no">

<!-- ✅ GOOD -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

## Responsive Design

### CSS Media Queries
```css
/* Mobile-first approach */
.container {
  width: 100%;
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}
```

### Flexible Images
```css
img {
  max-width: 100%;
  height: auto;
}

/* Or use object-fit for fixed containers */
.image-container img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
```

### Responsive Typography
```css
/* Minimum 16px for body text (prevents zoom on iOS) */
body {
  font-size: 16px;
  line-height: 1.5;
}

/* Use rem for scalability */
h1 {
  font-size: 2rem; /* 32px */
}

/* Responsive headings */
h1 {
  font-size: clamp(1.5rem, 4vw, 3rem);
}
```

## Touch-Friendly Elements

### Minimum Touch Target Size
**48x48px minimum** (Apple/Google recommendation)

```css
/* Buttons */
.button {
  min-width: 48px;
  min-height: 48px;
  padding: 12px 24px;
}

/* Links in paragraphs */
a {
  padding: 8px 4px;
  margin: -8px -4px;
}

/* Nav links */
nav a {
  display: block;
  padding: 16px;
  min-height: 48px;
}
```

### Touch Target Spacing
```css
/* 8px minimum spacing between tappable elements */
.button-group button {
  margin: 8px;
}

/* Mobile nav */
.mobile-nav li {
  margin-bottom: 8px;
}
```

### Forms
```html
<!-- Large input fields -->
<style>
input, textarea, select {
  min-height: 48px;
  font-size: 16px; /* Prevents iOS zoom */
  padding: 12px;
}

/* Radio/checkbox */
input[type="radio"],
input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 14px; /* Creates 48px hit area */
}
</style>

<form>
  <label for="email">Email</label>
  <input type="email" id="email" placeholder="you@example.com">

  <label for="message">Message</label>
  <textarea id="message" rows="5"></textarea>

  <button type="submit">Send</button>
</form>
```

### Prevent Accidental Clicks
```css
/* Add spacing to close buttons */
.modal-close {
  position: absolute;
  top: 8px;
  right: 8px;
  min-width: 48px;
  min-height: 48px;
}

/* Dropdown menus */
.dropdown-item {
  padding: 16px;
  display: block;
}
```

## Mobile Page Speed

### Optimize Images
```html
<!-- Use responsive images -->
<img
  srcset="
    image-320w.webp 320w,
    image-640w.webp 640w,
    image-1024w.webp 1024w
  "
  sizes="(max-width: 640px) 100vw, 640px"
  src="image-640w.webp"
  alt="Description"
  loading="lazy"
  width="640"
  height="480"
>
```

### Defer Offscreen Images
```html
<img src="above-fold.jpg" loading="eager" alt="Hero">
<img src="below-fold.jpg" loading="lazy" alt="Content">
```

### Minimize JavaScript
```html
<!-- Load critical JS inline -->
<script>
  // Critical above-fold code
</script>

<!-- Defer non-critical JS -->
<script src="analytics.js" defer></script>
<script src="chat-widget.js" async></script>
```

### CSS Optimization
```html
<!-- Critical CSS inline -->
<style>
  /* Above-fold styles */
  body { margin: 0; font-family: sans-serif; }
  .header { background: #333; color: white; }
</style>

<!-- Load full CSS async -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

## Content Parity

Mobile and desktop versions must have **same content**.

### ✅ Good: Same Content
```html
<!-- Mobile & Desktop -->
<article>
  <h1>Article Title</h1>
  <p>Full article text...</p>
  <img src="image.jpg" alt="Image">
</article>
```

### ❌ Bad: Hidden Mobile Content
```html
<!-- Mobile: Hides content -->
<div class="desktop-only">
  <p>Important content only on desktop</p>
</div>

<style>
@media (max-width: 768px) {
  .desktop-only { display: none; }
}
</style>
```

**Fix:** Use same content, adjust layout only.

### Acceptable Layout Differences
```css
/* OK: Different layouts */
@media (max-width: 768px) {
  .sidebar {
    order: 2; /* Move sidebar below content */
  }

  .grid {
    grid-template-columns: 1fr; /* Single column */
  }
}
```

## Mobile Navigation

### Hamburger Menu
```html
<button class="menu-toggle" aria-label="Open menu">
  ☰
</button>

<nav class="mobile-nav" hidden>
  <a href="/">Home</a>
  <a href="/products">Products</a>
  <a href="/about">About</a>
</nav>

<style>
.menu-toggle {
  min-width: 48px;
  min-height: 48px;
  font-size: 24px;
}

.mobile-nav a {
  display: block;
  padding: 16px;
  font-size: 18px;
}
</style>
```

### Sticky Navigation
```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
}
```

## Mobile-Specific Features

### Phone Number Links
```html
<!-- Tappable phone numbers -->
<a href="tel:+12125550123">(212) 555-0123</a>

<!-- Email -->
<a href="mailto:hello@example.com">hello@example.com</a>

<!-- SMS -->
<a href="sms:+12125550123">Text us</a>
```

### App Deep Links
```html
<!-- Open in app if installed, fallback to web -->
<a href="myapp://product/123" onclick="window.location.href='https://example.com/product/123'; return false;">
  View in App
</a>
```

### Geolocation
```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position.coords.latitude, position.coords.longitude);
  });
}
```

## AMP Considerations (2025 Update)

**AMP is less critical in 2025.** Google no longer requires AMP for Top Stories.

### When to Use AMP
- High-traffic news sites
- Ad-heavy content
- Need extreme speed

### When to Skip AMP
- Already fast (Core Web Vitals pass)
- Complex interactivity
- Limited dev resources

**Better alternative:** Focus on Core Web Vitals optimization.

## Testing

### Chrome DevTools
```bash
# Open DevTools
# 1. Toggle device toolbar (Cmd+Shift+M)
# 2. Select device (iPhone, Pixel, etc.)
# 3. Test touch events, viewport, fonts
```

### Lighthouse Mobile Audit
```bash
npx lighthouse https://example.com --preset=mobile --view
```

### Real Device Testing
- Test on actual iOS/Android devices
- Use BrowserStack/Sauce Labs for cross-device testing
- Check different screen sizes (phone, tablet)

### Mobile-Friendly Test
```
https://search.google.com/test/mobile-friendly
```

### Google Search Console
- Check "Mobile Usability" report
- Fix reported issues (text too small, viewport not set, etc.)

## Common Issues & Fixes

### Issue: Small Text
```css
/* ❌ BAD: Text < 16px */
body { font-size: 12px; }

/* ✅ GOOD: 16px minimum */
body { font-size: 16px; }
```

### Issue: Horizontal Scroll
```css
/* ❌ BAD: Fixed widths */
.container { width: 1200px; }

/* ✅ GOOD: Max-width */
.container {
  max-width: 1200px;
  width: 100%;
  padding: 0 16px;
}

/* Prevent overflow */
img, iframe, video {
  max-width: 100%;
}
```

### Issue: Slow Loading
```html
<!-- Use next-gen formats -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Fallback">
</picture>

<!-- Lazy load -->
<img src="image.jpg" loading="lazy" alt="Description">
```

### Issue: Pop-ups Blocking Content
```css
/* Don't use aggressive pop-ups on mobile */
/* Wait 3+ seconds, make dismissible, don't cover content */
.popup {
  max-width: 90vw;
}

.popup-close {
  min-width: 48px;
  min-height: 48px;
}
```

## Mobile SEO Checklist

- [ ] Viewport meta tag set correctly
- [ ] Responsive design (single URL, not m.site.com)
- [ ] Font size ≥ 16px for body text
- [ ] Touch targets ≥ 48x48px
- [ ] Touch targets spaced ≥ 8px apart
- [ ] No horizontal scroll
- [ ] Images responsive (max-width: 100%)
- [ ] Forms easy to fill on mobile
- [ ] Content parity (mobile = desktop content)
- [ ] Mobile page speed < 3s (LCP < 2.5s)
- [ ] No intrusive interstitials/pop-ups
- [ ] Phone/email links tappable
- [ ] Navigation accessible (hamburger menu)
- [ ] Sticky elements don't block content
- [ ] Tested on real devices
- [ ] Passes Mobile-Friendly Test
- [ ] No mobile usability issues in Search Console
- [ ] Core Web Vitals pass on mobile
- [ ] PWA features (optional: manifest, service worker)

## Code Example: Complete Mobile-First Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mobile-First Page</title>

  <style>
    /* Mobile-first styles */
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 16px;
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 16px;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    button, a.button {
      min-width: 48px;
      min-height: 48px;
      padding: 12px 24px;
      font-size: 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    input, textarea {
      width: 100%;
      min-height: 48px;
      font-size: 16px;
      padding: 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    /* Tablet */
    @media (min-width: 768px) {
      .container {
        padding: 24px;
      }
    }

    /* Desktop */
    @media (min-width: 1024px) {
      .container {
        padding: 32px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Mobile-First Page</h1>
    <p>Content that works on all devices.</p>

    <img src="image.jpg" alt="Responsive image" loading="lazy" width="800" height="600">

    <button>Tap Me</button>

    <p>Call us: <a href="tel:+12125550123">(212) 555-0123</a></p>
  </div>
</body>
</html>
```

## Resources

- Mobile-Friendly Test: search.google.com/test/mobile-friendly
- Google Search Console Mobile Usability Report
- Lighthouse Mobile Audit (Chrome DevTools)
- PageSpeed Insights: pagespeed.web.dev
